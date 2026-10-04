// Richieste di Dino (2026-10-04):
// 1) vocabolario preciso come le coniugazioni: "brief" passava per
//    "Brieftasche" (tolleranza "inizia con"), e passavano anche lettere in più.
// 2) le risposte in alfabeti non latini (russo, cinese, giapponese, coreano,
//    arabo) erano sempre sbagliate: normalizza() teneva solo a-z (e il greco).
// 3) la parola col trattino si può scrivere anche tutta attaccata
//    ("peutêtre" per "peut-être", "Email" per "E-Mail").
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const NUMERI_PAROLE = {', '\nconst SR = '),
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  'globalThis.isCorretta = isCorretta;',
].join('\n'), ctx);
const ok = (atteso, dato, bcp, cod) => ctx.isCorretta(atteso, dato, bcp, cod);

test('vocabolario: niente più "inizia con" né lettere in più', () => {
  assert.strictEqual(ok('Brieftasche', 'brief', 'de-DE', 'de'), false);
  assert.strictEqual(ok('Brieftasche', 'brieftaschexyz', 'de-DE', 'de'), false);
  assert.strictEqual(ok('casa', 'cas', 'it-IT', 'it'), false);
  assert.strictEqual(ok('gatto', 'gattone', 'it-IT', 'it'), false);
});

test('vocabolario: le risposte giuste restano giuste', () => {
  assert.strictEqual(ok('Brieftasche', 'brieftasche', 'de-DE', 'de'), true);
  assert.strictEqual(ok('perché', 'perche', 'it-IT', 'it'), true);
  assert.strictEqual(ok('to eat', 'eat', 'en-US', 'en'), true);
  assert.strictEqual(ok('cammino|tragitto', 'tragitto', 'it-IT', 'it'), true);
  assert.strictEqual(ok('noce (frutto)', 'noce', 'it-IT', 'it'), true);
});

test('alfabeti non latini: le risposte giuste sono accettate', () => {
  assert.strictEqual(ok('вода', 'вода', 'ru-RU', 'ru'), true);
  assert.strictEqual(ok('понимать|осознавать', 'осознавать', 'ru-RU', 'ru'), true);
  assert.strictEqual(ok('水', '水', 'zh-CN', 'zh'), true);
  assert.strictEqual(ok('空腹時', '空腹時', 'ja-JP', 'ja'), true);
  assert.strictEqual(ok('물', '물', 'ko-KR', 'ko'), true);
  assert.strictEqual(ok('ماء', 'ماء', 'ar-SA', 'ar'), true);
  assert.strictEqual(ok('вода', 'водка', 'ru-RU', 'ru'), false, 'e quelle sbagliate restano sbagliate');
});

test('trattino: anche la forma tutta attaccata', () => {
  assert.strictEqual(ok('peut-être', 'peutetre', 'fr-FR', 'fr'), true);
  assert.strictEqual(ok('peut-être', 'peut être', 'fr-FR', 'fr'), true);
  assert.strictEqual(ok('E-Mail', 'email', 'de-DE', 'de'), true);
});
