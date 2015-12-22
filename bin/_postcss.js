'use strict';

const
	log = require('log'),
	autoprefixer = require( 'autoprefixer' ),
	cssnano = require( 'cssnano' ),
	postcss = require( 'postcss' ),
	csscomb = ( function ( Comb ) {

		var comb = new Comb();

		comb.configure( {
			"remove-empty-rulesets": true,
			"always-semicolon": true,
			"color-case": "lower",
			"block-indent": "\t",
			"color-shorthand": true,
			"element-case": "lower",
			"eof-newline": false,
			"leading-zero": false,
			"quotes": "single",
			"sort-order-fallback": "abc",
			"space-before-colon": " ",
			"space-after-colon": " ",
			"space-before-combinator": " ",
			"space-after-combinator": " ",
			"space-between-declarations": "\n",
			"space-before-opening-brace": " ",
			"space-after-opening-brace": "\n",
			"space-after-selector-delimiter": "\n",
			"space-before-selector-delimiter": "",
			"space-before-closing-brace": "\n",
			"strip-spaces": true,
			"unitless-zero": true,
			"vendor-prefix-align": true
		} );

		return comb;

	} )( require( 'csscomb' ) ),
	parseMin = postcss([ autoprefixer , cssnano ]),
	parse = postcss([ autoprefixer ]);


module.exports = function postcss ( path , buffer , compress ) {

	log.runningTask( [ (!!compress ? 'cssnano' : 'csscomb' ) , 'autoprefixer' ] , 'postcss' , path );

	return ( !!compress ? parseMin : parse ).process( buffer )
		.then ( result => { return csscomb.processString(result.css); } )
		.catch ( error => {
			log.error( 'Failed to process css' , path , error );
			process.exit(1);
		} );

};