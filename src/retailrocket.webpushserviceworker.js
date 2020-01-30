function createPixelProxyClickUrl(
    url,
    partnerId,
    pushMessageId)
{
    var urlWithIgnoreUtm = url;

    if (url.indexOf('?') !== -1)
    {
        urlWithIgnoreUtm = url + '&rr_ignoreutm';
    }
    else
    {
        urlWithIgnoreUtm = url + '?rr_ignoreutm';
    }

    return 'https://tracking.retailrocket.net/1.0/pixel/?' +
        'targetUrl=' + encodeURIComponent(urlWithIgnoreUtm) +
        '&partnerId=' + partnerId +
        '&trackingId=' + encodeURIComponent(pushMessageId) +
        '&channelId=webPush';
}

self.addEventListener(
    'install',
    // eslint-disable-next-line no-unused-vars
    function (event)
    {
        event.waitUntil(self.skipWaiting());
    }
);

self.addEventListener(
    'push',
    function (event)
    {
        var eventData = event.data.json();

        var webPushDeliveredUrl =
            'https://tracking.retailrocket.net/1.0/event/webPushDelivered?pushMessageId=' +
            encodeURIComponent(eventData.options.data.pushMessageId);

        event.waitUntil(
            self
                .registration
                .showNotification(eventData.title, eventData.options)
                .then(function ()
                {
                    return fetch(webPushDeliveredUrl);
                }));
    }
);

self.addEventListener(
    'notificationclick',
    function (event)
    {
        var clickedNotification = event.notification;

        clickedNotification.close();

        var landingUrl = createPixelProxyClickUrl(
            event.notification.data.landingUrl,
            event.notification.data.partnerId,
            event.notification.data.pushMessageId
        );

        // eslint-disable-next-line no-undef
        event.waitUntil(clients.openWindow(landingUrl));
    }
);
