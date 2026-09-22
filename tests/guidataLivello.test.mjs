// Test del criterio "base" della modalità guidata di dialetti.html.
//
// Prima: i candidati mancanti venivano proposti in ordine alfabetico, senza
// priorità (i primi 20 per lo spezzino erano a presto, aprile, asino, asma,
// bacio, ... bruciore: parole di base miste a termini medici).
//
// Dopo: renderGuided ordina per livello CEFR (A1, A2, B1, B2, C1, C2, poi le
// parole senza livello o con un livello sconosciuto) con sort stabile.
// Nessuna parola è esclusa, cambia solo l'ordine. La tabella completa
// ("Vedi tutta la lista") resta alfabetica (o nell'ordine scelto da sortBy,
// che può mutare CANDIDATI: il sort per livello resta comunque stabile
// rispetto a QUELL'ordine, non è garantito che sia alfabetico).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const DIAL = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');

// Scansiona `src` da `start` bilanciando i caratteri indicati in `apre`/`chiude`
// (stesso carattere per depth++/depth--), saltando stringhe ('/"/`), commenti
// riga (//) e commenti blocco (/* */). NECESSARIO in questo codebase: i
// commenti in italiano contengono apostrofi (es. "l'ordine", "l'utente") che
// un tokenizer senza supporto commenti scambia per apertura di stringa,
// sballando il bilanciamento graffe/parentesi su distanze lunghe.
// (stessa funzione di tests/streak.test.mjs e altri — vedi [[feedback_riuso_liguria]])
function scansionaBilanciato(src, start, apre, chiude) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, started = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (inLineComment) { if (c === '\n') inLineComment = false; continue; }
    if (inBlockComment) { if (c === '*' && c2 === '/') { inBlockComment = false; i++; } continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === q) inStr = false;
      continue;
    }
    if (c === '/' && c2 === '/') { inLineComment = true; i++; continue; }
    if (c === '/' && c2 === '*') { inBlockComment = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === apre) { depth++; started = true; }
    else if (c === chiude) { depth--; if (started && depth === 0) { i++; break; } }
  }
  return i;
}

function ambiente() {
  const iConst = DIAL.indexOf('const LIVELLO_ORDINE');
  assert.ok(iConst >= 0, 'LIVELLO_ORDINE non trovato in dialetti.html');
  const finConst = DIAL.indexOf(';', iConst) + 1;
  const iSconosciuto = DIAL.indexOf('const LIVELLO_SCONOSCIUTO', finConst);
  assert.ok(iSconosciuto >= 0, 'LIVELLO_SCONOSCIUTO non trovato in dialetti.html');
  const finSconosciuto = DIAL.indexOf(';', iSconosciuto) + 1;
  const iFunc = DIAL.indexOf('function ordinePerLivello', finSconosciuto);
  assert.ok(iFunc >= 0, 'ordinePerLivello non trovato in dialetti.html');
  const corpoStart = DIAL.indexOf('{', iFunc);
  const corpoEnd = scansionaBilanciato(DIAL, corpoStart, '{', '}');
  const codice = DIAL.slice(iConst, finConst) + '\n' + DIAL.slice(iSconosciuto, finSconosciuto) +
    '\nfunction ordinePerLivello(a, b) ' + DIAL.slice(corpoStart, corpoEnd) +
    '\nthis.ordinePerLivello = ordinePerLivello; this.LIVELLO_ORDINE = LIVELLO_ORDINE;';
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(codice, ctx);
  return ctx;
}

const voci = (...l) => l.map(([it, livello]) => ({ it, livello }));

test('ordina A1 < A2 < B1 < B2 < C1 < C2 e le parole senza livello per ultime', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['g', undefined], ['f', 'C2'], ['e', 'C1'], ['d', 'B2'], ['c', 'B1'], ['b', 'A2'], ['a', 'A1']).sort(ordinePerLivello);
  assert.deepStrictEqual(r.map(x => x.it), ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
});

test('sort stabile: a parità di livello resta l\'ordine originale', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['acqua', 'A1'], ['asma', undefined], ['bacio', 'A1'], ['bello', 'A2'], ['birra', 'A1'], ['bruciore', undefined]).sort(ordinePerLivello);
  assert.deepStrictEqual(r.map(x => x.it), ['acqua', 'bacio', 'birra', 'bello', 'asma', 'bruciore']);
});

test('un livello sconosciuto (non A1-C2) o vuoto vale come "senza livello" (in fondo, non escluso)', () => {
  const { ordinePerLivello } = ambiente();
  const r = voci(['x', 'C3'], ['y', ''], ['z', 'A1']).sort(ordinePerLivello);
  assert.strictEqual(r[0].it, 'z');
  assert.strictEqual(r.length, 3, 'nessuna parola deve sparire');
});

test('renderGuided usa l\'ordinamento per livello', () => {
  const i = DIAL.indexOf('function renderGuided');
  const corpo = DIAL.slice(i, DIAL.indexOf('\nfunction loadMoreGuided', i));
  assert.match(corpo, /\.sort\(ordinePerLivello\)/);
});

test('ordinePerLivello: una sola definizione e una sola chiamata (in renderGuided) — non conta le menzioni in commenti', () => {
  const definizioni = DIAL.match(/function ordinePerLivello\(/g) || [];
  const chiamate = DIAL.match(/\.sort\(ordinePerLivello\)/g) || [];
  assert.strictEqual(definizioni.length, 1, 'attesa una sola definizione di ordinePerLivello');
  assert.strictEqual(chiamate.length, 1, 'ordinePerLivello deve essere chiamata solo in renderGuided (la tabella completa resta come CANDIDATI/sortBy la lasciano)');
});

test('i candidati che stanno anche in index ereditano il livello (dati)', () => {
  const con = (DIAL.match(/\{ tema:"[^"]*", livello:"(A1|A2|B1|B2)", it:/g) || []).length;
  assert.ok(con >= 300, `attesi almeno 300 candidati con livello, trovati ${con}`);
});

test('LIVELLO_ORDINE è coerente con ORDINE di edit.html (stessi livelli, stesso ordine relativo)', () => {
  const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');
  const m = /const ORDINE\s*=\s*(\[[^\]]*\])/.exec(EDIT);
  assert.ok(m, 'ORDINE non trovato in edit.html (scegliLivelloCanonico)');
  const ordineEdit = JSON.parse(m[1].replace(/'/g, '"'));
  const { LIVELLO_ORDINE } = ambiente();
  const ordineDial = Object.keys(LIVELLO_ORDINE).sort((a, b) => LIVELLO_ORDINE[a] - LIVELLO_ORDINE[b]);
  assert.deepStrictEqual(ordineDial, ordineEdit);
});
