// eslint-disable-next-line no-undef
retailrocket.setModule('products', ['cors', 'api', 'utils', 'cdnurls'], function (cors, api, utils, cdnurls)
{
    var availableProperties = [
        'id',
        'name',
        'price',
        'pictureUrl',
        'url',
        'isAvailable',
        'categoryPaths',
        'description',
        'stockId',
        'vendor',
        'model',
        'typePrefix',
        'oldPrice',
        'buyUrl',
        'params',
        'color',
        'size',
        'title',
        'artist'];

    function baseUrl(partnerId)
    {
        return cdnurls.cdn + '/api/1.0/partner/' + partnerId + '/products/';
    }

    function make(partnerId, productId, stockId, body, signature, validTillDate)
    {
        var hash = utils.createMd5Hash(body);

        var queryString = utils.objToQueryString({
            stockId: stockId,
            signature: signature,
            contentHash: hash,
            validTill: validTillDate
        });

        cors.make(
            baseUrl(partnerId) + productId + '?' + queryString,
            'POST',
            [{ name: 'Content-type', value: 'application/json' }],
            body,
            false,
            // eslint-disable-next-line brace-style
            function () { },
            // eslint-disable-next-line brace-style
            function () { }
        );
    }

    function signedPost(partnerId, productJsonString, signature, validTillDate)
    {
        var product = JSON.parse(productJsonString);
        var productId = product.id;
        var stockId = product.stockId;
        make(partnerId, productId, stockId, productJsonString, signature, validTillDate);
    }

    function moveExternalProperiesToParams(product)
    {
        for (var property in product)
        {
            if (availableProperties.indexOf(property) < 0)
            {
                (product.params = product.params || {})[property] = product[property];
                delete product[property];
            }
        }
    }

    function unsignedPost(partnerId, product)
    {
        var productId = product.id;
        var stockId = product.stockId;

        product.id = parseInt(product.id, 10);
        product.price = parseFloat(product.price);
        product.oldPrice = parseFloat(product.oldPrice);
        product.categoryPaths = product.categoryPaths || product.category;
        if (product.stockId && typeof (product.stockId) !== 'string')
        {
            product.stockId = product.stockId.toString();
        }
        moveExternalProperiesToParams(product);

        make(partnerId, productId, stockId, utils.prototypeSafeJsonStringify(product));
    }

    function post(product, signature, validTillDate)
    {
        if (!utils.encodingIsModified())
        {
            api.pushTrackingCall(function ()
            {
                if (signature)
                {
                    return signedPost(api.getPartnerId(), product, signature, validTillDate);
                }

                return unsignedPost(api.getPartnerId(), product);
            });
        }
    }

    return {
        post: post,
        useNs: true
    };
});
