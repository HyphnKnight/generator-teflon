'use strict';

const
	_		= require( 'underscore' ),
	fsp		= require( './fs-promise' ),
	fs		= require( 'fs' ),
	rsvp	= require( 'rsvp' ),
	log		= require( 'log' ),
	pth		= require('path'),
	glob	= ( (glob)=> {

		function globPromise ( path , options ) {

			return new rsvp.Promise( ( resolve , reject ) => {

				log.runningTask( 'render' , 'sass' , path , __filename);

				glob( path , options , ( error , files ) => {

					if ( error ) reject( error );
					else resolve( files );

				} );

			} );

		};

		return function ( includes , excludes , options ) {

			let acceptableFiles = [];

			options = !!options ? options : {};

			return globPromise( includes )
				.then( files => {
					acceptableFiles = files;
					return globPromise( excludes );
				} )
				.then( files => {

					return _.filter( acceptableFiles , file => {

						return !_.contains( files , file );

					} );

				} )
				.catch ( error => { log.error( `Failed to glob files includes : ${includes}, excludes : ${excludes}` , __filename , error ); process.exit(1); } );



		};

	})(require('glob')),

	src	= process.cwd() + '/source',
	dst = process.cwd() + '/dist',
	asm = process.cwd() + '/.assembly',
	pck = process.cwd() + '/.packaged',

	htmlMin	= require( 'html-minifier' ).minify,
	jade	= require( 'jade' ).render,
	sass	= (()=>{

		const sass = require('node-sass').render;

		return function ( options ) {

			return new rsvp.Promise( ( resolve , reject ) => {

				log.runningTask( 'render' , 'sass' , path , __filename);

				sass( options , ( error , buffer ) => {

					if ( error ) reject( error );
					else resolve( buffer );

				} );

			} );

		};

	})(),
	postcss	= (()=>{

		const
			autoprefixer = require('autoprefixer'),
			cssnano = require('cssnano'),
			postcss = require('postcss'),
			csscomb = ( function ( Comb ) {

				var comb = new Comb();

				comb.configure( require ( `${__dirname}/.csscomb.json` ) );

				return comb;

			} )( require( 'csscomb' ) ),
			parseMin	= postcss([ autoprefixer , cssnano ]),
			parse		= postcss([ autoprefixer ]);


		return function postcss ( path , buffer , compress ) {

			log.runningTask( [ (!!compress ? 'cssnano' : 'csscomb' ) , 'autoprefixer' ] , 'postcss' , path , __filename);

			return ( !!compress ? parseMin : parse ).process( buffer )
				.then ( result => { return !!compress ? result.css : csscomb(result.css); } )
				.catch ( error => { log.error( 'Failed to process css' , __filename , error ); process.exit(1); } );

		};

	}),

	jshint = (()=>{

		const jshint = require ( 'jshint' ).JSHINT;

		return function jshint ( buffer , path ) {

			log.runningTask( 'JSHINT' , 'jshint' , path , __filename);

			try {

				jshint( buffer , { esnext : true , undef : true , predef : [ '_' , 'Polymer' ] } );

				const data = jshint.data();

				if ( (_.isArray( data.errors ) && data.errors.length > 0) ||
					 (_.isArray( data.warnings ) && data.warnings.length > 0) ||
					 (_.isArray( data.unused ) && data.unused.length > 0) ) {

					_.isArray( data.unused ) && _.each( data.unused , variable => {

						log.warning( `JSHint discovered an unused variable named ${variable.name} in ${path}` , `line ${variable.line}, char ${variable.character}` );

					});

					_.isArray( data.warnings ) && _.each( data.warnings , warning => {

						log.warning(	`JSHint discovered the issue "${warning.reason}" in ${path}`,
											`line  ${warning.line}, char ${warning.character}`,
											{ issue : warning.raw , code : warning.evidence } );

					});

					_.isArray( data.errors ) && _.each( data.errors , error => {

						log.warning(	`JSHint discovered the error " ${error.reason}" in ${path}`,
											`line  ${error.line}, char ${error.character}`,
											{ issue : error.raw , code : error.evidence } );

					});

					log.error( `JSHint has found issues with ${path}` , __filename );

					process.exit(1);

				}

			} catch ( error ) {

				log.error( `JSHint has failed to parse the buffer for ${path}` , __filename );

				process.exit(1);

			}

		};

	})(),

	babel = (()=>{

		const babel = require ( 'babel-core' ).transform;

		return function babel ( buffer, path ) {

			log.runningTask( 'transform' , 'babel' , path , __filename);

			try { return babel( buffer , { presets : ['es2015'] } ).code; }
			catch ( error ) {

				log.error( `babel has failed to parse the buffer for ${path}` , __filename , error );

				process.exit(1);

			}

		};

	})(),

	vulcanize = ((Vulcanize)=>{


		return function vulcanizer ( path ) {
			
			log.runningTask( 'process' , 'vulcanize' , path , __filename);
			return glob( `${pck}/*/*.html` , `${pck}/core/*.html` )
				.then ( excludes => {

					const vulcan = new Vulcanize({
						excludes,
						inlineScripts : true,
						inlineCss : true,
						inputUrl : path
					});

					return new rsvp.Promise( ( resolve , reject ) => {

						vulcan.process( path , ( error , buffer ) => {

							if ( error ) reject( error );
							else resolve( buffer );

						} );

					} );

				})

		};

	})(require('vulcanize'));

