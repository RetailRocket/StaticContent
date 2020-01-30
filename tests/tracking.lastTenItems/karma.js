module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/Tracking/rrLibrary.js',
            'src/Tracking/lastTenItems.js',
            'tests/tracking.lastTenItems/tests.lastTenItems.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
