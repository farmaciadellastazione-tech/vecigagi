// Test del criterio "base" della modalità guidata di dialetti.html.
//
// Prima: i candidati mancanti venivano proposti in ordine alfabetico, senza
// priorità (i primi 20 per lo spezzino erano a presto, aprile, asino, asma,
// bacio, ... bruciore: parole di base miste a termini medici).
//
// Dopo: renderGuided ordina per livello CEFR (A1, A2, B1, B2, poi le parole
// senza livello) con sort stabile. Nessuna parola è esclusa, cambia solo
// l'ordine. La tabella completa ("Vedi tutta la lista") resta alfabetica.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const DIAL = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');

function ambiente() {
  const i = DIAL.indexOf('const LIVELLO_ORDINE');
  assert.ok(i >= 0, 'LIVELLO_ORDINE non trovato in dialetti.html');
  // il file può avere fine riga CRLF: si cerca solo "\n}" (la } a colonna 0 che chiude la funzione)
  const j = DIAL.indexOf('\n}', DIAL.indexOf('function ordinePerLivello', i)) + 2;
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(DIAL.slice(i, j) + '\nthis.ordinePerLivello = ordinePerLivello;', ctx);
  return ctx;
}

const voci = (...l) => l.map(([it, livello]) => ({ it, livello }));

test('ordina A1 < A2 < B1 < B2 e le parole senza livello per ultime', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['e', undefined], ['d', 'B2'], ['c', 'B1'], ['b', 'A2'], ['a', 'A1']).sort(ordinePerLivello);
  assert.deepStrictEqual(r.map(x => x.it), ['a', 'b', 'c', 'd', 'e']);
});

test('sort stabile: a parità di livello resta l\'ordine originale', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['acqua', 'A1'], ['asma', undefined], ['bacio', 'A1'], ['bello', 'A2'], ['birra', 'A1'], ['bruciore', undefined]).sort(ordinePerLivello);
  assert.deepStrictEqual(r.map(x => x.it), ['acqua', 'bacio', 'birra', 'bello', 'asma', 'bruciore']);
});

test('un livello sconosciuto o vuoto vale come "senza livello" (in fondo, non escluso)', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['x', 'C2'], ['y', ''], ['z', 'A1']).sort(ordinePerLivello);
  assert.strictEqual(r[0].it, 'z');
  assert.strictEqual(r.length, 3, 'nessuna parola deve sparire');
});

test('renderGuided usa l\'ordinamento per livello', () => {
  const i = DIAL.indexOf('function renderGuided');
  const corpo = DIAL.slice(i, DIAL.indexOf('\nfunction loadMoreGuided', i));
  assert.match(corpo, /\.sort\(ordinePerLivello\)/);
});

test('la tabella completa NON è ordinata per livello (resta alfabetica)', () => {
  const usi = DIAL.match(/ordinePerLivello/g) || [];
  // 1 definizione + 1 uso in renderGuided (+ nessun altro punto)
  assert.strictEqual(usi.length, 2, 'ordinePerLivello deve essere usato solo in renderGuided');
});

test('i candidati che stanno anche in index ereditano il livello (dati)', () => {
  const con = (DIAL.match(/\{ tema:"[^"]*", livello:"(A1|A2|B1|B2)", it:/g) || []).length;
  assert.ok(con >= 300, `attesi almeno 300 candidati con livello, trovati ${con}`);
});
