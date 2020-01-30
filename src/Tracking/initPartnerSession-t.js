// eslint-disable-next-line no-undef
retailrocket.setModule(
    'initPartnerSessionT',
    ['api', 'cookies', 'utils', 'rrApi', 'cors'],
    function (api, cookies, utils, rrApi, cors)
    {
        if (!cookies.areCookiesEnabled() || utils.isRobot())
        {
            return {};
        }

        var rcuid = cookies.getSessionIdCookie();

        if (rcuid)
        {
            rrApi._initialize({ sessionId: rcuid });
        }

        var queryString = utils.objToQueryString({
            session: rcuid,
            _nocache: (new Date()).getTime() + '' + Math.random()
        });

        cors.make(
            'https://tracking.retailrocket.net/1.0/event/initialize/' + api.getPartnerId() + '?' + queryString,
            'get',
            [],
            {},
            true,
            function (data)
            {
                var partnerParams = JSON.parse(data);
                var sessionId = partnerParams.sessionId || partnerParams.RrSessionId;
                cookies.setOnRootSessionIdCookie(sessionId);

                if (!rcuid)
                {
                    rrApi._initialize(partnerParams);
                }
            });

        return {};
    }, true);

