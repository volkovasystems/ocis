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

					//: Use the override path.
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

//:	================================================================================================
/*
	@methodinfo-start:
		@title: "Hash Entity Function"
		@title-end:true
		@info:
			{
                id: "69339c2b239691cff22584f4c98b765d",
				method: "hashEntity",
				name: "Hash Entity Function",
				author: "Richeve S. Bebedor",
				status: "stable",
				version: "0.1",
				usage: "a",
				methodtype: "utility",
				description:
					"Gives random hash ID for entity or a random hash ID\n"
					+ "	specified with identity.\n"
					+ "Hash is random if there is a presence of tilde character.\n"
					+ "Appends the hashed identity if present.\n\n"
					+ "Format:\n"
					+ "\t~<hashed-entity>:<optional:hashed-identity>\n\n",
				guide: "practical/common",
				interface:{
					identity: "value",
					callback: "function"
				},
				result: "string",
				returntype: "single-return/callback",
				errorhandler: "try-catch/throw",
				todo: [],
				xxx: [],
				revision: [],
				note: [],
				comment: [],
				testcase: "function-test.hashEntity",
				testresult: []
			}
		@info-end:true
	@methodinfo-end:true
*/
//	@method-start:
function hashEntity( identity, callback ){
    /*:
        Generally, all objects contains randomized hashed identities. 
        This enables similar object structures to be unique.
    */
	try{
		var result = "~" +  _.crypto.createHash( "md5" )
			.update( _.uuid.v4( ), "utf8" )
			.digest( "hex" ).toString( )
				+ ( ( identity )? //: Is there an identity supplied?
					( ":" + identity ) //: Append
					: "" ); //: Do nothing

		if( callback ){
			return callback( result );
		}
		return result;
	}catch( error ){
		
	}
}
//	@method-end:true
//:	================================================================================================

//:	================================================================================================
/*
    @methodinfo-start:
        @title: "Hash Identity Function"
        @info:
            {
                method: "hashIdentity",
                name: "Hash Identity Function",
                author: "Richeve S. Bebedor",
                status: "stable",
                version: "0.1",
                usage: "a",
                methodtype: "utility",
                description:
                    "Gives the hash ID of the object based on the structure of the object.",
                guide: "practical/common"
                interface:{
                    object: "object",
                    callback: "function"
                }
                result: "string",
                returntype: "single-return/callback",
                errorhandler: "try-catch/throw",
                todo: [],
                xxx: [],
                revision: [],
                note: [],
                comment: [],
                testcase: "function-test.hashIdentity",
                testresult: []
            }
        @info-end:true
    @methodinfo-end:true
*/
//  @method-start:
function hashIdentity( object, callback ){
	try{
		var entity = ( typeof object == "function" )? 
			object.toString( ) 
			: _.util.inspect( object );
		
		var result = _.crypto.createHash( "md5" )
			.update( entity, "utf8" )
			.digest( "hex" ).toString( );
		
		if( callback ){
			return callback( result );
		}
		return result;
	}catch( error ){
		throw Error.construct( error );
	}
}
//  @method-end:true
//:	================================================================================================

