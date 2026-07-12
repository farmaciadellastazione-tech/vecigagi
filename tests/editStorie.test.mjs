// Test dell'"📋 Incolla tutto" in edit-storie.html.
//
// Requisito (Dino, 2026-07-12): pubblicare una storia lunga non deve
// richiedere il copia-incolla frase per frase. Con testo e traduzione già
// pronti devono bastare DUE operazioni: incolla il testo, incolla la
// traduzione → le frasi si generano da sole, accoppiate riga per riga.
// Se il testo è tutto su una riga, viene diviso per punteggiatura di fine
// frase (. ! ? …). Conteggi che non combaciano → errore chiaro, niente
// accoppiamenti sbagliati silenziosi.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/edit-storie.html', 'utf8');

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

function runCostruisci(testo, traduzione) {
  const ctx = vm.createContext({ console });
  vm.runInContext(extractFn(SRC, 'dividiInFrasi'), ctx);
  vm.runInContext(extractFn(SRC, 'costruisciFrasiDaTesti'), ctx);
  return vm.runInContext(`costruisciFrasiDaTesti(${JSON.stringify(testo)}, ${JSON.stringify(traduzione)})`, ctx);
}

test('caso base: una frase per riga, accoppiate riga per riga', () => {
  const r = runCostruisci(
    'Der Hund läuft.\nDie Katze schläft.\nEs regnet.',
    'Il cane corre.\nIl gatto dorme.\nPiove.'
  );
  assert.ok(!r.errore, r.errore);
  assert.equal(r.frasi.length, 3);
  assert.deepEqual(r.frasi[0], { testo: 'Der Hund läuft.', it: 'Il cane corre.' });
  assert.deepEqual(r.frasi[2], { testo: 'Es regnet.', it: 'Piove.' });
});

test('righe vuote e spazi ignorati (i doppi a-capo dei paragrafi non sballano gli accoppiamenti)', () => {
  const r = runCostruisci(
    'Uno.\n\n  Due.  \n\nTre.\n',
    'One.\nTwo.\n\nThree.'
  );
  assert.ok(!r.errore, r.errore);
  assert.equal(r.frasi.length, 3);
  assert.equal(r.frasi[1].testo, 'Due.');
  assert.equal(r.frasi[1].it, 'Two.');
});

test('testo tutto su una riga: diviso per punteggiatura di fine frase', () => {
  const r = runCostruisci(
    'Der Hund läuft. Die Katze schläft! Regnet es?',
    'Il cane corre. Il gatto dorme! Piove?'
  );
  assert.ok(!r.errore, r.errore);
  assert.equal(r.frasi.length, 3);
  assert.equal(r.frasi[1].testo, 'Die Katze schläft!');
  assert.equal(r.frasi[2].it, 'Piove?');
});

test('conteggi diversi → errore chiaro con i numeri, nessun accoppiamento silenzioso', () => {
  const r = runCostruisci('Uno.\nDue.\nTre.', 'Solo una riga.');
  assert.ok(r.errore, 'atteso errore');
  assert.ok(r.errore.includes('3') && r.errore.includes('1'), `l'errore deve dire i conteggi: "${r.errore}"`);
  assert.ok(!r.frasi, 'con errore non devono uscire frasi');
});

test('traduzione vuota: frasi generate con it vuoto (da completare dopo, es. con l\'IA)', () => {
  const r = runCostruisci('Uno.\nDue.', '');
  assert.ok(!r.errore, r.errore);
  assert.equal(r.frasi.length, 2);
  assert.equal(r.frasi[0].it, '');
});

test('testo vuoto → errore', () => {
  const r = runCostruisci('', 'qualcosa');
  assert.ok(r.errore);
});

test('UI: bottone Incolla tutto e handler presenti', () => {
  assert.ok(SRC.includes('apriIncollaTutto('), 'manca il bottone/handler per aprire il pannello');
  assert.ok(SRC.includes('applicaIncollaTutto('), 'manca il handler che genera le frasi');
});