function compileAll ( compress ) {

	log.runningTask( 'compileAll' , 'node' , `${src}/elements` , __filename);

	return projectCleanup()
		.then( () => { return fsp.readdir( `${src}/elements` ); } )
		.then ( elementTypes => {

			return rsvp.all( _.chain( elementTypes )
				.map( elementType => {

					return _.map( fs.readdirSync( `${src}/elements/${elementType}` ) , file => {

						if ( fs.lstatSync( `${src}/elements/${elementType}/${file}` ).isDirectory() ) {

							return compileExploded( elementType , file , compress );

						} else{

							return compileStandard( elementType , file , compress );

						}

					} );

				} ).flatten().value() );


		} )
		.then ( () => { return compilePages( compress ); } )
		.then ( () => { return compileProject(); } )
		//.then ( () => { return projectCleanup(); } )
		.then ( () => { return copyMedia( compress ); } )
		.catch ( error => { log.error( 'Failed to build' , __filename , error ); process.exit(1); } );

};

function compileStandard ( type , file , compress ) {

	const
		fileEnding	= pth.extname( file ),
		templateSrc	= `${src}/elements/${type}/${file}`,
		templateDst	= `${pck}/${type}/${file}`,
		moduleName	= `${type}/${file}`;

	log.runningTask( 'compileStandard' , 'node' , templateSrc , __filename);

	return fsp.readfile( templateSrc )
		.then ( buffer => { return fileEnding === '.html' ? buffer : jade( buffer , { pretty : !!compress ? false : '\t' , filename : templateSrc } ) } )
		.then ( buffer => {
			return fsp.outputFile( templateDst , htmlMin( buffer , {
				removeComments : !!compress,
				collapseWhitespace : !!compress,
				collapseBooleanAttributes : true,
				removeRedundantAttributes : true,
				removeEmptyAttributes : true,
				caseSensitive : true,
				minifyJS : !!compress,
				minifyCSS : !!compress,
				quoteCharacter : "'",
			} ) );
		} )
		.catch ( error => { log.error( `Failed to compile module ${moduleName}` , __filename , String(error) ); process.exit(1); } );

};

