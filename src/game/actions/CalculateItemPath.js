import device;

// TODO: refactor this file. Fix the boucing from walls

const MAX_NUMBER_OF_SEGMENTS = 5;
const COUNTER_STEP = 3;
const MAX_DISTANCE_PX = 6000;

var _itemRadius;
var _itemDiameter;

var width;
var height;

exports = function getPath(item, angleInRad, itemRadius, fieldItemArray)
{
	_itemRadius = itemRadius;
	_itemDiameter = itemRadius * 2;

	var path = [];

	var initialPath = getSegment(item.style.x, item.style.y, item, angleInRad, fieldItemArray);
	path.push( initialPath );
	
	for (var i = 0; i <= MAX_NUMBER_OF_SEGMENTS; i++)
	{
		var prevPath = path[path.length - 1];
		if (prevPath.pathComplete == true)
			break;

		var newAngle = Math.PI - prevPath.angleInRad;
		var nextSegment = getSegment( prevPath.x, prevPath.y, item, newAngle, fieldItemArray );
		path.push(nextSegment);
	};

	return path;
}

function getSegment(itemCoordX, itemCoordY, item, angleInRad, fieldItemArray)
{
	var pathPoint = {x: 0, y: 0, angleInRad: angleInRad, pathComplete: false};

	var fX = itemCoordX;
	var fY = itemCoordY;

	var counter = 0;

	var cosResult = Math.cos(angleInRad);
	var sinResult = Math.sin(angleInRad);

	while(true)
	{
		counter += COUNTER_STEP;

		fX = itemCoordX + cosResult * counter;
		fY = itemCoordY + sinResult * counter;

		if (fX <= _itemRadius)
		{
			fx = _itemRadius + 1;
			break;
		}

		if (fX >= device.width - _itemRadius)
		{
			fx = device.width - _itemRadius - 1;
			break;
		}

		if ( fY <= _itemRadius )
		{
			pathPoint.x = fX;
			pathPoint.y = _itemRadius - 1;
			pathPoint.pathComplete = true;
			return pathPoint;
		}

		var currentItem; 
		for ( i = 0; i < fieldItemArray.length; i++)
		{
			currentItem = fieldItemArray[i];
			if (currentItem != item)
				if ( Math.pow(currentItem.style.x - fX, 2) + Math.pow(currentItem.style.y - fY, 2) < Math.pow(_itemDiameter, 2) )
				{
					pathPoint.x = fX;
					pathPoint.y = fY;
					pathPoint.pathComplete = true;
					return pathPoint;
				}
		}

		if ( counter * COUNTER_STEP > MAX_DISTANCE_PX)
			break;

	}

	pathPoint.x = fX;
	pathPoint.y = fY;
	pathPoint.pathComplete = false;
	return pathPoint;
}