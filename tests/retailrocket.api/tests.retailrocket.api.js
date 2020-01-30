/* global retailrocket*/
(function ()
{
    'use strict';

    describe('RetailRocket.Api module', function ()
    {
        describe('getPartnerVisitorId', function ()
        {
            var cookiesStub = {
                setOnRootRrPvidCookie: function ()
                {},
                getRrPvidCookie: function ()
                {}
            };

            it('call getRrPvidCookie', function ()
            {
                spyOn(cookiesStub, 'getRrPvidCookie');

                var sut = retailrocket.modules.api(cookiesStub, {}, {});

                sut.getPartnerVisitorId();

                expect(cookiesStub.getRrPvidCookie).toHaveBeenCalledWith();
            });

            it('call setOnRoot', function ()
            {
                spyOn(cookiesStub, 'setOnRootRrPvidCookie');

                var sut = retailrocket.modules.api(cookiesStub, {}, {});

                sut.getPartnerVisitorId();

                expect(cookiesStub.setOnRootRrPvidCookie).toHaveBeenCalled();
            });
        });

        describe('getSessionId', function ()
        {
            var cookiesStub = {
                getSessionIdCookie: function ()
                {}
            };

            it('call getSessionIdCookie', function ()
            {
                spyOn(cookiesStub, 'getSessionIdCookie');

                var sut = retailrocket.modules.api(cookiesStub, {}, {});

                sut.getSessionId();

                expect(cookiesStub.getSessionIdCookie).toHaveBeenCalled();
            });
        });
    });
})();
