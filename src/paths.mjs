/** Prefixo de publicação: apenas segmentos locais, sem domínio, query ou travessia. */
export function normaliseBasePath(value = '/') {
  if (typeof value !== 'string' || (value !== '/' && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\/?$/.test(value))) {
    throw new Error('BASE_PATH deve ser / ou um caminho como /business-website/.');
  }
  return value.endsWith('/') ? value : value + '/';
}

/** Os templates só contêm URLs locais; mantém queries e fragmentos dos links. */
export function applyBasePath(html, basePath = '/') {
  const base = normaliseBasePath(basePath);
  return html.replace(/\b(href|src|action)="\/([^"]*)"/g, (_, attribute, suffix) => attribute + '="' + base + suffix + '"');
}

// Meta CSP acompanha os ficheiros estáticos; não depende do servidor de preview.
export const contentSecurityPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'";
