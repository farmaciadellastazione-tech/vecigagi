// Test del fallback di PESO_CEFR (index.html) per le voci senza livello CEFR.
//
// Prima: PESO_CEFR[entry.livello || "A1"] trattava una voce senza livello
// come se fosse A1 — la più semplice — mischiandola alle vere A1 e
// proponendola PRIMA delle B1/B2 vere nell'ordine delle parole nuove
// (estraiCarte) e SEMPRE ammessa dal filtro adattivo per principianti
// (passaCEFR), qualunque fosse il livello reale dell'utente. 343 voci di
// VOCABOLARIO_DEFAULT (19%) non hanno ancora un livello.
//
// Dopo: una voce senza livello (o con un livello non tra A1-B2) prende
// PESO_CEFR_SCONOSCIUTO, maggiore di B2: va DOPO le B2, non trattata come A1.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

function estraiCostante(nome) {
  const i = INDEX.indexOf('const ' + nome);
  assert.ok(i >= 0, `${nome} non trovata in index.html`);
  const fine = INDEX.indexOf(';', i) + 1;
  return INDEX.slice(i, fine);
}

test('PESO_CEFR non ha più un fallback "" -> 0 (che equivaleva "senza livello" ad A1)', () => {
  const codice = estraiCostante('PESO_CEFR');
  const PESO_CEFR = new Function('return ' + codice.replace(/^const PESO_CEFR\s*=\s*/, '').replace(/;$/, ''))();
  assert.deepStrictEqual(PESO_CEFR, { A1: 0, A2: 1, B1: 2, B2: 3 });
});

test('PESO_CEFR_SCONOSCIUTO è maggiore di B2 (le voci senza livello vanno per ultime)', () => {
  const codice = estraiCostante('PESO_CEFR_SCONOSCIUTO');
  const val = new Function('return ' + codice.replace(/^const PESO_CEFR_SCONOSCIUTO\s*=\s*/, '').replace(/;$/, ''))();
  assert.ok(val > 3, `atteso > 3 (peso di B2), trovato ${val}`);
});

test('i due punti che ordinano le parole nuove usano il fallback sicuro, non più "|| \\"A1\\""', () => {
  const pattern = /PESO_CEFR\[a\.entry\.livello\] \?\? PESO_CEFR_SCONOSCIUTO/g;
  const occorrenze = INDEX.match(pattern) || [];
  assert.strictEqual(occorrenze.length, 2, 'attesi 2 usi (estraiCarte e estraiCarteDettato)');
  assert.doesNotMatch(INDEX, /PESO_CEFR\[a\.entry\.livello \|\| "A1"\]/, 'non deve restare il vecchio fallback "A1" per il peso CEFR');
});

// edit.html può salvare esplicitamente livello:"" (non solo lasciarlo assente)
// quando un admin svuota la cella Livello di una voce già popolata — stato
// raggiungibile in pratica, non solo ipotetico. Deve valere come "sconosciuto"
// esattamente come una voce senza il campo, non più come A1.
test('livello:"" (svuotato in edit.html) vale come sconosciuto, non come A1', () => {
  const codicePeso = estraiCostante('PESO_CEFR');
  const PESO_CEFR = new Function('return ' + codicePeso.replace(/^const PESO_CEFR\s*=\s*/, '').replace(/;$/, ''))();
  const codiceSconosciuto = estraiCostante('PESO_CEFR_SCONOSCIUTO');
  const SCONOSCIUTO = new Function('return ' + codiceSconosciuto.replace(/^const PESO_CEFR_SCONOSCIUTO\s*=\s*/, '').replace(/;$/, ''))();
  assert.strictEqual(PESO_CEFR[''] ?? SCONOSCIUTO, SCONOSCIUTO);
});
