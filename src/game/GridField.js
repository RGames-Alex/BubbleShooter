import .ObjectPool;
import .FieldItem;

const evenDeltas = [ [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0] ];
const oddDeltas = [ [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 0] ];

exports = Class(function()
{
	this.registeredItems = []; // this is a 1d array of items

	this.itemSize = 0; // item size in pixels
	this.itemRadius = 0;

	this.gridWidth = 0; // the grid width size in item-units
	this.gridHeight = 0; // this grid height size in item-units

	this.fieldWidth = 0; // the field width size in pixels
	this.fieldHeight = 0; // the field height size in pixels

	this.availableItemTypes = [];

	this.__itemPool;
	this.__defaultViewContainer = null;

	// PUBLIC METHODS

	this.init = function(fieldW, fieldH, itemPoolAmount, defaultViewContainer)
	{
		this.fieldWidth = fieldW;
		this.fieldHeight = fieldH;

		if (itemPoolAmount === undefined)
			itemPoolAmount = 625;

		if (defaultViewContainer !== undefined)
			__defaultViewContainer = defaultViewContainer;

		this._poolFieldItems(itemPoolAmount);
	};

	this.build = function(w, h, types)
	{
		this.gridWidth = w;
		this.itemSize = this._getItemSize();
		this.itemRadius = this.itemSize * .5;
		this.gridHeight = this._getMaxGridHeight();
		this.availableItemTypes = types;

		__itemPool.updateAllOpts(
		{
			width: this.itemSize,
			height: this.itemSize,
			offsetX: -this.itemSize * .5,
			offsetY: -this.itemSize * .5,
			anchorX: -this.itemSize * .5,
			anchorY: -this.itemSize * .5,
		});

		for ( var i = 0; i < w; i++ )
			for ( var j = 0; j < h; j++ )
				this.getItem(i, j);

		return this.registeredItems;
	};

	this.reset = function()
	{
		while (this.registeredItems.length > 0)
		{
			this.removeItem(this.registeredItems[0]);
		}
	};

	this.getDisconnectedItems = function()
	{

	};

	this.getConnectedItemsByType = function(originPosX, originPosY, type)
	{

	};

	this.getItemByPos = function(posX, posY)
	{
		var item;
		for (var i = 0; i < this.registeredItems.length; i++)
		{
			item = this.registeredItems[i];

			if (item.posX == posX && item.posY == posY)
				return item;
		}
		return null;
	}

	this.getNeighbours = function(originPosX, originPosY)
	{
		var output = [];
		var deltas = (this.isEven(originPosY) === true) ? this.evenDeltas : this.oddDeltas;

		var delta;
		for (var i = 0; i < deltas.length; i++)
		{
			delta = deltas[i];

			var item = this.getItemByPos(originPosX + delta[0], originPosY + delta[1]);
			if (item === null)
				continue;
			output.push(item);
		}

		return output;
	};

	this.isEven = function (val)
	{
		if (val == 0) return true;
			var frac = val / 2;
		return (frac >> 0 == frac) ? true : false;
	}

	this.getItemCoordsByPos = function(posX, posY)
	{
		var itemX = (posY % 2 == 0) ? posX * this.itemSize + (this.itemSize * .5) : (posX + .5) * this.itemSize + (this.itemSize * .5);
		var itemY = posY * .85 * this.itemSize + (this.itemSize * .5);
		return { x: itemX, y: itemY };
	};

	this.getItemPosByCoords = function(coordX, coordY)
	{
		var p = {x: 0, y: 0};

		p.y = Math.floor( (Math.round( (coordY - this.itemRadius) / this.itemSize / .85 ) ) );

		if (p.y % 2 == 0)
			p.x = Math.floor( coordX / this.itemSize );
		else
			p.x = Math.floor( (coordX - this.itemRadius) / this.itemSize);

		return p;
	};

	this.getLowestItemPos = function()
	{
		var lowestY = 0;

		for ( var i = 0; i < this.registeredItems.length; i++)
			if (this.registeredItems[i].posY > lowestY)
				lowestY = this.registeredItems[i].posY;

		return lowestY;
	};

	this.removeItem = function(item)
	{
		for (var i = 0; i < this.registeredItems.length; i++)
			if (this.registeredItems[i] === item)
			{
				this.registeredItems.splice(i, 1);
				break;
			}

		if (__defaultViewContainer !== null)
			__defaultViewContainer.removeSubview(item);

		__itemPool.returnItemToPool(item);
		return item;
	};

	this.getItem = function(posX, posY, type, x, y, register)
	{
		var item = __itemPool.getItem();
		item.posX = (posX !== undefined) ? posX : -1;
		item.posY = (posY !== undefined) ? posY : -1;

		if (x !== undefined && y !== undefined)
		{
			item.style.x = x;
			item.style.y = y;
		}
		else
		{
			var itemCoords = this.getItemCoordsByPos( item.posX, item.posY );
			item.style.x = itemCoords.x;
			item.style.y = itemCoords.y;
		}

		item.setType( (type !== undefined && type !== null) ? type : this.getRandomAvailableTypeIndex() );

		if (register === undefined)
			register = true;

		if (register === true)
			this.registeredItems.push(item);

		if (__defaultViewContainer !== null)
			__defaultViewContainer.addSubview(item);

		return item;
	};

	this.getRandomAvailableTypeIndex = function()
	{
		var randAccessIndex = Math.floor( Math.random() * this.availableItemTypes.length);
		return this.availableItemTypes[randAccessIndex];
	}

	this.registerItem = function(item)
	{
		this.registeredItems.push(item);
	};

	this.unregisterItem = function(item)
	{
		for (var i = this.registeredItems.length; i >= 0; i--)
			if (this.registeredItems[i] === item)
			{
				this.registeredItems.splice(i, 1);
				break;
			}
	}

	// PRIVATE METHODS

	this._poolFieldItems = function(num)
	{
		__itemPool = new ObjectPool(num, FieldItem);
	};

	// TODO: calculate real size
	this._getItemSize = function()
	{
		var rectSize = (this.fieldWidth / this.gridWidth);
		return rectSize - (rectSize / this.gridWidth) * .5 + .25;
	};

	// TODO: refactor this, remove unneeded arguments
	this._getMaxGridHeight = function()
	{
		return Math.floor( this.fieldHeight / this.itemSize * .85);
	};

});