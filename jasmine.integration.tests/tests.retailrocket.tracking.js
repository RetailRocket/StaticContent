/* global retailrocket */
const createCors = require('./fakeCors.js').create;

global.retailrocket = require('../jasmine.unit.tests/retailrocket.fakeModule.js');

var jasmineHelpers = require('../jasmine.unit.tests/jasmineHelpers.js');
require('../src/retailrocket/internal/retailrocket.trackingClient.js');
require('../src/retailrocket/retailrocket.tracking.js');
require('../src/retailrocket/retailrocket.utils.js');

var noOp = () =>
{
};

describe('Retail Rocket tracking module', function ()
{
    function createTracking(options)
    {
        var cors = createCors(options);

        var utils = retailrocket.modules.utils(cors);
        utils.convertUrHostnameToASCII = (url) => url;

        var documentStub = {
            referrer: jasmineHelpers.randomStringValue({prefix: 'https://test.referrer.retailrocket.ru/'})
        };

        var windowStub = {
            location: {
                href: jasmineHelpers.randomStringValue({prefix: 'https://test.retailrocket.ru/'})
            }
        };

        var apiStub = {
            getPartnerId: () => '59a00b843329f319dcac6fa6',
            getSessionId: () => '59a00b843329f319dcac6fa6',
            getPartnerVisitorId: noOp
        };

        var trackingClient = retailrocket.modules.trackingClient(cors, utils, documentStub, windowStub, apiStub);
        return retailrocket.modules.tracking(trackingClient, utils);
    }

    var domain = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';
    var tracking = createTracking({origin: domain});
    var assert = function (response, done)
    {
        expect(response.statusCode).toEqual(200);
        expect(response.headers['access-control-allow-origin']).toEqual(domain);
        expect(response.headers['access-control-allow-credentials']).toEqual('true');
        done();
    };

    it('page view works with cors', function (done)
    {
        tracking.pageView({
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('group view works with cors', function (done)
    {
        tracking.groupView({
            productIds: [1234, 24323, 2445],
            stockId: 4123421,
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('view works with cors', function (done)
    {
        tracking.view({
            itemId: 123456,
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('setEmail works with cors', function (done)
    {
        var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';
        var emailData = {
            'd.emailDataProp1': jasmineHelpers.randomStringValue({prefix: 'emailDataProp1'})
        };
        var basket = null;
        var viewed = null;
        var onSuccessCallback = (response) => assert(response, done);

        tracking.setEmail(
            email,
            emailData,
            basket,
            viewed,
            onSuccessCallback);
    });

    it('addToBasket works with cors', function (done)
    {
        var itemId = 1928375;
        var stockId = 'testStockId';
        var onSuccessCallback = (response) => assert(response, done);
        tracking.addToBasket(
            itemId,
            stockId,
            onSuccessCallback);
    });

    it('removeFromBasket works with cors', function (done)
    {
        var itemId = 21321885;
        var onSuccessCallback = (response) => assert(response, done);
        tracking.removeFromBasket(
            itemId,
            onSuccessCallback);
    });

    describe('categoryView works with cors',
        function ()
        {
            it('with categoryId', function (done)
            {
                var categoryId = 21321885;
                var categoryPath = null;
                var onSuccessCallback = (response) => assert(response, done);
                tracking.categoryView(
                    categoryId,
                    categoryPath,
                    onSuccessCallback);
            });

            it('with categoryPath', function (done)
            {
                var categoryId = null;
                var categoryPath = '21321885';
                var onSuccessCallback = (response) => assert(response, done);
                tracking.categoryView(
                    categoryId,
                    categoryPath,
                    onSuccessCallback);
            });
        });

    it('recomAddToBasket works with cors', function (done)
    {
        var itemId = 21321885;
        var suggester = 'widget';
        var suggestMethod = 'testMethodName';
        var onSuccessCallback = (response) => assert(response, done);
        tracking.recomAddToBasket(
            itemId,
            suggester,
            suggestMethod,
            onSuccessCallback);
    });

    it('order works with cors', function (done)
    {
        tracking.order({
            itemId: 123456,
            qnt: 1,
            price: 2,
            transaction: jasmineHelpers.randomStringValue({ prefix: 'transaction' }),
            email: jasmineHelpers.randomStringValue({ prefix: 'email' }),
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('search works with cors', function (done)
    {
        tracking.search({
            searchPhrase: jasmineHelpers.randomStringValue({ prefix: 'searchPhrase' }),
            email: jasmineHelpers.randomStringValue({ prefix: 'email' }),
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('recomMouseDown works with cors', function (done)
    {
        tracking.recomMouseDown({
            itemId: 123456,
            suggester: jasmineHelpers.randomStringValue({ prefix: 'suggester' }),
            suggestMethod: jasmineHelpers.randomStringValue({ prefix: 'suggestMethod' }),
            rrmbid: jasmineHelpers.randomStringValue({ prefix: 'rrmbid' }),
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('recomTrack works with cors', function (done)
    {
        tracking.recomTrack({
            suggestMethod: jasmineHelpers.randomStringValue({ prefix: 'suggestMethod' }),
            recomms: '123,456,788',
            to: jasmineHelpers.randomStringValue({ prefix: 'to' }),
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('viewSubscriptionForm works with cors', function (done)
    {
        tracking.viewSubscriptionForm({
            isFirstView: true,
            requestType: jasmineHelpers.randomStringValue({ prefix: 'requestType' }),
            onSuccessCallback: (response) => assert(response, done)
        });
    });

    it('mailRequest works with cors', function (done)
    {
        var sut = createTracking({origin: domain, callback: response => assert(response, done)});
        var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';
        var session = '59a00b843329f319dcac6fa6';
        var requestType = 'Viewed';
        var productIds = [1, 2, 4, 8];
        var isAgreedToReceiveMarketingMail = true;
        var customData = {
            'd.emailDataProp1': jasmineHelpers.randomStringValue({prefix: 'emailDataProp1'})
        };

        sut.mailRequest(
            email,
            session,
            requestType,
            productIds,
            isAgreedToReceiveMarketingMail,
            customData);
    });

    describe('priceDrop works with CORS', function ()
    {
        it('when list of products are passed',
            function (done)
            {
                var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';
                var products = [{ id: 19234, price: 5.43 }];

                var sut = createTracking({origin: domain, callback: response => assert(response, done)});
                sut.priceDrop(email, products);
            });

        it('when single product is passed',
            function (done)
            {
                var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';
                var product = { id: 19234, price: 5.43 };

                var sut = createTracking({origin: domain, callback: response => assert(response, done)});
                sut.priceDrop(email, product);
            });
    });

    it('emailClick works with CORS',
        function (done)
        {
            var mailTrackingId = '59a00b843329f319dcac6fa6';
            var params = {};

            var sut = createTracking({origin: domain, callback: response => assert(response, done)});
            sut.emailClick(mailTrackingId, params);
        }
    );

    it('backInStock works with CORS',
        function (done)
        {
            var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';
            var itemId = jasmineHelpers.randomInt();

            var sut = createTracking({origin: domain, callback: response => assert(response, done)});
            sut.backInStock(email, itemId);
        }
    );

    it('welcomeSequence works with CORS',
        function (done)
        {
            var email = jasmineHelpers.randomStringValue({prefix: 'email'}) + '@tests.retailrocket.ru';

            var sut = createTracking({origin: domain, callback: response => assert(response, done)});
            sut.welcomeSequence(email);
        }
    );

    it('webPushSubscription works with CORS',
        function (done)
        {
            var endpoint = jasmineHelpers.randomUrl();
            var subscriptionId = endpoint;
            var subscription = {
                endpoint: endpoint,
                expirationTime: null,
                keys: {
                    p256dh: jasmineHelpers.randomStringValue({prefix: 'p256dh_'}),
                    auth: jasmineHelpers.randomStringValue({prefix: 'auth_'})
                }
            };

            var sut = createTracking({origin: domain, callback: response => assert(response, done)});
            sut.webPushSubscription({
                subscriptionId: subscriptionId,
                subscription: subscription,
                onSuccessCallback: (response) => assert(response, done)
            });
        }
    );
});
