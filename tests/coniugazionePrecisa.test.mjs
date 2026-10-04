// Controllo preciso per le coniugazioni (richiesta di Dino, 2026-10-02).
// isCorretta ha due tolleranze pensate per il vocabolario: un'attesa di ≤4
// lettere accetta qualunque risposta che la contenga, e una parola singola
// accetta qualunque risposta che inizi con lei (o viceversa). Nelle
// coniugazioni le persone si distinguono proprio dalla desinenza: "parlano"
// passava per "parla", ge "veuan" (3ª plur.) per "o veu" (3ª sing.).
// Con preciso=true restano solo i confronti esatti (accenti, soggetto,
// varianti dialettali, omofoni); il vocabolario normale non cambia.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

function tra(inizio, fine) {
  const a = HTML.indexOf(inizio);
  if (a < 0) throw new Error('non trovato: ' + inizio);
  const b = HTML.indexOf(fine, a);
  if (b < 0) throw new Error('non trovato: ' + fine);
  return HTML.slice(a, b);
}
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const NUMERI_PAROLE = {', '\nconst SR = '),               // numeri, omofoni, rimuoviSoggetto, isCorretta
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),      // SOGGETTI, SOGGETTI_ALTRI, pronomi pieni
  'globalThis.isCorretta = isCorretta;',
].join('\n'), ctx);
const ok = (atteso, dato, cod, bcp, preciso) => ctx.isCorretta(atteso, dato, bcp, cod, preciso);

test('preciso: niente "inizia con" né "contiene"', () => {
  assert.strictEqual(ok('parla', 'parlano', 'it', 'it-IT', true), false);
  assert.strictEqual(ok('o veu|o eu|veu', 'veuan', 'ge', 'it-IT', true), false);
  assert.strictEqual(ok('o sa|sa', 'san', 'ge', 'it-IT', true), false);
  assert.strictEqual(ok('kann', 'kannst', 'de', 'de-DE', true), false);
});

test('preciso: le risposte giuste restano giuste', () => {
  assert.strictEqual(ok('parla', 'Parla', 'it', 'it-IT', true), true);
  assert.strictEqual(ok('può', 'puo', 'it', 'it-IT', true), true, 'accenti ignorati');
  assert.strictEqual(ok('kann', 'er kann', 'de', 'de-DE', true), true, 'soggetto ammesso');
  assert.strictEqual(ok('kann', 'sie kann', 'de', 'de-DE', true), true, 'soggetto femminile');
  assert.strictEqual(ok('o veu|o eu|veu', 'veu', 'ge', 'it-IT', true), true, 'forma senza clitico');
  assert.strictEqual(ok('a vëgne|a ven|vegne|ven', 'a ven', 'ge', 'it-IT', true), true, 'alternativa nascosta');
  assert.strictEqual(ok('will love', 'will love', 'en', 'en-US', true), true);
});

// 2026-10-04 (richiesta di Dino, ok a cambiare questo test): anche il
// vocabolario è preciso, la tolleranza "inizia con" non c'è più.
test('anche il vocabolario è preciso: parlano non vale per parla', () => {
  assert.strictEqual(ok('parla', 'parlano', 'it', 'it-IT'), false);
});

test('verificaRisposta usa il controllo preciso per le carte coniugazione', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  const chiamate = v.match(/isCorretta\([^)]*\)/g) || [];
  assert.ok(chiamate.length >= 2);
  for (const c of chiamate) assert.match(c, /carta\.tipo === "coniugazione"\)$/, c);
});
