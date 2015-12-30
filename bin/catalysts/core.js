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

						return fs.copyAsync( pagePath , pagePath.replace( sourcePath , packagedPath ) );

					}
				} )
				.value() );
		} )

		.then( () => { return glob(`${sourcePath}/scripts/**`) } )

		.then( scriptsPaths => {
			return rsvp.all( _.chain( scriptsPaths )
				.filter( scriptPath => { return !fs.isDirectorySync( scriptPath ); } )
				.map( scriptPath => { return parse.script( scriptPath , `${packagedPath}/scripts/${path.basename(scriptPath)}` ); } )
				.value() );
		} )

		.then( () => { return glob(`${sourcePath}/styles/**`) } )

		.then( stylesPaths => {
			return rsvp.all( _.chain( stylesPaths )
				.filter( stylePath => { return !fs.isDirectorySync( stylePath ); } )
				.map( stylePath => { return parse.style( stylePath , `${packagedPath}/styles/${path.basename(stylePath)}` ); } )
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
			externalFiles = _.filter( excludedPaths , modulePath => { return !fs.isDirectorySync( modulePath ); } );
			return vulcanize( `${packagedPath}/index.html` , externalFiles );
		} )
		.then( buffer => { return fs.outputFileAsync( `${destinationPath}/index.html` , buffer ); } )
		.catch( error => {
			log.error ( `core.compile has failed` , error );
			fail && process.exit(1);
		} )

}


module.exports = { package , compile };