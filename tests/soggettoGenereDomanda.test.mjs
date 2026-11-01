// Dino 2026-11-01: "loro hanno" → francese, "Ils ont" bocciata perché la carta
// era la "3ª plur. f.". Il maschile su una carta femminile resta un errore,
// tranne quando la lingua della domanda ha lo stesso soggetto per i due generi
// (loro, they, sie): lì non si può sapere quale dei due pronomi serva.
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
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  'globalThis.sbagliato = soggettoPersonaSbagliata; globalThis.vista = personaVistaDallaDomanda;',
].join('\n'), ctx);
// come verificaRisposta: il controllo sulla persona che la domanda lascia vedere
const s = (r, l, p, da) => ctx.sbagliato(r, l, ctx.vista(p, da));

test('domanda senza genere (loro, they, sie): vale anche il maschile', () => {
  for (const da of ['it', 'en', 'de']) {
    assert.ok(!s('ils ont', 'fr', '3ª plur. f.', da), da);
    assert.ok(!s('ellos tienen', 'es', '3ª plur. f.', da), da);
    assert.ok(!s('eles têm', 'pt', '3ª plur. f.', da), da);
    assert.ok(!s('elles ont', 'fr', '3ª plur. f.', da), da);
  }
});

test('domanda con il genere (elles, ellas, lei, she): il maschile resta un errore', () => {
  assert.ok(s('ils ont', 'fr', '3ª plur. f.', 'es'));
  assert.ok(s('ellos tienen', 'es', '3ª plur. f.', 'fr'));
  assert.ok(s('il a', 'fr', '3ª sing. f.', 'it'));
  assert.ok(s('il a', 'fr', '3ª sing. f.', 'en'));
});

test('anche con la domanda senza genere, un\'altra persona resta un errore', () => {
  assert.ok(s('nous avons', 'fr', '3ª plur. f.', 'it'));
  assert.ok(s('je ont', 'fr', '3ª plur. f.', 'de'));
});

test('persona non femminile: resta com\'è', () => {
  assert.strictEqual(ctx.vista('3ª plur.', 'it'), '3ª plur.');
  assert.strictEqual(ctx.vista('1ª sing.', 'de'), '1ª sing.');
});

test('verificaRisposta riammette il maschile solo se la domanda non mostra il genere', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /if \(okPrimaDelSoggetto && !ok && !soggettoPersonaSbagliata\(risposta, lA\?\.codice, personaVistaDallaDomanda\(carta\.persona, carta\.lDA\?\.codice\)\)\) ok = true;/);
});
