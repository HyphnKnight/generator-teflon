const
	log		= require ( 'log' ),
	express	= require ( 'express' );


function create ( servePath , port , address ) {

	const
		app		= express(),
		server	= app.listen( port , address , ( ) => {

			log.startingServer(
				server.address().address,
				server.address().port,
				'express' );

			app.use( '/' , express.static( servePath ) );

		} );

};

module.exports = { create };