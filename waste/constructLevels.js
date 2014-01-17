var _ = {
	async: require( "async" ),
	deconstructLevels: require( "./deconstructLevels.js" ).deconstructLevels
}

//:	================================================================================================
/*
	@title: "Construct Levels Function"
	@info:
		{
            id: "f30eda1a07a5a5e16b38e2fd0a4c6aa6"
			method: "constructLevels",
			name: "Construct Levels Function",
			author: "Richeve S. Bebedor",
			status: "stable",
			version: "0.1",
			usage: "c",
			methodtype: "utility",
			description:
				"This will flatten the object into dot notated keys and their values.\n"
				+ "The values are replicated depending on their level.\n"
				+ "Minimal flag can be true or 'invert'.\n"
				+ "\tSet minimal flag to true to get only non-replicated objects.\n"
				+ "\tSet minimal flag to 'invert' to get only replicated objects.\n"
				+ "Arrays are denoted by colon followed by the index value.\n",
			guide: "practical/common",
			interface:{
				object: "object",
				minimal: "boolean|string",
				callback: "function"
			}
			result: [ { name: "levels", type: "object" } ],
			returntype: "double-return/callback",
			errorhandler: "try-catch/throw",
			todo: [],
			xxx: [ { description: "Current execution time of 2 milliseconds." } ],
			revision: [],
			note: [],
			comment: [],
			testcase: "function-test.constructLevels",
			testresult: []
		}
	@info-end:true
	@method:
*/
function constructLevels( object, minimal, callback ){
	try{
		return ( function( config ){
			
			//: Override configurations.
			config = config || {};
			object = config.object || object;
			minimal = config.minimal || minimal;
			callback = config.callback || callback;

			if( !object || !callback ){
				throw Error.construct( { error: "invalid parameters" } );
			}
			
			config.minimize = config.minimize || function( levels ){
				if( minimal ){
					for( var key in levels ){
						if( typeof levels[ key ] != "object" 
							&& minimal == "invert" )
						{
							delete levels[ key ];
						}else if( typeof levels[ key ] == "object" 
							&& minimal != "invert" )
						{
							delete levels[ key ];
						}
					}
				}
			};

			config.current = config.current || "";
			config.levels = config.levels || {};

			var current = "";
			if( object instanceof Array ){
				_.async.forEach( object,
					function( element, done ){
						current = config.current + ":" + object.indexOf( element );
						config.levels[ current ] = element;
						if( typeof element == "object" ){
							constructLevels( element, minimal,
								function( levels ){
									if( levels instanceof Error ){
										return done( levels )
									}
									done( );
								} )( {
									current: current,
									levels: config.levels,
									minimize: config.minimize
								} );
							return;
						}
						done( );
					},
					function( error ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						config.minimize( config.levels );
						callback( config.levels );
					} );
			}else if( typeof object == "object" ){
				if( object.constructor ){
					config.current = ( ( config.current )? ( config.current + "." ) : "" ) 
						+ "@" + object.constructor.name;
					config.levels[ config.current ] = object.constructor.toString( );
				}
				_.async.forEach( Object.keys( object ),
					function( key, done ){
						current = config.current + ( ( config.current )? "." : "" ) + key;
						config.levels[ current ] = object[ key ];
						if( typeof object[ key ] == "object" ){
							constructLevels( object[ key ], minimal,
								function( levels ){
									if( levels instanceof Error ){
										return done( levels )
									}
									done( );
								} )( {
									current: current,
									levels: config.levels,
									minimize: config.minimize
								} );
							return;
						}
						done( );
					},
					function( error ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						config.minimize( config.levels );
						callback( config.levels );
					} );
			}else{
				callback( );
			}
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================
