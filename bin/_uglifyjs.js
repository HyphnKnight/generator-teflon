const
	log = require('log'),
	mnfy = require( 'node-minify' ),
	_ = require('underscore'),
	rsvp = require('rsvp');

module.exports = function uglify ( src , dst ) {

	log.runningTask( 'uglify' , 'node-minify' , src );

	dst = _.isString( dst ) ? dst : src;

	return new rsvp.Promise( ( resolve , reject ) => {

		new mnfy.minify( {

			type		: 'uglifyjs',
			fileIn		: src,
			fileOut		: dst,
			callback	: function ( error , minifiedBuffer ) {

				if ( error ) reject( error );
				else resolve( minifiedBuffer );

			}

		} );

	} )
	.catch( error => {
		log.error( 'uglify has failed' , error );
		process.exit(1);
	} );

}