/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The CanvasPool is a global static object, that allows Phaser to recycle and pool Canvas DOM elements.
*
* @class Phaser.CanvasPoolStatic
* @static
*/
Phaser.CanvasPoolStatic = {



    /**
    * Creates a new Canvas DOM element, or pulls one from the pool if free.
    *
    * @method Phaser.CanvasPoolStatic.create
    * @static
    * @param {any} parent - The parent of the canvas element.
    * @param {number} width - The width of the canvas element.
    * @param {number} height - The height of the canvas element.
    * @return {HTMLCanvasElement} The canvas element.
    */
    create: function (parent, width, height)
    {

        return Phaser.CanvasPoolStatic.canvasPool.create(parent, width, height);

    },

    /**
    * Gets the first free canvas index from the pool.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.getFirst
    * @return {number}
    */
    getFirst: function ()
    {

        return Phaser.CanvasPoolStatic.canvasPool.getFirst();

    },

    /**
    * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.remove
    * @param {any} parent - The parent of the canvas element.
    */
    remove: function (parent)
    {

        Phaser.CanvasPoolStatic.canvasPool.remove(parent);

    },

    /**
    * Looks up a canvas based on its type, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.removeByCanvas
    * @param {HTMLCanvasElement} canvas - The canvas element to remove.
    */
    removeByCanvas: function (canvas)
    {

        Phaser.CanvasPoolStatic.canvasPool.removeByCanvas(canvas);

    },

    /**
    * Gets the total number of used canvas elements in the pool.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.getTotal
    * @return {number} The number of in-use (parented) canvas elements in the pool.
    */
    getTotal: function ()
    {

        return Phaser.CanvasPoolStatic.canvasPool.getTotal();

    },

    /**
    * Gets the total number of free canvas elements in the pool.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.getFree
    * @return {number} The number of free (un-parented) canvas elements in the pool.
    */
    getFree: function ()
    {

        return Phaser.CanvasPoolStatic.canvasPool.getFree();

    },


    /**
    * Prints in-use, free, and total counts to console.log.
    *
    * @static
    * @method Phaser.CanvasPoolStatic.log
    */
    log: function ()
    {

        console.log('CanvasPool: %s used, %s free, %s total', this.getTotal(), this.getFree(), this.canvasPool.length);

    }

};


/**
 * The pool into which the canvas elements are placed.
 *
 * @property pool
 * @type Phaser.CanvasPool
 * @static
 */
Phaser.CanvasPoolStatic.canvasPool = new Phaser.CanvasPool();


/**
 * The total number of canvas elements in the {@link Phaser.CanvasPoolStatic.pool pool}.
 *
 * @property length
 * @type number
 * @static
 * @readonly
 */
Object.defineProperty(Phaser.CanvasPoolStatic, 'length', {
    get: function ()
    {
        return this.canvasPool.length;
    }
});
