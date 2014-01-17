function merge( entity, merger, rules, callback ){
	try{
		return ( function( config ){
			
			entity = config.entity || entity;
			merger = config.merger || merger;
			rules = config.rules || rules;
			callback = config.callback || callback;

			if( entity && typeof entity != "object"
				&& merger && typeof merger != "object"
				&& callback )
			{
				throw Error.construct( { error: "invalid parameters" } );
			}

		} );
	}catch( error ){
		throw Error.construct( error );
	}
}

/*:
	Interface rules are based on the object interface format.

*/
function InterfaceRules( ruleList ){

}

/*:
	
*/
function Interface( configuration ){

}