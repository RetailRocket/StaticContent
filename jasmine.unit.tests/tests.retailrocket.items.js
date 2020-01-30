/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.items.js');

var jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket items module', function ()
{
    var partnerId = jasmineHelpers.randomStringValue({prefix: 'partnerId'});
    var itemsIds = [0x8000000000000001, 0x8000000000000002];
    var stockId = jasmineHelpers.randomStringValue({prefix: 'stockId'});

    it('call right adress with right partner id', function ()
    {
        var corsMock = {
            make: jasmine.createSpy('cors.make')
        };

        function callback()
        {}

        var sut = retailrocket.modules.items(corsMock);
        sut.get(partnerId, itemsIds, stockId, callback);

        expect(corsMock.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'api.retailrocket.net',
                pathname: '/api/1.0/partner/' + partnerId + '/items/',
                query: {
                    itemsIds: '' + itemsIds.join(','),
                    stock: stockId
                }
            }),
            'get',
            [],
            {},
            false,
            jasmine.any(Function)
        );
    });
    it('call callback with parsed JSON', function ()
    {
        var expectedData = JSON.parse('[{"f1": "v1"}]');

        var corsMock = {
            make: function (url, method, headers, data, wc, corsCallback)
            {
                corsCallback('[{"f1": "v1"}]');
            }
        };

        var callbackMock = {
            cb: jasmine.createSpy('callbackMock.cb')
        };

        var sut = retailrocket.modules.items(corsMock);
        sut.get(partnerId, itemsIds, stockId, callbackMock.cb);

        expect(callbackMock.cb).toHaveBeenCalledWith(expectedData);
    });
});
