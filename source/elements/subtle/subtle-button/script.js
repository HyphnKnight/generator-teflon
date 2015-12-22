Polymer({

	is: "subtle-button",

	properties: {

		label : {
			type	: String,
			value	: ''
		},

		type : {
			type	: String,
			value	: 'text'
		},

		error : {
			type		: Boolean,
			value		: false,
			observer	: '_error'
		},

		value : {
			type		: Boolean,
			value		: '',
			notify		: true,
		}

	},

	ready : function ( ) {
		this._error();
		this._invertColor();
	},

	_error : function ( ) {
		this.toggleClass( 'error' , this.error );
	}

});