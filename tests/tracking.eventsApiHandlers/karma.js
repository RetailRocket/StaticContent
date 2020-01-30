module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/Tracking/rrLibrary.js',
            'tests/fakeRrApi.js',
            'src/Tracking/eventsApiHandlers.js',
            'tests/tracking.eventsApiHandlers/tests.eventsApiHandlers.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
