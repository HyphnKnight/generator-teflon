Polymer({

	is: "subtle-dropdown-option",

	properties: {

		index : {
			type : Number,
			value : 1,
			observer : '_reposition'
		},

		option : {
			type : String
		}

	},

	ready : function ( ) {
		this._reposition();
	},

	_reposition : function ( ) {
		this.transform('translate3d(0,' + this.index * 30 + 'px,0)');
	},

	_select : function ( ) {
		this.fire ( 'selected' , this.option );
	},

	_hoverOver : function ( ) {
		this.fire( 'hoverOver' , this.index );
	},

	listeners: {
		'click' : '_select',
		'mouseover' : '_hoverOver'
	}

});