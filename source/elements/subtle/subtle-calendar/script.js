Polymer({

	is: "subtle-calendar",

	properties: {

		year : {
			type : Number,
			value : (new Date()).getFullYear()
		},

		month : {
			type : Number,
			value : (new Date()).getMonth()
		},

		selectedTime : {
			type : Date
		},

		monthNames : {
			type : Array,
			value : [ 'JAN' , 'FEB' , 'MAR' , 'APR' , 'MAY' , 'JUN' , 'JUL' , 'AUG' , 'SEP' , 'OCT' , 'NOV' , 'DEC' ]
		},

		daysInEachMonth : {
			type : Array,
			value : [ 31 , 28 , 31 , 30 , 31 , 30 , 31 , 31 , 30 , 31 , 30 , 31 ]
		}

	},

	observers: [
		'_dateChange( year , month , daysInEachMonth )'
	],

	ready : function ( ) {
	},

	_dateChange : function ( currentYear , currentMonth , daysInEachMonth ) {

		Polymer.dom.flush();

		const bufferNum = this._buffer( currentYear , currentMonth );

		_.each( Polymer.dom(this.root.host).node.querySelectorAll('.day') , ( day , index ) => {
			if ( daysInEachMonth[currentMonth] > index ) {
				this.toggleClass( 'hidden' , false , day );
			} else {
				this.toggleClass( 'hidden' , true , day );
			}
			this._transform( day , index , bufferNum );
		});

	},

	// UTILITY

	_daySuffix : function( date ) {
		date %= 10;
		return ['st', 'nd', 'rd', 'th'][(date >= 4 || date === 0 ? 3 : date - 1)];
	},

	_buffer : function ( year , month ) {

		let firstDayOfMonth = new Date();
		firstDayOfMonth.setFullYear(year);
		firstDayOfMonth.setMonth(month);
		firstDayOfMonth.setDate(1);

		return firstDayOfMonth.getDay();
	},

	_transform : function( el , date , bufferNum ) {

		this.translate3d( Math.floor((bufferNum + date) % 7) * 50 + 'px' , Math.floor((bufferNum + date) / 7) * 50 + 'px' , 0 , el );

		this.toggleClass( 'mod-faded' , true , el );

		const fadeAway = window.setTimeout(() => {
			this.toggleClass( 'mod-faded' , false , el );
			window.clearTimeout( fadeAway );
		}, 100);

	},

	_leftArrow : function (  ) {
		if ( this.month <= 0 ) {
			this.month = 11;
			--this.year;
		} else {
			--this.month;
		}
	},

	_rightArrow : function (  ) {
		if ( this.month === 11 ) {
			this.month = 0;
			++this.year;
		} else {
			++this.month;
		}
	},

	_parseDate : function ( year , month , monthNames ) {

		return `${monthNames[month]} ${year}`;

	}

});