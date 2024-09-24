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

    const obi = document.createElement('div');

    // 基本スタイル
    obi.style.position = 'fixed';
    obi.style.top = 0;
    obi.style.left = 0;
    obi.style.right = 0;
    obi.style.color = '#000000';
    obi.style.zIndex = 999999;
    obi.style.textAlign = 'center';
    obi.style.pointerEvents = 'none';
    obi.style.opacity = 1;
    obi.style.transition = 'opacity 0.1s ease-in-out';

    // 設定
    const height = data_common?.obi_size || 35;
    obi.style.height = height + 'px';
    obi.style.lineHeight = height + 'px';

    // ドメインごと分岐
    if (data_domain?.prod_checked === true) {
        obi.style.backgroundColor = data_common?.obi_color_prod ?? '#ff0000';
        obi.innerHTML = data_common?.mamorukun_destroy ? '本番環境' : 'まもる君 「本番環境だよ!」';
    }
    if (data_domain?.stg_checked === true) {
        obi.style.backgroundColor = data_common?.obi_color_stg ?? '#00ff00';
        obi.innerHTML = data_common?.mamorukun_destroy ? 'ステージング環境' : 'まもる君 「ステージング環境だよ!」';
    }

    // 閉じるボタン
    const close_button = document.createElement('button');
    close_button.textContent = '閉じる';
    close_button.style.pointerEvents = 'auto';
    close_button.style.cursor = 'pointer';
    close_button.style.background = 'rgba(0 0 0 / 0.3)';
    close_button.style.border = 'none';
    close_button.style.color = '#000000';
    close_button.style.padding = '4px 10px';
    close_button.style.borderRadius = '8px';
    close_button.addEventListener('click', function() {
        obi.style.display = 'none';
    });
    obi.appendChild(close_button);

    document.body.appendChild(obi);

    document.addEventListener('mousemove', function(e) {
        if (e.clientY < height) {
            obi.style.opacity = 0.3;
        } else {
            obi.style.opacity = 1;
        }
    });
})();