//:	================================================================================================
/*
	@title: "Hash Object Function"
    @title-end:true
	@info:
		{
            id: "b72fcba1d5fc73cee377d1471f78d6e2"
			method: "hashObject",
			name: "Hash Object Function",
			author: "Richeve S. Bebedor",
			status: "stable",
			version: "0.1",
			usage: "c",
			methodtype: "utility",
			description:
				"Append hash details to each object container of key with value of object type.\n"
				+ "Strict employs hashing of identity without random values.\n\n",
			guide: "practical/common",
			interface:{
				object: "object",
				strict: "boolean",
				callback: "function"
			}
			result: "object",
			returntype: "double-return/callback",
			errorhandler: "try-catch/throw",
			todo: [
				{
					description: "Optimize more.",
					done: false
				}
			],
			xxx: [ { description: "Current execution time of 5|6-8|49 milliseconds." } ],
			revision: [],
			note: [],
			comment: [],
			testcase: "function-test.hashIdentity",
			testresult: []
		}
	@info-end:true
	@method:
*/
function hashObject( object, strict, callback ){
	try{
		return ( function( config ){
			//: Override parameter values.
			object = config.object || object;
			strict = config.strict || strict;
			callback = config.callback || callback;

			function generateHash( ){
				object[ "@hashUID" ] = hashEntity( hashIdentity( object ) );
				if( strict && !object[ "@hashID" ] ) object[ "@hashID" ] = hashIdentity( object );
			}
			
			function hash( entity, callback ){
				try{
					hashObject( entity, strict,
						function( error ){
							callback( error );
						} )( );
				}catch( error ){
					callback( error );
				}
			}
			var keys = Object.keys( object );
			//: Do we have more keys?
			if( keys.length ){
				//: Create the key and supply the hash ID.
				generateHash( );
				//: Traverse all objects.
				_.async.forEach( keys,
					function( key, doneHashing ){
						if( object[ key ] instanceof Array ){
							_.async.forEach( object[ key ],
								function( element, doneHashing ){
									hash( element, doneHashing );
								},
								function( error ){
									doneHashing( error );
								} );
						}else if( typeof object[ key ] == "object" ){
							hash( object[ key ], doneHashing );
						}else{
							doneHashing( error );
						}
					},
					function( error ){
						callback( error || object );
					} );
			}else if( typeof object == "object" ){
				//: This is a single key object.
				generateHash( );
				callback( object );
			}
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================

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
	return ( function( config ){
		
		//: Prepare the function to be less error prone
		if( config || !object || !callback ){
			//: We provide alternatives if parameters are not existing
			object = ( config || {} ).object || object;
			calllback = ( config || {} ).callback || callback;
		}
		
		/*: 
			If callback is not existing we invalidate the request
				to this function.
		*/
		if( !callback ){
			return null;
		}
		
		//: Callback exists but there is no request parameters.
		if( !object ){
			return callback( );
		}
		
		function minimize( levels ){
			if( minimal ){
				for( var key in levels ){
					if( minimal == "invert" && typeof levels[ key ] != "object" ){
						delete levels[ key ];
					}else if( minimal != "invert" && typeof levels[ key ] == "object" ){
						delete levels[ key ];
					}
				}
			}
		}
		if( !config ) config = {};
		config.current = config.current || "";
		config.levels = config.levels || {};
		var _current = "";
		if( object instanceof Array ){
			_.async.forEach( object,
				function( element, done ){
					_current = config.current + ":" + object.indexOf( element );
					config.levels[ _current ] = element;
					if( typeof element == "object" ){
						constructLevels( element,
							minimal,
							function( _levels ){
								if( !( _levels instanceof Error ) ){
									for( var key in _levels ){
										config.levels[ key ] = _levels[ key ];
									}
								}
								done( ( ( _levels instanceof Error )? _levels : null ) );
							} )( {
								current: _current,
								levels: config.levels
							} );
					}else{
						done( );
					}
				},
				function( error ){
					minimize( config.levels );
					callback( error || config.levels );
				} );
		}else if( typeof object == "object" ){
			var keys = Object.keys( object );
			_.async.forEach( keys,
				function( key, done ){
					_current = config.current + ( ( config.current )? "." : "" ) + key;
					config.levels[ _current ] = object[ key ];
					if( typeof object[ key ] == "object" ){
						constructLevels( object[ key ],
							minimal,
							function( _levels ){
								if( !( _levels instanceof Error ) ){
									for( var key in _levels ){
										config.levels[ key ] = _levels[ key ];
									}
								}
								done( ( ( _levels instanceof Error )? _levels : null ) );
							} )( {
								current: _current,
								levels: config.levels
							} );
					}else{
						done( );
					}
				},
				function( error ){
					minimize( config.levels );
					callback( error || config.levels );
				} );
		}
	} );
}
// @method-end:true
//:	================================================================================================

//:	================================================================================================
function verifyParameters( interface, parameters, callback ){
	/*:
		Interface is an object type entity containing conditions
			regarding the parameters.
	*/
}
//:	================================================================================================

//:	================================================================================================
function inspectType( value, verbose ){
    try{
        //: Turn the verbosity off, true by default
        if( typeof verbose == "boolean" && !verbose ){
            return inspectType( value ).split( ":" )[ 0 ];
        }
        //: If it is not false as per dynamic casting to boolean of javascript.
        if( value ){
            //: Analyze first if empty. This will prevent further errors.
            var _value = JSON.stringify( value );
            if( ( _value === "[]" || _value === "{}" )
                && ( value || {} ).constructor.name.toLowerCase( ) == ( typeof value ) )
            {
                return ( typeof value ) + ":empty";
            }else if( typeof value != "object" ){
                //: If it is not an object then it can be a number, string or boolean(true)
                if( typeof value == "number" ){
                    return typeof value + ":"
                      + ( ( !!~( "" + value ).indexOf( "." ) )? "float":"integer" );
                }
                if( typeof value == "string" ){
                    var numeric = 0;
                    var symbolic = 0;
                    var alpha = 0;
                    var ALPHA = 0;
                    var subtype = "";
                    if( !!( numeric = ( value.match( /[0-9]/g ) || [] ).length ) ){
                        subtype = "numeric";
                    }
                    if( !!( symbolic = ( value.match( /\W/g ) || [] ).length ) ){
                        subtype = "symbolic";
                    }
                    if( !!( alpha = ( value.match( /[a-z]/g ) || [] ).length ) ){
                        subtype = "alpha";
                    }
                    if( !!( ALPHA = ( value.match( /[A-Z]/g ) || [] ).length ) ){
                        subtype = "ALPHA";
                    }
                    if( alpha && ALPHA ){
                        subtype = "Alpha";
                    }
                    if( numeric && symbolic ){
                        subtype = "numericalsymbolic";
                    }
                    if( numeric && alpha ){
                        subtype = "alphanumeric";
                    }
                    if( numeric && ALPHA ){
                        subtype = "ALPHANUMERIC";
                        if( alpha ){
                            subtype = "AlphaNumeric";
                        }
                    }
                    if( symbolic && alpha ){
                        subtype = "alphasymbolic";
                    }
                    if( symbolic && ALPHA ){
                        subtype = "ALPHASYMBOLIC";
                        if( alpha ){
                            subtype = "AlphaSymbolic";
                        }
                    }
                    if( numeric && symbolic && alpha ){
                        subtype = "mixed";
                    }
                    if( numeric && symbolic && ALPHA ){
                        subtype = "MIXED";
                        if( alpha ){
                            subtype = "Mixed";
                        }
                    }
                    return typeof value + ":" + subtype
                        + "(" + symbolic + "," + numeric + "," + alpha + "," + ALPHA + ")";
                }
                return typeof value;
            }
            var name = ( value || {} ).constructor.name;
            return name + ":" + ( typeof value )
                + ( ( name == "Array" )? "[" + value.length + "]"
                    : "{" + Object.keys( value ).length + "}" );
        }
            //: If it is false.
        return ( typeof value
            + ( ( value === null )? ":null"
                : ( ( value === undefined )? ":undefined"
                : ( isNaN( value )? ":NaN"
                : ( ( value === "" || value === 0 )? ":empty"
                : ( ( typeof value == "boolean" )? ""
                : ":unknown" ) ) ) ) ) );
    }catch( error ){
        throw {
            name: "error:inspectType",
            message: error.message,
            tracePath: null,
            date: Date.now( )
        };
    }
}
// @method-end:true
//:	================================================================================================

//:	================================================================================================
/*:
	This will inspect the types of values inside the object.
	The result will be the format of dot notated level and type value object
		and the statistics for the redundancy count of types.
*/
function inspectTypes( object, verbose, callback ){
    try{
        return ( function( config ){
            if( typeof object != "object" || typeof object != "function" ){
                callback( inspectType( object, verbose ) );
                return;
            }
            //: We don't want to harm the object.
            cloneEntity( object,
            function( cloned ){
                constructLevels( cloned, null,
                function( levels ){
                    var levelkeys = Object.keys( levels );
                    var leveltypes = {};
                    _.async.map( levelkeys,
                    function( levelkey, cachetype ){
                        leveltypes[ levelkey ] = inspectType( levels[ levelkey ], verbose );
                        cachetype( null, leveltypes[ levelkey ] );
                    },
                    function( error, types ){
                        var typestat = {};
                        var basictype = "";
                        for( var i in types ){
                            if( verbose || verbose === null ){
                                basictype = types[ i ].split( ":" )[ 0 ];
                                typestat[ basictype ] = ( typestat[ basictype ] + 1 ) || 1;
                            }
                            typestat[ types[ i ] ] = ( typestat[ types[ i ] ] + 1 ) || 1;
                        }
                        callback( error || leveltypes, ( ( error )? null : typestat ) );
                    } );
                } )( );
            } )( );
        } );
    }catch( error ){
        throw {
            name: "error:inspectTypes",
            message: error.message,
            tracePath: null,
            date: Date.now( )
        };
    }
}
// @method-end:true
//:	================================================================================================

/*inspectTypes( {key:{}},
	false,
	function( leveltypes, typestat ){
		console.log( JSON.stringify( typestat ) );
	} );*/

//:	================================================================================================
function DArray( datastruct, callback ){
	if( datastruct instanceof Array ){

	}else if( typeof datastruct == "object" && datastruct ){

	}else{

	}
}
//:	================================================================================================

//:	================================================================================================
/*
	@title: "Complex Equals Function"
	@info:
		{
			method: "equals",
			name: "Complex Equals Function",
			author: "Richeve S. Bebedor",
			status: "stable",
			version: "0.1",
			usage: "c",
			methodtype: "utility",
			description:
				"Measures objects' varying equality.\n"
				"Equality variation factors:\n"
				"\t[a] Actual percentage is the true percentage.\n"
				"\t[b] Real percentage is the acceptable percentage.\n"
				"\t[c] Redundancy is the percentage that entities re-occures.\n"
				"\t[e] Difference is the percentage error difference.\n"
				"This will return the real equality and the actual equality.\n\n",
			guide: "practical/common",
			interface:{
				object: "object",
				comparator: "object",
				callback: "function"
			}
			result: "object",
			returntype: "single-return/callback",
			errorhandler: "try-catch/throw",
			todo: [
				{
					description: "Optimize more.",
					done: false
				}
			],
			xxx: [ { description: "Current execution time of 22-100 milliseconds." } ],
			revision: [],
			note: [],
			comment: [],
			testcase: "function-test.constructLevels",
			testresult: []
		}
	@info-end:true
	@method:
*/
function equals( object, comparator, callback ){
	if( typeof object != typeof comparator
        || object instanceof Array
        || comparator instanceof Array )
	{
		/*:
			If the type of the object and comparator is different,
				and the instance of object or comparator is an Array
				we will have a different approach.
			So what we can do is, level the object and comparator
				and find any equality.
			If either, the comparator or the object is an object type,
				then it must be converted to array.
			Object types will be converted into DArray instances.
			The main logic here is we cannot compare array to JSON structured objects.
		*/
		return;
	}

	/*:
		If the type of the object and compartor is object then we can compare.
		We have the following levels of comparing objects.
			1. Compare outer hash.
			2. Compare individual hashes (except outer hash)
				and get the percentage comparability.
			3. Compute the number of levels
				depending on the structure.

		If each rule level fails, it will proceed to the next level until false.
	*/
	var isequal = false;
	cloneEntity( object,
	function( cloneobject ){
		cloneEntity( comparator,
		function( clonecomparator ){
			hashObject( cloneobject,
			true,
			function( cloneobject ){
				/*:
					console.log( "Hashed cloned object:\n"
					+ JSON.stringify( cloneobject, null, "\t" ) );
				*/
				hashObject( clonecomparator,
				true,
				function( clonecomparator ){
					/*:
						console.log( "Hashed cloned comparator:\n"
						+ JSON.stringify( clonecomparator, null, "\t" ) );
					*/
					constructLevels( cloneobject,
					null,
					function( objectlevels ){
						/*:
							console.log( "Leveled hashed cloned object:\n"
							+ JSON.stringify( objectlevels, null, "\t" ) );
						*/
						for( var key in objectlevels ){
							if( !~key.indexOf( "@hashid" ) ){
								delete objectlevels[ key ];
							}
						}

						var objectkeys = Object.keys( objectlevels );
						var objectlevelcount = objectkeys.length;

						constructLevels( clonecomparator,
						null,
						function( comparatorlevels ){
							/*:
								console.log( "Leveled hashed cloned comparator:\n"
								+ JSON.stringify( comparatorlevels, null, "\t" ) );
							*/
							for( var key in comparatorlevels ){
								if( !~key.indexOf( "@hashid" ) ){
									delete comparatorlevels[ key ];
								}
							}

							if( objectlevels[ "@hashid" ] == comparatorlevels[ "@hashid" ] ){
								isequal = true;
							}

							/*:
								console.log( "Leveled hashed cloned object hashids:\n"
								+ JSON.stringify( objectlevels, null, "\t" ) );
								console.log( "Leveled hashed cloned comparator hashids:\n"
								+ JSON.stringify( comparatorlevels, null, "\t" ) );
							*/

							var comparatorkeys = Object.keys( comparatorlevels );
							var comparatorlevelcount = comparatorkeys.length;
							var matchCount = 0;
							var unmatches = 0;

							_.async.forEach( objectkeys,
							function( objectkey, objectdone ){
								_.async.forEach( comparatorkeys,
								function( comparatorkey, comparatordone ){
									var comparatorhashid = comparatorlevels[ comparatorkey ];
									var objecthashid = objectlevels[ objectkey ];
									if(  comparatorhashid == objecthashid ){
										matchCount++;
									}else if( comparatorkey == objectkey ){
										unmatches++;
									}
									comparatordone( );
								},
								function( error ){
									objectdone( error );
								} );
							},
							function( error ){
								if( error ){
									return callback( false, error );
								}
								//: console.log( "Matches: " + matchCount );
								var average = ( objectlevelcount + comparatorlevelcount ) / 2;
								//: console.log( "Average: " + average );
								var redundancy = ( matchCount > average )?
									Math.abs( matchCount - average ) : 0;
								redundancy = ( redundancy / average ) * 100;
								//: console.log( "Redundancy: " + redundancy + "%" );
								var difference = ( unmatches / average ) * 100;
								//: console.log( "Difference: " + difference + "%" );
								var percentage = ( matchCount / average ) * 100;
								console.log( "Percentage: " + percentage + "%" );
								var netpercentage = percentage - difference - redundancy;
								//: console.log( "Net percentage: " + netpercentage + "%" );
								redundancy = Math.floor( redundancy );
								netpercentage = Math.floor( netpercentage );
								difference = Math.floor( difference );
								callback( isequal || netpercentage > 50, //: acceptable truth
									netpercentage == 100, //: actual truth
									netpercentage, //: actual percentage
									redundancy, //: number of matching identities
									difference ); //: number of erroneous/unmatching identities
							} );
						},
						true )( );
					},
					true )( );
				} )( );
			} )( );
		} )( );
	} )( );
}
// @method-end:true
//:	================================================================================================

//:	================================================================================================
/*:
    This will check if the object is pure dot notated
        or has high probability that it is a dot notated object.
    
    Criteria if it is dot notated:
        1. Either single key string or dot notated.
        2. Contains value or arrays that does not contain nested objects.
        3. The percentage variation of single key string vs dot notated is 1:2
        4. If the object is single key value pair and the value is not nested objects
            then it can be considered as pure dot notated.
    
    This will return either true or false.
    This will only analyze pure dot notated object.
    Single key strings are considered dot notated.
*/
function isDotNotated( object, callback ){
    try{
        cloneEntity( object,
            function( clone ){
                inspectTypes( clone, false,
                    function( levelTypes, typeStatistics ){
                        callback( !~Object.keys( typeStatistics ).indexOf( "object" )
                            || !~Object.keys( typeStatistics ).indexOf( "function" ) );
                } )( );
            } );        
    }catch( error ){
    	throw constructBasicError( error, 
			object, 
			Date.now( ), 
			isDotNotated, 
			callback )( );
    }
}
//:	================================================================================================

//:	================================================================================================
function indexOf( entity, search, origin, index, starting, callback ){
    /*:
        Complex indexOf function for extracting indexes in either object, array or string.
            It can also extract the specified entity starting from a specified index of 
            occurrence of the search query.
        
        Entity can be an object, array, or string.
            [*] object
            [*] array
            [*] string
            
        Search can be a string, hash ID, regular expression.
            [*] string
                If the search is a verified normal string, it will always denote
                    a key or value (if the key's value is a string
                    or if converted to string matches the search) iff the entity is an object.
                It will denote a string token if the entity is a string.
                It will denote a value match if the entity is an array.
            [*] hash ID
                If the string contains tilde(~) followed by 32 characters followed 
                    by colon(:) then another 32 characters. Then the string is 
                    a hashed entity ID. This will search for matching hash IDs.
            [*] regex
            
   
        Origin can be start and end. It denotes what is the flow of the search.
            By default the origin is true, if the origin is false then start it at the end.
        
        Index denotes that it should cut the terminals starting from that index 
        	and disregard that token.
        	
    	Starting denotes the starting point of the search. This can be an index or a key.
    */
    cloneEntity( entity,
        function( clonedEntity ){
            inspectTypes( clonedEntity,
                function( levelTypes, typeStatistics ){
                    if( typeof levelTypes == "string" ){
                        //: We will now only accept string token, and regex
                        if( search instanceof RegExp || typeof search == "string" ){
                            if( ( starting !== null || starting!== undefined ) 
                                && typeof starting == "number" )
                            {
                                //var tokens = entity.split( search );
                                
                                //var  = entity.indexOf( tokens[ startat ] ) - 1;
                                
                            }else{
                                
                            }
                        }else{
                            //: We cannot support it as of the moment
                            callback( { 
                                warning: {
                                    name: "warning:indexOf",
                                    message: "search query not supported",
                                    tracePath: null,
                                    date: Date.now( )
                                }
                            } );
                        }
                    }else{
                        
                    }
                } )( );
        } )( );
}
//:	================================================================================================

//:	================================================================================================
/*:
	id: "2f4db74fadb70e2a05f1284789aae123"
	Complex contains() function for determining content existence.
	Containment is determined by the search query.
	Searching is limited to level. Zero level means traverse the entire object.
	Search query values must be unique as much as possble as required.
	Results will return true or false, locations matching the search query
		and the redundancy count per query.


	Search query formats:
		[1] Searching through array:
			[a] You can search using another array structure with search values inside.
				The method will match all the values inside the search array.
				All possible structures are supported.
				Possible search value can be:
					[*] RegExp
					[*] Array
					[*] object
					[*] function
					[*] string
					[*] number
					[*] boolean

				Format:
					[
						<search value>,
						<...>,
						[
							<...>,
							<[...]>,
							...
						],
						...
					]

				Example:
					[[1,2,3],["a","b",["hello"]]]

				*NOTE: If you use regular expressions,
					it will return to you the match count and the matches.

			[b] You can search using the object search format(OSF).
				OSF contains index and value.
				OSF can be single valued or multi-valued.
				Additional feature is that you can mix single valued format
					with multi-valued format.
				When you provide the index, the method will search
					for all possible values using the index
					(search is limited to the given index).

				Format:
					[single valued]
						{
							index: <index number>,
							value: <number, string, regex or boolean>
						}
					[multi-valued]
						{
							indexrange: [<array of index numbers>],
							valuerange: [<array of number, string, regex or boolean>]
						}
					[mixed(example)]
						{
							index: <index number>,
							valuerange: [<array of number, string, regex or boolean>]
						}

				*NOTE: If you use regular expressions,
					it will return to you the match count and the matches.

		[2] Searching through object/function:
		[3] Normal value search:
*/
function containsEntity( entity, search, level, callback ){
	/*:
		Entity can be an array, function, object or string.
		Priority level: (first compare entity if)
		[1] Array
		[2] Function
		[3] Object
		[4] String

		If the search value is a boolean, the procedure must switch to checking
			if the key is existing or not.

		Search can be a key value pair, number, string, array, or a regex.
		Apply to entities:
			Search on array:
			[a] By array:
				[1] Array of equal levels.
				[2] Array of indeterminate levels.
					TODO: User parallel asynchronous expansion search.
			[b] By value:
				[1] {
						index: number ,
						value: number|string|regex
					}
					or
					{
						indexrange: [array:number],
						value:|valuerange:[array:number|string|regex|*]
					}
				[2] Number
				[3] String
				[4] Regex (can only be applied to string [or number?])

			Search on function or object:
			[a]	By key-value pair:
					{
						dot.notated.key|dot.notated.regex: {
							index: number,
							value: number|string|regex
						}
						|{
							indexrange: [array:number],
							value:|valuerange: [array:number|string|regex|*]
						}
						|number
						|string
						|regex
						|[array:number|string|regex|*]
					}
				*NOTE: Dot notated regex should only be limited to three
						filtering modes:
						1. Match All
							- by using * to denote that match all keys in the particular level.
						2. Match That Has
							- by using [<key>] to denote that match only key levels
								with the particular key at the particular level.
						3. Match That Contains
							- by using |<token>| to denote that match only key levels
								with the particular token in the key at the particular level.

			[b] By array (key-value pair range):
					[
						{
							dot.notated.key|dot.notated.regex: {
									index: number,
									value: number|string|regex
								}
								|{
									indexrange: [array:number],
									value:|valuerange: [array:number|string|regex|*]
								}
								|number
								|string
								|regex
								|[array:number|string|regex|*]
							}
					]

			[c] By array (value range):
					[array:number|string|regex|*]

			[d] By value:
				[1] Number
				[2] String
				[3] Regex (can only be applied to string [or number?])

			Search on string/number:
			[a] Number
			[b] String
			[c] Regex

		Level can be the restriction factor to limit the search.

		Location format:
			{
				location:
				query:
				queryID:
				redundancy:
			}

			Level is the dot notated appended keys where the values are found.
			Query is the search query that matched the possible value.
			Query ID is the search query in hashed format that determines the content.
			Redundancy is per query. It states how many values matches the query.

	*/

	function normalizedLocations( locations ){
		var clonedLocations = JSON.stringify( locations );
		var redundants = [];
		var query;
		var flag = false;
		//: We will reuse the for loop here twice.
		for( var i = 0; i < locations.length; i++ ){
			if( !flag ){
				//: First splice all redundants.
				//: Use the value for the location to search for other similar locations.
				query = new RegExp( JSON.stringify( locations[ i ] ), "g" );
				if( ( clonedLocations.match( query ) || [] ).length > 1 ){
					redundants.push( locations.splice( i--, 1 ) );
				}
				if( ( i + 1 ) == locations.length ){
					i = 0;
					flag = true;
				}
			}else{
				//: To increment the redundants.
				for( var j in redundants ){
					if( locations[ i ].queryID == redundants[ j ].queryID ){
						locations[ i ].redundancy++;
					}
				}
			}
		}
		return locations;
	}

	if( entity instanceof Array ){
		cloneEntity( entity,
		function( cloned ){
			constructLevels( cloned, true,
			function( levels ){
				var arrayLevels = levels;
				var arrayKeys = Object.keys( arrayLevels );
				//: If search is an array in equal levels or indeterminate levels.
				if( search instanceof Array ){
					//: Create a copy of the search array.
					cloneEntity( search,
					function( cloned ){
						//: Construct levels to be compared.
						constructLevels( cloned, true,
						function( levels ){
							var searchLevels = levels;
							_.async.map( arrayKeys,
							function( arrayKey, done ){
								//: We don't want to process beyond the prescribed level.
								if( arrayKeys.indexOf( arrayKey ) > level && level !== 0 ){
									return done( null, null );
								}
								done( null,
								function( cacheLocation ){
									var location = [];
									for( var key in searchLevels ){
										//: We compare regardless of type except for boolean types
										if( typeof searchLevels[ key ] == "boolean"
											&& searchLevels[ key ]
											&& key == arrayKey )
										{
											//: This is for handling key existence.
											location.push( {
												location: arrayKey,
												query: "isExists:" + key,
												queryID: hashIdentity( "isExists:" + key ),
												isExists: true,
												redundancy: 0
											} );
										}else if( searchLevels[ key ] == arrayLevels[ arrayKey ]
											|| searchLevels[ key ] === arrayLevels[ arrayKey ] )
										{
											location.push( {
												location: arrayKey,
												query: key + ":" + searchLevels[ key ],
												queryID: hashIdentity( key + ":"
													+ searchLevels[ key ] ),
												redundancy: 0
											} );
										}
									}
									cacheLocation( null, location );
								} );
							},
							function( error, functions ){
								if( error ){
									callback( error );
									return;
								}
								//: Splice all nulls.
								for( var i = 0; i < functions.length; i++ ){
									if( !functions[ i ] ){
										functions.splice( i--, 1 );
									}
								}
								_.async.parallel( functions,
								function( error, locations ){
									/*:
										The result is an array of array.
										Make the results 1 dimensional array.
									*/
									var _locations = [];
									for( var i in locations ){
										for( var j in locations[ i ] ){
											_locations.push( locations[ i ][ j ] );
										}
									}
									locations = _locations;
									/*:
										Results may contain redundant locations,
											filter and normalized.
										If locations match at different indexes,
											and the query id matches also,
											splice the last and increments the redundancy.
									*/
									callback( !!normalizedLocations( locations ).length || error,
										( ( !error )? locations : null ) );
								} );
							} );
						} )( );
					} )( );
				}else if( search instanceof RegExp ){
					_.async.map( arrayKeys,
						function( arrayKey, cacheLocation ){
							//: Handle levels.
							if( ( arrayKey.match( "." ) || [] ).length > level && level !== 0 ){
								return cacheLocation( null, null );
							}
							//: Apply regex.
							var matches = ( arrayLevels[ arrayKey ] + "" ).match( search ) || [];
							if( !!~matches.length ){
								return cacheLocation( null,{
									location: arrayKey,
									queryID: hashIdentity( search.toString( ) ),
									query: search,
									redundancy: 0,
									matches: matches,
									matchCount: matches.length
								} );
							}
							cacheLocation( null, null );
						},
						function( error, locations ){
							//: Splice all nulls.
							for( var i = 0; i < locations.length; i++ ){
								if( !locations[ i ] ){
									locations.splice( i--, 1 );
								}
							}
							callback( !!normalizedLocations( locations ).length || error,
								( ( !error )? locations : null ) );
						} );
				}else if( typeof search == "object" ){
                    var filter = function( value, values, callback ){
						_.async.forEach( values,
						function( _value, done ){
							if( _value instanceof RegExp && typeof _value == "object" ){
								var matches = ( "" + value ).match( _value ) || [];
								var matchCount = matches.length;
								if( matchCount ){
									/*:
										Match count and matches are optional informations.
											These informations will determine the data redundancy.
									*/
									return done( {
										matchCount: matchCount,
										matches: matches,
										redundancy: matches,
										searchValue: _value
									} );
								}
							}else if( typeof _value == "boolean" && _value ){
								//: This is for handling key existence.
								return done( {
									redundancy: 0,
									searchValue: "isExists"
								} );
							}else if( ( typeof _value == "number"
                                    && ( _value == parseInt( value, 10 )
									|| _value == parseFloat( value ) ) )
								|| ( typeof _value == "string" && _value == value ) )
							{
								return done( {
									redundancy: 0,
									searchValue: _value
								} );
							}
							done( );
						},
						function( result ){
							callback( result );
						} );
					};

					var indexes = search.indexrange || [ search.index ];
					var values = search.valuerange || [ search.value ];

					//: ============================================================================
					//: Check if invalid search format. Either it is empty or invalid format.
					/*
						@errorinfo-start:
							@errorid: "7d5c788e975ff3c04cce64b0306948c3"
							@errorid-end:true

							@methodid: "2f4db74fadb70e2a05f1284789aae123"
							@methodid-end:true

							@title: "Error on Invalid Search Format"
							@title-end:true

							@info:
								{
									description:
										"Error on invalid object search format query.\n"
										+ "If the indexes and/or values are empty or unrecognized,"
										+ "then this will be emitted.\n\n",
									type: "functional",
									level: 1
								}
							@info-end:true
						@errorinfo-end:true
					*/
					//	@errorcapture-start:
					if( !indexes.length || !values.length ){
						/*:
							Trace path format:
							<procedure|flow>:<procedure|flow>:<procedure|flow>...
						*/
						return callback( {
							error: {
								name: "error:containsEntity",
								input: null,
								message: "invalid search query format",
								tracePath:
									"identify entity as array:"
								+	"clone entity:"
								+	"construct levels:"
								+	"identify search query as search using object search format:"
								+	"indexes and values is empty due to invalid format:"
								+	_.util.inspect( search, true ),
								date: Date.now( )
							}
						} );
					}
					//	@errorcapture-end:true
					//: ============================================================================

					_.async.map( arrayKeys,
					function( arrayKey, cacheLocation ){
						if( arrayKeys.indexOf( arrayKey ) > level && level !== 0 ){
							return cacheLocation( null, null );
						}
                        var isNumberKey;
                        var isNumberIndex;
						for( var i in indexes ){
                            isNumberKey = parseInt( arrayKey.split( "." )[ 0 ], 10 );
                            isNumberIndex = parseInt( indexes[ i ], 10 );
							if( isNumberKey == isNumberIndex
								|| !!( arrayKey.match( indexes[ i ] ) || [] ).length
								|| !!~arrayKey.indexOf( indexes[ i ] )
								|| indexes[ i ] == arrayKey )
							{
								filter( arrayLevels[ arrayKey ], values,
								function( filterResult ){
									if( filterResult.searchValue == "isExists" ){
										//: For handling key existence.
										return cacheLocation( null, {
											location: arrayKey,
											query: "isExists:" + arrayKey,
											queryID: hashIdentity( "isExists:" + arrayKey ),
											isExists: true,
											redundancy: filterResult.redundancy
										} );
									}
									cacheLocation( null, {
										location: arrayKey,
										query: indexes[ i ] + ":" + filterResult.searchValue,
										queryID: hashIdentity( indexes[ i ] + ":"
											+ filterResult.searchValue ),
										redundancy: filterResult.redundancy,
										matches: filterResult.matches,
										matchCount: filterResult.matchCount
									} );
								} );
								return;
							}
							cacheLocation( );
						}
					},
					function( error, locations ){
						//: Splice all nulls
						for( var i = 0; i < locations.length; i++ ){
							if( !locations[ i ] ){
								locations.splice( i--, 1 );
							}
						}
						/*:
							Results may contain redundant locations,
								filter and normalized.
							If locations match at different indexes,
								and the query id matches also,
								splice the last and increments the redundancy.
						*/
						callback( !!normalizedLocations( locations ).length || error,
							( ( !error )? locations : null ) );
					} );
				}else{
					_.async.map( arrayKeys,
					function( arrayKey, cacheLocation ){
						//: Are they of the same type?
						if( typeof arrayLevels[ arrayKey ] == typeof search
							|| ( arrayLevels[ arrayKey ] + "" ) == ( search + "" )
							|| parseFloat( arrayLevels[ arrayKey ] ) == parseFloat( search ) )
						{
							return cacheLocation( null, {
								location: arrayKey,
								queryID: hashIdentity( search.toString( ) ),
								query: search,
								redundancy: 0
							} );
						}
						//: They don't match at all.
						cacheLocation( null, null );
					},
					function( error, locations ){
						//: Splice all nulls
						for( var i = 0; i < locations.length; i++ ){
							if( !locations[ i ] ){
								locations.splice( i--, 1 );
							}
						}
						callback( !!normalizedLocations( locations ).length || error,
							( ( !error )? locations : null ) );
					} );
				}
			} )( );
		} )( );
	}else if( typeof entity == "object" ){
		cloneEntity( entity,
		function( cloned ){
			constructLevels( cloned, true,
			function( levels ){
				//var indexrange;
				//var valuerange;
				if( search instanceof Array ){

				}
			} )( );
		} )( );
	}else{

	}
}
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
containsEntity( x, { "sampleac.a":1 } , null,
	function( hasValue, matches ){
		console.log( "Has value? " + hasValue );
		console.log( "Matches? " + JSON.stringify( matches, null, "\t" ) );
	} );*/

//	================================================================================================
//	================================================================================================
//	================================================================================================

//THIS PART IS UNDER CONSTRUCTION.
/*

	Standard Configuration Format

	{
		status:
			[
			],
		query:
			[
			],
		options:
			{

			},
		resources:
			{

			},
		post:
			function( config ){

			},
		pre:
			function( config ){

			},
		main:
			function( config ){

			},
		bindings:
			[
			],
		interfaces:
			{
				config:
					{
						status: Array,
						query: Array,
						options: "object",
						resources: "object",
						post: "function",
						pre: "function",
						main: "function",
						bindings: Array,
						interfaces: "object",
						events: "object"
					},
				options: { },
				resources: { },
				interfaces:
					{
						config: "object",
						options: "object",
						resources: "object",
						interfaces: "object",
						events: "object"
					},
				events: { }
			},
		events:
			{

			}
	}
*/

function stateWrapper( method, callback ){

}

function prepostWrapper( method, callback ){

}

function errorWrapper( method, callback ){

}

function constructConfiguration( configuration, callback ){

}


function constructInterface( configuration, callback ){

}

function serializeFunction( procedure, callback ){

}

function deserializeFunction( procedure, callback ){

}

function derequire( package, callback ){

}

function standardize( object, callback ){

}

function objectify( object, callback ){

}



console.log( "Run successful" );














//:	================================================================================================
function Interface( configuration ){
	/*:
		Interface format convention
		
		The interface is an object stating the meta types and configuration of the parameter.
		The interface contains general methods for only accessing and manipulating
			the meta properties. It does not understand the usage of these properties.
		It is not the responsibility of the function to determine if your
			configuration is correct at 100%. The function will only check
			the format of the configuration as well as the basic format.
			
		It is compose of the following components in JSON formatted structure:
		
		{
			key|":optional":type|Class|subtypes|settings
		}
		
			The key can have an optional feature appended.
			{
				"color:optional":number
			}
		
			The type can be any of the following types:
			1. number
			2. boolean
			3. null
			4. undefined
			5. string
			6. object
			7. function
			
			Class can be any class like:
			[*] Array
			[*] Date
		
			Subtypes are special types appended to types or class.
				When the type or class has a subtype it must be in this format
			
			This configuration states that the date can be by default Date or 
				a date in string format and should be converted to Date type
			{
				"date":"Date:string"
			}
			
			
			Mixed subtypes can be like this:
			
			This configuration states that the date can be a number or a string
				but should be converted to Date type
			{
				"date":"Date:string|number"
			}
			
			
			None default mixed subtypes can be like this:
			
			This configuration states that the date can be either Date, number or string.
			{
				"date":"Date|string|number"
			}
			
			
			Optional subtype can be like this:
			
			This configuration states that the Date type is optional 
				and is possible for deprecation.
			{
				"date":"Date;optional|string|number"
			}
			
			
			Null vs Undefined subtype:
			
			A null subtype means that the initial value of the property is nothing.
			An undefined subtype means that the key can be there or not.
			The difference between an optional key and an undefined typed key
				is that, optional key cannot be an undefined typed key.
			
			
			Case of arrays:
			
			An array subtype can be like this:
			{
				"dates":"Array-Date|string|number"
			}
			This configuration states that the key "dates" can be an array of 
				(denoted by - sign) Date, string or number type.
			All Array class types are bounded to the Array class.
				Therefore, no other subtypes follows any Array class type
			
			
			Case of generics:
			
			Interface has support for generics, they are object of general
				types but can contain several types either defined before
				or during runtime.
			A general type can be a single child or parent type or
				can have multiple child or parent types.
				It must also support types declared at runtime and wildcards.
				
				Single generic type:
				{
					"myobject":"ThisClass-Date"
				}
				This configuration states that, ThisClass can only
					contain Date class.
				
				Single generic type with boundaries:
				{
					"myobject":"ThisClass-Date;child"
				}
				This configuration states that, ThisClass can only
					contain anything that is a child of Date class.
				
				{
					"myobject":"ThisClass-Date;parent"
				}
				This configuration states that, ThisClass can only
					contain anything that is a parent of Date class.
				
				
				Wildcard and runtime types:
				{
					"myobject":"ThisClass-T?"
				}
				This configuration states that, ThisClass can have a
					type T and this is unknown at compile time.
				
				{
					"myobject":"T?"
				}
				This configuration states that, a certain class T
					exists but not identified.
				
				{
					"myobject":"ThisClass-*"
				}
				This configuration states that, ThisClass can have
					different types and is unknown at compile time.
			
			
			Settings:
			
			Settings are self imposed configuration. It may affect the flow
				of the function or anything that manipulates the entity.
				But it should not affect the whole application.
				They are extremely localized configuration.
			All settings format are denoted by the prefix ":" colon.	
			
			
			
			The configuration parameter composed of the basic
				key-type interface format.
	*/
	
	if( !this.isInterface( configuration ) ){
		throw {
			name: "error:Interface",
			input: null,
			message: "invalid basic interface configuration parameter on initialization",
			tracePath: null,
			date: Date.now( )
		};
	}
	//: We will clone the basic format configuration here.
	//: The interface configuration passed the verification.
	this.meta = { 
		_isVerifiedBasicInterface: true,
		_basicConfiguration: configuration,
		_intermediateConfiguration: {},
		_decomposedConfiguration: {}
	};
	var hasDefault = false;
	var hasArray = false;
	//var hasGeneric = false;
	var connector = "";
	//: We will run the key to the first interface transformation procedure.
	for( var key in configuration ){
		this.meta[ key ] = configuration[ key ].split( "|" );
		hasDefault = false;
		hasArray = false;
		for( var index in this.meta[ key ] ){
			if( !!~this.meta[ key ][ index ].indexOf( ":" ) ){
				hasDefault = true;
			}else if( !!~this.meta[ key ][ index ].indexOf( "-" )
				&& !!~this.meta[ key ][ index ].indexOf( "Array" ) )
			{
				hasArray = true;
			}else if( index ){
				if( hasDefault ){
					connector = ":";
				}else if( hasArray ){
					connector = "-";
				}
				//: TODO: Support for generics here?
				if( connector ){
					this.meta[ key ][ index ] = this.meta[ key ][ 0 ].split( connector )[ 0 ] 
						+ connector + this.meta[ key ][ index ];
				}	
			}
		}
		//: We store every configuration format.
		this.meta._intermediateConfiguration[ key ] = this.meta[ key ];
	}
	//: The intermediate format interface is finished.
	
	
}

Interface.isInterface = function( meta, callback ){
	//: This function will only check for basic interface format.
	function verify( ){
		if( meta._isVerifiedBasicInterface ){
			return true;
		}
		for( var key in meta ){
			//: Check if the configuration is correct.
			//: We check the name of the function if it is a class type.
			if( ( !( ~"boolean|number|string|object|function|null|undefined"
					.indexOf( meta[ key ] ) )
					&& typeof meta[ key ] != "string" )
				|| ( typeof meta[ key ] != "function"
					&& !( meta[ key ].name.substring( 0, 1 )
						.match( /[A-Z]/ ) || [] ).length ) )
			{
				//: For every invalid key we return false.
				return false;
			}
		}
		return true;
	}
	if( !callback ){
		return verify( );
	}else{
		return ( function( config ){
			callback( verify( ) );
		} );
	}
};
Interface.prototype.isInterface = Interface.isInterface;
var verifyInterface = Interface.isInterface;


Interface.prototype.set = function( key, type, callback ){
	//: Set let's you assign new type.
	var self = this;
	function set( config ){
		key = config.key || key;
		type = config.type || type;
		callback = config.callback || callback;
		//: TODO: Add a verification here.
		self.meta[ key ] = type;
		if( callback ){
			return callback( true );
		}
		return true;
	}
	if( callback ){
		return set;
	}
	return set( );
};

Interface.prototype.get = function( key, callback ){
	var self = this;
	function get( config ){
		key = config.key || key;
		callback = config.callback || callback;
		if( callback ){
			return callback( self.meta[ key ] );
		}
		return self.meta[ key ];
	}
	if( callback ){
		return get;
	}
	return get( );
};

Interface.prototype.configure = function( key, configuration, callback ){
	
};



Interface.prototype.has = function( metaType, key, callback ){
	
};

Interface.prototype.is = function( metaType, key, callback ){
	
};

Interface.prototype.getConfiguration = function( type, callback ){
	
};
//:	================================================================================================

//:	================================================================================================
Object.construct = function( entity, meta, callback ){
	
};

Object.prototype.set = function( key, value, type, callback ){
	
	var self = this;
	
	function set( config ){
		var property = config.property || "property";
		try{
			if( property === "property" ){
				( self[ property ] = self[ property ] || {} )[ key ] = {
						value: value,
						type: type || inspectType( value )
				};
			}else{
				self[ property ] = config.value || value;
			}
			
			if( callback ){
				callback( this );
			}
		}catch( error ){
		}
	}
	
	
	return this;
};

Object.prototype.get = function( key, type, callback ){
	var self = this;
	var neededData;
	
	function get( config ){
		try{
			neededData = self.data[ key ];
			if( type ){
				if( neededData.type == type ){
					callback( neededData, self );
					return neededData;
				}
				callback( null, self );
				return null;
			}
			callback( neededData, self );
			return neededData;
		}catch( error ){	
		}
	}
	
	get.self = self;
	
	return get;
};

Object.prototype.as = function( ){
	
};

Object.prototype.to = function( ){
	
};

Object.prototype.clone = function( ){
	
}

Object.prototype.merge = function( entity, callback ){
	
};

Object.prototype.is = function( ){
	
};

Object.prototype.has = function( ){
	
};

Object.prototype.equals = function( ){
	
};

Object.prototype.persist = function( ){
	
}

Object.prototype.explode = function( ){
	
}

Object.prototype.implode = function( ){
	
}

//:	================================================================================================

//:	================================================================================================
function Binding( ){
	
}

Binding.prototype.bind = function( ){
	
};

Binding.prototype.unbind = function( ){
	
};

Binding.prototype.listen = function( ){
	
};

Binding.prototype.ignore = function( ){
	
};

Binding.prototype.on = function( ){
	
};
//:	================================================================================================

//:	================================================================================================
Function.prototype.to = function( ){
	
};

Function.prototype.configure = function( ){
	
};
//:	================================================================================================



//:	================================================================================================
/*var _Error = Error;

function constructBasicError( error, callback ){
	
	//: First we get the location and input and set the date of this call.
	var location = constructBasicError.caller;
	var input = constructBasicError.caller.arguments;
	var date = Date.now( );
	
	//: This will create a new Error instance.
	function construct( ){
		//: If the location is a custom location or try to identify it.
		location = ( typeof location == "string" )? location 
			: ( location.name || location.toString( ) );
		//: Construct the basic error format.
		return new Error( JSON.stringify( {
			name: "error:" + location,
			input: _.util.inspect( input, true ),
			message: error.message,
			location: error.stack || location,
			date: date
		} ) );
	}
	if( callback ){
		return ( function( config ){
			//: Override using the configuration.
			error = ( config || {} ).error || error;
			input = ( config || {} ).input || input;
			date = ( config || {} ).date || date;
			location = ( config || {} ).location;
			//: If we want to override the callback.
			callback = ( config || {} ).callback || callback;
			//: Return using the callback.
			callback( construct( ) );
		} );
	}
	//: We don't have a callback, just return normally.
	return construct( );
}
constructBasicError.prototype = _Error;
*/
//:	================================================================================================
/*:
The try-catch here is the first line of error defense.
I'm planning to create layers of error defense.

(This layers of error defense is documented here.)

Level 1: Function Error Try-Catch
	This is the try-catch employed on the function itself.
	This will serve as the first line of defense.
Level 2: Pre-Post Error Try-Catch
	This is a sophisticated error catching mechanism for pre-post function wrapper.
	This will serve as the second line of defense and in partner
		with the uncaught error capture.
	In this stage, it will cache the state of error.

	State of error has 5 components:
		[*] Error name
		[*] Input
		[*] Stack trace/ trace path
		[*] Error message
		[*] Date occured

	If the same error state is achieved, the pre-post wrapper will activate the
		self healing feature enabling blockage of function call and firing
		a functional event "method call blocked due to reoccuring error"

Level 3: Uncaught Error Capture
	The third line of defense for capturing uncaught errors.
Level X: Self Healing on Error
	This will attempt to correct the input and recall the method, if not the input
		will be blocked.
*/