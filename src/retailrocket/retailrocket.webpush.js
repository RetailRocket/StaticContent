// eslint-disable-next-line no-undef
retailrocket.setModule(
    'webpush',
    ['rrApi', 'window', 'partnerSettingsClient', 'tracking', 'cookies', 'utils', 'api'],
    function (rrApi, $window, partnerSettingsClient, tracking, cookies, utils, api)
    {
        var webPushSubscriptionSavedCookieExpirationInSeconds = 24 * 60 * 60;
        var webPushSwUpdatedExpirationInSeconds = 5 * 60;
        var $Promise = $window.Promise;

        function isPromiseSupported()
        {
            return !(typeof $Promise === 'undefined' || $Promise === null);
        }

        function isWebPushSupported()
        {
            var isServiceWorkerSupported = 'serviceWorker' in $window.navigator;
            var isPushSupported = 'PushManager' in $window;

            if (!isServiceWorkerSupported) return $Promise.reject('service worker not supported');

            if (!isPushSupported) return $Promise.reject('push is not supported');

            return $Promise.resolve();
        }

        function getPartnerSettings()
        {
            return new $Promise(function (resolve, reject)
            {
                partnerSettingsClient.getPartnerSettings(
                    api.getPartnerId(),
                    function (settings)
                    {
                        resolve(settings);
                    },
                    function (error)
                    {
                        reject(error);
                    });
            });
        }

        function validatePartnerSettings(partnerSettings)
        {
            var partnerSettingsAbsent = partnerSettings === null || typeof (partnerSettings) === 'undefined';
            if (partnerSettingsAbsent)
            {
                return $Promise.reject('no partner settings');
            }

            if (partnerSettings.publicKey === null || typeof (partnerSettings.publicKey) === 'undefined' )
            {
                return $Promise.reject('no public key found');
            }

            if (partnerSettings.emptyServiceWorkerUrl === partnerSettings.webPushServiceWorkerUrl)
            {
                return $Promise.reject('service workers urls must be different');
            }

            return partnerSettings;
        }

        function arePublicKeysEqual(vapidPublicKey1, vapidPublicKey2)
        {
            if (vapidPublicKey1.byteLength !== vapidPublicKey2.byteLength) return false;

            var array1 = utils.getUint8Array(vapidPublicKey1);
            var array2 = utils.getUint8Array(vapidPublicKey2);

            for (var i = 0; i !== vapidPublicKey1.byteLength; i++)
            {
                if (array1[i] !== array2[i]) return false;
            }

            return true;
        }

        function trackSubscription(subscription)
        {
            var subscriptionId = utils.htmlEncode(subscription.toJSON().endpoint);
            tracking.webPushSubscription({
                subscriptionId: subscriptionId,
                subscription: subscription,
                onSuccessCallback: function ()
                {
                    cookies.setOnRootWebPushSubscriptionSaved(webPushSubscriptionSavedCookieExpirationInSeconds);
                }
            });

            return $Promise.resolve();
        }

        function isSubscriptionSaved()
        {
            return cookies.getWebPushSubscriptionSaved();
        }

        function isServiceWorkerUpdated()
        {
            return cookies.getWebPushSwUpdated();
        }

        function registerEmptyWorker(partnerSettings)
        {
            return $window.navigator.serviceWorker.register(partnerSettings.emptyServiceWorkerUrl);
        }

        function registerServiceWorker(partnerSettings)
        {
            return $window.navigator.serviceWorker.register(partnerSettings.webPushServiceWorkerUrl);
        }

        function getServiceWorkerRegistration(partnerSettings)
        {
            return registerServiceWorker(partnerSettings)
                .then(function (registration)
                {
                    if (!isServiceWorkerUpdated())
                    {
                        return registerEmptyWorker(partnerSettings)
                            .then(function ()
                            {
                                return registerServiceWorker(partnerSettings);
                            })
                            .then(function (newRegistration)
                            {
                                cookies.setOnRootWebPushSwUpdated(webPushSwUpdatedExpirationInSeconds);
                                return {
                                    partnerSettings: partnerSettings,
                                    registration: newRegistration
                                };
                            });
                    }

                    return {
                        partnerSettings: partnerSettings,
                        registration: registration
                    };
                });
        }

        function subscribeAndTrackSubscription(
            serviceWorkerRegistration,
            encodedKey)
        {
            return serviceWorkerRegistration.pushManager
                .subscribe(
                    {
                        userVisibleOnly: true,
                        applicationServerKey: encodedKey
                    })
                .then(trackSubscription);
        }

        function execute()
        {
            if (!isPromiseSupported())
            {
                return false;
            }

            return isWebPushSupported()
                .then(getPartnerSettings)
                .then(validatePartnerSettings)
                .then(function (pushPartnerSettings)
                {
                    return getServiceWorkerRegistration(pushPartnerSettings)
                        .then(function (serviceWorkerRegistrationContext)
                        {
                            var registration = serviceWorkerRegistrationContext.registration;
                            var partnerSettings = serviceWorkerRegistrationContext.partnerSettings;
                            return registration
                                .pushManager
                                .getSubscription()
                                .then(function (subscription)
                                {
                                    var isSubscribed = subscription !== null;
                                    var encodedKey = utils.base64StringToUint8Array(partnerSettings.publicKey);

                                    if (isSubscribed === true)
                                    {
                                        var isSubscribedByCurrentKey = arePublicKeysEqual(
                                            subscription.options.applicationServerKey,
                                            utils.base64StringToUint8Array(partnerSettings.publicKey));

                                        if (!isSubscribedByCurrentKey)
                                        {
                                            return subscription
                                                .unsubscribe()
                                                .then(function (isSuccessful)
                                                {
                                                    if (isSuccessful === true)
                                                    {
                                                        return $Promise.resolve();
                                                    }

                                                    return $Promise.reject('Could not unsubscribe');
                                                })
                                                .then(function ()
                                                {
                                                    return subscribeAndTrackSubscription(
                                                        registration,
                                                        encodedKey);
                                                });
                                        }

                                        if (!isSubscriptionSaved())
                                        {
                                            return trackSubscription(subscription);
                                        }

                                        return $Promise.resolve();
                                    }

                                    return subscribeAndTrackSubscription(
                                        registration,
                                        encodedKey);
                                });
                        });
                },
                function (error)
                {
                    return error;
                });
        }

        rrApi._initialize.subscribe(execute);

        return {};
    });
