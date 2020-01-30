// eslint-disable-next-line no-undef
retailrocket.setModule('api', ['cookies', 'document', 'window'], function (cookies, $doc, $win)
{
    function getSessionId()
    {
        return cookies.getSessionIdCookie();
    }

    function getPartnerVisitorId()
    {
        var pvid = cookies.getRrPvidCookie() || Math.floor(Math.random() * Math.pow(10, 15)).toString();
        cookies.setOnRootRrPvidCookie(pvid, 365 * 24 * 60 * 60);
        return pvid;
    }

    function getPartnerId()
    {
        return $win.rrPartnerId;
    }

    function pushTrackingCall(rrApiFn)
    {
        ($win.rrApiOnReady = $win.rrApiOnReady || []).push(function ()
        {
            rrApiFn($win.rrApi);
        });
    }

    return {
        getSessionId: getSessionId,
        getPartnerVisitorId: getPartnerVisitorId,
        getPartnerId: getPartnerId,
        pushTrackingCall: pushTrackingCall,
        baseUrl: 'https://api.retailrocket.net',
        useNs: true
    };
});
