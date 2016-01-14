'use strict';

const
	log		= require( 'log' ),
	_		= require( 'underscore' ),
	rsvp	= require( 'rsvp' ),
	Imgmin	= require( 'imagemin' ),
	fs		= require( 'fs-extra-promise' ),
	glob	= require( './../monomers/glob.js' );

function imagemin ( sourcePath , destinationPath ) {

	return new rsvp.Promise( ( resolve , reject ) => {

		new Imgmin()
			.src( `${sourcePath}/*.{gif,jpg,png,svg}` )
			.dest( destinationPath )
			.use( Imgmin.jpegtran({progressive : true }) )
			.use( Imgmin.gifsicle({interlaced : true }) )
			.use( Imgmin.optipng({optimizationLevel : 3 }) )
			.use( Imgmin.svgo() )
			.run( ( error , files ) => {
				if ( !!error ) { reject( error ); }
				else { resolve( files ); }
			} );
	} );
}

function minify ( sourcePath , destinationPath ) {

	log.runningTask( 'media.minify ' , 'node' , sourcePath );

	return fs.removeAsync( destinationPath )
		.then( () => { return glob( `${sourcePath}/*` ); } )
		.then( paths => {
			return rsvp.all( _.map( paths , path => {
				if ( path === `${sourcePath}/images` ) {
					return imagemin( path , path.replace( sourcePath , destinationPath ) );
				} else {
					return fs.copyAsync( path , path.replace( sourcePath , destinationPath ) );
				}
			} ) );
		} )
		.catch( error => { log.error( 'media.minify has failed' , error ); process.exit(1); } );

}

function transfer ( sourcePath , destinationPath ) {

	log.runningTask( 'media.transfer ' , 'node' , sourcePath );

	return fs.removeAsync( destinationPath )
		.then( () => { return glob( `${sourcePath}/*` ); } )
		.then( paths => {
			return rsvp.all( _.map( paths , path => {
				return fs.copyAsync( path , path.replace( sourcePath , destinationPath ) );
			} ) );
		} )
		.catch( error => { log.error( 'media.transfer has failed' , error ); process.exit(1); } );

}

module.exports = { transfer , minify };