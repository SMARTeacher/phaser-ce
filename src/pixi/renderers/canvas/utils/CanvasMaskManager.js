/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used to handle masking.
 *
 * @class PIXILegacy.CanvasMaskManager
 * @constructor
 */
PIXILegacy.CanvasMaskManager = function ()
{
};

PIXILegacy.CanvasMaskManager.prototype.constructor = PIXILegacy.CanvasMaskManager;

/**
 * This method adds it to the current stack of masks.
 *
 * @method PIXILegacy.CanvasMaskManager#pushMask
 * @param maskData {Object} the maskData that will be pushed
 * @param renderSession {Object} The renderSession whose context will be used for this mask manager.
 */
PIXILegacy.CanvasMaskManager.prototype.pushMask = function (maskData, renderSession)
{

    var context = renderSession.context;

    context.save();

    var cacheAlpha = maskData.alpha;
    var transform = maskData.worldTransform;

    var resolution = renderSession.resolution;

    context.setTransform(transform.a * resolution,
        transform.b * resolution,
        transform.c * resolution,
        transform.d * resolution,
        transform.tx * resolution,
        transform.ty * resolution);

    PIXILegacy.CanvasGraphics.renderGraphicsMask(maskData, context);

    context.clip();

    maskData.worldAlpha = cacheAlpha;
};

/**
 * Restores the current drawing context to the state it was before the mask was applied.
 *
 * @method PIXILegacy.CanvasMaskManager#popMask
 * @param renderSession {Object} The renderSession whose context will be used for this mask manager.
 */
PIXILegacy.CanvasMaskManager.prototype.popMask = function (renderSession)
{
    renderSession.context.restore();
};
