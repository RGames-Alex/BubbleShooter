import ui.View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.resource.Image as Image;
import animate;

var bgImage = new Image({url: 'resources/images/mainMenuBG.png'});
const SCREEN_CLICKED = 'titlescreen:press';

exports = Class(ui.View, function (supr)
{
	this.init = function(portW, portH)
	{
		supr(this, 'init', [{width: portW, height: portH}]);

		this.setupBg();
		this.setScreenListener();
	}

	this.setupBg = function()
	{
		var imageW = bgImage.getWidth();
		if (imageW > this.style.width)
			imageW = this.style.width;

		var imageH = (imageW / bgImage.getWidth() ) * bgImage.getHeight();

		var bgImageView = new ImageView(
		{
			superview: this,
			image: bgImage,
			width: imageW,
			height: imageH,
			canHandleEvents: false,
		});

		var fontW = this.style.width * .8;
		var fontH = this.style.height * .15;

		var startButtonText = new TextView(
		{
			superview: this,
			fontFamily: 'HARRINGT',
			text: 'Touch to start',
			canHandleEvents: false,
			fontAutoSize: true,
			width: fontW,
			height: fontH,
			x: (this.style.width - fontW) * .5,
			y: (this.style.height - fontH) - 10,
		});
	}

	this.setScreenListener = function()
	{
		this.subscribe('InputSelect', this, this.onScreenClick);
	};

	this.fadeIn = function()
	{
		animate(this).now({opacity: 1}, 300);
	}

	// EVENT HANDLERS

	this.onScreenClick = function()
	{
		animate(this).now({opacity: 0}, 300).then(function(){this.emit(SCREEN_CLICKED)});
	};
});