'use strict';

const
	log		= require('log'),
	_		= require('underscore'),
	rsvp	= require('rsvp'),
	exec	= require('child_process').exec,
	glob	= require( './../monomers/glob.js' );

module.exports = function web_component_tester ( path ) {

	log.processing( path , 'web component tester' );

		return glob( `${path}/elements/**/tests` )
			.then( testDirs => {
				rsvp.all( _.map( testDirs , testDir => {

					return new rsvp.Promise( ( resolve , reject ) => {
						exec( `wct ${testDir}` , (error, stdout, stderr) => {

							if ( error ) {
								reject(error);
							} else {
								resolve(stdout);
							}

						} );
					} );

				} ) );

			} )
			.catch( error => { log.warn( 'web component tester has encountered an error' , error ); process.exit(1); } );

};