export function alertDialog(message, okText = 'OK') {
  return new Promise(resolve => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog">
        <p style="margin:0 0 12px">${message}</p>
        <menu>
          <button value="ok" class="save" autofocus>${okText}</button>
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