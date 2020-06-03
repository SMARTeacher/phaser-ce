/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
* @method PIXILegacy.initDefaultShaders
* @static
* @private
*/
PIXILegacy.initDefaultShaders = function ()
{
};

/**
* @method PIXILegacy.CompileVertexShader
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @return {Any}
*/
PIXILegacy.CompileVertexShader = function (gl, shaderSrc)
{
    return PIXILegacy._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
};

/**
* @method PIXILegacy.CompileFragmentShader
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @return {Any}
*/
PIXILegacy.CompileFragmentShader = function (gl, shaderSrc)
{
    return PIXILegacy._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
};

/**
* @method PIXILegacy._CompileShader
* @static
* @private
* @param gl {WebGLContext} the current WebGL drawing context
* @param shaderSrc {Array}
* @param shaderType {Number}
* @return {Any}
*/
PIXILegacy._CompileShader = function (gl, shaderSrc, shaderType)
{
    var src = shaderSrc;

    if (Array.isArray(shaderSrc))
    {
        src = shaderSrc.join('\n');
    }

    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        window.console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

/**
* @method PIXILegacy.compileProgram
* @static
* @param gl {WebGLContext} the current WebGL drawing context
* @param vertexSrc {Array}
* @param fragmentSrc {Array}
* @return {Any}
*/
PIXILegacy.compileProgram = function (gl, vertexSrc, fragmentSrc)
{
    var fragmentShader = PIXILegacy.CompileFragmentShader(gl, fragmentSrc);
    var vertexShader = PIXILegacy.CompileVertexShader(gl, vertexSrc);

    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        window.console.log(gl.getProgramInfoLog(shaderProgram));
        window.console.log('Could not initialise shaders');
    }

    return shaderProgram;
};
