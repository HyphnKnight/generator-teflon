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

function package ( sourcePath , packagedPath , compress , fail ) {

	log.runningTask( 'core.package' , 'node' , sourcePath );

	return glob( `${sourcePath}/*` )

		.then( results => {
			return rsvp.all( _.chain( results )
				.filter( pagePath => { return !fs.isDirectorySync( pagePath ); } )
				.map( pagePath => {

					const fileEnding = path.extname( pagePath );

					if ( fileEnding === '.jade' ) {

						return parse.jade( pagePath , pagePath.replace( sourcePath , packagedPath ).replace( '.jade' , '.html' ) , compress , fail );

					} else if ( fileEnding === '.html' ) {

						return parse.html( pagePath , pagePath.replace( sourcePath , packagedPath ) , compress , fail );

					}
				} )
				.value() );
		} )

		.catch( error => {
			log.error ( `core.package has failed` , error );
			fail && process.exit(1);
		} )

}

function compile ( packagedPath , destinationPath , compress , fail ) {

	log.runningTask( 'core.compile' , 'node' , packagedPath );

	return glob( `${packagedPath}/elements/**` , `${packagedPath}/elements/core/**` )
		.then( excludedPaths => {
			const externalFiles = _.filter( excludedPaths , modulePath => { return !fs.isDirectorySync( modulePath ); } );

			return glob( `${packagedPath}/*` )
				.then( pagePaths => {

					pagePaths = _.filter( pagePaths , pagePath => { return !fs.isDirectorySync( pagePath ); } )

					return rsvp.all( _.map( pagePaths , pagePath => { return vulcanize( pagePath , externalFiles ) } ) )
						.then( vulcanizedBuffers => {
							return rsvp.all( _.map( vulcanizedBuffers , ( buffer , index ) => {
								return fs.outputFileAsync( pagePaths[index].replace( packagedPath , destinationPath ) , buffer );
							} ) );
						} )

				} );

		} )
		.catch( error => {
			log.error ( `core.compile has failed` , error );
			fail && process.exit(1);
		} )

}


module.exports = { package , compile };