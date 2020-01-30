/* global retailrocket */
global.retailrocket = require('../jasmine.unit.tests/retailrocket.fakeModule.js');

var jasmineHelpers = require('../jasmine.unit.tests/jasmineHelpers.js');
require('../src/retailrocket/internal/retailrocket.recommendationClient.js');
require('../src/retailrocket/retailrocket.recommendation.js');
require('../src/retailrocket/retailrocket.utils.js');

const createCors = require('./fakeCors.js').create;

describe('Retail Rocket recommendation module', function ()
{
    var noOp = () => ({});

    function assert(response, expectedOrigin, done)
    {
        expect(response.statusCode).toEqual(200);
        expect(response.headers['access-control-allow-origin']).toEqual(expectedOrigin);
        expect(response.headers['access-control-allow-credentials']).toEqual('true');
        done();
    }

    function setupSutAndRun(sutFunc, done)
    {
        var domain = 'https://www.' + jasmineHelpers.randomStringValue({ prefix: 'domain' }) + '.net';

        var corsOptions = {
            origin: domain,
            callback: (r) => assert(r, domain, done)
        };
        var cors = createCors(corsOptions);

        var utils = retailrocket.modules.utils();
        utils.getQueryString = () => '';
        utils.convertUrHostnameToASCII = (url) => url;

        var apiStub = {
            getPartnerId: () => '59a00b843329f319dcac6fa6',
            getSessionId: () => '59a00b843329f319dcac6fa6',
            getPartnerVisitorId: () => '0'
        };

        var recommendationClient = retailrocket.modules.recommendationClient(cors, utils, apiStub, {developmentMode: () => false});

        var sut = retailrocket.modules.recommendation(utils, recommendationClient);

        sutFunc(sut);
    }

    it('personal recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';
        var algorithm = 'personal';
        var session = '59a00b843329f319dcac6fa6';

        setupSutAndRun((sut) => sut.forPerson(partnerId, session, null, algorithm, {}, noOp), done);
    });

    it('product recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';
        var itemIds = [1, 2, 3, 123];
        var alg = 'alternative';

        setupSutAndRun((sut) => sut.forProducts(partnerId, itemIds, alg, {}, noOp), done);
    });

    it('category recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';
        var categoriesIds = [1, 2, 3, 123];
        var alg = 'popular';

        setupSutAndRun((sut) => sut.forCategories(partnerId, categoriesIds, alg, {}, noOp), done);
    });

    it('search recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';
        var phrase = jasmineHelpers.randomStringValue({prefix: 'phrase'});

        setupSutAndRun((sut) => sut.forSearch(partnerId, phrase, {}, noOp), done);
    });

    it('visitor category interest recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';
        var session = '59a00b843329f319dcac6fa6';
        var alg = 'popular';

        setupSutAndRun((sut) => sut.forVisitorCategoryInterest(partnerId, session, alg, {}, noOp), done);
    });

    it('preview recommendations support CORS headers', function (done)
    {
        var partnerId = '59a00b843329f319dcac6fa6';

        setupSutAndRun((sut) => sut.forPreview(partnerId, noOp), done);
    });
});
