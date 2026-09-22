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
// passaCEFR in index.html).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

function passaCEFRDConSoglia(cefrIdxD) {
  const iOrdine = INDEX.indexOf('const cefrOrdineD = ');
  assert.ok(iOrdine >= 0, 'cefrOrdineD non trovato in index.html');
  const finOrdine = INDEX.indexOf(';', iOrdine) + 1;
  const iSconosciuto = INDEX.indexOf('const CEFR_IDX_SCONOSCIUTO_D', finOrdine);
  assert.ok(iSconosciuto >= 0, 'CEFR_IDX_SCONOSCIUTO_D non trovato in index.html');
  const finSconosciuto = INDEX.indexOf(';', iSconosciuto) + 1;
  const iFunc = INDEX.indexOf('function passaCEFRD', finSconosciuto);
  assert.ok(iFunc >= 0, 'passaCEFRD non trovata in index.html');
  const corpoStart = INDEX.indexOf('{', iFunc);
  const corpoEnd = INDEX.indexOf('\n  }', corpoStart) + 4;
  const ctx = { cefrIdxD };
  vm.createContext(ctx);
  vm.runInContext(
    INDEX.slice(iOrdine, finOrdine) + '\n' + INDEX.slice(iSconosciuto, finSconosciuto) +
    '\nfunction passaCEFRD(e) ' + INDEX.slice(corpoStart, corpoEnd) +
    '\nthis.passaCEFRD = passaCEFRD;',
    ctx
  );
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

test('il push nel mazzo "nuove" del Dettato applica il cancello CEFR (non solo c.livello === 0)', () => {
  const i = INDEX.indexOf('function estraiCarteDettato');
  const fine = INDEX.indexOf('\nfunction ', i + 10); // prossima function top-level dopo l'inizio
  const corpo = INDEX.slice(i, fine);
  assert.match(corpo, /c\.livello === 0 && passaCEFRD\(e\)/,
    'il push in nu deve controllare anche passaCEFRD(e), non solo c.livello === 0');
});
