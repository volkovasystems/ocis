var _ = {
	async: require( "async" ),
	push: require( "./push.js" ).push
}

//:	================================================================================================

function deconstructLevels( levels, callback ){
	try{
		return ( function( config ){

			config = config || {};
			levels = config.levels || levels;
			callback = config.callback || callback

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
								_.push( config.entity, value, key,
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

exports.deconstructLevels = deconstructLevels;