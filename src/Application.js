import src.app.screens.TitleScreen as TitleScreen;
import src.app.screens.GameScreen as GameScreen;
import src.app.BackgroundMusicManager as BackgroundMusicManager;
import ui.StackView as StackView;
import device;

exports = Class(GC.Application, function ()
{
  this.titleScreenInstance;
  this.gameScreenInstance;

  this.stackView;
  this.musicManager;

  this.initUI = function () 
  {
  	this.view.style.backgroundColor = '#FFFFFF';

  	this._buildScreens();
  	this._setupStackView();
    this._setupMusicManager();
  };

  this.launchUI = function ()
  {
    this.stackView.push(this.titleScreenInstance);
    this.musicManager.play('menuLoop');
  };

  // PRIVATE METHODS

  this._buildScreens = function()
  {
  	this.titleScreenInstance = new TitleScreen(device.width, device.height);
  	this.titleScreenInstance.subscribe('titlescreen:press', this, this.onTitleScreenClicked);
  	
  	this.gameScreenInstance = new GameScreen(device.width, device.height);
  	this.gameScreenInstance.subscribe('gamescreen:exit', this, this.onGameScreenExit);
    this.gameScreenInstance.subscribe('gamescreen:win', this, this.onGameScreenExit);
    this.gameScreenInstance.subscribe('gamescreen:lost', this, this.onGameScreenExit);
  };

  this._setupStackView = function()
  {
  	this.stackView = new StackView(
  	{
  		superview:this,
  		x: 0,
  		y: 0,
  		width: device.width,
  		height: device.height,
  	});
  };

  this._setupMusicManager = function()
  {
    this.musicManager = new BackgroundMusicManager();
  };

  // EVENT HANDLERS

  this.onTitleScreenClicked = function()
  {
  	this.stackView.pop(true);
  	this.stackView.push(this.gameScreenInstance, true);
  	this.gameScreenInstance.startup();

    this.musicManager.play('gameLoop');
  };

  this.onGameScreenExit = function()
  {
    this.stackView.pop(true);
  	this.stackView.push(this.titleScreenInstance, true);
  	this.titleScreenInstance.fadeIn();

    this.musicManager.play('menuLoop');
  };


});