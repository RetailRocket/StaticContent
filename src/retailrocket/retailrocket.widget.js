// eslint-disable-next-line no-undef
retailrocket.setModule('localEvents', ['utils'], function (utils)
{
    var eventsKey = 'retailRocketEvents';

    function getAllLocalEvents()
    {
        try
        {
            return JSON.parse(localStorage.getItem(eventsKey)) || [];
        }
        catch (e)
        {
            return [];
        }
    }

    function findLocalEvents(eventTypes, eventFromTs)
    {
        var events = getAllLocalEvents();

        if (eventTypes)
        {
            events = events.filter(function (ev)
            {
                return eventTypes.indexOf(ev.ev) >= 0;
            });
        }

        if (eventFromTs)
        {
            events = events.filter(function (ev)
            {
                return ev.ts > eventFromTs;
            });
        }

        return events;
    }

    function getViewedProductIds(eventFromTs)
    {
        var events = findLocalEvents(['view', 'groupView'], eventFromTs);

        var ids = [];
        events.forEach(function (event)
        {
            ids.push(event.ev === 'view' ? event.dt.id : event.dt.ids[0]);
        });

        return utils.uniq(ids);
    }

    function getOrderedProductIds(eventFromTs)
    {
        var events = findLocalEvents(['order'], eventFromTs);
        var ids = events.map(function (ev)
        {
            return ev.dt.id;
        });
        return utils.uniq(ids);
    }

    function getBasketState(events)
    {
        var basketState = {};
        events.forEach(function (ev)
        {
            var itemId = ev.dt.id;
            var count = parseInt(basketState[itemId], 10);
            if (isNaN(count))
            {
                count = 0;
            }
            if (ev.ev === 'addToBasket' || ev.ev === 'recomAddToCart')
            {
                basketState[itemId] = count + 1;
            }
            else
            {
                count = count - 1;
                if (count < 1)
                {
                    delete basketState[itemId];
                }
                else
                {
                    basketState[itemId] = count;
                }
            }
        });
        return basketState;
    }

    function getBasketProductIds(eventFromTs)
    {
        var events = findLocalEvents(['addToBasket', 'recomAddToCart', 'removeFromBasket'], eventFromTs);
        return utils.getAllKeys(getBasketState(events));
    }

    function getLastSearchPhrase(eventFromTs)
    {
        var events = findLocalEvents(['search'], eventFromTs);
        if (events.length > 0)
        {
            return events[events.length - 1].dt;
        }

        return null;
    }

    function getLastMailRequestTimestamp()
    {
        var events = findLocalEvents(['mailrequest'], 0);
        if (events.length < 1) return 0;
        return events[events.length - 1].ts;
    }

    function getLastEventTimestamp()
    {
        var allEvents = getAllLocalEvents();
        if (allEvents.length < 1) return 0;
        return allEvents[allEvents.length - 1].ts;
    }

    return {
        getViewedProductIds: getViewedProductIds,
        getOrderedProductIds: getOrderedProductIds,
        getBasketProductIds: getBasketProductIds,
        getLastEventTimestamp: getLastEventTimestamp,
        getLastSearchPhrase: getLastSearchPhrase,
        getLastMailRequestTimestamp: getLastMailRequestTimestamp,
        useNs: true
    };
});

