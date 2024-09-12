async function fetchDomainData(domain) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(domain, data => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(data[domain]);
        });
    });
}

async function fetchCommonData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('common', data => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(data.common);
        });
    });
}

(async () => {
    const domain = (new URL(window.location.href)).hostname;
    
    const data_domain = await fetchDomainData(domain);
    const data_common = await fetchCommonData();

    const div = document.createElement('div');

    // 基本スタイル
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
    div.style.right = 0;
    div.style.color = '#000000';
    div.style.zIndex = 999999;
    div.style.textAlign = 'center';
    div.style.pointerEvents = 'none';
    div.style.opacity = 1;
    div.style.transition = 'opacity 0.1s ease-in-out';

    // 設定
    const height = data_common?.obi_size || 35;
    div.style.height = height + 'px';
    div.style.lineHeight = height + 'px';

    // ドメインごと分岐
    if (data_domain?.prod_checked === true) {
        div.style.backgroundColor = data_common?.obi_color_prod ?? '#ff0000';
        div.innerHTML = data_common?.mamorukun_destroy ? '本番環境' : 'まもる君 「本番環境だよ!」';
    }
    if (data_domain?.stg_checked === true) {
        div.style.backgroundColor = data_common?.obi_color_stg ?? '#00ff00';
        div.innerHTML = data_common?.mamorukun_destroy ? 'ステージング環境' : 'まもる君 「ステージング環境だよ!」';
    }

    document.body.appendChild(div);

    document.addEventListener('mousemove', function(e) {
        if (e.clientY < height) {
            div.style.opacity = 0.3;
        } else {
            div.style.opacity = 1;
        }
    });
})();