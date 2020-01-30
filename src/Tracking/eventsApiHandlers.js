// eslint-disable-next-line no-undef
retailrocket.setModule('eventsApiHandlers',
    ['cookies', 'api', 'utils', 'rrApi', 'rrLibrary', 'tracking'],
    function (cookies, api, utils, rrApi, rrLibrary, tracking)
    {
        if (utils.isRobot() || !cookies.areCookiesEnabled())
        {
            return {};
        }

        var queryParams = {
            setEmail: 'rr_setemail'
        };

        var _email;
        var execSetEmail = function (email, emailData)
        {
            _email = email.trim();
            setTimeout(
                function ()
                {
                    var basket = cookies.getLastAddedBasketCookie();
                    var viewed = cookies.getLastViewedCookie();

                    cookies.cleanOnRootLastAddedBasketCookie();
                    cookies.cleanOnRootLastViewedCookie();

                    tracking.setEmail(_email, emailData, basket, viewed, rrApi.setEmailCompleted);
                },
                100);
        };

        rrApi._initialize.subscribe(function (partnerParams)
        {
            if (!partnerParams)
            {
                return;
            }

            function callDeferredRecomAddToCart()
            {
                var recomAddToCartItemId = cookies.getRecomAddToCartItemIdCookie();
                var recomAddToCartSuggestMethod = cookies.getRecomAddToCartMethodNameCookie();
                var recomAddToCartSuggester = cookies.getRecomAddToCartSuggesterCookie();
                // eslint-disable-next-line no-eq-null, eqeqeq
                if (recomAddToCartItemId != null)
                {
                    rrApi.recomAddToCart(recomAddToCartItemId,
                        { suggestMethod: recomAddToCartSuggestMethod, suggester: recomAddToCartSuggester });
                }
            }

            function callDeferredAddToBasker()
            {
                var addToBasketItemId = cookies.getAddToBasketItemIdCookie();
                // eslint-disable-next-line no-eq-null, eqeqeq
                if (addToBasketItemId != null)
                {
                    rrApi.addToBasket(addToBasketItemId, {});
                }
            }

            function callDeferredRecomMouseDown()
            {
                var recomItemId = cookies.getAddToBasketItemIdCookie();
                var suggestMethod = cookies.getRecomMethodNameCookie();
                var recomSuggester = cookies.getRecomSuggesterCookie();
                // eslint-disable-next-line no-eq-null, eqeqeq
                if (recomItemId != null && recomSuggester != null)
                {
                    rrApi.recomMouseDown(recomItemId, { suggestMethod: suggestMethod, suggester: recomSuggester });
                }
            }

            var emailQueryParam = rrLibrary.getQueryParametr(queryParams.setEmail);
            // eslint-disable-next-line no-eq-null, eqeqeq
            if (emailQueryParam != null)
            {
                execSetEmail(emailQueryParam, rrLibrary.getSubscriberDataFromQueryString());
            }

            (function ()
            {
                tracking.pageView({
                    onSuccessCallback: function ()
                    {
                        rrApi.pageViewCompleted();
                    }
                });

                callDeferredRecomAddToCart();
                callDeferredAddToBasker();
                callDeferredRecomMouseDown();
            })();

            rrApi.view.subscribe(function (itemId, params)
            {
                cookies.setOnRootViewItemIdCookie(itemId);

                var paramsOrDefault = params || {};

                tracking.view({
                    itemId: itemId,
                    recomItemId: cookies.getRecomItemIdCookie(),
                    stockId: paramsOrDefault.stockId,
                    onSuccessCallback: rrApi.viewCompleted
                });
            });

            rrApi.groupView.subscribe(function (productIds, params)
            {
                var paramsOrDefault = params || {};
                tracking.groupView({
                    email: _email,
                    productIds: productIds,
                    recomItemId: cookies.getRecomItemIdCookie(),
                    stockId: paramsOrDefault.stockId
                });
            });

            rrApi.addToBasket.subscribe(function (itemId, stockId)
            {
                cookies.setOnRootAddToBasketItemIdCookie(itemId);
                tracking.addToBasket(itemId, stockId, rrApi.addToBasketCompleted);
            });

            rrApi.addToBasketCompleted.subscribe(function ()
            {
                cookies.cleanOnRootAddToBasketItemIdCookie();
            });

            rrApi.removeFromBasket.subscribe(function (itemId)
            {
                tracking.removeFromBasket(itemId, rrApi.removeFromBasketCompleted);
            });

            rrApi.categoryView.subscribe(function (idOrPath)
            {
                var categoryId = idOrPath;
                var categoryPath = null;

                // eslint-disable-next-line no-eq-null, eqeqeq
                var containsCategoryPath = parseInt(idOrPath, 10) != idOrPath;
                if (containsCategoryPath)
                {
                    categoryId = null;
                    categoryPath = idOrPath;
                }

                tracking.categoryView(categoryId, categoryPath, rrApi.categoryViewCompleted);
            });

            rrApi.recomAddToCart.subscribe(function (itemId, params)
            {
                var p = params || {};
                var suggestMethod =
                    p.methodName || rrLibrary.parseStringableProperty(p, 'methodName', '') ||
                    p.suggestMethod || rrLibrary.parseStringableProperty(p, 'suggestMethod', '');
                var suggester = p.suggester || 'widget';

                cookies.setOnRootRecomAddToCartItemIdCookie(itemId);
                cookies.setOnRootRecomAddToCartMethodNameCookie(suggestMethod);
                cookies.setOnRootRecomAddToCartSuggesterCookie(suggester);

                tracking.recomAddToBasket(
                    itemId,
                    suggester,
                    suggestMethod,
                    rrApi.recomAddToCartCompleted
                );
            });

            rrApi.recomAddToCartCompleted.subscribe(function ()
            {
                cookies.cleanOnRootRecomAddToCartItemIdCookie();
                cookies.cleanOnRootRecomAddToCartMethodNameCookie();
                cookies.cleanOnRootRecomAddToCartSuggesterCookie();
            });

            rrApi.recomMouseDown.subscribe(function (itemId, params)
            {
                var suggestMethod =
                    rrLibrary.parseStringableProperty(params, 'methodName', '') ||
                    rrLibrary.parseStringableProperty(params, 'suggestMethod', '');
                var suggester = params.suggester || 'widget';

                cookies.setOnRootRecomItemIdCookie(itemId);
                cookies.setOnRootRecomMethodNameCookie(suggestMethod);
                cookies.setOnRootRecomSuggesterCookie(suggester);

                tracking.recomMouseDown({
                    itemId: itemId,
                    suggester: suggester,
                    suggestMethod: suggestMethod,
                    rrmbid: utils.getParentsAttributeValueByEvent('data-retailrocket-markup-block'),
                    onSuccessCallback: rrApi.recomMouseDownCompleted
                });
            });

            rrApi.recomMouseDownCompleted.subscribe(function ()
            {
                cookies.cleanOnRootRecomMethodNameCookie();
                cookies.cleanOnRootRecomSuggesterCookie();
            });

            rrApi.recomTrack.subscribe(function (recomScenarionName, to, recomms, eventParams)
            {
                tracking.recomTrack({
                    suggestMethod: recomScenarionName,
                    to: to,
                    recomms: recomms.join(','),
                    onSuccessCallback: rrApi.recomTrackCompleted,
                    eventParams: eventParams
                });
            });

            rrApi.order.subscribe(function (obj)
            {
                function groupItemsById(orderedItem)
                {
                    var items = {};
                    for (var i = 0; i < orderedItem.length; ++i)
                    {
                        var item = orderedItem[i];
                        var prevItemQnt = (items[item.id.toString()] || { qnt: 0}).qnt;
                        items[item.id.toString()] = {
                            id: item.id,
                            qnt: prevItemQnt + (parseFloat(item.qnt) || 1),
                            price: parseFloat(item.price) || 0
                        };
                    }

                    return items;
                }

                var groupedItem = groupItemsById(obj.items);
                var itemsCount = Object.keys(groupedItem).length;
                var i = 0;
                for (var itemId in groupedItem)
                {
                    if (!{}.hasOwnProperty.call(groupedItem, itemId))
                    {
                        continue;
                    }

                    i++;
                    var item = groupedItem[itemId];
                    var isLastOrder = (i === itemsCount);

                    tracking.order({
                        itemId: item.id,
                        qnt: item.qnt,
                        price: item.price,
                        transaction: obj.transaction,
                        email: _email,
                        stockId: obj.stockId,
                        onSuccessCallback: isLastOrder ? rrApi.orderCompleted : function ()
                        { }
                    });
                }
            });

            rrApi.setEmail.subscribe(execSetEmail);
            rrApi.subscribeOnItemBackInStock.subscribe(tracking.backInStock);
            rrApi.welcomeSequence.subscribe(tracking.welcomeSequence);

            rrApi.search.subscribe(function (searchPhrase)
            {
                tracking.search({
                    email: _email,
                    searchPhrase: searchPhrase,
                    onSuccessCallback: function ()
                    { }
                });
            });

            rrApi.mailRequest.subscribe(tracking.mailRequest);

            rrApi.mailRequestFormView.subscribe(function (rp)
            {
                var requestParams = rp || {};

                tracking.viewSubscriptionForm({
                    // eslint-disable-next-line no-eq-null, eqeqeq
                    isFirstView: cookies.getSubFormLastViewCookie() == null,
                    requestType: requestParams.requestType,
                    onSuccessCallback: function ()
                    {}
                });

                cookies.setSubFormLastViewCookie();
            });

            rrApi.subscribeOnPriceDrop.subscribe(tracking.priceDrop);
        });

        return {};
    });
