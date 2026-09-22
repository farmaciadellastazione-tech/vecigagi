// Test di passaCEFRD (index.html, dentro estraiCarteDettato): la soglia
// adattiva della modalità Dettato, aggiunta per allinearla al quiz normale.
//
// Prima: ogni parola mai praticata entrava sempre nel mazzo "nuove" del
// Dettato (`if (c.livello === 0) nu.push(carta)`), qualunque fosse la sua
// difficoltà CEFR — a differenza del quiz normale (estraiCarte), dove
// passaCEFR(e) blocca le parole troppo difficili per l'utente. Un
// principiante in Dettato riceveva fin da subito parole B1/B2 vere e tutte
// le 343 voci senza livello di VOCABOLARIO_DEFAULT.
//
// Dopo: stesso meccanismo del quiz normale, replicato con un proprio
// passaCEFRD/CEFR_IDX_SCONOSCIUTO_D locali a estraiCarteDettato (funzioni
// diverse, nessun modulo condiviso tra le due — stesso principio di
// passaCEFR in index.html), inclusa l'eccezione per il filtro esplicito "❓
// Senza livello".
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
// saltando stringhe e commenti riga/blocco (vedi tests/passaCefr.test.mjs e
// tests/streak.test.mjs per la stessa funzione).
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

function passaCEFRDConSoglia(cefrIdxD, filtri = { livelli: [] }) {
  const start = INDEX.indexOf('const cefrOrdineD = ');
  assert.ok(start >= 0, 'cefrOrdineD non trovato in index.html');
  const iFunc = INDEX.indexOf('function passaCEFRD(', start);
  assert.ok(iFunc >= 0, 'passaCEFRD non trovata in index.html');
  const corpoStart = INDEX.indexOf('{', iFunc);
  const corpoEnd = scansionaBilanciato(INDEX, corpoStart, '{', '}');
  // Il blocco include "const cefrIdxD = cefrOrdineD.indexOf(cefrMaxD);": la
  // togliamo per usare il cefrIdxD passato dal test (cefrMaxD dipenderebbe da
  // `stats`, che qui non vogliamo dover simulare).
  const blocco = INDEX.slice(start, corpoEnd).replace(/const cefrIdxD = cefrOrdineD\.indexOf\(cefrMaxD\);\n?/, '');
  const ctx = { cefrIdxD, filtri };
  vm.createContext(ctx);
  vm.runInContext(blocco + '\nthis.passaCEFRD = passaCEFRD;', ctx);
  return ctx.passaCEFRD;
}

test('una voce senza livello NON passa per un principiante in Dettato (cefrIdxD=0)', () => {
  const passaCEFRD = passaCEFRDConSoglia(0);
  assert.strictEqual(passaCEFRD({ livello: undefined }), false);
  assert.strictEqual(passaCEFRD({}), false);
});

test('una voce senza livello passa solo quando la soglia arriva a B2 (cefrIdxD=3)', () => {
  for (let idx = 0; idx <= 2; idx++) {
    assert.strictEqual(passaCEFRDConSoglia(idx)({ livello: undefined }), false, `non deve passare con cefrIdxD=${idx}`);
  }
  assert.strictEqual(passaCEFRDConSoglia(3)({ livello: undefined }), true);
});

test('un livello reale passa/non passa in base alla soglia, come nel quiz normale', () => {
  const passaCEFRD = passaCEFRDConSoglia(1); // soglia A2
  assert.strictEqual(passaCEFRD({ livello: 'A1' }), true);
  assert.strictEqual(passaCEFRD({ livello: 'A2' }), true);
  assert.strictEqual(passaCEFRD({ livello: 'B1' }), false);
});

test('il filtro esplicito "❓ Senza livello" fa passare le voci senza livello anche per un principiante', () => {
  const passaCEFRD = passaCEFRDConSoglia(0, { livelli: [''] });
  assert.strictEqual(passaCEFRD({ livello: undefined }), true);
});

test('il push nel mazzo "nuove" del Dettato applica il cancello CEFR (non solo c.livello === 0)', () => {
  const i = INDEX.indexOf('function estraiCarteDettato');
  const fine = INDEX.indexOf('\nfunction ', i + 10); // prossima function top-level dopo l'inizio
  const corpo = INDEX.slice(i, fine);
  assert.match(corpo, /c\.livello === 0 && passaCEFRD\(e\)/,
    'il push in nu deve controllare anche passaCEFRD(e), non solo c.livello === 0');
});