function compileExploded ( type , name , compress ) {

	const
		jadeSrc		= `${src}/elements/${type}/${name}/index.jade`,
		jadeDst		= `${asm}/${type}/${name}/index.html`,
		sassSrc		= `${src}/elements/${type}/${name}/style.scss`,
		sassDst		= `${asm}/${type}/${name}/style.css`,
		jsSrc		= `${src}/elements/${type}/${name}/script.js`,
		jsDst		= `${asm}/${type}/${name}/script.js`,
		moduleDst	= `${pck}/${type}/${name}.html`,
		moduleName	= `${type}/${name}`;

	log.runningTask( 'compileExploded' , 'node' , moduleName , __filename);

	return fsp.readfile( jadeSrc )
		.then ( buffer => {
			return fsp.outputFile( jadeDst , jade( buffer , { pretty : !!compress ? false : '\t' , filename : jadeSrc } ) );
		} )
		.then ( () => {
			return sass({
				file : sassSrc,
				outputStyle : !!compress ? 'compressed' : 'nested',
			});
		} )
		.then ( buffer => { return postcss( sassSrc , buffer , compress ); } )
		.then ( buffer => { return fsp.outputFile( sassDst , buffer ); } )
		.then ( () => { return fsp.readfile( jsSrc ) } )
		.then ( buffer => {
			jshint( buffer , jsSrc );
			return fsp.outputFile( jsDst , babel( buffer , jsSrc ) );
		} )
		.then ( () => {
			return vulcanize( jadeDst );
		} )
		.then ( buffer => {
			return fsp.outputFile( moduleDst , buffer );
		} )
		.catch ( error => { log.error( `Failed to compile module ${moduleName}` , __filename , error ); process.exit(1); } );

};

function compilePage ( page , compress ) {

	log.runningTask( 'compilePage' , 'node' , `${src}/${page}` , __filename);

	const
		fileEnding	= pth.extname( page ),
		name		= pth.basename( page , '.jade' ),
		pageSrc		= `${src}/${page}`,
		pageDst		= `${pck}/${name}.html`;

	return fsp.readfile( pageSrc )
		.then ( buffer => { return fsp.outputFile( pageDst , jade( buffer , { pretty : !!compress ? false : '\t' , filename : pageSrc } ) ); } )
		.catch ( error => { log.error( `Failed to compile page ${name}` , __filename , error ); process.exit(1); } );

};

function compilePages ( compress ) {

	log.runningTask( 'compilePages' , 'node' , src , __filename);

	return fsp.readdir( `${src}` )
		.then ( files => {

			const pages = _.filter( files , file => { return !( fs.lstatSync( `${src}/${file}` ).isDirectory() ); } );

			return rsvp.all( _.map( pages , page => { return compilePage( page , compress ) } ) );

		} )
		.catch ( error => { log.error( 'Failed to compile pages' , __filename , error ); process.exit(1); } );

};

function compileProject ( ) {

	log.runningTask( 'compileProject' , 'node' , pck , __filename);

	return fsp.readdir( `${pck}` )
		.then ( files => {

			return rsvp.all ( _.chain( files )
				.filter ( file => { return file !== 'core'; } )
				.map ( file => {

					if ( fs.lstatSync( `${pck}/${file}` ).isDirectory() ) {

						log.copying( `${pck}/${file}` , `${dst}/${file}` , __filename);

						return fsp.copy( `${pck}/${file}` , `${dst}/${file}` , { clobber : true } );

					} else {

						log.runningTask( 'vulcanize' , 'node' , `${pck}/${file}` , __filename);

						return vulcanize( `${pck}/${file}` )
							.then ( buffer => { return fsp.outputFile( `${dst}/${file}` , buffer ); } )
							.catch ( error => { log.error( `Failed to compile the page ${file}` , __filename , error ); process.exit(1); } );

					}

				} ).value() );

		} )
		.catch ( error => { log.error( `Failed to compile the project` , __filename , error ); process.exit(1); } );


};

function projectCleanup ( ) {

	return rsvp.all([
		fsp.remove(asm),
		fsp.remove(pck),
	]);

};

function copyMedia ( compress ) {

	return fsp.remove( `${dst}/media` )
		.then( () => {
			return fsp.copy( `${src}/media` , `${dst}/media` , { clobber : true } )
		} )
		.catch ( error => { log.error( 'Failed to copy over media' , __filename , error ); process.exit(1); } );

};

compileAll();