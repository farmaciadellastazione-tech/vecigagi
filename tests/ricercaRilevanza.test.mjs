// Test dell'ordinamento per rilevanza nelle ricerche.
//
// Requisito (Dino, 2026-07-12): cercando "ora" deve venire fuori PRIMA "ora"
// (match esatto), non "ancora" (che la contiene soltanto). Vale sia per la
// 🔍 Ricerca dell'app (index.html, che prendeva i primi 30 in ordine di file)
// sia per la Cerca di edit.html (che ordinava solo alfabeticamente).
// Gerarchia: 0 esatto < 1 inizia-con < 2 contiene. A parità, alfabetico.
// Le varianti contano singolarmente: "adesso|ora" e "óa/ora" sono match esatti.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

// Tokenizer bilanciato comment-aware e regex-aware (vedi tests/spiegaParola.test.mjs).
function scansionaBilanciato(src, start, apre, chiude) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, started = false, prevSignificant = '';
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
    if (c === '/' && !/[A-Za-z0-9_$)\]]/.test(prevSignificant)) {
      let j = i + 1, inClass = false, rEsc = false;
      for (; j < src.length; j++) {
        const rc = src[j];
        if (rEsc) { rEsc = false; continue; }
        if (rc === '\\') { rEsc = true; continue; }
        if (rc === '[') { inClass = true; continue; }
        if (rc === ']') { inClass = false; continue; }
        if (rc === '/' && !inClass) { j++; break; }
        if (rc === '\n') break;
      }
      while (j < src.length && /[a-z]/i.test(src[j])) j++;
      i = j - 1;
      prevSignificant = '/';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === apre) { depth++; started = true; }
    else if (c === chiude) { depth--; if (started && depth === 0) { i++; break; } }
    if (!/\s/.test(c)) prevSignificant = c;
  }
  return i;
}
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  let at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, i);
}

// ── rilevanzaRicerca (stessa semantica in index.html e edit.html) ────────────
// Gerarchia: 0 esatto sulla variante VISIBILE (la prima: è quella che l'utente
// vede a schermo) < 1 esatto su una variante nascosta (|/) < 2 inizia-con
// < 3 contiene. Cercando "ora", la voce it:"ora" deve battere it:"adesso|ora"
// (che a schermo mostra "adesso"), che a sua volta batte "oratore" e "ancora".
for (const [nomeFile, SRC] of [['index.html', INDEX], ['edit.html', EDIT]]) {
  test(`rilevanzaRicerca (${nomeFile}): esatto-visibile < esatto-nascosto < inizia-con < contiene`, () => {
    const ctx = vm.createContext({ console });
    vm.runInContext(extractFn(SRC, 'rilevanzaRicerca'), ctx);
    const r = (voce, q) => vm.runInContext(`rilevanzaRicerca(${JSON.stringify(voce)}, ${JSON.stringify(q)}, ["it","ge"])`, ctx);
    assert.equal(r({ it: 'ora' }, 'ora'), 0, 'match esatto sulla variante visibile');
    assert.equal(r({ it: 'adesso|ora' }, 'ora'), 1, 'variante | esatta ma nascosta (a schermo si vede "adesso")');
    assert.equal(r({ it: 'x', ge: 'óa/ora' }, 'ora'), 1, 'variante / esatta (pronuncia/grafia)');
    assert.equal(r({ it: 'orario' }, 'ora'), 2, 'inizia con');
    assert.equal(r({ it: 'ancora' }, 'ora'), 3, 'contiene soltanto');
    assert.ok(r({ it: 'casa' }, 'ora') > 3, 'nessun match → rilevanza peggiore');
  });
}

test('index.html Ricerca: i risultati sono ordinati per rilevanza (ora prima di ancora)', () => {
  const src = extractFn(INDEX, 'Ricerca');
  assert.ok(src.includes('rilevanzaRicerca('), 'la Ricerca deve ordinare per rilevanza prima dello slice(0, 30)');
  const idxSort = src.indexOf('rilevanzaRicerca');
  const idxSlice = src.indexOf('.slice(0, 30)');
  assert.ok(idxSort >= 0 && idxSlice > idxSort, 'l\'ordinamento deve avvenire PRIMA del taglio ai primi 30');
});

test('edit.html ordinaVoci: con ricerca attiva vince la rilevanza, senza resta alfabetico', () => {
  const ctx = vm.createContext({ console });
  vm.runInContext("let sortKey = 'lang'; let sortDir = 'asc'; let currentLangs = ['ge']; let currentSearch = '';", ctx);
  vm.runInContext(extractFn(EDIT, 'visiblePart'), ctx);
  vm.runInContext(extractFn(EDIT, 'rilevanzaRicerca'), ctx);
  vm.runInContext(extractFn(EDIT, 'ordinaVoci'), ctx);
  const voci = [
    { it: 'ancora', ge: 'ancùa' },
    { it: 'ora', ge: 'òa/ora' },
    { it: 'orario', ge: 'oràio' },
  ];
  // Senza ricerca: alfabetico puro (comportamento invariato)
  let out = vm.runInContext(`ordinaVoci(${JSON.stringify(voci)}).map(v => v.it)`, ctx);
  assert.deepEqual(out, ['ancora', 'ora', 'orario'], 'senza query l\'ordinamento resta quello di sempre');
  // Con ricerca "ora": il match esatto vince
  vm.runInContext("currentSearch = 'ora';", ctx);
  out = vm.runInContext(`ordinaVoci(${JSON.stringify(voci)}).map(v => v.it)`, ctx);
  assert.equal(out[0], 'ora', `cercando "ora" deve venire prima "ora", non "${out[0]}"`);
  assert.deepEqual(out, ['ora', 'orario', 'ancora'], 'esatto, poi inizia-con, poi contiene');
});
