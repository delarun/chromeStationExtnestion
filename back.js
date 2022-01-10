chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Origin')
                details.requestHeaders[i].value = 'https://yandex.ru';
        }

        return {
            requestHeaders: details.requestHeaders
        };
    }, {
    urls: ["*://yandex.ru/*"]
},
    ["blocking", "requestHeaders", "extraHeaders"]);