/* global rrLibrary */
(function ApiInit(rrLibrary)
{
    window.rrApi = window.rcApi = (function ()
    {
        /* eslint-disable new-cap*/
        var api = {
            initialized: false,

            pageView: rrLibrary.EventProperty(),
            pageViewCompleted: rrLibrary.EventProperty(),

            view: rrLibrary.EventProperty(),
            viewCompleted: rrLibrary.EventProperty(),

            groupView: rrLibrary.EventProperty(),

            addToBasket: rrLibrary.EventProperty(),
            addToBasketCompleted: rrLibrary.EventProperty(),

            removeFromBasket: rrLibrary.EventProperty(),
            removeFromBasketCompleted: rrLibrary.EventProperty(),

            categoryView: rrLibrary.EventProperty(),
            categoryViewCompleted: rrLibrary.EventProperty(),

            order: rrLibrary.EventProperty(),
            orderCompleted: rrLibrary.EventProperty(),

            recomAddToCart: rrLibrary.EventProperty(),
            recomAddToCartCompleted: rrLibrary.EventProperty(),

            recomAddToBasket: rrLibrary.EventProperty(),
            recomAddToBasketCompleted: rrLibrary.EventProperty(),

            recomTrack: rrLibrary.EventProperty(),
            recomTrackCompleted: rrLibrary.EventProperty(),

            recomMouseDown: rrLibrary.EventProperty(),
            recomMouseDownCompleted: rrLibrary.EventProperty(),

            setEmail: rrLibrary.EventProperty(),
            setEmailCompleted: rrLibrary.EventProperty(),

            subscribeOnItemBackInStock: rrLibrary.EventProperty(),

            welcomeSequence: rrLibrary.EventProperty(),

            setKeywords: rrLibrary.EventProperty(),

            search: rrLibrary.EventProperty(),

            mailRequest: rrLibrary.EventProperty(),
            mailRequestFormView: rrLibrary.EventProperty(),

            subscribeOnPriceDrop: rrLibrary.EventProperty(),

            _initialize: rrLibrary.EventProperty(),
            // eslint-disable-next-line brace-style
            _empty: function () { }
        };

        api._initialize.subscribe(function (partnerParams)
        {
            this.subscribe(function ()
            {
                rrLibrary.executeSubscribers(window.rrApiOnReady || [], [partnerParams]);
                window.rrApiOnReady = { push: function (onReady)
                {
                    rrLibrary.executeSubscribers([onReady], [partnerParams]);
                } };
                // eslint-disable-next-line brace-style
                (window.rrAsyncInit || window.rcAsyncInit || function () { })();
            });
        });

        return api;
    }());
})(rrLibrary);
