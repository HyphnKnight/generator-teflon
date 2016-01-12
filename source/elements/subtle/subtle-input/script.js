Polymer({

	is: "subtle-input",

	properties: {

		label : {
			type : String,
			value : ''
		},

		type : {
			type : String,
			value : 'text'
		},

		error : {
			type : Boolean,
			value : false,
			observer : '_error'
		},

		value : {
			type		: String,
			value		: '',
			notify		: true,
			observer	: '_onChange'
		}

	},

	ready : function ( ) {
		this._error();
		this._invertColor();
	},

	_inputChange : function( e ) {
		this.value = e.target.value;
	},

	_error : function ( ) {
		this.toggleClass( 'error' , this.error );
	},

	_invertColor : function ( ) {
		this.toggleClass( 'invert' , this.invert );
	},

	_onChange : function ( ) {
		this.fire( 'change' , this.value );
	}

});