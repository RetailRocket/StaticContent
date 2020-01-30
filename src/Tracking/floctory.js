/* global rrApi, rrApiOnReady, rrLibrary*/
(function floctory(rrLibrary)
{
    if (rrLibrary.isRobot || !rrLibrary.areCookiesEnabled)
    {
        return;
    }
    if (window.addEventListener)
    {
        window.addEventListener('message', function (e)
        {
            var msg = { from: '', type: '' };
            try
            {
                msg = JSON.parse(e.data) || {};
            }
            // eslint-disable-next-line
            catch (e)
            {
                return;
            }
            if (msg.from === 'rr' && msg.type === 'setEmail')
            {
                rrApiOnReady.push(function ()
                {
                    rrApi.setEmail(msg.data.email, msg.data.emailData);
                });
            }
        });
    }
})(rrLibrary);
