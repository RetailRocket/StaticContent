/* global retailrocket, rrLibrary*/
(function ()
{
    'use strict';

    describe('LastTenItems module', function ()
    {
        var cookiesStub = {
            setOnRootLastViewedCookie: function () { },// eslint-disable-line
            getLastViewedCookie: function () { },// eslint-disable-line
            areCookiesEnabled: function () { return true; },// eslint-disable-line
            cleanOnRootLastViewedCookie: function () {},// eslint-disable-line
            getLastAddedBasketCookie: function () {},// eslint-disable-line
            setOnRootLastAddedBasketCookie: function () {},// eslint-disable-line
            cleanOnRootLastAddedBasketCookie: function () {}// eslint-disable-line
        };

        var utilsStub = {
            isRobot: function ()
            {
                return false;
            }
        };

        var testItemId = 12345;
        var itemIds = [];
        var itemIdsString = '';

        var rrApi = null;

        beforeEach(function ()
        {
            spyOn(cookiesStub, 'getLastViewedCookie');
            spyOn(cookiesStub, 'setOnRootLastViewedCookie');
            spyOn(cookiesStub, 'cleanOnRootLastViewedCookie');

            spyOn(cookiesStub, 'getLastAddedBasketCookie');
            spyOn(cookiesStub, 'setOnRootLastAddedBasketCookie');
            spyOn(cookiesStub, 'cleanOnRootLastAddedBasketCookie');

            itemIds = [];
            itemIds.push(testItemId);
            itemIdsString = itemIds.join(',');

            var dummy = {
                subscribe: function (fn)
                {
                    fn();
                }
            };

            rrApi = {
                _initialize: {
                    subscribe: function (fn)
                    {
                        fn({});
                    }
                },
                view: dummy,
                addToBasket: dummy,
                recomAddToCart: dummy,
                order: dummy
            };
        });

        describe('view',
            function ()
            {
                it('use lastViewedCookie', function ()
                {
                    rrApi.view = {
                        subscribe: function (fn)
                        {
                            fn(testItemId);
                        }
                    };

                    retailrocket.modules.lastTenItems(cookiesStub, utilsStub, rrApi);

                    expect(cookiesStub.getLastViewedCookie).toHaveBeenCalled();
                    expect(cookiesStub.setOnRootLastViewedCookie).toHaveBeenCalledWith(itemIdsString);
                });
            });

        describe('addToBasket',
            function ()
            {
                it('use lastAddedBasketCookie', function ()
                {
                    rrApi.addToBasket = {
                        subscribe: function (fn)
                        {
                            fn(testItemId);
                        }
                    };

                    retailrocket.modules.lastTenItems(cookiesStub, utilsStub, rrApi);

                    expect(cookiesStub.setOnRootLastAddedBasketCookie).toHaveBeenCalledWith(itemIdsString);
                    expect(cookiesStub.getLastAddedBasketCookie).toHaveBeenCalledWith();
                });
            });

        describe('recomAddToCart',
            function ()
            {
                it('use lastAddedBasketCookie', function ()
                {
                    rrApi.recomAddToCart = {
                        subscribe: function (fn)
                        {
                            fn(testItemId);
                        }
                    };

                    retailrocket.modules.lastTenItems(cookiesStub, utilsStub, rrApi);

                    expect(cookiesStub.setOnRootLastAddedBasketCookie).toHaveBeenCalledWith(itemIdsString);
                    expect(cookiesStub.getLastAddedBasketCookie).toHaveBeenCalledWith();
                });
            });

        describe('order',
            function ()
            {
                it('use lastViewedCookie', function ()
                {
                    retailrocket.modules.lastTenItems(cookiesStub, utilsStub, rrApi);

                    expect(cookiesStub.cleanOnRootLastViewedCookie).toHaveBeenCalledWith();
                });

                it('use lastAddedBasketCookie', function ()
                {
                    retailrocket.modules.lastTenItems(cookiesStub, utilsStub, rrApi);

                    expect(cookiesStub.cleanOnRootLastAddedBasketCookie).toHaveBeenCalledWith();
                });
            });
    });
})();
