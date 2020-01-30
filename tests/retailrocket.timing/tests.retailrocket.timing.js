/* global retailrocket*/
(function ()
{
    'use strict';

    var utils = retailrocket.modules.utils(retailrocket, document);

    describe('Timing module', function ()
    {
        var rrApi = {
            pageView: {
                subscribe: function (fn)
                {
                    fn();
                }
            }
        };

        var apiStub = {
            getPartnerVisitorId: function ()
            {
                return 100;
            },
            getPartnerId: function ()
            {
                return '000000000000000000000000';
            },
            getSessionId: function ()
            {
                return '000000000000000000000001';
            },
            pushTrackingCall: function pushTrackingCall(rrApiFn)
            {
                rrApiFn(rrApi);
            }
        };

        beforeEach(function ()
        {
            jasmine.clock().install();
        });

        afterEach(function ()
        {
            jasmine.clock().uninstall();
        });

        it('send session in timing', function ()
        {
            var corsMock = {
                make: function ()
                {}
            };

            spyOn(corsMock, 'make');

            retailrocket.modules.timing(corsMock, apiStub, utils);
            jasmine.clock().tick(2000);

            expect(corsMock.make.calls.count()).toEqual(1);
            var url = corsMock.make.calls.first().args[0];
            expect(url.indexOf('session=000000000000000000000001')).toBeGreaterThan(0);
        });

        it('should sent uniq timings only once',
            function ()
            {
                var makeCalls = 0;

                var corsMock = {
                    make: function (callback)
                    {
                        if (makeCalls < 2)
                        {
                            callback();
                        }
                    }
                };

                spyOn(corsMock, 'make').and.callThrough();

                spyOn(utils, 'getPerformanceEntries').and.returnValue([
                    { name: 'http://test.retailrocket.ru/partner/', duration: 10 },
                    { name: 'http://test.retailrocket.ru/partner?test=1', duration: 11 },
                    { name: 'http://test.retailrocket.ru/event', duration: 12 }
                ]);

                retailrocket.modules.timing(corsMock, apiStub, utils);

                jasmine.clock().tick(2001);
                expect(corsMock.make.calls.count()).toEqual(1);
            });
    });
})();
