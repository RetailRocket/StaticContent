// eslint-disable-next-line no-undef
retailrocket.setModule('timing', ['cors', 'api', 'utils',  'cookies'], function (cors, api, utils, cookies)
{
    if (!cookies.areCookiesEnabled())
    {
        return { };
    }

    if (api.getPartnerVisitorId() % 10 !== 0)
    {
        return {};
    }

    var timeout = 1000;
    var baseUrl = 'https://tracking.retailrocket.net/1.0/timing/';
    var queryString = '?partnerId=' + api.getPartnerId() + '&session=' + api.getSessionId();

    function make(body, callback)
    {
        cors.make(
            baseUrl + queryString,
            'POST',
            [{ name: 'Content-type', value: 'application/json' }],
            body,
            false,
            callback,
            // eslint-disable-next-line brace-style
            function () { }
        );
    }

    var sent = {};

    function check()
    {
        var forSend = [];

        var entries = utils.getPerformanceEntries();

        for (var i = 0; i < entries.length; ++i)
        {
            var entry = entries[i];
            var url = entry.name ? utils.getUrlWithoutQuery(entry.name.toLowerCase()) : null;
            var ms = Math.round(entry.duration);

            var isValid = url &&
                (url.indexOf('.retailrocket.net/') > -1 || url.indexOf('.retailrocket.ru/') > -1) &&
                url.indexOf(baseUrl) < 0 &&
                ms > 0 &&
                !(url in sent);

            if (isValid)
            {
                forSend.push({ url: url, ms: ms });
            }
        }

        if (forSend.length > 0)
        {
            make(utils.prototypeSafeJsonStringify(forSend), function ()
            {
                for (var j = 0; j < forSend.length; ++j)
                {
                    sent[forSend[j].url] = true;
                }
                setTimeout(check, timeout);
            });
        }
        else
        {
            setTimeout(check, timeout);
        }
    }

    if (window.performance && utils.getPerformanceEntries())
    {
        api.pushTrackingCall(function (rrApi)
        {
            rrApi.pageView.subscribe(function ()
            {
                setTimeout(check, timeout);
            });
        });
    }

    return {};
});
