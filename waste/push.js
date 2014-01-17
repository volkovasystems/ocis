//:	================================================================================================
/*
	@title: "Dynamic Push Function"
	@info:
		{
            id: ""
			method: "push",
			name: "Dynamic Push Function",
			author: "Richeve S. Bebedor",
			status: "stable",
			version: "0.1",
			usage: "c",
			methodtype: "utility",
			description:
				"This will interpret the constructed levels from the\n"
				+ "object per level and transform them again to the\n"
				+ "original constructs.\n",
			guide: "practical/common",
			interface:{
				entity: "object|array"
				value: "object|function|array|string|number|boolean"
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
function push( entity, value, key, callback ){
	try{
		return ( function( config ){
			
			//: Initialize variables.
			config = config || {};
			entity = config.entity || entity;
			value = ( config.value = config.value || value );
			key = ( config.key = config.key || key );
			callback = config.callback || callback;

			//: Trap invalid parameters.
			if( !value || !callback ){
				throw Error.construct( { error: "invalid parameters" } );
			}

			//: Initialize configurations.
			config.depth = config.depth || 0;
			config.keys = config.keys || ( key || "" ).split( "." ) || [];
			config.original = config.original || entity;

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
					config.entity 
						= entity[ currentLevel ] 
							|| ( entity[ currentLevel ] = [] );
					config.level++;
					push( null, null, null,
						function( entity ){
							callback( entity );
						} )( config );
				}else{
					config.depth++;
					//: Do we have next keys?
					if( config.depth < config.keys.length ){
						config.index = currentLevel;
						//: This is to prevent past levels from mixing with new ones.
						delete config.levels;
						delete config.level;
						push( null, null, null,
							function( entity ){
								callback( entity );
							} )( config );
						return;
					}
					//: This is the last so push the value.
					config.entity[ currentLevel ] = value;
					return callback( config.original );
				}
			}else if( !!~currentKey.indexOf( "@" ) ){
				//: If the current key denotes an object.

				if( !entity && !config.depth ){
					//: If there are no root entities.
					config.original 
						= config.entity 
						= entity 
						= new ( eval( currentKey.split( "@" )[ 1 ] ) )( );
				}else if( config.index ){
					//: If we are pointing to the current property or index.
					config.entity
						= config.entity[ config.index ]  
							|| ( config.entity[ config.index ] 
								= new ( eval( currentKey.split( "@" )[ 1 ] ) )( ) );
				}else{
					//: Normal.
					config.entity = entity;
				}

				config.depth++;
				//: Initialize the next index before pushing next.
				config.index = ( config.keys[ config.depth ] || "" ).split( ":" )[ 0 ];

				//: If we are dealing with succeeding arrays.
				if( !!~( config.keys[ config.depth ] || "" ).indexOf( ":" ) ){
					config.entity = config.entity[ config.index ] 
						|| ( config.entity[ config.index ] = [] )
				}

				//: Do we still have more keys?
				if( config.depth < config.keys.length ){
					push( null, null, null,
						function( entity ){
							callback( entity );
						} )( config );
					return;
				}
				//: This is the last so return the original.
				return callback( config.original );
			}else{
				//: If the current key denotes a property or an index.

				config.depth++;
				//: Do we still have more keys?
				if( config.depth < config.keys.length ){
					push( null, null, null,
						function( entity ){
							callback( entity );
						} )( config );
					return;
				}
				//: Push the value and return the original.
				config.entity = entity[ config.index ] = value;
				return callback( config.original );
			}
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================

exports.push = push;


