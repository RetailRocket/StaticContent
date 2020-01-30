// eslint-disable-next-line no-undef
retailrocket.setModule('pageViewOnLoad',
    ['document', 'window', 'rrApi'],
    function ($doc, $win, rrApi)
    {
        var pushPageView = function ()
        {
            rrApiOnReady.push(rrApi.pageView); // eslint-disable-line
        };

        var done = false;
        var top = true;
        var root = $doc.documentElement;
        var add = $doc.addEventListener ? 'addEventListener' : 'attachEvent';
        var rem = $doc.addEventListener ? 'removeEventListener' : 'detachEvent';
        var pre = $doc.addEventListener ? '' : 'on';
        var init = function (e)
        {
            var eventType = e.type || '';
            if (eventType === 'readystatechange' && $doc.readyState !== 'complete') return;
            (eventType === 'load' ? $win : $doc)[rem](pre + eventType, init, false);
            if (!done)
            {
                done = true;
                setTimeout(function ()
                {
                    pushPageView($win, eventType || e);
                });
            }
        };

        var poll = function ()
        {
            try
            {
                root.doScroll('left');
            }
            catch (e)
            {
                setTimeout(poll, 50);
                return;
            }
            init('poll');
        };

        if ($doc.readyState === 'complete') pushPageView($win, 'lazy');
        else
        {
            if ($doc.createEventObject && root.doScroll)
            {
                try
                {
                    top = !$win.frameElement;
                } catch (e) {// eslint-disable-line
                }

                if (top) poll();
            }
            $doc[add](pre + 'DOMContentLoaded', init, false);
            $doc[add](pre + 'readystatechange', init, false);
            $win[add](pre + 'load', init, false);
        }

        return {};
    });
