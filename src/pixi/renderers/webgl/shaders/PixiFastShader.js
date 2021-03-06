/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @class PIXILegacy.PixiFastShader
 * @constructor
 * @param gl {WebGLContext} the current WebGL drawing context
 */
PIXILegacy.PixiFastShader = function (gl)
{
    /**
     * @property _UID
     * @type Number
     * @private
     */
    this._UID = Phaser._UID++;

    /**
     * @property gl
     * @type WebGLContext
     */
    this.gl = gl;

    /**
     * The WebGL program.
     * @property program
     * @type Any
     */
    this.program = null;

    if (PIXILegacy._enableMultiTextureToggle)
    {
        var gl = this.gl;
        this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        var dynamicIfs = '\tif (vTextureIndex == 0.0) { gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;return;}\n';
        for (var index = 1; index < this.MAX_TEXTURES; ++index)
        {
            dynamicIfs += '\tif (vTextureIndex == ' +
                        index + '.0) { gl_FragColor = texture2D(uSamplerArray[' +
                        index + '], vTextureCoord) * vColor;return;}\n';
        }

        /**
         * The fragment shader.
         * @property fragmentSrc
         * @type Array
         */
        this.fragmentSrc = [
            '// PixiFastShader Fragment Shader.',
            'precision lowp float;',
            'bool isnan( float val ) {  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true; }',
            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'varying float vTextureIndex;',
            'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',

            // Blue color means that you are trying to bound
            // a texture out of the limits of the hardware.
            'const vec4 BLUE = vec4(1.0, 0.0, 1.0, 1.0);',

            // If you get a red color means you are out of memory
            // or in some way corrupted the vertex buffer.
            'const vec4 RED = vec4(1.0, 0.0, 0.0, 1.0);',
            'void main(void) {',
            dynamicIfs,
            '   if(vTextureIndex >= ' + this.MAX_TEXTURES + '.0) { gl_FragColor = BLUE;return;}',
            '   if(isnan(vTextureIndex)) {gl_FragColor = RED;return;}',
            '}'
        ];
    }
    else
    {
        this.fragmentSrc = [
            '// PixiFastShader Fragment Shader.',
            'precision lowp float;',
            'varying vec2 vTextureCoord;',
            'varying float vColor;',
            'varying float vTextureIndex;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
            '}'
        ];
    }

    /**
     * The vertex shader.
     * @property vertexSrc
     * @type Array
     */
    this.vertexSrc = [
        '// PixiFastShader Vertex Shader.',
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aPositionCoord;',
        'attribute vec2 aScale;',
        'attribute float aRotation;',
        'attribute vec2 aTextureCoord;',
        'attribute float aColor;',
        'attribute float aTextureIndex;',

        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform mat3 uMatrix;',

        'varying vec2 vTextureCoord;',
        'varying float vColor;',
        'varying float vTextureIndex;',

        'const vec2 center = vec2(-1.0, 1.0);',

        'void main(void) {',
        '   vec2 v;',
        '   vec2 sv = aVertexPosition * aScale;',
        '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',
        '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',
        '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',
        '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vTextureIndex = aTextureIndex;',

        //  '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
        '   vColor = aColor;',
        '}'
    ];

    /**
     * A local texture counter for multi-texture shaders.
     * @property textureCount
     * @type Number
     */
    this.textureCount = 0;

    this.init();
};

PIXILegacy.PixiFastShader.prototype.constructor = PIXILegacy.PixiFastShader;

/**
 * Initialises the shader.
 *
 * @method PIXILegacy.PixiFastShader#init
 */
PIXILegacy.PixiFastShader.prototype.init = function ()
{

    var gl = this.gl;
    var program = PIXILegacy.compileProgram(gl, this.vertexSrc, this.fragmentSrc);

    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = PIXILegacy._enableMultiTextureToggle ?
        gl.getUniformLocation(program, 'uSamplerArray[0]') :
        gl.getUniformLocation(program, 'uSampler');

    if (PIXILegacy._enableMultiTextureToggle)
    {
        var indices = [];

        // HACK: we bind an empty texture to avoid WebGL warning spam.
        var tempTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tempTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        for (var i = 0; i < this.MAX_TEXTURES; ++i)
        {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tempTexture);
            indices.push(i);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1iv(this.uSampler, indices);
    }

    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');
    this.uMatrix = gl.getUniformLocation(program, 'uMatrix');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');

    this.aScale = gl.getAttribLocation(program, 'aScale');
    this.aRotation = gl.getAttribLocation(program, 'aRotation');

    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.aTextureIndex = gl.getAttribLocation(program, 'aTextureIndex');

    this.attributes = [
        this.aVertexPosition,
        this.aPositionCoord,
        this.aScale,
        this.aRotation,
        this.aTextureCoord,
        this.colorAttribute,
        this.aTextureIndex
    ];

    this.program = program;
};

/**
 * Destroys the shader.
 *
 * @method PIXILegacy.PixiFastShader#destroy
 */
PIXILegacy.PixiFastShader.prototype.destroy = function ()
{
    this.gl.deleteProgram(this.program);
    this.uniforms = null;
    this.gl = null;

    this.attributes = null;
};
