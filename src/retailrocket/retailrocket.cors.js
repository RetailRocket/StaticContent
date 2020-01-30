// eslint-disable-next-line no-undef
retailrocket.setModule('cors', [], function ()
{
    function applyHeaders(request, h)
    {
        var headers = h || [];
        for (var i = 0; i < headers.length; ++i)
        {
            var header = headers[i];
            request.setRequestHeader(header.name, header.value);
        }
    }

    function makeRequest(url, method, headers, data, withCredentials, callback, errback)
    {
        var req;
        if (XMLHttpRequest)
        {
            req = new XMLHttpRequest();

            if ('withCredentials' in req)
            {
                req.open(method, url, true);
                applyHeaders(req, headers);
                req.onerror = errback;
                req.withCredentials = withCredentials;
                req.onreadystatechange = function ()
                {
                    if (req.readyState === 4)
                    {
                        if (req.status >= 200 && req.status < 400)
                        {
                            if (callback)
                            {
                                callback(req.responseText);
                            }
                        }
                        else if (errback)
                        {
                            errback(new Error('Response returned with non-OK status'));
                        }
                    }
                };
                req.send(data);
            }
        }
        else if (XDomainRequest)
        {
            if (headers || headers.length > 0)
            {
                errback(new Error('custom headers not supported'));
            }

            req = new XDomainRequest();
            req.open(method, url);
            req.onerror = errback;
            req.onload = function ()
            {
                callback(req.responseText);
            };
            req.send(data);
        }
        else
        {
            errback(new Error('CORS not supported'));
        }
    }

    return {
        make: makeRequest,
        useNs: true
    };
});
