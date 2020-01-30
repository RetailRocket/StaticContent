/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.recommendation.js');
require('../src/retailrocket/retailrocket.utils.js');

var jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket recommendation module', function ()
{
    var utils = retailrocket.modules.utils();
    var noOp = () => ({});

    var recommendationClientMock = {
        get: jasmine.createSpy('recommendationClientMock.get')
    };

    var sut = retailrocket.modules.recommendation(
        utils,
        recommendationClientMock);

    describe('forSearch', function ()
    {
        it('passes all params', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var phrase = jasmineHelpers.randomStringValue({prefix: 'phrase'});
            var params = jasmineHelpers.randomObject();

            sut.forSearch(partnerId, phrase, params, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    'Search',
                    jasmine.objectContaining(params),
                    jasmine.any(Function));
        });

        it('passes search phrase', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var phrase = jasmineHelpers.randomStringValue({prefix: 'phrase'});

            sut.forSearch(partnerId, phrase, {}, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    'Search',
                    jasmine.objectContaining({phrase: phrase}),
                    jasmine.any(Function));
        });
    });

    describe('forProducts', function ()
    {
        it('passes all parameters', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var alg = jasmineHelpers.randomStringValue({prefix: 'alg'});
            var productIds = [1, 2, 3, 4, 1000];
            var params = jasmineHelpers.randomObject();

            sut.forProducts(partnerId, productIds, alg, params, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining(params),
                    jasmine.any(Function));
        });

        it('passes productIds', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var alg = jasmineHelpers.randomStringValue({prefix: 'alg'});
            var productIds = [1, 2, 3, 4, 1000];

            sut.forProducts(partnerId, productIds, alg, {}, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining({itemIds: productIds}),
                    jasmine.any(Function));
        });
    });

    describe('forPersonal', function ()
    {
        it('array as algorithm params work like array', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var session = jasmineHelpers.randomStringValue({prefix: 'session'});
            var alg = 'personal';
            var params = { testarrayparam: [1, 2, 3] };

            sut.forPerson(partnerId, session, null, alg, params, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining(params),
                    jasmine.any(Function));
        });

        it('passes algorythmType', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var session = jasmineHelpers.randomStringValue({prefix: 'session'});
            var alg = 'personal';
            var params = jasmineHelpers.randomObject();

            sut.forPerson(partnerId, session, null, alg, params, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining({ algorithmType: null }),
                    jasmine.any(Function));
        });
    });

    describe('forCategories', function ()
    {
        it('passes all props', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var alg = jasmineHelpers.randomStringValue({prefix: 'alg'});
            var props = jasmineHelpers.randomObject();

            sut.forCategories(partnerId, [], alg, props, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining(props),
                    jasmine.any(Function));
        });

        it('passes correct categoryPaths parameter', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var categoriesIds = ['A', 'B', 'C'];
            var alg = jasmineHelpers.randomStringValue({prefix: 'alg'});

            sut.forCategories(partnerId, categoriesIds, alg, {}, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining({
                        categoryIds: [],
                        categoryPaths: categoriesIds
                    }),
                    jasmine.any(Function));
        });

        it('passes correct categoryIds parameter', function ()
        {
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var categoriesIds = [1, 2, 3];
            var alg = jasmineHelpers.randomStringValue({prefix: 'alg'});

            sut.forCategories(partnerId, categoriesIds, alg, {}, noOp);

            expect(recommendationClientMock.get)
                .toHaveBeenCalledWith(
                    partnerId,
                    alg,
                    jasmine.objectContaining({
                        categoryIds: categoriesIds,
                        categoryPaths: []
                    }),
                    jasmine.any(Function));
        });
    });
});
