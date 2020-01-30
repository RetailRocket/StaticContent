// eslint-disable-next-line no-undef
retailrocket.setModule('localEventsEngine',
    ['rrLibrary'],
    function (rrLibrary)
    {
        var eventsKey = 'retailRocketEvents';
        var storageFake = [];

        // ie fix
        if (!('filter' in Array.prototype))
        {
            // eslint-disable-next-line no-extend-native
            Array.prototype.filter = function (filter, that /* opt*/)
            {
                var other = [];
                var v;
                for (var i = 0, n = this.length; i < n; i++)
                {
                    // eslint-disable-next-line no-cond-assign
                    if (i in this && filter.call(that, v = this[i], i, this))
                    {
                        other.push(v);
                    }
                }
                return other;
            };
        }

        function setAll(eventsArray)
        {
            try
            {
                localStorage.setItem(eventsKey, rrLibrary.prototypeSafeJsonStringify(eventsArray));
            }
            catch (e)
            {
                storageFake = eventsArray;
            }
        }

        function getAll()
        {
            try
            {
                return JSON.parse(localStorage.getItem(eventsKey)) || [];
            }
            catch (e)
            {
                return storageFake;
            }
        }

        function appendEvent(eventType, eventData)
        {
            var allEvents = getAll();
            allEvents.push({ ts: new Date().getTime(), ev: eventType, dt: eventData });
            setAll(allEvents);
        }

        function removeOldEvents(timestamp)
        {
            var allEvents = getAll();
            var actualEvents = allEvents.filter(function (ev)
            {
                return ev.ts > timestamp;
            });
            setAll(actualEvents);
        }

        var msInDay = (24 * 60 * 60 * 1000);
        removeOldEvents((new Date()).getTime() - msInDay);

        function findLocalEvents(eventTypes, eventFromTs)
        {
            var events = getAll();

            if (eventTypes)
            {
                events = events.filter(function (ev)
                {
                    return eventTypes.indexOf(ev.ev) >= 0;
                });
            }

            if (eventFromTs)
            {
                events = events.filter(function (ev)
                {
                    return ev.ts > eventFromTs;
                });
            }

            return events;
        }

        rrLibrary.getLocalEvents = getAll;
        rrLibrary.registerLocalEvent = appendEvent;
        rrLibrary.findLocalEvents = findLocalEvents;

        return {};
    });
