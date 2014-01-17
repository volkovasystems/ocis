//:	================================================================================================
/*
	@title: "Dynamic Pull Function"
	@info:
		{
            id: ""
			method: "pull",
			name: "Dynamic Pull Function",
			author: "Richeve S. Bebedor",
			status: "stable",
			version: "0.1",
			usage: "c",
			methodtype: "utility",
			description:""
			guide: "practical/common",
			interface:{
				entity: "object|array"
				key: "string"
				callback: "function"
			}
			result: [ { name: "entity", type: "object|array" } ],
			returntype: "double-return/callback",
			errorhandler: "try-catch/throw",
			todo: [],
			xxx: [],
			revision: [],
			note: [],
			comment: [],
			testcase: "function-test.push",
			testresult: []
		}
	@info-end:true
	@method:
*/
function pull( entity, key, callback ){
	try{
		return ( function( config ){
			
			//: Initialize variables.
			config = config || {};
			entity = config.entity || entity;
			key = ( config.key = config.key || key );
			callback = config.callback || callback;

			//: Trap invalid parameters.
			if( !key || !callback ){
				throw Error.construct( { error: "invalid parameters" } );
			}

			//: Entity is null so we cannot proceed.
			if( !entity ){
				return callback( entity );
			}

			//: Initialize configurations.
			config.depth = config.depth || 0;
			config.keys = config.keys || ( key || "" ).split( "." ) || [];
		
			var currentKey = config.keys[ config.depth ] || "";

			//: If we identified that the current key denotes an array.
			if( !!~currentKey.indexOf( ":" )
				&& entity instanceof Array )
			{
				//: Separate everything from the indexes of the levels.
				config.levels = config.levels 
					|| currentKey.split( ":" ).toString( ).match( /\d/g );
				config.level = config.level || 0;

				var currentLevel = config.levels[ config.level ];

				//: Insert levels.
				if( config.level < config.levels.length - 1 ){
					config.entity = entity[ currentLevel ];
					config.level++;
					pull( null, null, null,
						function( value ){
							callback( value );
						} )( config );
				}else{
					config.depth++;
					//: Do we have next keys?
					if( config.depth < config.keys.length ){
						config.index = currentLevel;
						//: This is to prevent past levels from mixing with new ones.
						delete config.levels;
						delete config.level;
						pull( null, null, null,
							function( value ){
								callback( value );
							} )( config );
						return;
					}
					//: This is the last so pull the value.
					return callback( config.entity[ currentLevel ] );
				}
			}else if( !!~currentKey.indexOf( "@" ) ){
				//: If the current key denotes an object.
				if( config.index ){
					//: If we are pointing to the current property or index.
					config.entity = config.entity[ config.index ];
				}else{
					//: Normal.
					config.entity = entity;
				}

				config.depth++;
				//: Initialize the next index before pushing next.
				config.index = ( config.keys[ config.depth ] || "" ).split( ":" )[ 0 ];

				//: If we are dealing with succeeding arrays.
				if( !!~( config.keys[ config.depth ] || "" ).indexOf( ":" ) ){
					config.entity = config.entity[ config.index ];
				}

				//: Do we still have more keys?
				if( config.depth < config.keys.length ){
					push( null, null, null,
						function( value ){
							callback( value );
						} )( config );
					return;
				}
				//: This is the last so return the original.
				return callback( config.entity );
			}else{
				//: If the current key denotes a property or an index.

				config.depth++;
				//: Do we still have more keys?
				if( config.depth < config.keys.length ){
					push( null, null, null,
						function( value ){
							callback( value );
						} )( config );
					return;
				}
				//: Push the value and return the value.
				return callback( entity[ config.index ] );
			}

		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================

exports.pull = pull;


