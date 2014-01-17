


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