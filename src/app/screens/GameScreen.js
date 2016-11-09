import ui.View;
import src.game.GameMain as GameMain;
import src.app.ui.MessageBoard as MessageBoard;
import src.app.data.GameMasterMessages as GMMessages;
import src.app.data.LevelData as levelDataArray;
import animate;
import src.game.utils.Shaker as shake;
import src.app.GMSpeechPlayer as GMSpeechPlayer;

// EVENTS
const GAME_EXIT = 'gamescreen:exit';
const GAME_LOST = 'gamescreen:lost';
const GAME_WIN = 'gamescreen:win';

exports = Class(ui.View, function(supr)
{
	this.gameInstance;
	this.messageTextView;
	this.gameMasterTextPlayer;

	this.currentLevel = 0;

	this.init = function(portW, portH)
	{
		supr(this, 'init', [{width: portW, height: portH}]);

		this._setupGameInstance();
		this._setupMessageTextView();
		this._setupGMSpeechPlayer();
	};

	this.startup = function(levelId)
	{
		this.currentLevel = levelId;
		this.style.opacity = 1;

		if (levelId === undefined)
			this.currentLevel = 0;

		this._buildLevel(this.currentLevel);

		// TODO: bring this back when testing is over
		var that = this;
		this.gameInstance.updateOpts({opacity: 0, canHandleEvents: false});
		animate(this.gameInstance).wait(2500).then({opacity: 1}, 500).then( function() {that.gameInstance.updateOpts({canHandleEvents: true}); } );

		animate(this).wait(5000).then( bind(this, this.playGoalTutorialMessage)).wait(6000).then(bind(this, this.playGameLossTutorial));
	};

	// PRIVATE METHODS

	this.playGameLossTutorial = function()
	{
		this.messageTextView.showMessage(GMMessages.gameLossWarningTutorial, 5500);
		this.gameMasterTextPlayer.play('tutorialLoss');
	};

	this.playGoalTutorialMessage = function()
	{
		this.messageTextView.showMessage(GMMessages.gameGoalTutorial, 5500);
		this.gameMasterTextPlayer.play('tutorialGoal');
	};

	this._buildLevel = function(levelId)
	{

		if ( levelId >= levelDataArray.length )
		{
			this._onVictory();
			return;
		}	

		this.gameInstance.buildLevel( levelDataArray[levelId] );
		this.messageTextView.showMessage(GMMessages[levelId], 3500);
		this.gameMasterTextPlayer.play(levelId + 1);
	};

	this._setupGameInstance = function()
	{
		this.gameInstance = new GameMain(this.style.width, this.style.height);
		this.gameInstance.subscribe('game:gameWon', this, this.onLevelWon);
		this.gameInstance.subscribe('game:gameLost', this, this.onLevelLost);
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

	this._setupGMSpeechPlayer = function()
	{
		this.gameMasterTextPlayer = new GMSpeechPlayer();
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
		this.currentLevel = 0;
		
		this.messageTextView.showMessage(GMMessages.lossMessage, 2000);
		this.gameMasterTextPlayer.play('gameLoss');
		animate(this).wait(1400).then({opacity: 0}, 600).then(this._emitGameLoss);
	};

	this.onLevelWon = function()
	{
		this.currentLevel++;
		this._buildLevel(this.currentLevel);
	};

	this._onVictory = function()
	{
		this.currentLevel = 0;
		
		this.messageTextView.showMessage(GMMessages.victoryMessage, 2000);
		this.gameMasterTextPlayer.play('gameWon');
		animate(this).wait(200).then({opacity: 0}, 600).then(this._emitGameWin);
		shake(this.gameInstance, 700, 1.7);
	};

});