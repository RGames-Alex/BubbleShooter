import ui.TextView;
import animate;

exports = Class(ui.TextView, function(supr)
{
	this.init = function(portW, portH)
	{
		var opts =
		{
			width: portW,
			height: portH,
			fontFamily: 'HARRINGT',
			fontAutoSize: true,
			canHandleEvents: false,
			wrap: true,
		};

		supr(this, 'init', [opts]);
	};

	this.showMessage = function(message, duration)
	{
		this.updateOpts({opacity: 0, text: message});

		if (duration === 'undefined')
			duration = 2000;

		animate(this).now({opacity: 1}, 200).wait(duration).then({opacity: 0}, 200);
	};
});