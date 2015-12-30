const
	fs	= require( 'fs-extra-promise' ),
	log	= require('log');

function copy ( source , destination , fail ) {

	log.runningTask( 'media.copy ' , 'node' , source);

	return fs.removeAsync( `${destination}/media` )
		.then( () => { return fs.copyAsync( `${source}/media` , `${destination}/media` ) } )
		.catch( error => {
			log.error ( `media.copy  has failed to parse ${source}` , error );
			fail && process.exit(1);
		} );

}

module.exports = { copy }