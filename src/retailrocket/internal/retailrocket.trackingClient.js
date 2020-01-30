// eslint-disable-next-line no-undef
retailrocket.setModule(
    'trackingClient',
    ['cors', 'utils', 'document', 'window', 'api'],
    function (cors, utils, $document, $window, api)
    {
        function getQueryString(params)
        {
            var queryParams = {};

            queryParams.session = api.getSessionId();
            queryParams.pvid = api.getPartnerVisitorId();

            queryParams.referrer = utils.convertUrHostnameToASCII($document.referrer);

            queryParams.partnerTestSegment = $window.rrTestSegment;
            queryParams.pageUrl = utils.convertUrHostnameToASCII($window.location.href);
            queryParams.email = $window.rrUserEmail;
            queryParams.keywords = $window.rrSearchPhrase;
            // eslint-disable-next-line dot-notation
            queryParams['_no_cache_'] = (new Date()).getTime();

            utils.extend(queryParams, params);

            return utils.objToQueryString(queryParams);
        }

        return {
            call: function (options)
            {
                var hostAndPath = 'https://tracking.retailrocket.net/1.0/event/' +
                    options.eventName +
                    '/' +
                    api.getPartnerId() +
                    (options.id ? '/' + options.id : '');
                var queryString = getQueryString(options.params);

                cors.make(
                    hostAndPath + '?' + queryString,
                    options.method,
                    options.headers,
                    utils.prototypeSafeJsonStringify(options.data),
                    false,
                    options.onSuccessCallback || function ()
                    {
                    }
                );
            },
            subscribe: function (options)
            {
                var hostAndPath = 'https://tracking.retailrocket.net/1.0/partner/' +
                    api.getPartnerId() +
                    '/subscribe/' +
                    options.eventName;
                var queryString = getQueryString(options.params);

                cors.make(
                    hostAndPath + '?' + queryString,
                    options.method,
                    options.headers,
                    utils.prototypeSafeJsonStringify(options.data),
                    false,
                    options.onSuccessCallback || function ()
                    {
                    }
                );
            }
        };
    });
