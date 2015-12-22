const
	log = require('log'),
	rsvp = require('rsvp'),
	glob = require('./_glob.js'),
	_ = require ( 'underscore' ),
	Vulcanize = require ( 'vulcanize' );


module.exports = function vulcanizer ( path , excludes ) {

	log.processing( path , 'vulcanize.process' );

	excludes = _.isArray( excludes ) ? excludes : [];

	const vulcan = new Vulcanize({
		excludes,
		inlineScripts : true,
		inlineCss : true,
		inputUrl : path
	});

	return new rsvp.Promise( ( resolve , reject ) => {

		vulcan.process( path , ( error , buffer ) => {

			if ( error ) { reject( error ); }
			else { resolve( buffer ); }

		} );

	} );

};