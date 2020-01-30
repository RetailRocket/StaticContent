/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.emailResubscription.js');
require('../src/retailrocket/internal/retailrocket.json.js');
const jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket emailResubscription module.', () =>
{
    describe('when start resubscription was called', function ()
    {
        it('call cors module with right params', function ()
        {
            var corsMock =
            {
                make: jasmine.createSpy('corsMock.make')
            };

            var apiStub =
            {
                getPartnerId: () => '59a00b843329f319dcac6fa6',
                getSessionId: () => '59a00b843329f319dcac6fa6'
            };

            var options = {
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules
                .emailResubscription(apiStub, corsMock);

            sut.startResubscription(options);

            expect(corsMock.make).toHaveBeenCalledWith(
                jasmineHelpers.urlTester({
                    host: 'tracking.retailrocket.net',
                    pathname: '/2.0/partner/' + apiStub.getPartnerId() + '/emailResubscription/visitors/' + apiStub.getSessionId() + '/resubscription',
                    query: {}
                }),
                'post',
                [],
                null,
                false,
                jasmine.any(Function)
            );
        });
    });

    describe('when get visitor state was called ', function ()
    {
        it('call cors module with right params', function ()
        {
            var corsMock =
            {
                make: jasmine.createSpy('corsMock.make')
            };

            var apiStub =
            {
                getPartnerId: () => '59a00b843329f319dcac6fa6',
                getSessionId: () => '59a00b843329f319dcac6fa6'
            };

            var jsonStub =
            {
                parse: function ()
                {
                }
            };

            var options = {
                onSuccessCallback: function ()
                {
                }
            };

            var sut = retailrocket.modules
                .emailResubscription(apiStub, corsMock, jsonStub);

            sut.getVisitorState(options);

            expect(corsMock.make).toHaveBeenCalledWith(
                jasmineHelpers.urlTester({
                    host: 'api.retailrocket.net',
                    pathname: '/api/2.0/partner/' + apiStub.getPartnerId() + '/emailResubscription/visitors/' + apiStub.getSessionId(),
                    query: {}
                }),
                'get',
                [],
                null,
                false,
                jasmine.any(Function)
            );
        });

        it(
            'returned expected value',
            function (done)
            {
                var randomStr = jasmineHelpers.randomStringValue({prefix: 'str'});
                var jsonString = '{"id": "' + randomStr + '"}';

                var corsStub =
                {
                    make: function (url, method, headers, data, withCredentials, callback)
                    {
                        callback(jsonString);
                    }
                };

                var apiStub =
                {
                    getPartnerId: () => '59a00b843329f319dcac6fa6',
                    getSessionId: () => '59a00b843329f319dcac6fa6'
                };

                var options = {
                    onSuccessCallback: function (result)
                    {
                        expect(result.data.id).toEqual(randomStr);
                        done();
                    }
                };

                var sut = retailrocket.modules
                    .emailResubscription(
                        apiStub,
                        corsStub,
                        retailrocket.modules.json());

                sut.getVisitorState(options);
            });
    });
});
