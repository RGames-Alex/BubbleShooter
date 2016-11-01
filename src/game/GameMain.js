import ui.View;
import .GridField;
import .AimingArrow;

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
	this.shotFieldItems = [];
	this.aimingArrow;

	this.__inited = false;
	this._canShoot = false;

	// PUBLIC METHODS

	this.init = function(portW, portH)
	{
		if (this.__inited !== false)
			return;
		this.__inited = true;

		supr(this, 'init', [ {width: portW, height: portH} ]);

		this._createGridField();
		this._setupAimingArrow();
		this._addInputListeners();
	};

	this.buildLevel = function(levelData)
	{
		this.gridFieldInstance.reset();

		this.currentLevelData = levelData;
		this.gridFieldInstance.build(this.currentLevelData.startGridWidth, this.currentLevelData.startGridHeight, this.currentLevelData.availableItems);

		this._setupShotItems();
	};

	// PRIVATE METHODS

	this._setupShotItems = function()
	{
		// this will be the first item to be shot
		var currentShot = this.gridFieldInstance.getItem();
		currentShot.style.x = (this.style.width - this.gridFieldInstance.itemSize) * .5;
		currentShot.style.y = (this.style.height - this.gridFieldInstance.itemSize);

		// this is the follow-up item to be shot
		var nextShot = this.gridFieldInstance.getItem();
		nextShot.style.x = (this.style.width - this.gridFieldInstance.itemSize) * .5 - this.gridFieldInstance.itemSize;
		nextShot.style.y = this.style.height - this.gridFieldInstance.itemSize * .5;

		this.shotFieldItems = [nextShot, currentShot];

		this._canShoot = true;
	}

	this._setupAimingArrow = function()
	{
		aimingArrow = new AimingArrow();
		aimingArrowScale = (this.style.height * .35) / aimingArrow.style.width;
		// aimingArrow.setScale(1);
		aimingArrow.style.x = 0//this.style.width * .5;
		aimingArrow.style.y = this.style.height;
		this.addSubview(aimingArrow);
	};

	this._createGridField = function()
	{
		this.gridFieldInstance = new GridField(this.style.width, this.style.height, 800, this);
	};

	this._addInputListeners = function()
	{
		this.subscribe('InputSelect', this, this.onGameInputStart);
		this.subscribe('InputOver', this, this.onGameInputOver);
	}

	this._removeInputListeners = function()
	{
		this.unsubscribe('InputSelect', this, this.onGameInputStart);
		this.unsubscribe('InputOver', this, this.onGameInputOver);
	};

	// EVENT HANDLERS

	this.onGameInputStart = function()
	{
		this.subscribe('InputMove', this, this.onGameInputPointMove);
	};

	this.onGameInputOver = function()
	{
		this.unsubscribe('InputMove', this, this.onGameInputPointMove);
	};

	this.onGameInputPointMove = function()
	{
		
	};
});