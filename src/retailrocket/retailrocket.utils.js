/* global retailrocket */
retailrocket.setModule('utils', ['ns', 'document', 'punycode'], function (ns, $document, punycode)
{
    var encodeQueryParameterValue = function (val)
    {
        if (!(val instanceof Array))
        {
            return encodeURIComponent(val);
        }
        return val.map(encodeURIComponent).join(',');
    };

    var getQueryString = function ()
    {
        return window.rrQueryString || window.location.search.substring(1);
    };

    var queryStringToObj = function (queryString)
    {
        var query = queryString;
        var vars = query.split('&');
        var queryObj = {};
        for (var i = 0; i < vars.length; i++)
        {
            var pair = vars[i].split('=');
            var pairKey = tryDecodeURIComponent(pair[0]);
            var pairValue = tryDecodeURIComponent(pair[1] || '');
            if (pairKey.trim().length > 0)
            {
                queryObj[pairKey] = pairValue;
            }
        }
        return queryObj;
    };

    function tryDecodeURIComponent(encodedUri)
    {
        try
        {
            return decodeURIComponent(encodedUri);
        }
        catch (e)
        {
            return encodedUri;
        }
    }

    var getPerformanceEntries = function ()
    {
        if (typeof window.performance.getEntries === 'function')
        {
            return window.performance.getEntries();
        }

        return [];
    };

    var objToQueryString = function (params)
    {
        var queryString = '';
        if (params)
        {
            for (var key in params)
            {
                if (params.hasOwnProperty(key))
                {
                    // eslint-disable-next-line no-undefined
                    if (params[key] !== null && params[key] !== undefined)
                    {
                        queryString += '&' + key + '=' + encodeQueryParameterValue(params[key]);
                    }
                }
            }
        }
        return queryString;
    };
    var plainCopy = function (source, prefix)
    {
        var res = {};
        for (var property in source)
        {
            if (!{}.hasOwnProperty.call(source, property))
            {
                continue;
            }
            res[(prefix || '') + property] = source[property];
        }
        return res;
    };

    var getElementsByClassName = function (search)
    {
        if ($document.getElementsByClassName)
        {
            return $document.getElementsByClassName(search);
        }
        return $all('.' + search);
    };

    var isValidEmail = function (email)
    {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    };

    // Add ECMA262-5 Array methods if not supported natively
    if (!('indexOf' in Array.prototype))
    {
        // eslint-disable-next-line no-extend-native
        Array.prototype.indexOf = function (find, i /* opt*/)
        {
            /* eslint-disable no-param-reassign, no-undefined */
            if (i === undefined) i = 0;
            if (i < 0) i += this.length;
            if (i < 0) i = 0;
            for (var n = this.length; i < n; i++)
            {
                if (i in this && this[i] === find)
                {
                    return i;
                }
            }
            /* eslint-enable no-param-reassign */
            return -1;
        };
    }

    if (!('filter' in Array.prototype))
    {
        // eslint-disable-next-line no-extend-native
        Array.prototype.filter = function (filter, that /* opt*/)
        {
            var other = [];
            var v;
            for (var i = 0, n = this.length; i < n; i++)
            {
                // eslint-disable-next-line no-cond-assign
                if (i in this && filter.call(that, v = this[i], i, this))
                {
                    other.push(v);
                }
            }
            return other;
        };
    }

    if (!('forEach' in Array.prototype))
    {
        // eslint-disable-next-line no-extend-native
        Array.prototype.forEach = function (action, that /* opt*/)
        {
            for (var i = 0, n = this.length; i < n; i++)
            {
                if (i in this)
                {
                    action.call(that, this[i], i, this);
                }
            }
        };
    }

    if (!('map' in Array.prototype))
    {
        // eslint-disable-next-line no-extend-native
        Array.prototype.map = function (mapper, that /* opt*/)
        {
            var other = new Array(this.length);
            for (var i = 0, n = this.length; i < n; i++)
            {
                if (i in this)
                {
                    other[i] = mapper.call(that, this[i], i, this);
                }
            }
            return other;
        };
    }

    if (!Array.isArray)
    {
        Array.isArray = function (arg)
        {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    if (!String.prototype.trim)
    {
        // eslint-disable-next-line no-extend-native
        String.prototype.trim = function ()
        {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function getAllKeys(obj)
    {
        var keys = [];
        for (var key in obj)
        {
            if ({}.hasOwnProperty.call(obj, key))
            {
                keys.push(key);
            }
        }
        return keys;
    }

    function extend()
    {
        for (var i = 1; i < arguments.length; i++)
        {
            for (var key in arguments[i])
            {
                if (arguments[i].hasOwnProperty(key))
                {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    function uniq(arr)
    {
        var result = [];
        arr.forEach(function (item)
        {
            if (result.indexOf(item) < 0)
            {
                result.push(item);
            }
        });
        return result;
    }

    function registerCss(url)
    {
        var fileref = $document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', url);
        $document.getElementsByTagName('head')[0].appendChild(fileref);
    }

    function createEventProperty()
    {
        var handlers = [];
        var instance = {};

        instance.subscribe = function (handler)
        {
            handlers.push(handler);
        };

        instance.publish = function ()
        {
            handlers.forEach(function (handler)
            {
                try
                {
                    handler.apply(instance, arguments || []);
                }
                catch (e)
                {
                    // eslint-disable-next-line brace-style
                    (window.console || { log: function () { } }).log(e);
                }
            });
        };

        return instance;
    }

    function $one(selector)
    {
        return $all(selector)[0] || null;
    }

    function $all(selector)
    {
        if ($document.querySelectorAll)
        {
            return $document.querySelectorAll(selector);
        }

        var doc = $document;
        var head = doc.documentElement.firstChild;
        var styleTag = doc.createElement('STYLE');

        head.appendChild(styleTag);
        doc.__qsaels = [];

        styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
        window.scrollBy(0, 0);

        return doc.__qsaels;
    }

    function $forall(selector, elementFn)
    {
        [].forEach.call($all(selector), elementFn);
    }

    function hasClass(element, cls)
    {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function getContainerByClass(subElement, containerClass)
    {
        var elm = subElement.parentElement;
        while (elm && !hasClass(elm, containerClass))
        {
            elm = elm.parentElement;
        }
        return elm;
    }

    function prototypeSafeJsonStringify(obj)
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
    }

    function isRobot()
    {
        if (document.referrer && document.referrer.indexOf('//metrika.yandex.ru/stat/visor/player/') > -1)
        {
            return true;
        }

        if (document.location && document.location.href && document.location.href.indexOf('.mtproxy.yandex.net') > -1)
        {
            return true;
        }

        return false;
    }

    function createMd5Hash(object)
    {
        var stringifedObject = prototypeSafeJsonStringify(object);
        var hash = 0;
        var i;
        var chr;
        var len;
        if (stringifedObject.length === 0) return hash;
        for (i = 0, len = stringifedObject.length; i < len; i++)
        {
            chr = stringifedObject.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function getUrlWithoutQuery(sourceUrl)
    {
        if (sourceUrl)
        {
            return sourceUrl.split(/[?#]/)[0];
        }
        return '';
    }

    function extractCharsetFromContent(content)
    {
        return (content || '').replace(/.*charset=([^;]+).*/i, '$1');
    }

    // eslint-disable-next-line consistent-return
    function getMetaCharset()
    {
        var metas = $document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; i++)
        {
            if (metas[i].httpEquiv === 'Content-Type')
            {
                var cs = metas[i].charset || extractCharsetFromContent(metas[i].content);
                return (cs || '').toLowerCase();
            }
        }
    }

    function canonizeCharSetName(charSet)
    {
        var lc = (charSet || '').toLowerCase().trim();
        if (lc === 'iso-8859-1')
        {
            return 'windows-1252';
        }
        return lc;
    }

    function encodingIsModified()
    {
        var metaCharset = canonizeCharSetName(getMetaCharset());
        var documentCharset = canonizeCharSetName($document.characterSet);
        return metaCharset && metaCharset !== documentCharset;
    }

    function addEventListener(element, eventName, func)
    {
        if (element.addEventListener)
        {
            element.addEventListener(eventName, func, false);
        }
        else
        {
            element.attachEvent('on' + eventName, func);
        }
    }

    function getParentsAttributeValueByEvent(attribute)
    {
        if (!window.event)
        {
            return null;
        }
        var element = window.event.target;
        while (element)
        {
            if (element.getAttribute && element.getAttribute(attribute))
            {
                return element.getAttribute(attribute);
            }
            element = element.parentNode;
        }
        return null;
    }

    function convertUrHostnameToASCII(url)
    {
        if (!url)
        {
            return null;
        }
        var p = document.createElement('a');
        p.href = url;
        var punyHost = punycode.toASCII(p.hostname);
        var pathname = p.pathname && p.pathname[0] === '/' ? p.pathname : '/' + p.pathname;
        return p.protocol + '//' + punyHost + pathname + p.search + p.hash;
    }

    function htmlEncode(data)
    {
        return document.createElement('a').appendChild(document.createTextNode(data)).parentNode.innerHTML;
    }

    function bind(func, context)
    {
        var args = Array.prototype.slice.call(arguments, 2);

        return function ()
        {
            return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };
    }

    function base64StringToUint8Array(base64String)
    {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        var rawData = window.atob(base64);
        var outputArray = new window.Uint8Array(rawData.length);

        for (var i = 0; i < rawData.length; ++i)
        {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;
    }

    function getUint8Array(data)
    {
        return new window.Uint8Array(data);
    }

    return {
        getQueryString: getQueryString,
        objToQueryString: objToQueryString,
        queryStringToObj: queryStringToObj,
        plainCopy: plainCopy,
        getAllKeys: getAllKeys,
        getElementsByClassName: getElementsByClassName,
        isValidEmail: isValidEmail,
        extend: extend,
        uniq: uniq,
        registerCss: registerCss,
        createEventProperty: createEventProperty,
        $one: $one,
        $all: $all,
        $forall: $forall,
        hasClass: hasClass,
        getContainerByClass: getContainerByClass,
        prototypeSafeJsonStringify: prototypeSafeJsonStringify,
        createMd5Hash: createMd5Hash,
        getUrlWithoutQuery: getUrlWithoutQuery,
        getPerformanceEntries: getPerformanceEntries,
        isRobot: isRobot,
        getMetaCharset: getMetaCharset,
        encodingIsModified: encodingIsModified,
        addEventListener: addEventListener,
        getParentsAttributeValueByEvent: getParentsAttributeValueByEvent,
        convertUrHostnameToASCII: convertUrHostnameToASCII,
        htmlEncode: htmlEncode,
        base64StringToUint8Array: base64StringToUint8Array,
        getUint8Array: getUint8Array,
        useNs: true,
        bind: bind
    };
});
