module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/Tracking/rrLibrary.js',
            'src/Tracking/apiInit.js',
            'src/Tracking/localLog.js',
            'tests/tracking.localLog/tests.localLog.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
