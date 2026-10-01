// Coniugazioni dialettali (review 2026-10-02): variantiBaseDialetto tagliava le
// alternative nascoste (dopo "|") prima di togliere pronome/clitico, quindi
// ge "a vëgne|a ven" accettava "vëgne" ma non "ven", e cr "...|noàltri abian"
// non accettava "abian". Ora le varianti senza pronome valgono anche per le
// alternative nascoste (accettate, mai mostrate né lette).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
const varianti = s => JSON.parse(vm.runInContext(`JSON.stringify(variantiBaseDialetto(${JSON.stringify(s)}))`, ctx));

test('le alternative nascoste producono anche la forma senza pronome/clitico', () => {
  assert.ok(varianti('a vëgne|a ven').includes('ven'), 'ge venire 3ª sing. f.');
  assert.ok(varianti('o vëgne|o ven').includes('ven'), 'ge venire 3ª sing.');
  assert.ok(varianti('noàltri avén/noàltri avéń|noàltri abian').includes('abian'), 'cr avere 1ª plur.');
});

test('le forme visibili funzionano come prima', () => {
  assert.deepStrictEqual(varianti('a vëgne|a ven').filter(v => v !== 'ven'), ['vegne']);
  assert.deepStrictEqual(varianti("i g'agia"), ['agia']);
});
