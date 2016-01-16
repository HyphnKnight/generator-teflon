'use strict';

const

	/* Node Modules */
	_		= require ( 'underscore' ),
	log		= require ( 'log' ),
	rsvp 	= require ( 'rsvp' ),

	/* Catalyst */
	catalyst	= `${process.cwd()}/bin/catalysts`,
	core		= require ( `${catalyst}/core.js` ),
	elements	= require ( `${catalyst}/elements.js` ),
	utility		= require ( `${catalyst}/utility.js` ),
	media		= require ( `${catalyst}/media.js` );

function application ( sourcePath , assembledPath , packagedPath , destinationPath , options ) {

	options.compress		= Boolean( options.compress );
	options.fail			= Boolean( options.fail );
	options.debug			= Boolean( options.debug );
	options.elementsSource	= _.isString( options.elementsSource ) ?
		options.elementsSource :
		`${sourcePath}/elements`;

	const startTime = Date.now();

	log.starting( 'construct.application' );

	return utility.removePaths(	assembledPath , packagedPath )

		.then( () => { return elements.assemble (	options.elementsSource,
													assembledPath,
													options.compress,
													options.fail ); } )

		.then( () => { return elements.pile(	assembledPath,
												packagedPath,
												options.compress,
												options.fail ); } )

		.then( () => { return core.pile(	sourcePath,
											packagedPath,
											options.compress,
											options.fail ); } )

		.then( () => { return core.compile(	packagedPath,
											destinationPath,
											options.fail ); } )

		.then( () => { return elements.compile(	packagedPath,
												destinationPath ); } )

		.then( () => { return !options.debug ?
			utility.removePaths( assembledPath , packagedPath ) :
			rsvp.Promise.resolve();
		} )

		.then( () => {

			if ( options.compress ) {
				return media.minify(	`${sourcePath}/media`,
										`${destinationPath}/media` );
			} else {
				return media.transfer(	`${sourcePath}/media`,
										`${destinationPath}/media` );
			}

		} )

		.then( () => { log.success( `construct.application : ${( Date.now() - startTime )}ms` ); } )

		.catch( error => {
			log.error ( `construct.application has failed` , error );
			if ( options.fail ) { process.exit(1); }
		} );

}

function element ( sourcePath , assembledPath , packagedPath , destinationPath , options ) {

	options.compress	= Boolean( options.compress );
	options.fail		= Boolean( options.fail );

	log.starting( 'construct.element' , sourcePath );

	const startTime = Date.now();

	return elements.assemble (	sourcePath,
								assembledPath,
								options.compress,
								options.fail )

		.then( () => { return elements.pile(	assembledPath,
												packagedPath,
												options.compress,
												options.fail ); } )

		.then( () => { return elements.compile(	packagedPath,
												destinationPath ); } )

		.then( () => { return !options.debug ?
			utility.removePaths( assembledPath , packagedPath ) :
			true;
		} )

		.then( () => { log.success( `construct.element : ${( Date.now() - startTime )}ms` ); } )

		.catch( error => {
			log.error ( `construct.element has failed` , error );
			if ( options.fail ) { process.exit(1); }
		} );

}

module.exports = { element , application };
