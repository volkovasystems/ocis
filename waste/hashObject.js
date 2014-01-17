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
			config = config || {};
			object = config.object || object;
			strict = config.strict || strict;
			callback = config.callback || callback;

			if( !object || !callback ){
				throw Error.construct( { error: "invalid parameters" } );
			}

			function generateHash( ){
				object[ "@hashUID" ] = hashEntity( hashIdentity( object ) );
				if( strict ) object[ "@hashID" ] = hashIdentity( object );
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
