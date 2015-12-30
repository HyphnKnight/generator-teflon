const
	_			= require ( 'underscore' ),
	log			= require ( 'log' ),
	path		= require ( 'path' ),
	construct	= require ( process.cwd() + '/bin/catalysts/construct.js' ),
	watch		= require ( 'node-watch' );

function findFirstOrderModule ( filePath , source ) {

	if ( filePath.search( `${source}/elements` ) !== -1 ) {
		while ( path.dirname( path.dirname( filePath  ) ) !== `${source}/elements` ) {
			filePath = path.dirname( filePath );
		}
	} else {
		return false;
	}

	return {
		path : filePath,
		core : filePath.search( `/elements/core` ) !== -1
	};

}

module.exports = function watcher ( sourcePath , assembledPath , packagedPath , destinationPath , options ) {

	watch( sourcePath , filename => {
		const fileInfo = findFirstOrderModule( filename , sourcePath );
		if ( fileInfo && !fileInfo.core ) {
			log.changing( filename , 'change' , 'construct.module' );
			construct.element( fileInfo.path , assembledPath , packagedPath , destinationPath , options );
		} else {
			log.changing( filename , 'change' , 'construct.application' );
			construct.application.apply( this , _.toArray(arguments) );
		}
	} );

};