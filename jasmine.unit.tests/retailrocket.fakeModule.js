var retailrocket = (function ()
{
    'use strict';

    var ns = { modules: {} };
    ns.setModule = function (name, deps, impl)
    {
        ns.modules[name] = impl;
    };
    return ns;
})();

module.exports = retailrocket;
