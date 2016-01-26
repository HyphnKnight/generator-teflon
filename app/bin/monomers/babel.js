'use strict';

const
	log			= require('log'),
	transform	= require ( 'babel-core' ).transform;

module.exports = function babel ( buffer, path ) {

	log.processing( path , 'babel.transform' );

	try { return transform( buffer , { presets : ['es2015'] , compact : false } ).code; }
	catch ( error ) {

		log.error( `babel.transform has failed to parse the buffer for ${path}` , error );

		process.exit(1);

	}

};
