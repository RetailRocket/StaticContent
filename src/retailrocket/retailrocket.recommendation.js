// eslint-disable-next-line no-undef
retailrocket.setModule('recommendation', ['utils', 'recommendationClient'], function (utils, recommendationClient)
{
    return {
        // alg: alternative, related, accessories
        forProducts: function (partnerId, itemIds, alg, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.itemIds = itemIds;

            recommendationClient.get(partnerId, alg, p, callback);
        },
        // alg: latest, popular
        // categories - ids or category paths
        forCategories: function (partnerId, categoriesIds, alg, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.categoryIds = [];
            p.categoryPaths = [];
            for (var i = 0; i < categoriesIds.length; ++i)
            {
                if (parseInt(categoriesIds[i], 10) || parseInt(categoriesIds[i], 10) === 0)
                {
                    p.categoryIds.push(categoriesIds[i]);
                }
                else
                {
                    p.categoryPaths.push(categoriesIds[i]);
                }
            }
            recommendationClient.get(partnerId, alg, p, callback);
        },
        forPerson: function (partnerId, session, deletedParam, alg, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.algorithmType = alg !== 'personal' ? 'personal' : null;
            recommendationClient.get(partnerId, alg, p, callback);
        },
        forVisitor: function (partnerId, session, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.session = session;
            recommendationClient.get(partnerId, 'visitorinterest', p, callback);
        },
        forSearch: function (partnerId, phrase, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.phrase = phrase;
            recommendationClient.get(partnerId, 'Search', p, callback);
        },
        forVisitorCategoryInterest: function (partnerId, session, alg, params, callback)
        {
            var p = utils.plainCopy(params || {});
            p.session = session;
            p.algorithmType = 'VisitorCategoryInterest';
            recommendationClient.get(partnerId, alg, p, callback);
        },
        forPreview: function (partnerId, callback)
        {
            recommendationClient.get(partnerId, 'preview', {}, callback);
        },
        useNs: true
    };
});
/*
    retailrocket.recommendation.forProducts(
        PARTNER ID,
        ARRAY OF ITEM IDS,
        <alternative, related, accessories>,
        {stock:""},
        function (recommendation) {
        }
    )

    retailrocket.recommendation.forCategories(
        PARTNER ID,
        ARRAY OF CATEGORY IDS or 0 for whole shop,
        <latest, popular>,
        {stock:""},
        function (recommendation) {
        }
    )

    retailrocket.recommendation.forCategories(
        "5224c7b10d422d1c782cbc47",
        [0],
        "popular",
        {},
        function (recommendation) {
            debugger;
        }
    )
*/
