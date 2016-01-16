'use strict';

const
	rsvp	= require( 'rsvp' ),
	fs		= require( 'fs-extra-promise' ),
	_		= require( 'underscore' );

function removePaths () {
	return rsvp.all( _.chain( arguments ).toArray().flatten().map( file => {
		return fs.removeAsync( file );
	} ).value() );
}

module.exports = { removePaths };