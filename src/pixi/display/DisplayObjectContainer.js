/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class PIXILegacy.DisplayObjectContainer
 * @extends PIXILegacy.DisplayObject
 * @constructor
 */
PIXILegacy.DisplayObjectContainer = function ()
{

    PIXILegacy.DisplayObject.call(this);

    /**
     * [read-only] The array of children of this container.
     *
     * @property children
     * @type Array(DisplayObject)
     * @readOnly
     */
    this.children = [];

    /**
    * If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.
    *
    * If this property is `true` then the children will _not_ be considered as valid for Input events.
    *
    * Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.
    * @property {boolean} ignoreChildInput
    * @default
    */
    this.ignoreChildInput = false;

};

PIXILegacy.DisplayObjectContainer.prototype = Object.create(PIXILegacy.DisplayObject.prototype);
PIXILegacy.DisplayObjectContainer.prototype.constructor = PIXILegacy.DisplayObjectContainer;

/**
 * Adds a child to the container.
 *
 * @method PIXILegacy.DisplayObjectContainer#addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 * @return {DisplayObject} The child that was added.
 */
PIXILegacy.DisplayObjectContainer.prototype.addChild = function (child)
{

    return this.addChildAt(child, this.children.length);

};

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method PIXILegacy.DisplayObjectContainer#addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 * @return {DisplayObject} The child that was added.
 */
