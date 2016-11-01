import ui.View;
import src.game.GridField as GridField;

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

	this.__inited = false;

	// PUBLIC METHODS

	this.init = function(portW, portH)
	{
		if (this.__inited !== false)
			return;
		this.__inited = true;

		supr(this, 'init', [ {width: portW, height: portH} ]);

		this._createGridField();
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
		var currentShot = this.gridFieldInstance.getItem(-1, -1, undefined, 250, this.style.height - 100);
		var nextShot = this.gridFieldInstance.getItem(-1, -1, undefined, 190, this.style.height - 50);

		this.shotFieldItems = [currentShot, nextShot];
	}

	this._createGridField = function()
	{
		this.gridFieldInstance = new GridField(this.style.width, this.style.height, 800, this);
	};

	this._addInputListeners = function()
	{
		console.log('adding listeners');
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
		console.log('input start');
		this.subscribe('InputMove', this, this.onGameInputPointMove);
		this.emit(GAME_LOST);
	};

	this.onGameInputOver = function()
	{
		console.log('input over');
		this.unsubscribe('InputMove', this, this.onGameInputPointMove);
		
	};

	this.onGameInputPointMove = function()
	{
		console.log('input move');
	};
});