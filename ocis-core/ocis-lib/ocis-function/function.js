//:	================================================================================================
/*
	@requireInfo-start:
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
	@requireInfo-end:true
*/
//	@require-start:
var _ = {
	uuid: require( "node-uuid" ),
	//esprima: require( "esprima" ),
	async: require( "async" ),
	fs: require( "fs" ),
	crypto: require( "crypto" ),
	util: require( "util" )
};
//	@require-end:true
//:	================================================================================================

//:	================================================================================================

/*:
	Constants will be treated as objects.
	ConstantObject will be the type of constants.

	The toString is overriden providing proper
		constant return upon equating to the constant object.

	Initial constant format:
		<value>:<type>:<subtypeof>	
*/
var constants = {
	TYPE_OBJECT: "object:native:type",
	TYPE_FUNCTION: "function:native:type",
	TYPE_NUMBER: "number:native:type",
	TYPE_BOOLEAN: "boolean:native:type",
	TYPE_STRING: "string:native:type",
	TYPE_UNDEFINED: "undefined:native:type",
	TYPE_NULL: "null:object:type",
	TYPE_ARRAY: "Array:object:type",
	TYPE_INFINITY: "Infinity:number:type",
	TYPE_NAN: "NaN:number:type",
	TYPE_ERROR: "Error:object:type",
	TYPE_REGEX: "RegExp:object:type",
	TYPE_DATE: "Date:object:type",
	TYPE_JSON: "JSON:ocis:type",
	TYPE_PARAMETER: "Parameter:ocis:type",
	TYPE_PROCESSOR: "Processor:ocis:type",
	TYPE_FUNCTIONAL_OBJECT: "FunctionalObject:ocis:type",
	TYPE_STORAGE_OBJECT: "StorageObject:ocis:type",
	TYPE_CONSTANT_OBJECT: "ConstantObject:ocis:type",
	TYPE_INTERFACE: "Interface:ocis:type",
	TYPE_FLOW: "Flow:ocis:type",
	TYPE_EVENT: "Event:ocis:type",
	TYPE_BINDING: "Binding:ocis:type",
	TYPE_DARRAY: "DArray:ocis:type",
	POST_PROCESSOR: "post-processor:Processor",
	PRE_PROCESSOR: "pre-processor:Processor"
};
_.constants = constants;


function injectConstant( constant, value ){

}

function rejectConstant( constant ){

}

function constructConstant( constant, value ){

}

function editConstant( constant, value, permission ){

}

function reformatNativeConstant( constant ){
	constant = constant.split( ":" );
}

function reformatNativeConstants( ){

}
//:	================================================================================================

//:	================================================================================================
/*:
	We try to denote real type entities. This makes the types semi-static.

	When types follow proper meta rules then we can seperate entities properly.

	In Javascript we have types defined by typeof

	We have different sub types of types wherein we can classify properly
		what type we are really dealing with.

	Real types are types that really corresponds properly to the entity.

	Strict types are types that focuses on strict correspondence.
		For example we have objects like JSON and object not defined as JSON.
		We have to segregate those types so that we know what we are really dealing with.
*/
/*:
	OCIS Type Classification

	[*] Types are classified according to level.
	[*] Types are classified according to usage.
	[*] Types are classified according to static definition.

	In heirarchical classification of types, they are arrange with highest
		priority to static definition classification followed by usage and level.

	There is a thin line between usage and static definition.
		But we will try to segregate this ambiguity through the sub-classifications; 
		static usage and instance usage.

	Static usage is a static definition classification defined by typeof.
	Instance usage is a static definition and a usage classification defined through instanceof.

	Note that static definition are types defined by the ECMAScript specification.
	OCIS will not support non standard types. Though it will still be classified as usage types.

	Enumeration of Static Definition Types

	Static Usage 			Meta
	[1] object 				object:static|usage:type
	[2] function 			function:static|usage:type
	[3] number 				number:static|usage:type
	[4] string 				string:static|usage:type
	[5] undefined 			undefined:static|usage:type
	[6] boolean 			boolean:static|usage:type

		Subtypes of Static Definition Types 		Meta
		[1] null:object 							null:object:type
		[2] NaN:number 								NaN:number:type
		[3] Infinity:number 						Infinity:number:type

	Instance Usage 			Meta
	[1] Object 				Object:usage|static:type
	[2] Function 			Function:usage|static:type
	[3] Number 				Number:usage|static:type
	[4] String 				String:usage|static:type
	[5] Boolean 			Boolean:usage|static:type
	[6] Array 				Array:usage|static:type
	[7] RegExp 				RegExp:usage|static:type
	[8] Date 				Date:usage|static:type
	[9] Error 				Error:usage|static:type

		Exception to Instance Usage Types
		[1] JSON
		[2] Math

	*Note that all instance usage are object type static usage.

	Exceptions to instance usage types will be classified under usage types.

	Usage types are types through instanceof. They are classes defined outside
		ECMAScript specifications and are used accordingly to their purpose.

	They can be instantiated or used as utility providing set of functions to be reused.

	By strict definition, usage types should and always be instances.

	Usage types used as utilities will be classified furthermore according to their level
		of usage.

	So for strict definition of level types, they are just types classified by level of usage.

	Most third party libraries will provide classes so this will be placed under usage types.

	Enumeration of Level Types 			Meta
	[1] Native Level 					native:level:type
	[2] JavaScript Level 				js:level:type
	[3] Third Party Level 				x:level:type
	[4] OCIS Level 						ocis:level:type

		OCIS Level Types 				Meta
		[1] Parameter 					Parameter:ocis:type
		[2] Processor 					Processor:ocis:type
		[3] Flow 						Flow:ocis:type
		[4] Event 						Event:ocis:type
		[5] DArray 						DArray:ocis:type
		[6] Binding 					Binding:ocis:type
		[7] FunctionalObject 			FunctionalObject:ocis:type
		[8] StorageObject 				StorageObject:ocis:type
		[9] ConstantObject 				ConstantObject:ocis:type


		JavaScript Level Types Overriden For OCIS Level Types
										Meta
		[1] Function 					Function:ocis|object:type				
		[2] String 						String:ocis|object:type
		[3] Object 						Object:ocis|object:type
		[4] Error 						Error:ocis|object:type
		[5] Number 						Number:ocis|object:type
		[6] Date 						Date:ocis|object:type
		[7] RegExp 						RegExp:ocis|object:type
		[8] Array 						Array:ocis|object:type
		[9] Math 						Math:ocis|object:type
		[10] JSON 						JSON:ocis|object:type

	Here's the real question: "Who will handle the type?"

	No one. We just want to know what is the type PROPERLY so that we can
		work it out PROPERLY also.

	Meta Definition of Types
		Remember that types are classified. These classifications are the following:

		[1] static
		[2] usage
		[3] native - static
		[4] js - static|usage
		[5] x - usage
		[6] ocis - usage

		Though there are only 3 hierarchical categories of classification of types,
			these meta segregates properly these 3 classifications.

		Note that these meta will be the standard meta definition of types for
			the OCIS architecture framework.

		Note on "js" meta. The "js" meta is an alias to static|usage or usage|static.
			It is a non verbose meta if you just want to specify that the type
			classification is ECMAScript standard.

		Note on "ocis|object" meta. This can be simplified into just using
			"ocis" as the meta.
*/
function isRealNaN( number ){
	return ( number !== number && isNaN( number ) );
}
//:	================================================================================================

