import animate;

exports = function(caller, numLines)
{
	// Move existing items down
	for (var i = 0; i < caller.gridFieldInstance.registeredItems.length; i++)
	{
		var item = caller.gridFieldInstance.registeredItems[i];
		item.posY += numLines;
		
		var pos = caller.gridFieldInstance.getItemCoordsByPos(item.posX, item.posY);
		animate(item).now({x: pos.x, y: pos.y}, 200);
	};

	// Adding new items
	for (var u = 0; u < caller.gridFieldInstance.gridWidth; u++)
	{
		for (var v = 0; v < numLines; v++)
		{
			var pos = caller.gridFieldInstance.getItemCoordsByPos( u, v );

			var n_item = caller.gridFieldInstance.getItem();
			n_item.posX = u;
			n_item.posY = v;
			animate(n_item).now({x: pos.x, y: pos.y}, 200);
		};
	};
}