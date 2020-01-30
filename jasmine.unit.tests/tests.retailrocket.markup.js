/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.markup.js');

var jasmineHelpers = require('./jasmineHelpers.js');

describe('Retail Rocket markup module', function ()
{
    function createMarkupBlock()
    {
        return {
            Id: jasmineHelpers.randomStringValue({prefix: 'id'}),
            PartnerId: jasmineHelpers.randomStringValue({prefix: 'parnterId'}),
            SegmentId: jasmineHelpers.randomStringValue({prefix: 'segmentId'}),
            Markup: '{{data-argument}}'
        };
    }

    function createSut(dependencies)
    {
        var deps = dependencies || {};
        var utils = deps.utils || {
            $forall: function ()
            {},
            addEventListener: function ()
            {},
            htmlEncode: function (d)
            {
                return d;
            },
            objToQueryString: function ()
            {
                return '';
            },
            bind: function ()
            {}
        };

        var api = deps.api || {
            getPartnerVisitorId: function ()
            {
                return '';
            },
            getSessionId: function ()
            {
                return '';
            }
        };

        var dev = deps.dev || {};

        var cors = deps.cors || {};

        var document = deps.document || {};

        var tracking = deps.tracking || {
            markupRendered: function ()
            {}
        };
        var cdnNurls = deps.cdnNurls || {};

        var elementObserver = deps.elementObserver || {
            observe: function ()
            {},
            isObserverSupported: function ()
            {}
        };


        return retailrocket.modules.markup(
            utils,
            api,
            dev,
            cors,
            document,
            tracking,
            cdnNurls,
            elementObserver);
    }

    var container = {
        querySelectorAll: function ()
        {
            return [];
        },
        attributes: [{nodeName: 'data-argument', nodeValue: '"\'"\''}]
    };


    it('escape quote and apostrophe to html escape characters', function ()
    {
        var sut = createSut();

        sut.renderBlock(
            container,
            createMarkupBlock());

        expect(container.innerHTML).toEqual('&quot;&#39;&quot;&#39;');
    });

    it('send markupRendered with correct options', function ()
    {
        var partnerVisitorId = jasmineHelpers.randomStringValue({prefix: 'partnerVisitorId'});
        var sessionId = jasmineHelpers.randomStringValue({prefix: 'sessionId'});

        var apiStub =
        {
            getPartnerVisitorId: function ()
            {
                return partnerVisitorId;
            },
            getSessionId: function ()
            {
                return sessionId;
            }
        };
        var trackingMock =
        {
            markupRendered: jasmine.createSpy('markupRendered')
        };

        var isObserverSupported = jasmineHelpers.randomBool();

        var elementObserverStub =
        {
            observe: function ()
            {},
            isObserverSupported: function ()
            {
                return isObserverSupported;
            }
        };

        var sut = createSut(
            {
                api: apiStub,
                tracking: trackingMock,
                elementObserver: elementObserverStub
            });

        var markupBlock = createMarkupBlock();

        sut.renderBlock(
            container,
            markupBlock);

        expect(trackingMock.markupRendered).toHaveBeenCalledWith(
            jasmine.objectContaining(
                {
                    partnerId: markupBlock.PartnerId,
                    blockId: markupBlock.Id,
                    segmentId: markupBlock.SegmentId,
                    pvid: partnerVisitorId,
                    session: sessionId,
                    isMarkupViewedSupported: isObserverSupported
                }));
    });

    it('observe markup', function ()
    {
        var bindedMock = function ()
        {};

        var utilsMock = {
            $forall: function ()
            {},
            addEventListener: function ()
            {},
            htmlEncode: function (d)
            {
                return d;
            },
            objToQueryString: function ()
            {
                return '';
            },
            bind: jasmine.createSpy('bind').and.callFake(function ()
            {
                return bindedMock;
            })
        };

        var elementObserverMock =
        {
            observe: jasmine.createSpy('observe'),
            isObserverSupported: function ()
            {
                return true;
            }
        };

        var trackingStub =
        {
            markupRendered: function ()
            {},
            markupViewed: function ()
            {}
        };

        var sut = createSut(
            {
                utils: utilsMock,
                tracking: trackingStub,
                elementObserver: elementObserverMock
            });

        var markupBlock = createMarkupBlock();

        sut.renderBlock(
            container,
            markupBlock);

        expect(utilsMock.bind).toHaveBeenCalledWith(
            trackingStub.markupViewed,
            {},
            jasmine.objectContaining(
                {
                    blockId: markupBlock.Id,
                    segmentId: markupBlock.SegmentId
                }
            ));

        expect(elementObserverMock.observe).toHaveBeenCalledWith(
            jasmine.objectContaining(
                {
                    htmlElement: container,
                    callback: bindedMock
                }));
    });

    it('does not observe markup', function ()
    {
        var elementObserverMock =
        {
            observe: jasmine.createSpy('observe'),
            isObserverSupported: function ()
            {
                return false;
            }
        };

        var sut = createSut(
            {
                elementObserver: elementObserverMock
            });

        sut.renderBlock(
            container,
            createMarkupBlock());

        expect(elementObserverMock.observe).not.toHaveBeenCalled();
    });
});
