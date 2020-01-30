/* global retailrocket*/
describe('Segmentator tests', function ()
{
    function resetSegmentator()
    {
        retailrocket.segmentator.getVisitorSegment(-1);
    }

    describe('Obtained segment', function ()
    {
        var segment;
        var segmentNumber = 4;

        beforeEach(function ()
        {
            resetSegmentator();
            segment = retailrocket.segmentator.getVisitorSegment(segmentNumber);
        });

        it('is always positive', function ()
        {
            expect(segment).toBeGreaterThan(0);
        });

        it('is less or equal to segments number', function ()
        {
            expect(segment).toBeLessThan(segmentNumber + 1);
        });

        it('is constant', function ()
        {
            var attempts = 10;
            for (var i = 0; i < attempts; i++)
            {
                var s = retailrocket.segmentator.getVisitorSegment(segmentNumber);
                expect(s).toBe(segment);
            }
        });

        it('is uniform', function ()
        {
            var attempts = 10000;
            var n = [];

            for (var i = 1; i <= segmentNumber; i++)
            {
                n[i] = 0;
            }

            for (var j = 0; j < attempts; j++)
            {
                resetSegmentator();
                var s = retailrocket.segmentator.getVisitorSegment(segmentNumber);
                n[s]++;
            }

            // perfect result is 5000/5000
            // difference between segments must be less than 2%
            for (var k = 1; k <= segmentNumber; k++)
            {
                expect(n[k]).toBeLessThan(attempts / segmentNumber + attempts / 50);
            }
        });
    });

    describe('Obtained pseudo-segment', function ()
    {
        var segment;
        var distribution = [1, 2, 2];

        beforeEach(function ()
        {
            resetSegmentator();
            segment = retailrocket.segmentator.getPseudoSegment(distribution);
        });

        it('is always positive', function ()
        {
            expect(segment).toBeGreaterThan(0);
        });

        it('is less or equal to pseudo-segments number', function ()
        {
            expect(segment).toBeLessThan(distribution.length + 1);
        });

        it('is constant', function ()
        {
            var attempts = 10;
            for (var i = 0; i < attempts; i++)
            {
                var s = retailrocket.segmentator.getPseudoSegment(distribution);
                expect(s).toBe(segment);
            }
        });

        it('is proportional', function ()
        {
            var attempts = 10000;
            var n = [];
            var sum = 0;

            for (var i = 1; i <= distribution.length; i++)
            {
                n[i] = 0;
                sum += distribution[i - 1];
            }

            for (var j = 0; j < attempts; j++)
            {
                resetSegmentator();
                var s = retailrocket.segmentator.getPseudoSegment(distribution);
                n[s]++;
            }

            // perfect result is 2000/4000/4000
            // difference between segments must be less than 2%
            for (var k = 1; k <= distribution.length; k++)
            {
                expect(n[k]).toBeGreaterThan(attempts / sum * distribution[k - 1] - attempts / 50);
            }
        });
    });
});
