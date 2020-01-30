// eslint-disable-next-line no-undef
retailrocket.setModule('productsGroup', ['cors', 'api', 'utils', 'cdnurls'], function (cors, api, utils, cdnurls)
{
    var availableProperties = [
        'groupId',
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
        'artist',
        'products'];

    function baseUrl(partnerId)
    {
        return cdnurls.cdn + '/api/1.0/partner/' + partnerId + '/productsgroup/';
    }

    function make(partnerId, groupId, stockId, body, signature, validTillDate)
    {
        var hash = utils.createMd5Hash(body);

        var queryString = utils.objToQueryString({
            stockId: stockId,
            signature: signature,
            contentHash: hash,
            validTill: validTillDate
        });

        cors.make(
            baseUrl(partnerId) + groupId + '?' + queryString,
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
        var groupId = product.groupId;
        var stockId = product.stockId;
        make(partnerId, groupId, stockId, productJsonString, signature, validTillDate);
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
        product.categoryPaths = product.categoryPaths || product.category;
        var groupId = product.groupId;
        var stockId = product.stockId;

        product.price = parseFloat(product.price);
        product.oldPrice = parseFloat(product.oldPrice);

        moveExternalProperiesToParams(product);

        if (product.products)
        {
            for (var i in product.products)
            {
                if (product.products.hasOwnProperty(i))
                {
                    var p = product.products[i];
                    if (typeof (p.price) === 'string')
                    {
                        p.price = parseFloat(p.price);
                    }
                    if (typeof (p.oldPrice) === 'string')
                    {
                        p.oldPrice = parseFloat(p.oldPrice);
                    }
                    if (p.stockId && typeof (p.stockId) !== 'string')
                    {
                        p.stockId = p.stockId.toString();
                    }

                    utils.plainCopy(p.params);
                }
            }
        }

        make(partnerId, groupId, stockId, utils.prototypeSafeJsonStringify(product));
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
