const
	log	= require( 'log' ),
	rsvp	= require( 'rsvp' ),
	imgmin	= require( 'imagemin' ),
	fs	= require( 'fs-extra-promise' );

function copy ( source , destination , fail ) {

	log.runningTask( 'media.copy ' , 'node' , source);

	return fs.removeAsync( `${destination}` )
		.then( () => { return fs.copyAsync( `${source}` , `${destination}` ) } )

}

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


module.exports = { copy , imagemin };