var retailrocket = window["retailrocket"] || {};

retailrocket.segmentator = (function () {
    var visitorSegmenRecordCookieName = "rr-VisitorSegment";

    var rrLibrary = {
        getCookie: function (cName) {
            var i, x, y, arRcookies = document.cookie.split(";");
            for (i = 0; i < arRcookies.length; i++) {
                x = arRcookies[i].substr(0, arRcookies[i].indexOf("="));
                y = arRcookies[i].substr(arRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == cName) {
                    return unescape(y);
                }
            }
            return null;
        },
        daysToSecond: function (days) {
            return days * 24 * 60 * 60;
        },
        setCookie: function (cName, value, expireInSecond, path) {
            var exdate = new Date();
            exdate.setSeconds(exdate.getSeconds() + expireInSecond);
            var cValue = escape(value) + ((expireInSecond == null) ? "" : "; expires=" + exdate.toUTCString()) + (";path=" + (path || "/"));
            document.cookie = cName + "=" + cValue;
        }
    };

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function getVisitorSegment(nSegment, option) {
        option = option || {};
        var visitorSegmentRecord = rrLibrary.getCookie(visitorSegmenRecordCookieName);
        if (!visitorSegmentRecord || visitorSegmentRecord.split(":")[0] != nSegment) {
            visitorSegmentRecord = nSegment + ":" + randomInt(1, nSegment);
        }
        rrLibrary.setCookie(visitorSegmenRecordCookieName, visitorSegmentRecord, rrLibrary.daysToSecond(option.expireInDay || 60), "/");
        return visitorSegmentRecord.split(":")[1];
    };

    function getPseudoNamedSegment(distribution, option) {
        var dict = [];
        var numericDistribution = [];
        for (var n in distribution) {
            dict.push(n)
            numericDistribution.push(distribution[n]);
        }
        var numericSegment = getPseudoSegment(numericDistribution, option);
        return dict[numericSegment - 1];
    }

    function getPseudoSegment(distribution, option) {
            var nSegment = 0;
            for(var s = 0; s < distribution.length; s++)
                nSegment += distribution[s];

            var naturalSegment = getVisitorSegment(nSegment, option);
            var sum = 0;
            for(var pseudoSegment = 1; pseudoSegment <= distribution.length; pseudoSegment++) {
                var size = distribution[pseudoSegment - 1];
                for(var s = 1; s <= size; s++) {
                    if(sum + s == naturalSegment)
                        return pseudoSegment;
                }
                sum += size;
            }
        }

    return {
        getVisitorSegment: getVisitorSegment,
        getPseudoSegment: getPseudoSegment,
        getPseudoNamedSegment: getPseudoNamedSegment
    };
}());