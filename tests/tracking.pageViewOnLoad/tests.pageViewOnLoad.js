/* global retailrocket, rrApi, rrApiOnReady*/
(function ()
{
    'use strict';

    describe('PageViewOnLoad module', function ()
    {
        var documentStub = {
            readyState: 'complete',
            documentElement: {
                // eslint-disable-next-line brace-style
                doScroll: function () {}
            },
            // eslint-disable-next-line brace-style
            createEventObject: function () {}
        };

        var windowStub = {
            frameElement: false
        };
        it('pageView is pushed', function ()
        {
            spyOn(rrApiOnReady, 'push');

            retailrocket.modules.pageViewOnLoad(documentStub, windowStub, rrApi);

            expect(rrApiOnReady.push).toHaveBeenCalledWith(rrApi.pageView);
        });
    });
})();
