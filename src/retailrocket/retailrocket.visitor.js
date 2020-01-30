// eslint-disable-next-line no-undef
retailrocket.setModule('visitor', ['cors', 'api'], function (cors, api)
{
    function get(partnerId, session, callback, errback)
    {
        var url = 'https://api.retailrocket.net/api/1.0/visitor/' + session + '?partnerId=' + partnerId;

        cors.make(
            url,
            'GET',
            [],
            null,
            false,
            function (visitorInformationStr)
            {
                return callback(JSON.parse(visitorInformationStr));
            },
            // eslint-disable-next-line brace-style
            errback || function () { }
        );
    }

    function processRequest(method, visitorBody, signature, validTill, callback, errback)
    {
        var url = 'https://api.retailrocket.net/api/2.1/visitor/' + api.getSessionId() +
            '?partnerId=' + api.getPartnerId();

        if (signature)
        {
            url = url + '&signature=' + signature +
                '&validTill=' + validTill;
        }

        return cors.make(
            url,
            method,
            [{ name: 'Content-type', value: 'application/json' }],
            visitorBody,
            false,
            // eslint-disable-next-line brace-style
            callback || function () { },
            // eslint-disable-next-line brace-style
            errback || function () { }
        );
    }

    function post(visitorBody, signature, validTill, callback, errback)
    {
        processRequest('POST', visitorBody, signature, validTill, callback, errback);
    }

    function patch(visitorBody, signature, validTill, callback, errback)
    {
        processRequest('PATCH', visitorBody, signature, validTill, callback, errback);
    }

    return {
        post: post,
        patch: patch,
        get: get,
        useNs: true
    };
});