PIXILegacy.DisplayObjectContainer.prototype.addChildAt = function (child, index)
{

    if (index >= 0 && index <= this.children.length)
    {
        if (child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        return child;
    }
    else
    {
        throw new Error(child + 'addChildAt: The index ' + index + ' supplied is out of bounds ' + this.children.length);
    }

};

/**
 * Swaps the position of 2 Display Objects within this container.
 *
 * @method PIXILegacy.DisplayObjectContainer#swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 */
PIXILegacy.DisplayObjectContainer.prototype.swapChildren = function (child, child2)
{

    if (child === child2)
    {
        return;
    }

    var index1 = this.getChildIndex(child);
    var index2 = this.getChildIndex(child2);

    if (index1 < 0 || index2 < 0)
    {
        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;

};

/**
 * Returns the index position of a child DisplayObject instance
 *
 * @method PIXILegacy.DisplayObjectContainer#getChildIndex
 * @param child {DisplayObject} The DisplayObject instance to identify
 * @return {Number} The index position of the child display object to identify
 */
PIXILegacy.DisplayObjectContainer.prototype.getChildIndex = function (child)
{

    var index = this.children.indexOf(child);

    if (index === -1)
    {
        throw new Error('The supplied DisplayObject must be a child of the caller');
    }

    return index;

};

/**
 * Changes the position of an existing child in the display object container
 *
 * @method PIXILegacy.DisplayObjectContainer#setChildIndex
 * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number
 * @param index {Number} The resulting index number for the child display object
 */
PIXILegacy.DisplayObjectContainer.prototype.setChildIndex = function (child, index)
{

    if (index < 0 || index >= this.children.length)
    {
        throw new Error('The supplied index is out of bounds');
    }

    var currentIndex = this.getChildIndex(child);

    this.children.splice(currentIndex, 1); // remove from old position
    this.children.splice(index, 0, child); // add at new position

};

/**
 * Returns the child at the specified index
 *
 * @method PIXILegacy.DisplayObjectContainer#getChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child at the given index, if any.
 */
PIXILegacy.DisplayObjectContainer.prototype.getChildAt = function (index)
{

    if (index < 0 || index >= this.children.length)
    {
        throw new Error('getChildAt: Supplied index ' + index + ' does not exist in the child list, or the supplied DisplayObject must be a child of the caller');
    }

    return this.children[index];

};

/**
 * Removes a child from the container.
 *
 * @method PIXILegacy.DisplayObjectContainer#removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 * @return {DisplayObject} The child that was removed.
 */
PIXILegacy.DisplayObjectContainer.prototype.removeChild = function (child)
{

    var index = this.children.indexOf(child);

    if (index === -1)
    {
        return;
    }

    return this.removeChildAt(index);

};

/**
 * Removes a child from the specified index position.
 *
 * @method PIXILegacy.DisplayObjectContainer#removeChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child that was removed.
 */
PIXILegacy.DisplayObjectContainer.prototype.removeChildAt = function (index)
{

    var child = this.getChildAt(index);

    if (child)
    {
        child.parent = undefined;

        this.children.splice(index, 1);
    }

    return child;

};

PIXILegacy.DisplayObjectContainer.prototype.bringChildToTop = function (child)
{

    if (child.parent !== this)
    {
        return;
    }

    return this.setChildIndex(child, this.children.length - 1);

};

PIXILegacy.DisplayObjectContainer.prototype.sendChildToBack = function (child)
{

    if (child.parent !== this)
    {
        return;
    }

    return this.setChildIndex(child, 0);

};

/**
* Removes all children from this container that are within the begin and end indexes.
*
* @method PIXILegacy.DisplayObjectContainer#removeChildren
* @param beginIndex {Number} The beginning position. Default value is 0.
* @param endIndex {Number} The ending position. Default value is size of the container.
*/
PIXILegacy.DisplayObjectContainer.prototype.removeChildren = function (beginIndex, endIndex)
{

    if (beginIndex === undefined) { beginIndex = 0; }
    if (endIndex === undefined) { endIndex = this.children.length; }

    var range = endIndex - beginIndex;

    if (range > 0 && range <= endIndex)
    {
        var removed = this.children.splice(beginIndex, range);

        for (var i = 0; i < removed.length; i++)
        {
            var child = removed[i];
            child.parent = undefined;
        }

        return removed;
    }
    else if (range === 0 && this.children.length === 0)
    {
        return [];
    }
    else
    {
        throw new Error('removeChildren: Range Error, numeric values are outside the acceptable range');
    }

};

/*
 * Updates the transform on all children of this container for rendering
 *
 * @method PIXILegacy.DisplayObjectContainer#updateTransform
 * @private
 */
PIXILegacy.DisplayObjectContainer.prototype.updateTransform = function ()
{

    if (!this.active || !this.visible)
    {
        return;
    }

    this.displayObjectUpdateTransform();

    if (this._cacheAsBitmap)
    {
        return;
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }

};

// performance increase to avoid using call.. (10x faster)
PIXILegacy.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = PIXILegacy.DisplayObjectContainer.prototype.updateTransform;

/**
 * Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
 *
 * @method PIXILegacy.DisplayObjectContainer#getBounds
 * @param {PIXILegacy.DisplayObject|Phaser.Matrix} [targetCoordinateSpace] Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
 * @return {Rectangle} The rectangular bounding area
 */
PIXILegacy.DisplayObjectContainer.prototype.getBounds = function (targetCoordinateSpace)
{

    var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXILegacy.DisplayObject);
    var isTargetCoordinateSpaceThisOrParent = true;

    if (!isTargetCoordinateSpaceDisplayObject)
    {
        targetCoordinateSpace = this;
    }
    else if (targetCoordinateSpace instanceof PIXILegacy.DisplayObjectContainer)
    {
        isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
    }
    else
    {
        isTargetCoordinateSpaceThisOrParent = false;
    }

    var i;

    if (isTargetCoordinateSpaceDisplayObject)
    {
        var matrixCache = targetCoordinateSpace.worldTransform;

        targetCoordinateSpace.worldTransform = Phaser.identityMatrix;

        for (i = 0; i < targetCoordinateSpace.children.length; i++)
        {
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    var childVisible = false;

    for (i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (!child.active || !child.visible)
        {
            continue;
        }

        childVisible = true;

        childBounds = this.children[i].getBounds();

        minX = (minX < childBounds.x) ? minX : childBounds.x;
        minY = (minY < childBounds.y) ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = (maxX > childMaxX) ? maxX : childMaxX;
        maxY = (maxY > childMaxY) ? maxY : childMaxY;
    }

    var bounds = this._bounds;

    if (!childVisible)
    {
        bounds = new PIXILegacy.Rectangle();

        var w0 = bounds.x;
        var w1 = bounds.width + bounds.x;

        var h0 = bounds.y;
        var h1 = bounds.height + bounds.y;

        var worldTransform = this.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;

        maxX = x1;
        maxY = y1;

        minX = x1;
        minY = y1;

        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    if (isTargetCoordinateSpaceDisplayObject)
    {
        targetCoordinateSpace.worldTransform = matrixCache;

        for (i = 0; i < targetCoordinateSpace.children.length; i++)
        {
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    if (!isTargetCoordinateSpaceThisOrParent)
    {
        var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();

        bounds.x -= targetCoordinateSpaceBounds.x;
        bounds.y -= targetCoordinateSpaceBounds.y;
    }

    return bounds;

};

/**
 * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle without any transformations. The calculation takes all visible children into consideration.
 *
 * @method PIXILegacy.DisplayObjectContainer#getLocalBounds
 * @return {Rectangle} The rectangular bounding area
 */
PIXILegacy.DisplayObjectContainer.prototype.getLocalBounds = function ()
{

    return this.getBounds(this);

};

/**
* Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.
*
* @method PIXILegacy.DisplayObjectContainer#contains
* @param {DisplayObject} child
* @returns {boolean}
*/
PIXILegacy.DisplayObjectContainer.prototype.contains = function (child)
{

    if (!child)
    {
        return false;
    }
    else if (child === this)
    {
        return true;
    }
    else
    {
        return this.contains(child.parent);
    }
};

/**
* Renders the object using the WebGL renderer
*
* @method PIXILegacy.DisplayObjectContainer#_renderWebGL
* @param renderSession {RenderSession}
* @private
*/
PIXILegacy.DisplayObjectContainer.prototype._renderWebGL = function (renderSession)
{

    if (!this.active || !this.visible || this.alpha <= 0)
    {
        return;
    }

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    var i;

    if (this._mask || this._filters)
    {
        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if (this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            if (child.active)
            {
                child._renderWebGL(renderSession);
            }
        }

        renderSession.spriteBatch.stop();

        if (this._mask) { renderSession.maskManager.popMask(this._mask, renderSession); }
        if (this._filters) { renderSession.filterManager.popFilter(); }

        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            if (child.active)
            {
                child._renderWebGL(renderSession);
            }
        }
    }

};

/**
* Renders the object using the Canvas renderer
*
* @method PIXILegacy.DisplayObjectContainer#_renderCanvas
* @param renderSession {RenderSession}
* @private
*/
PIXILegacy.DisplayObjectContainer.prototype._renderCanvas = function (renderSession)
{

    if (this.active === false || this.visible === false || this.alpha === 0)
    {
        return;
    }

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];
        if (child.active)
        {
            child._renderCanvas(renderSession);
        }
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @name PIXILegacy.DisplayObjectContainer#width
 * @type Number
 */
Object.defineProperty(PIXILegacy.DisplayObjectContainer.prototype, 'width', {

    get: function ()
    {
        return this.getLocalBounds().width * this.scale.x;
    },

    set: function (value)
    {

        var width = this.getLocalBounds().width;

        if (width !== 0)
        {
            this.scale.x = value / width;
        }
        else
        {
            this.scale.x = 1;
        }

        this._width = value;
    }
});

/**
 * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @name PIXILegacy.DisplayObjectContainer#height
 * @type Number
 */
Object.defineProperty(PIXILegacy.DisplayObjectContainer.prototype, 'height', {

    get: function ()
    {
        return this.getLocalBounds().height * this.scale.y;
    },

    set: function (value)
    {

        var height = this.getLocalBounds().height;

        if (height !== 0)
        {
            this.scale.y = value / height;
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }

});
