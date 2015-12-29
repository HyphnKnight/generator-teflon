Polymer({

	is: "subtle-tabs",

	properties: {

		tabs : {
			type  : Array,
			value : [ 'Wyln' , 'BungPencil' , 'New York' , 'New York' ],
			observer : '_updateSizing'
		},

		selected : {
			type : Number,
			value : 0
		},

		value : {
			type    : Boolean,
			value   : '',
			notify    : true
		}

	},

	ready : function ( ) {
		Polymer.dom.flush();
		this._updateSizing();
	},

	_selectTab : function ( e ) {
		Polymer.dom.flush();

		const index = _.indexOf(Polymer.dom(this.root.host).node.querySelectorAll('#back .possible'), e.target);

		this.translate3d( index * 100 + '%' , 0 , 0 , this.$.lens );
		this.translate3d( -1 * index / this.tabs.length * 100 + '%'  , 0 , 0 , this.$.front );

	},

	_updateSizing : function ( ) {

		Polymer.dom(this.root.host).node.style.width = this.tabs.length * 200 + 'px';
		this.$.front.style.width = this.tabs.length * 200 + 'px';

	}

});