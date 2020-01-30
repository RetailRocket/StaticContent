/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/Tracking/initPartnerSession-t.js');
require('../src/retailrocket/retailrocket.utils.js');

var jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket initPartnerSession module', function ()
{
    it('call right adress with right partner id', function ()
    {
        var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
        var dumny = () =>
        {
        };

        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            }
        };
        var cookiesStub = {
            areCookiesEnabled: function ()
            {
                return true;
            },
            getSessionIdCookie: dumny
        };

        var utils = retailrocket.modules.utils({}, {}, {});
        utils.isRobot = () => false;

        var rrApiStub = {};

        var corsMock = {
            make: jasmine.createSpy('cors.make')
        };

        retailrocket.modules.initPartnerSessionT(apiStub, cookiesStub, utils, rrApiStub, corsMock);

        expect(corsMock.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'tracking.retailrocket.net',
                pathname: '/1.0/event/initialize/' + partnerId
            }),
            'get',
            [],
            {},
            true,
            jasmine.any(Function)
        );
    });

    it('send session from cookie as a query parametr', function ()
    {
        var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
        var sessionId = jasmineHelpers.randomStringValue({prefix: 'sessionId'});

        var dumny = () =>
        {
        };

        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            }
        };

        var cookiesStub = {
            areCookiesEnabled: function ()
            {
                return true;
            },
            getSessionIdCookie: () => sessionId
        };

        var utils = retailrocket.modules.utils({}, {}, {});
        utils.isRobot = () => false;

        var rrApiStub = {
            _initialize: () => dumny
        };

        var corsMock = {
            make: jasmine.createSpy('cors.make')
        };

        retailrocket.modules.initPartnerSessionT(
            apiStub,
            cookiesStub,
            utils,
            rrApiStub,
            corsMock);

        expect(corsMock.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'tracking.retailrocket.net',
                pathname: '/1.0/event/initialize/' + partnerId,
                query: {
                    session: sessionId
                }
            }),
            'get',
            [],
            {},
            true,
            jasmine.any(Function));
    });

    it('send nochache query parametr', function ()
    {
        var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
        var dumny = () =>
        {
        };

        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            }
        };
        var cookiesStub = {
            areCookiesEnabled: function ()
            {
                return true;
            },
            getSessionIdCookie: dumny
        };

        var utils = retailrocket.modules.utils({}, {}, {});
        utils.isRobot = () => false;

        var rrApiStub = {};

        var corsMock = {
            make: jasmine.createSpy('cors.make')
        };

        retailrocket.modules.initPartnerSessionT(apiStub, cookiesStub, utils, rrApiStub, corsMock);

        expect(corsMock.make).toHaveBeenCalledWith(
            jasmine.stringMatching('_nocache'),
            'get',
            [],
            {},
            true,
            jasmine.any(Function));
    });
});
