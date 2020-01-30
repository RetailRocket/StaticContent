// eslint-disable-next-line no-undef
retailrocket.setModule(
    'svyaznoy',
    [
        'api',
        'cookies',
        'window'
    ],
    function (api, cookies, $window)
    {
        if (api.getPartnerId() !== '52485de00d422d1cb4c83609')
        {
            return {};
        }

        $window.rrTestSegment = cookies.getSvyaznoyUserFilterType();
        return {
        };
    }
);
