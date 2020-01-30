// eslint-disable-next-line no-undef
retailrocket.setModule(
    'emailResubscription',
    ['api', 'cors', 'json'],
    function (api, cors, json)
    {
        function startResubscription(_options)
        {
            var options = _options || {};
            cors.make(
                'https://tracking.retailrocket.net/2.0/partner/' +
                api.getPartnerId() +
                '/emailResubscription/visitors/' +
                api.getSessionId() +
                '/resubscription',
                'post',
                [],
                null,
                false,
                options.onSuccessCallback || function ()
                {
                }
            );
        }

        function getVisitorState(_options)
        {
            var options = _options || {};
            cors.make(
                'https://api.retailrocket.net/api/2.0/partner/' +
                api.getPartnerId() +
                '/emailResubscription/visitors/' +
                api.getSessionId(),
                'get',
                [],
                null,
                false,
                function (jsonString)
                {
                    if (options.onSuccessCallback)
                    {
                        options.onSuccessCallback({
                            data: json.parse({
                                jsonString: jsonString
                            })
                        });
                    }
                }
            );
        }

        return {
            startResubscription: startResubscription,
            getVisitorState: getVisitorState,
            useNs: true
        };
    });
