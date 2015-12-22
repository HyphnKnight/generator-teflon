const
	log = require('log'),
	mnfy = require( 'node-minify' ),
	_ = require('underscore'),
	rsvp = require('rsvp');

module.exports = function cleanCSSCompiler ( src , dst ) {

	log.runningTask( 'cleanCSSCompiler' , 'node-minify' , src );

	dst = _.isString( dst ) ? dst : src;

	return new rsvp.Promise( ( resolve , reject ) => {

		new mnfy.minify( {

			type		: 'clean-css',
			fileIn		: src,
			fileOut		: dst,
			callback	: function ( error , minifiedBuffer ) {

				if ( error ) reject( error );
				else resolve( files );

			}

		} );

	} )
	.catch( error => {
		log.error( 'cleanCSSCompiler has failed' , error );
		process.exit(1);
	} );

}