//:	================================================================================================
function isRealNumber( number ){
	return ( !isRealNaN( number ) && typeof number == "number" );
}
//:	================================================================================================

//:	================================================================================================
function isRealString( string ){
	return ( typeof string == "string" );
}
//:	================================================================================================

//:	================================================================================================
function isStorageObject( object ){
	try{
		return isRealObject( object ) || isRealArray( object );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
    }
}
//:	================================================================================================

//:	================================================================================================
function isFunctionalObject( object ){

    //: Functional objects contains interface marker as properties.
	//: These are functions with "@interface:property" annotation
	//: Also test for this optional annotation "@isFunctionalObject"
	try{
		return isRealFunction( object ) 
			&& !isRealEmptyObject( object[ "@interface:property" ] )
			&& isRealTrue( object[ "@isFunctionalObject" ] );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
function isRealFunction( method ){
	return typeof method == "function";
}
//:	================================================================================================

//:	================================================================================================
function isRealNull( entity ){
	return ( typeof entity == "object" && entity === null );
}
//:	================================================================================================

//:	================================================================================================
function isRealObject( object ){
	try{
		return ( typeof object == "object" && !isRealNull( object ) );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
function isRealArray( array ){
	return ( isRealObject( array ) && array instanceof Array );
}
//:	================================================================================================

//:	================================================================================================
function isRealUndefined( entity ){
	return ( typeof entity == "undefined" && entity === undefined );
}
//:	================================================================================================

//:	================================================================================================
function isRealInfinity( number ){
	return ( typeof number == "number" && entity === Infinity );
}
//:	================================================================================================

//:	================================================================================================
function isRealEmpty( entity ){
	return ( entity === "" || entity === 0 );
}
//:	================================================================================================

//:	================================================================================================
function isRealTrue( status ){
	return status === true;
}
//:	================================================================================================

//:	================================================================================================
function isRealFalse( status ){
	return status === false;
}
//:	================================================================================================

//:	================================================================================================
function isRealEmptyString( string ){
	return isRealString( string ) && isRealEmpty( string );
}
//:	================================================================================================

//:	================================================================================================
function isRealZero( zero ){
	return zero === 0;
}
//:	================================================================================================

//:	================================================================================================
function isRealEmptyObject( object ){
	try{
		return isRealObject( object ) 
			&& isRealEmpty( Object.keys( object ) )
			&& ( /^\{\s*\}$/g ).test( JSON.stringify( object ) );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
function isRealEmptyArray( array ){
	try{
		return isRealArray( array )
			&& isRealEmpty( array.length );
			&& ( /^\[\s*\]$/g ).test( JSON.stringify( array ) );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
function isParameterExisting( parameter ){
	try{
		return !isRealUndefined( parameter );	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
function isStrictObject( object ){
	try{
		return isRealObject( object ) && object.constructor.name != "Object";	
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================
/*
	try{
		
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
*/
//:	================================================================================================
function isStrictJSON( object ){
	try{
		return isRealObject( object ) && object.constructor.name == "Object"; 
	}catch( error ){
		try{
			throw Error.construct( error );
		}finally{
			return false;
		}
	}
}
//:	================================================================================================

//:	================================================================================================
/*:

*/
function isTruthy( value ){
	return ( value !== false
		&& !isRealEmpty( value )
		&& !isRealInfinity( value )
		&& !isRealNaN( value )
		&& !isRealNull( value )
		&& !isRealUndefined( value ) );
}
//:	================================================================================================

//:	================================================================================================
function isClassByConvention( blueprint ){
	if( typeof blueprint != "function" ){
		throw Error.construct( { error: "invalid class" } );
	}

	/*:
		This function follows the default convention
			that classes should start with a capital letter.

		Implementation specific to OCIS will mark the 
			class as "@isConvenedClass".
	*/

	//: Try doing this so that we can mark the class right away.
	isStandardGlobalClass( blueprint );

	//: This will check for convention
	if( ( /^[A-Z]\w*$/g ).test( blueprint.name ) ){
		//: Mark if non standard class.
		markNonStandardGlobalClass( blueprint );

		annotateObject( blueprint, "@isConvenedClass", true, true );
		annotateObject( blueprint.prototype, "@isFromConvenedClass", true, true );
	}
}
//:	================================================================================================

//:	================================================================================================
function isStandardGlobalClass( blueprint ){
	if( typeof blueprint != "function" ){
		throw Error.construct( { error: "invalid class" } );
	}

	/*: 
		This is a comparison function if the class used
			is based from ECMAScript standard global classes.

		We're not going to use the term "class" because it is
			a reserve word, instead we will use "blueprint".

		This function only follows ECMAScript standard.

		NOTE: Update this function if a new standard class is
			incorporated.

		Check for implementation specific marker then proceed
			with global checker.
	*/

	var result = blueprint[ "@isStandardGlobalClass" ] 
		|| ( !!~( this.standardGlobalClassList
			|| ( this.standardGlobalClassList = [
				"Function",
				"Object",
				"Array",
				"String",
				"Boolean",
				"Number",
				"Math",
				"Date",
				"RegExp",
				"Error",
				"JSON" 
			] ) ).indexOf( ( blueprint.name || "" ) ) );

	//: This is OCIS specific. 
	if( result ){
		annotateObject( blueprint, "@isStandardGlobalClass", true, true );
		annotateObject( blueprint.prototype, "@isStandardGlobalClass", true, true );
	}

	return result;
}
//:	================================================================================================

//:	================================================================================================

function markNonStandardGlobalClass( blueprint ){
	if( typeof blueprint != "function" ){
		throw Error.construct( { error: "invalid class" } );
	}

	if( !isStandardGlobalClass( blueprint ) ){
		annotateObject( blueprint, "@isNonStandardGlobalClass", true, true );
		annotateObject( blueprint.prototype, "@isFromNonStandardGlobalClass", true, true );
	}
}
/*:
	For future references
	Object.getOwnPropertyNames(Object).filter(function(property) {
        return typeof Object[property] == 'function';
    });
*/
//:	================================================================================================

//:	================================================================================================
function lockNativeSetting( object, key ){

}
//:	================================================================================================

//:	================================================================================================
function restrictNativeSetting( object, key ){

}
//:	================================================================================================

//:	================================================================================================
function unlockNativeSetting( object, key ){

}
//:	================================================================================================

//:	================================================================================================
function has( ){
	/*:
		This function will be used to check if the object has a property specified.

		It will return true if it has and override the valueOf() of the result to
			the value of the property.

		It will return a Boolean object with overrided valueOf method.
	*/
}
//:	================================================================================================

//:	================================================================================================
/*:
	Annotating object appends a special property "@annotated"
	We have a general rule that if an object is annotated,
		annotations should never be deleted.
*/
function annotateObject( object, key, value, fixed ){
	if( !~[ "function", "object" ].indexOf( typeof object ) ){
		throw Error.construct( { error: "invalid object parameter" } );
	}
	if( typeof key != "string" || !( /^@\w+$/g ).test( key ) ){
		throw Error.construct( { error: "invalid key parameter" } );
	}
	if( object.hasOwnProperty( key ) ){
		//: Update the value.
		object[ key ] = value;
	}else{
		Object.defineProperty( object, key, {
			enumerable: false,
			configurable: false,
			writable: !fixed,
			value: value
		} );
	}
	markAnnotated( object );
}

//:	================================================================================================

//:	================================================================================================
function markAnnotated( object ){
	if( !~[ "function", "object" ].indexOf( typeof object ) ){
		throw Error.construct( { error: "invalid object parameter" } );
	}
	if( object.hasOwnProperty( "@annotated" ) ){
		return;
	}
	Object.defineProperty( object, "@annotated", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: true
	} );	
}
//:	================================================================================================

//:	================================================================================================
function constructFunction( procedure, name ){
	/*:
		This constructs a raw function.
		Anything new appended to the procedures will be discarded.

		TODO: Provide re-attachments of stateful procedures.
	*/

	var reformatProcessor = function reformatProcessor( processor, type ){
		if( !~[ "pre-processor", "post-processor" ].indexOf( type ) ){
			throw Error.construct( { error: "invalid processor type" } );
		}

		if( isRealFunction( processor ) ){
			if( isRealEmptyString( processor.name ) ){
				throw Error.construct( { error: type + " has no name" } );
			}



			processor = processor.toString( );
			var name = processor.match( /\b(?!function\s*)[A-Za-z]\w+/ );
			processor = "var " + name + " = " + processor + ";\n";
			//: What if the toString is overriden? 
			//: We have to make a turn around solution regarding this scenario.
		}else if( isStrictJSON( processor )
			|| ( var isArray = isRealArray( processor ) ) )
		{
			var functions = "";
			for( var method in processor ){
				if( isRealEmptyString( processor[ method ].name ) ){
					if( !isArray ){
						functions += "var " + method + " = " 
							+ processor[ method ].toString( )
								.replace( "function", "function " + method ) + ";\n";
					}else{
						//: If the function is anonymous and it is contained inside
						//: an array then it is erroneous.
						throw Error.construct( { error: type + " has no name" } );
					}
				}else{
					functions += "var " + method + " = " + processor[ method ] + ";\n";	
				}
			}
			processor = functions;
		}
	};

	var constructFunctionWithPreProcessor = 
		function constructFunctionWithPreProcessor( preFunction ){
			/*: 
				Prefunctions should be passed not as string but in real types.
				Prefunctions can be named or not but we need to transform them into
					named functions.

				If the passed prefunction is a function then it is single.
				If the passed prefunction is an object then it is compose of
					several sub prefunctions. Take note that, ordering in this context
					is not really important. These functions are not necessarily named.
				If the passed prefunction is an array it should be checked
					if all of these functions are named. In this context,
					order is being observed.
			*/
			if( isRealFunction( preFunction ) ){
				if( isRealEmptyString( preFunction.name ) ){
					throw Error.construct( { error: "pre-function has no name" } );
				}
				preFunction = preFunction.toString( );
				var name = preFunction.match( /\b(?!function\s*)[A-Za-z]\w+/ );
				preFunction = "var " + name + " = " + preFunction + ";\n";
				//: What if the toString is overriden? 
				//: We have to make a turn around solution regarding this scenario.
			}else if( isStrictJSON( preFunction )
				|| ( var isArray = isRealArray( preFunction ) ) )
			{
				var functions = "";
				for( var method in preFunction ){
					if( isRealEmptyString( preFunction[ method ].name ) ){
						if( !isArray ){

							functions += "var " + method + " = " 
								+ preFunction[ method ].toString( )
									.replace( "function", "function " + method ) + ";\n";
						}else{
							//: If the function is anonymous and it is contained inside
							//: an array then it is erroneous.
							throw Error.construct( { error: "pre-function has no name" } );
						}
					}else{
						functions += "var " + method + " = " + preFunction[ method ] + ";\n";	
					}
				}
				preFunction = functions;
			}
			return constructDoubleReturnFunction( ).replace( "//@preProcessor", preFunction );
		};

	var constructFunctionWithPrePostProcessor =
		function constructFunctionWithPrePostProcessor( preFunction, postFunction ){
			/*:
				There are two kinds of processor here,
					1. Helper processors
						These are the processors that do not execute directly.
						They are being called when needed.
					2. Linked processors
						These are the processors that follows certain execution.
						They are always called upon main procedure execution.
				The construct function on double return will construct
					helper pre processors and linked post processors.

			*/
			constructFunctionWithPreProcessor( preFunction )
				.replace(  )
		};

	var constructNormalFunction = function constructNormalFunction( procedure ){
		return constructBaseFunction( ).replace( "//@normalFunction", 
			"function" + ( isParameterExisting( name )? ( " " + name ) : "" ) + "( ){"
				+ ( isParameterExisting( procedure )? procedure
					: "procedure.apply( this, arguments );" )
				+ "}" );
	};

	var constructBaseFunction = function constructBaseFunction( ){
		return "function( procedure ){ //@normalFunction\n }";
	};

	var constructDoubleReturnFunction = 
		function constructDoubleReturnFunction( ){
			return constructNormalFunction( "//@preProcessor\n"
				+ "try{ return ( function( config ){ //@mainProcedure\n } ); }"
				+ "catch( error ){ throw Error.construct( error ); }"
				+ "finally{ @postProcessor\n }" );
		};
	try{
		return ( function( config ){

		} );		
	}catch( error ){
		throw Error.construct( error );
	}
}
//:	================================================================================================

//:	================================================================================================
/*:
	@methodInfo-start:
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
				methodType: "utility",
				description:
					"Fast deep cloning of objects, arrays and functions.\n"
					+ "Thanks to async.js\n\n",
				guide: "practical/common",
				interface:{
					entity: "object",
					callback: "function"
				},
				result: "object",
				returnType: "double-return/callback",
				errorHandler: "try-catch/throw/Error",
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
				testCase: "function-test.cloneEntity",
				testResult: []
			}
		@info-end:true
	@methodInfo-end:true
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
			if( ( entity && typeof entity != "object" )
				|| !entity || !callback )
			{
				throw Error.construct( { error: "invalid parameters" } );
			}

			//: Try faster cloning.
			try{
				callback( JSON.parse( JSON.stringify( entity ) ) );
			}catch( error ){
				//: We don't report this.
			}
			
			//: This function is for cloning arrays.
			config.cloneArray = config.cloneArray 
				|| function( element, callback ){
				/*: 
					Clone element that is either, array or object type.
					Check also if the object is a function.
				*/
				if( typeof element == "function" ){
					config.cloneFunction( element, callback );
				}else if( element instanceof Array 
					|| typeof element == "object" )
				{
					config.cloneEntity( element,
						function( cloned ){
							callback( cloned );
						} )( );
				}else{
					callback( element );
				}
			};

			/*: 
				This function is for cloning objects with names.
				Object with names are non-JSON constructed object.
				These objects should be called proper objects.
			*/
			config.cloneProperObject = config.cloneProperObject
				|| function( entity, callback ){
				/*: 
					First extract the class of object. Since the entity
						is an object of that type the constructor already has a name.
					
					We want to full clone the object. And we also want to adapt the
						inherited properties in the clone. By adapting is
						also cloning the prototype chain.
					
					What we want now, is traverse the prototype chain until
						the Object scope. We don't want to inherit
						anything under the Object.prototype. (This is for further analysis.)
					
					Reverse cloning and re-attaching the cloned prototype
						back to the upper level.
						
					Issue: 
						We cannot track the hierarchy tree of inherited objects.
				*/
				//var link = entity.prototype;
				//while( link )
			};
			
			//: This function is for cloning objects.
			config.cloneObject = config.cloneObject
				|| function( entity, key, callback ){
				//: Clone entity with the specified key.
				if( typeof entity[ key ] == "function" ){
					config.cloneFunction( entity[ key ], callback );
				}else if( typeof entity[ key ] == "object" 
					|| entity[ key ] instanceof Array )
				{
					config.cloneEntity( entity[ key ],
						function( cloned ){
							callback( cloned );
						} )( );
				}else{
					callback( entity[ key ] );
				}
			};
			
			//: Clone the function type object.
			config.cloneFunction = config.cloneFunction 
				|| function( method, callback ){
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
				config.persistFunction = config. persistFunction 
					|| function( locals ){
					
					//: Try to retrieve the global path.
					var path = ( ( ( ocis || { } )
						.environment || { } )
						.reference || { } )
						.path || config.path || "";

					config.writeFunction = config.writeFunction 
						|| function( ){
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
					};

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
								config.writeFunction( );
							} );
						return;
					}
					config.writeFunction( );
				};
				
				//: We want to clone the locals.
				if( method.locals ){
					/*:
						Developers should attach all locals to 
							the function's "locals" variable.
					*/
					config.cloneEntity( method.locals, 
						function( clonedLocals ){
							config.persistFunction( clonedLocals );
						} );
					return;
				}
				//: If there are no locals.
				config.persistFunction( );
			};

			if( entity instanceof Array ){
				_.async.map( entity,
					function( element, done ){
						config.cloneArray( element,
							function( cloned ){
								done( null, cloned );
							} );
					},
					function( error, cloned ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						callback( cloned );
					} );
			}else if( typeof entity == "object" ){
				/*:
					There is an issue here. If the object is a non-JSON constructed
						entity then we will have issues regarding inheritance.
					
					
				*/
				var clone = { };
				_.async.forEach( Object.keys( entity ),
					function( key, done ){
						config.cloneObject( entity, key,
							function( cloned ){
								clone[ key ] = cloned;
								done( );
							} );
					},
					function( error ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						callback( clone );
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
	@methodInfo-start:
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
				interface: {
					identity: "value",
					callback: "function"
				},
				result: "string",
				returnType: "single-return/callback",
				errorHandler: "try-catch/throw",
				todo: [],
				xxx: [],
				revision: [],
				note: [],
				comment: [],
				testCase: "function-test.hashEntity",
				testResult: []
			}
		@info-end:true
	@methodInfo-end:true
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
		throw Error.construct( error );
	}
}
//	@method-end:true
//:	================================================================================================

//:	================================================================================================
/*
	@methodInfo-start:
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
				returnType: "single-return/callback",
				errorHandler: "try-catch/throw",
				todo: [],
				xxx: [],
				revision: [],
				note: [],
				comment: [],
				testCase: "function-test.hashIdentity",
				testResult: []
			}
		@info-end:true
	@methodInfo-end:true
*/
//  @method-start:
function hashIdentity( object, callback ){
	try{
		//: Identification of function is based on the content of the function.
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
			returnType: "double-return/callback",
			errorHandler: "try-catch/throw",
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
			testCase: "function-test.hashIdentity",
			testResult: []
		}
	@info-end:true
	@method:
*/
function hashObject( object, strict, callback ){
	try{
		return ( function( config ){
			//: Override parameter values.
			
			config = config || {};
			object = config.object || object;
			strict = config.strict || strict;
			callback = config.callback || callback;

			config.generateHash = config.generateHash 
				|| function( ){
				//: We can change the UID explicitly.
				object[ "@hashUID" ] = hashEntity( hashIdentity( object ) );
				//: We don't want to change the hash ID if it is already there.
				if( strict && !object[ "@hashID" ] ) {
					object[ "@hashID" ] = hashIdentity( object );
				}
			};
			
			config.hash = config.hash 
				|| function( entity, callback ){
				hashObject( entity, strict,
					function( error ){
						callback( Error.construct( error ) );
					} )( );
			};
			
			var keys = Object.keys( object );
			//: Do we have more keys?
			if( keys.length ){
				//: Create the key and supply the hash ID.
				config.generateHash( );
				//: Traverse all objects.
				_.async.forEach( keys,
					function( key, doneHashing ){
						if( object[ key ] instanceof Array ){
							_.async.forEach( object[ key ],
								function( element, doneHashing ){
									config.hash( element, doneHashing );
								},
								function( error ){
									doneHashing( Error.construct( error ) );
								} );
						}else if( typeof object[ key ] == "object" ){
							config.hash( object[ key ], doneHashing );
						}else{
							doneHashing( Error.construct( error ) );
						}
					},
					function( result ){
						callback( result );
					} );
			}else if( typeof object == "object" ){
				//: This is a single key object.
				config.generateHash( );
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
			returnType: "double-return/callback",
			errorHandler: "try-catch/throw",
			todo: [],
			xxx: [],
			revision: [],
			note: [],
			comment: [],
			testCase: "function-test.push",
			testResult: []
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
						|| ( config.entity[ config.index ] = [] );
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
			returnType: "double-return/callback",
			errorHandler: "try-catch/throw",
			todo: [],
			xxx: [ { description: "Current execution time of 2 milliseconds." } ],
			revision: [],
			note: [],
			comment: [],
			testCase: "function-test.constructLevels",
			testResult: []
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

			//: This is for cloning the object first before leveling.
			if( config.clone ){
				return cloneEntity( object,
					function( clonedObject ){
						return constructLevels( clonedObject, minimal, callback )( config );
					} )( config );
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
				return _.async.forEach( object,
					function( element, done ){
						current = config.current + ":" + object.indexOf( element );
						config.levels[ current ] = element;
						if( typeof element == "object" ){
							return constructLevels( element, minimal,
								function( levels ){
									if( levels instanceof Error ){
										return done( levels );
									}
									done( );
								} )( {
									current: current,
									levels: config.levels,
									minimize: config.minimize
								} );
						}
						done( );
					},
					function( error ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						config.minimize( config.levels );
						return callback( config.levels );
					} );
			}else if( typeof object == "object" ){
				//: All objects will be determined by their classes.
				if( object.constructor ){
					config.current = ( ( config.current )? ( config.current + "." ) : "" ) 
						+ "@" + object.constructor.name;
					config.levels[ config.current ] = object.constructor.toString( );
				}
				return _.async.forEach( Object.keys( object ),
					function( key, done ){
						current = config.current + ( ( config.current )? "." : "" ) + key;
						config.levels[ current ] = object[ key ];
						if( typeof object[ key ] == "object" ){
							return constructLevels( object[ key ], minimal,
								function( levels ){
									if( levels instanceof Error ){
										return done( levels );
									}
									done( );
								} )( {
									current: current,
									levels: config.levels,
									minimize: config.minimize
								} );
						}
						done( );
					},
					function( error ){
						if( error ){
							return callback( Error.construct( error ) );
						}
						config.minimize( config.levels );
						return callback( config.levels );
					} );
			}
			return callback( );
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}
// @method-end:true
//:	================================================================================================

//:	================================================================================================
function deconstructLevels( levels, callback ){
	try{
		return ( function( config ){

			config = config || {};
			levels = config.levels || levels;
			callback = config.callback || callback;

			config.depth = config.depth || 0;
			config.entity = config.entity;

			if( !levels || !callback ){
				throw Error.construct( { error: "invalid parameters" } );
			}

			var levelKeys = Object.keys( levels );

			_.async.forEach( levelKeys,
				function( key, done ){
					var identifier = key.match( /[:\.@]/g )[ 0 ];
					if( identifier === ":" ){
						return done( "array" );
					}
					if( identifier === "@" ){
						return done( key.split( /[:\.@]/g )[ 1 ] );
					}
					done( );
				},
				function( type ){
					if( type instanceof Error ){
						return callback( Error.construct( error ) );
					}

					if( type === "array" ){
						config.entity = [];
					}else{
						try{
							config.entity = new eval( type )( );
						}catch( error ){
							config.entity = {};
						}
					}
					
					_.async.forEachSeries( levelKeys,
						function( key, done ){
							if( !!~key.indexOf( "." ) || key.indexOf( ":" ) == 0 ){
								var value = levels[ key ];
								push( config.entity, value, key,
									function( entity ){
										if( entity instanceof Error ){
											return done( error );
										}
										done( );
									} )( );
								return;
							}
							done( );
						},
						function( error ){
							if( error ){
								return callback( Error.construct( error ) );
							}
							callback( config.entity );
						} );
				} );
		} );
	}catch( error ){
		throw Error.construct( error );
	}
}

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
function classifyType( value, verbose ){

}
//:	================================================================================================

//:	================================================================================================
/*:
	OCIS Architecture

		(I will try to put little things here so that I will remember the very purpose of this
			architecture. I believe this architecture is great, in a sense that it can
			adapt to every aspect of developing distributed applications.)

		The architecture consist primarily of the core engine FunctionJS (function.js)

		FunctionJS reimplements object oriented architecture. I believe that objects are more
			than it is. It should do something. And that "do something" is intrisically defined.

		When you define a "button", it is not just a button. The button understands its purpose.

		FunctionJS provides meta definitions. The way these meta definitions are processed,
			FunctionJS handles them. It is like "I create this button" and boom! It "does
			everything"!

		To be able to code components flawlessly and seamslessly is one of the goal of FunctionJS

		It is like, just define the button, and what it does (event based) and we will provide
			you the entire capabilities of how you will integrate this button to your application
			without the need to worry about dependencies. BECAUSE THE FUNCTIONS SIMPLY ADAPTS WHAT
			IT NEEDS TO ADAPT.

		This architecture redefines everything. 

		I call this Functional Object Oriented Architecture.

		You don't need to do lots of codes to integrate it, (through binding, just define 
			the connections and the function will adapt to it). You don't need to worry what 
			the functions will accept because the functions understands its parameters (through
			interfacing, the function will always have parameter checks adapts to what it is given
			and do what it needs to do based on what is given).

		One of the key strengths of this architecture is the ability of the function to
			polymorph based on what is feed into it. 

		I tried to make this architecture as realistic as possible. By basing the conceptual
			design of every components in this architecture to the natural flow of the universe,
			we can create an application that is less maintainable, robust and adaptive.


*/
/*:
	We try to define the content of the value. Though this is only a shallow definition,
		this will given the developers insight of what the data looks like.

	Let's try to define the format clearly:

*/
function inspectType( value, verbose ){
	try{
		//: Turn the verbosity off, true by default
		if( isRealFalse( verbose ) ){
			return inspectType( value ).split( ":" )[ 0 ];
		}

		//: If it is not false as per dynamic casting to boolean of javascript.
		if( isTruthy( value ) ){
			//: Analyze first if empty. This will prevent further errors.
			if( ( isRealEmptyObject( value ) || isRealEmptyArray( value ) ){
				return ( typeof value ) + ":empty";
			}else if( typeof value != "object" ){
				//: If it is not an object then it can be a number, string or boolean(true)
				if( isRealNumber( value ) ){
					return typeof value + ":"
					  + ( ( !!~( "" + value ).indexOf( "." ) )? "float":"integer" );
				}
				if( isRealString( value ) ){
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
			+ ( isRealNull( value )? ":null"
				: ( isRealUndefined( value )? ":undefined"
				: ( isRealNaN( value )? ":NaN"
				: ( isRealInfinity( value )? ":Infinity"
				: ( isRealEmpty( value )? ":empty"
				: ( ( typeof value == "boolean" )? ""
				: ":unknown" ) ) ) ) ) ) );
	}catch( error ){
		throw Error.construct( error );
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
		throw Error.construct( error );
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
			returnType: "single-return/callback",
			errorHandler: "try-catch/throw",
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
			testCase: "function-test.constructLevels",
			testResult: []
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
		throw Error.construct( error );
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
	Note that all binded functions are asynchronous. I am still thinking of having
		good support for sequential processing of binded functions.

	The bind function binds two function together thereby subjecting the procedure
		to any of the following binding procedures or conditions.

		Merge procedure through binding.
		1. If function A is executed, execute function B afterwards with the same parameters.
		2. If function A is executed, execute function B afterwards passing the results
			of function A to function B.
		3. If function A is executed, execute function B afterwards passing the results
			of function A to function B with the same parameters.
		4. Inverse of 1, 2 and 3.
		
		Event merging through binding.
		5. Simultaneously run function A and function B with the same parameters.
		6. Simultaneously run function A and function B with the same parameters
			then run them again with the results included.
		
	

	Results are also classified based on how the binding procedure will expose them.
		
		Simple merging.
		1. Expose result of A and/or result of B.
		2. Merge result of A and B choosing A over B if there are redundancies.
		3. Merge result of A and B choosing B over A if there are redundancies.
		4. Merge result of A and B but preserve the state. (multi-state result)

		Event merging.
		5. Follows simple merging result procedure. (single event)
		6. Expose result of event A and/or event B.
		7. Merge result of event A and B choosing A over B if there are redundancies.
		8. Merge result of event A and B choosing B over A if there are redundancies.
		9. Merge result of A and B but preserve the state. (multi-state multi-event result)



	Simple binding is linear. Complex binding is dynamic. Complex binding involves both
		complex and simple binding.

	The bind function can bind two or more functions linearly. Binding more than
		two events involves recursive binding. 

	Recursive binding for complex binding involves functional binding mnemonics.
		This can be done using a flow structure. (Note that this is not yet supported.)

	Parameter passing can be static or conformative. Static parameter passing on
		binded functions follows the order of how the parameters are passed on
		the bounding function. Conformative parameter passing is based on the meta
		structure of the binding functions.

	One of the feature of this bind function is to be able to create
		a new function with a static name.
*/
function bind( a, b, meta ){
	try{

	}catch( error ){
		throw Error.construct( error );
	}
}
//:	================================================================================================

//:	================================================================================================
/*:
	id: "2f4db74fadb70e2a05f1284789aae123"
	Complex contains() function for determining content existence.
	Containment is determined by the search query.
	Searching is limited to level. Zero level means traverse the entire object.
	Search query values must be unique as much as possible as required.
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

	TODO: 
		There are many repeated constructs here. I don't know if we have to refactor some
			of the constructs since, refactoring them may conclude to making new functions.
		If we are thinking of modifying the flow then that's a different thing since
			the solution presented here is near to the correct one.
		I just have the feeling that if we will optimized more the code then we are
			creating more unnnecessary anonymous functions.
*/
function containsEntity( entity, search, level, callback ){
	/*:
		Entity can be an array, function, object or string.
		Priority level: (first compare entity if)
		[1] Array
		[2] Function
		[3] Object
		[4] String
		[5] Other values are converted to string

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
				*NOTE: Numbers will be converted to string.
			[a] Number
			[b] String
			[c] Regex
			[d] Array

		Level can be the restriction factor to limit the search.

		Location format:
			{
				location: number|[array:number]
				query: 
				queryID:
				redundancy:
				isWholeMatch:
				matches
				matchCount
			}

			Level is the dot notated appended keys where the values are found.
			Query is the search query that matched the possible value.
			Query ID is the search query in hashed format that determines the content.
			Redundancy is per query. It states how many values matches the query.

	*/

	//: We compose preprocessing in this construct for brevity.
	config.prepareData = config.prepareData
		|| function( callback ){
		cloneEntity( entity,
			function( clonedEntity ){
				cloneEntity( search,
					function( clonedSearch ){
						constructLevels( clonedEntity, true,
							function( entityLevels ){
								constructLevels( clonedSearch, true,
									function( searchLevels ){
										callback( clonedEntity,
											clonedSearch,
											entityLevels,
											searchLevels );
									} )( );
							} )( );
					} )( );
			} )( );
	};

	/*:
		Deleting all redundant locations, if any.
		Though we are not 100% sure that there are any redundant locations.
		It is still safe to assume that there are because future searches
			that may be complex or varies in complexity may result in redundant locations.
	*/
	config.normalizedLocations = config.normalizedLocations
		|| function( locations ){
		//: TODO: Use the deep clone function.
		var clonedLocations = JSON.stringify( locations );
		var redundants = [];
		var query;
		var flag = false;
		//: We will reuse the for loop here twice.
		//: This loop is used to extract the redundants and increments the redundants count.
		for( var i = 0; i < locations.length; i++ ){
			if( !flag ){
				/*: 
					First splice all redundants.
					Use the value for the location to search for other similar locations.
					This construct "replace( /\W/g, "\\$&" )" will replace
						all special characters appended with '\'.

					Array type location is an excemption to this rule BUT we may
						have to include them because there are chances of matches.
				*/
				query = new RegExp( JSON.stringify( locations[ i ] ).replace( /\W/g, "\\$&" ), "g" );
				if( ( clonedLocations.match( query ) || [] ).length > 1 ){
					redundants.push( locations.splice( i--, 1 ) );
				}
				//: Signify that we have to count the redundants now.
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
		//: Return the set of unique locations
		return locations;
	};

	//: Let's try exciting new things :)
	config.match = config.match
		|| function( entity, search, callback ){
		
		//: Entity should be a string.
		if( !!~"number|string".indexOf( typeof entity ) ){
			
			//: Ensure that it is alwasy a string.
			entity = "" + entity;

			//: So we have to classify the search object.
			if( search instanceof RegExp ){

			}else if( typeof search == "object" ){
				/*: 
					This in the form of dot notated or object search format.
					This is also applicable to arrays since arrays
						will be converted to level structure.					
				*/
				if( Object.keys( search ).toString( )
					.match( new RegExp( "/(value(Range)?){1}(index(Range)?){1}/", g ) ) )
				{
					
				}
			}else{

			}
			return;
		}
		callback( );
	};

	/*:
		If the entity is normal string or number do not bother preparing the data.
		The difference of entity as string or number is that you don't
			need to bother for any existence of any key.
		You just need to verify if certain parts or subparts exists.
		The meaning of containment in this context is purely based on
			the existence of something in a thing being observed.
	*/
	if( !!~"number|string".indexOf( typeof entity ) ){
		
		//: We have to ensure that the entity is a string if it is other than string.
		entity = "" + entity;
		
		var matches;
		var location;

		if( search instanceof RegExp ){
 		
 			matches = entity.match( search );
 			location = [];
			var clonedEntity = entity;
			for( var match in matches ){
				location.push( clonedEntity.indexOf( match ) );
				clonedEntity = clonedEntity.replace( match, "" );	
			}
 			
 			if( matches.length == 1 && matches[ 0 ] === entity ){
				return callback( {
					location: location,
					queryID: hashIdentity( search.toString( ) ),
					query: search,
					isWholeMatch: true,
					matches: matches,
					matchCount: matches.length
				} );
			}
		
			//: If there are matches.
			if( !!~matches.length ){
				return callback( {
					location: location,
					queryID: hashIdentity( search.toString( ) ),
					query: search,
					matches: matches,
					matchCount: matches.length
				} );
			}
		}else if( search instanceof Array ){
			/*:
				I don't know why do we need to deal of having to construct 
					the leveled search if the search is an array.
				For the mean time put it here as a safety measure.
			*/
			constructLevels( search, true,
				function( searchLevels ){
					var searchKeys = Object.keys( searchLevels );
					_.async.map( searchKeys,
						function( searchKey, cacheLocations ){
							/*:
								There is an issue arising here, we can test using indexOf
									but the problem is what if there are many occurrences?
								What if it is the whole word?
								So we have to devise a good way on how to handle this
									scenarios.

								So there are three cases here:
									1. If there are many matches.
									2. If there is only 1 match but a substring.
									3. If the whole search equals the match.
							*/
							matches = entity.match( new RegExp( searchLevels[ searchKey ], "gi" ) );
							
							//: A sub match only.
							location = entity.indexOf( searchLevels[ searchKey ] );
							
							if( entity === searchLevels[ searchKey ] ){
								//: The whole word matches.
								location  = 0;
							}else if( ( matches || [] ).length > 1 ){
								//: Sub words matches sub parts of the entity.
								location = [];
								var clonedEntity = entity;
								for( var match in matches ){
									location.push( clonedEntity.indexOf( match ) );
									clonedEntity = clonedEntity.replace( match, "" );	
								}
							}
							
							var query = searchKey + ":" + searchLevels[ searchKey ];
							if( !!~location ){
								return cacheLocations( null, {
									location: location,
									query: query,
									queryID: hashIdentity( query ),
									redundancy: 0
								} );	
							}
							
							cacheLocations( null, null );
						},
						function( error, locations ){
							if( error ){
								return callback( Error.construct( error ) );
							}

							callback( !!config.normalizedLocations( locations ).length, locations );
						} );
				} )( { clone: true } );
		}else if( typeof search == "object" ){
			//: The search is an object search format.
			//: But it can never be a dot notated.

		}else{
			search = "" + search;

		}
	}else{
		config.prepareData( function( clonedEntity, clonedSearch, entityLevels, searchLevels ){
			//: Follow the rules for entities that are arrays.
			if( clonedEntity instanceof Array ){
				var arrayKeys = Object.keys( entityLevels );
				//: If search is an array in equal levels or indeterminate levels.
				if( clonedSearch instanceof Array ){
					_.async.map( arrayKeys,
						function( arrayKey, cacheLocations ){
							//: We don't want to process beyond the prescribed level.
							//: XXX: What if the key is similar? Hope lastIndexOf will solve this.
							if( arrayKeys.lastIndexOf( arrayKey ) > level && level !== 0 ){
								return cacheLocations( null, null );
							}
							var locations = [];
							var query;
							for( var key in searchLevels ){
								//: We compare regardless of type except for boolean types
								if( typeof searchLevels[ key ] == "boolean"
									&& searchLevels[ key ]
									&& key == arrayKey )
								{
									//: This is for handling key existence.
									query = "isExists:" + key;
									locations.push( {
										location: arrayKey,
										query: query,
										queryID: hashIdentity( query ),
										isExists: true,
										redundancy: 0
									} );
								}else if( searchLevels[ key ] == entityLevels[ arrayKey ]
									|| searchLevels[ key ] === entityLevels[ arrayKey ] )
								{
									query = key + ":" + searchLevels[ key ];
									locations.push( {
										location: arrayKey,
										query: query,
										queryID: hashIdentity( query ),
										redundancy: 0
									} );
								}
							}
							cacheLocations( null, locations );
						},
						function( error, locations ){
							if( error ){
								return callback( Error.construct( error ) );
							}
							//: Splice all nulls and empty array.
							for( var i = 0; i < locations.length; i++ ){
								if( !locations[ i ] && !locations[ i ].length ){
									locations.splice( i--, 1 );
								}
							}
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
							callback( !!config.normalizedLocations( locations ).length, locations );
						} );
				}else if( clonedSearch instanceof RegExp ){
					//: If search is a regular expression.
					_.async.map( arrayKeys,
						function( arrayKey, cacheLocations ){
							
							//: Handle levels.
							if( ( arrayKey.match( "." ) || [] ).length > level && level !== 0 ){
								return cacheLocations( null, null );
							}

							//: Apply regex.
							var matches = ( entityLevels[ arrayKey ] + "" )
								.match( clonedSearch ) || [];

							/*:
								The matches' length should be really
									greater than 1 because, if there are no matches
									the result will contain an element of the whole string.

								Errata:
									Seems there is a confusion here. Sometimes the match
										returns an element even though the result is not correct.

								Scenario: 
									What if the regexp intends to match the whole string?
									
									Or it may seem to match the whole string but it is 
										not matching at all. [*]

									[*] This is a paradoxical issue. Since complex regex 
											under this issue is indeterminate.
										So this will be left to the user of this function.
										The chance that this will happen is roughly 50% 
											or variably higher than that.

								
								So we have to verify if the regex intends to match the whole
									string and it really matches the whole string.

								Scenario:
									The regex pertains to a subpart so should we include
										sub locations?
							*/
							if( matches.length == 1 && matches[ 0 ] === entityLevels[ arrayKey ] ){
								//: This states that the regex matches the whole string.
								//: Let's still add the matches and the matchCount.
								return cacheLocations( null, {
									location: arrayKey,
									queryID: hashIdentity( clonedSearch.toString( ) ),
									query: clonedSearch,
									redundancy: 0,
									isWholeMatch: true
									matches: matches,
									matchCount: matches.length
								} );
							}
							//: If there are matches.
							if( !!~matches.length ){
								return cacheLocations( null, {
									location: arrayKey,
									queryID: hashIdentity( clonedSearch.toString( ) ),
									query: clonedSearch,
									redundancy: 0,
									matches: matches,
									matchCount: matches.length
								} );
							}
							cacheLocations( null, null );
						},
						function( error, locations ){
							//: Splice all nulls.
							for( var i = 0; i < locations.length; i++ ){
								if( !locations[ i ] ){
									locations.splice( i--, 1 );
								}
							}
							callback( !!config.normalizedLocations( locations ).length, locations );
						} );
				}else if( typeof clonedSearch == "object" ){
					/*:
						This is for object search format.
						Other than that the search object will not be entertained.
					
						This is for checking if the search is an object search format.
						
						TODO: 
							Replace this procedure if the ObjectSearch class 
								is already implemented. A generalized function verify( ) 
								should be replaced here.

						For now I will not implement this.

						Errata: 
							This is not only for object search format this holds true also
								for all dot notated objects.
					*/

					config.filter = config.filter 
						|| function( value, values, callback ){
						_.async.forEach( values,
							function( item, done ){
								if( item instanceof RegExp && typeof item == "object" ){
									var matches = ( "" + value ).match( item ) || [];
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
											searchValue: item
										} );
									}
								}else if( typeof item == "boolean" && item ){
									//: This is for handling key existence.
									return done( {
										redundancy: 0,
										searchValue: "isExists"
									} );
								}else if( ( typeof item == "number"
									&& ( item == parseInt( value, 10 )
									|| item == parseFloat( value ) ) )
									|| ( typeof item == "string" && item == value ) )
								{
									return done( {
										redundancy: 0,
										searchValue: item
									} );
								}
								done( );
							},
							function( result ){
								callback( result );
							} );
					};

					//: Aggregate the values so that it all becomes ranges.
					var indexes = clonedSearch.indexrange || [ clonedSearch.index ];
					var values = clonedSearch.valuerange || [ clonedSearch.value ];


					if( !indexes.length || !values.length ){
						return callback( Error.construct( {
							error: "indexes or values are empty"
						} ) );
					}

					_.async.map( arrayKeys,
						function( arrayKey, cacheLocation ){

							if( arrayKeys.lastIndexOf( arrayKey ) > level && level !== 0 ){
								return cacheLocation( null, null );
							}
							
							var isNumberKey;
							var isNumberIndex;
							var query;
							for( var i in indexes ){
								isNumberKey = parseInt( arrayKey.split( "." )[ 0 ], 10 );
								isNumberIndex = parseInt( indexes[ i ], 10 );
								if( isNumberKey == isNumberIndex
									|| !!( arrayKey.match( indexes[ i ] ) || [] ).length
									|| !!~arrayKey.indexOf( indexes[ i ] )
									|| indexes[ i ] == arrayKey )
								{
									config.filter( entityLevels[ arrayKey ], values,
										function( filterResult ){
											if( filterResult.searchValue == "isExists" ){
												query = "isExists:" + arrayKey;
												//: For handling key existence.
												return cacheLocation( null, {
													location: arrayKey,
													query: query,
													queryID: hashIdentity( query ),
													isExists: true,
													redundancy: filterResult.redundancy
												} );
											}
											query = indexes[ i ] + ":" + filterResult.searchValue;
											cacheLocation( null, {
												location: arrayKey,
												query: query,
												queryID: hashIdentity( query ),
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
							callback( !!config.normalizedLocations( locations ).length, locations );
						} );
				}else{
					//: If the search is string or number.
					_.async.map( arrayKeys,
						function( arrayKey, cacheLocation ){
							//: Are they of the same type?
							if( typeof entityLevels[ arrayKey ] == typeof clonedSearch
								|| ( entityLevels[ arrayKey ] + "" ) == ( clonedSearch + "" )
								|| parseFloat( entityLevels[ arrayKey ] ) == parseFloat( clonedSearch ) )
							{
								return cacheLocation( null, {
									location: arrayKey,
									queryID: hashIdentity( clonedSearch.toString( ) ),
									query: clonedSearch,
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
							callback( !!config.normalizedLocations( locations ).length, locations );
						} );
				}
			}else if( typeof clonedEntity == "object" ){
				//: Follow the rules for entities that are objects.
			}else{
				
			}
		} );
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

/*:
	OCIS Object Property Convention

	@ prefix denotes OCIS native keywords.

	_ prefix denotes private membership.

*/









//:	================================================================================================

function verifyNativeInterfaceConfiguration( configuration, callback ){
	try{
		return ( function( config ){

			config = config || {};
			configuration = config.configuration || callback;
			callback = config.callback || callback;

			config.options = config.options || {};
			config.overrides = config.overrides || {};
			config.rules = config.rules || {
				
			};

		} )
	}catch( error ){

	}
}

function configureInterface( meta, configuration, callback ){
	try{
		return ( function( config ){

			config = config || {};
			meta = config.meta || meta; 
			configuration = config.configuration || configuration;
			callback = config.callback || callback;

			//: Meta should be an interface format.
			if( !( meta instanceof Interface ) ){

			}

			//: 


		} );
	}catch( error ){

	}
}

function Interface( configuration ){
	/*:
		Note that interface should be called meta in coding terms.

		The configuration object contains the interface native settings
			defined by the @setting property.
		
		Settings include the default javascript settings for enforcing
			strictness on an object.

		The following are supported settings
			{
				seal: boolean
				freeze: boolean
				extensible: boolean
			}

		By default, seal and freeze is true.

		The setting is optional. This is only used to make the interface
			as strict as possible.

		@setting tells any construct methods to trigger native methods
			that will emulate these settings.

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
		
			A subtype can also be a class. 

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

			Note that generics in interface is different in any other language
				specific generic implementations. Generics here is used
				on shallow portions. We cannot define to include
				types with complex ranges or bounds.
				TODO: This is for improvements.
				
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
				Note that T will become a named class because of this.
				Note also that T is a localize named class. Therefore,
					T of other local scopes may not be the same with
					this T.

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

				{
					"myobject":"*"
				}
				This configuration states that, myobject is applicable
					for any type.
			
			
			Settings:
			
			Settings are self imposed configuration. It may affect the flow
				of the function or anything that manipulates the entity.
				But it should not affect the whole application.
				They are extremely localized configuration.
			All settings format are denoted by the prefix ":" colon.	
			
			Note that the settings comes after a type. Settings cannot be
				defined without a type. Since settings are localize configuration
				defined outside the local scope it must be supported with a type.
				Mismatched type and settings may result to invalid data processing.

			Setting may include a namespace. Settings bounded by namespace
				are sub localized settings that is only usable on localize
				conditions.
			
			
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

function isInterface( meta, callback ){
	try{

		//: Second level verification.
		//: Certain definitions are allowed.
		//: Standard classes are checked. As well as standard types.
		var verifyMetaDefinition = function verifyMetaDefinition( meta, strictVerifier, callback ){

		};

		//: So that we can also verify inner interfaces.
		var verifyInterface = function verifyInterface( meta, verifier, callback ){
			
			if( meta[ "@isVerifiedBasicInterface" ] ){
				return true;
			}

			_.async.forEach( Object.keys[ meta ],
				function( key, verifyDone ){

					//: If the meta is an object.
					if( isRealObject( meta[ key ] ) ){
						verifyInterface( meta[ key ], verifier, 
							function( result ){
								if( result === true ){
									return verifyDone( );
								}

								return verifyDone( result );
							} );
						return;
					}

					//: Verify the meta first.
					if( !( /^((\w+)(([-:|?;])(\w+|\w|\*)(\?)?)+)|(\w\?)|(\*)|(\w+)$/g )
						.test( meta[ key ] ) )
					{
						return verifyDone( false );
					}

					//: Then verify the key.
					if( !( /^((\w+([:;.]\w+)*)|(\w+))$/g ).test( key ) ){
						return verifyDone( false );
					}

					//: This is for custom verifier.
					if( !verifier( meta, key ) ){
						return verifyDone( false );
					}

					verifyDone( );	
				},
				function( result ){
					
					if( result instanceof Error ){
						return callback( result );
					}

					if( !result ){
						return callback( result );
					}

					return callback( true );
				} );
		};

		return ( function( config ){
			meta = config.meta || meta;
			callback = config.callback || callback;

			/*:
				We only need a single level interface.
				Though we need to check if the interface is single leveled.
				Check also if the interface has @singleLeveled
				
				Though this function will not mark if it is single leveled
					because this is not the function's purpose.

				Also, we provide flexibility to the interface.
				Single leveled interfaces provides easy lookup.

				Multi-leveled interfaces provides structure.

				So this is a tradeoff between speed and memory.
			*/
			if( !meta[ "@singleLeveled" ] ){
				constructLevels( meta, true,
					function( metaLevels ){
						verifyInterface( metaLevels, config.verifier,
							function( result ){
								if( result ){
									meta[ "@isVerifiedBasicInterface" ] = true;
									annotateObject( meta, "@isVerifiedBasicInterface", true )
								}
								callback( result );
							} );
					} )( );
				return;
			}

			verifyInterface( meta, config.verifier,
				function( result ){
					if( result ){
						meta[ "@isVerifiedBasicInterface" ] = true;
					}
					callback( result );
				} );
		} );
   
	}catch( error ){
		throw Error.construct( error );
	}
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
	
};

Object.prototype.merge = function( entity, callback ){
	
};

Object.prototype.is = function( ){
	
};

Object.prototype.has = function( ){
	
};

Object.prototype.equals = function( ){
	
};

Object.prototype.persist = function( ){
	
};

Object.prototype.explode = function( ){
	
};

Object.prototype.implode = function( ){
	
};

Object.prototype.link = function(){
	
};
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