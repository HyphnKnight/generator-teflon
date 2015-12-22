const
	log = require( 'log' ),
	_ = require( 'underscore' ),
	JSHINT = require ( 'jshint' ).JSHINT;

function lint ( buffer , path ) {

	log.processing( path , 'jshint.JSHINT' );

	try {

		JSHINT( buffer , { esnext : true , undef : true , predef : ['console' , 'define' , '_' , 'Polymer' ] } );

		const data = JSHINT.data();

		if ( (_.isArray( data.errors ) && data.errors.length > 0) ||
			 (_.isArray( data.warnings ) && data.warnings.length > 0) ||
			 (_.isArray( data.unused ) && data.unused.length > 0) ) {

			_.isArray( data.unused ) && _.each( data.unused , variable => {

				log.warning( `JSHint discovered an unused variable named ${variable.name} in ${path}` , `line ${variable.line}, char ${variable.character}` );

			});

			_.isArray( data.warnings ) && _.each( data.warnings , warning => {

				log.warning(	`JSHint discovered the issue "${warning.reason}" in ${path}`,
									`line  ${warning.line}, char ${warning.character}`,
									{ issue : warning.raw , code : warning.evidence } );

			});

			_.isArray( data.errors ) && _.each( data.errors , error => {

				log.warning(	`JSHint discovered the error " ${error.reason}" in ${path}`,
									`line  ${error.line}, char ${error.character}`,
									{ issue : error.raw , code : error.evidence } );

			});

			log.error( `JSHint has found issues with ${path}` , __filename );

			process.exit(1);

		}

	} catch ( error ) {

		log.error( `JSHint has failed to parse the buffer for ${path}` , __filename );

		process.exit(1);

	}

	return buffer;

}

function analyze ( buffer ) {

	JSHINT( buffer , { esnext : true , undef : true , predef : [ 'define' , 'window' ] } );

	const
		funcs = JSHINT.data().functions,
		data = _.chain( funcs )
		.map( func => { return func.metrics } )
		.reduce( ( memo , metric ) => {
			memo.complexity += metric.complexity;
			memo.parameters += metric.parameters;
			memo.statements += metric.statements;
			return memo;
		} ).value();

	return {
		numberOfFunctions : funcs.length,
		avgComplexity : data.complexity / funcs.length,
		avgParameters : data.parameters / funcs.length,
		avgStatements : data.statements / funcs.length
	};

}

module.exports = { lint , analyze };