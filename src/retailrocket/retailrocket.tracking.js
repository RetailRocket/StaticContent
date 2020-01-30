// eslint-disable-next-line no-undef
retailrocket.setModule(
    'tracking',
    ['trackingClient', 'utils'],
    function (trackingClient, utils)
    {
        function setEmail(
            email,
            emailData,
            basket,
            viewed,
            onSuccessCallback,
            isAgreedToReceiveMarketingMail)
        {
            var params = {};
            if (typeof (emailData) === 'object' && !Array.isArray(emailData))
            {
                params = utils.plainCopy(emailData || {}, 'd.');
            }

            params.email = email;
            params.basket = basket;
            params.viewed = viewed;
            params.isAgreedToReceiveMarketingMail = isAgreedToReceiveMarketingMail !== false;

            trackingClient.call({
                eventName: 'setEmail',
                method: 'get',
                params: params,
                onSuccessCallback: onSuccessCallback
            });
        }

        return {
            pageView: function (options)
            {
                trackingClient.call({
                    eventName: 'pageView',
                    method: 'get',
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            groupView: function (options)
            {
                var productIds = [];
                if (options.productIds)
                {
                    productIds = options.productIds.map(Number);
                }

                trackingClient.call({
                    eventName: 'groupView',
                    method: 'post',
                    headers: [{ name: 'Content-type', value: 'application/json' }],
                    params: {
                        email: options.email,
                        recomItemId: options.recomItemId,
                        stockId: options.stockId
                    },
                    data: { productIds: productIds },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            markupRendered: function (options)
            {
                trackingClient.call({
                    eventName: 'markuprendered',
                    partnerId: options.partnerId,
                    method: 'get',
                    params: {
                        blockId: options.blockId,
                        segmentId: options.segmentId,
                        pvid: options.pvid,
                        session: options.session,
                        isMarkupViewedSupported: options.isMarkupViewedSupported
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            view: function (options)
            {
                trackingClient.call({
                    eventName: 'view',
                    method: 'get',
                    id: options.itemId,
                    params: {
                        recomItemId: options.recomItemId,
                        stockId: options.stockId
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            setEmail: setEmail,
            addToBasket: function (itemId, stockId, onSuccessCallback)
            {
                var stockIdValue = typeof (stockId) === 'object'
                    ? stockId.stockId
                    : stockId;

                trackingClient.call({
                    eventName: 'addToBasket',
                    method: 'get',
                    id: itemId,
                    params: {
                        stockId: stockIdValue
                    },
                    onSuccessCallback: onSuccessCallback
                });
            },
            removeFromBasket: function (itemId, onSuccessCallback)
            {
                trackingClient.call({
                    eventName: 'removeFromBasket',
                    method: 'get',
                    id: itemId,
                    params: {},
                    onSuccessCallback: onSuccessCallback
                });
            },
            categoryView: function (categoryId, categoryPath, onSuccessCallback)
            {
                trackingClient.call({
                    eventName: 'categoryView',
                    method: 'get',
                    id: categoryId,
                    params: {
                        categoryPath: categoryPath
                    },
                    onSuccessCallback: onSuccessCallback
                });
            },
            recomAddToBasket: function (itemId, suggester, suggestMethod, onSuccessCallback)
            {
                trackingClient.call({
                    eventName: 'recomAddToBasket',
                    method: 'get',
                    id: itemId,
                    params: {
                        suggester: suggester,
                        suggestMethod: suggestMethod
                    },
                    onSuccessCallback: onSuccessCallback
                });
            },
            order: function (options)
            {
                trackingClient.call({
                    eventName: 'order',
                    method: 'get',
                    id: options.itemId,
                    params: {
                        qnt: options.qnt,
                        price: options.price,
                        transaction: options.transaction,
                        email: options.email,
                        contactExternalId: options.contactExternalId,
                        stockId: options.stockId
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            search: function (options)
            {
                trackingClient.call({
                    eventName: 'search',
                    method: 'get',
                    params: {
                        email: options.email,
                        searchPhrase: options.searchPhrase
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            recomMouseDown: function (options)
            {
                trackingClient.call({
                    eventName: 'recomMouseDown',
                    method: 'get',
                    id: options.itemId,
                    params: {
                        suggester: options.suggester,
                        suggestMethod: options.suggestMethod,
                        rrmbid: options.rrmbid
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            recomTrack: function (options)
            {
                var params = {
                    suggestMethod: options.suggestMethod,
                    recomms: options.recomms,
                    to: options.recomms
                };

                var eventParams = options.eventParams || {};
                utils.extend(params, utils.plainCopy(eventParams));

                trackingClient.call({
                    eventName: 'recomTrack',
                    method: 'get',
                    params: params,
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            viewSubscriptionForm: function (options)
            {
                trackingClient.call({
                    eventName: 'viewsubscriptionform',
                    method: 'get',
                    params: {
                        isFirstView: options.isFirstView,
                        requestType: options.requestType
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            markupViewed: function (options)
            {
                trackingClient.call({
                    eventName: 'markupViewed',
                    method: 'get',
                    params: {
                        blockId: options.blockId,
                        segmentId: options.segmentId
                    },
                    onSuccessCallback: options.onSuccessCallback
                });
            },
            mailRequest: function (
                email,
                session,
                requestType,
                productIds,
                isAgreedToReceiveMarketingMail,
                customData)
            {
                setEmail(
                    email,
                    customData,
                    [],
                    [],
                    function ()
                    {},
                    isAgreedToReceiveMarketingMail);

                var params =
                {
                    email: email,
                    session: session,
                    requestType: requestType,
                    productIds: productIds,
                    isAgreedToReceiveMarketingMail: isAgreedToReceiveMarketingMail
                };
                utils.extend(params, utils.plainCopy(customData, 'd.'));
                trackingClient.call(
                    {
                        eventName: 'mailrequest',
                        method: 'get',
                        params: params
                    });
            },
            // Examples:
            // rrApi.subscribeOnPriceDrop("null@gmail.com",{id:3,price:3.9})
            // rrApi.subscribeOnPriceDrop("null@gmail.com",[{id:3,price:3.9},{id:4,price:1.9}])
            priceDrop: function (email, productOrProductList)
            {
                var productsArr = [].concat(productOrProductList);
                var params = { email: email };
                for (var i = 0; i < productsArr.length; i++)
                {
                    params['items[' + i + '].ItemId'] = productsArr[i].id;
                    params['items[' + i + '].Price'] = productsArr[i].price;
                }
                trackingClient.subscribe({
                    eventName: 'pricedrop',
                    method: 'get',
                    params: params
                });
            },
            emailClick: function (mailTrackingId, params)
            {
                trackingClient.call({
                    eventName: 'emailclick',
                    method: 'get',
                    params: params,
                    id: mailTrackingId
                });
            },
            backInStock: function (email, itemId)
            {
                trackingClient.subscribe({
                    eventName: 'backinstock',
                    method: 'get',
                    params: {
                        email: email,
                        itemId: itemId
                    }
                });
            },
            welcomeSequence: function (email)
            {
                trackingClient.subscribe({
                    eventName: 'welcomesequence',
                    method: 'get',
                    params: {
                        email: email
                    }
                });
            },
            webPushSubscription: function (options)
            {
                trackingClient.call({
                    eventName: 'webpushsubscription',
                    method: 'post',
                    headers: [{ name: 'Content-type', value: 'application/json' }],
                    params: {
                        subscriptionId: options.subscriptionId
                    },
                    data: options.subscription,
                    onSuccessCallback: options.onSuccessCallback });
            }
        };
    });
