


function isObjectSearchFormatted( object, callback ){
	try{
		cloneEntity( object, 
			function( clone ){
				inspectTypes( clone, false,
					function( levelTypes, typeStatistics ){
						
				} )( );
			} );
	}catch( error ){
		throw Error.construct( error );
	}
}