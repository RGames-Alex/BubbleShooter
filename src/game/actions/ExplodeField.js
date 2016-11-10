import .PopMatchingItems;
import animate;

var gridItems;
var gravity = .21;
var onCompleteCallback;

var __caller;

exports = function(caller, onAnimationCompleteCallback)
{
	__caller = caller;
	onCompleteCallback = onAnimationCompleteCallback;

	gridItems = __caller.gridFieldInstance.registeredItems.concat();

	for (var i = 0; i < gridItems.length; i++)
	{
		__caller.gridFieldInstance.unregisterItem(gridItems[i]);

		gridItems[i].speedX = Math.random() * 5 - 2.5;
		gridItems[i].speedY = Math.random() * -3;
	}
	

	GC.app.engine.subscribe('Tick', this, onTick);
}

function onTick(dt)
{

	if (dt < 16)
		return;

	if (gridItems.length < 1)
	{
		GC.app.engine.unsubscribe('Tick', this, onTick);
		onCompleteCallback();
	}

	for (var i = gridItems.length - 1; i >= 0; i--)
	{
		var currentItem = gridItems[i];

		currentItem.speedY += gravity;

		currentItem.style.x += currentItem.speedX;
		currentItem.style.y += currentItem.speedY;

		if (currentItem.style.x > __caller.style.width || currentItem.style.x < 0 || currentItem.style.y > __caller.style.height)
		{
			gridItems.splice(i, 1);
			currentItem.style.opacity = .3;
			__caller.particlePlayer.addParticle(currentItem.style.x, currentItem.style.y, 150, getTextureByItemType(currentItem.typeIndex));
			__caller.soundPlayer.play('Pop');
			__caller.gridFieldInstance.removeItem(currentItem);
		}
	};

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