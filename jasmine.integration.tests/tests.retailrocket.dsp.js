const createCors = require('./fakeCors.js').create;

/* global retailrocket */
global.retailrocket = require('../jasmine.unit.tests/retailrocket.fakeModule.js');

var jasmineHelpers = require('../jasmine.unit.tests/jasmineHelpers.js');
require('../src/retailrocket/internal/retailrocket.sspListClient.js');
require('../src/retailrocket/retailrocket.matching.js');

describe('Retail Rocket matching module', function ()
{
    function createSut(options)
    {
        var cors = createCors(options);
        var apiStub = {
            getPartnerId: () => '59a00b843329f319dcac6fa1',
            getSessionId: () => '59a00b843329f319dcac6fa2'
        };
        var rrApiStub = {
            _initialize: {
                subscribe: (callback) => callback()
            }
        };
        var docStub = {};
        var sspListClient = retailrocket.modules.sspListClient(cors);

        return retailrocket.modules.matching(apiStub, docStub, sspListClient, rrApiStub);
    }

    var domain = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';

    var assert = function (response, done, expectedStatusCode)
    {
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.headers['access-control-allow-origin']).toEqual(domain);
        expect(response.headers['access-control-allow-credentials']).toEqual('true');
        done();
    };

    describe('CORS is supported', function ()
    {
        it('matching supports CORS', function (done)
        {
            createSut({
                origin: domain,
                callback: (response) => assert(response, done, 200)});
        });
    });
});
