/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @class PIXILegacy.WebGLShaderManager
* @constructor
* @private
*/
PIXILegacy.WebGLShaderManager = function (game)
{
    /**
     * @property maxAttibs
     * @type Number
     */
    this.maxAttibs = 10;

    /**
     * @property attribState
     * @type Array
     */
    this.attribState = [];

    /**
     * @property tempAttribState
     * @type Array
     */
    this.tempAttribState = [];

    for (var i = 0; i < this.maxAttibs; i++)
    {
        this.attribState[i] = false;
    }

    /**
     * @property stack
     * @type Array
     */
    this.stack = [];

    /**
     * @property game
     * @type Phaser.Game
     */
    this.game = game;

};

PIXILegacy.WebGLShaderManager.prototype.constructor = PIXILegacy.WebGLShaderManager;

/**
* Initialises the context and the properties.
*
* @method PIXILegacy.WebGLShaderManager#setContext
* @param gl {WebGLContext} the current WebGL drawing context
*/
PIXILegacy.WebGLShaderManager.prototype.setContext = function (gl)
{
    this.gl = gl;

    // the next one is used for rendering primitives
    this.primitiveShader = new PIXILegacy.PrimitiveShader(gl);

    // the next one is used for rendering triangle strips
    this.complexPrimitiveShader = new PIXILegacy.ComplexPrimitiveShader(gl);

    // this shader is used for the default sprite rendering
    this.defaultShader = new PIXILegacy.PixiShader(gl, this.game);

    // this shader is used for the fast sprite rendering
    this.fastShader = new PIXILegacy.PixiFastShader(gl);

    // the next one is used for rendering triangle strips
    this.stripShader = new PIXILegacy.StripShader(gl);

    // the next one is used for rendering creature meshes
    this.creatureShader = PIXILegacy.CreatureShader ? new PIXILegacy.CreatureShader(gl) : null;

    this.setShader(this.defaultShader);
};

/**
* Takes the attributes given in parameters.
*
* @method PIXILegacy.WebGLShaderManager#setAttribs
* @param attribs {Array} attribs
*/
PIXILegacy.WebGLShaderManager.prototype.setAttribs = function (attribs)
{
    // reset temp state
    var i;

    for (i = 0; i < this.tempAttribState.length; i++)
    {
        this.tempAttribState[i] = false;
    }

    // set the new attribs
    for (i = 0; i < attribs.length; i++)
    {
        var attribId = attribs[i];
        this.tempAttribState[attribId] = true;
    }

    var gl = this.gl;

    for (i = 0; i < this.attribState.length; i++)
    {
        if(this.attribState[i] !== this.tempAttribState[i])
        {
            this.attribState[i] = this.tempAttribState[i];

            if(this.tempAttribState[i])
            {
                gl.enableVertexAttribArray(i);
            }
            else
            {
                gl.disableVertexAttribArray(i);
            }
        }
    }
};

/**
* Sets the current shader.
*
* @method PIXILegacy.WebGLShaderManager#setShader
* @param shader {Any}
*/
PIXILegacy.WebGLShaderManager.prototype.setShader = function (shader)
{
    if(this._currentId === shader._UID) { return false; }

    this._currentId = shader._UID;

    this.currentShader = shader;

    this.gl.useProgram(shader.program);
    this.setAttribs(shader.attributes);

    return true;
};

/**
* Destroys this object.
*
* @method PIXILegacy.WebGLShaderManager#destroy
*/
PIXILegacy.WebGLShaderManager.prototype.destroy = function ()
{
    this.attribState = null;

    this.tempAttribState = null;

    this.primitiveShader.destroy();

    this.complexPrimitiveShader.destroy();

    this.defaultShader.destroy();

    this.fastShader.destroy();

    this.stripShader.destroy();

    if (this.creatureShader)
    {
        this.creatureShader.destroy();
    }

    this.gl = null;
};
