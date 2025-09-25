async function fetchEnviromentsData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('enviroments', data => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(data.enviroments || []);
        });
    });
};

export const enviroments = await fetchEnviromentsData().then(stored => {
    if (Array.isArray(stored) && stored.length > 0) {
        return stored;
    }

    const defaults = [
        {
            "env": "prod",
            "color": "#ff0000",
            "text": "本番環境"
        },
        {
            "env": "stg",
            "color": "#00ff00",
            "text": "ステージング環境"
        },
        {
            "env": "test",
            "color": "#ffff00",
            "text": "テスト環境"
        },
        {
            "env": "local",
            "color": "#00ffff",
            "text": "ローカル環境"
        },
    ];

    chrome.storage.sync.set({
        enviroments: defaults
    });

    return defaults;
});
