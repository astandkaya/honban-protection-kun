export function confirmDialog(message, okText = 'OK', cancelText = 'Cancel') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog">
        <p style="margin:0 0 12px">${message}</p>
        <menu>
          <button value="cancel" class="cancel">${cancelText}</button>
          <button value="ok" class="save" autofocus>${okText}</button>
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