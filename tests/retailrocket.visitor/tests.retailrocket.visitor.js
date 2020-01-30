/* global retailrocket*/
(function ()
{
    describe('Partner Users Module', function ()
    {
        var apiStub = {
            getPartnerId: function ()
            {
                return 'APISTUB_PARTNERID';
            },
            getSessionId: function ()
            {
                return 'APISTUB_SESSIONID';
            }
        };

        var corsStub = {
            make: function ()
            {}
        };

        describe('gets visitor highlight info', function ()
        {
            var partnerId = 'XXX-PARTNERID-XXX';
            var session = 'XXX-SESSION-XXX';
            var errback = function ()
            {};

            it('calls specific url', function ()
            {
                spyOn(corsStub, 'make');

                var sut = retailrocket.modules.visitor(corsStub, apiStub);
                sut.get(partnerId, session, function ()
                {}, errback);

                var makeArgs = corsStub.make.calls.argsFor(0);
                expect(makeArgs[0]).toEqual('https://api.retailrocket.net/api/1.0/visitor/' + session + '?partnerId=' + partnerId);
                expect(makeArgs[1]).toEqual('GET');
            });

            it('callback parameter is object', function ()
            {
                var callback = function (visitorInformation)
                {
                    expect(visitorInformation.IsAgreedToReceiveMarketingMail).toEqual(true);
                    expect(visitorInformation.HasEmail).toEqual(true);
                };

                corsStub.make = function (url, method, headers, data, wc, corsCallback)
                {
                    corsCallback('{"IsAgreedToReceiveMarketingMail":true,"HasEmail":true}');
                };

                spyOn(corsStub, 'make').and.callThrough();

                var sut = retailrocket.modules.visitor(corsStub, apiStub);

                sut.get(partnerId, session, callback, errback);

                expect(corsStub.make).toHaveBeenCalled();
            });
        });

        describe('POST/PATCH data', function ()
        {
            beforeEach(function ()
            {
                spyOn(corsStub, 'make');
            });

            var body = '{ ... }';
            var signature = 'SIGNATURE-XXXX-XXXX-XXXX';
            var validTill = '201701021209';
            var callback = function ()
            {};
            var errback = function ()
            {};
            var sut = retailrocket.modules.visitor(corsStub, apiStub);

            var expectedUrlUnsignedRequest = 'https://api.retailrocket.net/api/2.1/visitor/' + apiStub.getSessionId() +
                '?partnerId=' + apiStub.getPartnerId();

            var expectedUrlSignedRequest = 'https://api.retailrocket.net/api/2.1/visitor/' + apiStub.getSessionId() +
                '?partnerId=' + apiStub.getPartnerId() +
                '&signature=' + signature +
                '&validTill=' + validTill;

            var expectedBody = body;

            describe('POST', function ()
            {
                it('unsigned data', function ()
                {
                    sut.post(body);

                    expect(corsStub.make).toHaveBeenCalledWith(
                        expectedUrlUnsignedRequest,
                        'POST',
                        [{ name: 'Content-type', value: 'application/json' }],
                        expectedBody,
                        false,
                        jasmine.any(Function),
                        jasmine.any(Function));
                });

                it('signed data', function ()
                {
                    sut.post(body, signature, validTill, callback, errback);

                    expect(corsStub.make).toHaveBeenCalledWith(
                        expectedUrlSignedRequest,
                        'POST',
                        [{ name: 'Content-type', value: 'application/json' }],
                        expectedBody,
                        false,
                        callback,
                        errback);
                });
            });

            describe('PATCH', function ()
            {
                it('unsigned data', function ()
                {
                    sut.patch(body);

                    expect(corsStub.make).toHaveBeenCalledWith(
                        expectedUrlUnsignedRequest,
                        'PATCH',
                        [{ name: 'Content-type', value: 'application/json' }],
                        expectedBody,
                        false,
                        jasmine.any(Function),
                        jasmine.any(Function));
                });

                it('signed data', function ()
                {
                    sut.patch(body, signature, validTill, callback, errback);

                    expect(corsStub.make).toHaveBeenCalledWith(
                        expectedUrlSignedRequest,
                        'PATCH',
                        [{ name: 'Content-type', value: 'application/json' }],
                        expectedBody,
                        false,
                        callback,
                        errback);
                });
            });
        });
    });
})();
