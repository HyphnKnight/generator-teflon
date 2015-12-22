const
	compile		= require( './_compile.js' ),
	glob		= require( './_glob.js' ),
	vulcanize	= require( './_vulcanize.js' ),

	rsvp	= require('rsvp'),
	log		= require('log'),
	_		= require('underscore'),
	path	= require( 'path' ),
	fs		= require( 'fs-extra-promise' );

module.exports = function packageModule ( assembly , packaging , compress , fail ) {

	log.runningTask( 'packageModule' , 'node' , assembly);

	return glob( `${assembly}/elements/**/*.html` )
		.then ( modulePaths => {

			modulePaths = _.filter( modulePaths , modulePath => {
				return path.dirname( path.dirname( modulePath ) ) === `${assembly}/elements` || modulePath.search( 'index.html' ) !== -1;
			} );

			return rsvp.all( _.map( modulePaths , modulePath => {

				return vulcanize( modulePath  )
					.then( buffer => {
						return fs.outputFileAsync( modulePath.search( 'index.html' ) !== -1 ?
								(`${ path.dirname(modulePath) }.html`).replace( '.assembly' , '.packaged' ) :
								modulePath.replace( '.assembly' , '.packaged' ),
							buffer );
					} )
					.catch( error => {
						log.error( `Failed to vulcanize ${modulePath}` );
						fail && process.exit(1);
					} );

			} ) );

		} )
		.catch ( error => {
			log.error ( `packageModule has failed to parse ${assembly}` , error );
			fail && process.exit(1);
		} );

}