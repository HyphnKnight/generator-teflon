'use strict';

const
	log = require('log'),
	rsvp = require('rsvp'),
	sassRender = require('node-sass').render;

module.exports = function sass ( options , path ) {

	log.processing( path , 'sass.render' );

	return new rsvp.Promise( ( resolve , reject ) => {

		sassRender( options , ( error , buffer ) => {

			if ( error ) reject( error );
			else resolve( buffer );

		} );

	} );

};