import ui.View;
import ui.TextView as TextView;
import animate;
import device;

exports = Class(ui.View, function (supr)
{
	this.init = function (w, h)
	{
		opts =
		{
			x: 0,
			y: 0,
			width: w,
			height: h,
			zIndex: 9999
		};

		supr(this, 'init', [opts]);
	}

	this.showText = function(text, x, y, duration, direction)
	{
		if (text === undefined)
			return;

		if (direction === undefined)
			direction = 1;

		if (x === undefined)
			x = 0;

		if (y === undefined)
			y = 0;

		if (duration === undefined)
			duration = 1000;


		var textView = new TextView(
		{
			superview: this,
			text: text,
			x: x,
			y: y + device.height * .1, // this is just because of the font's offset
			height: device.height * .1,
			width: device.width,
			offsetX: -device.width * .5,
			offsetY: -device.height * .05,
			fontFamily: 'HARRINGT',
			canHandleEvents: false
		});

		var endY = y - textView.style.height * 3 * direction;
		var that = this;
		animate(textView).wait(duration).then({y: endY, opacity: 0 }, 200).then( function(){that.removeItem(textView);});
	}

	this.removeItem = function(item)
	{
		this.removeSubview(item);
		item = null;
	}

});
