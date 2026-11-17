import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync, existsSync} from 'node:fs';
import {join, resolve, dirname, extname} from 'node:path';

function sourceFiles(dir){
  return readdirSync(dir).flatMap(name => {
    const path = join(dir,name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(js|jsx|ts|tsx)$/.test(path) ? [path] : [];
  });
}

test('every relative import in source resolves to a real file', () => {
  const files = sourceFiles(resolve('src'));
  const missing = [];
  const importRE = /(?:\bimport\s+(?:[^'";]*?\s+from\s+)?|\bimport\s*\()\s*['"](\.[^'"]+)['"]/g;
  for(const file of files){
    const source = readFileSync(file,'utf8');
    for(const match of source.matchAll(importRE)){
      const destination = resolve(dirname(file),match[1]);
      const variants = [destination, `${destination}.js`,`${destination}.jsx`,`${destination}.css`, join(destination,'index.js'),join(destination,'index.jsx')];
      if(!variants.some(existsSync)) missing.push(`${file}: ${match[1]}`);
    }
  }
  assert.deepEqual(missing,[],`Missing relative imports:\n${missing.join('\n')}`);
});
