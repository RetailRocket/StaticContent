// eslint-disable-next-line no-undef
retailrocket.setModule('categories', ['cors', 'api', 'utils'], function (cors, api, utils)
{
    function baseUrl(partnerId)
    {
        return 'https://tracking.retailrocket.net/1.0/partner/' + partnerId + '/categories/';
    }

    function buildUrl(partnerId, categoryId, categoryPath, signature)
    {
        var url = baseUrl(partnerId) + (categoryId || '') + '?';
        if (categoryPath)
        {
            url += '&categoryPath=' + encodeURIComponent(categoryPath);
        }
        if (signature)
        {
            url += '&signature=' + signature;
        }
        return url;
    }

    function make(partnerId, categoryId, categoryPath, body, signature)
    {
        cors.make(
            buildUrl(partnerId, categoryId, categoryPath, signature),
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

    function signedPost(partnerId, categoryJsonString, signature)
    {
        var category = JSON.parse(categoryJsonString);
        var categoryId = category.id;
        var categoryPath = category.categoryPath;
        make(partnerId, categoryId, categoryPath, utils.prototypeSafeJsonStringify(categoryJsonString), signature);
    }

    function unsignedPost(partnerId, category)
    {
        var categoryId = category.id;
        var categoryPath = category.categoryPath;
        make(partnerId, categoryId, categoryPath, utils.prototypeSafeJsonStringify(category));
    }

    function post(category, signature)
    {
        if (!utils.encodingIsModified())
        {
            api.pushTrackingCall(function ()
            {
                if (signature)
                {
                    return signedPost(api.getPartnerId(), category, signature);
                }

                return unsignedPost(api.getPartnerId(), category);
            });
        }
    }

    return {
        post: post,
        useNs: true
    };
});
