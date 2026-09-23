// Coerenza con il fix di Scelta multipla (tests/sceltaMultipla.test.mjs):
// anche in Quiz/Allenamento/Ascolto/Voce/Dettato la progressione adattiva
// del numero di domande (SK_NDOM) deve salvarsi appena finisce la sessione,
// non solo premendo "🔁 Ancora" — altrimenti uscendo con Home dopo un 100%
// il badge "N → M ⬆" mostrato sul bottone non si avvera mai.
//
// Verifica strutturale sul sorgente reale (stesso approccio di
// sceltaMultipla.test.mjs/recovery.test.mjs: niente jsdom/React tra le
// dipendenze del progetto).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Tokenizer bilanciato comment/regex-aware (stessa implementazione di
// tests/sceltaMultipla.test.mjs e tests/spiegaParola.test.mjs).
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

const APP = extractFn(INDEX, 'App');
const SCHERMATA_QUIZ = extractFn(INDEX, 'SchermataQuiz');

// Richiesto da Dino dopo il fix del tetto QUIZ_LEN (2026-09-23): la
// progressione +5/+1 dopo un 100% non deve crescere all'infinito, per non
// costruire sessioni troppo lunghe (la stanchezza aumenta gli errori a fine
// sessione, penalizzando ingiustamente SM-2 parole in realtà sapute).
test('NDOM_MAX esiste ed è 20: tetto alla crescita, non un reset come in Scelta multipla', () => {
  const m = INDEX.match(/^const NDOM_MAX = (\d+);/m);
  assert.ok(m, 'const NDOM_MAX non trovata in index.html');
  assert.strictEqual(Number(m[1]), 20);
});

test('a fine sessione, la progressione N. domande è tappata a NDOM_MAX', () => {
  const fineSessione = APP.slice(
    APP.indexOf('// Salva record percentuale immediatamente al termine sessione'),
    APP.indexOf('} else {', APP.indexOf('// Salva record percentuale immediatamente al termine sessione'))
  );
  assert.ok(/Math\.min\(nDomandeUsate \+ inc, NDOM_MAX\)/.test(fineSessione),
    'la crescita dopo un 100% deve passare da Math.min(..., NDOM_MAX), non crescere senza limite');
});

test('anche il badge di anteprima su "Ancora" (stepPross) rispetta lo stesso tetto', () => {
  const stepPross = SCHERMATA_QUIZ.slice(SCHERMATA_QUIZ.indexOf('const stepPross ='), SCHERMATA_QUIZ.indexOf('return nDomandeUsate;', SCHERMATA_QUIZ.indexOf('const stepPross =')));
  assert.ok(/Math\.min\(nDomandeUsate \+ inc, NDOM_MAX\)/.test(stepPross),
    'il badge mostrato sul bottone "Ancora" non deve promettere una crescita oltre NDOM_MAX');
});

test('SK_NDOM (progressione adattiva) si salva al termine sessione, non solo su "Ancora"', () => {
  const fineSessione = APP.slice(
    APP.indexOf('// Salva record percentuale immediatamente al termine sessione'),
    APP.indexOf('} else {', APP.indexOf('// Salva record percentuale immediatamente al termine sessione'))
  );
  assert.ok(/saveJSON\(SK_NDOM,/.test(fineSessione),
    'il blocco eseguito alla fine della sessione deve salvare SK_NDOM (non solo il record percentuale)');
});

test('onAvviaAncora non ricalcola/risalva più il record percentuale (già fatto a fine sessione)', () => {
  const ancora = APP.slice(APP.indexOf('onAvviaAncora: () =>'), APP.indexOf('avvia(vocabolario, stats, modalita, lingue, filtriSessione, linguaDaUsata, linguaAUsata, nPross'));
  assert.ok(!/saveJSON\(SK_RECORD_PERC,/.test(ancora),
    'onAvviaAncora non deve più duplicare il salvataggio di SK_RECORD_PERC');
});
