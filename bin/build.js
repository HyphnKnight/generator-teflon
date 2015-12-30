'use strict';

const

	_	= require ( 'underscore' ),
	log	= require ( 'log' ),

	/* Paths */
	source		= process.cwd() + '/source',
	destination	= process.cwd() + '/app',
	assembled	= process.cwd() + '/.assembled',
	packaged	= process.cwd() + '/.packaged',
	catalysts	= process.cwd() + '/bin/catalysts',

	/* Catalysts */
	construct	= require ( `${catalysts}/construct.js` ),
	server		= require ( `${catalysts}/server.js` ),
	watcher		= require ( `${catalysts}/watcher.js` ),

	/* Arguments Parsing */
	args = process.argv.slice(2),

	compress	= _.contains( args , '--c' ) || _.contains( args , '--compress' ),
	serve		= _.contains( args , '--s' ) || _.contains( args , '--server' ),
	watch		= _.contains( args , '--w' ) || _.contains( args , '--watch' ),
	debug		= _.contains( args , '--d' ) || _.contains( args , '--debug' ),

	port = ( ( ) => {
		const port = ( _.find( args , ( arg ) => { return arg.search('--p=') !== -1 } ));
		if ( _.isUndefined( port ) ) return process.env.PORT ? process.env.PORT : 8000;
		else return Number( port.substr( 4 ) );
	} )(),

	address = ( ( ) => {
		const address = ( _.find( args , ( arg ) => { return arg.search('--a=') !== -1 } ));
		if ( _.isUndefined( address ) ) return '0.0.0.0';
		else return address.substr( 3 );
	} )(),

	constructionArguments = [ source , assembled , packaged , destination , { compress , fail : !watch , debug } ];

log.starting( 'Teflon Application Compiler' );

construct.application.apply( this , constructionArguments );

if ( watch ) { watcher.apply( this , constructionArguments ); }

if ( serve ) { server.create( destination , port , address ); }