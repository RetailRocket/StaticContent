/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/internal/retailrocket.trackingClient.js');
require('../src/retailrocket/retailrocket.utils.js');

var jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket tracking client module', function ()
{
    var utils = retailrocket.modules.utils();
    utils.convertUrHostnameToASCII = function (url)
    {
        return url;
    };

    it('rewrites query string params by implicitly passed', function ()
    {
        var method = jasmineHelpers.randomStringValue({ prefix: 'method' });
        var eventName = jasmineHelpers.randomStringValue({ prefix: 'eventName' });
        var partnerId = jasmineHelpers.randomStringValue({ prefix: 'partnerId' });
        var session = jasmineHelpers.randomStringValue({ prefix: 'session' });
        var partnerVisitorId = jasmineHelpers.randomStringValue({ prefix: 'partnerVisitorId' });
        var headers = [{ name: jasmineHelpers.randomStringValue({ prefix: 'headername' }), value: jasmineHelpers.randomStringValue({ prefix: 'value' }) }];
        var data = { productIds: [] };

        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            },
            getSessionId: function ()
            {
                return session;
            },
            getPartnerVisitorId: function ()
            {
                return partnerVisitorId;
            }
        };
        var corsStub = {
            make: jasmine.createSpy('cors.make')
        };
        var documentStub = {
            referrer: jasmineHelpers.randomStringValue({ prefix: 'https://test.referrer.retailrocket.ru/' })
        };
        var windowsStub = {
            location: {
                href: jasmineHelpers.randomStringValue({ prefix: 'https://test.retailrocket.ru/' })
            },
            rrSearchPhrase: jasmineHelpers.randomStringValue({ prefix: 'window.rrSearchPhrase' }),
            rrTestSegment: jasmineHelpers.randomStringValue({ prefix: 'window.rrTestSegment' })
        };
        var params = {
            session: jasmineHelpers.randomStringValue({ prefix: 'session' }),
            pvid: jasmineHelpers.randomStringValue({ prefix: 'pvid' }),
            referrer: jasmineHelpers.randomStringValue({ prefix: 'referrer' }),
            partnerTestSegment: jasmineHelpers.randomStringValue({ prefix: 'partnerTestSegment' }),
            pageUrl: jasmineHelpers.randomStringValue({ prefix: 'pageUrl' }),
            keywords: jasmineHelpers.randomStringValue({ prefix: 'keywords' }),
            email: jasmineHelpers.randomStringValue({ prefix: 'email' })
        };

        var sut = retailrocket.modules.trackingClient(corsStub, utils, documentStub, windowsStub, apiStub);

        sut.call({
            eventName: eventName,
            headers: headers,
            params: params,
            method: method,
            data: data
        });

        expect(corsStub.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'tracking.retailrocket.net',
                pathname: '/1.0/event/' + eventName + '/' + apiStub.getPartnerId(),
                query: {
                    session: params.session,
                    referrer: params.referrer,
                    pvid: params.pvid,
                    pageUrl: params.pageUrl,
                    keywords: params.keywords,
                    email: params.email,
                    partnerTestSegment: params.partnerTestSegment
                }
            }),
            method,
            headers,
            JSON.stringify(data),
            false,
            jasmine.any(Function)
        );
    });

    it('build right url', function ()
    {
        var corsStub = {
            make: jasmine.createSpy('cors.make')
        };

        var method = jasmineHelpers.randomStringValue({ prefix: 'method' });
        var eventName = jasmineHelpers.randomStringValue({ prefix: 'eventName' });
        var partnerId = jasmineHelpers.randomStringValue({ prefix: 'partnerId' });
        var session = jasmineHelpers.randomStringValue({ prefix: 'session' });
        var partnerVisitorId = jasmineHelpers.randomStringValue({ prefix: 'partnerVisitorId' });
        var stockId = jasmineHelpers.randomStringValue({ prefix: 'stockId' });
        var recomItemId = jasmineHelpers.randomStringValue({ prefix: 'recomItemId' });
        var headers = [{ name: jasmineHelpers.randomStringValue({ prefix: 'headername' }), value: jasmineHelpers.randomStringValue({ prefix: 'value' }) }];
        var data = { productIds: [] };

        var documentStub = {
            referrer: jasmineHelpers.randomStringValue({ prefix: 'https://test.referrer.retailrocket.ru/' })
        };
        var windowsStub = {
            location: {
                href: jasmineHelpers.randomStringValue({ prefix: 'https://test.retailrocket.ru/' })
            },
            rrSearchPhrase: jasmineHelpers.randomStringValue({ prefix: 'window.rrSearchPhrase' }),
            rrUserEmail: jasmineHelpers.randomStringValue({ prefix: 'window.rrUserEmail' }),
            rrTestSegment: jasmineHelpers.randomStringValue({ prefix: 'window.rrTestSegment' })
        };
        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            },
            getSessionId: function ()
            {
                return session;
            },
            getPartnerVisitorId: function ()
            {
                return partnerVisitorId;
            }
        };

        var sut = retailrocket.modules.trackingClient(corsStub, utils, documentStub, windowsStub, apiStub);
        sut.call({
            eventName: eventName,
            headers: headers,
            params: {
                stockId: stockId,
                recomItemId: recomItemId
            },
            method: method,
            data: data
        });

        expect(corsStub.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'tracking.retailrocket.net',
                pathname: '/1.0/event/' + eventName + '/' + apiStub.getPartnerId(),
                query: {
                    session: session,
                    stockId: stockId,
                    recomItemId: recomItemId,
                    referrer: documentStub.referrer,
                    pvid: apiStub.getPartnerVisitorId(),
                    pageUrl: windowsStub.location.href,
                    keywords: windowsStub.rrSearchPhrase,
                    email: windowsStub.rrUserEmail,
                    partnerTestSegment: windowsStub.rrTestSegment
                }
            }),
            method,
            headers,
            JSON.stringify(data),
            false,
            jasmine.any(Function)
        );
    });

    it('subscribe builds right url', function ()
    {
        var corsStub = {
            make: jasmine.createSpy('cors.make')
        };

        var method = jasmineHelpers.randomStringValue({ prefix: 'method' });
        var eventName = jasmineHelpers.randomStringValue({ prefix: 'eventName' });
        var partnerId = jasmineHelpers.randomStringValue({ prefix: 'partnerId' });
        var session = jasmineHelpers.randomStringValue({ prefix: 'session' });
        var partnerVisitorId = jasmineHelpers.randomStringValue({ prefix: 'partnerVisitorId' });
        var stockId = jasmineHelpers.randomStringValue({ prefix: 'stockId' });
        var recomItemId = jasmineHelpers.randomStringValue({ prefix: 'recomItemId' });
        var headers = [{ name: jasmineHelpers.randomStringValue({ prefix: 'headername' }), value: jasmineHelpers.randomStringValue({ prefix: 'value' }) }];
        var data = { productIds: [] };

        var documentStub = {
            referrer: jasmineHelpers.randomStringValue({ prefix: 'https://test.referrer.retailrocket.ru/' })
        };
        var windowsStub = {
            location: {
                href: jasmineHelpers.randomStringValue({ prefix: 'https://test.retailrocket.ru/' })
            },
            rrSearchPhrase: jasmineHelpers.randomStringValue({ prefix: 'window.rrSearchPhrase' }),
            rrUserEmail: jasmineHelpers.randomStringValue({ prefix: 'window.rrUserEmail' }),
            rrTestSegment: jasmineHelpers.randomStringValue({ prefix: 'window.rrTestSegment' })
        };
        var apiStub = {
            getPartnerId: function ()
            {
                return partnerId;
            },
            getSessionId: function ()
            {
                return session;
            },
            getPartnerVisitorId: function ()
            {
                return partnerVisitorId;
            }
        };

        var sut = retailrocket.modules.trackingClient(corsStub, utils, documentStub, windowsStub, apiStub);
        sut.subscribe({
            eventName: eventName,
            headers: headers,
            params: {
                stockId: stockId,
                recomItemId: recomItemId
            },
            method: method,
            data: data
        });

        expect(corsStub.make).toHaveBeenCalledWith(
            jasmineHelpers.urlTester({
                host: 'tracking.retailrocket.net',
                pathname: '/1.0/partner/' + apiStub.getPartnerId() + '/subscribe/' + eventName,
                query: {
                    session: session,
                    stockId: stockId,
                    recomItemId: recomItemId,
                    referrer: documentStub.referrer,
                    pvid: apiStub.getPartnerVisitorId(),
                    pageUrl: windowsStub.location.href,
                    keywords: windowsStub.rrSearchPhrase,
                    email: windowsStub.rrUserEmail,
                    partnerTestSegment: windowsStub.rrTestSegment
                }
            }),
            method,
            headers,
            JSON.stringify(data),
            false,
            jasmine.any(Function)
        );
    });
});

