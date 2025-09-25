// データセット
import { enviroments } from '../shared/enviroments.js';

// エレメント作成
let checkboxes = [];
enviroments.forEach(env => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${env.env}-checkbox`;

    const label = document.createElement('label');
    label.htmlFor = `${env.env}-checkbox`;
    label.innerText = env.text;

    const li = document.createElement('li');
    li.style.backgroundImage = `linear-gradient(135deg, #ffffff 85%, ${env.color} 90% 100%)`;

    li.appendChild(checkbox);
    li.appendChild(label);

    document.getElementById('enviroments').appendChild(li);

    checkboxes[env.env] = checkbox;
});

// 現在のタブのURLを取得してドメインを表示、設定を読み込み
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let url = new URL(tabs[0].url);
    let domain = url.hostname;
    document.getElementById('site').innerText = domain;
    
    chrome.storage.sync.get(domain, data => {
        enviroments.forEach(env => {
            checkboxes[env.env].checked = !!data[domain]?.[`${env.env}_checked`];
        });
    });

    enviroments.forEach(env => {
        checkboxes[env.env].addEventListener('change', () => {
            //他のチェックボックスを外す
            enviroments.forEach(otherEnv => {
                if (otherEnv.env !== env.env) {
                    checkboxes[otherEnv.env].checked = false;
                }
            });

            // 状態を保存
            let setting = {};
            enviroments.forEach(env => {
                setting[`${env.env}_checked`] = checkboxes[env.env].checked;
            });
            chrome.storage.sync.set({
                [domain]: setting
            });
        });
    });

    // 共通設定
    chrome.storage.sync.get('common', data => {
        document.getElementById('obi-size').value = data.common?.obi_size || 35;
        document.getElementById('mamorukun-destroy').checked = data.common?.mamorukun_destroy || false;
    });

    document.querySelectorAll('.common-input').forEach(input => {
        input.addEventListener('change', () => {
            common.storage.sync.set({
                obi_size: document.getElementById('obi-size').value,
                mamorukun_destroy: document.getElementById('mamorukun-destroy').checked
            });
        });
    });
});

// 設定
document.querySelector('.settings').addEventListener('click', async () => {
    const w = await chrome.windows.getCurrent();
    await chrome.sidePanel.open({ windowId: w.id });
    window.close();
});