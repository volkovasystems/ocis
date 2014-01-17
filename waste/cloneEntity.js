//:	================================================================================================
/*
    @requireinfo-start:
        @id: "1ff42a614cd38b740d144d1775fb45d9"
        @id-end:true
        
		@variable: "_"
		@variable-end:true

		@packages: {
			"node-uuid": "npm",
			"async": "npm",
			"util": "node",
			"crypto": "node",
			"fs":"node"
		}
		@packages-end:true
	@requireinfo-end:true
*/
//	@require-start:
var _ = {
	uuid: require( "node-uuid" ),
	async: require( "async" ),
	fs: require( "fs" ),
	crypto: require( "crypto" ),
	util: require( "util" )
};
//	@require-end:true
//:	================================================================================================

//:	================================================================================================
/*:
	@methodinfo-start:
		@title: "Deep Clone Function"
		@title-end:true

		@info:
			{
				id: "b3a54e436195762ba291e385bcbbfc4d",
				method: "cloneEntity",
				name: "Deep Clone Function",
				author: "Richeve S. Bebedor",
				status: "stable",
				version: "0.1",
				usage: "a",
				methodtype: "utility",
				description:
					"Fast deep cloning of objects, arrays and functions.\n"
					+ "Thanks to async.js\n\n",
				guide: "practical/common",
				interface:{
					entity: "object",
					callback: "function"
				},
				result: "object",
				returntype: "double-return/callback",
				errorhandler: "try-catch/throw/Error",
				todo: [
					{
						description: "Serialize functions to achieve deepest cloning.",
						done: true,
					}
				],
				xxx: [ { description: "Current execution time of 2-8 milliseconds" } ],
				revision: [],
				note: [],
				comment: [],
				testcase: "function-test.cloneEntity",
                testresult: []
			}
		@info-end:true
	@methodinfo-end:true
*/
//	@method-start:
function cloneEntity( entity, callback ){
	
	try{
		return ( function( config ){

			//: Override parameters.
			config = config || {};
			entity = config.entity || entity;
			callback = config.callback || callback;

			//: Do not do anything if no parameters.
			if( !entity || !callback || typeof entity != "object" ){
				throw Error.construct( { error: "invalid parameters" } );
			}

			//: Try faster cloning.
			try{
				callback( JSON.parse( JSON.stringify( entity ) ) );
			}catch( error ){ }
			
			//: This function is for cloning arrays.
			function cloneArray( element, callback ){
				/*: 
					Clone element that is either, array or object type.
					Check also if the object is a function.
				*/
				if( typeof element == "function" ){
					cloneFunction( element, callback );
				}else if( element instanceof Array 
					|| typeof element == "object" )
				{
					cloneEntity( element,
						function( cloned ){
							callback( cloned );
						} )( );
				}else{
					callback( element );
				}
			}

			//: This function is for cloning objects.
			function cloneObject( entity, key, callback ){
				//: Clone entity with the specified key.
				if( typeof entity[ key ] == "function" ){
					cloneFunction( entity[ key ], callback );
				}else if( typeof entity[ key ] == "object" 
					|| entity[ key ] instanceof Array )
				{
					cloneEntity( entity[ key ],
						function( cloned ){
							callback( cloned );
						} )( );
				}else{
					callback( entity[ key ] );
				}
			}
			
			//: Clone the function type object.
			function cloneFunction( method, callback ){
				/*:
					In case that the function is a native function,
						we don't have to clone it.
				*/
				if( method.toString( ).indexOf( "[native code]" ) ){
					return callback( method );
				}
				
				/*:
					First we need to create the method ID.
					The method ID will be used to identify the function 
						out of many functions to be created.	
				*/
				var methodID = _.crypto.createHash( "md5" )
					.update( method.toString( ) + ":" + _.uuid.v4( ), "utf8" )
					.digest( "hex" ).toString( );
				
				//: We created this function so that we will not do the same procedure twice.
				function persistFunction( locals ){
					

					//: Try to retrieve the global path.
					var path = ( ( ( ocis || { } )
						.environment || { } )
						.reference || { } )
						.path || config.path || "";

					function writeFunction( ){
						/*:
						 	We will write the function to a temporary file using 
						 		the method ID as the file name and the variable
						 		name of the function.
						*/
						_.fs.writeFile( path + methodID + ".js", 
							"exports._" + methodID + "=" + method.toString( ),
							function( error ){
								if( error ){
									return callback( Error.construct( error ) );
								}
								//: Return the fresh function.
								method = require( "./" + methodID + ".js" )[ "_" + methodID ];
								//: Append the locals if there are any locals.
								method.locals = locals;
								callback( method );
								//: Delete the temporary file.
								_.fs.unlink( "./" + methodID + ".js" );
							} );
					}

					//: Use the overriden path.
					if( path ){
						//: Check the path.
						_.fs.stat( path,
							function( error, fileStatistics ){
								if( error ){
									return callback( Error.construct( error ) );
								}
								if( !fileStatistics.isDirectory( ) ){
									path = "";
								}
								writeFunction( );
							} );
						return;
					}
					writeFunction( );
				}
				
				//: We want to clone the locals.
				if( method.locals ){
					/*:
						Developers should attach all locals to 
							the function's "locals" variable.
					*/
					cloneEntity( method.locals, 
						function( clonedLocals ){
							persistFunction( clonedLocals );
						} );
					return;
				}
				//: If there are no locals.
				persistFunction( );
			}

			if( entity instanceof Array ){
				_.async.map( entity,
					function( element, done ){
						done( null,
							function( cache ){
								cloneArray( element,
									function( cloned ){
										cache( null, cloned );
									} );
							} );
					},
					function( error, functions ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						_.async.parallel( functions,
							function( error, cloned ){
								if( error ){
									return callback( Error.construct( error ) );
								}
								callback( cloned );
							} );
					} );
			}else if( typeof entity == "object" ){
				var clone = { };
				_.async.map( Object.keys( entity ),
					function( key, done ){
						done( null,
							function( cache ){
								cloneObject( entity, key,
									function( cloned ){
										clone[ key ] = cloned;
										cache( null );
									} );
							} );
					},
					function( error, functions ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						_.async.parallel( functions,
							function( error ){
								if( error ){
									return callback( Error.construct( error ) );
								}
								callback( clone );
							} );
					} );
			}else{
				callback( entity );
			}
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================
