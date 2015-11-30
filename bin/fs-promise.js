'use strict';
module.exports = ( function ( fs , Promise ) {


	function readdir ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.readdir( path , ( error , files ) => {

				if ( error ) reject( error );
				else resolve( files );

			} );
		} );

	};

	function ensurefile ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.ensureFile( path , error => {

				if ( error ) reject( error );
				else resolve( true );

			})

		} );

	};

	function ensureDir ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.ensureDir( path , error => {

				if ( error ) reject( error );
				else resolve( true );

			})

		} );

	};

	function readfile ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.readFile( path , 'utf8' ,( error , buffer ) => {

				if ( error ) reject( error );
				else resolve( buffer );

			});

		} );

	};

	function outputFile ( path , buffer ) {

		return new Promise( ( resolve , reject ) => {

			fs.outputFile( path , buffer , error => {

				if ( error ) reject( error );
				else resolve( true );

			});

		} );

	};

	function lstat ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.lstat( path , ( error , stats ) => {

				if ( error ) reject( error );
				else resolve( stats );

			});

		} );

	};

	function remove ( path ) {

		return new Promise( ( resolve , reject ) => {

			fs.remove( path , error => {

				if ( error ) reject( error );
				else resolve( true );

			});

		} );

	};

	function copy ( srcPath , dstPath , options ) {

		return new Promise( ( resolve , reject ) => {

			fs.copy( srcPath , dstPath , !!options ? options : {} , error => {

				if ( error ) reject( error );
				else resolve( true );

			});

		} );

	}


	return {
		readdir,
		ensurefile,
		ensureDir,
		readfile,
		outputFile,
		remove,
		copy,
	}

})( require( 'fs-extra' ) , (require( 'rsvp' )).Promise );