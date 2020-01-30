/* global retailrocket*/
(function ()
{
    'use strict';

    describe('Segmentator module', function ()
    {
        it('get cookie', function ()
        {
            var cookiesStub = {
                getVisitorSegmenRecordCookie: function ()
                {},
                setOnRootVisitorSegmenRecordCookie: function ()
                {}
            };

            spyOn(cookiesStub, 'getVisitorSegmenRecordCookie');

            var sut = retailrocket.modules.segmentator(cookiesStub);
            sut.getVisitorSegment(2);

            expect(cookiesStub.getVisitorSegmenRecordCookie).toHaveBeenCalled();
        });

        it('set default cookie name', function ()
        {
            var cookiesStub = {
                getVisitorSegmenRecordCookie: function ()
                {},
                setOnRootVisitorSegmenRecordCookie: jasmine.createSpy('setOnRootVisitorSegmenRecordCookie')
            };

            var sut = retailrocket.modules.segmentator(cookiesStub);
            sut.getVisitorSegment(2);

            var cookiesCalls = cookiesStub.setOnRootVisitorSegmenRecordCookie.calls;
            var setOnRootArgs0 = cookiesCalls.argsFor(0);

            expect(setOnRootArgs0[0]).toBeUndefined();
            expect(setOnRootArgs0[1]).toBeDefined();
            expect(setOnRootArgs0[2]).toBeUndefined();
        });

        it('set cookie name from option.cookieName', function ()
        {
            var cookiesStub = {
                getVisitorSegmenRecordCookie: function ()
                {},
                setOnRootVisitorSegmenRecordCookie: jasmine.createSpy('setOnRootVisitorSegmenRecordCookie')
            };
            var cookieName = 'cookieName' + (new Date()).getTime();

            var sut = retailrocket.modules.segmentator(cookiesStub);
            sut.getVisitorSegment(2, { cookieName: cookieName });

            var cookiesCalls = cookiesStub.setOnRootVisitorSegmenRecordCookie.calls;
            var setOnRootArgs0 = cookiesCalls.argsFor(0);

            expect(setOnRootArgs0[0]).toEqual(cookieName);
            expect(setOnRootArgs0[1]).toBeDefined();
            expect(setOnRootArgs0[2]).toBeUndefined();
        });

        it('set cookie expire from option.expireInDay', function ()
        {
            var cookiesStub = {
                getVisitorSegmenRecordCookie: function ()
                {},
                setOnRootVisitorSegmenRecordCookie: jasmine.createSpy('setOnRootVisitorSegmenRecordCookie')
            };
            var expireInDay = 120;

            var sut = retailrocket.modules.segmentator(cookiesStub);
            sut.getVisitorSegment(2, { expireInDay: expireInDay });

            var cookiesCalls = cookiesStub.setOnRootVisitorSegmenRecordCookie.calls;
            var setOnRootArgs0 = cookiesCalls.argsFor(0);

            expect(setOnRootArgs0[0]).toBeUndefined();
            expect(setOnRootArgs0[1]).toBeDefined();
            expect(setOnRootArgs0[2]).toEqual(expireInDay);
        });
    });
})();
