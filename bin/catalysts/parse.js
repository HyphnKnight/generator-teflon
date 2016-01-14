'use strict';

const
	log			= require( 'log' ),
	fs			= require( 'fs-extra-promise' ),
	path		= require( 'path' ),
	uglifyjs	= require( 'uglify-js' ),
	htmlmini	= require( 'html-minifier' ).minify,
	jadeRender	= require( 'jade' ).render,

	monomers	= `${process.cwd()}/bin/monomers`,

	postcss		= require( `${monomers}/postcss.js` ),
	sass		= require( `${monomers}/sass.js` ),
	babel		= require( `${monomers}/babel.js` ),
	jshint		= require( `${monomers}/jshint.js` );


function script ( sourcePath , destinationPath , compress , fail ) {

	log.runningTask( 'compile.script' , 'node' , sourcePath);

	return fs.readFileAsync( sourcePath , 'utf8' )
		.catch( error => {
			log.error ( `compile.script has failed to read ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} )
		.then ( buffer => {

			jshint.lint( buffer , sourcePath );

			if ( compress ) {

				return fs.outputFileAsync( destinationPath , uglifyjs.minify( babel( buffer , sourcePath ) , { fromString : true , DEBUG : false } ).code );

			} else {

				return fs.outputFileAsync( destinationPath , babel( buffer , sourcePath ) );

			}


		} )
		.catch( error => {
			log.error ( `compile.script has failed to write ${destinationPath}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

function style ( sourcePath , destinationPath , compress , fail ) {

	log.runningTask( 'compile.style' , 'node' , sourcePath);

	return fs.readFileAsync( sourcePath , 'utf8' )
		.catch( error => {
			log.error ( `compile.style => readFileAsync has failed to parse ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} )
		.then( buffer => {
			if ( path.extname( sourcePath ) === '.css' ) {
				return buffer;
			} else {
				return sass( { data : buffer, outputStyle : 'nested' } , sourcePath );
			}
		} )
		.catch( error => {
			log.error ( `compile.style => sass has failed to parse ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} )
		.then ( buffer => {
			buffer = path.extname( sourcePath ) === '.css' ?
				buffer : buffer.css;
			return postcss ( sourcePath , buffer , compress );
		} )
		.catch( error => {
			log.error ( `compile.style => postcss has failed to parse ${sourcePath}` , error );
		} )
		.then ( buffer => {
			return fs.outputFileAsync( destinationPath , buffer );
		} )
		.catch( error => {
			log.error ( `compile.style has failed to parse ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

function jade ( sourcePath , destinationPath , compress , fail ) {

	log.runningTask( 'compile.jade' , 'node' , sourcePath);

	return fs.readFileAsync( sourcePath , 'utf8' )
		.then ( buffer => { return fs.outputFileAsync( destinationPath , jadeRender( buffer , { pretty : !!compress ? false : '\t' , filename : sourcePath } ) );  } )
		.catch( error => {
			log.error ( `compile.jade has failed to parse ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

function html ( sourcePath , destinationPath , compress , fail ) {

	log.runningTask( 'compile.jade' , 'node' , sourcePath);

	return fs.readFileAsync( sourcePath , 'utf8' )
		.then ( buffer => {
			if ( compress ) {
				return fs.outputFileAsync( destinationPath , htmlmini( buffer , {
					collapseBooleanAttributes	: true,
					removeAttributeQuotes		: true,
					removeRedundantAttributes	: true,
					collapseWhitespace			: true,
					conservativeCollapse		: true,
					caseSensitive				: true,
					minifyJS					: { fromString : true , DEBUG : false },
					minifyCSS					: true
				}) );
			} else {
				return fs.outputFileAsync( destinationPath , buffer );
			}
		} )
		.catch( error => {
			log.error ( `compile.jade has failed to parse ${sourcePath}` , error );
			if ( fail ) { process.exit(1); }
		} );

}

module.exports = { script , style , jade , html };