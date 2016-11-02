import event.Emitter;

const COUNTER_TICK = 'counter:tick';
const COUNTER_ROTATION_COMPLETE = 'counter:rotationComplete';
const COUNTER_FULL_ROTATION_COMPLETE = 'counter:fullRotationComplete';
const COUNTER_RESET = 'counter:reset';

exports = Class(event.Emitter, function()
{
	var _maxCounter; // this is the max. amount of counts in rotation
	var _minCounter; // this is the min. amount of counts in rotation

	var _maxCounterInRotation; // this is the max counter in a rotation. It will decrease to _minCounter value and then reset to _maxCounterValue

	var __currentCounter; // this is the counter. When reaches 0 a new line[s] will be added

	this.init = function(minCounter, maxCounter, currentCounter)
	{
		if (maxCounter === undefined)
			maxCounter = 0;		
		_maxCounter = maxCounter;

		if (minCounter === undefined)
			minCounter = 0;
		_minCounter = minCounter;

		_maxCounterInRotation = maxCounter;

		if (currentCounter === undefined)
			__currentCounter = _maxCounter;
		else
			__currentCounter = currentCounter;
	};

	this.reset = function()
	{
		_maxCounterInRotation = _maxCounter;
		__currentCounter = _maxCounter;
		this.emit(COUNTER_RESET);
	};

	this.step = function()
	{
		__currentCounter--;

		if ( __currentCounter < 1 )
		{
			this.emit(COUNTER_ROTATION_COMPLETE);
			_maxCounterInRotation--;
			if ( _maxCounterInRotation < _minCounter)
			{
				_maxCounterInRotation = _maxCounter;
				this.emit(COUNTER_FULL_ROTATION_COMPLETE);
			}

			__currentCounter = _maxCounterInRotation;
		}

		this.emit(COUNTER_TICK);
		return __currentCounter;
	};

	this.getCounter = function()
	{
		return __currentCounter;
	};

	this.setMinCounter = function(value)
	{
		_minCounter = value;
	}

	this.setMaxCounter = function(value)
	{
		_maxCounter = value;

		_maxCounterInRotation = _maxCounter;
	}

	this.setCurrentValue = function(value)
	{
		__currentCounter = value;
	}
});