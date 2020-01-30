module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/retailrocket/retailrocket.dev.js',
            'tests/retailrocket.dev/tests.retailrocket.dev.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
