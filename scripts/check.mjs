import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { root } from './build.mjs';
async function walk(dir) {
  for (const item of await readdir(resolve(root,dir),{withFileTypes:true})) {
    const path = `${dir}/${item.name}`;
    if (item.isDirectory()) await walk(path);
    else if (/\.m?js$/.test(path)) {
      const result=spawnSync(process.execPath,['--check',resolve(root,path)],{stdio:'inherit'});
      if (result.status!==0) process.exit(result.status??1);
    }
  }
}
for (const dir of ['src','scripts','tests']) await walk(dir);
console.log('Sintaxe JavaScript verificada.');
