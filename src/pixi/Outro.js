/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXILegacy;
        }
        exports.PIXILegacy = PIXILegacy;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('PIXILegacy', (function() { return root.PIXILegacy = PIXILegacy; })() );
    } else {
        root.PIXILegacy = PIXILegacy;
    }

    return PIXILegacy;
}).call(this);