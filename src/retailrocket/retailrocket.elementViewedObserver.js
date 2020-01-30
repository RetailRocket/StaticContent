// eslint-disable-next-line no-undef
retailrocket.setModule(
    'elementViewedObserver',
    ['window'],
    function ($window)
    {
        function isObserverSupported()
        {
            return typeof ($window.IntersectionObserver) === typeof ($window.Function);
        }

        function observe(options)
        {
            function handler(
                entries,
                observer)
            {
                var entry = entries[0];

                if (entry.isIntersecting)
                {
                    options.callback();

                    var target = entry.target;
                    observer.unobserve(target);
                }
            }

            var observerOptions =
            {
                threshold: 0.75
            };

            var observer = new $window.IntersectionObserver(handler, observerOptions);
            observer.observe(options.htmlElement);
        }

        return {
            observe: observe,
            isObserverSupported: isObserverSupported
        };
    });
