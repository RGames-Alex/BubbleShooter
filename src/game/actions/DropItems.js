import animate;

exports = function(caller, items)
{
	if (items.length < 1)
		return;

	var textX = 0;
	var textY = 0;

	for (var i = 0; i < items.length; i++)
	{
		var item = items[i];

		textX += item.style.x;
		textY += item.style.y;

		animate(item).now({y: caller.style.height + item.style.y}, 420);
	}

	textX /= items.length;
	textY /= items.length;

	caller.floatingTextViewer.showText( items.length * 50, textX, textY, 700, -1 );

	animate(this).wait(450).then( function(){ removeItems(caller, items) });
}

function removeItems(caller, items)
{
	for ( var i = 0; i < items.length; i++)
		caller.gridFieldInstance.removeItem(items[i]);
}