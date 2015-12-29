Polymer({

	is: "subtle-dropdown",

	properties: {

		// Data Properties

		value : {
			type : String,
			notify: true,
			observer : '_valueChange'
		},

		options : {
			type : Array,
			value : [ 'Hat' , 'Belt' , 'Tie' ],
			observer : '_responsiveDom'
		},

		// State Properties

		error : {
			type : Boolean,
			value : false,
			observer : '_stateChange'
		},

		disable : {
			type : Boolean,
			value : false,
			observer : '_stateChange'
		},

		// Display Properties

		label : {
			type : String,
			value : 'Place Holder'
		},

		autowidth : {
			type : Boolean,
			value : false
		}

	},

	listeners: {
		'mouseover' : '_hoverOn',
		'mouseout' : '_hoverOff'
	},

	ready : function ( ) {
		this._responsiveDom();
	},

	_valueChange : function ( ) {
		this.fire( 'valueChange' , this.value );
	},

	_stateChange : function ( ) {
		this.toggleClass( 'error' , this.error && !this.disable );
		this.toggleClass( 'disabled' , this.disable );
	},

	_responsiveDom : function ( ) {

		this.toggleClass( 'hover' , false );
		this.toggleClass( 'selected' , false );

		Polymer.dom.flush();

		var qOptions = Polymer.dom( this.root.host ).node.querySelectorAll( 'subtle-dropdown-option' );

		_.each( qOptions , option => {

			option.addEventListener( 'selected' , e => {
				this.options = _.sortBy( this.options , option => { return option === e.detail ? 0 : 1; } );
				this.toggleClass( 'selected' , true );
				this.toggleClass( 'hover' , false );
				this.transform( 'translate3d(0px,0px,0px) rotateZ(-45deg)' , this.$$('.arrow') );
				this.value = e.detail;
				this.fire( 'selected' , e.detail );
			} );

			option.addEventListener( 'hoverOver' , e => {
				this.transform( 'translate3d(0px,' + ( Number(e.detail) * 30) + 'px,0px) rotateZ(-45deg)' , this.$$('.arrow') );
			} );

		}  );

		if ( this.autowidth ) this._autowidth( qOptions );

		this.$$('.bg').style.height = qOptions.length * 30 + 'px';

	},

	_autowidth : function ( domEl ) {

		var maxWidth = 0;

		_.each( domEl  , option => { maxWidth = maxWidth > option.offsetWidth ? maxWidth : option.offsetWidth; } );

		this.root.host.style.width = maxWidth + 'px';

	},

	_hoverOn : function () {
		this.toggleClass( 'hover' , true );
	},

	_hoverOff : function () {
		this.toggleClass( 'hover' , false );
		this.transform( 'translate3d(0,0,0) rotateZ(-45deg)' , this.$$('.arrow') );
	}

});