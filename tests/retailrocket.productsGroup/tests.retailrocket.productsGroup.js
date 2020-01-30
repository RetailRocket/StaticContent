/* global retailrocket*/
(function ()
{
    var groupId = 118934958;
    var stockId = 120381203914;
    var signature = 'AS:DLNFEEJWHGP';
    var cdnurlsStub = {
        cdn: ''
    };

    var apiStub = {
        getPartnerId: function ()
        {
            return 'ANYPARTNERID';
        },
        getSessionId: function ()
        {
            return 'ANYSESSION';
        },
        getPartnerVisitorId: function ()
        {
            return 'ANYPARNTERVISITORID';
        },
        pushTrackingCall: function (callback)
        {
            callback();
        },
        cdnUrl: function (url)
        {
            return url;
        }
    };

    var utilsStub = {
        prototypeSafeJsonStringify: function (obj)
        {
            return JSON.stringify(obj);
        },
        createMd5Hash: function ()
        {
            return 'createdMd5Hash';
        },
        objToQueryString: function ()
        {
            return '';
        },
        encodingIsModified: function ()
        {
            return false;
        },
        plainCopy: function (obj)
        {
            return obj;
        }
    };

    describe('Products Group Module',
        function ()
        {
            describe('posts data',
                function ()
                {
                    it('and skips if document encoding is invalid', function ()
                    {
                        var utilsStub1 = {
                            encodingIsModified: function ()
                            {
                                return true;
                            }
                        };
                        var corsStub = { make: jasmine.createSpy('corsMake') };
                        var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub1, cdnurlsStub);
                        sut.post({ groupId: groupId });
                        expect(corsStub.make).not.toHaveBeenCalled();
                    });

                    it('to correct URL',
                        function ()
                        {
                            var corsStub = { make: jasmine.createSpy('corsMake') };
                            utilsStub.objToQueryString = jasmine.createSpy('utilsStubObjToQueryString').and.returnValue('');

                            var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                            sut.post({
                                groupId: groupId,
                                partnerId: apiStub.getPartnerId(),
                                stockId: stockId,
                                products: {
                                    '1': {
                                        color: 'red',
                                        size: 'XL',
                                        price: '123.6'
                                    },
                                    '2': {
                                        color: 'red',
                                        size: 'L',
                                        price: 1222
                                    }
                                }
                            });

                            var expectedUrl =
                                '/api/1.0/partner/{partnerid}/productsgroup/{groupid}?'
                                    .replace('{partnerid}', apiStub.getPartnerId())
                                    .replace('{groupid}', groupId)
                                    .replace('{stockid}', stockId);

                            var corsMakeCalls = corsStub.make.calls;
                            var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                            expect(corsMakeArgs0[0]).toEqual(expectedUrl);

                            var objToQueryStringCalls = utilsStub.objToQueryString.calls;
                            var objToQueryStringArgs0 = objToQueryStringCalls.argsFor(0);

                            expect(objToQueryStringArgs0[0].contentHash).toEqual('createdMd5Hash');
                            expect(objToQueryStringArgs0[0].stockId).toEqual(stockId);
                        });

                    it('with numeric price',
                        function ()
                        {
                            var corsStub = { make: jasmine.createSpy('corsMake') };
                            var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                            sut.post({
                                groupId: groupId,
                                partnerId: apiStub.getPartnerId(),
                                stockId: stockId,
                                products: {
                                    '1': {
                                        color: 'red',
                                        size: 'XL',
                                        price: '123.6'
                                    },
                                    '2': {
                                        color: 'red',
                                        size: 'L',
                                        price: 1222
                                    }
                                }
                            });

                            var corsMakeCalls = corsStub.make.calls;
                            var corsMakeArgs0 = corsMakeCalls.argsFor(0);
                            expect(JSON.parse(corsMakeArgs0[3]).products['1'].price).toEqual(123.6);
                        });

                    it('post external param in product model', function ()
                    {
                        var corsStub = { make: jasmine.createSpy('corsMake') };
                        var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                        sut.post({ groupId: groupId, someExternalPrameter: 42 });

                        var group = JSON.parse(corsStub.make.calls.argsFor(0)[3]);
                        expect(group.someExternalPraMeter).not.toBeDefined();
                        expect(group.params.someExternalPrameter).toEqual(42);
                    });

                    it('posts params in products model', function ()
                    {
                        var corsStub = { make: jasmine.createSpy('corsMake') };
                        var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                        sut.post({
                            groupId: groupId,
                            products: {
                                '1': {
                                    params: {
                                        someExternalPrameter: 42
                                    }
                                }
                            }
                        });

                        var group = JSON.parse(corsStub.make.calls.argsFor(0)[3]);
                        expect(group.someExternalPraMeter).not.toBeDefined();
                        expect(group.products['1'].params.someExternalPrameter).toEqual(42);
                    });

                    it('not external params on their places', function ()
                    {
                        var corsStub = { make: jasmine.createSpy('corsMake') };
                        var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);
                        var postedGroup = {
                            groupId: 1,
                            name: 'name',
                            price: 10000,
                            pictureUrl: 'pictureUrl',
                            url: 'url',
                            isAvailable: true,
                            categoryPaths: ['Example/Category/Path', 'Another/Category'],
                            description: 'some product',
                            stockId: 'stock',
                            vendor: 'vendor',
                            model: 'turbo s',
                            typePrefix: 'max',
                            oldPrice: 12000,
                            buyUrl: 'buyUrl',
                            params: {someParam: 1},
                            color: 'red',
                            size: '50',
                            title: 'best product',
                            artist: 'Ilon',
                            products: {
                                isAvailable: true,
                                name: 'name',
                                color: 'red',
                                size: 'XL',
                                url: 'url',
                                pictureUrl: 'pictureUrl',
                                price: 11500
                            }};

                        sut.post(postedGroup);

                        var group = JSON.parse(corsStub.make.calls.argsFor(0)[3]);
                        expect(group).toEqual(postedGroup);
                        expect(Object.keys(group.params).length).toEqual(1);
                    });
                });

            describe('posts signatured data',
                function ()
                {
                    it('to correct URL',
                        function ()
                        {
                            var corsStub = { make: jasmine.createSpy('corsMake') };
                            utilsStub.objToQueryString = jasmine.createSpy('utilsStubObjToQueryString').and.returnValue('');

                            var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                            var signationDate = 'yyyyMMddHHmmss';

                            sut.post(JSON.stringify({
                                groupId: groupId,
                                partnerId: apiStub.getPartnerId(),
                                stockId: stockId,
                                products: {
                                    '1': {
                                        color: 'red',
                                        size: 'XL',
                                        price: '123.6'
                                    },
                                    '2': {
                                        color: 'red',
                                        size: 'L',
                                        price: 1222
                                    }
                                }
                            }),
                            signature,
                            signationDate);


                            var expectedUrl =
                                '/api/1.0/partner/{partnerid}/productsgroup/{groupid}?'
                                    .replace('{partnerid}', apiStub.getPartnerId())
                                    .replace('{groupid}', groupId)
                                    .replace('{stockid}', stockId)
                                    .replace('{signature}', signature);

                            var corsMakeCalls = corsStub.make.calls;
                            var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                            expect(corsMakeArgs0[0]).toEqual(expectedUrl);

                            var objToQueryStringCalls = utilsStub.objToQueryString.calls;
                            var objToQueryStringArgs0 = objToQueryStringCalls.argsFor(0);

                            expect(objToQueryStringArgs0[0].contentHash).toEqual('createdMd5Hash');
                            expect(objToQueryStringArgs0[0].stockId).toEqual(stockId);
                            expect(objToQueryStringArgs0[0].signature).toEqual(signature);
                            expect(objToQueryStringArgs0[0].validTill).toEqual(signationDate);
                        });

                    it('with json body',
                        function ()
                        {
                            var corsStub = { make: jasmine.createSpy('corsMake') };
                            var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                            var jsonModel = JSON.stringify({
                                groupId: groupId,
                                partnerId: apiStub.getPartnerId(),
                                stockId: stockId,
                                products: {
                                    '1': {
                                        color: 'red',
                                        size: 'XL',
                                        price: '123.6'
                                    },
                                    '2': {
                                        color: 'red',
                                        size: 'L',
                                        price: 1222
                                    }
                                }
                            });

                            sut.post(
                                jsonModel,
                                signature
                            );


                            var corsMakeCalls = corsStub.make.calls;
                            var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                            expect(corsMakeArgs0[3]).toEqual(jsonModel);
                        });

                    it('with appliction/json content-type header',
                        function ()
                        {
                            var corsStub = { make: jasmine.createSpy('corsMake') };
                            var sut = retailrocket.modules.productsGroup(corsStub, apiStub, utilsStub, cdnurlsStub);

                            sut.post(JSON.stringify({
                                groupId: groupId,
                                partnerId: apiStub.getPartnerId(),
                                stockId: stockId,
                                products: {
                                    '1': {
                                        color: 'red',
                                        size: 'XL',
                                        price: '123.6'
                                    },
                                    '2': {
                                        color: 'red',
                                        size: 'L',
                                        price: 1222
                                    }
                                }
                            }),
                            signature);


                            var corsMakeCalls = corsStub.make.calls;
                            var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                            var headers0 = corsMakeArgs0[2];
                            var contentTypeHeader0 = headers0.find(function (elm)
                            {
                                return elm.name.toUpperCase() === 'Content-type'.toUpperCase();
                            });
                            expect(contentTypeHeader0.value).toEqual('application/json');
                        });
                });
        });
})();

/* eslint-disable */
(function ()
{
    if (!Array.prototype.find)
    {
        Array.prototype.find = function (predicate)
        {
            if (this === null)
            {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function')
            {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++)
            {
                value = list[i];
                if (predicate.call(thisArg, value, i, list))
                {
                    return value;
                }
            }
            return undefined;
        };
    }
})();
/* eslint-enable */
