import ui.View;

// EVENTS
const GAME_LOST = 'gameLost';
const GAME_WON = 'gameWon';
const SCORE_CHANGE = 'gameScoreChange';

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

	this.fieldItems = [];
	this.nextInLineFieldItems = [];
	this.directionArrow; 

	// PUBLIC METHODS

	this.init = function(portW, portH)
	{
		supr(this, 'init', [ {width: portW, height: portH} ]);

		this._poolFieldItems(625); // note: it's better to pool a little more items than to add more to the pool on run-time
	};

	this.buildLevel = function(levelData)
	{
		this.currentLevelData = merge(this.currentLevelData, levelData);

		// destroy all exitsing items
		// build grid
		// set items to the cannon
		// add input listeners
		this._addInputListeners();
	}



	// PRIVATE METHODS
	
	this._poolFieldItems = function(num)
	{

	};

	this._addInputListeners = function()
	{
		this.subscribe('InputStartCapture', this, this.onInputStart);
		this.subscribe('InputOver', this, this.onInputOver);
	}

	this._removeInputListeners = function()
	{
		this.unsubscribe('InputStartCapture', this, this.onInputStart);
		this.unsubscribe('InputOver', this, this.onInputOver);
	};

	// EVENT HANDLERS

	this.onInputStart = function()
	{
		this.subscribe('InputMove', this, this.onInputStart);
	};

	this.onInputOver = function()
	{
		this.unsubscribe('InputMove', this, this.onInputStart);
	};

	this.onInputPointMove = function()
	{

	};
});