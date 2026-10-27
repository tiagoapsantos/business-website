import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import { createServer } from '../scripts/serve.mjs';
import { renderPage, escapeHtml } from '../src/render.mjs';
import { routes } from '../src/content.mjs';
import { root, build } from '../scripts/build.mjs';
import { normaliseBasePath } from '../src/paths.mjs';
let server, base, projectServer, projectBase, testRoot, projectDirectory;
before(async () => {
 testRoot = await mkdtemp(join(tmpdir(), 'forma-grao-test-'));
 const directory = await build({ basePath: '/', outDir: resolve(testRoot, 'root') });
 projectDirectory = await build({ basePath: '/business-website/', outDir: resolve(testRoot, 'project/business-website') });
 await copyFile(resolve(projectDirectory, '404.html'), resolve(testRoot, 'project/404.html'));
 server = createServer(directory);
 // Servidor estático genérico sobre uma pasta física; sem reescritas para a aplicação.
 projectServer = createServer(resolve(testRoot, 'project'));
 for (const instance of [server, projectServer]) await new Promise(r => instance.listen(0, '127.0.0.1', r));
 base = 'http://127.0.0.1:' + server.address().port;
 projectBase = 'http://127.0.0.1:' + projectServer.address().port;
});
after(async () => {
 for (const instance of [server, projectServer]) if (instance) {
  instance.closeAllConnections(); await new Promise(r => instance.close(r));
 }
 if (testRoot && resolve(testRoot).startsWith(resolve(tmpdir()) + sep) && testRoot.split(sep).at(-1).startsWith('forma-grao-test-')) await rm(testRoot, { recursive: true });
});
test('quatro rotas reais têm idioma, título, descrição e um h1',async()=>{
 for(const route of routes){const response=await fetch(base+route.path);assert.equal(response.status,200);const body=await response.text();assert.equal(body,renderPage(route.path));assert.match(body,/lang="pt-PT"/);assert.equal((body.match(/<h1[ >]/g)||[]).length,1);assert.match(body,/name="description"/);assert.match(body,/Marca e serviços fictícios/);assert.match(body,/aria-current="page"/);}
});
test('todos os links internos, recursos e âncoras resolvem',async()=>{
 for(const route of routes){const html=renderPage(route.path);for(const [,value] of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=new URL(value,base+route.path);assert.equal(url.origin,base);const response=await fetch(url);assert.equal(response.status,200,value);if(url.hash){const target=await response.text();assert.ok(target.includes(`id="${url.hash.slice(1)}"`),value);}}}
});
test('404, redireccionamento, HEAD e métodos não permitidos',async()=>{
 assert.equal((await fetch(base+'/inexistente/')).status,404);
 const redirect=await fetch(base+'/servicos?x=1',{redirect:'manual'});assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/servicos/?x=1');
 const head=await fetch(base+'/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 const post=await fetch(base+'/contacto/',{method:'POST',body:'example'});assert.equal(post.status,405);
});
test('ficheiros fora da saída não são servidos e MIME de módulos é correcto',async()=>{
 const response=await fetch(base+'/assets/main.js');assert.match(response.headers.get('content-type'),/javascript/);
 assert.equal((await fetch(base+'/package.json')).status,404);
 assert.equal((await fetch(base+'/%2e%2e%5cpackage.json')).status,403);
 assert.match(response.headers.get('content-security-policy'),/connect-src 'none'/);
});
test('formulário tem labels, erros associados e estados acessíveis',()=>{
 const html=renderPage('/contacto/');for(const key of ['name','email','service','message']){assert.match(html,new RegExp(`for="${key}"`));assert.match(html,new RegExp(`id="${key}-error"`));assert.match(html,new RegExp(`aria-describedby="[^"]*${key}-error`));}
 assert.match(html,/role="status"/);assert.match(html,/id="request-result"[^>]*hidden/);assert.match(html,/id="prepare-request"[^>]*disabled/);
});
test('imagens têm alt e dimensões e não existem dependências de rede',()=>{
 for(const route of routes){const html=renderPage(route.path);for(const [,attrs] of html.matchAll(/<img ([^>]+)>/g)){assert.match(attrs,/alt="[^"]+"/);assert.match(attrs,/width="\d+"/);assert.match(attrs,/height="\d+"/);}assert.doesNotMatch(html,/(?:src|href)="https?:/);}
 assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('download e apresentação usam texto; não existe envio ou persistência no cliente',async()=>{
 const js=await readFile(resolve(root,'src/assets/main.js'),'utf8');assert.match(js,/preview.textContent = preparedText/);assert.match(js,/new Blob/);assert.doesNotMatch(js,/\bfetch\(|XMLHttpRequest|localStorage|sessionStorage|innerHTML/);
});

test('subpasta real: quatro páginas, recursos, imports, queries e âncoras sem reescritas', async () => {
 for (const route of routes) {
  const url = projectBase + '/business-website' + route.path;
  const response = await fetch(url);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal(html, renderPage(route.path, { basePath: '/business-website/' }));
  for (const [, value] of html.matchAll(/(?:href|src|action)="([^"]+)"/g)) {
   const target = new URL(value, url);
   assert.equal(target.origin, projectBase);
   assert.ok(target.pathname.startsWith('/business-website/'), value);
   const linked = await fetch(target);
   assert.equal(linked.status, 200, target.href);
   if (target.hash) assert.ok((await linked.text()).includes('id="' + target.hash.slice(1) + '"'));
  }
 }
 const js = await fetch(projectBase + '/business-website/assets/main.js');
 assert.match(await js.text(), /from '\.\/validation.js'/);
 const validation = await fetch(projectBase + '/business-website/assets/validation.js');
 assert.equal(validation.status, 200);
 assert.match(validation.headers.get('content-type'), /javascript/);
 const contact = await fetch(projectBase + '/business-website/contacto/?servico=restauro');
 assert.equal(contact.status, 200);
});

test('subpasta: refresh directo, redireccionamento e 404 profunda com recursos acessíveis', async () => {
 for (const route of routes) assert.equal((await fetch(projectBase + '/business-website' + route.path)).status, 200);
 const redirect = await fetch(projectBase + '/business-website/servicos?servico=restauro', { redirect: 'manual' });
 assert.equal(redirect.status, 308);
 assert.equal(redirect.headers.get('location'), '/business-website/servicos/?servico=restauro');
 const response = await fetch(projectBase + '/business-website/nao-existe/pagina/');
 assert.equal(response.status, 404);
 const html = await response.text();
 assert.match(html, /href="\/business-website\/"/);
 for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) assert.equal((await fetch(projectBase + value)).status, 200, value);
});

test('CSP de privacidade acompanha o HTML estático em vez de depender de cabeçalhos locais', async () => {
 for (const file of ['index.html', 'servicos/index.html', 'sobre/index.html', 'contacto/index.html', '404.html']) {
  const html = await readFile(resolve(projectDirectory, file), 'utf8');
  const policy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
  assert.ok(policy, file);
  for (const rule of ["connect-src 'none'", "form-action 'none'", "base-uri 'none'", "object-src 'none'"]) assert.ok(policy[1].includes(rule));
  assert.doesNotMatch(html, /<script(?![^>]*src=)/);
 }
});

test('prefixos de publicação rejeitam domínios, travessia e conteúdo injectável', () => {
 assert.equal(normaliseBasePath('/'), '/');
 assert.equal(normaliseBasePath('/business-website'), '/business-website/');
 assert.equal(normaliseBasePath('/demos/business-website/'), '/demos/business-website/');
 for (const value of ['', 'business-website', 'https://example.com/', '//example.com/', '/../', '/a/../', '/x?y=1', '/x#hash', '/x%2fy/', '/x"/><script>']) assert.throws(() => normaliseBasePath(value));
});

test('saída contém apenas páginas, assets locais e marcador estático, sem documentação ou servidor', async () => {
 const { readdir } = await import('node:fs/promises');
 assert.deepEqual((await readdir(projectDirectory)).sort(), ['.nojekyll', '404.html', 'assets', 'contacto', 'index.html', 'servicos', 'sobre'].sort());
 assert.equal(await readFile(resolve(projectDirectory, '.nojekyll'), 'utf8'), '');
});
