// eslint-disable-next-line no-undef
retailrocket.setModule(
    'recommendationClient',
    ['cors', 'utils', 'api', 'dev'],
    function (cors, utils, api, dev)
    {
        return {
            get: function (partnerId, algorithm, params, callback)
            {
                var p = utils.plainCopy(params || {});
                p.session = p.session || api.getSessionId();
                p.pvid = api.getPartnerVisitorId();
                p.isDebug = dev.developmentMode();
                p.segmentId = utils.queryStringToObj(utils.getQueryString()).rr_segmentId;
                p.format = p.format || 'json';

                var url = 'https://api.retailrocket.net/api/2.0/recommendation/' + (p.algorithmType ? p.algorithmType + '/' : '') + algorithm + '/' + partnerId + '/?' + utils.objToQueryString(p);

                cors.make(
                    url,
                    'get',
                    [],
                    null,
                    false,
                    function (data)
                    {
                        (callback || function ()
                        {
                        })(JSON.parse(data));
                    }
                );
            }
        };
    });
