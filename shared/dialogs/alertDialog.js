export function alertDialog(message, okText = 'OK') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog" style="min-width:280px">
        <p style="margin:0 0 12px">${message}</p>
        <menu style="display:flex;gap:8px;justify-content:flex-end;margin:0">
          <button value="ok" autofocus>${okText}</button>
        </menu>
      </form>`;
    dlg.addEventListener('close', () => {
      dlg.remove();
      resolve();
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}