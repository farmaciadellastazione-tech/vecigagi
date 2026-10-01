// Seguito di variantiNascoste.test.mjs: dalle alternative nascoste non si
// generano forme senza pronome troppo corte. isCorretta accetta, per le
// attese di ≤4 lettere, qualunque risposta che le CONTENGA: ge volere
// "o veu|o eu" → "eu" avrebbe accettato anche "veuan" (3ª plur.) per la 3ª
// sing. Per questo l'alternativa era stata scritta "o eu" col pronome.
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

test('alternative nascoste: niente forme senza pronome sotto le 3 lettere', () => {
  assert.ok(!varianti('o veu|o eu').includes('eu'));
  assert.ok(!varianti('ti veu|ti eu').includes('eu'));
  assert.ok(varianti('o veu|o eu').includes('veu'), 'la forma visibile resta');
  assert.ok(varianti('a vëgne|a ven').includes('ven'), '3 lettere: resta');
});
