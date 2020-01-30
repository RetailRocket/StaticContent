/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.elementViewedObserver.js');

function createWindow(observer)
{
    var htmlElement;
    var handler;
    observer.observe = function (e)
    {
        htmlElement = e;
    };

    var $window =
    {
        IntersectionObserver: function (cb)
        {
            handler = cb;
            return observer;
        },
        intersect: function (isIntersecting)
        {
            var entry =
            {
                isIntersecting: isIntersecting,
                target: htmlElement
            };

            handler(
                [entry],
                observer);
        },
        Function: function ()
        {
        }
    };

    return $window;
}

describe('Retail Rocket element observer module:', function ()
{
    it('call tracking when element has been viewed and unobserve', function ()
    {
        var observerMock =
        {
            unobserve: jasmine.createSpy('unobserve')
        };

        var windowStub = createWindow(observerMock);

        var sut = retailrocket.modules.elementViewedObserver(windowStub);

        var element = {};

        var callback = jasmine.createSpy('callback');

        sut.observe(
            {
                htmlElement: element,
                callback: callback
            });

        windowStub.intersect(true);

        expect(callback).toHaveBeenCalled();
        expect(observerMock.unobserve).toHaveBeenCalledWith(element);
    });
});
