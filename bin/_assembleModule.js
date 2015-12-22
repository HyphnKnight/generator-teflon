const
	compile		= require( './_compile.js' ),

	rsvp	= require('rsvp'),
	log		= require('log'),
	_		= require('underscore'),
	path	= require( 'path' ),
	fs		= require( 'fs-extra-promise' );


module.exports = function assembleModule ( source , assembly , compress , fail ) {

	log.runningTask( 'assembleModule' , 'node' , source );

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
							.map( file => { return assembleModule( `${source}/${file}` , assembly , compress , fail) } )
							.value() );
					} )
					.catch( error => {
						log.error ( `assembleModule has failed to parse dir ${source}` , error );
						fail && process.exit(1);
					} );

			} else {

				const
					fileEnding = path.extname( source ),
					pathPosition = source.search('/elements') + 9,
					destination = pathPosition > 9 ? `${assembly}/elements/${source.substring(pathPosition)}` : `${assembly}/elements/${path.basename(source)}`;

				if ( fileEnding === '.js' ) {

					return compile.script( source , destination , compress );

				} else if ( fileEnding === '.sass' || fileEnding === '.scss' ) {

					return compile.style( source , destination.replace( fileEnding , '.css' ) , compress );

				} else if ( fileEnding === '.css' ) {

					return compile.style( source , destination , compress );

				} else if ( fileEnding === '.jade' ) {

					return compile.jade( source , destination.replace( '.jade' , '.html' ) , compress );

				} else if ( fileEnding === '.html' ) {

					return fs.copyAsync( source , destination );

				}

			}

		} )
		.catch( error => {
			log.error ( `assembleModule has failed to parse file ${source}` , error );
			fail && process.exit(1);
		} );

}