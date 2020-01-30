// eslint-disable-next-line no-undef
retailrocket.setModule('markup', ['utils', 'api', 'dev', 'cors', 'document', 'tracking', 'cdnurls', 'elementViewedObserver'], function (utils, api, dev, cors, $doc, tracking, cdnurls, elementViewedObserver)
{
    var blockAttr = 'data-retailrocket-markup-block';
    var insertTimerInterval = 100;

    function appendScript(url)
    {
        var newJs = $doc.createElement('script');
        newJs.type = 'text/javascript';
        newJs.src = url;
        newJs.async = true;
        $doc.getElementsByTagName('script')[0].parentElement.appendChild(newJs);
    }

    function buildErrorReportUrl(markupBlock)
    {
        var partnerId = markupBlock.PartnerId;
        var markupBlockId = markupBlock.Id;
        var blockChangingDate = markupBlock.LastChangedAt;

        return 'https://tracking.retailrocket.net/2.0/partner/' + partnerId + '/markupblocks/' + markupBlockId + '/trackerror/?blockChangingDate=' + blockChangingDate;
    }

    function serializeAttributes(container)
    {
        var result = { };
        for (var i = 0; i < container.attributes.length; i++)
        {
            var attr = container.attributes[i];
            result[attr.name] = attr.value;
        }
        return result;
    }

    function trackError(markupBlock, container, exception)
    {
        var errorModel = {
            name: exception.name,
            attributes: serializeAttributes(container),
            message: exception.message,
            stack: exception.stack
        };
        cors.make(
            buildErrorReportUrl(markupBlock),
            'POST',
            [{ name: 'Content-type', value: 'application/json' }],
            utils.prototypeSafeJsonStringify(errorModel),
            false,
            // eslint-disable-next-line brace-style
            function () { },
            // eslint-disable-next-line brace-style
            function () { }
        );
    }

    var cache = {};

    function sendRenderedEvent(
        markupBlock,
        isObserverSupported)
    {
        tracking.markupRendered({
            partnerId: markupBlock.PartnerId,
            blockId: markupBlock.Id,
            segmentId: markupBlock.SegmentId,
            pvid: api.getPartnerVisitorId(),
            session: api.getSessionId(),
            isMarkupViewedSupported: isObserverSupported
        });
    }

    function observeMarkupBlock(
        container,
        blockId,
        segmentId)
    {
        var makupViewedCallback = utils.bind(
            tracking.markupViewed,
            {},
            {
                blockId: blockId,
                segmentId: segmentId
            });

        elementViewedObserver.observe(
            {
                htmlElement: container,
                callback: makupViewedCallback
            });
    }

    function renderBlock(container, markupBlock)
    {
        if (!markupBlock || !markupBlock.Markup)
        {
            return;
        }

        var markup = markupBlock.Markup;

        var atts = container.attributes;
        for (var att, i = 0, n = atts.length; i < n; i++)
        {
            att = atts[i];
            markup = markup
                .replace(new RegExp('{{' + att.nodeName + '}}', 'gi'),
                    utils.htmlEncode(att.nodeValue)
                        .replace(new RegExp('"', 'g'), '&quot;')
                        .replace(new RegExp('\'', 'g'), '&#39;'));
        }
        container.innerHTML = markup;

        [].forEach.call(
            container.querySelectorAll('script'),
            function (elm)
            {
                if (elm)
                {
                    if (elm.src)
                    {
                        appendScript(elm.src);
                    }
                    else if (!elm.type || elm.type === 'text/javascript')
                    {
                        try
                        {
                            // eslint-disable-next-line no-eval
                            eval.apply(window, [elm.text]);
                        }
                        catch (ex)
                        {
                            trackError(markupBlock, container, ex);
                            throw ex;
                        }
                    }
                }
            });

        var isObserverSupported = elementViewedObserver.isObserverSupported();

        sendRenderedEvent(
            markupBlock,
            isObserverSupported);

        if (isObserverSupported === true)
        {
            observeMarkupBlock(
                container,
                markupBlock.Id,
                markupBlock.SegmentId);
        }
    }

    function insertBlock(container)
    {
        if (container.getAttribute('initialized'))
        {
            return;
        }

        container.setAttribute('initialized', 'true');

        var isDebug = dev.developmentMode();
        var queryString = utils.queryStringToObj(utils.getQueryString());

        var query = {
            blockId: container.getAttribute(blockAttr),
            pvid: api.getPartnerVisitorId(),
            partnerId: api.getPartnerId(),
            isDebug: isDebug,
            segmentId: queryString.rr_segmentId
        };

        if (isDebug)
        {
            query.rnd = Date.now();
        }

        if (!cache[query.blockId])
        {
            cache[query.blockId] = { data: null, callbacks: [] };
            cors.make(
                cdnurls.cdn + '/api/markupblocks/?' + utils.objToQueryString(query),
                'get',
                {},
                {},
                false,
                function (data)
                {
                    var jsonData = JSON.parse(data);
                    cache[query.blockId].data = jsonData;
                    cache[query.blockId].callbacks.forEach(function (callback)
                    {
                        callback(jsonData);
                    });
                }
            );
        }

        if (cache[query.blockId].data === null)
        {
            cache[query.blockId].callbacks.push(function (data)
            {
                renderBlock(container, data);
            });
        }
        else
        {
            renderBlock(container, cache[query.blockId].data);
        }
    }

    function insertAllBlocks()
    {
        utils.$forall('div[' + blockAttr + ']', insertBlock);
    }

    var insertTimer = setInterval(
        function ()
        {
            insertAllBlocks();
        },
        insertTimerInterval);

    insertAllBlocks();

    utils.addEventListener($doc, 'DOMContentLoaded', function ()
    {
        clearTimeout(insertTimer);
        insertAllBlocks();
    });

    return {
        render: insertAllBlocks,
        renderBlock: renderBlock,
        useNs: true
    };
});
