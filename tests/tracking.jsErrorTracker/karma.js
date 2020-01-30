module.exports = function (config)
{
    config.set({
        files: [
            'tests/tracking.jsErrorTracker/.source.jsErrorTracker.js',
            'tests/tracking.jsErrorTracker/tests.jsErrorTracker.js'
        ],
        proxies: {
            '/tests/tracking.jsErrorTracker': 'http://localhost:9876/base/tests/tracking.jsErrorTracker'
        }
    });
};
