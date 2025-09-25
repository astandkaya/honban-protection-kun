export function promptDialog(message, defaultValue = '', okText = 'OK', cancelText = 'キャンセル') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog" style="min-width:280px">
        <label style="display:block;margin:0 0 8px">${message}</label>
        <input id="inp" style="width:100%;box-sizing:border-box" value="${defaultValue}">
        <menu style="display:flex;gap:8px;justify-content:flex-end;margin:10px 0 0">
          <button value="cancel">${cancelText}</button>
          <button value="ok" autofocus>${okText}</button>
        </menu>
      </form>`;
    dlg.addEventListener('close', () => {
      const ok = dlg.returnValue === 'ok';
      const val = ok ? dlg.querySelector('#inp').value : null;
      dlg.remove();
      resolve(val);
    });
    document.body.append(dlg);
    dlg.showModal();
    dlg.querySelector('#inp').select();
  });
}