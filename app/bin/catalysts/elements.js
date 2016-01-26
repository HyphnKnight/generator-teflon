'use strict';

const
	path	= require( 'path' ),
	_		= require( 'underscore' ),
	fs		= require( 'fs-extra-promise' ),
	rsvp	= require('rsvp'),
	log		= require('log'),

	monomers = `${process.cwd()}/bin/monomers/`,
	catalysts = `${process.cwd()}/bin/catalysts/`,

	parse		= require( `${catalysts}parse.js` ),
	glob		= require( `${monomers}glob.js` ),
	vulcanize	= require( `${monomers}vulcanize.js` );

function assemble ( source , assembled , compress , fail ) {

	log.runningTask( 'elements.assemble' , 'node' , source );

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
							.map( file => { return assemble( `${source}/${file}` , assembled , compress , fail); } )
							.value() );
					} )
					.catch( error => {
						log.error ( `elements.assemble has failed to parse dir ${source}` , error );
						if ( fail ) { process.exit(1); }
					} );

			} else {

				const
					fileEnding = path.extname( source ),
					pathPosition = source.search('/elements') + 9,
					destination = pathPosition > 9 ? `${assembled}/elements${source.substring(pathPosition)}` : `${assembled}/elements/${path.basename(source)}`;

				if ( fileEnding === '.js' ) {

					return parse.script( source , destination , compress , fail );

				} else if ( fileEnding === '.sass' || fileEnding === '.scss' ) {

					return parse.style( source , destination.replace( fileEnding , '.css' ) , compress , fail );

				} else if ( fileEnding === '.css' ) {

					return parse.style( source , destination , compress , fail );

				} else if ( fileEnding === '.jade' ) {

					return parse.jade( source , destination.replace( '.jade' , '.html' ) , compress , fail );

				} else if ( fileEnding === '.html' ) {

					return parse.html( source , destination , compress , fail );

				}

			}

		} )
		.catch( error => {
			log.error ( `elements.assemble has failed to parse file ${source}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

function pile ( assembled , packaged , fail ) {

	log.runningTask( 'elements.package' , 'node' , assembled);

	return glob( `${assembled}/elements/**/*.html` )
		.then ( modulePaths => {

			modulePaths = _.filter( modulePaths , modulePath => {
				return path.dirname( path.dirname( modulePath ) ) === `${assembled}/elements` || modulePath.search( 'index.html' ) !== -1;
			} );

			return rsvp.all( _.map( modulePaths , modulePath => {

				return vulcanize( modulePath  )
					.then( buffer => {
						return fs.outputFileAsync( modulePath.search( 'index.html' ) !== -1 ?
								(`${ path.dirname(modulePath) }.html`).replace( assembled , packaged ) :
								modulePath.replace( assembled , packaged ),
							buffer );
					} )
					.catch( error => {
						log.error( `Failed to vulcanize ${modulePath}` , error );
						if ( fail ) { process.exit(1); }
					} );

			} ) );

		} )
		.catch ( error => {
			log.error ( `elements.package has failed to parse ${assembled}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

function compile ( packaged , destination ) {

	log.runningTask( 'elements.compile' , 'node' , packaged );

	return glob( `${packaged}/elements/**` , `${packaged}/elements/core/**` )
		.then( excludedPaths => {
			const externalFiles = _.filter( excludedPaths , modulePath => { return !fs.isDirectorySync( modulePath ); } );
			return rsvp.all( _.map( externalFiles , file => { return fs.copyAsync( file , file.replace( packaged , destination ) ); } ) );
		} )
		.catch( error => { log.error( 'elements.compile has failed' , error ); } );

}

module.exports = { assemble , pile , compile };