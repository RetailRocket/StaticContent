module.exports = function (config)
{
    config.set({
        files: [
            'bin/Content/retailrocket/retailrocket.module.js',
            'tests/retailrocket.module/tests.retailrocket.module.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
