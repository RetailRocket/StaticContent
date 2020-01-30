/* global retailrocket*/
(function ()
{
    'use strict';

    describe('RetailRocket.Dev module', function ()
    {
        describe('developmentMode', function ()
        {
            var cookiesStub = {
                setOnRootDevCookie: function ()
                {},
                getDevCookie: function ()
                {}
            };

            it('call getDevCookie', function ()
            {
                spyOn(cookiesStub, 'getDevCookie');

                var sut = retailrocket.modules.dev(cookiesStub);

                sut.developmentMode();

                expect(cookiesStub.getDevCookie).toHaveBeenCalledWith();
            });

            describe('call setOnRoot', function ()
            {
                it('dev mode is true', function ()
                {
                    spyOn(cookiesStub, 'setOnRootDevCookie');

                    var sut = retailrocket.modules.dev(cookiesStub);

                    sut.developmentMode(true);

                    expect(cookiesStub.setOnRootDevCookie).toHaveBeenCalledWith(true, 24 * 60 * 60);
                });

                it('dev mode is false', function ()
                {
                    spyOn(cookiesStub, 'setOnRootDevCookie');

                    var sut = retailrocket.modules.dev(cookiesStub);

                    sut.developmentMode(false);

                    expect(cookiesStub.setOnRootDevCookie).toHaveBeenCalledWith(false, 24 * 60 * 60);
                });
            });
        });
    });
})();
