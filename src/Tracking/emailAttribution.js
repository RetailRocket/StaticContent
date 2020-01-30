// eslint-disable-next-line no-undef
retailrocket.setModule('emailAttribution',
    ['api', 'utils', 'cookies', 'rrApi', 'rrLibrary', 'tracking'],
    function (api, utils, cookies, rrApi, rrLibrary, tracking)
    {
        if (utils.isRobot() || !cookies.areCookiesEnabled())
        {
            return {};
        }

        function getSubscriberData()
        {
            var setEmailParam = rrLibrary.getQueryParametr('rr_setemail');
            // eslint-disable-next-line no-eq-null, eqeqeq
            if (setEmailParam != null)
            {
                return {};
            }

            return utils.plainCopy(rrLibrary.getSubscriberDataFromQueryString() || {}, 'd.');
        }

        rrApi._initialize.subscribe(function ()
        {
            var mailTrackingId = rrLibrary.getQueryParametr('rr_mailid') || rrLibrary.getQueryParametr('MailTrackingId') || rrLibrary.getQueryParametr('mailtrackingid');

            if (mailTrackingId)
            {
                var queryParams = getSubscriberData();
                queryParams.rr_mailid = mailTrackingId;
                queryParams.utm_source = rrLibrary.getQueryParametr('utm_source');
                queryParams.rr_urlType = rrLibrary.getQueryParametr('rr_urlType');

                tracking.emailClick(mailTrackingId, queryParams);
            }
        });

        return {};
    });
