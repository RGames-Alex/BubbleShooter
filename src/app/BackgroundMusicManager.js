import AudioManager;

exports = Class(function()
{
	this._manager;
	this._currentTune;

	this.init = function()
	{
		this._manager = new AudioManager(
		{
			path: 'resources/sounds',
			files:
			{
				menuLoop:
				{
					path: 'music',
					volume: .4,
					background: true,
				},
				gameLoop:
				{
					path: 'music',
					volume: .4,
					background: true,
				}
			}
		});


	};

	this.play = function(loopName)
	{
		switch (loopName)
		{
			case 'menuLoop':
			{
				this._currentTune = 'menuLoop';
				break;
			}
			case 'gameLoop':
			{
				this._currentTune = 'gameLoop';
				break;
			}
			default:
			{
				this._currentTune = 'menuLoop';
				break;
			}
		}

		this._manager.play(this._currentTune);
	}

	this.stop = function ()
	{
		this._manager.stop();
	}

});