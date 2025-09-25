// データセット
import { enviroments } from '../shared/enviroments.js';
import { confirmDialog } from '../shared/dialogs/confirmDialog.js';
import { promptDialog } from '../shared/dialogs/promptDialog.js';
import { alertDialog } from '../shared/dialogs/alertDialog.js';

// エレメント作成
let list = [];
enviroments.forEach(enviroment => {
    // 環境名
    const enviromentName = document.createElement('div');
    // input
    const text = document.createElement('input');
    text.type = 'text';
    text.value = enviroment.text;
    // button
    const saveButton = document.createElement('button');
    saveButton.className = `save`;
    saveButton.innerText = 'Save';
    saveButton.onclick = () => {
        const newText = text.value.trim();
        if (newText === '') {
            alertDialog('Environment name cannot be empty.');
            text.value = enviroment.text;
            return;
        }

        const index = enviroments.findIndex(e => e.env === enviroment.env);
        if (index !== -1) {
            enviroments[index].text = newText;
            chrome.storage.sync.set({ enviroments: enviroments }, () => {
                alertDialog('Environment name saved.');
            });
        }
    };

    enviromentName.appendChild(text);
    enviromentName.appendChild(saveButton);

    // スラッグ
    const env = document.createElement('code');
    env.innerText = enviroment.env;
    // 色
    const color = document.createElement('input');
    color.type = 'color';
    color.value = enviroment.color;
    color.onchange = () => {
        const newColor = color.value;
        const index = enviroments.findIndex(e => e.env === enviroment.env);
        if (index !== -1) {
            enviroments[index].color = newColor;
            chrome.storage.sync.set({ enviroments: enviroments }, () => {
                alertDialog('Color saved.');
            });
        }
    };
    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = `delete`;
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => {
        confirmDialog(`Are you sure you want to delete the environment "${enviroment.text}" (${enviroment.env})? This action cannot be undone.`, 'Delete', 'Cancel')
            .then(ok => {
                if (!ok) {
                    return;
                }
                // 削除処理
                const deleted = enviroments.filter(e => e.env !== enviroment.env);
                chrome.storage.sync.set({ enviroments: deleted }, () => location.reload());
            });
    };

    const li = document.createElement('li');
    li.appendChild(enviromentName);
    li.appendChild(env);
    li.appendChild(color);
    li.appendChild(deleteButton);

    document.getElementById('enviroments').querySelector('ul').appendChild(li);
});

// 新規追加ボタン
const addButton = document.querySelector('.add-enviroment');
addButton.onclick = () => {
    promptDialog('Enter a unique environment slug (e.g., "dev", "staging", "prod"):')
        .then(env => {
            if (env === null) {
                return;
            }

            if (env === '') {
                alertDialog('Environment slug cannot be empty.');
                return;
            }
            if (enviroments.some(e => e.env === env)) {
                alertDialog('This environment slug already exists. Please choose a different one.');
                return;
            }

            chrome.storage.sync.get(['enviroments'], (result) => {
                let enviroments = result.enviroments || [];
                enviroments.push({ env: env, text: env, color: '#ffffff' });
                chrome.storage.sync.set({ enviroments: enviroments }, () => location.reload());
            });
        });
};
