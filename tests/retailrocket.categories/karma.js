module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/retailrocket/retailrocket.categories.js',
            'tests/retailrocket.categories/tests.retailrocket.categories.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
