/* global retailrocket*/
(function ()
{
    'use strict';

    describe('RetailRocket.Cookies module', function ()
    {
        var punycodeStub = {
            toASCII: function (e)
            {
                return e;
            }
        };

        it('sets cookie with string', function ()
        {
            var cookieName = 'name_of_the_cookie';
            var cookieValue = 'some_value';

            var sut = retailrocket.modules.cookies(punycodeStub);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, 1);

            var cookieEntry = cookieName + '=' + cookieValue;
            expect(document.cookie).toContain(cookieEntry);
        });

        it('sets cookie with bool', function ()
        {
            var cookieName = 'name_of_the_bool_cookie';
            var cookieValue = true;

            var sut = retailrocket.modules.cookies(punycodeStub);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, 1);

            var cookieEntry = cookieName + '=' + cookieValue;
            expect(document.cookie).toContain(cookieEntry);
        });

        it('gets cookie', function ()
        {
            var cookieName = 'name_of_the_another_cookie';
            var cookieValue = 'some_another_value';
            document.cookie = cookieName + '=' + cookieValue;

            var sut = retailrocket.modules.cookies(punycodeStub);
            var result = sut.getVisitorSegmenRecordCookie(cookieName);

            expect(result).toBe(cookieValue);
        });

        it('setting cookie with negative expire removes cookie', function ()
        {
            var cookieName = 'already_exist_cookie';
            var cookieValue = 'already_exist_cookie_value';

            var sut = retailrocket.modules.cookies(punycodeStub);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, 300);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, -1);

            expect(document.cookie).not.toContain(cookieName);
        });

        it('setting cookie with null value removes cookie', function ()
        {
            var cookieName = 'already_exist_cookie';
            var cookieValue = 'already_exist_cookie_value';

            var sut = retailrocket.modules.cookies(punycodeStub);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, 300);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, null, 300);

            expect(document.cookie).not.toContain(cookieName);
        });

        it('setting cookie with undefined value removes cookie', function ()
        {
            var cookieName = 'already_exist_cookie';
            var cookieValue = 'already_exist_cookie_value';

            var sut = retailrocket.modules.cookies(punycodeStub);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, cookieValue, 300);
            sut.setOnRootVisitorSegmenRecordCookie(cookieName, undefined, 300); // eslint-disable-line

            expect(document.cookie).not.toContain(cookieName);
        });
    });
})();
