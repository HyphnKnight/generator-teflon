Polymer({

	is: "subtle-dropdown",

	properties: {

		label : {
			type : String,
			value : ''
		},

		value : {
			type : String,
			notify: true
		},

		options : {
			type : Array,
			value : [],
			observer : '_responsiveDom'
		},

		error : {
			type : Boolean,
			value : false
		},

		invertColor : {
			type : Boolean,
			value : false,
			observer : '_invertColor'
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
		this._invertColor();
	},

	_responsiveDom : function ( ) {
		this.toggleClass( 'hover' , false );
		this.toggleClass( 'selected' , false );

		Polymer.dom.flush();

		var qOptions = Polymer.dom(this.root.host).node.querySelectorAll('subtle-dropdown-option');

		_.each( qOptions , option => {

			option.addEventListener( 'selected' , e => {
				this.options = _.chain( this.options)
					.map(option => {
						option.selected = option.value === e.detail.value;
						return option;
					} )
					.sortBy( option => { return option.selected ? 0 : 1; } )
					.value();
				this.toggleClass( 'selected' , true );
				this.toggleClass( 'hover' , false );
				this.transform( 'translate3d(0px,0px,0px) rotateZ(-45deg)' , this.$$('.arrow') );
				this.value = e.detail.value;
				this.fire( 'selected' , e.detail.value );
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
	},

	_invertColor : function ( ) {
		this.toggleClass( 'invertColor' , this.invertColor );
	}

});