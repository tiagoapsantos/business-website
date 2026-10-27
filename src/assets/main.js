import { validateRequest, requestSummary, serviceNames } from './validation.js';

const form = document.querySelector('#request-form');
if (form instanceof HTMLFormElement) {
  const summary = document.querySelector('#error-summary');
  const errorsList = document.querySelector('#error-list');
  const result = document.querySelector('#request-result');
  const preview = document.querySelector('#request-preview');
  const status = document.querySelector('#form-status');
  const download = document.querySelector('#download-request');
  const downloadStatus = document.querySelector('#download-status');
  const selected = new URLSearchParams(window.location.search).get('servico');
  if (selected && Object.hasOwn(serviceNames, selected)) form.elements.namedItem('service').value = selected;
  let preparedText = '';
  form.noValidate = true;

  function clearErrors() {
    errorsList.replaceChildren();
    summary.hidden = true;
    for (const key of ['name', 'email', 'service', 'message']) {
      form.elements.namedItem(key).removeAttribute('aria-invalid');
      document.querySelector(`#${key}-error`).textContent = '';
    }
  }

  function invalidatePreview() {
    if (preparedText) status.textContent = 'O pedido foi alterado. Prepare novamente o resumo antes de o descarregar.';
    preparedText = '';
    result.hidden = true;
    preview.textContent = '';
    downloadStatus.textContent = '';
  }

  form.addEventListener('input', event => {
    invalidatePreview();
    const field = event.target;
    if (field instanceof HTMLElement && field.id) {
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.textContent = '';
    }
    if (!summary.hidden) { summary.hidden = true; errorsList.replaceChildren(); }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    invalidatePreview();
    clearErrors();
    const checked = validateRequest(Object.fromEntries(new FormData(form)));
    if (!checked.valid) {
      status.textContent = '';
      for (const [key, message] of Object.entries(checked.errors)) {
        const field = form.elements.namedItem(key);
        field.setAttribute('aria-invalid', 'true');
        document.querySelector(`#${key}-error`).textContent = message;
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${key}`;
        link.textContent = message;
        link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
        li.append(link);
        errorsList.append(li);
      }
      summary.hidden = false;
      summary.focus();
      return;
    }
    preparedText = requestSummary(checked.data);
    preview.textContent = preparedText;
    result.hidden = false;
    status.textContent = 'Resumo pronto para revisão. Nada foi enviado ou guardado num servidor.';
    result.focus();
  });

  download.addEventListener('click', () => {
    if (!preparedText) return;
    let url;
    try {
      url = URL.createObjectURL(new Blob([preparedText], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pedido-demonstracao-forma-e-grao.txt';
      document.body.append(link);
      link.click();
      link.remove();
      downloadStatus.textContent = 'Foi pedido ao navegador para descarregar o ficheiro. Nada foi enviado ao atelier.';
    } catch {
      downloadStatus.textContent = 'Não foi possível iniciar a descarga. Pode seleccionar e copiar o resumo apresentado.';
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
  document.querySelector('#prepare-request').disabled = false;
  form.addEventListener('reset', () => {
    clearErrors(); invalidatePreview(); status.textContent = 'Campos limpos. Nenhum pedido foi enviado.';
    form.elements.namedItem('name').focus();
  });
}
