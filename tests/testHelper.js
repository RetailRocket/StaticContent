/* global rrApi */
window.TestHelper = (function ()
{
    var cookieMock = {};


    function loadTrackingScript(beforeLoad, partnerConfig)
    {
        // ��� ��������
        var element = document.getElementById('rrApi-jssdk');
        if (element)
        {
            element.parentNode.removeChild(element);
        }

        window.rrApi = {};
        window.rrApiOnReady = [];

        window.rrApi.addToBasket = window.rrApi.order = window.rrApi.categoryView = window.rrApi.view =
            window.rrApi.recomMouseDown = window.rrApi.recomAddToCart = function ()
            { };

        if (beforeLoad)
        {
            beforeLoad();
        }

        (function (d)
        {
            var ref = d.getElementsByTagName('script')[0];
            var apiJs;
            var apiJsId = 'rrApi-jssdk';
            if (d.getElementById(apiJsId)) return;
            apiJs = d.createElement('script');
            apiJs.id = apiJsId;
            apiJs.async = true;
            apiJs.src = '/bin/Content/JavaScript/tracking.js';

            spyOn(ref.parentNode, 'insertBefore').and.callFake(function (scriptElm)
            {
                if (scriptElm.id === 'rrApiParam')
                {
                    rrApi._initialize(partnerConfig);
                    return;
                }
                ref.parentNode.appendChild(scriptElm);
            });

            ref.parentNode.insertBefore(apiJs, ref);
        }(document));
    }

    function resetApiEnviroment(win, doc)
    {
        var element = doc.getElementById('rrApi-jssdk');
        if (element)
        {
            element.parentNode.removeChild(element);
        }

        delete window.rrPartnerId;
        delete window.rrApi;
        delete window.rrApiOnReady;
    }

    function createScriptElementInfo(scriptElement)
    {
        var info = {};
        scriptElement.src.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function ($0, $1, $2, $3)
            {
                info[$1] = $3;
            }
        );
        info.uri = scriptElement.src.split('?')[0];
        info.isAsyncJs = (scriptElement.type === 'text/javascript' && scriptElement.async === true && info.format === 'json');
        return info;
    }

    function getCookie(cName)
    {
        if (!cookieMock.hasOwnProperty(cName))
        {
            // eslint-disable-next-line no-undefined
            return undefined;
        }

        return cookieMock[cName].value;
    }

    function setCookie(cName, value, expireInSecond, path)
    {
        if (expireInSecond <= 0)
        {
            delete cookieMock[cName];
            return;
        }
        cookieMock[cName] = { value: value, expire: expireInSecond, path: path };
    }

    return {
        resetApiEnviroment: resetApiEnviroment,
        createScriptElementInfo: createScriptElementInfo,
        cookieMock: cookieMock,
        getCookie: getCookie,
        setCookie: setCookie,
        loadTrackingScript: loadTrackingScript
    };
})();
