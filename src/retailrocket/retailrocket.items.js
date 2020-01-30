// eslint-disable-next-line no-undef
retailrocket.setModule('items', ['cors'], function (cors)
{
    function baseUrl(partnerId)
    {
        return 'https://api.retailrocket.net/api/1.0/partner/' + partnerId + '/items/';
    }

    function getStockedItems(partnerId, itemIds, stockId, callback)
    {
        var url = baseUrl(partnerId) + '?itemsIds=' + itemIds.join(',') + (stockId ? '&stock=' + stockId : '');

        cors.make(
            url,
            'get',
            [],
            {},
            false,
            function (data)
            {
                callback(JSON.parse(data));
            }
        );
    }

    function getItems(partnerId, itemIds, stockIdOrCallback, callback)
    {
        if (arguments.length === 4)
        {
            return getStockedItems(partnerId, itemIds, stockIdOrCallback, callback);
        }

        return getStockedItems(partnerId, itemIds, null, stockIdOrCallback);
    }

    return {
        get: getItems,
        useNs: true
    };
});
