/* global retailrocket, rrLibrary*/
(function ()
{
    'use strict';

    describe('LocalEventsEngine module', function ()
    {
        it('create rrLibrary.getLocalEvents', function ()
        {
            retailrocket.modules.localEventsEngine(rrLibrary);

            expect(rrLibrary.getLocalEvents).not.toBeUndefined();
        });

        it('create rrLibrary.registerLocalEvent', function ()
        {
            retailrocket.modules.localEventsEngine(rrLibrary);

            expect(rrLibrary.registerLocalEvent).not.toBeUndefined();
        });

        it('create rrLibrary.findLocalEvents', function ()
        {
            retailrocket.modules.localEventsEngine(rrLibrary);

            expect(rrLibrary.findLocalEvents).not.toBeUndefined();
        });
    });
})();
