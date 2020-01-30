/* global retailrocket*/
(function ()
{
    describe('Utility module', function ()
    {
        describe('encodingIsModified', function ()
        {
            function createDocumentStub(charSet, metaCharset)
            {
                return {
                    getElementsByTagName: function ()
                    {
                        return [ { httpEquiv: 'Content-Type', charset: metaCharset }];
                    },
                    characterSet: charSet
                };
            }

            it('returns false if there is no meta encoding', function ()
            {
                var sut = retailrocket.modules.utils({}, createDocumentStub('UTF-8', null));
                expect(sut.encodingIsModified()).toBeFalsy();
            });

            it('returns false if document charset is equal to meta', function ()
            {
                var sut = retailrocket.modules.utils({}, createDocumentStub('UTF-8', 'UTF-8'));
                expect(sut.encodingIsModified()).toBeFalsy();
            });

            it('returns false for windows-1252 vs iso-8859-1', function ()
            {
                var sut = retailrocket.modules.utils({}, createDocumentStub(' windows-1252', 'iso-8859-1'));
                expect(sut.encodingIsModified()).toBeFalsy();
            });

            it('returns true if document charset is not equal to meta', function ()
            {
                var sut = retailrocket.modules.utils({}, createDocumentStub('UTF-8', 'windows-1251'));
                expect(sut.encodingIsModified()).toBeTruthy();
            });
        });

        describe('getMetaCharset', function ()
        {
            it('extracts from \'charset\' attribute', function ()
            {
                var sut = retailrocket.modules.utils({ }, {
                    getElementsByTagName: function (tagName)
                    {
                        if (tagName === 'meta')
                        {
                            return [
                                { httpEquiv: 'Content-Type', charset: 'utf-8' }
                            ];
                        }
                        return null;
                    }
                });

                var result = sut.getMetaCharset();

                expect(result).toEqual('utf-8');
            });

            it('extracts from \'content\' attribute', function ()
            {
                var sut = retailrocket.modules.utils({ }, {
                    getElementsByTagName: function (tagName)
                    {
                        if (tagName === 'meta')
                        {
                            return [
                                { httpEquiv: 'Content-Type', content: 'text/html; charset=UTF-8' }
                            ];
                        }
                        return null;
                    }
                });

                var result = sut.getMetaCharset();

                expect(result).toEqual('utf-8');
            });

            it('returns empty string for invalid meta', function ()
            {
                var sut = retailrocket.modules.utils({ }, {
                    getElementsByTagName: function (tagName)
                    {
                        if (tagName === 'meta')
                        {
                            return [
                                { httpEquiv: 'Content-Type' }
                            ];
                        }
                        return null;
                    }
                });

                var result = sut.getMetaCharset();

                expect(result).toEqual('');
            });
        });

        describe('objToQueryString', function ()
        {
            it('convert arrays to CSV', function ()
            {
                var sut = retailrocket.modules.utils({});
                var result = sut.objToQueryString({ array: ['1,2', '3,4'] });
                expect(result).toEqual('&array=1%2C2,3%2C4');
            });

            it('filters prototype properties', function ()
            {
                function Proto()
                {}
                Proto.prototype.foo = function (x)
                {
                    return x;
                };
                var input = new Proto();
                input.testValue = 5;

                var sut = retailrocket.modules.utils({});
                var result = sut.objToQueryString(input);

                expect(result).toEqual('&testValue=5');
            });
        });

        describe('queryStringToObj', function ()
        {
            it('convert to array from CSV',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.queryStringToObj('&array=1%2C2,3%2C4');
                    expect(result.array).toContain('1,2');
                    expect(result.array).toContain('3,4');
                });

            it('should convert not null and null and empty',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.queryStringToObj('&simpleId=123&emptyId=&rr_anotherId=456');
                    expect(result.simpleId).toEqual('123');
                    expect(result.emptyId).toBe('');
                    expect(result.rr_anotherId).toEqual('456');
                    expect(result.fictionalParam).not.toBeDefined();
                });

            it('not breaks if can\'t decode url',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.queryStringToObj('&s%5Bq%5D=%ED%E0%E9%EA%E8&rr_segmentId=10');
                    expect(result.rr_segmentId).toEqual('10');
                    expect(result['s[q]']).toEqual('%ED%E0%E9%EA%E8');
                });
        });

        describe('getUrlWithoutQuery', function ()
        {
            it('process null, empty ot undefined',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.getUrlWithoutQuery(null);
                    expect(result).toBe('');

                    result = sut.getUrlWithoutQuery('');
                    expect(result).toBe('');

                    result = sut.getUrlWithoutQuery(sut.undefProp);
                    expect(result).toBe('');
                });

            it('parse urls without query string',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.getUrlWithoutQuery('http://retailrocket.ru');
                    expect(result).toEqual('http://retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru');
                    expect(result).toEqual('retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru/setEmail');
                    expect(result).toEqual('retailrocket.ru/setEmail');
                });

            it('parse urls with query string',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.getUrlWithoutQuery('http://retailrocket.ru?email=js.test@retailrocket.ru');
                    expect(result).toEqual('http://retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru?email=js.test@retailrocket.ru');
                    expect(result).toEqual('retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru/setEmail?email=js.test@retailrocket.ru');
                    expect(result).toEqual('retailrocket.ru/setEmail');

                    result = sut.getUrlWithoutQuery('retailrocket.ru/setEmail/?email=js.test@retailrocket.ru');
                    expect(result).toEqual('retailrocket.ru/setEmail/');
                });

            it('parse urls with anchor string',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var result = sut.getUrlWithoutQuery('http://retailrocket.ru#email');
                    expect(result).toEqual('http://retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru#email');
                    expect(result).toEqual('retailrocket.ru');

                    result = sut.getUrlWithoutQuery('retailrocket.ru/setEmail#email');
                    expect(result).toEqual('retailrocket.ru/setEmail');

                    result = sut.getUrlWithoutQuery('retailrocket.ru/setEmail/#email');
                    expect(result).toEqual('retailrocket.ru/setEmail/');
                });
        });
        describe('addEventListener', function ()
        {
            it('call addEventListener with three parametrs',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var chromeElementMock = jasmine.createSpyObj('chromeElementMock', ['addEventListener']);

                    var eventName = 'click';
                    var callback = function ()
                    {};

                    sut.addEventListener(chromeElementMock, eventName, callback);
                    expect(chromeElementMock.addEventListener).toHaveBeenCalledWith(eventName, callback, false);
                });
            it('add on prefix for event name at attachEvent',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var ieElementMock = jasmine.createSpyObj('ieElementMock', ['attachEvent']);

                    var eventName = 'click';
                    var callback = function ()
                    {};

                    sut.addEventListener(ieElementMock, eventName, callback);
                    expect(ieElementMock.attachEvent).toHaveBeenCalledWith('on' + eventName, callback);
                });
        });

        describe('getElementsByClassName', function ()
        {
            it('calls underlying getElementsByClassName', function ()
            {
                var className = 'XXX';
                var expectedResult = [1, 2, 3];

                var documentStub = {
                    getElementsByClassName: function (cn)
                    {
                        if (cn === className)
                        {
                            return expectedResult;
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.utils({}, documentStub);

                var result = sut.getElementsByClassName(className);

                expect(result).toEqual(expectedResult);
            });


            it('calls querySelectorAll when document does not have getElementsByClassName', function ()
            {
                var className = 'XXX';
                var expectedResult = [1, 2, 3];

                var documentStub = {
                    querySelectorAll: function (cn)
                    {
                        if (cn === '.' + className)
                        {
                            return expectedResult;
                        }
                        return null;
                    }
                };

                var sut = retailrocket.modules.utils({}, documentStub);

                var result = sut.getElementsByClassName(className);

                expect(result).toEqual(expectedResult);
            });

            it('calls magic tricks when querySelectorAll is undefined', function ()
            {
                var className = 'XXX';
                var headTag = { appendChild: function ()
                {} };
                var styleTag = { styleSheet: { } };

                var documentStub = {
                    documentElement: { firstChild: headTag },
                    createElement: function (tag)
                    {
                        if (tag === 'STYLE')
                        {
                            return styleTag;
                        }
                        return null;
                    }
                };

                spyOn(headTag, 'appendChild');

                var sut = retailrocket.modules.utils({}, documentStub);

                sut.getElementsByClassName(className);

                expect(headTag.appendChild).toHaveBeenCalledWith(styleTag);

                expect(styleTag.styleSheet.cssText).toEqual('.XXX{x:expression(document.__qsaels.push(this))}');
            });
        });

        describe('getParentsAttributeValueByEvent', function ()
        {
            it('returns value of parent attribute if exists',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var attributeName = 'attribute-which-store-data';
                    var attributeValue = 'value-to-store';
                    var testDiv = document.createElement('div');
                    testDiv.setAttribute(attributeName, attributeValue);
                    testDiv.innerHTML = '<button id="target"></button>';
                    var ref = document.getElementsByTagName('script')[0];
                    ref.parentNode.insertBefore(testDiv, ref);

                    var target = document.getElementById('target');
                    document.getElementById('target').addEventListener('click', function ()
                    {
                        var result = sut.getParentsAttributeValueByEvent(attributeName);
                        expect(result).toBe(attributeValue);
                    });
                    target.click();
                });

            it('returns null attribute if not exists',
                function ()
                {
                    var sut = retailrocket.modules.utils({});
                    var testDiv = document.createElement('div');
                    testDiv.innerHTML = '<button id="target"></button>';
                    var ref = document.getElementsByTagName('script')[0];
                    ref.parentNode.insertBefore(testDiv, ref);

                    var target = document.getElementById('target');
                    document.getElementById('target').addEventListener('click', function ()
                    {
                        var result = sut.getParentsAttributeValueByEvent('some-unexist-attribute');
                        expect(result).toBe(null);
                    });
                    target.click();
                });
        });

        describe('convertUrHostnameToASCII', function ()
        {
            it('url compilation is valid',
                function ()
                {
                    var etalonUrl = 'http://somedomain.com/foo?me=ivan&isdev=true#somehash';
                    var punycodeMock = {
                        toASCII: function (input)
                        {
                            return input;
                        }
                    };

                    var sut = retailrocket.modules.utils({}, {}, punycodeMock);

                    var result = sut.convertUrHostnameToASCII(etalonUrl);

                    expect(result).toEqual(etalonUrl);
                });

            it('convert cyrillic url hostname to punicode',
                function ()
                {
                    var unicodeUrl = 'http://массажные-кресла-санкт-петербург.рф/kresla-us-medica/us-medica-quadro/';
                    var etalonUrl = 'http://xn------5cdabbjsnbeaf6denkwi8bnlbeaid6ad8azt.xn--p1ai/kresla-us-medica/us-medica-quadro/';

                    var punycodeMock = {
                        toASCII: function ()
                        {
                            return 'xn------5cdabbjsnbeaf6denkwi8bnlbeaid6ad8azt.xn--p1ai';
                        }
                    };

                    var sut = retailrocket.modules.utils({}, {}, punycodeMock);

                    var result = sut.convertUrHostnameToASCII(unicodeUrl);

                    expect(result).toEqual(etalonUrl);
                });

            it('returns null if input is empty',
                function ()
                {
                    var punycodeMock = {
                        toASCII: function ()
                        {
                            return null;
                        }
                    };
                    var sut = retailrocket.modules.utils({}, {}, punycodeMock);

                    var result = sut.convertUrHostnameToASCII('');

                    expect(result).toEqual(null);
                });
        });
    });
})();

