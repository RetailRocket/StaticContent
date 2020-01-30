var retailrocket = (function () { // eslint-disable-line
    'use strict';

    var ns = { modules: {} };
    ns.setModule = function (name, deps, impl)
    {
        ns.modules[name] = impl;
    };

    return ns;
})();
