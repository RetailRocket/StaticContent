/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.tracking.js');
require('../src/retailrocket/retailrocket.utils.js');

var jasmineHelpers = require('./jasmineHelpers.js');
var noOp = () => ({});

describe('Retail Rocket tracking module', function ()
{
    function createTrackingClientStub()
    {
        return {
            call: jasmine.createSpy('trackingClient.call'),
            subscribe: jasmine.createSpy('trackingClient.subscribe')
        };
    }

    var utils = retailrocket.modules.utils();

    describe('recomAddToBasket', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var itemId = 2374569;
                var suggester = jasmineHelpers.randomStringValue({prefix: 'suggester'});
                var suggestMethod = jasmineHelpers.randomStringValue({prefix: 'suggestMethod'});

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.recomAddToBasket(itemId, suggester, suggestMethod, noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith({
                    eventName: 'recomAddToBasket',
                    method: 'get',
                    id: itemId,
                    params: {
                        suggester: suggester,
                        suggestMethod: suggestMethod
                    },
                    onSuccessCallback: noOp
                });
            });
    });

    describe('categoryView', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var categoryPath = jasmineHelpers.randomStringValue({prefix: 'categoryPath'});
                var categoryId = 124883;

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.categoryView(categoryId, categoryPath, noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'categoryView',
                    method: 'get',
                    id: categoryId,
                    onSuccessCallback: noOp
                }));
            });
    });

    describe('addToBasket', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var itemId = 124883;
                var stockId = jasmineHelpers.randomStringValue({prefix: 'stockId'});

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.addToBasket(itemId, stockId, noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'addToBasket',
                    method: 'get',
                    id: itemId,
                    params: {
                        stockId: stockId
                    },
                    onSuccessCallback: noOp
                }));
            });

        it('calls tracking client and parse stockId as object',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var itemId = jasmineHelpers.randomInt(1, 1000000);
                var stockIdValue = jasmineHelpers.randomStringValue({prefix: 'stockId'});
                var stockId = { stockId: stockIdValue };

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.addToBasket(itemId, stockId, noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'addToBasket',
                    method: 'get',
                    id: itemId,
                    params: {
                        stockId: stockIdValue
                    },
                    onSuccessCallback: noOp
                }));
            });
    });

    describe('removeFromBasket', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var itemId = 1237648;

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.removeFromBasket(itemId, noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'removeFromBasket',
                    method: 'get',
                    id: itemId,
                    onSuccessCallback: noOp
                }));
            });
    });

    describe('setEmail', function ()
    {
        it('calls tracking client with required params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var email = jasmineHelpers.randomStringValue({prefix: 'email'});
                var basket = jasmineHelpers.randomStringValue({prefix: 'basket'});
                var viewed = jasmineHelpers.randomStringValue({prefix: 'viewed'});
                var isAgreedToReceiveMarketingMail = jasmineHelpers.randomBool();

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.setEmail(email, {}, basket, viewed, noOp, isAgreedToReceiveMarketingMail);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    {
                        eventName: 'setEmail',
                        method: 'get',
                        params: jasmine.objectContaining(
                            {
                                email: email,
                                basket: basket,
                                viewed: viewed,
                                isAgreedToReceiveMarketingMail: isAgreedToReceiveMarketingMail
                            }),
                        onSuccessCallback: jasmine.any(Function)
                    });
            }
        );

        it('calls tracking client with optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var emailData = {
                    prop1: 'propValue1',
                    prop2: 'propValue2'
                };

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.setEmail('', emailData, '', '', noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        params: jasmine.objectContaining(
                            {
                                'd.prop1': 'propValue1',
                                'd.prop2': 'propValue2'
                            })
                    }));
            }
        );

        it('set isAgreedToReceiveMarketingMail if has not set',
            function (done)
            {
                var trackingClientStub = createTrackingClientStub();

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.setEmail('', {}, '', '', noOp);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        params: jasmine.objectContaining(
                            {
                                isAgreedToReceiveMarketingMail: true
                            })
                    }));
                done();
            }
        );
    });

    describe('when group view was called', function ()
    {
        it('call cors post with right params', function ()
        {
            var trackingClientStub = createTrackingClientStub();
            var groupId = jasmineHelpers.randomStringValue({prefix: 'groupId'});
            var email = jasmineHelpers.randomStringValue({prefix: 'email'});
            var stockId = jasmineHelpers.randomStringValue({prefix: 'stockId'});
            var recomItemId = jasmineHelpers.randomStringValue({prefix: 'recomItemId'});

            var productIds = [ '1', '2', '3' ];
            var expectedProductIds = [ 1, 2, 3 ];

            var sut = retailrocket.modules.tracking(trackingClientStub);
            sut.groupView({
                groupId: groupId,
                email: email,
                productIds: productIds,
                stockId: stockId,
                recomItemId: recomItemId,
                onSuccessCallback: function ()
                {
                }
            });

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'groupView',
                    method: 'post',
                    params: {
                        email: email,
                        recomItemId: recomItemId,
                        stockId: stockId
                    },
                    data: { productIds: expectedProductIds },
                    onSuccessCallback: jasmine.any(Function)
                })
            );
        });
    });

    describe('when markup rendered was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub = createTrackingClientStub();
            var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
            var blockId = jasmineHelpers.randomStringValue({prefix: 'blockId'});
            var segmentId = jasmineHelpers.randomStringValue({prefix: 'segmentId'});
            var pvid = jasmineHelpers.randomStringValue({prefix: 'pvid'});
            var session = jasmineHelpers.randomStringValue({prefix: 'session'});
            var isMarkupViewedSupported = jasmineHelpers.randomBool();


            var sut = retailrocket.modules.tracking(trackingClientStub);
            sut.markupRendered({
                partnerId: partnerId,
                blockId: blockId,
                segmentId: segmentId,
                pvid: pvid,
                session: session,
                isMarkupViewedSupported: isMarkupViewedSupported
            });

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'markuprendered',
                    params: {
                        blockId: blockId,
                        segmentId: segmentId,
                        pvid: pvid,
                        session: session,
                        isMarkupViewedSupported: isMarkupViewedSupported
                    }
                })
            );
        });
    });

    describe('when view was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub = createTrackingClientStub();
            var options = {
                itemId: Math.random() * 10,
                recomItemId: jasmineHelpers.randomStringValue({prefix: 'recomItemId'}),
                stockId: jasmineHelpers.randomStringValue({prefix: 'stockId'}),
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.view(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'view',
                    method: 'get',
                    id: options.itemId,
                    params: {
                        recomItemId: options.recomItemId,
                        stockId: options.stockId
                    },
                    onSuccessCallback: jasmine.any(Function)
                })
            );
        });
    });

    describe('when order was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub = {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                itemId: Math.random() * 10,
                qnt: Math.random(),
                price: Math.random(),
                transaction: jasmineHelpers.randomStringValue({ prefix: 'transaction' }),
                email: jasmineHelpers.randomStringValue({ prefix: 'email' }),
                contactExternalId: jasmineHelpers.randomStringValue({ prefix: 'contactExternalId' }),
                stockId: jasmineHelpers.randomStringValue({ prefix: 'stockId' }),
                onSuccessCallback: jasmine.any(Function)
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.order(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'order',
                    method: 'get',
                    id: options.itemId,
                    params: {
                        qnt: options.qnt,
                        price: options.price,
                        transaction: options.transaction,
                        contactExternalId: options.contactExternalId,
                        email: options.email,
                        stockId: options.stockId
                    },
                    onSuccessCallback: jasmine.any(Function)
                })
            );
        });
    });

    describe('when search was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub =
            {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                session: jasmineHelpers.randomStringValue({ prefix: 'session' }),
                searchPhrase: jasmineHelpers.randomStringValue({ prefix: 'searchPhrase' }),
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.search(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'search',
                    method: 'get',
                    params: jasmine.objectContaining({
                        searchPhrase: options.searchPhrase
                    }),
                    onSuccessCallback: options.onSuccessCallback
                })
            );
        });
    });

    describe('when recomMouseDown was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub =
            {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                itemId: 12345,
                suggester: jasmineHelpers.randomStringValue({ prefix: 'suggester' }),
                rrmbid: jasmineHelpers.randomStringValue({ prefix: 'rrmbid' }),
                suggestMethod: jasmineHelpers.randomStringValue({ prefix: 'suggestMethod' }),
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.recomMouseDown(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'recomMouseDown',
                    method: 'get',
                    id: options.itemId,
                    params: jasmine.objectContaining({
                        suggester: options.suggester,
                        suggestMethod: options.suggestMethod,
                        rrmbid: options.rrmbid
                    }),
                    onSuccessCallback: jasmine.any(Function)
                })
            );
        });
    });

    describe('when recomTrack was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub =
            {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                suggestMethod: jasmineHelpers.randomStringValue({ prefix: 'suggestMethod' }),
                recomms: '1,2,3',
                to: jasmineHelpers.randomStringValue({ prefix: 'to' }),
                eventParams: {
                    param1: jasmineHelpers.randomStringValue({ prefix: 'x' }),
                    param2: jasmineHelpers.randomStringValue({ prefix: 'x' })
                },
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub, utils);

            sut.recomTrack(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'recomTrack',
                    method: 'get',
                    params: jasmine.objectContaining({
                        suggestMethod: options.suggestMethod,
                        recomms: options.recomms,
                        to: options.recomms,
                        param1: options.eventParams.param1,
                        param2: options.eventParams.param2
                    }),
                    onSuccessCallback: options.onSuccessCallback
                })
            );
        });
    });

    describe('when viewSubscriptionForm was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub =
            {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                isFirstView: true,
                requestType: jasmineHelpers.randomStringValue({ prefix: 'requestType' }),
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.viewSubscriptionForm(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                {
                    eventName: 'viewsubscriptionform',
                    method: 'get',
                    params: {
                        isFirstView: options.isFirstView,
                        requestType: options.requestType
                    },
                    onSuccessCallback: options.onSuccessCallback
                }
            );
        });
    });

    describe('when markupViewed was called', function ()
    {
        it('call cors get with right params', function ()
        {
            var trackingClientStub =
            {
                call: jasmine.createSpy('trackingClient.call')
            };

            var options = {
                blockId: jasmineHelpers.randomStringValue({prefix: 'blockId'}),
                partnerId: jasmineHelpers.randomStringValue({prefix: 'partnerId'}),
                segmentId: jasmineHelpers.randomStringValue({prefix: 'segmentId'}),
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules.tracking(trackingClientStub);

            sut.markupViewed(options);

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                {
                    eventName: 'markupViewed',
                    method: 'get',
                    params: {
                        blockId: options.blockId,
                        segmentId: options.segmentId
                    },
                    onSuccessCallback: options.onSuccessCallback
                }
            );
        });
    });

    describe('mailRequest', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var email = jasmineHelpers.randomStringValue({prefix: 'email'});
                var session = jasmineHelpers.randomStringValue({prefix: 'session'});
                var requestType = jasmineHelpers.randomStringValue({prefix: 'requestType'});
                var productIds = jasmineHelpers.array(jasmineHelpers.randomInt);
                var isAgreedToReceiveMarketingMail = jasmineHelpers.randomStringValue({prefix: 'isAgreedToReceiveMarketingMail'});
                var emailData = {
                    prop1: 'propValue1',
                    prop2: 'propValue2'
                };

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.mailRequest(email, session, requestType, productIds, isAgreedToReceiveMarketingMail, emailData);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        eventName: 'mailrequest',
                        method: 'get',
                        params: jasmine.objectContaining(
                            {
                                email: email,
                                session: session,
                                requestType: requestType,
                                productIds: productIds,
                                isAgreedToReceiveMarketingMail: isAgreedToReceiveMarketingMail,
                                'd.prop1': 'propValue1',
                                'd.prop2': 'propValue2'
                            })
                    }));
            }
        );

        it('calls setEmail with isAgreedToReceiveMarketingMail and emailData',
            function (done)
            {
                var trackingClientStub = createTrackingClientStub();
                var email = jasmineHelpers.randomStringValue({prefix: 'email'});
                var isAgreedToReceiveMarketingMail = jasmineHelpers.randomBool();
                var customData = {
                    prop1: 'propValue1',
                    prop2: 'propValue2'
                };

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.mailRequest(email, '', '', '', isAgreedToReceiveMarketingMail, customData);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        eventName: 'setEmail',
                        method: 'get',
                        params: jasmine.objectContaining(
                            {
                                isAgreedToReceiveMarketingMail: isAgreedToReceiveMarketingMail,
                                'd.prop1': 'propValue1',
                                'd.prop2': 'propValue2'
                            })
                    }));
                done();
            });
    });

    describe('priceDrop', function ()
    {
        it('calls tracking client when single product passed',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var email = jasmineHelpers.randomStringValue({prefix: 'email'});
                var productOrProductList = { id: '12834097', price: 3.5 };

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.priceDrop(email, productOrProductList);

                expect(trackingClientStub.subscribe).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'pricedrop',
                    method: 'get',
                    params: {
                        email,
                        'items[0].ItemId': '12834097',
                        'items[0].Price': 3.5
                    }
                }));
            });

        it('calls tracking client when multiple products passed',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var email = jasmineHelpers.randomStringValue({prefix: 'email'});
                var productOrProductList =
                    [{
                        id: '12834097',
                        price: 3.5
                    },
                    {
                        id: '22987503',
                        price: 6.5
                    }];

                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.priceDrop(email, productOrProductList);

                expect(trackingClientStub.subscribe).toHaveBeenCalledWith(jasmine.objectContaining({
                    eventName: 'pricedrop',
                    method: 'get',
                    params: {
                        email,
                        'items[0].ItemId': '12834097',
                        'items[0].Price': 3.5,
                        'items[1].ItemId': '22987503',
                        'items[1].Price': 6.5
                    }
                }));
            });
    });

    describe('emailClick', function ()
    {
        it('calls tracking client with required and optional params',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var mailTrackingId = jasmineHelpers.randomStringValue({ prefix: 'mailTrackingId'});
                var params = jasmineHelpers.randomObject();
                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                sut.emailClick(mailTrackingId, params);

                expect(trackingClientStub.call).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        eventName: 'emailclick',
                        method: 'get',
                        params: params,
                        id: mailTrackingId
                    }));
            }
        );
    });

    describe('backInStock', function ()
    {
        it('calls tracking client with required',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                var email = jasmineHelpers.randomStringValue({ prefix: 'email'});
                var itemId = jasmineHelpers.randomInt();

                sut.backInStock(email, itemId);

                expect(trackingClientStub.subscribe).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        eventName: 'backinstock',
                        method: 'get',
                        params: {
                            email: email,
                            itemId: itemId
                        }
                    }));
            }
        );
    });

    describe('backInStock', function ()
    {
        it('calls tracking client with required',
            function ()
            {
                var trackingClientStub = createTrackingClientStub();
                var sut = retailrocket.modules.tracking(trackingClientStub, utils);

                var email = jasmineHelpers.randomStringValue({ prefix: 'email'});

                sut.welcomeSequence(email);

                expect(trackingClientStub.subscribe).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        eventName: 'welcomesequence',
                        method: 'get',
                        params: {
                            email: email
                        }
                    }));
            }
        );
    });

    describe('when web push subscription was called', function ()
    {
        it('call cors post with right params', function ()
        {
            var trackingClientStub = createTrackingClientStub();
            var subscription = {
                endpoint: jasmineHelpers.randomStringValue({prefix: 'endpoint_'}),
                expirationTime: null,
                keys: {
                    p256dh: jasmineHelpers.randomStringValue({prefix: 'p256dh_'}),
                    auth: jasmineHelpers.randomStringValue({prefix: 'auth_'})
                }
            };

            var subscriptionId = subscription.endpoint;

            var sut = retailrocket.modules.tracking(trackingClientStub);
            sut.webPushSubscription({
                subscriptionId: subscriptionId,
                subscription: subscription,
                onSuccessCallback: function ()
                {
                }
            });

            expect(trackingClientStub.call).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    eventName: 'webpushsubscription',
                    method: 'post',
                    params: {
                        subscriptionId: subscriptionId
                    },
                    data: subscription,
                    onSuccessCallback: jasmine.any(Function)
                })
            );
        });
    });
});
