import src.game.utils.Shaker as shake;
import animate;

exports = function(caller, onAnimationCompleteCallback)
{
	var currentItem;
	for ( var i = 0; i < caller.gridFieldInstance.registeredItems.length; i++)
	{
		currentItem = caller.gridFieldInstance.registeredItems[i];

		if ( Math.random() > .5)
			animate(currentItem).wait( (Math.random() * 700) >> 0 ).now({y: currentItem.style.y + 100}, 150).then({opacity: .5}, 150).then(function(){popItem(currentItem)});
		else
			animate(currentItem).wait( (Math.random() * 700) >> 0 ).now({scale: 1.2}, 300).then(function(){popItem(currentItem)});
	}

	animate(this).wait(1200).then(onAnimationCompleteCallback);
}


function popItem(item)
{
	item.style.opacity = .1;
}