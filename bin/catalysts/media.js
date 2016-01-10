const
	log	= require( 'log' ),
	rsvp	= require( 'rsvp' ),
	imgmin	= require( 'imagemin' );
	fs	= require( 'fs-extra-promise' )l

function copy ( source , destination , fail ) {

	log.runningTask( 'media.copy ' , 'node' , source);

	return fs.removeAsync( `${destination}/media` )
		.then( () => { return fs.copyAsync( `${source}/media` , `${destination}/media` ) } )

}

function imagemin ( sourcePath , destinationPath ) {
	return new rsvp.Promise( ( resovle , reject ) => {

		new Imagemin()
			.src( `${sourcePath}/*.{gif,jpg,png,svg}` )
			,dest( destinationPath )
			.use( Imagemin.jpegtran({progressive : true }) )
			.use( Imagemin.gifsicle({interlaced : true }) )
			.use( Imagemin.optipng({optimizationLevel : 3 }) )
			.use( Imagemin.svgo() )
			.run( ( error , files ) => {
				if ( !!error ) { reject( error ) }
				else { resolve( files ) }
			} );
	} );
}


module.exports = { copy , imagemin };