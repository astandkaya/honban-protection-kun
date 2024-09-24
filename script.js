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

function setCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
};

(async () => {
    // ドメインに対応した登録済みデータの取得
    const domain = (new URL(window.location.href)).hostname;
    const [data_domain, data_common] = await Promise.all([fetchDomainData(domain), fetchCommonData()]);

    // CSS変数の設定
    const height = data_common?.obi_size || 35;
    setCSSVariable('--protection-kun-obi-size', `${height}px`);
    setCSSVariable('--protection-kun-color-prod', data_common?.obi_color_prod);
    setCSSVariable('--protection-kun-color-stg', data_common?.obi_color_stg);
    // setCSSVariable('--protection-kun-text-color-prod', data_common?.obi_text_color_prod);
    // setCSSVariable('--protection-kun-text-color-stg', data_common?.obi_text_color_stg);

    // 環境の判定
    const environment = data_domain?.prod_checked ? 'prod' 
        : data_domain?.stg_checked ? 'stg' 
        : null;

    // 帯の要素生成
    const obi = document.createElement('div');
    obi.id = 'protection-kun-obi';
    if (environment) {
        obi.setAttribute('data-type', environment);
        obi.innerHTML = `まもる君 「${environment === 'prod' ? '本番環境' : 'ステージング環境'}だよ!」`;
        if (data_common?.mamorukun_destroy) {
            obi.innerHTML = environment === 'prod' ? '本番環境' : 'ステージング環境';
        }
    }

    // 閉じるボタンの生成
    const close_button = document.createElement('button');
    close_button.id = 'protection-kun-obi-close-button';
    close_button.innerHTML = '閉じる';
    close_button.addEventListener('click', () => obi.style.display = 'none');
    obi.appendChild(close_button);

    document.body.appendChild(obi);

    // マウスオーバー時の半透明化
    document.addEventListener('mousemove', e => obi.style.opacity = e.clientY < height ? 0.3 : 1);
})();