/* global retailrocket, rrLibrary, rrApi*/
(function ()
{
    'use strict';

    describe('EmailAttribution module', function ()
    {
        var apiStub = {
            getPartnerId: function ()
            {
                return 'fakePartnerId';
            }
        };

        var cookiesStub = {
            areCookiesEnabled: function ()
            {
                return true;
            }
        };

        var utilsStub = {
            isRobot: function ()
            {
                return false;
            },
            convertUrHostnameToASCII: function (value)
            {
                return value;
            },
            plainCopy: function ()
            {
            }
        };

        var trackingStub = {
            emailClick: function ()
            {}
        };

        var rrApiStub = {
            _initialize: {
                subscribe: function (func)
                {
                    func({ sessionId: 'FAKE-SESSION-ID' });
                }
            }
        };


        describe('MailTrackingId is empty',
            function ()
            {
                beforeEach(function ()
                {
                    spyOn(rrLibrary, 'getQueryParametr');
                    spyOn(trackingStub, 'emailClick');

                    retailrocket.modules.emailAttribution(
                        apiStub,
                        utilsStub,
                        cookiesStub,
                        rrApiStub,
                        rrLibrary,
                        trackingStub);
                });

                it('get mailTrackingId from QueryParam', function ()
                {
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('rr_mailid');
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('MailTrackingId');
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('mailtrackingid');
                });

                it('should NOT have been called getQueryParametr', function ()
                {
                    expect(rrLibrary.getQueryParametr).not.toHaveBeenCalledWith('rr_setemail');
                    expect(rrLibrary.getQueryParametr).not.toHaveBeenCalledWith('utm_source');
                    expect(rrLibrary.getQueryParametr).not.toHaveBeenCalledWith('rr_urlType');
                    expect(rrLibrary.getQueryParametr).not.toHaveBeenCalledWith('rr_mailid_proxy');
                    expect(trackingStub.emailClick).not.toHaveBeenCalled();
                });
            });

        describe('MailTrackingId is NOT empty',
            function ()
            {
                var mailTrackingId = 'test_rr_mailid';
                var urlType = 'test_rr_urlType';
                var utmSource = 'test_utm_source';
                var subscriber = {
                    prop1: 'propValue1',
                    prop2: 'propValue2'
                };

                function getQueryParametrFake(name)
                {
                    return {
                        utm_source: utmSource,
                        rr_mailid: mailTrackingId,
                        rr_urlType: urlType
                    }[name] || null;
                }

                beforeEach(function ()
                {
                    spyOn(rrLibrary, 'getQueryParametr').and.callFake(getQueryParametrFake);
                    spyOn(rrLibrary, 'getSubscriberDataFromQueryString').and.returnValue(subscriber);
                    spyOn(trackingStub, 'emailClick');
                    spyOn(utilsStub, 'plainCopy').and.returnValue(subscriber);

                    retailrocket.modules.emailAttribution(
                        apiStub,
                        utilsStub,
                        cookiesStub,
                        rrApiStub,
                        rrLibrary,
                        trackingStub);
                });

                it('calls emailClick', function ()
                {
                    expect(utilsStub.plainCopy).toHaveBeenCalledWith(subscriber, 'd.');
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('rr_setemail');
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('utm_source');
                    expect(rrLibrary.getQueryParametr).toHaveBeenCalledWith('rr_urlType');
                    expect(trackingStub.emailClick).toHaveBeenCalledWith(
                        mailTrackingId,
                        jasmine.objectContaining({
                            rr_mailid: mailTrackingId,
                            utm_source: utmSource,
                            rr_urlType: urlType,
                            'prop1': 'propValue1',
                            'prop2': 'propValue2'
                        })
                    );
                });
            });
    });
})();
