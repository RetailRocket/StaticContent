/* global retailrocket*/
(function ()
{
    describe('punycode module', function ()
    {
        describe('punycode convertation tests', function ()
        {
            it('convert cyrillic to punycode',
                function ()
                {
                    var sut = retailrocket.modules.punycode({});

                    var unicodeUrl = 'массажные-кресла-санкт-петербург.рф';
                    var etalonUrl = 'xn------5cdabbjsnbeaf6denkwi8bnlbeaid6ad8azt.xn--p1ai';
                    var result = sut.toASCII(unicodeUrl);

                    expect(result).toEqual(etalonUrl);
                });

            it('does not change english word',
                function ()
                {
                    var sut = retailrocket.modules.punycode({});

                    var unicodeUrl = 'retailrocket.com';
                    var etalonUrl = 'retailrocket.com';
                    var result = sut.toASCII(unicodeUrl);

                    expect(result).toEqual(etalonUrl);
                });

            it('does not fall if global exists',
                function ()
                {
                    // eslint-disable-next-line
                    global = null;
                    var sut = retailrocket.modules.punycode({});

                    var unicodeUrl = 'массажные-кресла-санкт-петербург.рф';
                    var etalonUrl = 'xn------5cdabbjsnbeaf6denkwi8bnlbeaid6ad8azt.xn--p1ai';
                    var result = sut.toASCII(unicodeUrl);

                    expect(result).toEqual(etalonUrl);
                });
        });
    });
})();
