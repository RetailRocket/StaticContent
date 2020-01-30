// eslint-disable-next-line no-undef
retailrocket.setModule(
    'partnerSettingsClient',
    ['cors'],
    function (cors)
    {
        function getPartnerSettings(partnerId, callback, errback)
        {
            var url = 'https://cdn.retailrocket.net/api/1.0/PushPartnerSettings/' + partnerId + '?format=json';
            return cors.make(
                url,
                'get',
                [],
                null,
                false,
                function (data)
                {
                    var receivedSettings = JSON.parse(data) || {};
                    var settings = {
                        publicKey: receivedSettings.PublicKey,
                        emptyServiceWorkerUrl: receivedSettings.EmptyServiceWorkerUrl,
                        webPushServiceWorkerUrl: receivedSettings.WebPushServiceWorkerUrl
                    };

                    (callback || function ()
                    {
                    })(settings);
                },
                errback
            );
        }

        return {
            getPartnerSettings: getPartnerSettings,
            useNs: true
        };
    });
