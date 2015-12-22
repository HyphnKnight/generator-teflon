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

		invert : {
			type : Boolean,
			value : false,
			observer : '_invertColor'
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