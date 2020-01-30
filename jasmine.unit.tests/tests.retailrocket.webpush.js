/* global retailrocket */
global.retailrocket = require('./retailrocket.fakeModule');
require('../src/retailrocket/retailrocket.webpush.js');

const jasmineHelpers = require('./jasmineHelpers.js');
// eslint-disable-next-line no-undef
const promise = Promise; // es6-lint-fix

describe('Retail Rocket webpush module.', () =>
{
    function createSut(
        {
            partnerSettingsClientMock = createPartnerSettingsClientMock({}),
            windowMock = createWindowMock({}),
            cookiesMock = createCookiesMock({}),
            trackingMock = createTrackingMock({})
        })
    {
        let execute = function ()
        {};

        const rrApiMock = {
            _initialize: {
                subscribe: function (func)
                {
                    execute = func;
                }
            }
        };
        const utilsMock = {
            base64StringToUint8Array: (key) => key,
            getUint8Array: (data) => data,
            htmlEncode: (data) => data
        };
        const apiMock = {
            getPartnerId: function ()
            {
                return jasmineHelpers.randomStringValue({ prefix: 'partnerId_' });
            }
        };

        retailrocket.modules.webpush(
            rrApiMock,
            windowMock,
            partnerSettingsClientMock,
            trackingMock,
            cookiesMock,
            utilsMock,
            apiMock);

        return {
            execute: execute
        };
    }

    function createPartnerSettingsClientMock(
        {
            isSuccess = true,
            partnerSettings = createPartnerSettings({})
        })
    {
        return {
            getPartnerSettings: function (partnerId, callback, errback)
            {
                if (isSuccess)
                {
                    callback(partnerSettings);
                }
                else
                {
                    errback(partnerSettings);
                }
            }
        };
    }

    function createPartnerSettings(
        {
            keyLength = 0,
            emptyServiceWorkerUrl = jasmineHelpers.randomStringValue({ prefix: 'emptyServiceWorkerUrl_' }),
            webPushServiceWorkerUrl = jasmineHelpers.randomStringValue({ prefix: 'webPushServiceWorkerUrl_' })
        })
    {
        return {
            emptyServiceWorkerUrl: emptyServiceWorkerUrl,
            webPushServiceWorkerUrl: webPushServiceWorkerUrl,
            publicKey: {
                byteLength: keyLength
            }
        };
    }

    function createWindowMock(
        {
            navigator = createWindowNavigatorMock({}),
            includePushManager = true,
            supportsPromise = true
        })
    {
        let result = {
            navigator: navigator,
            Promise: supportsPromise ? promise : null
        };
        if (includePushManager)
        {
            result.PushManager = {};
        }
        return result;
    }

    function createWindowNavigatorMock({pushManager = createPushManager({})})
    {
        return {
            serviceWorker: {
                register: function ()
                {
                    return promise.resolve({
                        pushManager: pushManager
                    });
                }
            }
        };
    }

    function createPushManager(
        {
            pushSubscriptionGet = createPushSubscription({}),
            pushSubscriptionSubscribe = createPushSubscription({})
        })
    {
        return {
            getSubscription: () => promise.resolve(pushSubscriptionGet),
            subscribe: () => promise.resolve(pushSubscriptionSubscribe)
        };
    }

    function createPushSubscription({keyLength = 0, isUnsubscriptionSuccessful = true})
    {
        return {
            options: {
                applicationServerKey: {
                    byteLength: keyLength
                }
            },
            unsubscribe: function ()
            {
                return promise.resolve(isUnsubscriptionSuccessful);
            },
            toJSON: () =>
            {
                return {
                    endpoint: jasmineHelpers.randomStringValue({ prefix: 'pushSubscriptionId_' })
                };
            }
        };
    }

    function createCookiesMock({isSwUpdated: isSwUpdated = true, isWebPushSubscriptionSaved = true })
    {
        return {
            getWebPushSwUpdated: () => isSwUpdated,
            setOnRootWebPushSwUpdated: () =>
            { },
            setOnRootWebPushSubscriptionSaved: () =>
            {},
            getWebPushSubscriptionSaved: () => isWebPushSubscriptionSaved
        };
    }

    function createTrackingMock({})
    {
        return {
            webPushSubscription: function (options)
            {
                options.onSuccessCallback();
            }
        };
    }

    describe('Invalid partner settings.', () =>
    {
        it('Returns error if no partner settings exists.', (done) =>
        {
            const partnerSettingsClientMock = createPartnerSettingsClientMock({isSuccess: true, partnerSettings: null});

            const sut = createSut({partnerSettingsClientMock: partnerSettingsClientMock});

            sut.execute()
                .then(
                    (error) =>
                    {
                        expect(error).toContain('no partner settings');
                        done();
                    },
                    () => done.fail(new Error('promise should have not been rejected')));
        });

        it('Returns error if no partner settings has no public key.', (done) =>
        {
            const partnerSettingsClientMock = createPartnerSettingsClientMock({isSuccess: true, partnerSettings: {}});

            const sut = createSut({partnerSettingsClientMock: partnerSettingsClientMock});

            sut.execute()
                .then(
                    (error) =>
                    {
                        expect(error).toContain('no public key found');
                        done();
                    },
                    () => done.fail(new Error('promise should have not been rejected')));
        });

        it('Returns error if workers urls are same.', (done) =>
        {
            const sameUrl = jasmineHelpers.randomUrl();
            const partnerSettings = createPartnerSettings(
                {
                    emptyServiceWorkerUrl: sameUrl,
                    webPushServiceWorkerUrl: sameUrl
                });
            const partnerSettingsClientMock = createPartnerSettingsClientMock({isSuccess: true, partnerSettings: partnerSettings});

            const sut = createSut({partnerSettingsClientMock: partnerSettingsClientMock});

            sut.execute()
                .then(
                    (error) =>
                    {
                        expect(error).toContain('service workers urls must be different');
                        done();
                    },
                    () => done.fail(new Error('promise should have not been rejected')));
        });
    });

    describe('Required features are not supported.', () =>
    {
        it('Returns error if service worker not supported.', (done) =>
        {
            const windowMock = createWindowMock({navigator: {}});

            const sut = createSut({windowMock: windowMock});

            sut.execute()
                .then(
                    (error) =>
                    {
                        expect(error).toContain('service worker not supported');
                        done();
                    },
                    () => done.fail(new Error('promise should have not been rejected')));
        });

        it('Returns error if push not supported.', (done) =>
        {
            const windowMock = createWindowMock({includePushManager: false});

            const sut = createSut({windowMock: windowMock});

            sut.execute()
                .then(
                    (error) =>
                    {
                        expect(error).toContain('push is not supported');
                        done();
                    },
                    () => done.fail(new Error('promise should have not been rejected')));
        });

        it('Returns error if Promise not supported', (done) =>
        {
            const windowMock = createWindowMock({supportsPromise: false});

            const sut = createSut({windowMock: windowMock});

            expect(sut.execute()).toBeFalsy();
            done();
        });
    });

    describe('Register service worker.', () =>
    {
        it('Registers service worker.', (done) =>
        {
            const partnerSettings = createPartnerSettings({});
            const partnerSettingsClientMock = createPartnerSettingsClientMock({partnerSettings: partnerSettings});
            const windowMock = createWindowMock({});
            const cookiesMock = createCookiesMock({ isSwUpdated: true });
            const registerSpy = spyOn(windowMock.navigator.serviceWorker, 'register')
                .and
                .returnValue(promise.resolve({}));

            const sut = createSut({
                partnerSettingsClientMock: partnerSettingsClientMock,
                windowMock: windowMock,
                cookiesMock: cookiesMock
            });

            function assert()
            {
                expect(registerSpy).toHaveBeenCalledWith(partnerSettings.webPushServiceWorkerUrl);
                done();
            }

            sut.execute().then(
                assert,
                assert);
        });

        it('Registers empty service worker if did not update first time.', (done) =>
        {
            const partnerSettings = createPartnerSettings({});
            const partnerSettingsClientMock = createPartnerSettingsClientMock({partnerSettings: partnerSettings});
            const windowMock = createWindowMock({});
            const cookiesMock = createCookiesMock({isSwUpdated: false});

            const sut = createSut({
                partnerSettingsClientMock: partnerSettingsClientMock,
                windowMock: windowMock,
                cookiesMock: cookiesMock
            });

            const registerSpy = spyOn(windowMock.navigator.serviceWorker, 'register')
                .and
                .returnValue(promise.resolve({}));

            const cookiesSetSpy = spyOn(cookiesMock, 'setOnRootWebPushSwUpdated');

            function assert()
            {
                const expectedArgs = [
                    [partnerSettings.webPushServiceWorkerUrl],
                    [partnerSettings.emptyServiceWorkerUrl],
                    [partnerSettings.webPushServiceWorkerUrl]
                ];

                expect(cookiesSetSpy).toHaveBeenCalled();

                expect(registerSpy.calls.allArgs()).toEqual(expectedArgs);
                done();
            }

            sut.execute().then(
                assert,
                assert);
        });
    });

    describe('User is already subscribed by foreign public key.', () =>
    {
        const existingSubscriptionKeyLength = 0;
        const newSubscriptionKeyLength = existingSubscriptionKeyLength + 1;

        const partnerSettings = createPartnerSettings({keyLength: newSubscriptionKeyLength});
        const partnerSettingsClientMock = createPartnerSettingsClientMock({partnerSettings: partnerSettings});

        function createWindowMockByPushSubscription({pushSubscription})
        {
            const pushManagerMock = createPushManager({pushSubscriptionGet: pushSubscription});
            const navigatorMock = createWindowNavigatorMock({pushManager: pushManagerMock});
            return  createWindowMock({navigator: navigatorMock});
        }

        it('Remove old subscription.', (done) =>
        {
            const pushSubscription = createPushSubscription({keyLength: existingSubscriptionKeyLength});
            const unsubscribeSpy = spyOn(pushSubscription, 'unsubscribe');

            const sut = createSut(
                {
                    windowMock: createWindowMockByPushSubscription({pushSubscription: pushSubscription}),
                    partnerSettingsClientMock: partnerSettingsClientMock
                });

            function assert()
            {
                expect(unsubscribeSpy).toHaveBeenCalled();
                done();
            }

            sut.execute().then(
                assert,
                assert);
        });

        it('Do nothing if can not unsubscribe.', (done) =>
        {
            const pushSubscription = createPushSubscription({keyLength: existingSubscriptionKeyLength});
            const unsubscribeSpy = spyOn(pushSubscription, 'unsubscribe')
                .and
                .returnValue(promise.resolve(false));

            const sut = createSut(
                {
                    windowMock: createWindowMockByPushSubscription({pushSubscription: pushSubscription}),
                    partnerSettingsClientMock: partnerSettingsClientMock
                });

            function assert(error)
            {
                expect(unsubscribeSpy).toHaveBeenCalled();
                expect(error).toContain('Could not unsubscribe');
                done();
            }

            sut.execute().then(
                assert,
                assert);
        });

        it('Subscribes with our key', (done) =>
        {
            const pushSubscription = createPushSubscription({keyLength: existingSubscriptionKeyLength});
            const pushManagerMock = createPushManager({pushSubscriptionGet: pushSubscription});
            const navigatorMock = createWindowNavigatorMock({pushManager: pushManagerMock});
            const windowMock = createWindowMock({navigator: navigatorMock});
            const subscribeSpy = spyOn(pushManagerMock, 'subscribe')
                .and
                .returnValue(promise.resolve());

            const sut = createSut(
                {
                    windowMock: windowMock,
                    partnerSettingsClientMock: partnerSettingsClientMock
                });

            function assert()
            {
                expect(subscribeSpy).toHaveBeenCalled();
                done();
            }

            sut.execute().then(
                assert,
                assert);
        });

        it('Tracks subscription.', (done) =>
        {
            const trackingMock = createTrackingMock({});
            const trackingSpy = spyOn(trackingMock, 'webPushSubscription');
            const pushSubscription = createPushSubscription({keyLength: existingSubscriptionKeyLength});

            const sut = createSut(
                {
                    windowMock: createWindowMockByPushSubscription({pushSubscription: pushSubscription}),
                    partnerSettingsClientMock: partnerSettingsClientMock,
                    trackingMock: trackingMock
                });

            sut.execute()
                .then(
                    () =>
                    {
                        expect(trackingSpy).toHaveBeenCalled();
                        done();
                    },
                    (error) => new Error(error));
        });
    });

    describe('User is already subscribed by our public key.', () =>
    {
        it('Tracks subscription if not already done.', (done) =>
        {
            const trackingMock = createTrackingMock({});
            const trackingSpy = spyOn(trackingMock, 'webPushSubscription');
            const cookiesMock = createCookiesMock({isWebPushSubscriptionSaved: false});

            const sut = createSut(
                {
                    trackingMock: trackingMock,
                    cookiesMock: cookiesMock
                });

            sut.execute()
                .then(
                    () =>
                    {
                        expect(trackingSpy).toHaveBeenCalled();
                        done();
                    },
                    (error) => new Error(error));
        });
    });

    describe('User is not subscribed.', () =>
    {
        it('Subscribes user.', (done) =>
        {
            const newPushSubscription = createPushSubscription({});
            const pushManagerMock = createPushManager({pushSubscriptionGet: null, pushSubscriptionSubscribe: newPushSubscription});
            const navigatorMock = createWindowNavigatorMock({pushManager: pushManagerMock});
            const windowMock = createWindowMock({navigator: navigatorMock});
            const subscribeSpy = spyOn(pushManagerMock, 'subscribe')
                .and
                .returnValue(promise.resolve(newPushSubscription));

            const sut = createSut({windowMock: windowMock});

            sut.execute().then(
                () =>
                {
                    expect(subscribeSpy).toHaveBeenCalled();
                    done();
                },
                (error) => new Error(error));
        });

        it('Tracks subscription.', (done) =>
        {
            const newPushSubscription = createPushSubscription({});
            const pushManagerMock = createPushManager({pushSubscriptionGet: null, pushSubscriptionSubscribe: newPushSubscription});
            const navigatorMock = createWindowNavigatorMock({pushManager: pushManagerMock});
            const windowMock = createWindowMock({navigator: navigatorMock});
            const trackingMock = createTrackingMock({});
            const trackingSpy = spyOn(trackingMock, 'webPushSubscription');

            const sut = createSut(
                {
                    windowMock: windowMock,
                    trackingMock: trackingMock
                });

            sut.execute().then(
                () =>
                {
                    expect(trackingSpy).toHaveBeenCalled();
                    done();
                },
                (error) => new Error(error));
        });
    });
});
