import ui.ImageView;
import ui.resource.Image as Image;

var image = new Image({url: 'resources/images/Arrow.png'});

exports = Class(ui.ImageView, function(supr)
{
	this.init = function()
	{
		var w = image.getWidth();
		var h = image.getHeight();

		var opts =
		{
			width: w,
			height: h,
			offsetX: 0,
			offsetY: -h * .5,
			anchorX: 0,
			anchorY: -h * .5,
			canHandleEvents: false,
		};
		this.setImage(image);

		supr(this, 'init', [opts]);
	};

	this.setScale = function(value)
	{
		this.updateOpts(
		{
			width: this.style.width * value,
			height: this.style.height * value,
			offsetX: this.style.offsetX * value,
			offsetY: (this.style.offsetY * value) * .5,
			anchorX: this.style.anchorX * value,
			anchorY: (this.style.anchorY * value) * .5,
		});

		console.log(this.style.width, this.style.height, this.style.offsetY);
	}
});