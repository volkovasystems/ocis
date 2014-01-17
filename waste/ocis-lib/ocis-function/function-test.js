//TEST-CASE:cloneEntity
/*var x = {
	samplea: "a",
	samplec:[ {a:1,b:1},{a:7,b:5},{a:9,b:8},{a:4,b:2}],
	sampleb: {
		suba: "a",
		subb: {
			x:{
				d:{
					e:[
					{
						a:1,
						d:{
							s:4,
							v:4,
						}
					}
					]
				}
			},
			c:[
			{
				a:7,
				b:[
				3,5,6,7
				]
			}
			]
		}

	}
};
var date = Date.now();
cloneEntity( x,
	function( cloned ){
		console.log( "Time: " + ( Date.now() - date ) + " millisecond/s" );
		x.samplea = 4;
		console.log( JSON.stringify( cloned, null, "\t" ) );
		console.log( JSON.stringify( x, null, "\t" ) );
	} )( );*/

//TEST-CASE:hashObject
/*var x = {
	samplea: "a",
	samplec:[ {a:1,b:1},{a:1,b:1},{a:9,b:8},{a:4,b:2}],
	sampleb: {
		suba: "a",
		subb: {
			x:{
				d:{
					e:[
					{
						a:1,
						d:{
							s:4,
							v:4,
						}
					}
					]
				}
			},
			c:[
			{
				a:7,
				b:[
				3,5,6,7
				]
			}
			]
		}

	}
};
var date = Date.now();
hashObject( x,
	false,
	function( object ){
		console.log( "Time: " + ( Date.now() - date ) + " millisecond/s" );
		console.log( JSON.stringify( object, null, "\t" ) );
	} )( );*/


//TEST-CASE:constructLevels
/*var x = {
	samplea: "a",
	samplec:[ {a:1,b:1},{a:1,b:1},{a:9,b:8},{a:4,b:2}],
	sampleb: {
		suba: "a",
		subb: {
			x:{
				d:{
					e:[
					{
						a:1,
						d:{
							s:4,
							v:4,
						}
					}
					]
				}
			},
			c:[
			{
				a:7,
				b:[
				3,5,6,7
				]
			}
			]
		}

	}
};*/
/*var x = [ [1,2,3,4],[5,6,7,7],[6,8,9,9] ];
var date = Date.now();
constructLevels( x,
	true,
	function( levels ){
		console.log( "Time: " + ( Date.now() - date ) + " millisecond/s" );
		console.log( JSON.stringify( levels, null, "\t" ) );
	} )( );*/


//TEST-CASE:equals
/*var x = {
	samplea: "a",
	samplec:[ {a:1,b:1},{a:1,b:1},{a:9,b:8},{a:4,b:2}],
	sampleb: {
		suba: "a",
		subb: {
			x:{
				d:{
					e:[
					{
						a:1,
						d:{
							s:4,
							v:4,
						}
					}
					]
				}
			},
			c:[
			{
				a:7,
				b:[
				3,5,6,7
				]
			}
			]
		}

	}
};
var y = {
	samplea: "a",
	samplec:[ {a:1,b:1},{a:1,b:1},{a:9,b:8},{a:4,b:2}],
	sampleb: {
		suba: "a",
		subb: {
			x:{
				d:{
					e:[
					{
						a:1,
						d:{
							s:4,
							v:4,
						}
					}
					]
				}
			},
			c:[
			{
				a:7,
				b:[
				3,5,6,7
				]
			}
			]
		}
	}
};
var date = Date.now();
equals( x,
y,
function( isequal, actual, percentage, redundancy, difference ){
	console.log( "Time: " + ( Date.now() - date ) + " millisecond/s" );
	console.log( "Is equal? " + isequal );
	console.log( "Is equal(actual)? " + actual );
	console.log( "Percentage: " + percentage + "%" );
	console.log( "Percentage redundancy: " + redundancy + "%" );
	console.log( "Percentage difference: " + difference + "%" );
} );*/

// i made changes

var x = {
	method: "cloneEntity",
	name: "Deep Clone Function",
	author: "Richeve S. Bebedor",
	status: "stable",
	version: "0.1",
	usage: "a",
	type: "utility",
	description: 
		"Fast deep cloning of objects, arrays and functions.\n"
		+ "Thanks to async.js\n\n",
	guide: "practical/common",
	interface:{
		entity: "object",
		callback: "function"
	},
	result: "object",
	type: "double-return/callback",
	errorhandler: "try-catch/throw/Error",
	todo: [
		{
			description: "Serialize functions to achieve deepest cloning.",
			done: false,
		}
	],
	xxx: [ { description: "Current execution time of 2-8 milliseconds" } ],
	revision: [],
	note: [],
	comment: [],
	testcase: "function-test.cloneEntity",
	testresult: []
};




inspectTypes( {
	samplea: "a",
	samplec: [ { a:1, b:1 }, { a:1, b:1 }, { a:9, b:8 }, { a:4, b:2 } ],
	sampleb: {
		suba: "a",
		subb: {
			x: {
				d: {
					e: [
						{
							a: 1,
							d: {
								s: "123 hi",
								v: 4,
							}
						}
					]
				}
			},
			c: [
				{
					a: "Hello world!",
					b: [ 3,5,6,7 ]
				}
			]
		}
	}
},
function( leveltypes,  typestat ){
	console.log( "Level Types: " + JSON.stringify( leveltypes, null, "\t" ) );
	console.log( "Type Statistic: " + JSON.stringify( typestat, null, "\t" ) );
} );
