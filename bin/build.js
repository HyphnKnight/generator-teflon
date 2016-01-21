'use strict';

const

	_	= require ( 'underscore' ),
	log	= require ( 'log' ),
	exec = require('child_process').exec,

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
	test		= _.contains( args , '--t' ) || _.contains( args , '--test' ),

	port = ( ( ) => {
		const port = ( _.find( args , ( arg ) => { return arg.search('--p=') !== -1; } ));
		if ( _.isUndefined( port ) ) return process.env.PORT ? process.env.PORT : 8000;
		else return Number( port.substr( 4 ) );
	} )(),

	address = ( ( ) => {
		const address = ( _.find( args , ( arg ) => { return arg.search('--a=') !== -1; } ));
		if ( _.isUndefined( address ) ) return '0.0.0.0';
		else return address.substr( 3 );
	} )(),

	constructionArguments = [ source , assembled , packaged , destination , { compress , fail : !watch , debug , test } ];

log.starting( 'Teflon Application Compiler' );

if ( test ) {

	exec( 'npm list -g | grep web-component-tester' , (error, stdout, stderr) => {

		constructionArguments[4].test = stdout.search('web-component-tester') !== -1;

		construct.application.apply( null , constructionArguments );

		if ( watch ) { watcher.apply( null , constructionArguments ); }

		if ( serve ) { server.create( destination , port , address ); }

	} );

} else {

	construct.application.apply( null , constructionArguments );

	if ( watch ) { watcher.apply( null , constructionArguments ); }

	if ( serve ) { server.create( destination , port , address ); }

}