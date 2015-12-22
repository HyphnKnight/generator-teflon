const
	log = require('log'),
	rsvp = require('rsvp'),
	sassRender = require('node-sass').render;

module.exports = function sass ( options , path ) {

	return new rsvp.Promise( ( resolve , reject ) => {

		log.runningTask( 'render' , 'sass' , path , __filename);

		sassRender( options , ( error , buffer ) => {

			if ( error ) reject( error );
			else resolve( buffer );

		} );

	} );

};