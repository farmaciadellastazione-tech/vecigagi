// Richiesta di Dino (2026-10-04): negli esercizi vocali non ha senso rispondere
// a voce nella propria lingua (quella dell'interfaccia, di solito l'italiano).
// estraiCarte accetta una lingua da escludere come risposta; avvia la passa per
// la modalità "voce" (e se la lingua di risposta scelta era proprio quella,
// torna a "qualsiasi"); il selettore "Rispondo in…" non la propone.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');
const VOCAB = fs.readFileSync(ROOT + '/vocab.js', 'utf8');

// Tokenizer bilanciato comment/regex-aware (stessa implementazione di
// tests/sceltaMultipla.test.mjs).
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
function extractConst(src, name) {
  const re = new RegExp('^const ' + name + ' = ', 'm');
  const m = re.exec(src);
  if (!m) throw new Error('costante non trovata: ' + name);
  const end = src.indexOf(';', m.index);
  return src.slice(m.index, end + 1);
}

function ambiente() {
  const ctx = {};
  vm.createContext(ctx);
  const codice = [
    extractConst(INDEX, 'QUIZ_LEN'),
    extractConst(INDEX, 'PESO_CEFR'),
    extractConst(INDEX, 'PESO_CEFR_SCONOSCIUTO'),
    extractFn(VOCAB, 'soloVisibile'),
    extractFn(VOCAB, 'wordKey'),
    extractFn(INDEX, 'pesoCEFRCarta'),
    extractFn(INDEX, 'coppiaKey'),
    extractFn(INDEX, 'oggi'),
    extractFn(INDEX, 'getCoppia'),
    extractFn(INDEX, 'isScaduta'),
    extractFn(INDEX, 'isAppresa'),
    extractFn(INDEX, 'lingueAttiveEntry'),
    extractFn(INDEX, 'passaFiltri'),
    extractFn(INDEX, 'estraiCarte'),
    // I const dichiarati con vm.runInContext non diventano proprietà del
    // sandbox (solo le function declaration lo fanno): un getter li espone.
    'function __getQuizLen() { return QUIZ_LEN; }',
  ].join('\n');
  vm.runInContext(codice, ctx);
  return ctx;
}

function vocabolarioSintetico(n) {
  return Array.from({ length: n }, (_, i) => ({ tema: 'saluti', livello: 'A1', it: `parola${i}`, en: `word${i}` }));
}
const LINGUE = [{ codice: 'it', attiva: true }, { codice: 'en', attiva: true }];
const FILTRI = { temi: ['saluti'], livelli: [] };

test('estraiCarte: con una lingua esclusa, nessuna carta ha la risposta in quella lingua', () => {
  const c = ambiente();
  const carte = c.estraiCarte(vocabolarioSintetico(25), {}, LINGUE, FILTRI, null, null, false, 20, 'it');
  assert.strictEqual(carte.length, 20);
  assert.ok(carte.every(x => x.a !== 'it'), 'nessuna risposta in italiano');
});

test('estraiCarte: senza lingua esclusa, comportamento invariato', () => {
  const c = ambiente();
  const carte = c.estraiCarte(vocabolarioSintetico(3), {}, LINGUE, FILTRI, null, null, false, 20);
  assert.strictEqual(carte.length, 6);
});

test('avvia: per la voce esclude la lingua dell\'interfaccia', () => {
  assert.match(INDEX, /const escludiA = m === "voce" \? getUILang\(\) : null;/);
  assert.match(INDEX, /if \(escludiA && a === escludiA\) a = null;/);
  assert.match(INDEX, /estraiCarte\(v, s, lg, f, da, a, isNonstop, nDomEff \|\| undefined, escludiA\)/);
});

test('il selettore "Rispondo in…" in modalità voce non propone la lingua dell\'interfaccia', () => {
  const a = INDEX.indexOf('modalita === "voce" ? t.rispondoin_voce : t.rispondoin');
  const blocco = INDEX.slice(a, a + 1200);
  assert.match(blocco, /lingueAttive\.filter\(l => modalita !== "voce" \|\| l\.codice !== getUILang\(\)\)\.map/);
});
