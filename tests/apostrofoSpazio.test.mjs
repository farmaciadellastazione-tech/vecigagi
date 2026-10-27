// Segnalato da Dino (2026-10-27): nelle coniugazioni "le o l' avia" non era
// accettata per "lê o l'avià" (genovese, avere, futuro, 3ª sing.). L'apostrofo
// è già facoltativo, ma lo spazio dopo spezzava la parola ("l avia" ≠ "lavia").
// isCorretta ora riprova con l'apostrofo attaccato alla parola dopo. Solo un
// secondo tentativo: in "un po' di" lo spazio fa parte della frase.
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
const ok = (atteso, dato, bcp, cod, preciso) => ctx.isCorretta(atteso, dato, bcp, cod, preciso);
const AVIA = "lé u l'avià/lê o l'avià";

test('spazio dopo l\'apostrofo: accettato (coniugazione genovese)', () => {
  assert.strictEqual(ok(AVIA, "le o l'avia", 'it-IT', 'ge', true), true); // già prima
  assert.strictEqual(ok(AVIA, "le o l' avia", 'it-IT', 'ge', true), true);
  assert.strictEqual(ok(AVIA, "lê o l' avià", 'it-IT', 'ge', true), true);
  assert.strictEqual(ok(AVIA, "lê o l’ avià", 'it-IT', 'ge', true), true); // apostrofo tipografico
});

test('spazio dopo l\'apostrofo: anche nelle lingue normali', () => {
  assert.strictEqual(ok("l'homme", "l' homme", 'fr-FR', 'fr'), true);
});

test('non cambia ciò che valeva già, e una risposta sbagliata resta sbagliata', () => {
  assert.strictEqual(ok("un po' di", 'un po di', 'it-IT', 'it'), true);
  assert.strictEqual(ok("un po' di", "un po' di", 'it-IT', 'it'), true);
  assert.strictEqual(ok(AVIA, "le o l' aveva", 'it-IT', 'ge', true), false);
  assert.strictEqual(ok("l'homme", "l' femme", 'fr-FR', 'fr'), false);
});

// Code review: il secondo tentativo attacca l'apostrofo da tutte e due le parti
test('spazio dopo l\'apostrofo: anche nella soluzione, e misto nella stessa risposta', () => {
  assert.strictEqual(ok("pe' piaxei", "pe'piaxei", 'it-IT', 'ge'), true);
  assert.strictEqual(ok("l'avia un po' de", "l' avia un po' de", 'it-IT', 'ge'), true);
  assert.strictEqual(ok("un po' di", "un po'di", 'it-IT', 'it'), true);
});
