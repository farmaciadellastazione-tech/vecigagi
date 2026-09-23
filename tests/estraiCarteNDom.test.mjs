// Bug segnalato da Dino: alcuni esercizi (Quiz/Allenamento/Ascolto/Voce/
// Dettato) non superavano mai le 10 domande, anche scegliendo 15/20/30/50
// dal selettore "N. domande" o dopo la progressione adattiva (+5 per volta
// dopo un 100%, vedi tests/progressioneNDom.test.mjs).
//
// Causa: estraiCarte()/estraiCarteDettato() ignoravano del tutto quanto
// richiesto e usavano sempre la costante QUIZ_LEN=10 come tetto massimo
// delle carte generate — avvia() poi tagliava con .slice(0, nDomEff), ma
// tagliare un array già lungo al più 10 non lo fa mai crescere. Scelta
// multipla non ha questo limite (genera le carte da sé, senza passare da
// estraiCarte), da cui l'impressione che "alcuni esercizi" fossero colpiti
// e altri no.
//
// Verifica: estraiCarte() eseguita per davvero (non solo strutturale, come
// in tests/sceltaMultipla.test.mjs) su un vocabolario sintetico con più di
// 10 voci ammissibili, chiedendo più di QUIZ_LEN domande.
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

// 25 voci ammissibili (tema "saluti", livello A1, it+en compilati): più
// della vecchia soglia fissa QUIZ_LEN=10.
function vocabolarioSintetico(n) {
  return Array.from({ length: n }, (_, i) => ({
    tema: 'saluti', livello: 'A1', it: `parola${i}`, en: `word${i}`
  }));
}
const LINGUE = [
  { codice: 'it', attiva: true },
  { codice: 'en', attiva: true },
];
const FILTRI = { temi: ['saluti'], livelli: [] }; // niente "grammatica": esclude generaEserciziConiugazioni

test('estraiCarte(): richiedendo più di QUIZ_LEN domande, ne restituisce più di 10 se il vocabolario le offre', () => {
  const c = ambiente();
  const vocabolario = vocabolarioSintetico(25);
  const carte = c.estraiCarte(vocabolario, {}, LINGUE, FILTRI, null, null, false, 20);
  assert.strictEqual(carte.length, 20, `attese 20 carte, ottenute ${carte.length}`);
});

test('estraiCarte(): senza specificare quante domande, il default resta QUIZ_LEN (comportamento invariato)', () => {
  const c = ambiente();
  const vocabolario = vocabolarioSintetico(25);
  const carte = c.estraiCarte(vocabolario, {}, LINGUE, FILTRI, null, null, false);
  assert.strictEqual(carte.length, c.__getQuizLen());
});

test('estraiCarte(): con un vocabolario piccolo, non restituisce più coppie di quelle disponibili', () => {
  const c = ambiente();
  // 3 parole × 2 direzioni (it→en, en→it) = 6 coppie candidate al massimo,
  // anche chiedendone 20.
  const vocabolario = vocabolarioSintetico(3);
  const carte = c.estraiCarte(vocabolario, {}, LINGUE, FILTRI, null, null, false, 20);
  assert.strictEqual(carte.length, 6);
});
