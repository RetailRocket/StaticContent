/* global retailrocket, rrLibrary, rrApiStub,*/
(function ()
{
    var noOp = function ()
    {};

    describe('EventsApiHandlers Module', function ()
    {
        var lastAddedBasketCookie = 'alksflaksdjfl09283745';
        var lastViewedCookie = 'askjdfl3475923';
        var partnerId = '993847564839203948576';

        var apiStub = {
            getPartnerId: function ()
            {
                return 'fakePartnerId';
            },
            getSessionId: function ()
            {
                return 'fakeSessionId';
            }
        };

        var cookiesStub = {
            areCookiesEnabled: function ()
            {
                return true;
            },

            setSubFormLastViewCookie: noOp,

            getAddToBasketItemIdCookie: noOp,
            getLastAddedBasketCookie: noOp,
            getLastViewedCookie: noOp,
            getRecomItemIdCookie: noOp,
            getRecomMethodNameCookie: noOp,
            getRecomSuggesterCookie: noOp,
            getViewItemIdCookie: noOp,
            getSubFormLastViewCookie: noOp,
            getRecomAddToCartItemIdCookie: noOp,
            getRecomAddToCartMethodNameCookie: noOp,
            getRecomAddToCartSuggesterCookie: noOp,

            setOnRootViewItemIdCookie: noOp,
            setOnRootAddToBasketItemIdCookie: noOp,
            setOnRootRecomAddToCartItemIdCookie: noOp,
            setOnRootRecomAddToCartMethodNameCookie: noOp,
            setOnRootRecomAddToCartSuggesterCookie: noOp,
            setOnRootRecomItemIdCookie: noOp,
            setOnRootRecomMethodNameCookie: noOp,
            setOnRootRecomSuggesterCookie: noOp,

            cleanOnRootLastAddedBasketCookie: noOp,
            cleanOnRootLastViewedCookie: noOp,
            cleanOnRootAddToBasketItemIdCookie: noOp,
            cleanOnRootViewItemIdCookie: noOp,
            cleanOnRootRecomAddToCartItemIdCookie: noOp,
            cleanOnRootRecomAddToCartMethodNameCookie: noOp,
            cleanOnRootRecomAddToCartSuggesterCookie: noOp,
            cleanOnRootRecomItemIdCookie: noOp,
            cleanOnRootRecomMethodNameCookie: noOp,
            cleanOnRootRecomSuggesterCookie: noOp
        };

        var utilsStub = {
            isRobot: function ()
            {
                return false;
            },
            convertUrHostnameToASCII: function ()
            {},
            getParentsAttributeValueByEvent: function ()
            {
                return 'fakeAttribute';
            }
        };

        var trackingStub = {
            pageView: noOp,
            view: noOp,
            order: noOp,
            search: noOp,
            recomMouseDown: noOp,
            recomTrack: noOp,
            viewSubscriptionForm: noOp,
            setEmail: noOp,
            addToBasket: noOp,
            removeFromBasket: noOp,
            categoryView: noOp,
            recomAddToBasket: noOp,
            mailRequest: noOp,
            priceDrop: noOp,
            backInStock: noOp,
            welcomeSequence: noOp
        };

        beforeAll(function ()
        {
            spyOn(apiStub, 'getPartnerId').and.callFake(function ()
            {
                return partnerId;
            });

            spyOn(trackingStub, 'view');
            spyOn(trackingStub, 'setEmail');
            spyOn(trackingStub, 'addToBasket');
            spyOn(trackingStub, 'removeFromBasket');
            spyOn(trackingStub, 'categoryView');
            spyOn(trackingStub, 'recomAddToBasket');
            spyOn(trackingStub, 'order');
            spyOn(trackingStub, 'search');
            spyOn(trackingStub, 'recomMouseDown');
            spyOn(trackingStub, 'recomTrack');
            spyOn(trackingStub, 'viewSubscriptionForm');
            spyOn(trackingStub, 'mailRequest');
            spyOn(trackingStub, 'priceDrop');
            spyOn(trackingStub, 'backInStock');
            spyOn(trackingStub, 'welcomeSequence');

            spyOn(cookiesStub, 'setSubFormLastViewCookie');

            spyOn(cookiesStub, 'getRecomItemIdCookie').and.returnValue(1234567);
            spyOn(cookiesStub, 'getRecomMethodNameCookie');
            spyOn(cookiesStub, 'getLastAddedBasketCookie').and.returnValue(lastAddedBasketCookie);
            spyOn(cookiesStub, 'getLastViewedCookie').and.returnValue(lastViewedCookie);
            spyOn(cookiesStub, 'getSubFormLastViewCookie');

            spyOn(cookiesStub, 'setOnRootViewItemIdCookie');
            spyOn(cookiesStub, 'setOnRootAddToBasketItemIdCookie');
            spyOn(cookiesStub, 'setOnRootRecomAddToCartItemIdCookie');
            spyOn(cookiesStub, 'setOnRootRecomAddToCartMethodNameCookie');
            spyOn(cookiesStub, 'setOnRootRecomAddToCartSuggesterCookie');
            spyOn(cookiesStub, 'setOnRootRecomItemIdCookie');
            spyOn(cookiesStub, 'setOnRootRecomMethodNameCookie');
            spyOn(cookiesStub, 'setOnRootRecomSuggesterCookie');

            spyOn(cookiesStub, 'cleanOnRootLastAddedBasketCookie');
            spyOn(cookiesStub, 'cleanOnRootLastViewedCookie');
            spyOn(cookiesStub, 'cleanOnRootAddToBasketItemIdCookie');
            spyOn(cookiesStub, 'cleanOnRootViewItemIdCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomAddToCartItemIdCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomAddToCartMethodNameCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomAddToCartSuggesterCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomItemIdCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomMethodNameCookie');
            spyOn(cookiesStub, 'cleanOnRootRecomSuggesterCookie');

            retailrocket.modules.eventsApiHandlers(
                cookiesStub,
                apiStub,
                utilsStub,
                rrApiStub,
                rrLibrary,
                trackingStub);
        });

        describe('on welcome sequence event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var email = 'email@test.retailrocket.ru';
                    rrApiStub.welcomeSequence(email);
                    expect(trackingStub.welcomeSequence).toHaveBeenCalledWith(email);
                });
        });

        describe('on back in stock event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var email = 'email@test.retailrocket.ru';
                    var itemId = 192874;
                    rrApiStub.subscribeOnItemBackInStock(email, itemId);
                    expect(trackingStub.backInStock).toHaveBeenCalledWith(email, itemId);
                });
        });

        describe('on price drop event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var email = 'email@test.retailrocket.ru';
                    var products = [{id: 3, price: 3.9 }, {id: 4, price: 1.9 }];
                    rrApiStub.subscribeOnPriceDrop(email, products);
                    expect(trackingStub.priceDrop).toHaveBeenCalledWith(email, products);
                });
        });

        describe('on mail request event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var email = 'email@test.retailrocket.ru';
                    var session = 'testSession';
                    var requestType = 'testRequestType';
                    var productIds = [1, 2, 5, 111];
                    var isAgreedToReceiveMarketingMail = false;
                    var customData = {anyFieldName: 'anyFieldValue'};

                    rrApiStub.mailRequest(
                        email,
                        session,
                        requestType,
                        productIds,
                        isAgreedToReceiveMarketingMail,
                        customData);

                    expect(trackingStub.mailRequest).toHaveBeenCalledWith(
                        email,
                        session,
                        requestType,
                        productIds,
                        isAgreedToReceiveMarketingMail,
                        customData
                    );
                }
            );
        });

        describe('on recomAddToCart event', function ()
        {
            var itemId = 123456645;

            it('make tracking call with object params & methodName',
                function ()
                {
                    var suggester = 'testSuggester';
                    var methodName = 'testSuggestMethod';
                    var params = { methodName: methodName, suggester: suggester };

                    rrApiStub.recomAddToCart(itemId, params);

                    expect(trackingStub.recomAddToBasket).toHaveBeenCalledWith(
                        itemId,
                        suggester,
                        methodName,
                        rrApiStub.recomAddToCartCompleted
                    );
                }
            );

            it('make tracking call with object params',
                function ()
                {
                    var suggester = 'testSuggester';
                    var suggestMethod = 'testSuggestMethod';
                    var params = { suggestMethod: suggestMethod, suggester: suggester };

                    rrApiStub.recomAddToCart(itemId, params);

                    expect(trackingStub.recomAddToBasket).toHaveBeenCalledWith(
                        itemId,
                        suggester,
                        suggestMethod,
                        rrApiStub.recomAddToCartCompleted
                    );
                }
            );

            it('make tracking call with string params',
                function ()
                {
                    var suggester = 'widget';
                    var params = 'test';
                    var suggestMethod = params;

                    rrApiStub.recomAddToCart(itemId, params);

                    expect(trackingStub.recomAddToBasket).toHaveBeenCalledWith(
                        itemId,
                        suggester,
                        suggestMethod,
                        rrApiStub.recomAddToCartCompleted
                    );
                }
            );

            it('make tracking call without params',
                function ()
                {
                    var suggestMethod;
                    var suggester = 'widget';
                    rrApiStub.recomAddToCart(itemId);

                    expect(trackingStub.recomAddToBasket).toHaveBeenCalledWith(
                        itemId,
                        suggester,
                        suggestMethod,
                        rrApiStub.recomAddToCartCompleted
                    );
                }
            );
        });

        describe('On category view event', function ()
        {
            var onSuccessCallback = rrApiStub.categoryViewCompleted;

            describe('with category id', function ()
            {
                it('call categoryView with categoryId', function ()
                {
                    var categoryId = '98462012';
                    var categoryPath = null;
                    rrApiStub.categoryView(categoryId);
                    expect(trackingStub.categoryView).toHaveBeenCalledWith(
                        categoryId,
                        categoryPath,
                        onSuccessCallback
                    );
                });
            });

            describe('without category id', function ()
            {
                it('call categoryView with categoryPath', function ()
                {
                    var categoryId = null;
                    var categoryPath = 'Path/To/Category';

                    rrApiStub.categoryView(categoryPath);

                    expect(trackingStub.categoryView).toHaveBeenCalledWith(
                        categoryId,
                        categoryPath,
                        onSuccessCallback
                    );
                });
            });
        });

        describe('on set email event', function ()
        {
            beforeEach(function ()
            {
                jasmine.clock().install();
            });

            afterEach(function ()
            {
                jasmine.clock().uninstall();
            });

            it('make tracking call with right params',
                function ()
                {
                    rrApiStub.setEmailCompleted = noOp;
                    var email = 'email@test.retailrocket.ru';
                    var emailData = {anyFieldName: 'anyFieldValue'};

                    rrApiStub.setEmail(email, emailData);

                    jasmine.clock().tick(101);

                    expect(trackingStub.setEmail).toHaveBeenCalledWith(
                        email,
                        emailData,
                        lastAddedBasketCookie,
                        lastViewedCookie,
                        rrApiStub.setEmailCompleted
                    );
                }
            );
        });

        describe('on addToBasket event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var itemId = 123456645;
                    var stockId = 'testStockId';

                    rrApiStub.addToBasket(itemId, stockId);

                    expect(trackingStub.addToBasket).toHaveBeenCalledWith(
                        itemId,
                        stockId,
                        rrApiStub.addToBasketCompleted
                    );
                }
            );
        });

        describe('on removeFromBasket event', function ()
        {
            it('make tracking call with right params',
                function ()
                {
                    var itemId = 123456645;

                    rrApiStub.removeFromBasket(itemId);

                    expect(trackingStub.removeFromBasket).toHaveBeenCalledWith(
                        itemId,
                        rrApiStub.removeFromBasketCompleted
                    );
                }
            );
        });

        describe('On order event', function ()
        {
            it('call tracking', function ()
            {
                var params = {
                    items: [
                        {
                            id: 1,
                            qnt: '1',
                            price: '1'
                        },
                        {
                            id: 2,
                            qnt: '2',
                            price: '2'
                        }
                    ],
                    transaction: 'testTransaction',
                    stockId: 'testStockId'
                };

                rrApiStub._empty = function ()
                {
                };
                rrApiStub.orderCompleted = function ()
                {
                };

                rrApiStub.order(params);

                expect(trackingStub.order).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: 1,
                        qnt: 1,
                        price: 1,
                        transaction: 'testTransaction',
                        stockId: 'testStockId',
                        onSuccessCallback: jasmine.any(Function)
                    })
                );

                expect(trackingStub.order).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: 2,
                        qnt: 2,
                        price: 2,
                        transaction: 'testTransaction',
                        stockId: 'testStockId',
                        onSuccessCallback: rrApiStub.orderCompleted
                    })
                );
            });

            it('aggregates items by id', function ()
            {
                var itemId = 1;
                var firstItemPrice = '1';
                var lastItemPrice = '2';
                var params = {
                    items: [
                        {
                            id: itemId,
                            qnt: '2',
                            price: firstItemPrice
                        },
                        {
                            id: itemId,
                            qnt: '3',
                            price: lastItemPrice
                        }
                    ],
                    transaction: 'testTransaction',
                    stockId: 'testStockId'
                };

                rrApiStub._empty = function ()
                {
                };
                rrApiStub.orderCompleted = function ()
                {
                };

                rrApiStub.order(params);

                expect(trackingStub.order).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: itemId,
                        qnt: 5,
                        price: parseFloat(lastItemPrice),
                        transaction: 'testTransaction',
                        stockId: 'testStockId',
                        onSuccessCallback: jasmine.any(Function)
                    })
                );
            });
        });

        describe('On search event', function ()
        {
            it('call tracking', function ()
            {
                rrApiStub.search('testSearchPhrase', { testParam: 'testParam' });

                expect(trackingStub.search).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        searchPhrase: 'testSearchPhrase',
                        onSuccessCallback: jasmine.any(Function)
                    })
                );
            });
        });

        describe('On recomMouseDown event', function ()
        {
            it('call tracking with methodName', function ()
            {
                var eventParams = {
                    suggester: 'suggesterTest',
                    methodName: 'methodNameTest'
                };

                rrApiStub.recomMouseDown(12345, eventParams);

                expect(trackingStub.recomMouseDown).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: 12345,
                        suggester: eventParams.suggester,
                        suggestMethod: eventParams.methodName,
                        rrmbid: utilsStub.getParentsAttributeValueByEvent()
                    })
                );
            });

            it('call tracking with suggestMethod', function ()
            {
                var eventParams = {
                    suggester: 'suggesterTest',
                    suggestMethod: 'suggestMethodTest'
                };

                rrApiStub.recomMouseDown(12345, eventParams);

                expect(trackingStub.recomMouseDown).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: 12345,
                        suggester: eventParams.suggester,
                        suggestMethod: eventParams.suggestMethod,
                        rrmbid: utilsStub.getParentsAttributeValueByEvent()
                    })
                );
            });

            it('prefer method name', function ()
            {
                var eventParams = {
                    suggester: 'suggesterTest',
                    suggestMethod: 'suggestMethodTest',
                    methodName: 'methodNameTest'
                };

                rrApiStub.recomMouseDown(12345, eventParams);

                expect(trackingStub.recomMouseDown).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        itemId: 12345,
                        suggester: eventParams.suggester,
                        suggestMethod: eventParams.methodName,
                        rrmbid: utilsStub.getParentsAttributeValueByEvent()
                    })
                );
            });
        });

        describe('On recomTrack event', function ()
        {
            it('call tracking', function ()
            {
                var eventParams = {
                    testParam1: 'testParam1',
                    testParam2: 'testParam2'
                };

                rrApiStub.recomTrack(
                    'recomScenarioNameTest',
                    'toTest',
                    [1, 2, 3],
                    eventParams);

                expect(trackingStub.recomTrack).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        suggestMethod: 'recomScenarioNameTest',
                        to: 'toTest',
                        recomms: [1, 2, 3].join(','),
                        onSuccessCallback: rrApiStub.recomTrackCompleted,
                        eventParams: eventParams
                    })
                );
            });
        });

        describe('On viewsubscriptionform event', function ()
        {
            it('call tracking', function ()
            {
                rrApiStub.mailRequestFormView({ requestType: 'Viewed' });

                expect(trackingStub.viewSubscriptionForm).toHaveBeenCalledWith(
                    {
                        // eslint-disable-next-line no-eq-null, eqeqeq
                        isFirstView: cookiesStub.getSubFormLastViewCookie() == null,
                        requestType: 'Viewed',
                        onSuccessCallback: jasmine.any(Function)
                    }
                );
            });
        });

        describe('cookies tests', function ()
        {
            describe('On view event', function ()
            {
                var itemId = 12432;
                var viewParams = {};

                it('set viewItemIdCookieName',
                    function ()
                    {
                        rrApiStub.view(itemId, viewParams);
                        expect(cookiesStub.setOnRootViewItemIdCookie).toHaveBeenCalledWith(itemId);
                    });

                it('get recomItemIdCookie',
                    function ()
                    {
                        rrApiStub.view(itemId, viewParams);
                        expect(cookiesStub.getRecomItemIdCookie).toHaveBeenCalled();
                    });

                it('get recomMethodNameCookie',
                    function ()
                    {
                        rrApiStub.view(itemId, viewParams);
                        expect(cookiesStub.getRecomMethodNameCookie).toHaveBeenCalled();
                    });
            });

            describe('On addToBasket event', function ()
            {
                var itemId = 12432;
                var addToBasketParams = {};

                it('set addToBasketItemIdCookie',
                    function ()
                    {
                        rrApiStub.addToBasket(itemId, addToBasketParams);
                        expect(cookiesStub.setOnRootAddToBasketItemIdCookie).toHaveBeenCalledWith(itemId);
                    });

                it('clean addToBasketItemIdCookie',
                    function ()
                    {
                        rrApiStub.addToBasketCompleted(itemId, addToBasketParams);
                        expect(cookiesStub.cleanOnRootAddToBasketItemIdCookie).toHaveBeenCalled();
                    });
            });

            describe('On recomAddToCart event', function ()
            {
                var itemId = 12432;

                describe('Clean cookies', function ()
                {
                    var recomAddToCartParams = {};

                    it('clean cookies',
                        function ()
                        {
                            rrApiStub.recomAddToCartCompleted(itemId, recomAddToCartParams);
                            expect(cookiesStub.cleanOnRootRecomAddToCartItemIdCookie).toHaveBeenCalled();
                            expect(cookiesStub.cleanOnRootRecomAddToCartMethodNameCookie).toHaveBeenCalled();
                            expect(cookiesStub.cleanOnRootRecomAddToCartSuggesterCookie).toHaveBeenCalled();
                        });
                });

                describe('With methodName', function ()
                {
                    var recomAddToCartParams = {
                        methodName: 'methodName_test',
                        suggester: 'methodName_suggesterTest'
                    };

                    it('setOnRoot cookies',
                        function ()
                        {
                            rrApiStub.recomAddToCart(itemId, recomAddToCartParams);
                            expect(cookiesStub.setOnRootRecomAddToCartItemIdCookie)
                                .toHaveBeenCalledWith(itemId);
                            expect(cookiesStub.setOnRootRecomAddToCartMethodNameCookie)
                                .toHaveBeenCalledWith(recomAddToCartParams.methodName);
                            expect(cookiesStub.setOnRootRecomAddToCartSuggesterCookie)
                                .toHaveBeenCalledWith(recomAddToCartParams.suggester);
                        });
                });

                describe('With suggestMethod', function ()
                {
                    var recomAddToCartParams = {
                        suggestMethod: 'suggestMethod_test',
                        suggester: 'suggestMethod_suggesterTest'
                    };

                    it('setOnRoot cookies',
                        function ()
                        {
                            rrApiStub.recomAddToCart(itemId, recomAddToCartParams);
                            expect(cookiesStub.setOnRootRecomAddToCartItemIdCookie)
                                .toHaveBeenCalledWith(itemId);
                            expect(cookiesStub.setOnRootRecomAddToCartMethodNameCookie)
                                .toHaveBeenCalledWith(recomAddToCartParams.suggestMethod);
                            expect(cookiesStub.setOnRootRecomAddToCartSuggesterCookie)
                                .toHaveBeenCalledWith(recomAddToCartParams.suggester);
                        });
                });
            });

            describe('On recomMouseDown event', function ()
            {
                var itemId = 12432;

                describe('Clean cookies', function ()
                {
                    var recomMouseDownParams = {};
                    it('clean cookies',
                        function ()
                        {
                            rrApiStub.recomMouseDownCompleted(itemId, recomMouseDownParams);
                            expect(cookiesStub.cleanOnRootRecomMethodNameCookie).toHaveBeenCalled();
                            expect(cookiesStub.cleanOnRootRecomSuggesterCookie).toHaveBeenCalled();
                        });
                });

                describe('With methodName', function ()
                {
                    var recomMouseDownParams = {
                        methodName: 'methodName_test',
                        suggester: 'methodName_suggesterTest'
                    };

                    it('setOnRoot cookies',
                        function ()
                        {
                            rrApiStub.recomMouseDown(itemId, recomMouseDownParams);
                            expect(cookiesStub.setOnRootRecomItemIdCookie).toHaveBeenCalledWith(itemId);
                            expect(cookiesStub.setOnRootRecomMethodNameCookie).toHaveBeenCalledWith(recomMouseDownParams.methodName);
                            expect(cookiesStub.setOnRootRecomSuggesterCookie).toHaveBeenCalledWith(recomMouseDownParams.suggester);
                        });
                });

                describe('With suggestMethod', function ()
                {
                    var recomMouseDownParams = {
                        suggestMethod: 'suggestMethod_test',
                        suggester: 'suggestMethod_suggesterTest'
                    };

                    it('setOnRoot cookies',
                        function ()
                        {
                            rrApiStub.recomMouseDown(itemId, recomMouseDownParams);
                            expect(cookiesStub.setOnRootRecomItemIdCookie).toHaveBeenCalledWith(itemId);
                            expect(cookiesStub.setOnRootRecomMethodNameCookie).toHaveBeenCalledWith(recomMouseDownParams.suggestMethod);
                            expect(cookiesStub.setOnRootRecomSuggesterCookie).toHaveBeenCalledWith(recomMouseDownParams.suggester);
                        });
                });
            });

            describe('On setEmail event', function ()
            {
                var email = 'test.retailrocket@ru';
                var emailData = {};

                beforeEach(function ()
                {
                    jasmine.clock().install();
                });

                afterEach(function ()
                {
                    jasmine.clock().uninstall();
                });

                it('get cookies',
                    function ()
                    {
                        rrApiStub.setEmail(email, emailData);

                        jasmine.clock().tick(101);

                        expect(cookiesStub.getLastAddedBasketCookie).toHaveBeenCalled();
                        expect(cookiesStub.getLastViewedCookie).toHaveBeenCalled();
                    });

                it('clean cookies',
                    function ()
                    {
                        rrApiStub.setEmail(email, emailData);

                        jasmine.clock().tick(101);

                        expect(cookiesStub.cleanOnRootLastAddedBasketCookie).toHaveBeenCalled();
                        expect(cookiesStub.cleanOnRootLastViewedCookie).toHaveBeenCalled();
                    });
            });

            describe('On mailRequestFormView event', function ()
            {
                var requestParams = {};

                it('get subFormLastViewCookie',
                    function ()
                    {
                        rrApiStub.mailRequestFormView(requestParams);
                        expect(cookiesStub.getSubFormLastViewCookie).toHaveBeenCalled();
                    });

                it('set subFormLastViewCookie',
                    function ()
                    {
                        rrApiStub.mailRequestFormView(requestParams);
                        expect(cookiesStub.setSubFormLastViewCookie).toHaveBeenCalled();
                    });
            });

            describe('On view event', function ()
            {
                var itemId = 12432;
                var params = {
                    stockId: 1
                };

                it('set setOnRootViewItemIdCookie',
                    function ()
                    {
                        rrApiStub.view(itemId, params);
                        expect(cookiesStub.setOnRootViewItemIdCookie).toHaveBeenCalledWith(itemId);
                    });

                it('call tracking with right params',
                    function ()
                    {
                        var recomItemId = 123;

                        rrApiStub.viewCompleted  = function ()
                        {
                        };
                        cookiesStub.getRecomItemIdCookie = function ()
                        {
                            return recomItemId;
                        };
                        rrApiStub.view(itemId, params);
                        expect(trackingStub.view).toHaveBeenCalledWith({
                            itemId: itemId,
                            recomItemId: recomItemId,
                            stockId: params.stockId,
                            onSuccessCallback: rrApiStub.viewCompleted
                        });
                    });
            });
        });
    });
})();
