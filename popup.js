const prod_checkbox = document.getElementById('prod-checkbox');
const stg_checkbox = document.getElementById('stg-checkbox');

chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let url = new URL(tabs[0].url);
    let domain = url.hostname;
    document.getElementById('site').innerText = domain;
    
    chrome.storage.sync.get(domain, data => {
        prod_checkbox.checked = !!data[domain].prod_checked;
        stg_checkbox.checked = !!data[domain].stg_checked; 
    });
    
    prod_checkbox.addEventListener('change', () => {
        chrome.storage.sync.set({
            [domain]: {
                prod_checked: prod_checkbox.checked,
                stg_checked: false
            }
        });
        stg_checkbox.checked = false;
    });
    
    stg_checkbox.addEventListener('change', () => {
        chrome.storage.sync.set({
            [domain]: {
                prod_checked: false,
                stg_checked: stg_checkbox.checked
            }
        });
        prod_checkbox.checked = false;
    });

    // 共通設定
    chrome.storage.sync.get('common', data => {
        document.getElementById('obi-size').value = data.common?.obi_size || 35;
        document.getElementById('obi-color-prod').value = data.common?.obi_color_prod || '#ff0000';
        document.getElementById('obi-color-stg').value = data.common?.obi_color_stg || '#00ff00';
        document.getElementById('mamorukun-destroy').checked = data.common?.mamorukun_destroy || false;
    });

    document.querySelectorAll('.common-input').forEach(input => {
        input.addEventListener('change', () => {
            chrome.storage.sync.set({
                common: {
                    obi_size: document.getElementById('obi-size').value,
                    obi_color_prod: document.getElementById('obi-color-prod').value,
                    obi_color_stg: document.getElementById('obi-color-stg').value,
                    mamorukun_destroy: document.getElementById('mamorukun-destroy').checked
                }
            });
        });
    });
});
