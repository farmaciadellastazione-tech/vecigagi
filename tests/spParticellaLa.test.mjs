// Review del lotto 1 spezzino (59d064e): la particella femminile "la" non era
// tra i clitici che formaBaseDialetto toglie, quindi "fa" era giusta per
// "i fa" (3ª sing.) ma sbagliata per "la fa" (3ª sing. f.). Idem "g'ha" per
// "la g'ha" (avere).
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
const varianti = s => JSON.parse(vm.runInContext(
  `JSON.stringify([...variantiBaseDialetto(${JSON.stringify(s)}), ...variantiSenzaSoggettoDialetto(${JSON.stringify(s)})])`, ctx));

test('"la" si toglie come "i": la forma col solo verbo è accettata', () => {
  assert.ok(varianti('la fa').includes('fa'));
  assert.ok(varianti('la mangia').includes('mangia'));
  assert.deepStrictEqual(varianti("la g'ha"), varianti("i g'ha"), 'come il maschile');
  assert.ok(varianti("la g'ha").includes('gha'), "\"g'ha\" come per \"i g'ha\"");
  assert.ok(varianti('i fa').includes('fa'), 'il maschile resta com\'era');
});

test('"l\'è" resta com\'era', () => {
  assert.ok(varianti("l'è").includes('e'));
});
