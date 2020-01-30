// eslint-disable-next-line no-undef
retailrocket.setModule('dev', ['cookies'], function (cookies)
{
    function developmentMode(enableDev)
    {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (enableDev == null)
        {
            return cookies.getDevCookie() ? true : false;
        }
        cookies.setOnRootDevCookie(enableDev, 24 * 60 * 60);
        return enableDev;
    }

    return {
        developmentMode: developmentMode,
        useNs: true
    };
});
