
window.rrApiOnReady = window.rrApiOnReady || [];

var rrLibrary = window.rrLibrary = (function coreLib()
{
    if (!String.prototype.trim)
    {
        // eslint-disable-next-line no-extend-native
        String.prototype.trim = function ()
        {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    var lib = { };

    lib.objToQueryString = function (params)
    {
        var queryString = '';
        if (params)
        {
            for (var key in params)
            {
                // eslint-disable-next-line no-undefined
                if (params[key] !== null && params[key] !== undefined)
                {
                    queryString += '&' + key + '=' + encodeURIComponent(params[key]);
                }
            }
        }

        return queryString;
    };

    lib.getQueryString = function getQueryString()
    {
        return window.rrQueryString || window.location.search.substring(1);
    };

    lib.getQueryParametr = function (paramName)
    {
        var query = lib.getQueryString();
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++)
        {
            var pair = vars[i].split('=');
            // eslint-disable-next-line no-eq-null, eqeqeq
            if (decodeURIComponent(pair[0]) == paramName)
            {
                return decodeURIComponent(pair[1] || '');
            }
        }
        return null;
    };

    lib.queryStringToObject = function ()
    {
        var query = lib.getQueryString();
        var vars = query.split('&');
        var queryObj = {};
        for (var i = 0; i < vars.length; i++)
        {
            var pair = vars[i].split('=');
            var pairKey = decodeURIComponent(pair[0]);
            var pairValue = decodeURIComponent(pair[1] || '');
            if (pairKey.trim().length > 0)
            {
                queryObj[pairKey] = pairValue;
            }
        }
        return queryObj;
    };

    lib.queryStringObjectByPrefix = function (prefix)
    {
        var sourceObj = lib.queryStringToObject();
        var targetObj = {};
        for (var key in sourceObj)
        {
            if (key.indexOf(prefix) === 0)
            {
                targetObj[key.replace(prefix, '')] = sourceObj[key];
            }
        }
        return targetObj;
    };

    lib.getSubscriberDataFromQueryString = function ()
    {
        return rrLibrary.queryStringObjectByPrefix('rrsd_');
    };

    // work around for prototype + JSON.stringify
    lib.prototypeSafeJsonStringify = function (obj)
    {
        var arrayToJson = Array.prototype.toJSON;
        delete Array.prototype.toJSON;
        var result = JSON.stringify(obj);
        // что бы не добавлять поле если его небыло
        if (arrayToJson)
        {
            // eslint-disable-next-line no-extend-native
            Array.prototype.toJSON = arrayToJson;
        }
        return result;
    };

    lib.executeSubscribers = function (subs, args)
    {
        if (subs.length === 0)
        {
            return;
        }

        var onEventCycleComplete = lib.EventProperty(); // eslint-disable-line new-cap
        for (var i = 0; i < subs.length; i++)
        {
            try
            {
                subs[i].apply(onEventCycleComplete, args || []);
            }
            catch (e)
            {
                // eslint-disable-next-line brace-style
                (window.console || { log: function () { } }).log(e);
            }
        }

        onEventCycleComplete();
    };

    lib.EventProperty = function ()
    {
        var subscribers = [];

        var eventProperty = function ()
        {
            lib.executeSubscribers(subscribers, arguments);
        };

        eventProperty.subscribe = function (subscriber)
        {
            subscribers.push(subscriber);
        };

        return eventProperty;
    };

    lib.parseStringableProperty = function (parsedValue, propertyName, propertyDefault)
    {
        if (typeof (parsedValue) === typeof (''))
        {
            return parsedValue;
        }

        if (typeof (parsedValue) === typeof ({}))
        {
            return parsedValue[propertyName];
        }

        return propertyDefault;
    };

    return lib;
})();
