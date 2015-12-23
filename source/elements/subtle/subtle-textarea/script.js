Polymer({

	is: "subtle-textarea",

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
			type : String,
			value : '',
			notify: true
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
	}

});