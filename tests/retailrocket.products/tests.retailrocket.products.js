/* global retailrocket*/
(function ()
{
    describe('Products Module', function ()
    {
        var productId = 1234;
        var productName = 'Black leather sock';
        var stockId = 'ANYSTOCKID';
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
            }
        };

        describe('posts data', function ()
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
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub1);
                sut.post({ id: productId });
                expect(corsStub.make).not.toHaveBeenCalled();
            });

            it('to correct URL', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                utilsStub.objToQueryString = jasmine.createSpy('utilsStubObjToQueryString').and.returnValue('');

                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);

                sut.post({
                    id: productId,
                    partnerId: apiStub.getPartnerId(),
                    stockId: stockId,
                    name: '',
                    description: '',
                    categoryPaths: ['Products/Clothes/Leather/Socks'],
                    url: '',
                    isAvailable: true
                });

                var expectedUrl = '/api/1.0/partner/{partnerid}/products/{productId}'
                    .replace('{partnerid}', apiStub.getPartnerId())
                    .replace('{productId}', productId)
                    .replace('{stockid}', stockId);

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                expect(corsMakeArgs0[0]).toMatch(expectedUrl);

                var objToQueryStringCalls = utilsStub.objToQueryString.calls;
                var objToQueryStringArgs0 = objToQueryStringCalls.argsFor(0);

                expect(objToQueryStringArgs0[0].contentHash).toEqual('createdMd5Hash');
                expect(objToQueryStringArgs0[0].stockId).toEqual(stockId);
            });

            it('with json body', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);

                sut.post({
                    id: productId,
                    partnerId: apiStub.getPartnerId(),
                    stockId: stockId,
                    name: productName,
                    description: 'Genuine leather sock',
                    categoryPaths: ['Products/Clothes/Leather/Socks'],
                    url: 'http://buyleathersocksonline.com/',
                    isAvailable: true
                });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                expect(JSON.parse(corsMakeArgs0[3]).name).toEqual(productName);
            });

            it('with application/json content-type', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);

                sut.post({
                    id: productId,
                    partnerId: apiStub.getPartnerId(),
                    stockId: stockId,
                    name: productName,
                    description: 'Genuine leather sock',
                    categoryPaths: ['Products/Clothes/Leather/Socks'],
                    url: 'http://buyleathersocksonline.com/',
                    isAvailable: true
                });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                var headers0 = corsMakeArgs0[2];

                var contentTypeHeader0 = headers0.find(function (elm)
                {
                    return elm.name.toUpperCase() === 'Content-type'.toUpperCase();
                });

                expect(contentTypeHeader0.value).toEqual('application/json');
            });

            it('post external param in product model', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);

                sut.post({ id: productId, someExternalPrameter: 42 });

                var product = JSON.parse(corsStub.make.calls.argsFor(0)[3]);
                expect(product.someExternalPraMeter).not.toBeDefined();
                expect(product.params.someExternalPrameter).toEqual(42);
            });

            it('not external params on their places', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);
                var postedProduct = {
                    id: 1,
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
                    artist: 'Ilon'
                };

                sut.post(postedProduct);

                var product = JSON.parse(corsStub.make.calls.argsFor(0)[3]);
                expect(product).toEqual(postedProduct);
                expect(Object.keys(product.params).length).toEqual(1);
            });
        });

        describe('posts signatured data', function ()
        {
            it('to correct URL', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                utilsStub.objToQueryString = jasmine.createSpy('utilsStubObjToQueryString').and.returnValue('');

                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);
                var signature = 'signature';
                var signationDate = 'yyyyMMddHHmmss';

                sut.post(JSON.stringify({
                    id: productId,
                    partnerId: apiStub.getPartnerId(),
                    stockId: stockId,
                    name: '',
                    description: '',
                    categoryPaths: ['Products/Clothes/Leather/Socks'],
                    url: '',
                    isAvailable: true
                }),
                signature,
                signationDate);

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                var expectedUrl = '/api/1.0/partner/{partnerid}/products/{productid}?'
                    .replace('{partnerid}', apiStub.getPartnerId())
                    .replace('{productid}', productId)
                    .replace('{stockid}', stockId)
                    .replace('{signature}', signature);

                expect(corsMakeArgs0[0]).toEqual(expectedUrl);

                var objToQueryStringCalls = utilsStub.objToQueryString.calls;
                var objToQueryStringArgs0 = objToQueryStringCalls.argsFor(0);

                expect(objToQueryStringArgs0[0].contentHash).toEqual('createdMd5Hash');
                expect(objToQueryStringArgs0[0].stockId).toEqual(stockId);
                expect(objToQueryStringArgs0[0].signature).toEqual(signature);
                expect(objToQueryStringArgs0[0].validTill).toEqual(signationDate);
            });

            it('with json body', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);
                var signature = 'signature';

                var jsonModel = JSON.stringify({
                    id: productId,
                    partnerId: apiStub.getPartnerId(),
                    stockId: stockId,
                    name: productName,
                    description: '',
                    categoryPaths: ['Products/Clothes/Leather/Socks'],
                    url: '',
                    isAvailable: true
                });

                sut.post(jsonModel, signature);

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                expect(corsMakeArgs0[3]).toEqual(jsonModel);
            });

            it('with application/json content-type',
                function ()
                {
                    var corsStub = { make: jasmine.createSpy('corsMake') };
                    var sut = retailrocket.modules.products(corsStub, apiStub, utilsStub, cdnurlsStub);
                    var signature = 'signature';

                    sut.post(JSON.stringify({
                        id: productId,
                        partnerId: apiStub.getPartnerId(),
                        stockId: stockId,
                        name: productName,
                        description: '',
                        categoryPaths: ['Products/Clothes/Leather/Socks'],
                        url: '',
                        isAvailable: true
                    }), signature);

                    var corsMakeCalls = corsStub.make.calls;
                    var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                    var headers0 = corsMakeArgs0[2];
                    var contentTypeHeader0 = headers0.find(function (elm)
                    {
                        return elm.name.toUpperCase() === 'Content-type'.toUpperCase();
                    });

                    expect(contentTypeHeader0.value).toEqual('application/json');
                }
            );
        });
    });
})();

/* eslint-disable */
(function () {
    if (!Array.prototype.find) {
        Array.prototype.find = function (predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }
})();
/* eslint-enable */
