
function Ui( configuration ){

	//Meta-entity configurations
	this.uiID = configuration.ID
		|| ( configuration.meta || {} ).ID

	this.name = configuration.name 
		|| ( configuration.meta || {} ).name;

	this.types = configuration.types 
		|| ( configuration.meta || {} ).types 
		|| [ configuration.type 
			|| ( configuration.meta || {} ).type ];

	//UI location boundary configurations
	this.dimension = configuration.dimension 
		|| ( configuration.bound || {} ).dimension 
		|| {
			width: configuration.width 
				|| ( configuration.bound || {} ).width
				|| 0,
			height: configuration.height 
				|| ( configuration.bound || {} ).height
				|| 0
		};

	this.position = configuration.position 
		|| ( configuration.bound || {} ).position 
		|| {
			type: configuration.positionType 
				|| ( configuration.bound || {} ).positionType,
			x: configuration.x 
				|| ( configuration.bound || {} ).x
				|| ( configuration.positionAbsolute || {} ).x
				|| ( ( configuration.bound || {} ).positionAbsolute || {} ).x
				|| configuration.absoluteX 
				|| ( configuration.bound || {} ).absoluteX
				|| 0,
			y: configuration.y 
				|| ( configuration.bound || {} ).y
				|| ( configuration.positionAbsolute || {} ).y
				|| ( ( configuration.bound || {} ).positionAbsolute || {} ).y
				|| configuration.absoluteY 
				|| ( configuration.bound || {} ).absoluteY
				|| 0,
			absolute: configuration.positionAbsolute 
				|| ( configuration.bound || {} ).positionAbsolute
				|| { 
					x: configuration.absoluteX 
						|| configuration.bound.absoluteX
						|| 0,
					y: configuration.absoluteY 
						|| configuration.bound.absoluteY
						|| 0
				},
			relative: configuration.positionRelative 
				|| ( configuration.bound || {} ).positionRelative
				|| {
					x: configuration.relativeX 
						|| configuration.bound.relativeX
						|| 0,
					y: configuration.relativeY 
						|| configuration.bound.relativeY
						|| 0
				},
			anchor: configuration.positionAnchor
				|| ( configuration.bound || {} ).positionAnchor
				|| {
					type: configuration.anchorType 
						|| ( configuration.bound || {} ).anchorType
				}
		};
	this.spaces;

}