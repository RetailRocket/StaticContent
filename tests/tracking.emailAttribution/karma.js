module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/Tracking/rrLibrary.js',
            'src/Tracking/emailAttribution.js',
            'tests/tracking.emailAttribution/tests.emailAttribution.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
