/* global retailrocket*/
(function ()
{
    'use strict';

    describe('Widget module', function ()
    {
        describe('Formatting number', function ()
        {
            var sut = retailrocket.modules.widget({}, {}, {}, {}, {}, { pushTrackingCall: function () { }, getPartnerId: function () { } }, {}, {}, {});// eslint-disable-line brace-style

            it('10000000.87->10 000 000.87', function ()
            {
                var actual = sut.formatNumber(10000000.87, '.', ' ');
                expect(actual).toEqual('10 000 000.87');
            });

            it('10000000.87->10.000.000,87', function ()
            {
                var actual = sut.formatNumber(10000000.87, ',', '.');
                expect(actual).toEqual('10.000.000,87');
            });
        });

        describe('TimeOut Widget', function ()
        {
            var qs;
            var gebid;

            beforeEach(function ()
            {
                document.cookie.split(';').forEach(function (c)
                {
                    document.cookie = c.replace(/^ +/, '').replace(/\=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                });
                jasmine.clock().install();
                qs = document.querySelectorAll;
                gebid = document.getElementById;
            });

            afterEach(function ()
            {
                jasmine.clock().uninstall();
                document.querySelectorAll = qs;
                document.getElementById = gebid;
            });


            var cookiesStub = {
                setDeactivatedFlagCookie: function ()
                {
                },
                getDeactivatedFlagCookie: function ()
                {
                },
                cookieNames: {
                    deactivatedFlagCookieName: 'rrtwdf'
                }
            };

            var apiStub = {
                pushTrackingCall: function ()
                { },
                getPartnerId: function ()
                { }
            };

            it('shown', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                jasmine.clock().tick(1);
                expect(div.getAttribute('class')).toMatch(/retailrocket-timeout-widget-show/);
            });

            it('should not show if active === false', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');
                div.setAttribute('active', 'false');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                jasmine.clock().tick(1);
                expect(div.getAttribute('class')).not.toMatch(/retailrocket-timeout-widget-show/);
            });

            it('should show if active === true', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');
                div.setAttribute('active', 'true');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                jasmine.clock().tick(1);
                expect(div.getAttribute('class')).toMatch(/retailrocket-timeout-widget-show/);
            });

            it('force ignores the active attribute', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');
                div.setAttribute('active', 'false');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                sut.show(true);
                jasmine.clock().tick(1);
                expect(div.getAttribute('class')).toMatch(/retailrocket-timeout-widget-show/);
            });

            it('timer is work', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '1');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();

                expect(div.getAttribute('class')).not.toMatch(/retailrocket-timeout-widget-show/);
                jasmine.clock().tick(1000);
                expect(div.getAttribute('class')).toMatch(/retailrocket-timeout-widget-show/);
            });

            it('on show event', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');
                div.setAttribute('data-retailrocket-timeout-on-show', 'window[\'show\']=1');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();

                jasmine.clock().tick(1);
                expect(window.show).toEqual(1);
            });

            it('hide is work',
                function ()
                {
                    var div = document.createElement('div');
                    div.setAttribute('data-retailrocket-timeout-sec', '0');

                    var utilsStub = {
                        getElementsByClassName: function (className)
                        {
                            if (className === 'retailrocket-timeout-widget')
                            {
                                return [div];
                            }
                            return null;
                        }
                    };

                    var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                    sut.initialize();
                    jasmine.clock().tick(1);
                    expect(div.getAttribute('class')).toMatch(/retailrocket-timeout-widget-show/);
                    sut.hide();
                    expect(div.getAttribute('class')).not.toMatch(/retailrocket-timeout-widget-show/);
                }
            );


            it('on hide event', function ()
            {
                var div = document.createElement('div');
                div.setAttribute('data-retailrocket-timeout-sec', '0');
                div.setAttribute('data-retailrocket-timeout-on-hide', 'window[\'hide\']=2');

                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === 'retailrocket-timeout-widget')
                        {
                            return [div];
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                jasmine.clock().tick(1);
                sut.hide();
                expect(window.hide).toEqual(2);
            });

            describe('deactivate',
                function ()
                {
                    var div = document.createElement('div');
                    div.setAttribute('data-retailrocket-timeout-sec', '0');

                    var utilsStub = {
                        getElementsByClassName: function (className)
                        {
                            if (className === 'retailrocket-timeout-widget')
                            {
                                return [div];
                            }
                            return null;
                        }
                    };

                    it('deactivate is work',
                        function ()
                        {
                            spyOn(cookiesStub, 'getDeactivatedFlagCookie');

                            var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                            sut.initialize();
                            sut.deactivate();
                            jasmine.clock().tick(1);
                            expect(div.getAttribute('class')).not.toMatch(/\S+retailrocket-timeout-widget-show/);
                            expect(cookiesStub.getDeactivatedFlagCookie).toHaveBeenCalled();
                        }
                    );

                    it('set deactivatedFlagCookie',
                        function ()
                        {
                            spyOn(cookiesStub, 'setDeactivatedFlagCookie');

                            var sut = retailrocket.modules.timeOutWidget({}, utilsStub, apiStub, cookiesStub);

                            sut.initialize();
                            sut.deactivate();
                            expect(cookiesStub.setDeactivatedFlagCookie).toHaveBeenCalledWith(true);
                        }
                    );
                });
        });

        describe('Mail Request Form',
            function ()
            {
                var classNameSelector = 'retailrocket-mailrequest-form';

                var qs;
                var gebid;

                beforeEach(function ()
                {
                    qs = document.querySelectorAll;
                    gebid = document.getElementById;
                });

                afterEach(function ()
                {
                    document.querySelectorAll = qs;
                    document.getElementById = gebid;
                });

                it('windget sent right data', function ()
                {
                    var emailInputId1 = 'emailInputId1';
                    var sentBtnId1 = 'sentBtnId1';
                    var checkBoxId1 = 'checkBoxId1';
                    var productToSendWidgetId1 = 'productToSendWidgetId1';

                    var div1 = document.createElement('div');
                    div1.setAttribute('data-email-input-id', emailInputId1);
                    div1.setAttribute('data-send-btn-id', sentBtnId1);
                    div1.setAttribute('data-subscribe-on-trigger-email-checkbox-id', checkBoxId1);
                    div1.setAttribute('data-product-to-send-widget-id', productToSendWidgetId1);

                    var emailInputId2 = 'emailInputId2';
                    var sentBtnId2 = 'sentBtnId2';
                    var checkBoxId2 = 'checkBoxId2';
                    var productToSendWidgetId2 = 'productToSendWidgetId2';

                    var div2 = document.createElement('div');
                    div2.setAttribute('data-email-input-id', emailInputId2);
                    div2.setAttribute('data-send-btn-id', sentBtnId2);
                    div2.setAttribute('data-subscribe-on-trigger-email-checkbox-id', checkBoxId2);
                    div2.setAttribute('data-product-to-send-widget-id', productToSendWidgetId2);


                    var htmlElements = {};
                    htmlElements[emailInputId1] = document.createElement('input');
                    htmlElements[emailInputId1].value = 'test1@retailrocket.ru';

                    htmlElements[sentBtnId1] = document.createElement('button');

                    htmlElements[checkBoxId1] = document.createElement('input');
                    htmlElements[checkBoxId1].checked = true;

                    htmlElements[productToSendWidgetId1] = document.createElement('div');
                    htmlElements[productToSendWidgetId1].setAttribute('data-rendered-items-ids', '1,2,3,4');
                    htmlElements[productToSendWidgetId1].setAttribute('data-rendered-list-type', 'listType1');

                    htmlElements[emailInputId2] = document.createElement('input');
                    htmlElements[emailInputId2].value = 'test2@retailrocket.ru';

                    htmlElements[sentBtnId2] = document.createElement('button');

                    htmlElements[checkBoxId2] = document.createElement('input');
                    htmlElements[checkBoxId2].checked = false;

                    htmlElements[productToSendWidgetId2] = document.createElement('div');
                    htmlElements[productToSendWidgetId2].setAttribute('data-rendered-items-ids', '5');
                    htmlElements[productToSendWidgetId2].setAttribute('data-rendered-list-type', 'listType2');

                    var utilsStub = {
                        getElementsByClassName: function (className)
                        {
                            if (className === classNameSelector)
                            {
                                return [div1, div2];
                            }
                            return null;
                        },
                        isValidEmail: function ()
                        {
                            return true;
                        },
                        addEventListener: function (element, eventName, func)
                        {
                            element.addEventListener(eventName, func, false);
                        }
                    };

                    var documentStub = {
                        getElementById: function (id)
                        {
                            if (id in htmlElements)
                            {
                                return htmlElements[id];
                            }
                            return null;
                        }
                    };

                    var rrApiStub = {
                        mailRequest: jasmine.createSpy('mailRequest'),
                        pageView: { subscribe: function (callback)
                        {
                            callback();
                        }}
                    };

                    var apiStub = {
                        pushTrackingCall: function (callback)
                        {
                            callback(rrApiStub);
                        },
                        getSessionId: function ()
                        {
                            return '';
                        },
                        getPartnerId: function ()
                        {
                            return '';
                        }
                    };

                    var exitIntendWidgetStub = {
                        isContainsElement: function ()
                        {
                            return false;
                        }
                    };

                    var sut = retailrocket.modules.mailRequestForm(utilsStub, documentStub, apiStub, exitIntendWidgetStub);
                    sut.initialize();

                    htmlElements[sentBtnId1].click();
                    htmlElements[sentBtnId2].click();

                    expect(rrApiStub.mailRequest.calls.count()).toEqual(2);

                    var args0 = rrApiStub.mailRequest.calls.argsFor(0);
                    var args1 = rrApiStub.mailRequest.calls.argsFor(1);

                    expect(args0[0]).toEqual('test1@retailrocket.ru');
                    expect(args0[2]).toEqual('listType1');
                    expect(args0[4]).toEqual(true);

                    expect(args0[3].length).toEqual(4);
                    expect(args0[3]).toContain('1');
                    expect(args0[3]).toContain('2');
                    expect(args0[3]).toContain('3');
                    expect(args0[3]).toContain('4');

                    expect(args1[0]).toEqual('test2@retailrocket.ru');
                    expect(args1[2]).toEqual('listType2');
                    expect(args1[4]).toEqual(false);

                    expect(args1[3].length).toEqual(1);
                    expect(args1[3]).toContain('5');
                });

                it('on subscriber event is work',
                    function ()
                    {
                        var emailInputId = 'emailInputId';
                        var sentBtnId = 'sentBtnId';

                        var div = document.createElement('div');
                        div.setAttribute('data-email-input-id', emailInputId);
                        div.setAttribute('data-send-btn-id', sentBtnId);
                        div.setAttribute('data-on-subscribe', 'window[\'subscribe\']=3');

                        var emailInput = document.createElement('input');
                        emailInput.setAttribute('value', 'test@retailrocket.ru');
                        var sendBtn = document.createElement('button');

                        var utilsStub = {
                            getElementsByClassName: function (className)
                            {
                                if (className === classNameSelector)
                                {
                                    return [div];
                                }
                                return null;
                            },
                            isValidEmail: function ()
                            {
                                return true;
                            },
                            addEventListener: function (element, eventName, func)
                            {
                                element.addEventListener(eventName, func, false);
                            }
                        };


                        var documentStub = {
                            getElementById: function (id)
                            {
                                if (id === emailInputId)
                                {
                                    return emailInput;
                                }

                                if (id === sentBtnId)
                                {
                                    return sendBtn;
                                }

                                return null;
                            }
                        };

                        var rrApiStub = {
                            mailRequest: jasmine.createSpy('mailRequest'),
                            pageView: { subscribe: function (callback)
                            {
                                callback();
                            }}
                        };

                        var apiStub = {
                            pushTrackingCall: function (callback)
                            {
                                callback(rrApiStub);
                            },
                            getSessionId: function ()
                            {
                                return '';
                            },
                            getPartnerId: function ()
                            {
                                return '';
                            }
                        };

                        var exitIntendWidgetStub = {
                            isContainsElement: function ()
                            {
                                return false;
                            }
                        };

                        var sut = retailrocket.modules.mailRequestForm(utilsStub, documentStub, apiStub, exitIntendWidgetStub);
                        sut.initialize();

                        sendBtn.click();
                        expect(window.subscribe).toEqual(3);
                    }
                );

                it('on subscriber event is not fired if email invalid',
                    function ()
                    {
                        var emailInputId = 'emailInputId';
                        var sentBtnId = 'sentBtnId';

                        var div = document.createElement('div');
                        div.setAttribute('data-email-input-id', emailInputId);
                        div.setAttribute('data-send-btn-id', sentBtnId);
                        div.setAttribute('data-on-subscribe', 'window[\'isnsubscribed\']=4');

                        var emailInput = document.createElement('input');
                        emailInput.setAttribute('value', 'testretailrocket.ru');
                        var sendBtn = document.createElement('button');

                        var utilsStub = {
                            getElementsByClassName: function (className)
                            {
                                if (className === classNameSelector)
                                {
                                    return [div];
                                }
                                return null;
                            },
                            isValidEmail: function ()
                            {
                                return false;
                            },
                            addEventListener: function ()
                            {}
                        };


                        var documentStub = {
                            getElementById: function (id)
                            {
                                if (id === emailInputId)
                                {
                                    return emailInput;
                                }

                                if (id === sentBtnId)
                                {
                                    return sendBtn;
                                }

                                return null;
                            }
                        };

                        var rrApiStub = {
                            mailRequest: jasmine.createSpy('mailRequest'),
                            pageView: { subscribe: function (callback)
                            {
                                callback();
                            }}
                        };

                        var apiStub = {
                            pushTrackingCall: function (callback)
                            {
                                callback(rrApiStub);
                            },
                            getSessionId: function ()
                            {
                                return '';
                            },
                            getPartnerId: function ()
                            {
                                return '';
                            }
                        };

                        var exitIntendWidgetStub = {
                            isContainsElement: function ()
                            {
                                return false;
                            }
                        };

                        var sut = retailrocket.modules.mailRequestForm(utilsStub, documentStub, apiStub, exitIntendWidgetStub);
                        sut.initialize();

                        sendBtn.click();
                        expect(window.isnsubscribed).toBeUndefined();
                    }
                );
            }
        );

        describe('Exit Intend Widget', function ()
        {
            var classNameSelector = 'retailrocket-exit-intend';
            var qs;
            var gebid;

            var div = document.createElement('div');
            div.setAttribute('data-on-hide', 'window[\'close\']=1');

            var documentStub = {
                documentElement: {
                    addEventListener: function ()
                    {

                    }
                },
                addEventListener: function ()
                {}
            };

            var utilsStub = {
                getElementsByClassName: function (className)
                {
                    if (className === classNameSelector)
                    {
                        return [div];
                    }
                    return [];
                },
                isValidEmail: function ()
                {
                    return false;
                },
                createEventProperty: function ()
                {
                    return {
                        publish: function ()
                        {}
                    };
                },
                addEventListener: function ()
                {}
            };

            var rrApiStub = {
                mailRequest: jasmine.createSpy('mailRequest'),
                pageView: { subscribe: function (callback)
                {
                    callback();
                }}
            };

            var apiStub = {
                pushTrackingCall: function (callback)
                {
                    callback(rrApiStub);
                }
            };
            var cookiesStub = {

                cookieNames: {
                    forceClosedFlagCookieName: 'rreiwfc'
                },

                setForceClosedFlagCookie: function ()
                {}
            };

            beforeEach(function ()
            {
                document.cookie.split(';').forEach(function (c)
                {
                    document.cookie = c.replace(/^ +/, '').replace(/\=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                });
                qs = document.querySelectorAll;
                gebid = document.getElementById;
            });

            afterEach(function ()
            {
                document.querySelectorAll = qs;
                document.getElementById = gebid;
            });

            it('on hide event is work', function ()
            {
                var sut = retailrocket.modules.exitIntendWidget(documentStub, utilsStub, apiStub, cookiesStub);
                sut.initialize();

                sut.close(true);
                expect(window.close).toEqual(1);
            });

            it('set forceClosedFlagCookie', function ()
            {
                spyOn(cookiesStub, 'setForceClosedFlagCookie').and.callThrough();

                var sut = retailrocket.modules.exitIntendWidget(documentStub, utilsStub, apiStub, cookiesStub);

                sut.initialize();
                sut.close(true);

                expect(cookiesStub.setForceClosedFlagCookie.calls.argsFor(0)[0]).toEqual(true);
            });
        });

        describe('Category widget',
            function ()
            {
                var classNameSelector = 'TEST_CLASS_NAME';
                var div = document.createElement('div');

                var nsStub = {};
                var recommendationStub = {};
                var itemsStub = {};
                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === classNameSelector)
                        {
                            return [div];
                        }
                        return [];
                    },
                    registerCss: function ()
                    {},
                    addEventListener: function ()
                    {}
                };
                var localEventsStub = {};

                var eventPropertyStub = { subscribe: function (callback)
                {
                    callback();
                }};

                var rrApiStub = {
                    pageView: eventPropertyStub,
                    mailRequest: eventPropertyStub,
                    viewCompleted: eventPropertyStub,
                    addToBasketCompleted: eventPropertyStub,
                    recomAddToBasketCompleted: eventPropertyStub,
                    orderCompleted: eventPropertyStub
                };

                var apiStub = {
                    pushTrackingCall: function (callback)
                    {
                        callback(rrApiStub);
                    },
                    getSessionId: function ()
                    {
                        return '';
                    },
                    getPartnerId: function ()
                    {
                        return 'ANYPARTNERID';
                    }
                };

                var exitIntendWidgetStub = {
                    isContainsElement: function ()
                    {
                        return false;
                    }
                };
                var cookiesStub = {
                    setOnRootLastEventTimeCookie: function ()
                    {},
                    setOnRootMailRequestLastCallTimeCookie: function ()
                    {}
                };

                beforeEach(function ()
                {
                    div.removeAttribute('data-algorithm-category-paths');
                    div.removeAttribute('data-algorithm-category-id');
                    div.removeAttribute('data-algorithm-argument');
                    div.removeAttribute('data-widget-applied');

                    div.setAttribute('data-algorithm-type', 'category');
                    div.setAttribute('data-algorithm', 'popular');

                    recommendationStub.forCategories = jasmine.createSpy('forCategories');
                });

                it('works with multiple category paths', function ()
                {
                    div.setAttribute('data-algorithm-category-paths', '["A/B\\",", "C/D"]');

                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    var calls = recommendationStub.forCategories.calls;
                    expect(calls.count()).toEqual(1);

                    var args = calls.argsFor(0);

                    expect(args[1]).toEqual(['A/B",', 'C/D']);
                });

                it('works with path in algorithm-argument', function ()
                {
                    div.setAttribute('data-algorithm-argument', 'ИМ/Дети');

                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    var calls = recommendationStub.forCategories.calls;

                    expect(calls.count()).toEqual(1);

                    var args = calls.argsFor(0);

                    expect(args[1]).toEqual(['ИМ/Дети']);
                });

                it('works with category ids in algorithm-category-id', function ()
                {
                    div.setAttribute('data-category-id', '1,2,3');

                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    var calls = recommendationStub.forCategories.calls;

                    expect(calls.count()).toEqual(1);

                    var args = calls.argsFor(0);

                    expect(args[1]).toEqual(['1', '2', '3']);
                });
            });

        describe('Product widget',
            function ()
            {
                var classNameSelector = 'TEST_CLASS_NAME';
                var div = document.createElement('div');

                var nsStub = {};
                var recommendationStub = {};
                var itemsStub = {};
                var utilsStub = {
                    getElementsByClassName: function (className)
                    {
                        if (className === classNameSelector)
                        {
                            return [div];
                        }
                        return [];
                    },
                    registerCss: function ()
                    {},
                    addEventListener: function ()
                    {}
                };
                var localEventsStub = {};

                var eventPropertyStub = { subscribe: function (callback)
                {
                    callback();
                } };

                var rrApiStub = {
                    pageView: eventPropertyStub,
                    mailRequest: eventPropertyStub,
                    viewCompleted: eventPropertyStub,
                    addToBasketCompleted: eventPropertyStub,
                    recomAddToBasketCompleted: eventPropertyStub,
                    orderCompleted: eventPropertyStub
                };

                var apiStub = {
                    pushTrackingCall: function (callback)
                    {
                        callback(rrApiStub);
                    },
                    getSessionId: function ()
                    {
                        return '';
                    },
                    getPartnerId: function ()
                    {
                        return 'ANYPARTNERID';
                    }
                };

                var exitIntendWidgetStub = {
                    isContainsElement: function ()
                    {
                        return false;
                    }
                };
                var cookiesStub = {
                    setOnRootLastEventTimeCookie: function ()
                    { },
                    setOnRootMailRequestLastCallTimeCookie: function ()
                    { }
                };

                beforeEach(function ()
                {
                    div.removeAttribute('data-algorithm-argument');
                    div.removeAttribute('data-item-id');
                    div.removeAttribute('data-widget-applied');

                    div.setAttribute('data-algorithm', 'related');
                    recommendationStub.forProducts = jasmine.createSpy('forProducts');
                });

                it('do not request recoms if itemid is null', function ()
                {
                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    expect(recommendationStub.forProducts).not.toHaveBeenCalled();
                });

                it('requests product recoms', function ()
                {
                    var itemId = '123';
                    div.setAttribute('data-algorithm-argument', itemId);
                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    expect(recommendationStub.forProducts).toHaveBeenCalledWith(
                        jasmine.any(String),
                        [itemId],
                        jasmine.any(String),
                        jasmine.any(Object),
                        jasmine.any(Function));
                });

                it('requests many products recoms', function ()
                {
                    div.setAttribute('data-algorithm-argument', '123,456');
                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    expect(recommendationStub.forProducts).toHaveBeenCalledWith(
                        jasmine.any(String),
                        ['123', '456'],
                        jasmine.any(String),
                        jasmine.any(Object),
                        jasmine.any(Function));
                });

                it('requests product recoms by data-item-id attribute', function ()
                {
                    var itemId = '123';
                    div.setAttribute('data-item-id', itemId);
                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    expect(recommendationStub.forProducts).toHaveBeenCalledWith(
                        jasmine.any(String),
                        [itemId],
                        jasmine.any(String),
                        jasmine.any(Object),
                        jasmine.any(Function));
                });
            });

        describe('Personal widget', function ()
        {
            var classNameSelector = 'TEST_CLASS_NAME';
            var div = document.createElement('div');
            div.setAttribute('data-algorithm-type', 'personal');

            var utilsStub = {
                getElementsByClassName: function (className)
                {
                    if (className === classNameSelector)
                    {
                        return [div];
                    }
                    return [];
                },
                registerCss: function ()
                {}
            };

            var nsStub = {};
            var recommendationStub = {};
            var itemsStub = {};

            var localEventsStub = {};

            var eventPropertyStub = { subscribe: function (callback)
            {
                callback();
            } };

            var rrApiStub = {
                pageView: eventPropertyStub,
                mailRequest: eventPropertyStub,
                viewCompleted: eventPropertyStub,
                addToBasketCompleted: eventPropertyStub,
                recomAddToBasketCompleted: eventPropertyStub,
                orderCompleted: eventPropertyStub
            };

            var apiStub = {
                pushTrackingCall: function (callback)
                {
                    callback(rrApiStub);
                },
                getSessionId: function ()
                {
                    return 'ANYSESSIONID';
                },
                getPartnerId: function ()
                {
                    return 'ANYPARTNERID';
                }
            };

            var exitIntendWidgetStub = {
                isContainsElement: function ()
                {
                    return false;
                }
            };
            var cookiesStub = {
                setOnRootLastEventTimeCookie: function ()
                {},
                setOnRootMailRequestLastCallTimeCookie: function ()
                {}
            };

            beforeEach(function ()
            {
                recommendationStub.forPerson = jasmine.createSpy('forCategories');
            });

            describe('Composite for category', function ()
            {
                div.setAttribute('data-algorithm', 'compositeForCategory');

                it('may accept categotypaths as array', function ()
                {
                    div.setAttribute('data-algorithm-param-category-paths', '[1,2,3]');

                    var sut = retailrocket.modules.widget(nsStub, recommendationStub, itemsStub, utilsStub, localEventsStub, apiStub, exitIntendWidgetStub, cookiesStub, {});
                    sut.render(classNameSelector);

                    var calls = recommendationStub.forPerson.calls;
                    expect(calls.count()).toEqual(1);

                    var args = calls.argsFor(0);
                    var algParams = args[4];
                    expect(algParams.categoryPaths).toEqual([1, 2, 3]);
                });
            });
        });

        describe('deactivateIfAgreedToReceiveMarketingMail', function ()
        {
            var utilsStub = {
                getElementsByClassName: function ()
                {
                    return [document.body];
                }
            };

            var apiStub = {
                getSessionId: function ()
                {
                    return 'session';
                },
                getPartnerId: function ()
                {
                    return '';
                },
                pushTrackingCall: function ()
                {}
            };

            var cookiesStub = {
                setOnRootLastEventTimeCookie: function ()
                {},
                setOnRootMailRequestLastCallTimeCookie: function ()
                {},
                setIsVisitorAgreedToReceiveMarketingMailCookie: function ()
                {},
                getIsVisitorAgreedToReceiveMarketingMailCookie: function ()
                {},
                cookieNames: {
                    isVisitorAgreedToReceiveMarketingMailCookie: 'rraem'
                }
            };

            it('visitor information is in use', function ()
            {
                var visitorData = {
                    IsAgreedToReceiveMarketingMail: true,
                    HasEmail: true
                };
                var visitorStub = {
                    get: function (partnerId, session, callback)
                    {
                        callback(visitorData);
                    }
                };

                spyOn(cookiesStub, 'setIsVisitorAgreedToReceiveMarketingMailCookie').and.callThrough();
                spyOn(cookiesStub, 'getIsVisitorAgreedToReceiveMarketingMailCookie');

                var sut = retailrocket.modules.deactivateIfAgreedToReceiveMarketingMail(visitorStub, utilsStub, apiStub, cookiesStub);

                sut.initialize();

                expect(cookiesStub.setIsVisitorAgreedToReceiveMarketingMailCookie.calls.argsFor(0)[0]).toEqual(true);
                expect(cookiesStub.getIsVisitorAgreedToReceiveMarketingMailCookie).toHaveBeenCalled();
            });

            it('set IsVisitorAgreedToReceiveMarketingMail cookie false if visitor has no email', function ()
            {
                var visitorData = {
                    IsAgreedToReceiveMarketingMail: true,
                    HasEmail: false
                };
                var visitorStub = {
                    get: function (partnerId, session, callback)
                    {
                        callback(visitorData);
                    }
                };

                spyOn(cookiesStub, 'setIsVisitorAgreedToReceiveMarketingMailCookie').and.callThrough();
                spyOn(cookiesStub, 'getIsVisitorAgreedToReceiveMarketingMailCookie');

                var sut = retailrocket.modules.deactivateIfAgreedToReceiveMarketingMail(visitorStub, utilsStub, apiStub, cookiesStub);

                sut.initialize();

                expect(cookiesStub.setIsVisitorAgreedToReceiveMarketingMailCookie.calls.argsFor(0)[0]).toEqual(false);
                expect(cookiesStub.getIsVisitorAgreedToReceiveMarketingMailCookie).toHaveBeenCalled();
            });
        });

        describe('Has right suggester', function ()
        {
            it('suggester is parent markup block id', function ()
            {
                var attributeValue = 'ANYATTRIBUTEVALUE';
                var markupBlock = document.createElement('div');
                markupBlock.setAttribute('data-retailrocket-markup-block', attributeValue);
                markupBlock.innerHTML = '<div><div id="target" class="retailrocket-widget" data-algorithm-type="preview"></div></div>';
                var ref = document.getElementsByTagName('script')[0];
                ref.parentNode.insertBefore(markupBlock, ref);

                var target = document.getElementById('target');

                var recommendationApiStub = {
                    forPreview: function (partnerId, func)
                    {
                        func([]);
                    }
                };

                var utilsStub = {
                    getElementsByClassName: function ()
                    {
                        return [target];
                    },
                    registerCss: function ()
                    {},
                    plainCopy: function ()
                    {
                        return {};
                    }
                };

                spyOn(utilsStub, 'plainCopy').and.callThrough();

                var eventPropertyStub = { subscribe: function (callback)
                {
                    callback();
                }};

                var rrApiStub = {
                    mailRequest: eventPropertyStub,
                    viewCompleted: eventPropertyStub,
                    addToBasketCompleted: eventPropertyStub,
                    recomAddToBasketCompleted: eventPropertyStub,
                    orderCompleted: eventPropertyStub,
                    pageView: eventPropertyStub
                };

                var exitIntendWidgetStub = {
                    isContainsElement: function ()
                    {
                        return false;
                    }
                };

                var cookiesStub = {
                    setOnRootLastEventTimeCookie: function ()
                    {},
                    setOnRootMailRequestLastCallTimeCookie: function ()
                    {}
                };

                var apiStub = {
                    pushTrackingCall: function (callback)
                    {
                        callback(rrApiStub);
                    },
                    getSessionId: function ()
                    {
                        return '';
                    },
                    getPartnerId: function ()
                    {
                        return 'ANYPARTNERID';
                    }
                };
                var sut = retailrocket.modules.widget({}, recommendationApiStub, {}, utilsStub, {}, apiStub, exitIntendWidgetStub, cookiesStub, {});

                sut.render();

                expect(utilsStub.plainCopy.calls.argsFor(0)[0].suggesterId).toEqual(attributeValue);
            });
        });
    });
})();
