/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A texture stores the information that represents an image. All textures have a base texture.
 *
 * @class PIXILegacy.BaseTexture
 * @constructor
 * @param source {String|Canvas} the source object (image or canvas)
 * @param scaleMode {Number} See {{#crossLink "PIXILegacy/scaleModes:property"}}PIXILegacy.scaleModes{{/crossLink}} for possible values
 * @param [resolution] {Number} the resolution of the texture (for HiDPI displays)
 */
PIXILegacy.BaseTexture = function (source, scaleMode, resolution)
{
    /**
     * The Resolution of the texture.
     *
     * @property resolution
     * @type Number
     */
    this.resolution = resolution || 1;

    /**
     * [read-only] The width of the base texture set when the image has loaded
     *
     * @property width
     * @type Number
     * @readOnly
     */
    this.width = 100;

    /**
     * [read-only] The height of the base texture set when the image has loaded
     *
     * @property height
     * @type Number
     * @readOnly
     */
    this.height = 100;

    /**
     * The scale mode to apply when scaling this texture
     *
     * @property scaleMode
     * @type {Number}
     * @default PIXILegacy.scaleModes.LINEAR
     */
    this.scaleMode = scaleMode || PIXILegacy.scaleModes.DEFAULT;

    /**
     * [read-only] Set to true once the base texture has loaded
     *
     * @property hasLoaded
     * @type Boolean
     * @readOnly
     */
    this.hasLoaded = false;

    /**
     * The image source that is used to create the texture.
     *
     * @property source
     * @type Image
     */
    this.source = source;

    /**
     * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
     *
     * @property premultipliedAlpha
     * @type Boolean
     * @default true
     */
    this.premultipliedAlpha = true;

    // used for webGL

    /**
     * @property _glTextures
     * @type Array
     * @private
     */
    this._glTextures = [];

    /**
     * Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
     * Also the texture must be a power of two size to work
     *
     * @property mipmap
     * @type {Boolean}
     */
    this.mipmap = false;

    /**
     * The multi texture batching index number.
     * @property textureIndex
     * @type Number
     */
    this.textureIndex = 0;

    /**
     * @property _dirty
     * @type Array
     * @private
     */
    this._dirty = [ true, true, true, true ];

    if (!source)
    {
        return;
    }

    if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height)
    {
        this.hasLoaded = true;
        this.width = this.source.naturalWidth || this.source.width;
        this.height = this.source.naturalHeight || this.source.height;
        this.dirty();
    }

    /**
     * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.
     *
     * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
     * that has children that you do want to render, without causing a batch flush in the process.
     *
     * @property skipRender
     * @type Boolean
     */
    this.skipRender = false;

    /**
     * @property _powerOf2
     * @type Boolean
     * @private
     */
    this._powerOf2 = false;

};

PIXILegacy.BaseTexture.prototype.constructor = PIXILegacy.BaseTexture;

/**
 * Forces this BaseTexture to be set as loaded, with the given width and height.
 * Then calls BaseTexture.dirty.
 * Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.
 *
 * @method PIXILegacy.BaseTexture#forceLoaded
 * @param {number} width - The new width to force the BaseTexture to be.
 * @param {number} height - The new height to force the BaseTexture to be.
 */
PIXILegacy.BaseTexture.prototype.forceLoaded = function (width, height)
{
    this.hasLoaded = true;
    this.width = width;
    this.height = height;
    this.dirty();
};

/**
 * Destroys this base texture
 *
 * @method PIXILegacy.BaseTexture#destroy
 */
PIXILegacy.BaseTexture.prototype.destroy = function ()
{
    if (this.source)
    {
        Phaser.CanvasPoolStatic.removeByCanvas(this.source);

        this.source.width = 1;
        this.source.height = 1;
    }
    this.source = null;

    this.unloadFromGPU();

    this.width = 0;
    this.height = 0;
    this._dirty = [];
};

/**
 * Sets all glTextures to be dirty.
 *
 * @method PIXILegacy.BaseTexture#dirty
 */
PIXILegacy.BaseTexture.prototype.dirty = function ()
{
    for (var i = 0; i < this._glTextures.length; i++)
    {
        this._dirty[i] = true;
    }
};

/**
 * Removes the base texture from the GPU, useful for managing resources on the GPU.
 * Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
 *
 * @method PIXILegacy.BaseTexture#unloadFromGPU
 */
PIXILegacy.BaseTexture.prototype.unloadFromGPU = function ()
{
    this.dirty();

    // delete the webGL textures if any.
    for (var i = this._glTextures.length - 1; i >= 0; i--)
    {
        var glTexture = this._glTextures[i];
        var gl = PIXILegacy.glContexts[i];

        if(gl && glTexture)
        {
            gl.deleteTexture(glTexture);
        }

    }

    this._glTextures.length = 0;

    this.dirty();
};

/**
 * Helper function that creates a base texture from the given canvas element.
 *
 * @static
 * @method PIXILegacy.BaseTexture#fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @param scaleMode {Number} See {{#crossLink "PIXILegacy/scaleModes:property"}}PIXILegacy.scaleModes{{/crossLink}} for possible values
 * @param [resolution] {Number} the resolution of the texture (for HiDPI displays)
 * @return {BaseTexture}
 */
PIXILegacy.BaseTexture.fromCanvas = function (canvas, scaleMode, resolution)
{
    if (canvas.width === 0)
    {
        canvas.width = 1;
    }

    if (canvas.height === 0)
    {
        canvas.height = 1;
    }

    resolution = resolution || 1;

    return new PIXILegacy.BaseTexture(canvas, scaleMode, resolution);
};
