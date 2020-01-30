// eslint-disable-next-line no-undef
var retailrocket = (function (ns)
{
    // eslint-disable-next-line no-param-reassign
    ns = ns || {};
    ns.modules = ns.modules || { ns: ns, window: window, document: document };
    ns.setModule = function x(name, deps, impl)
    {
        for (var i = 0; i < deps.length; i++)
        {
            deps[i] = ns.modules[deps[i]];
        }
        var m = impl.apply(impl, deps) || {};
        ns.modules[name] = m;
        if (m.useNs) ns[name] = m;
    };
    return ns;
})(retailrocket);
