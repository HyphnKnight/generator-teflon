module.exports = ( function ( _ ) {
	'use strict';


	return function ( type, name, message, defaultChoice, choices ) {

		let parser = input => input;

		const options = {
			type	: type,
			name	: name,
			message	: message
		};

		if ( options.type === 'array' ) {

			options.type = 'input';

			parser = input => input.split(' ');

		}

		if ( defaultChoice ) {

			options.default = defaultChoice;

		}

		if ( choices ) {

			options.choices = choices;

		}

		return function () {

			var done = this.async();

			this.prompt( options, answers => {

				this.config.set( name, parser( answers[ name ] ) );

				done();

			} );

		};

	};

})( require( 'underscore' ) );