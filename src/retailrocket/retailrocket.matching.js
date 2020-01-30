// eslint-disable-next-line no-undef
retailrocket.setModule(
    'matching',
    ['api', 'document', 'sspListClient', 'rrApi'],
    function (api, $doc, sspListClient, rrApi)
    {
        rrApi._initialize.subscribe(function ()
        {
            sspListClient.get(
                {
                    partnerId: api.getPartnerId(),
                    sessionId: api.getSessionId(),
                    callback: function (sspList)
                    {
                        for (var i = 0; i < sspList.length; ++i)
                        {
                            var img = $doc.createElement('img');
                            img.src = sspList[i];
                            img.setAttribute('style', 'display: none;');
                            $doc.body.appendChild(img);
                        }
                    }
                }
            );
        });
    }
);


