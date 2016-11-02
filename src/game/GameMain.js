import ui.View;
import .GridField;
import .AimingArrow;
import .ShotCounter;
import .actions.CalculateItemPath as calculatePath;
import animate;


// EVENTS
const GAME_LOST = 'game:gameLost';
const GAME_WON = 'game:gameWon';
const SCORE_CHANGE = 'game:gameScoreChange';

exports = Class(ui.View, function(supr)
{
	this.currentLevelData =
	{
		scoreToBeat: 100,
		startGridWidth: 1,
		startGridHeight: 1,
		linesPerWave: 1,
		maxMoves: 6,
		minMoves: 1,
		availableItems: [0, 1, 2],
	};

	this.gridFieldInstance;
	this.shotCounter;
	
	this.shotFieldItems = [];
	this.nextShotPoint = {x: 0, y: 0};
	this.followupShotPoint = {x: 0, y: 0};

	this.aimingArrow;

	this.__inited = false;
	this._canShoot = false;

	this._mouseX = 0;
	this._mouseY = 0;

	this._listenersActive = false;

	// PUBLIC METHODS

	this.init = function(portW, portH)
	{
		if (this.__inited !== false)
			return;
		this.__inited = true;

		supr(this, 'init', [ {width: portW, height: portH} ]);

		this._createGridField();
		this._createShotCounter();
		this._setupAimingArrow();
	};

	this.buildLevel = function(levelData)
	{
		this.gridFieldInstance.reset();

		this.currentLevelData = levelData;
		this.gridFieldInstance.build(this.currentLevelData.startGridWidth, this.currentLevelData.startGridHeight, this.currentLevelData.availableItems);
		this._calculateShotPoints();

		this._setupShotItems();
		this._addInputListeners();
	};

	// PRIVATE METHODS
	this.shoot = function()
	{
		if (this._canShoot == false)
			return;
		this._canShoot = false;

		var targetBall = this.shotFieldItems.pop();

		var angleInRad = Math.atan2(this._mouseY - targetBall.style.y, this._mouseX - targetBall.style.x);
		var itemRadius = this.gridFieldInstance.itemSize * .5;
		var path = calculatePath(targetBall, angleInRad, itemRadius, this.gridFieldInstance.registeredItems);

		var ballAnimation = animate(targetBall);
		for (var i = 0; i < path.length; i++)
		{
			var segment = path[i];
			ballAnimation.then({x: segment.x, y: segment.y}, 200);
		}
		var finalBallPoint = path[path.length - 1];
		var ballFinalPos = this.gridFieldInstance.getItemPosByCoords(finalBallPoint.x, finalBallPoint.y);
		targetBall.posX = ballFinalPos.x;
		targetBall.posY = ballFinalPos.y;
		var ballFinalCoords = this.gridFieldInstance.getItemCoordsByPos(ballFinalPos.x, ballFinalPos.y)
		ballAnimation.then({x: ballFinalCoords.x, y: ballFinalCoords.y}, 100)
		.then(bind(this, function(){this._evaluateShot(targetBall);}));

		this._reload();
	}

	this._evaluateShot = function(shotItem)
	{

		// var connectedChain = this.gridFieldInstance.getConnectedItemsByType(shotItem.posX, shotItem.posY, shotItem.typeIndex);
		// if (connectedChain.length > 2)
		// {
		// 	// popItems
		// }
		// else
		// {
		// 	// tick the counter
		// }

		// var disconnectedItems = this.gridFieldInstance.getDisconnectedItems();
		// // drop the disconnected items
		console.log(this.gridFieldInstance.getLowestItemPos(), this.gridFieldInstance.gridHeight - 1);

		if (this.gridFieldInstance.getLowestItemPos() >= this.gridFieldInstance.gridHeight - 1)
		{
			this.onGameLost();
		}

		// TODO: find a better way to allow shooting
		animate(this).wait(1000).then(bind(this, function(){this._canShoot = true;}));
	};

	this._reload = function()
	{
		var newShot = this.gridFieldInstance.getItem();
		newShot.style.x = this.followupShotPoint.x;
		newShot.style.y = this.followupShotPoint.y + this.gridFieldInstance.itemSize;
		animate(newShot).now({y: this.followupShotPoint.y}, 300);

		this.shotFieldItems.splice(0, 0, newShot);
		
		var currentShot = this.shotFieldItems[1];
		animate(currentShot).now({x: this.nextShotPoint.x, y: this.nextShotPoint.y}, 300);
	}

	this._calculateShotPoints = function()
	{
		this.nextShotPoint.x = this.style.width / 2;
		this.nextShotPoint.y = this.style.height - this.gridFieldInstance.itemSize * .5;

		this.followupShotPoint.x = this.style.width / 2 - this.gridFieldInstance.itemSize;
		this.followupShotPoint.y = this.style.height;
	}

	this._setupShotItems = function()
	{
		// this will be the first item to be shot
		var currentShot = this.gridFieldInstance.getItem();
		currentShot.style.x = this.nextShotPoint.x;
		currentShot.style.y = this.nextShotPoint.y;

		// this is the follow-up item to be shot
		var nextShot = this.gridFieldInstance.getItem();
		nextShot.style.x = this.followupShotPoint.x;
		nextShot.style.y = this.followupShotPoint.y;

		this.shotFieldItems = [nextShot, currentShot];

		this._canShoot = true;
	}

	// TODO: add this to the view
	this._setupAimingArrow = function()
	{
		this.aimingArrow = new AimingArrow();
		this.aimingArrow.style.opacity = 0;
	};

	this._createGridField = function()
	{
		this.gridFieldInstance = new GridField(this.style.width, this.style.height, 800, this);
	};

	this._createShotCounter = function()
	{
		this.shotCounter = new ShotCounter();
	};

	this._addInputListeners = function()
	{
		if (this._listenersActive === true)
			return;
		this._listenersActive = true;
		
		this.subscribe('InputSelect', this, this.onGameInputStart);
		this.subscribe('InputOver', this, this.onGameInputOver);
	}

	this._removeInputListeners = function()
	{
		if (this._listenersActive === false)
			return;
		this._listenersActive = false;

		this.unsubscribe('InputSelect', this, this.onGameInputStart);
		this.unsubscribe('InputOver', this, this.onGameInputOver);
	};

	// EVENT HANDLERS

	this.onGameInputStart = function(e)
	{
		this.subscribe('InputMove', this, this.onGameInputPointMove);
		this.aimingArrow.style.opacity = 1;

		this._mouseX = e.srcPoint.x;
		this._mouseY = e.srcPoint.y;

		this.shoot();
	};

	this.onGameInputOver = function()
	{
		this.unsubscribe('InputMove', this, this.onGameInputPointMove);
		this.aimingArrow.style.opacity = 0;
	};

	this.onGameInputPointMove = function()
	{
		// TODO: rotate the aimingArrow
	};

	this.onGameLost = function()
	{
		this._removeInputListeners();
		this.emit(GAME_LOST);
	}
});