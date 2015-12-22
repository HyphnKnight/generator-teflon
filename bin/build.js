'use strict';

const

	/* Custom Modules */

	glob		= require( './_glob.js' ),
	postcss		= require( './_postcss.js' ),
	sass		= require( './_sass.js' ),
	babel		= require( './_babel.js' ),
	jshint		= require( './_jshint.js' ),
	vulcanize	= require( './_vulcanize.js' ),
	uglifyjs	= require( './_uglifyjs.js' ),
	cleanCSS	= require( './_cleanCSS.js' ),



	/* Build Modules */

	rsvp	= require('rsvp'),
	log		= require('log'),
	_		= require('underscore'),
	express	= require ( 'express' ),
	path	= require( 'path' ),
	fs		= require( 'fs-extra-promise' ),
	jade	= require( 'jade' ).render,
	watcher	= require( 'node-watch' ),


	/* Arguments Parsing */

	args = process.argv.slice(2),
	compress	= _.contains( args , '--c' ) || _.contains( args , '--compress' ),	// --c or --compress to compress files
	serve		= _.contains( args , '--s' ) || _.contains( args , '--server' ),	// --c or --compress to compress files
	watch		= _.contains( args , '--w' ) || _.contains( args , '--watch' ),		// --w or --watch to watch for file changes and rerun
	port = ( ( ) => {
		const port = (_.find( args , ( arg ) => { return arg.search('--p=') !== -1 } ));
		if ( _.isUndefined( port ) ) return process.env.PORT ? process.env.PORT : 8000;
		else return Number( port.substr( 3 ) );
	} )(),
	address = ( ( ) => {
		const address = (_.find( args , ( arg ) => { return arg.search('--a=') !== -1 } ));
		if ( _.isUndefined( address ) ) return '0.0.0.0';
		else return address.substr( 3 );
	} )(),


	/* Common Paths Parsing */

	src	= process.cwd() + '/source',
	dst = process.cwd() + '/app',
	asm = process.cwd() + '/.assembly',
	pck = process.cwd() + '/.packaged';

