/* global retailrocket */
global.retailrocket = require('../jasmine.unit.tests/retailrocket.fakeModule');

const createCors = require('./fakeCors.js').create;

require('../src/retailrocket/retailrocket.utils.js');
require('../src/retailrocket/internal/retailrocket.trackingClient');
require('../src/retailrocket/retailrocket.tracking');
require('../src/retailrocket/retailrocket.emailResubscription');

var jasmineHelpers = require('../jasmine.unit.tests/jasmineHelpers.js');

describe('Retail Rocket emailResubscription module', function ()
{
    function assert(options)
    {
        expect(options.response.statusCode).toEqual(200);
        expect(options.response.headers['access-control-allow-origin']).toEqual(options.allowOriginHeader);
        expect(options.response.headers['access-control-allow-credentials']).toEqual('true');
        options.done();
    }

    it(
        'start resubscription calls 200ok endpoint with cors header',
        function (done)
        {
            var origin = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';

            var cors = createCors({origin: origin});

            var apiStub = {
                getPartnerId: () => '59a00b843329f319dcac6fa6',
                getSessionId: () => '59a00b843329f319dcac6fa6'
            };

            var sut = retailrocket.modules
                .emailResubscription(
                    apiStub,
                    cors);

            sut.startResubscription({
                onSuccessCallback: (response) => assert({
                    allowOriginHeader: origin,
                    response,
                    done})
            });
        });

    it(
        'get visitor state calls 200ok endpoint with cors header',
        function (done)
        {
            var origin = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';

            var cors = createCors({origin: origin});

            var apiStub = {
                getPartnerId: () => '59a00b843329f319dcac6fa6',
                getSessionId: () => '59a00b843329f319dcac6fa6'
            };

            var sut = retailrocket.modules
                .emailResubscription(
                    apiStub,
                    cors);

            sut.startResubscription({
                onSuccessCallback: (response) => assert({
                    allowOriginHeader: origin,
                    response,
                    done})
            });
        });
});
