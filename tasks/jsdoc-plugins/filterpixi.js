/**
* Mark various PIXILegacy properties/methods as private if they are not relevant to Phaser.
*/

var path = require('path');

function docletParamsAcceptInteractionData (doclet)
{

    if (Array.isArray(doclet.params))
    {
        return doclet.params.some(function (p)
        {
            return p.type && p.type.names.some(function (n)
            {
                return n === 'PIXILegacy.InteractionData';
            });
        });
    }

}

var unwantedNames = {
    'PIXILegacy.DisplayObject#defaultCursor': 1,
    'PIXILegacy.DisplayObject#interactive': 1
};

function hasUnwantedName (doclet)
{

    var longname = doclet.longname;
    return unwantedNames[longname];

}

exports.handlers = {};
exports.handlers.newDoclet = function (e)
{

    var doclet = e.doclet;

    if (docletParamsAcceptInteractionData(doclet) ||
        hasUnwantedName(doclet))
    {
        doclet.access = 'private';
        console.warn('Marked "%s" private.', doclet.longname);
    }

};