// eslint-disable-next-line no-undef
retailrocket.setModule('exitIntendWidget', ['document', 'utils', 'api', 'cookies'], function ($document, utils, api, cookies)
{
    var exitIntendElem = null;
    var stillHaveToHide = false; // защита от дребезка
    var showEvent = utils.createEventProperty();

    function showWidget(widget)
    {
        stillHaveToHide = false;

        if (isWidgetOpen(widget))
        {
            return;
        }

        if (widget.getAttribute('active') === 'false' || cookies.getForceClosedFlagCookie())
        {
            return;
        }

        widget.className += ' active';

        showEvent.publish({});

        (function emitOnShow()
        {
            // eslint-disable-next-line no-eval
            eval(widget.getAttribute('data-on-show'));
        }).apply(widget);
    }

    function hideWidget(widget)
    {
        stillHaveToHide = true;
        setTimeout(function ()
        {
            if (stillHaveToHide)
            {
                widget.className = widget.className.replace(/\bactive\b/g, '').trim();
            }
        }, 50);
    }

    function isWidgetOpen(widget)
    {
        return widget.className.indexOf('active') >= 0;
    }

    function close(force)
    {
        if (force)
        {
            cookies.setForceClosedFlagCookie(true);
        }
        hideWidget(exitIntendElem);

        // ReSharper disable once UnusedParameter
        // ReSharper disable once RedundantLocalFunctionName
        // ReSharper disable once DeclarationHides
        (function emitOnHide(force)// eslint-disable-line no-unused-vars, no-shadow
        {
            // eslint-disable-next-line no-eval
            eval(exitIntendElem.getAttribute('data-on-hide'));
        }).apply(exitIntendElem, [force]);
    }

    function initialize()
    {
        exitIntendElem = utils.getElementsByClassName('retailrocket-notify-widget')[0] || utils.getElementsByClassName('retailrocket-exit-intend')[0];
        var popup = utils.getElementsByClassName('retailrocket-popup')[0];

        if (!exitIntendElem || exitIntendElem.getAttribute('initialized'))
        {
            return;
        }

        exitIntendElem.setAttribute('initialized', 'true');

        utils.addEventListener($document.documentElement, 'mouseleave', function (e)
        {
            if (e.clientY > 20)
            {
                return;
            }

            showWidget(exitIntendElem);
        });

        utils.addEventListener(exitIntendElem, 'click', function (e)
        {
            e.stopPropagation();
            if (window.event && window.event.cancelBubble)
            {
                window.event.cancelBubble = true;
            }
        });

        utils.addEventListener($document.documentElement, 'click', function ()
        {
            close(false);
        });

        utils.addEventListener($document, 'keydown', function (e)
        {
            if (e.keyCode === 27)
            {
                close(false);
            }
        });

        utils.addEventListener(exitIntendElem, 'mouseleave', function ()
        {
            if (!popup)
            {
                close(false);
            }
        });

        utils.addEventListener(exitIntendElem, 'mouseover', function ()
        {
            showWidget(exitIntendElem);
        });

        if (popup)
        {
            utils.addEventListener(exitIntendElem, 'click', function (e)
            {
                if (e.target === e.currentTarget)
                {
                    close(false);
                }
            });
        }
    }

    function isContainsElement(element)
    {
        if (!exitIntendElem) return false;
        return exitIntendElem.contains(element);
    }

    initialize();
    api.pushTrackingCall(function (rrApi)
    {
        rrApi.pageView.subscribe(initialize);
    });

    return {
        initialize: initialize,
        showEvent: showEvent,
        isContainsElement: isContainsElement,
        close: close,
        useNs: true
    };
});

// eslint-disable-next-line no-undef
retailrocket.setModule('timeOutWidget', ['document', 'utils', 'api', 'cookies'], function ($document, utils, api, cookies)
{
    var showClassName = 'retailrocket-timeout-widget-show';

    var widget = null;
    var onShow;
    var onHide;

    var deactivate = function ()
    {
        cookies.setDeactivatedFlagCookie(true);
    };

    var show = function (force)
    {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (widget == null)
        {
            return;
        }

        if ((cookies.getDeactivatedFlagCookie() || widget.getAttribute('active') === 'false') && !force)
        {
            return;
        }

        deactivate();

        widget.className = widget.className.replace(new RegExp('\\b' + showClassName + '\\b', 'g'), '') + ' ' + showClassName;

        (function emitOnShow()
        {
            // eslint-disable-next-line no-eval
            eval(onShow);
        }).apply(widget);
    };

    var hide = function ()
    {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (widget == null)
        {
            return;
        }

        widget.className = widget.className.replace(new RegExp('\\b' + showClassName + '\\b', 'g'), '');

        (function emitOnHide()
        {
            // eslint-disable-next-line no-eval
            eval(onHide);
        }).apply(widget);
    };

    function initialize(widgetClassName)
    {
        widget = utils.getElementsByClassName(widgetClassName || 'retailrocket-timeout-widget')[0];

        if (!widget || widget.getAttribute('retailrocket-timeout-initialized'))
        {
            return;
        }

        widget.setAttribute('retailrocket-timeout-initialized', 'true');

        var timeoutSec = parseInt(widget.getAttribute('data-retailrocket-timeout-sec'), 10);
        onShow = widget.getAttribute('data-retailrocket-timeout-on-show');
        onHide = widget.getAttribute('data-retailrocket-timeout-on-hide');

        setTimeout(show, timeoutSec * 1000);
    }
    initialize();
    api.pushTrackingCall(function (rrApi)
    {
        rrApi.pageView.subscribe(function ()
        {
            initialize();
        });
    });

    return {
        initialize: initialize,
        show: show,
        hide: hide,
        deactivate: deactivate,
        useNs: true
    };
});

