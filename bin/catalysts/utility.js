const
	rsvp	= require( 'rsvp' ),
	log		= require( 'log' ),
	fs		= require( 'fs-extra-promise' ),
	_		= require( 'underscore' );

function removePaths ( file ) {
	return rsvp.all( _.chain( arguments ).toArray().flatten().map( file => {
		return fs.removeAsync( file );
	} ).value() );
}

module.exports = { removePaths };