function compileScript ( source , dest ) {

	log.runningTask( 'compileScript ' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.catch( error => {
			log.error ( `compileScript has failed to read ${source}` , error );
			!watch && process.exit(1);
		} )
		.then ( buffer => {

			jshint.lint( buffer , source );

			if ( compress ) {
				return fs.outputFileAsync( dest , babel( buffer , source ) )
					.then( () => { return uglifyjs( dest ); } );
			} else {
				return fs.outputFileAsync( dest , babel( buffer , source ) );
			}


		} )
		.catch( error => {
			log.error ( `compileScript has failed to write ${dest}` , error );
			!watch && process.exit(1);
		} );

}

function compileStyle ( source , destination , compress ) {

	log.runningTask( 'compileStyle' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.catch( error => {
			log.error ( `compileStyle => readFileAsync has failed to parse ${source}` , error );
			!watch && process.exit(1);
		} )
		.then( buffer => {
			if ( path.extname( source ) === '.css' ) {
				return buffer;
			} else {
				return sass( { data : buffer, outputStyle : 'nested' } , source )
			}
		} )
		.catch( error => {
			log.error ( `compileStyle => sass has failed to parse ${source}` , error );
			!watch && process.exit(1);
		} )
		.then ( buffer => {
			buffer = path.extname( source ) === '.css' ?
				buffer : buffer.css;
			return postcss ( source , buffer , compress );
		} )
		.catch( error => {
			log.error ( `compileStyle => postcss has failed to parse ${source}` , error );
		} )
		.then ( buffer => {
			if ( compress ) {
				return fs.outputFileAsync( destination , buffer )
					.then( () => { return cleanCSS( destination ); } );
			} else {
				return fs.outputFileAsync( destination , buffer );
			}
		} )
		.catch( error => {
			log.error ( `compileStyle has failed to parse ${source}` , error );
			!watch && process.exit(1);
		} );

}

function compileJade ( source , dest , compress ) {

	log.runningTask( 'compileJade' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.then ( buffer => { return fs.outputFileAsync( dest , jade( buffer , { pretty : !!compress ? false : '\t' , filename : source } ) );  } )
		.catch( error => {
			log.error ( `compileTemplate has failed to parse ${source}` , error );
			!watch && process.exit(1);
		} );

}

function prepareModuleAssembly ( source , compress ) {

	log.runningTask( 'prepareModuleAssembly' , 'node' , source);

	return fs.isDirectoryAsync( source )
		.then( isDirectory => {

			if ( isDirectory ) {

				return fs.readdirAsync( source )
					.then( files => {
						return rsvp.all( _.chain(files)
							.filter( file => {
								return file.search('.DS_Store') === -1 &&
									file.search('global') === -1 &&
									file.search('media') === -1;
							}  )
							.map( file => { return prepareModuleAssembly( `${source}/${file}` , compress ) } )
							.value() );
					} )
					.catch( error => {
						log.error ( `prepareModuleAssembly has failed to parse dir ${source}` , error );
						!watch && process.exit(1);
					} );

			} else {

				const
					fileEnding = path.extname( source ),
					pathPosition = source.search('/elements') + 9,
					destination = pathPosition > 9 ? `${asm}/elements/${source.substring(pathPosition)}` : `${asm}/elements/${path.basename(source)}`;

				if ( fileEnding === '.js' ) {

					return compileScript( source , destination , compress );

				} else if ( fileEnding === '.sass' || fileEnding === '.scss' ) {

					return compileStyle( source , destination.replace( fileEnding , '.css' ) , compress );

				} else if ( fileEnding === '.css' ) {

					return compileStyle( source , destination , compress );

				} else if ( fileEnding === '.jade' ) {

					return compileJade( source , destination.replace( '.jade' , '.html' ) , compress );

				} else if ( fileEnding === '.html' ) {

					return fs.copyAsync( source , destination );

				}

			}

		} )
		.catch( error => {
			log.error ( `prepareModuleAssembly has failed to parse file ${src}` , error );
			!watch && process.exit(1);
		} );

}

function prepareModulePackaging ( assembly , packaging ) {

	log.runningTask( 'prepareModulePackaging' , 'node' , assembly);

	return glob( `${assembly}/elements/**/*.html` )
		.then ( modulePaths => {

			modulePaths = _.filter( modulePaths , modulePath => {
				return path.dirname( path.dirname( modulePath ) ) === `${assembly}/elements` || modulePath.search( 'index.html' ) !== -1;
			} );

			return rsvp.all( _.map( modulePaths , modulePath => {

				return vulcanize( modulePath  )
					.then( buffer => {
						return fs.outputFileAsync( modulePath.search( 'index.html' ) !== -1 ?
								(`${ path.dirname(modulePath) }.html`).replace( '.assembly' , '.packaged' ) :
								modulePath.replace( '.assembly' , '.packaged' ),
							buffer );
					} )
					.catch( error => {
						log.error( `Failed to vulcanize ${modulePath}` );
						!watch && process.exit(1);
					} );

			} ) );

		} )
		.then ( () => {
			return rsvp.all([
				fs.copyAsync( `${assembly}/scripts` , `${packaging}/scripts` ),
				fs.copyAsync( `${assembly}/styles` , `${packaging}/styles` ),
				fs.copyAsync( `${assembly}/index.html` , `${packaging}/index.html` )
			]);
		} )
		.catch ( error => {
			log.error ( `prepareModulePackaging has failed to parse ${assembly}` , error );
			!watch && process.exit(1);
		} );

}

function compileProject ( packaging , destination ) {

	let externalFiles = [];

	return glob( `${packaging}/elements/**` , `${packaging}/elements/core/**` )
		.catch( error => { log.error( 'compileProject => glob has failed' , error ); } )
		.then( excludedPaths => {
			externalFiles = _.filter( excludedPaths , modulePath => { return !fs.isDirectorySync( modulePath ); } );
			return vulcanize( `${packaging}/index.html` , externalFiles )
				.then( buffer => { return fs.outputFileAsync( `${destination}/index.html` , buffer ); } )
				.catch( error => { log.error( 'compileProject => vulcanizer has failed' , error ); } );
		} )
		.then( () => {
			return rsvp.all( _.map( externalFiles , file => {
				return fs.copyAsync( file , file.replace( packaging , destination ) )
			} ) );
		} )
		.catch( error => { log.error( 'compileProject has failed' , error ); } );

}

function projectCleanup ( assembly , packaging ) { return rsvp.all([ fs.removeAsync(assembly) , fs.removeAsync(packaging) ]); }

function copyMedia( src , dest  ) {

	log.runningTask( 'copyMedia' , 'node' , src);

	return fs.removeAsync( `${dest}/media` )
		.then( () => { return fs.copyAsync( `${src}/media` , `${dest}/media` ) } )
		.catch( error => {
			log.error ( `copyMedia has failed to parse ${src}` , error );
			!watch && process.exit(1);
		} );

}

function teflonApplicationCompiler ( ) {

	log.starting('Teflon Application Compiler');

	return projectCleanup( asm , pck )
		.catch( error => {
			log.error ( `The build => projectCleanup has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return compileJade( `${src}/index.jade` , `${asm}/index.html` , compress ); } )
		.catch( error => {
			log.error ( `The build => compileJade has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return glob(`${src}/scripts/**`) } )
		.catch( error => {
			log.error ( `The build => glob has failed` , error );
			!watch && process.exit(1);
		} )
		.then( scriptsPaths => {
			return rsvp.all( _.chain( scriptsPaths )
				.filter( scriptPath => { return !fs.isDirectorySync( scriptPath ); } )
				.map( scriptPath => { return compileScript( scriptPath , `${asm}/scripts/${path.basename(scriptPath)}` ); } )
				.value() );
		} )
		.catch( error => {
			log.error ( `The build => compileScripts has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return glob(`${src}/styles/**`) } )
		.catch( error => {
			log.error ( `The build => glob has failed` , error );
			!watch && process.exit(1);
		} )
		.then( stylesPaths => {
			return rsvp.all( _.chain( stylesPaths )
				.filter( stylePath => { return !fs.isDirectorySync( stylePath ); } )
				.map( stylePath => { return compileStyle( stylePath , `${asm}/styles/${path.basename(stylePath)}` ); } )
				.value() );
		} )
		.catch( error => {
			log.error ( `The build => compileStyles has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return prepareModuleAssembly( `${src}/elements` , false ); } )
		.catch( error => {
			log.error ( `The build => prepareModuleAssembly has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return prepareModulePackaging( asm , pck ); } )
		.catch( error => {
			log.error ( `The build => prepareModulePackaging has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return compileProject( pck , dst ) } )
		.catch( error => {
			log.error ( `The build => compileProject has failed` , error );
			!watch && process.exit(1);
		} )
		.then( () => { return projectCleanup( asm , pck ) } )
		.then( () => { return copyMedia( src , dst ) } )
		.then( () => { log.success( 'Finished Teflon Compilation' ); } )
		.catch( error => {
			log.error ( `The build has failed` , error );
			!watch && process.exit(1);
		} );
}


function teflonServer ( ) {

	const
		app = express(),
		server = app.listen( port , address , ( ) => {

			log.startingServer(
				server.address().address,
				server.address().port,
				'express' );

			app.use( '/' , express.static( dst ) );

	} );

}

function findFirstOrderModule ( filePath ) {

	if ( filePath.search( `${src}/elements` ) !== -1 ) {
		while ( path.dirname( path.dirname( filePath  ) ) !== `${src}/elements` ) {
			filePath = path.dirname( filePath );
		}
	} else {
		return false;
	}

	return { path : filePath , core : filePath.search( `${src}/elements/core` ) !== -1 };

}

function watchProjectFiles ( ) {

	watcher( src , filename => {
		teflonApplicationCompiler();
		console.log( findFirstOrderModule( filename ) );
	} );

}

teflonApplicationCompiler();

if ( serve ) teflonServer();
if ( watch ) watchProjectFiles();