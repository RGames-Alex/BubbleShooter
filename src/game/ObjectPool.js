// TODO: make used items to be sent to the back of the array and returned items sent to the front of the array
exports = Class(function()
{
	this.pool;

	this.init = function(num, objectCtor, ctorOpts)
	{
		this.pool = [];

		for (var i = 0; i < num; i++)
		{
			var item = (ctorOpts !== undefined) ? new objectCtor(ctorOpts) : new objectCtor();
			item.isUsed = false;
			this.pool.push(item);
		}	
	}

	this.getItem = function()
	{
		var currentItem;
		for (var i = 0; i < this.pool.length; i++)
		{
			currentItem = this.pool[i];
			if (currentItem.isUsed === false)
			{
				currentItem.isUsed = true;
				return currentItem;
			}
		}

		console.warn('no more free items in the pool. Free up some space or make a larger pool');
		return null;
	};

	this.returnItemToPool = function(item)
	{
		item.isUsed = false;
	};

	this.returnItemToPoolByIndex = function(itemIndex)
	{
		this.pool[itemIndex].isUsed = false;
	};

	this.updateAllOpts = function(opts)
	{
		for (var i = 0; i < this.pool.length; i++)
			this.pool[i].updateOpts(opts);
	}


});