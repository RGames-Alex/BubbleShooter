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
		caller.particlePlayer.addParticle(item.style.x, item.style.y, 300, getTextureByItemType(item.typeIndex));
	}

	textX /= items.length;
	textY /= items.length;

	var score = items.length * 30;

	caller.floatingTextViewer.showText( score, textX, textY, 700 );
	caller._addScore(score);

	animate(this).wait(210).then( function(){ removeItems(caller, items) });

	caller.soundPlayer.play('Zap');
}

function removeItems(caller, items)
{
	for ( var i = 0; i < items.length; i++)
		caller.gridFieldInstance.removeItem(items[i]);
}

function getTextureByItemType(itemTypeIndex)
{
	switch (itemTypeIndex)
	{
		case 0:
		{
			return 'resources/images/TealParticle.png';
		}
		case 1:
		{
			return 'resources/images/YellowParticle.png';
		}
		case 2:
		{
			return 'resources/images/PinkParticle.png';
		}
		case 3:
		{
			return 'resources/images/GreenParticle.png';
		}
		case 4:
		{
			return 'resources/images/VioletParticle.png';
		}
		case 5:
		{
			return 'resources/images/MaroonParticle.png';
		}
		case 6:
		{
			return 'resources/images/BrownParticle.png';
		}
		case 7:
		{
			return 'resources/images/NavyParticle.png';
		}
		default:
		{
			return 'resources/images/NavyParticle.png';
		}
	}
}