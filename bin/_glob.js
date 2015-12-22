'use strict';

const
	log = require('log'),
	rsvp = require('rsvp'),
	_ = require('underscore'),
	glob = require('glob');

function globPromise ( path , options ) {

	return new rsvp.Promise( ( resolve , reject ) => {

		log.runningTask( 'glob' , 'glob' , path , __filename);

		glob( path , options , ( error , files ) => {

			if ( error ) reject( error );
			else resolve( files );

		} );

	} );

};

function globExclude ( includes , excludes , options ) {

	options = !!options ? options : {};

	return rsvp.all([ globPromise( includes , options ) , globPromise( excludes , options ) ])
		.then( results => {
			return _.chain( results[0] )
				.difference( results[1] )
				.filter( path => { return path.search( '.DS_Store' ) === -1; } )
				.value();
		} )
		.catch ( error => {
			log.error( `Failed to glob files includes : ${includes}, excludes : ${excludes}` , __filename , error );
			process.exit(1);
		} );

};

function globInclude ( includes , options ) {

	options = !!options ? options : {};
	return globPromise( includes , options )
		.then( files => { return _.filter( files , path => { return path.search( '.DS_Store' ) === -1; } ); } )
		.catch ( error => {
			log.error( `Failed to glob files includes : ${includes}, excludes : ${excludes}` , __filename , error );
			process.exit(1);
		} );

};

module.exports = function glob (  includes , excludes , options  ){

	if ( _.isString( includes ) && !_.isString( excludes ) ) {

		return globInclude( includes , _.isObject( excludes ) ? excludes : {} );

	} else if ( _.isString( includes ) && _.isString( excludes ) ) {

		return globExclude( includes , excludes , _.isObject( options ) ? options : {} );

	}

}