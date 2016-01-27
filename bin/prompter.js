module.exports = ( function ( _ ) {


	return function ( type, name, message, defaultChoice, choices ) {

		var parser = function( input ) {

			return input;

		};

		if ( type === 'array' ) {

			type = 'input';

			parser = function ( input ) {

				return input.split(' ');

			};

		}
		var options = {
			type	: type,
			name	: name,
			message	: message
		};

		if ( defaultChoice ) {

			options.default = defaultChoice;

		}

		if ( choices ) {

			options.choices = choices;

		}

		return function () {

			var done = this.async();

			this.prompt( options, function ( answers ) {

				this.config.set( name, parser( answers[ name ] ) );

				done();

			}.bind( this ) );

		};

	};

})( require( 'underscore' ) );