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
	}

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
					isWholeMatch: true
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

									[*] This is a paradoxically issue. Since complex regex 
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

/*:
	I will not finish this for now bu this will be used as an Object Search Format
		builder class. In this way it is easy to build the object search format.
*/
function ObjectSearch( indexes, values ){
	this.indexes = indexes;
	this.values = values;
}

ObjectSearch.prototype.isValidObjectSearchFormat = function( callback ){

}

ObjectSearch.prototype.getObjectSearchFormat = function( callback ){

}

ObjectSearch.prototype.setIndexes = function( indexes, callback ){

}

ObjectSearch.prototype.setValues = function( values, callback ){

}