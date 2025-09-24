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
    const { enviroments } = await import(chrome.runtime.getURL('shared/enviroments.js'));

    // ドメインに対応した登録済みデータの取得
    const domain = (new URL(window.location.href)).hostname;
    const [data_domain, data_common] = await Promise.all([fetchDomainData(domain), fetchCommonData()]);

    // 環境の判定
    const environment = enviroments.find(env => data_domain?.[`${env.env}_checked`])?.env || null;

    // CSS変数の設定
    const height = data_common?.obi_size || 35;
    setCSSVariable('--protection-kun-obi-size', `${height}px`);
    enviroments.forEach(({env, color}) => {
        setCSSVariable(`--protection-kun-color-${env}`, data_common?.[`obi_color_${env}`] ?? color);
        setCSSVariable(`--protection-kun-text-color-${env}`, data_common?.[`obi_text_color_${env}`] ?? '#000000');
    });

    // スタイルの追加
    const style = document.createElement('style');
    style.innerHTML = enviroments.map(({env, color}) => `
        #protection-kun-obi[data-type="${env}"] {
            background-color: var(--protection-kun-color-${env});
            color: var(--protection-kun-text-color-${env}, #000000);
        }
    `).join('\n');
    document.head.appendChild(style);

    // 帯の要素生成
    const obi = document.createElement('div');
    obi.id = 'protection-kun-obi';
    if (environment) {
        const environment_text = enviroments.find(e => e.env === environment)?.text || '';
        obi.innerHTML = `まもる君 「${environment_text}だよ！」`;
        if (data_common?.mamorukun_destroy) {
            obi.innerHTML = environment_text;
        }

        obi.setAttribute('data-type', environment);

        document.body.appendChild(obi);

        // 閉じるボタンの生成
        const close_button = document.createElement('button');
        close_button.id = 'protection-kun-obi-close-button';
        close_button.innerHTML = '×';
        close_button.addEventListener('click', () => {
            obi.style.display = 'none';
            close_button.style.display = 'none';
        });
        document.body.appendChild(close_button);
    }

    // マウスオーバー時の半透明化
    document.addEventListener('mousemove', e => obi.style.opacity = e.clientY < height ? 0.3 : 1);
})();