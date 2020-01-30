// eslint-disable-next-line no-undef
retailrocket.setModule('cookies', ['punycode'], function (punycode)
{
    var cookieNames = {
        forceClosedFlag: 'rreiwfc',
        deactivatedFlag: 'rrtwdf',
        isVisitorAgreedToReceiveMarketingMail: 'rraem',
        devCookie: 'rrdev',
        rrPartnerVisitorId: 'rrpvid',
        mailRequestLastCallTime: 'rrmrlct',
        lastEventTime: 'rrlevt',
        rcuid: 'rcuid',
        lastViewedCookieName: 'rrviewed',
        lastAddedBasketCookieName: 'rrbasket',
        recomItemIdCookieName: 'rr-RecomItemId',
        recomMethodNameCookieName: 'rr-MethodName',
        recomSuggesterCookieName: 'rr-Suggester',
        viewItemIdCookieName: 'rr-viewItemId',
        addToBasketItemIdCookieName: 'rr-addToBasketItemId',
        recomAddToCartItemIdCookieName: 'rr-RecomAddToCartItemId',
        recomAddToCartMethodNameCookieName: 'rr-AddToCartMethodName',
        recomAddToCartSuggesterCookieName: 'rr-AddToCartSuggester',
        subFormLastViewCookieName: 'rr-subFormLastView',
        visitorSegmenRecordCookieName: 'rr-VisitorSegment',
        sspMatchedFlag: 'rrsmf',
        webPushSubscriptionSaved: 'rrwps',
        webPushSwUpdated: 'rrwpswu',
        testCookie: 'rr-testCookie'
    };

    function daysToSecond(days)
    {
        return days * 24 * 60 * 60;
    }

    var getCookie = function (cName)
    {
        var i;
        var x;
        var y;
        var arRcookies = document.cookie.split(';');
        for (i = 0; i < arRcookies.length; i++)
        {
            x = arRcookies[i].substr(0, arRcookies[i].indexOf('='));
            y = arRcookies[i].substr(arRcookies[i].indexOf('=') + 1);
            x = x.replace(/^\s+|\s+$/g, '');
            // eslint-disable-next-line eqeqeq
            if (x == cName)
            {
                return unescape(y);
            }
        }
        return null;
    };

    var setCookie = function (cName, value, expireInSecond, path, domain)
    {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (value == null)
        {
            // eslint-disable-next-line no-param-reassign
            expireInSecond = -1;
        }
        var twoYearsInSeconds = 63072000;
        var limitedExpireInSecond = expireInSecond < twoYearsInSeconds ? expireInSecond : twoYearsInSeconds;
        var exdate = new Date();
        exdate.setSeconds(exdate.getSeconds() + limitedExpireInSecond);

        var cValue = escape(value || '') + ((!limitedExpireInSecond) ? '' : '; expires=' + exdate.toUTCString()) + (';path=' + (path || '/')) + (domain ? ';domain=' + punycode.toASCII(domain) : '');
        document.cookie = cName + '=' + cValue;
    };

    var getForceClosedFlagCookie = function ()
    {
        return getCookie(cookieNames.forceClosedFlag);
    };
    var getDeactivatedFlagCookie = function ()
    {
        return getCookie(cookieNames.deactivatedFlag);
    };
    var getIsVisitorAgreedToReceiveMarketingMailCookie = function ()
    {
        return getCookie(cookieNames.isVisitorAgreedToReceiveMarketingMail);
    };
    var getRrPvidCookie = function ()
    {
        return getCookie(cookieNames.rrPartnerVisitorId);
    };
    var getDevCookie = function ()
    {
        return getCookie(cookieNames.devCookie);
    };
    var getLastEventTimeCookie = function ()
    {
        return getCookie(cookieNames.lastEventTime);
    };
    var getMailRequestLastCallTimeCookie = function ()
    {
        return getCookie(cookieNames.mailRequestLastCallTime);
    };
    var getSessionIdCookie = function ()
    {
        return getCookie(cookieNames.rcuid);
    };
    var getLastViewedCookie = function ()
    {
        return getCookie(cookieNames.lastViewedCookieName);
    };
    var getLastAddedBasketCookie = function ()
    {
        return getCookie(cookieNames.lastAddedBasketCookieName);
    };
    var getRecomAddToCartItemIdCookie = function ()
    {
        return getCookie(cookieNames.recomAddToCartItemIdCookieName);
    };
    var getRecomAddToCartMethodNameCookie = function ()
    {
        return getCookie(cookieNames.recomAddToCartMethodNameCookieName);
    };
    var getRecomAddToCartSuggesterCookie = function ()
    {
        return getCookie(cookieNames.recomAddToCartSuggesterCookieName);
    };
    var getRecomItemIdCookie = function ()
    {
        return getCookie(cookieNames.recomItemIdCookieName);
    };
    var getRecomMethodNameCookie = function ()
    {
        return getCookie(cookieNames.recomMethodNameCookieName);
    };
    var getRecomSuggesterCookie = function ()
    {
        return getCookie(cookieNames.recomSuggesterCookieName);
    };
    var getViewItemIdCookie = function ()
    {
        return getCookie(cookieNames.viewItemIdCookieName);
    };
    var getAddToBasketItemIdCookie = function ()
    {
        return getCookie(cookieNames.addToBasketItemIdCookieName);
    };
    var getSubFormLastViewCookie = function ()
    {
        return getCookie(cookieNames.subFormLastViewCookieName);
    };
    var getVisitorSegmenRecordCookie = function (customCookieName)
    {
        if (customCookieName)
        {
            return getCookie(customCookieName);
        }
        return getCookie(cookieNames.visitorSegmenRecordCookieName);
    };
    var getSvyaznoyUserFilterType = function ()
    {
        return getCookie('userFilterType');
    };
    var getWebPushSubscriptionSaved = function ()
    {
        return getCookie(cookieNames.webPushSubscriptionSaved);
    };
    var getWebPushSwUpdated = function ()
    {
        return getCookie(cookieNames.webPushSwUpdated);
    };
    var setForceClosedFlagCookie = function (value)
    {
        setCookie(cookieNames.forceClosedFlag, value, 2592000, '/');
    };
    var setDeactivatedFlagCookie = function (value)
    {
        setCookie(cookieNames.deactivatedFlag, value, 15768000);
    };
    var setIsVisitorAgreedToReceiveMarketingMailCookie = function (isVisitorAgreedToReceiveMarketingMail)
    {
        setCookie(cookieNames.isVisitorAgreedToReceiveMarketingMail, isVisitorAgreedToReceiveMarketingMail);
    };
    var setSubFormLastViewCookie = function ()
    {
        setCookie(cookieNames.subFormLastViewCookieName, true, 60 * 60, '/');
    };

    var setOnRootRrPvidCookie = function (pvid, expireInSeconds)
    {
        setRootCookie(cookieNames.rrPartnerVisitorId, pvid, expireInSeconds);
    };
    var setOnRootDevCookie = function (enableDev, expireInSeconds)
    {
        setRootCookie(cookieNames.devCookie, enableDev, expireInSeconds);
    };
    var setOnRootLastEventTimeCookie = function (lastEventTime)
    {
        setRootCookie(cookieNames.lastEventTime, lastEventTime);
    };
    var setOnRootMailRequestLastCallTimeCookie = function (lastCallTime)
    {
        setRootCookie(cookieNames.mailRequestLastCallTime, lastCallTime);
    };
    var setOnRootSessionIdCookie = function (sessionId)
    {
        setRootCookie(cookieNames.rcuid, sessionId, daysToSecond(365));
    };
    var setOnRootLastViewedCookie = function (items)
    {
        setRootCookie(cookieNames.lastViewedCookieName, items, 3600);
    };
    var setOnRootLastAddedBasketCookie = function (items)
    {
        setRootCookie(cookieNames.lastAddedBasketCookieName, items, 3600);
    };
    var setOnRootViewItemIdCookie = function (itemId)
    {
        setRootCookie(cookieNames.viewItemIdCookieName, itemId, 600);
    };
    var setOnRootAddToBasketItemIdCookie = function (itemId)
    {
        setRootCookie(cookieNames.addToBasketItemIdCookieName, itemId, 30);
    };
    var setOnRootRecomAddToCartItemIdCookie = function (items)
    {
        setRootCookie(cookieNames.recomAddToCartItemIdCookieName, items, 30);
    };
    var setOnRootRecomAddToCartMethodNameCookie = function (methodName)
    {
        setRootCookie(cookieNames.recomAddToCartMethodNameCookieName, methodName, 60);
    };
    var setOnRootRecomAddToCartSuggesterCookie = function (suggester)
    {
        setRootCookie(cookieNames.recomAddToCartSuggesterCookieName, suggester, 60);
    };
    var setOnRootRecomItemIdCookie = function (itemId)
    {
        setRootCookie(cookieNames.recomItemIdCookieName, itemId, 60);
    };
    var setOnRootRecomMethodNameCookie = function (methodName)
    {
        setRootCookie(cookieNames.recomMethodNameCookieName, methodName, 60);
    };
    var setOnRootRecomSuggesterCookie = function (suggester)
    {
        setRootCookie(cookieNames.recomSuggesterCookieName, suggester, 60);
    };
    var setOnRootVisitorSegmenRecordCookie = function (customCookieName, visitorSegmentRecord, expireInDays)
    {
        var expireInSeconds = daysToSecond(expireInDays || 60);
        if (customCookieName)
        {
            setRootCookie(customCookieName, visitorSegmentRecord, expireInSeconds);
        }
        else
        {
            setRootCookie(cookieNames.visitorSegmenRecordCookieName, visitorSegmentRecord, expireInSeconds);
        }
    };
    var setOnRootWebPushSubscriptionSaved = function (expireInSeconds)
    {
        setRootCookie(cookieNames.webPushSubscriptionSaved, true, expireInSeconds);
    };
    var setOnRootWebPushSwUpdated = function (expireInSeconds)
    {
        setRootCookie(cookieNames.webPushSwUpdated, true, expireInSeconds);
    };
    var cleanOnRootLastViewedCookie = function ()
    {
        setRootCookie(cookieNames.lastViewedCookieName, null, -1);
    };
    var cleanOnRootLastAddedBasketCookie = function ()
    {
        setRootCookie(cookieNames.lastAddedBasketCookieName, null, -1);
    };
    var cleanOnRootAddToBasketItemIdCookie = function ()
    {
        setRootCookie(cookieNames.addToBasketItemIdCookieName, null, -1);
    };
    var cleanOnRootViewItemIdCookie = function ()
    {
        setRootCookie(cookieNames.viewItemIdCookieName, null, -1);
    };
    var cleanOnRootRecomAddToCartItemIdCookie = function ()
    {
        setRootCookie(cookieNames.recomAddToCartItemIdCookieName, null, -1);
    };
    var cleanOnRootRecomAddToCartMethodNameCookie = function ()
    {
        setRootCookie(cookieNames.recomAddToCartMethodNameCookieName, null, -1);
    };
    var cleanOnRootRecomAddToCartSuggesterCookie = function ()
    {
        setRootCookie(cookieNames.recomAddToCartSuggesterCookieName, null, -1);
    };
    var cleanOnRootRecomMethodNameCookie = function ()
    {
        setRootCookie(cookieNames.recomMethodNameCookieName, null, -1);
    };
    var cleanOnRootRecomSuggesterCookie = function ()
    {
        setRootCookie(cookieNames.recomSuggesterCookieName, null, -1);
    };

    function setRootCookie(cName, value, expireInSecond)
    {
        var hostname = location.hostname;
        var subDomains = hostname.split('.');

        for (var i = 1; i <= subDomains.length; i++)
        {
            var domain = subDomains.slice(subDomains.length - i).join('.');
            setCookie(cName, value, expireInSecond, '/', domain);
            // eslint-disable-next-line eqeqeq
            if (getCookie(cName) == value)
            {
                break;
            }
        }
    }

    function areCookiesEnabled()
    {
        try
        {
            var cookie = document.cookie; // eslint-disable-line
        }
        catch (exception)
        {
            return false;
        }

        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        // eslint-disable-next-line eqeqeq
        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled)
        {
            document.cookie = cookieNames.testCookie;
            cookieEnabled = (document.cookie.indexOf(cookieNames.testCookie) !== -1) ? true : false;
        }

        // double check
        if (cookieEnabled === true)
        {
            var checkValue = 'testvalue';
            var expireInSeconds = 10;
            setRootCookie(cookieNames.testCookie, checkValue, expireInSeconds);
            cookieEnabled = getCookie(cookieNames.testCookie) === checkValue;
        }

        return (cookieEnabled);
    }

    return {
        areCookiesEnabled: areCookiesEnabled,

        getForceClosedFlagCookie: getForceClosedFlagCookie,
        getDeactivatedFlagCookie: getDeactivatedFlagCookie,
        getIsVisitorAgreedToReceiveMarketingMailCookie: getIsVisitorAgreedToReceiveMarketingMailCookie,
        getRrPvidCookie: getRrPvidCookie,
        getDevCookie: getDevCookie,
        getLastEventTimeCookie: getLastEventTimeCookie,
        getMailRequestLastCallTimeCookie: getMailRequestLastCallTimeCookie,
        getSessionIdCookie: getSessionIdCookie,
        getLastViewedCookie: getLastViewedCookie,
        getLastAddedBasketCookie: getLastAddedBasketCookie,
        getRecomAddToCartItemIdCookie: getRecomAddToCartItemIdCookie,
        getRecomAddToCartMethodNameCookie: getRecomAddToCartMethodNameCookie,
        getRecomAddToCartSuggesterCookie: getRecomAddToCartSuggesterCookie,
        getRecomItemIdCookie: getRecomItemIdCookie,
        getRecomMethodNameCookie: getRecomMethodNameCookie,
        getRecomSuggesterCookie: getRecomSuggesterCookie,
        getViewItemIdCookie: getViewItemIdCookie,
        getAddToBasketItemIdCookie: getAddToBasketItemIdCookie,
        getSubFormLastViewCookie: getSubFormLastViewCookie,
        getVisitorSegmenRecordCookie: getVisitorSegmenRecordCookie,
        getWebPushSubscriptionSaved: getWebPushSubscriptionSaved,
        getWebPushSwUpdated: getWebPushSwUpdated,

        setForceClosedFlagCookie: setForceClosedFlagCookie,
        setDeactivatedFlagCookie: setDeactivatedFlagCookie,
        setIsVisitorAgreedToReceiveMarketingMailCookie: setIsVisitorAgreedToReceiveMarketingMailCookie,
        setSubFormLastViewCookie: setSubFormLastViewCookie,

        setOnRootRrPvidCookie: setOnRootRrPvidCookie,
        setOnRootDevCookie: setOnRootDevCookie,
        setOnRootLastEventTimeCookie: setOnRootLastEventTimeCookie,
        setOnRootMailRequestLastCallTimeCookie: setOnRootMailRequestLastCallTimeCookie,
        setOnRootSessionIdCookie: setOnRootSessionIdCookie,
        setOnRootLastViewedCookie: setOnRootLastViewedCookie,
        setOnRootLastAddedBasketCookie: setOnRootLastAddedBasketCookie,
        setOnRootViewItemIdCookie: setOnRootViewItemIdCookie,
        setOnRootAddToBasketItemIdCookie: setOnRootAddToBasketItemIdCookie,
        setOnRootRecomAddToCartItemIdCookie: setOnRootRecomAddToCartItemIdCookie,
        setOnRootRecomAddToCartMethodNameCookie: setOnRootRecomAddToCartMethodNameCookie,
        setOnRootRecomAddToCartSuggesterCookie: setOnRootRecomAddToCartSuggesterCookie,
        setOnRootRecomItemIdCookie: setOnRootRecomItemIdCookie,
        setOnRootRecomMethodNameCookie: setOnRootRecomMethodNameCookie,
        setOnRootRecomSuggesterCookie: setOnRootRecomSuggesterCookie,
        setOnRootVisitorSegmenRecordCookie: setOnRootVisitorSegmenRecordCookie,
        setOnRootWebPushSubscriptionSaved: setOnRootWebPushSubscriptionSaved,
        setOnRootWebPushSwUpdated: setOnRootWebPushSwUpdated,

        cleanOnRootLastViewedCookie: cleanOnRootLastViewedCookie,
        cleanOnRootLastAddedBasketCookie: cleanOnRootLastAddedBasketCookie,
        cleanOnRootAddToBasketItemIdCookie: cleanOnRootAddToBasketItemIdCookie,
        cleanOnRootViewItemIdCookie: cleanOnRootViewItemIdCookie,
        cleanOnRootRecomAddToCartItemIdCookie: cleanOnRootRecomAddToCartItemIdCookie,
        cleanOnRootRecomAddToCartMethodNameCookie: cleanOnRootRecomAddToCartMethodNameCookie,
        cleanOnRootRecomAddToCartSuggesterCookie: cleanOnRootRecomAddToCartSuggesterCookie,
        cleanOnRootRecomMethodNameCookie: cleanOnRootRecomMethodNameCookie,
        cleanOnRootRecomSuggesterCookie: cleanOnRootRecomSuggesterCookie,
        getSvyaznoyUserFilterType: getSvyaznoyUserFilterType,
        useNs: true
    };
});
