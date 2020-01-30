const url = require('url');

function randomStringValue(option)
{
    return option.prefix + (new Date()).getTime().toString();
}

function array(func, count = 5)
{
    return Array.from(Array(count), (_, x) => func(x));
}

function randomInt(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool()
{
    return randomInt(0, 10) > 5;
}

function randomUrl()
{
    return 'https://retailrocket.net/' + randomStringValue({prefix: ''}) + '?rnd=' + randomStringValue({prefix: ''});
}

module.exports = {
    randomObject: function (propCount)
    {
        var propName;
        var propValue;

        var count = propCount || 5;
        var obj = {};
        for (var i = 0; i < count; i++)
        {
            propName = randomStringValue({prefix: 'prop' + i});
            propValue = randomStringValue({prefix: 'value' + i});
            obj[propName] = propValue;
        }

        return obj;
    },
    randomStringValue: randomStringValue,
    randomInt: randomInt,
    randomBool: randomBool,
    randomUrl: randomUrl,
    array: array,
    urlTester: function (option)
    {
        return {
            asymmetricMatch: function (actual)
            {
                var uri = url.parse(actual, true);

                if (('host' in option && option.host !== uri.host))
                {
                    // eslint-disable-next-line no-console
                    console.error('UrlTester: expected host: "' + option.host + '" but actualy was"' + uri.host + '"');
                    return false;
                }

                if (('pathname' in option && option.pathname !== uri.pathname))
                {
                    // eslint-disable-next-line no-console
                    console.error('UrlTester: expected path "' + option.pathname + '" but actualy was "' + uri.pathname + '"');
                    return false;
                }

                for (var key in option.query)
                {
                    if (option.query[key] !== uri.query[key])
                    {
                        // eslint-disable-next-line no-console
                        console.error('UrlTester: url doesn\'t contain query parameter:' + key);
                        return false;
                    }
                }

                return true;
            }
        };
    }
};
