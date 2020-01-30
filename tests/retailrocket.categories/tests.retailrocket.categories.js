/* global retailrocket*/
(function ()
{
    var categoryUrl = 'http://url/to/category.htm';
    var categoryPath = 'leather/jackets/metal';
    var categoryId = 823746;

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
        }
    };

    describe('Real Time Categories module', function ()
    {
        describe('posts data without id', function ()
        {
            it('to correct URL', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var utilsStub = {
                    prototypeSafeJsonStringify: function (obj)
                    {
                        return JSON.stringify(obj);
                    },
                    encodingIsModified: function ()
                    {
                        return false;
                    }
                };

                var sut = retailrocket.modules.categories(corsStub, apiStub, utilsStub);
                sut.post({ categoryPath: categoryPath, url: categoryUrl });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                var expectedUrl = 'https://tracking.retailrocket.net/1.0/partner/{partnerid}/categories/?&categoryPath={categorypath}'
                    .replace('{partnerid}', apiStub.getPartnerId())
                    .replace('{categorypath}', encodeURIComponent(categoryPath));

                expect(corsMakeArgs0[0]).toEqual(expectedUrl);
            });

            it('with json body', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var utilsStub = {
                    prototypeSafeJsonStringify: function (obj)
                    {
                        return JSON.stringify(obj);
                    },
                    encodingIsModified: function ()
                    {
                        return false;
                    }
                };

                var sut = retailrocket.modules.categories(corsStub, apiStub, utilsStub);

                sut.post({ categoryPath: categoryPath, url: categoryUrl });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                expect(JSON.parse(corsMakeArgs0[3]).categoryPath).toEqual(categoryPath);
            });
        });

        describe('posts data with id', function ()
        {
            it('and skips if document encoding is invalid', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var utilsStub = { encodingIsModified: function ()
                {
                    return true;
                } };
                var sut = retailrocket.modules.categories(corsStub, apiStub, utilsStub);
                sut.post({ id: categoryId, categoryPath: categoryPath, url: categoryUrl });
                expect(corsStub.make).not.toHaveBeenCalled();
            });

            it('to correct URL', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var utilsStub = {
                    prototypeSafeJsonStringify: function (obj)
                    {
                        return JSON.stringify(obj);
                    },
                    encodingIsModified: function ()
                    {
                        return false;
                    }
                };

                var sut = retailrocket.modules.categories(corsStub, apiStub, utilsStub);
                sut.post({ id: categoryId, categoryPath: categoryPath, url: categoryUrl });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                var expectedUrl = 'https://tracking.retailrocket.net/1.0/partner/{partnerid}/categories/{categoryid}?&categoryPath={categorypath}'
                    .replace('{categoryid}', categoryId)
                    .replace('{categorypath}', encodeURIComponent(categoryPath))
                    .replace('{partnerid}', apiStub.getPartnerId());
                expect(corsMakeArgs0[0]).toEqual(expectedUrl);
            });

            it('with json body', function ()
            {
                var corsStub = { make: jasmine.createSpy('corsMake') };
                var utilsStub = {
                    prototypeSafeJsonStringify: function (obj)
                    {
                        return JSON.stringify(obj);
                    },
                    encodingIsModified: function ()
                    {
                        return false;
                    }
                };

                var sut = retailrocket.modules.categories(corsStub, apiStub, utilsStub);
                sut.post({ id: categoryId, categoryPath: categoryPath, url: categoryUrl });

                var corsMakeCalls = corsStub.make.calls;
                var corsMakeArgs0 = corsMakeCalls.argsFor(0);

                expect(JSON.parse(corsMakeArgs0[3]).categoryPath).toEqual(categoryPath);
            });
        });
    });
})();