// eslint-disable-next-line no-undef
retailrocket.setModule(
    'widget',
    ['ns', 'recommendation', 'items', 'utils', 'localEvents', 'api', 'exitIntendWidget', 'cookies', 'cdnurls'],
    function (ns, recommendationApi, itemsApi, utils, localEvents, api, exitIntendWidget, cookies, cdnurls)
    {
        api.pushTrackingCall(function (rrApi)
        {
            function saveLastEventTime()
            {
                cookies.setOnRootLastEventTimeCookie((new Date()).getTime());
            }

            rrApi.mailRequest.subscribe(function ()
            {
                cookies.setOnRootMailRequestLastCallTimeCookie((new Date()).getTime());
                saveLastEventTime();
            });

            rrApi.viewCompleted.subscribe(saveLastEventTime);
            rrApi.addToBasketCompleted.subscribe(saveLastEventTime);
            rrApi.recomAddToBasketCompleted.subscribe(saveLastEventTime);
            rrApi.orderCompleted.subscribe(saveLastEventTime);
        });


        var defaultHtmlTemplate = '' +
        '<header class="retailrocket-widgettitle">' +
        '<%=headerText%>' +
        '<% if (typeof subHeaderText !== "undefined") { %>' +
        '    <small><%=subHeaderText %></small>' +
        '<% } %>' +
        '</header>' +
        '<ul class="retailrocket-items">' +
        '    <% for (var i = 0 ; i < numberOfItems; ++i) with(items[i]) { %>' +
        '        <li class="retailrocket-item" style="width:<%=itemImageWidth%>px;">' +
        '            <a class="retailrocket-item-info" href="<%=Url%>" onmousedown=\'retailrocket.widget.click(<%=ItemId%>,"<%=suggesterId%>","<%=algorithm%>") \'>' +
        '                <div class="retailrocket-item-image"> ' +
        '                   <img onerror="retailrocket.widget.hideProduct(this)" src="' + cdnurls.cdnimg + '/api/1.0/partner/<%=partnerId%>/item/<%=ItemId%>/picture/?format=png&width=<%=itemImageWidth%>&height=<%=itemImageHeight%>&scale=both" style="width:<%=itemImageWidth%>px;height:<%=itemImageHeight%>px"></div>' +
        '                <div class="retailrocket-item-brand">' +
        '                    <%=Vendor %>' +
        '                </div>' +
        '                <div class="retailrocket-item-title">' +
        '                    <%=Name %>' +
        '                </div>' +
        '                <div class="retailrocket-item-description">' +
        '                    <%=Description %>' +
        '                </div>' +
        '            </a>' +
        '            <% if (OldPrice) { %>' +
        '                <div class="retailrocket-item-old-price"> <span class="retailrocket-item-old-price-value"><%= OldPrice %></span> <span class="retailrocket-item-price-currency"></span> </div>' +
        '            <% } %>' +
        '            <div class="retailrocket-item-price"> <span class="retailrocket-item-price-value"><%= Price %></span> <span class="retailrocket-item-price-currency"></span> </div>' +
        '            <nav class="retailrocket-actions">' +
        '                <a class="retailrocket-actions-more" href="<%=Url%>" onmousedown=\'retailrocket.widget.click(<%=ItemId%>,"<%=suggesterId%>","<%=algorithm%>")\'></a>' +
        '                <a class="retailrocket-actions-buy" href="<%=Url%>" onclick=\'return retailrocket._widgetAddToBasket("<%=ItemId%>", "<%=onAddToBasket%>")\'></a>' +
        '            </nav>' +
        '        </li>' +
        '   <% } %>' +
        '</ul>';

        var tmpl = (function ()
        {
            var cache = {};
            // ReSharper disable once InconsistentNaming
            return function _tmpl(str, data)
            {
                // eslint-disable-next-line no-new-func
                var fn = !/\W/.test(str) ? cache[str] = cache[str] || _tmpl(document.getElementById(str).innerHTML) : new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' + 'with(obj){p.push(\'' + str.replace(/[\r\t\n]/g, ' ').replace(/'(?=[^%]*%>)/g, '\t').split('\'').join('\\\'').split('\t').join('\'').replace(/<%=(.+?)%>/g, '\',$1,\'').split('<%').join('\');').split('%>').join('p.push(\'').split('\r').join('\\\'') + '\');}return p.join(\'\');');
                return data ? fn(data) : fn;
            };
        }());

        ns._widgetAddToBasket = function (itemId, callbackName)
        {
            // eslint-disable-next-line no-eval
            return eval(callbackName + '(\'' + itemId + '\')');
        };

        function templateRender(widget, data, tmplt, templateParams)
        {
            var tParams = utils.plainCopy(templateParams);
            // eslint-disable-next-line no-param-reassign
            data = data || [];

            widget.innerHTML = '';

            tParams.recommendations = tParams.items = data;
            tParams.numberOfItems = (tParams.numberOfItems || 0) >= data.length ? data.length : tParams.numberOfItems;

            widget.setAttribute('data-number-of-rendered-items', tParams.numberOfItems);
            widget.setAttribute('data-rendered-items-ids', data.slice(0, tParams.numberOfItems).map(function (r)
            {
                return r.ItemId;
            }).join(','));

            if (tParams.numberOfItems)
            {
                widget.innerHTML = tmpl(tmplt, tParams);
            }
        }

        function mailReqeustOrderRecommendation(partnerId, orderedProductIds, templateParams, onRecomsReceivedFn)
        {
            if (!templateParams.isPostransactionMailTemplateReady)
            {
                onRecomsReceivedFn([], '');
                return;
            }
            recommendationApi.forProducts(partnerId, orderedProductIds, 'related', { version: 1 }, function (recoms)
            {
                onRecomsReceivedFn(recoms, 'related', templateParams.headerTextOrdered);
            });
            return;
        }

        function mailRequestBasketRecommendation(partnerId, basketProductIds, templateParams, stockId, onRecomsReceivedFn)
        {
            if (!templateParams.isBasketMailTemplateReady)
            {
                onRecomsReceivedFn([], '');
                return;
            }

            itemsApi.get(partnerId, basketProductIds, stockId, function (items)
            {
                onRecomsReceivedFn(items, 'basket', templateParams.headerTextBasket);
            });
            return;
        }

        function mailRequestViewRecommendation(partnerId, viewedProductIds, templateParams, stockId, onRecomsReceivedFn)
        {
            if (!templateParams.isViewedMailTemplateReady)
            {
                onRecomsReceivedFn([], '');
                return;
            }

            function getUniqueGroupedItems(items)
            {
                function getFirstItemByGroupId(arr, groupId)
                {
                    if (!groupId)
                    {
                        return null;
                    }

                    for (var j = 0; j < arr.length; ++j)
                    {
                        var item = arr[j];
                        if (item.GroupId === groupId)
                        {
                            return item;
                        }
                    }
                    return null;
                }

                var result = [];
                for (var i = 0; i < items.length; ++i)
                {
                    var item = items[i];
                    var g = getFirstItemByGroupId(result, item.GroupId);

                    if (!g)
                    {
                        result.push(item);
                    }
                    else if (!g.IsAvailable)
                    {
                        var index = items.indexOf(g);
                        result[index] = g;
                    }
                }
                return result;
            }

            itemsApi.get(partnerId, viewedProductIds, stockId, function (recivedItems)
            {
                var items = getUniqueGroupedItems(recivedItems);

                var avalibleItems = items.filter(function (elm)
                {
                    return elm.IsAvailable;
                });
                var isThereAnyAvaliableItem = avalibleItems.length > 0;

                if (!isThereAnyAvaliableItem && templateParams.isViewedNaMailTemplateReady)
                {
                    onRecomsReceivedFn(items, 'viewedna', templateParams.headerTextViewedNa);
                }
                else
                {
                    onRecomsReceivedFn(avalibleItems, 'viewed', templateParams.headerTextViewed);
                }
            });
        }

        function toUtsTicks(date)
        {
            return (((date.getTime() - date.getTimezoneOffset() * 60) * 10000) + 621355968000000000);
        }

        function getRecomsByServerSideHistory(partnerId, history, templateParams, stockId, onRecomsReceivedFn)
        {
            var lastMailRequestTime = toUtsTicks(new Date(cookies.getMailRequestLastCallTimeCookie() || 0));

            var actualyHistory = history.filter(function (elm)
            {
                return elm.Weight > lastMailRequestTime;
            });

            var orderedProductIds = actualyHistory.filter(function (elm)
            {
                return elm.Algorithm === 'Order';
            }).map(function (elm)
            {
                return elm.ItemId;
            });

            if (orderedProductIds.length > 0)
            {
                mailReqeustOrderRecommendation(partnerId, orderedProductIds, templateParams, onRecomsReceivedFn);
                return;
            }

            var basketProductIds = actualyHistory.filter(function (elm)
            {
                return elm.Algorithm === 'AddToBasket' || elm.Algorithm === 'RecomAddToBasket';
            }).map(function (elm)
            {
                return elm.ItemId;
            });

            if (basketProductIds.length > 0)
            {
                mailRequestBasketRecommendation(partnerId, basketProductIds, templateParams, stockId, onRecomsReceivedFn);
                return;
            }

            var viewedProductIds = actualyHistory.filter(function (elm)
            {
                return elm.Algorithm === 'View';
            }).map(function (elm)
            {
                return elm.ItemId;
            });

            if (viewedProductIds.length > 0 && templateParams.isViewedMailTemplateReady)
            {
                mailRequestViewRecommendation(partnerId, viewedProductIds, templateParams, stockId, onRecomsReceivedFn);
                return;
            }

            onRecomsReceivedFn([], '');
            return;
        }

        function getRecomsByLocalEvents(partnerId, templateParams, stockId, onRecomsReceivedFn)
        {
            var fromTimestamp = localEvents.getLastMailRequestTimestamp();

            var orderedProductIds = localEvents.getOrderedProductIds(fromTimestamp);
            if (orderedProductIds.length > 0)
            {
                mailReqeustOrderRecommendation(partnerId, orderedProductIds, templateParams, onRecomsReceivedFn);
                return;
            }

            var basketProductIds = localEvents.getBasketProductIds(fromTimestamp);
            if (basketProductIds.length > 0)
            {
                mailRequestBasketRecommendation(partnerId, basketProductIds, templateParams, stockId, onRecomsReceivedFn);
                return;
            }

            var viewedProductIds = localEvents.getViewedProductIds(fromTimestamp);
            if (viewedProductIds.length > 0)
            {
                mailRequestViewRecommendation(partnerId, viewedProductIds, templateParams, stockId, onRecomsReceivedFn);
                return;
            }

            var phrase = localEvents.getLastSearchPhrase(fromTimestamp);
            // eslint-disable-next-line no-eq-null, eqeqeq
            if (phrase != null)
            {
                recommendationApi.forSearch(partnerId, phrase, {}, function (recoms)
                {
                    onRecomsReceivedFn(recoms, 'search', templateParams.headerTextSearched);
                });
                return;
            }

            onRecomsReceivedFn([], '');
            return;
        }

        function sendWidgetView(widget)
        {
            var listType = widget.getAttribute('data-rendered-list-type');
            if (!listType) return;
            api.pushTrackingCall(function (rrApi)
            {
                rrApi.mailRequestFormView({ requestType: listType });
            });
        }

        function buildPreRenderDelegate(context, preRenderStr)
        {
            if (!preRenderStr)
            {
                return function (r, n)
                {
                    n(r);
                };
            }

            // ReSharper disable UnusedParameter
            return function (data, renderFn) // eslint-disable-line no-unused-vars
            {
                // ReSharper restore UnusedParameter
                (function ()
                {
                    // eslint-disable-next-line no-eval
                    eval(preRenderStr);
                }).apply(context);
            };
        }

        function buildPostRenderDelegate(context, postRenderStr)
        {
            return function ()
            {
                (function ()
                {
                    // eslint-disable-next-line no-eval
                    eval(postRenderStr);
                }).apply(context);
            };
        }

        function algorithmTypeByAlgorithm(algorithm)
        {
            switch (algorithm)
            {
            case 'alternative':
            case 'related':
            case 'accessories':
                return 'product';
            case 'popular':
            case 'latest':
            case 'saleByLatest':
            case 'saleByPopular':
                return 'category';
            case 'search':
                return 'search';
            case 'personal':
                return 'personal';
            case 'mailrequest':
            case 'interacted-items': // obsolete
                return 'mailrequest';
            case 'mailrequest-server-side-history':
                return 'mailrequest-server-side-history';
            case 'preview':
                return 'preview';
            default:
                return null;
            }
        }
        function toCamelStyle(str)
        {
            return str.replace(/-([a-z])/g, function (all, letter)
            {
                return letter.toUpperCase();
            });
        }

        function getParamsFromAttribe(container, prefix)
        {
            var atts = container.attributes;
            var result = {};
            for (var i = 0; i < atts.length; i++)
            {
                var att = atts[i];
                if (att.nodeName.indexOf(prefix) === 0)
                {
                    var propName = toCamelStyle(att.nodeName.replace(prefix + '-', ''));
                    result[propName] = att.nodeValue;
                }
            }

            return result;
        }

        function getAlgorithmParams(widget)
        {
            var algParams = getParamsFromAttribe(widget, 'data-algorithm-param');
            algParams.version = algParams.version || widget.getAttribute('data-algorithm-ver');
            if (widget.getAttribute('data-exclude-basket-items') === 'true')
            {
                algParams.excludedItemIds = localEvents.getBasketProductIds(false);
            }
            return algParams;
        }

        function getParentMarkupId(widget)
        {
            var element = widget;
            var markupIdAttribute = 'data-retailrocket-markup-block';
            while (element)
            {
                if (element.getAttribute && element.getAttribute(markupIdAttribute))
                {
                    return element.getAttribute(markupIdAttribute);
                }
                element = element.parentNode;
            }
            return null;
        }

        function getTemplateParams(widget)
        {
            var markupBlockId = getParentMarkupId(widget);
            var templateParams = getParamsFromAttribe(widget, 'data-template-param');
            templateParams.onAddToBasket = widget.getAttribute('data-item-add-to-basket-action');
            templateParams.suggesterId = templateParams.suggesterId || widget.getAttribute('data-suggester-id') || markupBlockId || 'widget';
            templateParams.numberOfItems = templateParams.numberOfItems || widget.getAttribute('data-number-of-items');

            templateParams.headerText = templateParams.headerText || widget.getAttribute('data-header-text');
            templateParams.itemImageWidth = templateParams.itemImageWidth || widget.getAttribute('data-image-width') || 170;
            templateParams.itemImageHeight = templateParams.itemImageHeight || widget.getAttribute('data-image-height') || 170;

            templateParams.headerTextViewed = templateParams.headerTextViewed || widget.getAttribute('data-header-text-viewed') || widget.getAttribute('data-header-text') || templateParams.headerText;
            templateParams.headerTextViewedNa = templateParams.headerTextViewedNa || widget.getAttribute('data-header-text-viewedna') || widget.getAttribute('data-header-text') || templateParams.headerText;
            templateParams.headerTextBasket = templateParams.headerTextBasket || widget.getAttribute('data-header-text-basket') || widget.getAttribute('data-header-text') || templateParams.headerText;
            templateParams.headerTextOrdered = templateParams.headerTextOrdered || widget.getAttribute('data-header-text-ordered') || widget.getAttribute('data-header-text') || templateParams.headerText;
            templateParams.headerTextSearched = templateParams.headerTextSearched || widget.getAttribute('data-header-text-searched') || widget.getAttribute('data-header-text') || templateParams.headerText;

            templateParams.isViewedNaMailTemplateReady = templateParams.isViewedNaMailTemplateReady === 'true' || widget.getAttribute('data-viewedna-mail-template-ready') === 'true';
            templateParams.isViewedMailTemplateReady = (!widget.getAttribute('data-viewed-mail-template-ready') || widget.getAttribute('data-viewed-mail-template-ready') === 'true');
            templateParams.isBasketMailTemplateReady = (!widget.getAttribute('data-basket-mail-template-ready') || widget.getAttribute('data-basket-mail-template-ready') === 'true');
            templateParams.isPostransactionMailTemplateReady = (!widget.getAttribute('data-posttransaction-mail-template-ready') || widget.getAttribute('data-posttransaction-mail-template-ready') === 'true');
            return templateParams;
        }

        function renderWidget(widget)
        {
            var partnerId = api.getPartnerId();
            if (!partnerId || partnerId === 'undefined')
            {
                return;
            }

            var lastRenderedEventTs = -1;

            if (widget.getAttribute('data-widget-applied'))
            {
                return;
            }

            var algorithmType = widget.getAttribute('data-algorithm-type');
            var algorithm = widget.getAttribute('data-algorithm');

            if (!algorithmType && !algorithm)
            {
                return;
            }

            var templateContainerId = widget.getAttribute('data-template-container-id');
            var template = templateContainerId ? (document.getElementById(templateContainerId).innerText || document.getElementById(templateContainerId).textContent || document.getElementById(templateContainerId).innerHTML) : defaultHtmlTemplate;

            if (exitIntendWidget.isContainsElement(widget))
            {
                exitIntendWidget.showEvent.subscribe(function ()
                {
                    sendWidgetView(widget);
                });
            }

            // костыль для тех кто использовал interacted-items
            if (algorithm === 'interacted-items' && !widget.getAttribute('data-on-update'))
            {
                widget.setAttribute('data-on-update', 'Number(this.getAttribute("data-number-of-rendered-items")) ? this.parentElement.style.display = "block": this.parentElement.style.display = "none"');
            }
            var onPreRender = buildPreRenderDelegate(widget, widget.getAttribute('data-on-pre-render'));
            var onPostRender = buildPostRenderDelegate(widget, widget.getAttribute('data-on-update') || widget.getAttribute('data-on-post-render'));

            var templateParams = getTemplateParams(widget) || {};
            templateParams.partnerId = partnerId;
            templateParams.algorithm = algorithm;

            var algorithmParams = getAlgorithmParams(widget) || {};

            algorithmType = algorithmType || algorithmTypeByAlgorithm(algorithm);

            switch (algorithmType)
            {
            case 'product':
                var productIds = widget.getAttribute('data-algorithm-argument') || widget.getAttribute('data-item-id');
                if (!productIds)
                {
                    break;
                }
                recommendationApi.forProducts(
                    partnerId,
                    productIds.split(','),
                    algorithm,
                    algorithmParams,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            case 'category':
                var categoryPathsAttr = widget.getAttribute('data-algorithm-category-paths');
                var categoryArgs = null;

                if (categoryPathsAttr)
                {
                    // eslint-disable-next-line no-eval
                    categoryArgs = eval(categoryPathsAttr);
                }

                recommendationApi.forCategories(
                    partnerId,
                    (categoryArgs || (widget.getAttribute('data-algorithm-argument') || widget.getAttribute('data-category-id')).split(',')),
                    algorithm,
                    algorithmParams,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            case 'search':
                recommendationApi.forSearch(
                    partnerId,
                    (widget.getAttribute('data-algorithm-argument') || widget.getAttribute('data-search-phrase')),
                    algorithmParams,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            case 'personal':
                if (!api.getSessionId())
                {
                    return;
                }

                if (algorithm === 'compositeForCategory' && 'categoryPaths' in algorithmParams)
                {
                    // eslint-disable-next-line no-eval
                    algorithmParams.categoryPaths = eval(algorithmParams.categoryPaths);
                }

                recommendationApi.forPerson(
                    partnerId,
                    api.getSessionId(),
                    null,
                    algorithm,
                    algorithmParams,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            case 'mailrequest':
                var tParam1 = utils.plainCopy(templateParams);
                setInterval(function ()
                {
                    var lastEventTs = localEvents.getLastEventTimestamp();
                    if (lastRenderedEventTs !== lastEventTs)
                    {
                        getRecomsByLocalEvents(partnerId, tParam1, algorithmParams.stockId, function (recom, type, headerText)
                        {
                            tParam1.headerText = headerText;
                            widget.setAttribute('data-rendered-list-type', type);
                            onPreRender(recom, function (data)
                            {
                                templateRender(widget, data, template, tParam1);
                                onPostRender();
                            });
                        });

                        lastRenderedEventTs = lastEventTs;
                    }
                }, 1000);
                break;
            case 'mailrequest-server-side-history':
                var tParam2 = utils.plainCopy(templateParams);
                setInterval(function ()
                {
                    var lastEventTs = parseInt(cookies.getLastEventTimeCookie() || 0, 10);
                    if (lastEventTs > lastRenderedEventTs)
                    {
                        recommendationApi.forPerson(
                            partnerId,
                            api.getSessionId(),
                            null,
                            'history',
                            algorithmParams,
                            function (history)
                            {
                                getRecomsByServerSideHistory(partnerId, history, tParam2, algorithmParams.stockId, function (recom, type, headerText)
                                {
                                    tParam2.headerText = headerText;
                                    widget.setAttribute('data-rendered-list-type', type);
                                    onPreRender(recom, function (data)
                                    {
                                        templateRender(widget, data, template, tParam2);
                                        onPostRender();
                                    });
                                });
                            });
                        lastRenderedEventTs = (new Date()).getTime();
                    }
                }, 1000);
                break;
            case 'visitor-category-interest':
                if (!api.getSessionId())
                {
                    return;
                }

                recommendationApi.forVisitorCategoryInterest(
                    partnerId,
                    api.getSessionId(),
                    algorithm,
                    algorithmParams,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            case 'preview':
                recommendationApi.forPreview(
                    partnerId,
                    function (recommendation)
                    {
                        onPreRender(recommendation, function (data)
                        {
                            templateRender(widget, data, template, templateParams);
                            onPostRender();
                        });
                    }
                );
                break;
            default:
                break;
            }

            widget.setAttribute('data-widget-applied', true);
        }

        var cssHasBeenAdded = false;
        function renderAll(widgetClassName)
        {
            if (!api.getSessionId())
            {
                api.pushTrackingCall(function ()
                {
                    if (api.getSessionId()) renderAll(widgetClassName);
                });
            }

            var widgets = utils.getElementsByClassName(widgetClassName || 'retailrocket-widget');

            if (widgets.length > 0 && !cssHasBeenAdded)
            {
                cssHasBeenAdded = true;
                utils.registerCss(cdnurls.cdn + '/content/css/retailrocket.widget.css');
            }

            for (var i = 0; i < widgets.length; ++i)
            {
                renderWidget(widgets[i]);
            }
        }

        function click(itemId, suggesterId, algorithm)
        {
            api.pushTrackingCall(function (rrApi)
            {
                rrApi.recomMouseDown(itemId, { suggester: suggesterId, methodName: algorithm });
            });
        }

        function hideProduct(productSubElement)
        {
            var container = utils.getContainerByClass(productSubElement, 'retailrocket-item');
            if (container)
            {
                container.style.display = 'none';
            }
        }

        if (api.getPartnerId() && api.getSessionId() && api.getPartnerId() !== '527a338aec92e6106859030b')
        {
            renderAll();
        }

        api.pushTrackingCall(function (rrApi)
        {
            rrApi.pageView.subscribe(function ()
            {
                renderAll();
            });
        });

        function formatNumber(num, dec, thous, decimals)
        {
            var n = num;
            // eslint-disable-next-line no-cond-assign, no-param-reassign
            var decPlaces = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
            // eslint-disable-next-line eqeqeq, no-undefined
            var decSeparator = dec == undefined ? '.' : dec;
            // eslint-disable-next-line eqeqeq, no-undefined
            var thouSeparator = thous == undefined ? ',' : thous;
            var sign = n < 0 ? '-' : '';
            var i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces), 10) + '';
            // eslint-disable-next-line no-cond-assign
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + thouSeparator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : '');
        }

        return {
            hideProduct: hideProduct,
            formatNumber: formatNumber,
            render: renderAll,
            click: click,
            useNs: true
        };
    });

// eslint-disable-next-line no-undef
retailrocket.setModule('deactivateIfAgreedToReceiveMarketingMail', ['visitor', 'utils', 'api', 'cookies'], function (visitor, utils, api, cookies)
{
    function getElements()
    {
        return utils.getElementsByClassName('deactivate-if-visitor-agreed-to-receive-marketing-mail');
    }

    function activate(active)
    {
        var elements = getElements();
        for (var i = 0; i < elements.length; ++i)
        {
            elements[i].setAttribute('active', active);
        }
    }

    activate(false);

    function initialize()
    {
        var session = api.getSessionId();
        var elements = getElements();

        if (!session || elements.length === 0)
        {
            return;
        }

        if (cookies.getIsVisitorAgreedToReceiveMarketingMailCookie() === 'true')
        {
            activate(false);
            return;
        }

        visitor.get(api.getPartnerId(), session, function (visitorInformation)
        {
            var hasVisitorEmail = ((visitorInformation.HasEmail || '').toString() === 'true');
            var isVisitorAgreedToReceiveMarketingMail = ((visitorInformation.IsAgreedToReceiveMarketingMail || '').toString() === 'true');

            cookies.setIsVisitorAgreedToReceiveMarketingMailCookie(isVisitorAgreedToReceiveMarketingMail && hasVisitorEmail);

            activate(!hasVisitorEmail || !isVisitorAgreedToReceiveMarketingMail);
        });
    }

    if (api.getPartnerId() && api.getSessionId())
    {
        initialize();
    }

    api.pushTrackingCall(function (rrApi)
    {
        rrApi.pageView.subscribe(initialize);
    });

    return {
        initialize: initialize,
        useNs: true
    };
});

// eslint-disable-next-line no-undef
retailrocket.setModule('mailRequestForm', ['utils', 'document', 'api', 'exitIntendWidget'], function (utils, $document, api, exitIntendWidget)
{
    var productListElmIdAttributeName = 'data-product-to-send-widget-id';
    var emailInputElmIdAttributeName = 'data-email-input-id';
    var triggerEmailAgreeCheckboxIdAttributeName = 'data-subscribe-on-trigger-email-checkbox-id';
    var sendBtnElmIdAttributeName = 'data-send-btn-id';
    var dataOnSubscribeJsAttributeName = 'data-on-subscribe';

    function getCustomEmailData(mailRequestFormElm)
    {
        var inputs = mailRequestFormElm.getElementsByClassName('data-custom-email-attribute');
        var customData = {};

        for (var i = 0; i < inputs.length; i++)
        {
            var inputElm = inputs[i];
            customData[inputElm.name] = inputElm.value;
        }

        return customData;
    }

    function getFormModel(mailRequestFormElm)
    {
        var model = {
            email: null,
            isAgreeToGetTriggerEmail: false,
            listType: null,
            itemsId: [],
            onSubscribeJs: ''
        };

        var emailInputElm = $document.getElementById(mailRequestFormElm.getAttribute(emailInputElmIdAttributeName));

        model.email = (emailInputElm.value || '').trim();

        var triggerEmailAgreeCheckbox = $document.getElementById(mailRequestFormElm.getAttribute(triggerEmailAgreeCheckboxIdAttributeName));

        if (triggerEmailAgreeCheckbox)
        {
            model.isAgreeToGetTriggerEmail = triggerEmailAgreeCheckbox.checked;
        }
        var productListElm = $document.getElementById(mailRequestFormElm.getAttribute(productListElmIdAttributeName));

        if (productListElm && productListElm.getAttribute('data-rendered-items-ids'))
        {
            model.itemsId = productListElm.getAttribute('data-rendered-items-ids').split(',');
            model.listType = productListElm.getAttribute('data-rendered-list-type');
        }

        model.customData = getCustomEmailData(mailRequestFormElm);
        model.onSubscribeJs = mailRequestFormElm.getAttribute(dataOnSubscribeJsAttributeName);
        return model;
    }

    function sendMailRequest(mailRequestFormElm)
    {
        var model = getFormModel(mailRequestFormElm);
        if (!utils.isValidEmail(model.email)) return;

        api.pushTrackingCall(function (rrApi)
        {
            rrApi.mailRequest(model.email, api.getSessionId(), model.listType, model.itemsId, model.isAgreeToGetTriggerEmail, model.customData);
        });

        (function emitOnSunbscribe()
        {
            // eslint-disable-next-line no-eval
            eval(model.onSubscribeJs);
        }).apply(mailRequestFormElm);

        if (exitIntendWidget.isContainsElement(mailRequestFormElm))
        {
            exitIntendWidget.close(model.isAgreeToGetTriggerEmail);
        }
    }

    function initialize()
    {
        var mailRequestFormElms = utils.getElementsByClassName('retailrocket-mailrequest-form');

        for (var i = 0; i < mailRequestFormElms.length; ++i)
        {
            var mailRequestFormElm = mailRequestFormElms[i];

            if (!mailRequestFormElm || mailRequestFormElm.getAttribute('initialized'))
            {
                return;
            }

            mailRequestFormElm.setAttribute('initialized', 'true');

            var emailInputElm = $document.getElementById(mailRequestFormElm.getAttribute(emailInputElmIdAttributeName));

            var sendBtnElm = $document.getElementById(mailRequestFormElm.getAttribute(sendBtnElmIdAttributeName));

            utils.addEventListener(sendBtnElm, 'click',
                // eslint-disable-next-line no-shadow
                (function (mailRequestFormElm)
                {
                    return function ()
                    {
                        sendMailRequest(mailRequestFormElm);
                    };
                }(mailRequestFormElm))
            );

            utils.addEventListener(emailInputElm, 'keydown',
                // eslint-disable-next-line no-shadow
                (function (mailRequestFormElm)
                {
                    return function (e)
                    {
                        if (e.keyCode === 13)
                        {
                            sendMailRequest(mailRequestFormElm);
                        }
                    };
                }(mailRequestFormElm)));
        }
    }

    initialize();
    api.pushTrackingCall(function (rrApi)
    {
        rrApi.pageView.subscribe(initialize);
    });

    return {
        initialize: initialize,
        useNs: true
    };
});
