// rimuoviSoggetto (index.html) deve togliere dalla risposta anche i pronomi
// femminili/neutri, non solo quelli di SOGGETTI (maschili): chi risponde
// "she can" o "sie kann" alla 3ª sing. non deve vedersela segnata sbagliata.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const VOCAB = fs.readFileSync(ROOT + '/vocab.js', 'utf8');

function blocco(src, inizio) {
  const a = src.indexOf(inizio);
  if (a < 0) throw new Error('non trovato: ' + inizio);
  let d = 0, i = src.indexOf('{', a), inS = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inS) { if (c === '\\') { i++; continue; } if (c === inS) inS = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inS = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
  }
  return src.slice(a, i + 1);
}

const ctx = vm.createContext({ globalThis: {} });
ctx.globalThis = ctx;
vm.runInContext(VOCAB, ctx);
vm.runInContext([
  blocco(HTML, 'const SOGGETTI = {'),
  HTML.includes('const SOGGETTI_ALTRI = {') ? blocco(HTML, 'const SOGGETTI_ALTRI = {') : '',
  // (non blocco(): i commenti della funzione contengono apostrofi, "j'")
  HTML.slice(HTML.indexOf('function rimuoviSoggetto('), HTML.indexOf('\nfunction isCorretta(')),
  'globalThis.rimuoviSoggetto = rimuoviSoggetto;',
].join(';\n'), ctx);
const rs = ctx.rimuoviSoggetto;

test('toglie i pronomi maschili (comportamento esistente)', () => {
  assert.strictEqual(rs('he can', 'en'), 'can');
  assert.strictEqual(rs('er kann', 'de'), 'kann');
  assert.strictEqual(rs('il peut', 'fr'), 'peut');
});

test('toglie anche i pronomi femminili e neutri', () => {
  assert.strictEqual(rs('she can', 'en'), 'can');
  assert.strictEqual(rs('it can', 'en'), 'can');
  assert.strictEqual(rs('es kann', 'de'), 'kann');
  assert.strictEqual(rs('elle peut', 'fr'), 'peut');
  assert.strictEqual(rs('elles peuvent', 'fr'), 'peuvent');
  assert.strictEqual(rs('ella puede', 'es'), 'puede');
  assert.strictEqual(rs('nosotras podemos', 'es'), 'podemos');
  assert.strictEqual(rs('ela pode', 'pt'), 'pode');
  assert.strictEqual(rs('elas podem', 'pt'), 'podem');
  assert.strictEqual(rs('illa pote', 'ia'), 'pote');
  assert.strictEqual(rs('lei può', 'it'), 'puo');
});

test('non tocca le forme senza soggetto', () => {
  assert.strictEqual(rs('can', 'en'), 'can');
  assert.strictEqual(rs('kann', 'de'), 'kann');
});
