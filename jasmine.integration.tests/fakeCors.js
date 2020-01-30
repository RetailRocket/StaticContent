/* global retailrocket */
var urlFromArgs;

process.argv.forEach(
    function (arg)
    {
        if (arg.match('^--rr-url='))
        {
            urlFromArgs = arg.match('^--rr-url=(.*)')[1];
        }
    });

var urlParser = require('url');
var https = require('https');
var http = require('http');
var noOp = function ()
{
};

function createCors(options)
{
    return {
        make: function (url, method, h, data, wc, callback, errback)
        {
            var urlParts = urlParser.parse(url, true);
            var port = urlParts.port || 443;
            var hostname = urlParts.hostname;
            var isHttps = urlParts.protocol === 'https:';
            var basepath = '';

            if (urlFromArgs)
            {
                var parsedUrlFromArgs = urlParser.parse(urlFromArgs, true);
                hostname = parsedUrlFromArgs.hostname;
                isHttps = parsedUrlFromArgs.protocol === 'https:';
                port = parsedUrlFromArgs.port || (isHttps ? 443 : 80);

                basepath = parsedUrlFromArgs.path;
            }

            var headers = {};
            for (var i = 0; i < (h || []).length; ++i)
            {
                var header = h[i];
                headers[header.name] = header.value;
            }
            headers.origin = options.origin;

            if (data)
            {
                headers['Content-Length'] = Buffer.byteLength(data);
            }

            var requestOptions = {
                host: hostname,
                port: port,
                path: (basepath + urlParts.pathname + (urlParts.search || '')).replace(/^\/+/, '/'),
                method: method,
                headers: headers,
                body: data
            };

            var requestHandler = isHttps ? https : http;

            var request = requestHandler.request(
                requestOptions,
                options.callback || callback);


            request.on('error', errback || noOp);

            if (data)
            {
                request.write(data);
            }

            request.end();
        }
    };
}

exports.create = createCors;
