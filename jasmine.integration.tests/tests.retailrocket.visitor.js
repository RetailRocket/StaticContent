/* global retailrocket */
const createCors = require('./fakeCors.js').create;

global.retailrocket = require('../jasmine.unit.tests/retailrocket.fakeModule.js');

var jasmineHelpers = require('../jasmine.unit.tests/jasmineHelpers.js');
require('../src/retailrocket/retailrocket.visitor.js');

var noOp = () =>
{
};

describe('Retail Rocket visitor module', function ()
{
    var validBody = '{\"isAgreedToReceiveMarketingMail\":false,\"data\":null,\"email\":\"d@retailrocket.ru\"}';

    function createSut(options)
    {
        var cors = createCors(options);

        var apiStub = {
            getPartnerId: () => options.partnerId,
            getSessionId: () => '59a00b843329f319dcac6fa6',
            getPartnerVisitorId: noOp
        };

        return retailrocket.modules.visitor(cors, apiStub);
    }

    var domain = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';

    var assert = function (response, done, expectedStatusCode)
    {
        expect(response.statusCode).toEqual(expectedStatusCode);
        expect(response.headers['access-control-allow-origin']).toEqual(domain);
        expect(response.headers['access-control-allow-credentials']).toEqual('true');
        done();
    };

    describe('isUnsignedVisitorRequestForbidden = true', function ()
    {
        var unsignRequestsForbiddenPartnerId = '59a00b843329f319dcac6fa6';


        var sut = createSut({origin: domain, partnerId: unsignRequestsForbiddenPartnerId});

        it('Unsigned POST responds 403 if forbidden', function (done)
        {
            var onSuccessCallback = (response) => assert(response, done, 403);

            sut.post(validBody, null, null, onSuccessCallback);
        });

        it('Valid sign returns 200', function (done)
        {
            var onSuccessCallback = (response) => assert(response, done, 200);

            var signature = '05c28e2ae436205de61b53f77df9223cb7b5df1e97a10a1730de845158a3d964';
            var body = validBody;
            var validTill = '21180227144608';

            sut.post(body, signature, validTill, onSuccessCallback);
        });

        it('Invalid signature returns 400', function (done)
        {
            var onSuccessCallback = (response) => assert(response, done, 400);

            sut.post(validBody, jasmineHelpers.randomStringValue(''), '2020', onSuccessCallback);
        });
    });

    describe('isUnsignedVisitorRequestForbidden = false', function ()
    {
        var unsignRequestsAllowedPartnerId = '5a94186d5ee013509868e7b5';

        var sut = createSut({origin: domain, partnerId: unsignRequestsAllowedPartnerId});

        it('Request without signature returns 200', function (done)
        {
            var onSuccessCallback = (response) => assert(response, done, 200);

            sut.post(validBody, null, null, onSuccessCallback);
        });
    });
});
