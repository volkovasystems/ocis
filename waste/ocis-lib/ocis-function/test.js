function constructHardObject( object ){
	/*:
		Constructing hard objects takes an object type parameter.
		All enumerable properties will be hardened (constant).
		This will make the object contains contant properties.
		This function is designed specifically to only traverse single level
			properties.
	*/
	if( typeof object != "object" ){
		throw Error.construct( { error: "invalid object type parameter" } );
	}

	for( var key in object ){
		Object.defineProperty( object, key,
			{
				enumerable: true,
				configurable: false,
				writable: false,
				value: object[ key ]
			} );
	}
}

var hard = {
	a: 1,
	b: 2,
	c: "hello",
	e: true,
	d: false
};
constructHardObject( hard );

delete hard.a;
hard.a = 4;

console.log( hard.a );