// eslint-disable-next-line no-undef
retailrocket.setModule(
    'sspListClient',
    ['cors'],
    function (cors)
    {
        function getSspList(option)
        {
            var url = 'https://dsp.retailrocket.net/1.0/matchingPixels/' +
                option.partnerId +
                '?sessionId=' + option.sessionId;

            if (option.partnerId !== '5b75167397a528304cd6acc8')
            {
                cors.make(
                    url,
                    'get',
                    [],
                    null,
                    true,
                    function (data)
                    {
                        (option.callback || function ()
                        {
                        })(JSON.parse(data));
                    }
                );
            }
        }

        return {
            get: getSspList
        };
    }
);
