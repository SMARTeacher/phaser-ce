/* global Phaser:true */
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

//  Pixi expects these globals to exist

if (PIXILegacy.blendModes === undefined)
{
    PIXILegacy.blendModes = Phaser.blendModes;
}

if (PIXILegacy.scaleModes === undefined)
{
    PIXILegacy.scaleModes = Phaser.scaleModes;
}

if (PIXILegacy.Texture.emptyTexture === undefined)
{
    PIXILegacy.Texture.emptyTexture = new PIXILegacy.Texture(new PIXILegacy.BaseTexture());
}

if (PIXILegacy.DisplayObject._tempMatrix === undefined)
{
    PIXILegacy.DisplayObject._tempMatrix = new Phaser.Matrix();
}

PIXILegacy.TextureSilentFail = true;

// Required by Particle Storm
PIXILegacy.canUseNewCanvasBlendModes = function ()
{
    return Phaser.Device.canUseMultiply;
};
