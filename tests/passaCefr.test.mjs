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
// raggiunto B2, come le vere B2 — non è più sempre ammessa.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Estrae, per ogni cefrIdx possibile (0=A1 .. 3=B2), la funzione passaCEFR
// così com'è scritta nel file, ricreando l'ambiente minimo di cui ha bisogno
// (cefrOrdine, CEFR_IDX_SCONOSCIUTO, cefrIdx).
function passaCEFRConSoglia(cefrIdx) {
  const iOrdine = INDEX.indexOf('const cefrOrdine = ');
  assert.ok(iOrdine >= 0, 'cefrOrdine non trovato in index.html');
  const finOrdine = INDEX.indexOf(';', iOrdine) + 1;
  const iSconosciuto = INDEX.indexOf('const CEFR_IDX_SCONOSCIUTO', finOrdine);
  assert.ok(iSconosciuto >= 0, 'CEFR_IDX_SCONOSCIUTO non trovato in index.html');
  const finSconosciuto = INDEX.indexOf(';', iSconosciuto) + 1;
  const iFunc = INDEX.indexOf('function passaCEFR', finSconosciuto);
  assert.ok(iFunc >= 0, 'passaCEFR non trovata in index.html');
  const corpoStart = INDEX.indexOf('{', iFunc);
  // corpo breve (2 righe): non serve lo scanner a profondità, basta la prima "\n  }"
  const corpoEnd = INDEX.indexOf('\n  }', corpoStart) + 4;
  const ctx = { cefrIdx };
  vm.createContext(ctx);
  vm.runInContext(
    INDEX.slice(iOrdine, finOrdine) + '\n' + INDEX.slice(iSconosciuto, finSconosciuto) +
    '\nfunction passaCEFR(e) ' + INDEX.slice(corpoStart, corpoEnd) +
    '\nthis.passaCEFR = passaCEFR;',
    ctx
  );
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
