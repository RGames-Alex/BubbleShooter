import ui.View;
import ui.TextView as TextView;
import .GridField;
import .ShotCounter;
import .FloatingText;
import .SoundPlayer;
import .utils.ParticlePlayer as ParticlePlayer;
import .actions.CalculateItemPath as calculatePath;
import .actions.PopMatchingItems as popItems;
import .actions.AddLines as addLines;
import .actions.DropItems as dropItems;
import .actions.ExplodeField as explodeField;
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

	this.currentScore = 0;

	this.gridFieldInstance;
	this.shotCounter;
	this.floatingTextViewer;
	this.soundPlayer;
	this.particlePlayer;
	
	this.shotFieldItems = [];
	this.nextShotPoint = {x: 0, y: 0};
	this.followupShotPoint = {x: 0, y: 0};

	this.shotCounterTextView;
	this.scoreTextView;

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
		this._setupFloatingText();
		this._setupTextViews();
		this._setupSoundPlayer();
		this._setupParticlePlayer();
	};

	this.buildLevel = function(levelData)
	{
		this.gridFieldInstance.reset();
		this._resetShotFieldItems();

		this.currentLevelData = levelData;
		this.gridFieldInstance.build(this.currentLevelData.startGridWidth, this.currentLevelData.startGridHeight, this.currentLevelData.availableItems);
		this._calculateShotPoints();
		this._setupShotCounter(levelData.minMoves, levelData.maxMoves);
		this._setupShotItems();
		addLines(this, this.currentLevelData.startGridHeight);
		this._addInputListeners();
	};

	// PRIVATE METHODS
	this.shoot = function()
	{
		if (this._canShoot == false)
			return;
		this._canShoot = false;

		this.soundPlayer.play('Shooting');

		var targetBall = this.shotFieldItems.pop();
		this.gridFieldInstance.registerItem(targetBall);

		var angleInRad = Math.atan2(this._mouseY - targetBall.style.y, this._mouseX - targetBall.style.x);
		var itemRadius = this.gridFieldInstance.itemSize * .5;
		var path = calculatePath(targetBall, angleInRad, itemRadius, this.gridFieldInstance.registeredItems);

		var ballAnimation = animate(targetBall);
		for (var i = 0; i < path.length; i++)
		{
			var segment = path[i];
			if (i < path.length - 1)
				ballAnimation.then({x: segment.x, y: segment.y}, 200).then(bind(this, function()
					{
						this.soundPlayer.play('Hit');
						var targetX = (targetBall.style.x > this.style.width * .5) ? targetBall.style.x + targetBall.style.width * .5 : targetBall.style.x + targetBall.style.width * -.5;
						var targetY = targetBall.style.y;
						var targetDirection = (targetBall.style.x > this.style.width * .5) ? -1 : 1;
						this.particlePlayer.addDirectionalSparks(targetX, targetY, targetDirection);
					}));
			else
				ballAnimation.then({x: segment.x, y: segment.y}, 200).then(bind(this, function()
					{
						this.soundPlayer.play('Hit');
					}));
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

		// hard-fix to having items outside of grid bounds
		if (shotItem.posX < 0 || shotItem.posX >= this.gridFieldInstance.gridWidth)
		{
			dropItems(this, [shotItem], false);
			return;
		}

		var connectedChain = this.gridFieldInstance.getConnectedItemsByType(shotItem.posX, shotItem.posY, shotItem.typeIndex);
		if (connectedChain.length > 2)
		{
			popItems(this, connectedChain);

			dropItems(this, this.gridFieldInstance.getDisconnectedItems(), true);
		}	
		else
		{
			this.shotCounter.step();
			var counterText = "Counter: " + this.shotCounter.getCounter();
			this.shotCounterTextView.updateOpts({text: counterText});

			dropItems(this, this.gridFieldInstance.getDisconnectedItems(), false);
		}	

		
		
		if (this.gridFieldInstance.getLowestItemPos() >= this.gridFieldInstance.gridHeight - 1)
			this.onGameLost();

		
	};

	this._reload = function()
	{
		var newShot = this.gridFieldInstance.getItem(undefined, undefined, undefined, undefined, undefined, false);
		newShot.style.x = this.followupShotPoint.x;
		newShot.style.y = this.followupShotPoint.y + this.gridFieldInstance.itemSize;
		animate(newShot).now({y: this.followupShotPoint.y}, 300);

		this.shotFieldItems.splice(0, 0, newShot);
		
		var currentShot = this.shotFieldItems[1];
		animate(currentShot).now({x: this.nextShotPoint.x, y: this.nextShotPoint.y}, 300)
		.then( bind(this, function() { this._canShoot = true; }) );
	};

	this._calculateShotPoints = function()
	{
		this.nextShotPoint.x = this.style.width / 2;
		this.nextShotPoint.y = this.style.height - this.gridFieldInstance.itemSize * .5;

		this.followupShotPoint.x = this.style.width / 2 - this.gridFieldInstance.itemSize;
		this.followupShotPoint.y = this.style.height;
	};

	this._setupShotCounter = function(minMoves, maxMoves)
	{
		this.shotCounter.setMinCounter(minMoves);
		this.shotCounter.setMaxCounter(maxMoves);
		this.shotCounter.setCurrentValue(maxMoves);

		var counterText = "Counter: " + this.shotCounter.getCounter();
		this.shotCounterTextView.updateOpts({text: counterText});
	};

	this._setupShotItems = function()
	{
		// this will be the first item to be shot
		var currentShot = this.gridFieldInstance.getItem(undefined, undefined, undefined, undefined, undefined, false);
		currentShot.style.x = this.nextShotPoint.x;
		currentShot.style.y = this.nextShotPoint.y;

		// this is the follow-up item to be shot
		var nextShot = this.gridFieldInstance.getItem(undefined, undefined, undefined, undefined, undefined, false);
		nextShot.style.x = this.followupShotPoint.x;
		nextShot.style.y = this.followupShotPoint.y;

		this.shotFieldItems = [nextShot, currentShot];

		this._canShoot = true;
	};

	this._createGridField = function()
	{
		this.gridFieldInstance = new GridField(this.style.width, this.style.height, 800, this);
	};

	this._createShotCounter = function()
	{
		this.shotCounter = new ShotCounter();
	};

	this._setupFloatingText = function()
	{
		this.floatingTextViewer = new FloatingText(this.style.width, this.style.height);
		this.addSubview(this.floatingTextViewer);
	}

	this._setupSoundPlayer = function()
	{
		this.soundPlayer = new SoundPlayer();
	};

	this._setupTextViews = function()
	{
		this.scoreTextView = new TextView(
		{
			superview: this,
			width: this.style.width,
			height: this.style.height * .04,
			horizontalAlign: 'right',
			autoFontSize: true,
			canHandleEvents: false,
			text: 'Score: 0',
			y: this.style.height - (this.style.height * .04) + 10,
			fontFamily: 'HARRINGT',
		});

		this.shotCounterTextView = new TextView(
		{
			superview: this,
			width: this.style.width,
			height: this.style.height * .04,
			horizontalAlign: 'left',
			autoFontSize: true,
			canHandleEvents: false,
			text: 'Counter: 6',
			y: this.style.height - (this.style.height * .04) + 10,
			fontFamily: 'HARRINGT',
		});
	};

	this._setupParticlePlayer = function()
	{
		this.particlePlayer = new ParticlePlayer(this.style.width, this.style.height);
		this.particlePlayer.updateOpts({zIndex: 9999});
		this.addSubview(this.particlePlayer);
	}

	this._addInputListeners = function()
	{
		if (this._listenersActive === true)
			return;
		this._listenersActive = true;
		
		this.subscribe('InputSelect', this, this.onGameInputStart);

		this.shotCounter.subscribe('counter:rotationComplete', this, this.onCounterRotationComplete);
	}

	this._removeInputListeners = function()
	{
		if (this._listenersActive === false)
			return;
		this._listenersActive = false;

		this.unsubscribe('InputSelect', this, this.onGameInputStart);

		this.shotCounter.unsubscribe('counter:rotationComplete', this, this.onCounterRotationComplete);
	};

	this._addScore = function(value)
	{
		this.currentScore += value;
		this.scoreTextView.updateOpts({text: 'Score: ' + this.currentScore});

		if (this.currentScore >= this.currentLevelData.scoreToBeat)
		{
			this.onGameWon();
		}
	}

	this._resetScore = function()
	{
		this.currentScore = 0;
		this.scoreTextView.updateOpts({text: 'Score: ' + this.currentScore});
	};

	this._resetShotFieldItems = function() 
	{
		if (this.shotFieldItems.length < 1)
			return;

		var currentItem;
		for (var i = this.shotFieldItems.length - 1; i >= 0; i--)
		{
			currentItem = this.shotFieldItems[i];
			this.gridFieldInstance.__itemPool.returnItemToPool(currentItem);
			this.removeSubview(currentItem);

			this.shotFieldItems.splice(i, 1);
		}
	};

	this._emitGameWin = function()
	{
		this.emit(GAME_WON);
	}

	this._emitGameLoss = function()
	{
		this.emit(GAME_LOST);
	}

	// EVENT HANDLERS

	this.onCounterRotationComplete = function()
	{
		addLines(this, this.currentLevelData.linesPerWave);
	}

	this.onGameInputStart = function(e)
	{
		this._mouseX = e.srcPoint.x;
		this._mouseY = e.srcPoint.y;

		this.shoot();
	};

	this.onGameLost = function()
	{
		this._removeInputListeners();
		this._resetScore();
		this._emitGameLoss();
	}

	this.onGameWon = function()
	{
		this._removeInputListeners();

		explodeField(this, bind(this, this._emitGameWin));
	}
});