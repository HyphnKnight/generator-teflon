const

	/* Node Modules */
	_		= require ( 'underscore' ),
	log		= require ( 'log' ),
	rsvp 	= require ( 'rsvp' )//,

	/* Catalyst */
	catalyst	= `${process.cwd()}/bin/catalysts`,
	core		= require ( `${catalyst}/core.js` ),
	elements	= require ( `${catalyst}/elements.js` ),
	utility		= require ( `${catalyst}/utility.js` ),
	media		= require ( `${catalyst}/media.js` ),
	parse		= require ( `${catalyst}/parse.js` );

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
													options.fail ) } )

		.then( () => { return elements.package(	assembledPath,
												packagedPath,
												options.compress,
												options.fail ); } )

		.then( () => { return core.package(	sourcePath,
											packagedPath,
											options.compress,
											options.fail ); } )

		.then( () => { return core.compile(	packagedPath,
											destinationPath,
											options.compress,
											options.fail ); } )

		.then( () => { return elements.compile(	packagedPath,
												destinationPath ); } )

		.then( () => { return !options.debug ?
			utility.removePaths( assembledPath , packagedPath ) :
			rsvp.Promise.resolve();
		} )

		.then( () => {

			if ( compress ) {
				return media.imagemin(	`${sourcePath}/media/images`,
										`${destinationPath}/media/images` );
			} else {
				return media.copy(	sourcePath,
									destinationPath );
			}
		} )

		.then( () => {
			return media.copy(	`${sourcePath}/media/fonts`,
								`${destinationPath}/media/fonts` );
		} )

		.then( () => { log.success( `construct.application : ${( Date.now() - startTime )}ms` ); } )

		.catch( error => {
			log.error ( `construct.application has failed` , error );
			options.fail && process.exit(1);
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

		.then( () => { return elements.package(	assembledPath,
												packagedPath,
												options.compress,
												options.fail ); } )

		.then( () => { return elements.compile(	packagedPath,
												destinationPath ); } )

		.then( () => { return !options.debug ?
			utility.removePaths( assembledPath , packagedPath ) :
			'test';//rsvp.Promise.resolve();
		} )

		.then( () => { log.success( `construct.element : ${( Date.now() - startTime )}ms` ); } )

		.catch( error => {
			log.error ( `construct.element has failed` , error );
			options.fail && process.exit(1);
		} )

}

module.exports = { element , application };