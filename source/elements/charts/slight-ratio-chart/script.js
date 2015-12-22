Polymer({
	is: "slight-ratio-chart",
	ready: function() {
		this._totalValue();
		console.log( this.data );// jshint ignore:line
	},
	properties : {
		data : {
			type : Array,
			observer : '_totalValue',
			value : [ {name: 'Ted' , value : 4 },{name:'Joe' , value : 3 },{name:'Jill' , value : 1 } ]
		},
		total : {
			type : Number,
        	readOnly: true
		}
	},
	_totalValue : function ( ) {
		this.total = _.reduce( this.data , ( datum , memo ) => {
			return memo + datum.value;
		} , 0 );
	},
	listeners: {
		'tap': 'handleClick',
		'click': 'handleClick'
	},
	handleClick : function ( ) {
	}
});