/* global retailrocket*/
(function ()
{
    'use strict';

    var utils = retailrocket.modules.utils(retailrocket, document);

    describe('Markup module',
        function ()
        {
            var apiStub;
            var devStub;
            var cdnUrlsStub;
            var elementViewedObserverStub;

            beforeEach(function ()
            {
                jasmine.clock().install();

                apiStub = {
                    getPartnerVisitorId: function ()
                    {
                        return 0;
                    },
                    getPartnerId: function ()
                    {
                        return '';
                    },
                    cdnUrl: function ()
                    {
                        return '';
                    },
                    getSessionId: function ()
                    {
                        return '';
                    }
                };

                devStub = {
                    developmentMode: function ()
                    {
                        return false;
                    }
                };

                cdnUrlsStub = {};

                elementViewedObserverStub = {
                    isObserverSupported: function ()
                    {
                        return false;
                    }
                };
            });

            afterEach(function ()
            {
                jasmine.clock().uninstall();
            });

            it('block was initialized',
                function ()
                {
                    var div = document.createElement('div');
                    div.setAttribute('data-retailrocket-markup-block', '000000000000000000000000');
                    document.body.appendChild(div);

                    var trackingStub =
                    {
                        markupRendered: jasmine.createSpy('markuprendered').and.stub()
                    };

                    var corsMock = {
                        make: function ()
                        {
                        }
                    };
                    retailrocket.modules.markup(utils, apiStub, devStub, corsMock, document, trackingStub, cdnUrlsStub, elementViewedObserverStub);
                    jasmine.clock().tick(1);
                    expect(div.getAttribute('initialized')).toMatch(/true/);
                });

            it('when script throws exception error is logged to server', function ()
            {
                var block = {
                    Markup: ' ??? ',
                    PartnerId: 'somePartnerId',
                    LastChangedAt: new Date().toISOString()
                };

                var corsMock = {
                    make: function ()
                    {}
                };

                var container = {
                    querySelectorAll: function ()
                    {
                        return [{ text: 'throw new Error(\'Test exception message\');' }];
                    },
                    attributes: [
                        { name: 'attribute1', value: 'value1' },
                        { name: 'attribute2', value: 'value2' }
                    ]
                };

                var trackingStub =
                {
                    markupRendered: jasmine.createSpy('markuprendered').and.stub()
                };

                var sut = retailrocket.modules.markup(utils, apiStub, devStub, corsMock, document, trackingStub, cdnUrlsStub, elementViewedObserverStub);

                spyOn(corsMock, 'make');

                expect(function ()
                {
                    sut.renderBlock(container, block);
                }).toThrow();

                expect(corsMock.make.calls.count()).toEqual(1);

                var errorRequestUrl = corsMock.make.calls.first().args[0];
                var errorData = JSON.parse(corsMock.make.calls.first().args[3]);

                expect(errorData.attributes.attribute1).toEqual('value1');
                expect(errorData.attributes.attribute2).toEqual('value2');

                expect(errorData.name).toEqual('Error');
                expect(errorData.message).toEqual('Test exception message');
                expect(errorData.stack).not.toBeNull();

                expect(errorRequestUrl.indexOf(block.PartnerId)).toBeGreaterThan(0);
                expect(errorRequestUrl.indexOf(block.LastChangedAt)).toBeGreaterThan(0);
            });

            it('send render event to server', function ()
            {
                var corsStub = {
                    make: function ()
                    {}
                };

                var pvid = 'pvid' + new Date().getTime();
                apiStub.getPartnerVisitorId = function ()
                {
                    return pvid;
                };

                var session = 'session' + new Date().getTime();
                apiStub.getSessionId = function ()
                {
                    return session;
                };

                var trackingMock =
                {
                    markupRendered: jasmine.createSpy('markuprendered')
                };

                var sut = retailrocket.modules.markup(utils, apiStub, devStub, corsStub, document, trackingMock, cdnUrlsStub, elementViewedObserverStub);

                var container = {
                    querySelectorAll: function ()
                    {
                        return [{ text: '' }];
                    },
                    attributes: [
                        { name: 'attribute1', value: 'value1' }
                    ]
                };

                var block = {
                    Id: 'Id' + new Date().getTime(),
                    Markup: ' ??? ',
                    SegmentId: 'SegmentId',
                    PartnerId: 'somePartnerId',
                    LastChangedAt: new Date().toISOString()
                };

                sut.renderBlock(container, block);

                expect(trackingMock.markupRendered).toHaveBeenCalledWith(jasmine.objectContaining({
                    partnerId: block.PartnerId,
                    blockId: block.Id,
                    segmentId: block.SegmentId,
                    pvid: pvid,
                    session: session
                }));
            });
        }
    );
})();
