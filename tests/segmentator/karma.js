
module.exports = function (config)
{
    config.set({

        files: [
            'bin/Content/JavaScript/retailrocket.segmentator.js',
            'tests/testHelper.js',
            'tests/segmentator/specs.js'
        ],
        logLevel: config.LOG_DEBUG
    });
};
