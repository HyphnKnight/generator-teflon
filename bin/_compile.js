const
	log		= require( 'log' ),
	fs		= require( 'fs-extra-promise' ),
	path	= require( 'path' ),

	postcss		= require( './_postcss.js' ),
	sass		= require( './_sass.js' ),
	babel		= require( './_babel.js' ),
	jshint		= require( './_jshint.js' ),
	uglifyjs	= require( './_uglifyjs.js' ),
	cleanCSS	= require( './_cleanCSS.js' ),

	jadeRender	= require( 'jade' ).render;


function script ( source , destination , compress , fail ) {

	log.runningTask( 'compile.script' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.catch( error => {
			log.error ( `compileScript has failed to read ${source}` , error );
			fail && process.exit(1);
		} )
		.then ( buffer => {

			jshint.lint( buffer , source );

			if ( compress ) {
				return fs.outputFileAsync( destination , babel( buffer , source ) )
					.then( () => { return uglifyjs( destination ); } );
			} else {
				return fs.outputFileAsync( destination , babel( buffer , source ) );
			}


		} )
		.catch( error => {
			log.error ( `compileScript has failed to write ${destination}` , error );
			fail && process.exit(1);
		} );

}

function style ( source , destination , compress , fail ) {

	log.runningTask( 'compile.style' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.catch( error => {
			log.error ( `compile.style => readFileAsync has failed to parse ${source}` , error );
			fail && process.exit(1);
		} )
		.then( buffer => {
			if ( path.extname( source ) === '.css' ) {
				return buffer;
			} else {
				return sass( { data : buffer, outputStyle : 'nested' } , source )
			}
		} )
		.catch( error => {
			log.error ( `compile.style => sass has failed to parse ${source}` , error );
			fail && process.exit(1);
		} )
		.then ( buffer => {
			buffer = path.extname( source ) === '.css' ?
				buffer : buffer.css;
			return postcss ( source , buffer , compress );
		} )
		.catch( error => {
			log.error ( `compile.style => postcss has failed to parse ${source}` , error );
		} )
		.then ( buffer => {
			if ( compress ) {
				return fs.outputFileAsync( destination , buffer )
					.then( () => { return cleanCSS( destination ); } );
			} else {
				return fs.outputFileAsync( destination , buffer );
			}
		} )
		.catch( error => {
			log.error ( `compile.style has failed to parse ${source}` , error );
			fail && process.exit(1);
		} );

}

function jade ( source , destination , compress , fail ) {

	log.runningTask( 'compile.jade' , 'node' , source);

	return fs.readFileAsync( source , 'utf8' )
		.then ( buffer => { return fs.outputFileAsync( destination , jadeRender( buffer , { pretty : !!compress ? false : '\t' , filename : source } ) );  } )
		.catch( error => {
			log.error ( `compileTemplate has failed to parse ${source}` , error );
			fail && process.exit(1);
		} );

}

module.exports = { script , style , jade };