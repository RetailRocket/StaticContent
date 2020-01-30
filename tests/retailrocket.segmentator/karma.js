module.exports = function (config)
{
    config.set({
        files: [
            'tests/retailrocket.fakeModule.js',
            'src/retailrocket/retailrocket.segmentator.js',
            'tests/retailrocket.segmentator/tests.retailrocket.segmentator.js'
        ],
        proxies: {
            '/bin/Content/JavaScript/': 'http://localhost:9876/base/bin/Content/JavaScript/'
        }
    });
};
