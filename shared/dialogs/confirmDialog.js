export function confirmDialog(message, okText = 'OK', cancelText = 'キャンセル') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog" style="min-width:280px">
        <p style="margin:0 0 12px">${message}</p>
        <menu style="display:flex;gap:8px;justify-content:flex-end;margin:0">
          <button value="cancel">${cancelText}</button>
          <button value="ok" autofocus>${okText}</button>
        </menu>
      </form>`;
    dlg.addEventListener('close', () => {
      const ok = dlg.returnValue === 'ok';
      dlg.remove();
      resolve(ok);
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}