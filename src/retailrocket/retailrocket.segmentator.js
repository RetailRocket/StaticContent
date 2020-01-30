// eslint-disable-next-line no-undef
retailrocket.setModule('segmentator', ['cookies'], function (cookies)
{
    function randomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getVisitorSegment(nSegment, option)
    {
        // eslint-disable-next-line no-param-reassign
        option = option || {};
        var visitorSegmentRecord = cookies.getVisitorSegmenRecordCookie(option.cookieName);
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (!visitorSegmentRecord || visitorSegmentRecord.split(':')[0] != nSegment)
        {
            visitorSegmentRecord = nSegment + ':' + randomInt(1, nSegment);
        }
        cookies.setOnRootVisitorSegmenRecordCookie(option.cookieName, visitorSegmentRecord, option.expireInDay);
        return visitorSegmentRecord.split(':')[1];
    }

    function getPseudoNamedSegment(distribution, option)
    {
        var dict = [];
        var numericDistribution = [];
        for (var n in distribution)
        {
            if (!{}.hasOwnProperty.call(distribution, n))
            {
                continue;
            }
            dict.push(n);
            numericDistribution.push(distribution[n]);
        }
        var numericSegment = getPseudoSegment(numericDistribution, option);
        return dict[numericSegment - 1];
    }

    // eslint-disable-next-line consistent-return
    function getPseudoSegment(distribution, option)
    {
        var nSegment = 0;
        for (var i = 0; i < distribution.length; i++)
        {
            nSegment += distribution[i];
        }

        var naturalSegment = getVisitorSegment(nSegment, option);
        var sum = 0;
        for (var pseudoSegment = 1; pseudoSegment <= distribution.length; pseudoSegment++)
        {
            var size = distribution[pseudoSegment - 1];
            for (var s = 1; s <= size; s++)
            {
                // eslint-disable-next-line eqeqeq
                if (sum + s == naturalSegment)
                {
                    return pseudoSegment;
                }
            }
            sum += size;
        }
    }

    return {
        getVisitorSegment: getVisitorSegment,
        getPseudoSegment: getPseudoSegment,
        getPseudoNamedSegment: getPseudoNamedSegment,
        useNs: true
    };
});
