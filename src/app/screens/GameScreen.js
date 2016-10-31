import ui.View;
import src.game.GameMain as GameMain;
import src.app.ui.MessageBoard as MessageBoard;
import src.app.data.GameMasterMessages as GMMessages;
import src.app.data.LevelData as levelDataArray;
import animate;

// EVENTS
const GAME_EXIT = 'gamescreen:exit';
const GAME_LOST = 'gamescreen:lost';
const GAME_WIN = 'gamescreen:win';

exports = Class(ui.View, function(supr)
{
	this.gameInstance;
	this.messageTextView;

	this.currentLevel = 0;

	this.init = function(portW, portH)
	{
		supr(this, 'init', [{width: portW, height: portH}]);

		this._setupGameInstance();
		this._setupMessageTextView();
	};

	this.startup = function(levelId)
	{
		this.currentLevel = levelId;

		if (levelId === undefined)
			this.currentLevel = 0;

		this._buildLevel(this.currentLevel);

		var that = this;
		this.gameInstance.updateOpts({opacity: 0, canHandleEvents: false});
		animate(this.gameInstance).wait(2500).then({opacity: 1}, 350).then( function() { that.gameInstance.updateOpts({canHandleEvents: true}); } );
	};

	// PRIVATE METHODS

	this._buildLevel = function(levelId)
	{

		if ( levelId >= levelDataArray.length )
		{
			this._emitGameWin();
			return;
		}	

		this.gameInstance.buildLevel( levelDataArray[levelId] );
		this.messageTextView.showMessage(GMMessages[levelId], 3500);
	};

	this._setupGameInstance = function()
	{
		this.gameInstance = new GameMain(this.style.width, this.style.height);
		this.gameInstance.subscribe('game:levelWon', this, this.onLevelWon);
		this.gameInstance.subscribe('game:levelLost', this, this.onLevelLost);
		this.addSubview(this.gameInstance);
	};

	this._setupMessageTextView = function()
	{
		var messageTextViewPortWidth = this.style.width * .8;
		var messageTextViewPortHeight = this.style.height * .3;

		this.messageTextView = new MessageBoard(messageTextViewPortWidth, messageTextViewPortHeight);
		this.messageTextView.style.x = (this.style.width - messageTextViewPortWidth) * .5;
		this.messageTextView.style.y = this.style.height - messageTextViewPortHeight - 10;
		this.addSubview(this.messageTextView);
	};

	this._emitGameWin = function()
	{
		this.emit(GAME_WIN);
	}

	this._emitGameLoss = function()
	{
		this.emit(GAME_LOST);
	}

	// EVENT HANDLERS
	this.onLevelLost = function()
	{
		console.log('level lost');
		this._emitGameLoss();
	};

	this.onLevelWon = function()
	{
		console.log('level won');
		this.currentLevel++;
		this._buildLevel(this.currentLevel);
	};

});