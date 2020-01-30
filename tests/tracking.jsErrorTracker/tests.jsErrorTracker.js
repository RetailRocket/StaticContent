(function ()
{
    'use strict';

    function createException(options)
    {
        var result = new Error();
        result.name = options.name;
        result.message = options.message;
        result.stack = options.stack;
        return result;
    }

    function createLongString()
    {
        var randomString = Math.random().toString(36).substring(7);
        var result = '';
        for (var i = 0; i < 1000; i++)
        {
            result += randomString;
        }
        return result;
    }

    describe('Js Error Tracker', function ()
    {
        it('exception is posted',
            function ()
            {
                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send');

                var thrownException = createException({
                    name: 'Exception name',
                    message: 'Exception message',
                    stack: 'Exception stack'
                });

                // eslint-disable-next-line no-undef
                executeErrorHandler(function ()
                {
                    throw thrownException;
                });

                expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', 'https://tracking.retailrocket.net/javascripterrors', true);
                expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith(jasmine.any(String));

                var sendRequest = XMLHttpRequest.prototype.send.calls.allArgs()[0];
                var parsedData = JSON.parse(sendRequest);
                expect(parsedData.name).toEqual(thrownException.name);
                expect(parsedData.message).toEqual(thrownException.message);
                expect(parsedData.stack).toEqual(thrownException.stack);
            });


        it('and long data is trimmed',
            function ()
            {
                spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
                spyOn(XMLHttpRequest.prototype, 'send');

                var longName = createLongString();
                var longMessage = createLongString();
                var longStack = createLongString();

                var thrownException = createException({
                    name: longName,
                    message: longMessage,
                    stack: longStack
                });

                // eslint-disable-next-line no-undef
                executeErrorHandler(function ()
                {
                    throw thrownException;
                });

                expect(XMLHttpRequest.prototype.open).toHaveBeenCalledWith('POST', 'https://tracking.retailrocket.net/javascripterrors', true);
                expect(XMLHttpRequest.prototype.send).toHaveBeenCalledWith(jasmine.any(String));

                var sendRequest = XMLHttpRequest.prototype.send.calls.allArgs()[0];
                var parsedData = JSON.parse(sendRequest);
                expect(parsedData.name).toEqual(thrownException.name.substring(0, 100));
                expect(parsedData.message).toEqual(thrownException.message.substring(0, 500));
                expect(parsedData.stack).toEqual(thrownException.stack.substring(0, 4000));
            });
    });
})();
