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
				GameMessage1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage2:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage3:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage4:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage5:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage6:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage7:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameMessage8:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				GoalTutorial:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				LossWarningTutorial:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				GameLossLine:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				GameWonLine:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

			}
		});


	};

	this.play = function(MessageIndex)
	{
		switch (MessageIndex)
		{
			case 'tutorialGoal':
			{
				this._currentTune = 'GoalTutorial';
				break;
			}
			case 'tutorialLoss':
			{
				this._currentTune = 'LossWarningTutorial';
				break;
			}
			case 'gameLoss':
			{
				this._currentTune = 'GameLossLine';
				break;
			}
			case 'gameWon':
			{
				this._currentTune = 'GameWonLine';
				break;
			}
			case 1:
			{
				this._currentTune = 'GameMessage1';
				break;
			}
			case 2:
			{
				this._currentTune = 'GameMessage2';
				break;
			}
			case 3:
			{
				this._currentTune = 'GameMessage3';
				break;
			}
			case 4:
			{
				this._currentTune = 'GameMessage4';
				break;
			}
			case 5:
			{
				this._currentTune = 'GameMessage5';
				break;
			}
			case 6:
			{
				this._currentTune = 'GameMessage6';
				break;
			}
			case 7:
			{
				this._currentTune = 'GameMessage7';
				break;
			}
			case 8:
			{
				this._currentTune = 'GameMessage8';
				break;
			}
			default:
			{
				return;
			}
		}

		this._manager.play(this._currentTune);
	}

	this.stop = function ()
	{
		this._manager.stop(this._currentTune);
	}

});