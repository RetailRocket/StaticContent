module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'bin/Content/retailrocket/retailrocket.utils.js',
            'bin/Content/retailrocket/retailrocket.timing.js',
            'tests/retailrocket.timing/tests.retailrocket.timing.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
