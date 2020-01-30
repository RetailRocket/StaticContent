// eslint-disable-next-line no-undef
retailrocket.setModule(
    'json',
    [],
    function ()
    {
        function stringify(options)
        {
            var arrayToJson = Array.prototype.toJSON;
            delete Array.prototype.toJSON;
            var result = JSON.stringify(options.obj);
            // что бы не добавлять поле если его небыло
            if (arrayToJson)
            {
                // eslint-disable-next-line no-extend-native
                Array.prototype.toJSON = arrayToJson;
            }
            return result;
        }

        function parse(options)
        {
            return JSON.parse(options.jsonString);
        }

        return {
            stringify: stringify,
            parse: parse,
            ns: false
        };
    });
