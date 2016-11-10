import AudioManager;

const ZAP_SOUND = 'Zap';
const HIT_SOUND = 'Hit';
const SWOOSH_SOUND = 'Swoosh';
const SHOOTING_SOUND = 'Shooting';
const POP_SOUND = 'Pop';

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
				Hit1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Hit2:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Hit3:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				Swoosh1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Swoosh2:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Swoosh3:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				Zap1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				Shooting1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},

				Pop1:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Pop2:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Pop3:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Pop4:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
				Pop5:
				{
					path: 'effects',
					volume: 1,
					background: false,
				},
			}
		});


	};

	this.play = function(effect)
	{
		switch (effect)
		{
			case ZAP_SOUND:
			{
				this._currentTune = 'Zap1';
				break;
			}
			case HIT_SOUND:
			{
				var effectNumber = Math.floor(Math.random() * 3) + 1;
				this._currentTune = 'Hit' + effectNumber;
				break;
			}
			case SWOOSH_SOUND:
			{
				var effectNumber = Math.floor(Math.random() * 3) + 1;
				this._currentTune = 'Swoosh' + effectNumber;
				break;
			}
			case SHOOTING_SOUND:
			{
				this._currentTune = 'Shooting1';
				break;
			}
			case POP_SOUND:
			{
				var effectNumber = Math.floor(Math.random() * 5) + 1;
				this._currentTune = 'Pop' + effectNumber;
				break;
			}
			default:
			{
				console.warn('Sound ' + effect + ' does not exist.');
				return;
			}
		}

		this._manager.play(this._currentTune);
	}

});