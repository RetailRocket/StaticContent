// eslint-disable-next-line no-undef
retailrocket.setModule('lastTenItems',
    ['cookies', 'utils', 'rrApi'],
    function (cookies, utils, rrApi)
    {
        if (utils.isRobot() || !cookies.areCookiesEnabled())
        {
            return {};
        }

        rrApi._initialize.subscribe(function (partnerParams)
        {
            if (!partnerParams)
            {
                return;
            }

            rrApi.view.subscribe(function (itemId)
            {
                var viewed = [];
                if (cookies.getLastViewedCookie())
                {
                    viewed = cookies.getLastViewedCookie().split(',');
                }

                if (viewed.length > 9)
                {
                    viewed.shift();
                }

                if (parseInt(itemId, 10) && viewed.indexOf(itemId.toString()) < 0)
                {
                    viewed.push(itemId);
                }

                cookies.setOnRootLastViewedCookie(viewed.join(','));
            });

            function addToBasket(itemId)
            {
                var basket = [];
                if (cookies.getLastAddedBasketCookie())
                {
                    basket = cookies.getLastAddedBasketCookie().split(',');
                }

                if (basket.length > 9)
                {
                    basket.shift();
                }

                if (parseInt(itemId, 10))
                {
                    basket.push(itemId.toString());
                }

                cookies.setOnRootLastAddedBasketCookie(basket.join(','));
            }

            rrApi.addToBasket.subscribe(addToBasket);
            rrApi.recomAddToCart.subscribe(addToBasket);
            rrApi.order.subscribe(function ()
            {
                cookies.cleanOnRootLastAddedBasketCookie();
                cookies.cleanOnRootLastViewedCookie();
            });
        });

        return {};
    });
