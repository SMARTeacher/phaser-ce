/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class PIXILegacy.WebGLBlendModeManager
* @constructor
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXILegacy.WebGLBlendModeManager = function ()
{
    /**
     * @property currentBlendMode
     * @type Number
     */
    this.currentBlendMode = 99999;
};

PIXILegacy.WebGLBlendModeManager.prototype.constructor = PIXILegacy.WebGLBlendModeManager;

/**
 * Sets the WebGL Context.
 *
 * @method PIXILegacy.WebGLBlendModeManager#setContext
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXILegacy.WebGLBlendModeManager.prototype.setContext = function (gl)
{
    this.gl = gl;
};

/**
* Sets-up the given blendMode from WebGL's point of view.
*
* @method PIXILegacy.WebGLBlendModeManager#setBlendMode
* @param blendMode {Number} the blendMode, should be a Pixi const, such as PIXILegacy.BlendModes.ADD
*/
PIXILegacy.WebGLBlendModeManager.prototype.setBlendMode = function (blendMode)
{
    if(this.currentBlendMode === blendMode) { return false; }

    this.currentBlendMode = blendMode;

    var blendModeWebGL = PIXILegacy.blendModesWebGL[this.currentBlendMode];

    if (blendModeWebGL)
    {
        this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
    }

    return true;
};

/**
* Destroys this object.
*
* @method PIXILegacy.WebGLBlendModeManager#destroy
*/
PIXILegacy.WebGLBlendModeManager.prototype.destroy = function ()
{
    this.gl = null;
};
