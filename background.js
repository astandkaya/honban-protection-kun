chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        try {
            let url = new URL(tab.url);
            let domain = url.hostname;

            chrome.storage.sync.get(domain, data => {
                if (data[domain]) {
                    // css読み込み
                    chrome.scripting.insertCSS({
                        target: { tabId: tabId },
                        files: ['style.css']
                    });
                    // js読み込み
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['script.js']
                    });
                }
            });
        } catch (e) {
            console.log('Invalid URL:', tab.url);
        }
    }
});