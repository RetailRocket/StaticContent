/* global retailrocket, rrLibrary, rrApi*/
(function ()
{
    'use strict';

    describe('LocalEventsEngine module', function ()
    {
        var testItemId = 123;
        // eslint-disable-next-line brace-style
        rrLibrary.registerLocalEvent = function () { };

        beforeEach(function ()
        {
            spyOn(rrLibrary, 'registerLocalEvent');

            retailrocket.modules.localLog(rrApi, rrLibrary);
        });

        it('view is registered', function ()
        {
            rrApi.view(testItemId);
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('view', { id: testItemId });
        });

        it('addToBasket is registered', function ()
        {
            rrApi.addToBasket(testItemId);
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('addToBasket', { id: testItemId });
        });

        it('removeFromBasket is registered', function ()
        {
            rrApi.removeFromBasket(testItemId);
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('removeFromBasket', { id: testItemId });
        });

        it('recomAddToCart is registered', function ()
        {
            rrApi.recomAddToCart(testItemId, { suggester: 'test', suggestMethod: 'met' });
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith(
                'recomAddToCart',
                {
                    id: testItemId,
                    sgr: 'test',
                    met: 'met'
                });
        });

        it('order is registered', function ()
        {
            rrLibrary.findLocalEvents = function ()
            {
                return [{ dt: { id: testItemId }, ts: 5 }];
            };

            rrApi.order({ items: [{ id: testItemId }], transaction: 'transaction' });
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('order', jasmine.any(Object));
        });

        it('search is registered', function ()
        {
            rrApi.search('search phrase');
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('search', 'search phrase');
        });

        it('mailRequest is registered', function ()
        {
            rrApi.mailRequest();
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('mailrequest', {});
        });

        it('mailRequestFormView is registered', function ()
        {
            rrApi.mailRequestFormView({ param: 1 });
            expect(rrLibrary.registerLocalEvent).toHaveBeenCalledWith('mailrequestFormView', { param: 1});
        });
    });
})();
