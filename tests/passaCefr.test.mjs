// Test di passaCEFR (index.html, dentro estraiCarte): la soglia adattiva che
// limita le parole NUOVE proposte al livello CEFR stimato dell'utente.
//
// Prima: passaCEFR(e) faceva cefrOrdine.indexOf(e.livello || "A1") <= cefrIdx.
// Una voce senza livello valeva "A1" (indice 0), quindi passava SEMPRE la
// soglia, qualunque fosse cefrIdx — anche per un vero principiante (cefrIdx=0,
// soglia "solo A1"). Le 343 voci di VOCABOLARIO_DEFAULT senza livello (19%)
// venivano quindi proposte fin da subito, mischiate alle vere A1, a
// prescindere dalla loro reale difficoltà.
//
// Dopo: una voce senza livello (o con un livello non riconosciuto) vale come
// B2 (il livello più alto definito): passa la soglia solo quando l'utente ha
// raggiunto B2, come le vere B2 — non è più sempre ammessa. ECCEZIONE: se
// l'utente ha scelto esplicitamente il filtro "❓ Senza livello"
// (filtri.livelli include ""), la soglia non blocca quelle voci — le ha
// chieste apposta (altrimenti il filtro darebbe una sessione vuota per
// chiunque non abbia ancora raggiunto B2).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` bilanciando i caratteri indicati in `apre`/`chiude`,
// saltando stringhe e commenti riga/blocco (i commenti in italiano di questo
// codebase contengono apostrofi che un tracker senza supporto commenti
// scambia per apertura di stringa — vedi tests/streak.test.mjs e altri).
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

// Estrae, dal `const cefrOrdine = ...` fino alla chiusura di `passaCEFR`, TUTTO
// il blocco intermedio (comprese eventuali dichiarazioni future, es.
// vuoleSenzaLivello): non enumera le singole const per nome, quindi resta
// corretto anche se se ne aggiungono altre nel mezzo.
function passaCEFRConSoglia(cefrIdx, filtri = { livelli: [] }) {
  const start = INDEX.indexOf('const cefrOrdine = ');
  assert.ok(start >= 0, 'cefrOrdine non trovato in index.html');
  const iFunc = INDEX.indexOf('function passaCEFR(', start);
  assert.ok(iFunc >= 0, 'passaCEFR non trovata in index.html');
  const corpoStart = INDEX.indexOf('{', iFunc);
  const corpoEnd = scansionaBilanciato(INDEX, corpoStart, '{', '}');
  // Il blocco include "const cefrIdx = cefrOrdine.indexOf(cefrMax);": la
  // togliamo per usare il cefrIdx passato dal test (cefrMax dipenderebbe da
  // `stats`, che qui non vogliamo dover simulare).
  const blocco = INDEX.slice(start, corpoEnd).replace(/const cefrIdx = cefrOrdine\.indexOf\(cefrMax\);\n?/, '');
  const ctx = { cefrIdx, filtri };
  vm.createContext(ctx);
  vm.runInContext(blocco + '\nthis.passaCEFR = passaCEFR;', ctx);
  return ctx.passaCEFR;
}

test('una voce senza livello NON passa per un principiante (cefrIdx=0, soglia A1)', () => {
  const passaCEFR = passaCEFRConSoglia(0);
  assert.strictEqual(passaCEFR({ livello: undefined }), false);
  assert.strictEqual(passaCEFR({}), false);
});

test('una voce senza livello passa solo quando la soglia arriva a B2 (cefrIdx=3)', () => {
  for (let idx = 0; idx <= 2; idx++) {
    assert.strictEqual(passaCEFRConSoglia(idx)({ livello: undefined }), false, `non deve passare con cefrIdx=${idx}`);
  }
  assert.strictEqual(passaCEFRConSoglia(3)({ livello: undefined }), true, 'deve passare con cefrIdx=3 (soglia B2)');
});

test('un livello reale passa/non passa come prima (comportamento invariato per le voci con livello)', () => {
  const passaCEFR = passaCEFRConSoglia(1); // soglia A2
  assert.strictEqual(passaCEFR({ livello: 'A1' }), true);
  assert.strictEqual(passaCEFR({ livello: 'A2' }), true);
  assert.strictEqual(passaCEFR({ livello: 'B1' }), false);
  assert.strictEqual(passaCEFR({ livello: 'B2' }), false);
});

test('un livello sconosciuto (es. refuso) è trattato come "senza livello", non come A1', () => {
  const passaCEFR = passaCEFRConSoglia(0);
  assert.strictEqual(passaCEFR({ livello: 'C1' }), false);
  assert.strictEqual(passaCEFR({ livello: 'xyz' }), false);
});

// edit.html può salvare esplicitamente livello:"" (non solo lasciarlo assente)
// quando un admin svuota la cella Livello di una voce già popolata — stato
// raggiungibile in pratica, non solo ipotetico. Deve comportarsi come undefined.
test('livello:"" (svuotato in edit.html) si comporta come undefined, non come A1', () => {
  assert.strictEqual(passaCEFRConSoglia(0)({ livello: '' }), false);
  assert.strictEqual(passaCEFRConSoglia(3)({ livello: '' }), true);
});

test('il filtro esplicito "❓ Senza livello" fa passare le voci senza livello anche per un principiante', () => {
  const passaCEFR = passaCEFRConSoglia(0, { livelli: [''] }); // principiante, ma ha chiesto "senza livello"
  assert.strictEqual(passaCEFR({ livello: undefined }), true);
  assert.strictEqual(passaCEFR({}), true);
});

test('il filtro esplicito "❓ Senza livello" NON cambia il comportamento delle voci CON un livello reale', () => {
  const passaCEFR = passaCEFRConSoglia(0, { livelli: [''] });
  assert.strictEqual(passaCEFR({ livello: 'B2' }), false, 'una B2 vera resta bloccata per un principiante, anche col filtro attivo');
});
