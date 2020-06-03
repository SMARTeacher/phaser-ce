/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class PIXILegacy.WebGLMaskManager
* @constructor
* @private
*/
PIXILegacy.WebGLMaskManager = function ()
{
};

PIXILegacy.WebGLMaskManager.prototype.constructor = PIXILegacy.WebGLMaskManager;

/**
* Sets the drawing context to the one given in parameter.
*
* @method PIXILegacy.WebGLMaskManager#setContext
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXILegacy.WebGLMaskManager.prototype.setContext = function (gl)
{
    this.gl = gl;
};

/**
* Applies the Mask and adds it to the current filter stack.
*
* @method PIXILegacy.WebGLMaskManager#pushMask
* @param maskData {Array}
* @param renderSession {Object}
*/
PIXILegacy.WebGLMaskManager.prototype.pushMask = function (maskData, renderSession)
{
    var gl = renderSession.gl;

    if (maskData.dirty)
    {
        PIXILegacy.WebGLGraphics.updateGraphics(maskData, gl);
    }

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.pushStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);
};

/**
* Removes the last filter from the filter stack and doesn't return it.
*
* @method PIXILegacy.WebGLMaskManager#popMask
* @param maskData {Array}
* @param renderSession {Object} an object containing all the useful parameters
*/
PIXILegacy.WebGLMaskManager.prototype.popMask = function (maskData, renderSession)
{
    var gl = this.gl;

    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)
    {
        return;
    }

    renderSession.stencilManager.popStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);

};

/**
* Destroys the mask stack.
*
* @method PIXILegacy.WebGLMaskManager#destroy
*/
PIXILegacy.WebGLMaskManager.prototype.destroy = function ()
{
    this.gl = null;
};
