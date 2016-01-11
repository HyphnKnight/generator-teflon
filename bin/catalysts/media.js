const
	log		= require( 'log' ),
	_		= require( 'underscore' ),
	rsvp	= require( 'rsvp' ),
	imgmin	= require( 'imagemin' ),
	fs		= require( 'fs-extra-promise' ),
	glob	= require( './../monomers/glob.js' );

function imagemin ( sourcePath , destinationPath ) {

	return new rsvp.Promise( ( resolve , reject ) => {

		new imgmin()
			.src( `${sourcePath}/*.{gif,jpg,png,svg}` )
			.dest( destinationPath )
			.use( imgmin.jpegtran({progressive : true }) )
			.use( imgmin.gifsicle({interlaced : true }) )
			.use( imgmin.optipng({optimizationLevel : 3 }) )
			.use( imgmin.svgo() )
			.run( ( error , files ) => {
				if ( !!error ) { reject( error ) }
				else { resolve( files ) }
			} );
	} );
}

function minify ( sourcePath , destinationPath ) {

	log.runningTask( 'media.minify ' , 'node' , sourcePath );

	return fs.removeAsync( destinationPath )
		.then( () => { return glob( `${sourcePath}/*` ) } )
		.then( paths => {
			return rsvp.all( _.map( paths , path => {
				if ( path === `${sourcePath}/images` ) {
					return imagemin( path , path.replace( sourcePath , destinationPath ) );
				} else {
					return fs.copyAsync( path , path.replace( sourcePath , destinationPath ) );
				}
			} ) );
		} )

}

function transfer ( sourcePath , destinationPath ) {

	log.runningTask( 'media.transfer ' , 'node' , sourcePath );

	return fs.removeAsync( destinationPath )
		.then( () => { return glob( `${sourcePath}/*` ) } )
		.then( paths => {
			return rsvp.all( _.map( paths , path => {
				return fs.copyAsync( path , path.replace( sourcePath , destinationPath ) );
			} ) );
		} )

}

module.exports = { transfer , minify };