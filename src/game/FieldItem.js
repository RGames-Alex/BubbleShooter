import ui.ImageView;
import ui.resource.Image as Image;

var greenBall = new Image({url:'resources/images/GreenBall.png'});
var yellowBall = new Image({url:'resources/images/YellowBall.png'});
var tealBall = new Image({url:'resources/images/TealBall.png'});
var pinkBall = new Image({url:'resources/images/PinkBall.png'});
var violetBall = new Image({url:'resources/images/VioletBall.png'});
var brownBall = new Image({url:'resources/images/BrownBall.png'});
var navyBall = new Image({url:'resources/images/NavyBall.png'});
var maroonBall = new Image({url:'resources/images/MaroonBall.png'});

var ballImageArray =
[
	tealBall,
	yellowBall,
	pinkBall,
	greenBall,
	violetBall,
	maroonBall,
	brownBall,
	navyBall
];

exports = Class(ui.ImageView, function(supr)
{
	this.id = 0;
	this.typeIndex = 0;
	this.posX = 0;
	this.posY = 0;
	this.isChecked = false;
	this.isConnected = false;

	this.init = function(opts)
	{
		supr(this, 'init', [opts]);
		this.setImage(ballImageArray[0]);
	};

	this.setSize = function(size)
	{
		this.updateOpts(
		{
			width: size,
			height: size,
			offsetX: -size * .5,
			offsetY: -size * .5,
			anchorX: -size * .5,
			anchorY: -size * .5,
		});
	};

	this.setType = function(typeIndex)
	{
		var image = ballImageArray[typeIndex];
		this.typeIndex = typeIndex;
		this.setImage(image);
	};

});