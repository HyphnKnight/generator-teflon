'use strict';

const
	_		= require( 'underscore' ),
	log		= require( 'log' ),
	fs		= require( 'fs-extra-promise' ),
	rsvp 	= require ( 'rsvp' ),
	glob	= require( `${process.cwd()}/bin/monomers/glob.js` ),
	jshint	= require( `${process.cwd()}/bin/monomers/jshint.js` );

log.starting( 'Teflon Application Tests' );

let files = [];

/* Step 1 : JSHint all JS */

rsvp.all([ glob(`${process.cwd()}/bin/*/**.js`) , glob(`${process.cwd()}/bin/*.js`) ])
	.then( filePaths => {
		files = _.flatten( filePaths );
		return rsvp.all(_.map( files , file => { return fs.readFileAsync(file, 'utf8'); } , this ));
	} )
	.then( buffers => {
		_.each( buffers , (buffer , bufferIndex) => {
			jshint.lint( buffer , files[bufferIndex], { node : true , predef : [ 'console' , 'require' , 'process' , 'module' ]}  );
		} , this );
	} )
	.then( ()=> { log.ending( 'Teflon Application Tests' ); } )
	.catch( error => {
		log.error( 'Testing has failed', error );
		process.exit(1);
	} );