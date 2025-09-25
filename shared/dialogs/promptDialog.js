export function promptDialog(message, defaultValue = '', okText = 'OK', cancelText = 'Cancel') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog">
        <label style="display:block;margin:0 0 8px">${message}</label>
        <input type="text" id="inp" style="width:100%;box-sizing:border-box" value="${defaultValue}">
        <menu>
          <button value="cancel" class="cancel">${cancelText}</button>
          <button value="ok" class="save" autofocus>${okText}</button>
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