// eslint-disable-next-line no-undef
retailrocket.setModule('localLog',
    ['rrApi', 'rrLibrary'],
    function (rrApi, rrLibrary)
    {
        rrApi.view.subscribe(function (itemId)
        {
            rrLibrary.registerLocalEvent('view', { id: itemId });
        });

        rrApi.groupView.subscribe(function (productIds)
        {
            rrLibrary.registerLocalEvent('groupView', { ids: productIds });
        });

        rrApi.addToBasket.subscribe(function (itemId)
        {
            rrLibrary.registerLocalEvent('addToBasket', { id: itemId });
        });

        rrApi.removeFromBasket.subscribe(function (itemId)
        {
            rrLibrary.registerLocalEvent('removeFromBasket', { id: itemId });
        });

        // в корзину по совету
        rrApi.recomAddToCart.subscribe(function (itemId, p)
        {
            var params = p || {};
            var suggester = params.suggester || 'widget';
            var suggestMethod = params.suggestMethod || params.methodName || rrLibrary.parseStringableProperty(params, 'methodName', '');
            rrLibrary.registerLocalEvent('recomAddToCart', { id: itemId, sgr: suggester, met: suggestMethod });
        });

        function createOrderParams(product, transactionId)
        {
            return {
                id: product.id,
                qnt: product.qnt,
                transaction: transactionId,
                price: product.price
            };
        }

        rrApi.order.subscribe(function (obj)
        {
            for (var i = 0; i < obj.items.length; ++i)
            {
                var orderParams = createOrderParams(obj.items[i], obj.transaction);
                rrLibrary.registerLocalEvent('order', orderParams);
            }
        });

        rrApi.search.subscribe(function (searchPhrase)
        {
            rrLibrary.registerLocalEvent('search', searchPhrase);
        });

        rrApi.mailRequest.subscribe(function ()
        {
            rrLibrary.registerLocalEvent('mailrequest', {});
        });

        rrApi.mailRequestFormView.subscribe(function (requestParams)
        {
            rrLibrary.registerLocalEvent('mailrequestFormView', requestParams);
        });

        return {};
    });
