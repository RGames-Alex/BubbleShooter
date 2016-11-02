import animate;
import src.game.utils.Shaker as shake;

exports = function(caller, items)
{
	var textX = 0;
	var textY = 0;

	for ( var i = 0; i < items.length; i++)
	{
		var item = items[i];

		textX += item.style.x;
		textY += item.style.y;

		caller.gridFieldInstance.unregisterItem(item);
		shake(item, 200, 1.6);
	}

	textX /= items.length;
	textY /= items.length;

	caller.floatingTextViewer.showText( items.length * 30, textX, textY, 700 );

	animate(this).wait(210).then( function(){ removeItems(caller, items) });
}

function removeItems(caller, items)
{
	for ( var i = 0; i < items.length; i++)
		caller.gridFieldInstance.removeItem(items[i]);
}