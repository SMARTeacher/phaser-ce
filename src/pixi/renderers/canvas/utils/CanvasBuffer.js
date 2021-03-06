/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * Creates a Canvas element of the given size.
 *
 * @class PIXILegacy.CanvasBuffer
 * @constructor
 * @param width {Number} the width for the newly created canvas
 * @param height {Number} the height for the newly created canvas
 */
PIXILegacy.CanvasBuffer = function (width, height)
{
    /**
     * The width of the Canvas in pixels.
     *
     * @property width
     * @type Number
     */
    this.width = width;

    /**
     * The height of the Canvas in pixels.
     *
     * @property height
     * @type Number
     */
    this.height = height;

    /**
     * The Canvas object that belongs to this CanvasBuffer.
     *
     * @property canvas
     * @type HTMLCanvasElement
     */
    this.canvas = Phaser.CanvasPoolStatic.create(this, this.width, this.height);

    /**
     * A CanvasRenderingContext2D object representing a two-dimensional rendering context.
     *
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.canvas.getContext('2d');

    this.canvas.width = width;
    this.canvas.height = height;
};

PIXILegacy.CanvasBuffer.prototype.constructor = PIXILegacy.CanvasBuffer;

/**
 * Clears the canvas that was created by the CanvasBuffer class.
 *
 * @method PIXILegacy.CanvasBuffer#clear
 * @private
 */
PIXILegacy.CanvasBuffer.prototype.clear = function ()
{
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0,0, this.width, this.height);
};

/**
 * Resizes the canvas to the specified width and height.
 *
 * @method PIXILegacy.CanvasBuffer#resize
 * @param width {Number} the new width of the canvas
 * @param height {Number} the new height of the canvas
 */
PIXILegacy.CanvasBuffer.prototype.resize = function (width, height)
{
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
};

/**
 * Frees the canvas up for use again.
 *
 * @method PIXILegacy.CanvasBuffer#destroy
 */
PIXILegacy.CanvasBuffer.prototype.destroy = function ()
{
    Phaser.CanvasPoolStatic.remove(this);
};
