// Review di 67a94b6 (2026-10-04):
// 1) ß e œ: con la tastiera italiana si scrive "weiss", "oeil": devono valere
//    per "weiß", "œil" (come già æ = e).
// 2) gli accenti si tolgono solo alle lettere latine e greche: in giapponese
//    il dakuten distingue parole (が ≠ か), in russo й ≠ и. ё = е (in russo si
//    scrive spesso senza puntini).
// 3) niente aiutino per cinese/giapponese/coreano: con 1-2 caratteri ogni
//    risposta sbagliata risultava "quasi giusta".
// 4) francese: la "j" iniziale si toglie solo se è davvero "j'" (prima
//    "ardin" passava per "jardin").
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
const ok = (a, d, b, c) => ctx.isCorretta(a, d, b, c);

test('ß = ss, œ = oe', () => {
  assert.ok(ok('weiß', 'weiss', 'de-DE', 'de'));
  assert.ok(ok('groß', 'gross', 'de-DE', 'de'));
  assert.ok(ok('weiß', 'weiß', 'de-DE', 'de'));
  assert.ok(ok('œil', 'oeil', 'fr-FR', 'fr'));
  assert.ok(ok('cœur', 'coeur', 'fr-FR', 'fr'));
});

test('accenti tolti solo a latino e greco', () => {
  assert.strictEqual(ctx.normalizza('Perché'), 'perche');
  assert.strictEqual(ctx.normalizza('φιλῶ'), 'φιλω');
  assert.ok(!ok('がき', 'かき', 'ja-JP', 'ja'), 'dakuten');
  assert.ok(ok('がき', 'がき', 'ja-JP', 'ja'));
  assert.ok(!ok('мой', 'мои', 'ru-RU', 'ru'), 'й ≠ и');
  assert.ok(ok('мой', 'мой', 'ru-RU', 'ru'));
  assert.ok(ok('ёлка', 'елка', 'ru-RU', 'ru'), 'ё = е');
});

test('niente aiutino per cinese, giapponese, coreano', () => {
  assert.strictEqual(ctx.quasiGiusta('水', '火', 'zh'), null);
  assert.strictEqual(ctx.quasiGiusta('水', '火', 'ja'), null);
  assert.strictEqual(ctx.quasiGiusta('물', '불', 'ko'), null);
  assert.ok(ctx.quasiGiusta('Brieftasche', 'Brieftashe', 'de'), 'le altre lingue come prima');
});

test('francese: la j si toglie solo se è j\'', () => {
  assert.ok(!ok('jardin', 'ardin', 'fr-FR', 'fr'));
  assert.ok(!ok('jour', 'our', 'fr-FR', 'fr'));
  assert.ok(ok('jardin', 'jardin', 'fr-FR', 'fr'));
  assert.ok(ok('aime', "j'aime", 'fr-FR', 'fr'));
});
