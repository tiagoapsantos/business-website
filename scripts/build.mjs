import { mkdir, copyFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from '../src/content.mjs';
import { renderPage, renderNotFound } from '../src/render.mjs';
import { normaliseBasePath } from '../src/paths.mjs';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function build({ basePath = process.env.BASE_PATH ?? '/', outDir = resolve(root, 'dist') } = {}) {
  basePath = normaliseBasePath(basePath);
  const out = resolve(outDir);
  await mkdir(resolve(out, 'assets'), { recursive: true });
  for (const file of await readdir(resolve(root, 'src/assets'))) await copyFile(resolve(root, 'src/assets', file), resolve(out, 'assets', file));
  for (const route of routes) {
    const directory = resolve(out, route.path.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), renderPage(route.path, { basePath }), 'utf8');
  }
  await writeFile(resolve(out, '404.html'), renderNotFound({ basePath }), 'utf8');
  await writeFile(resolve(out, '.nojekyll'), '', 'utf8');
  console.log('Build concluído: ' + routes.length + ' páginas e página 404. Prefixo: ' + basePath + ' Saída: ' + out);
  return out;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
