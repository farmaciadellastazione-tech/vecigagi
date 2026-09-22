// Test del fallback di PESO_CEFR (index.html) per le voci senza livello CEFR,
// e di pesoCEFRCarta, il comparatore condiviso che lo usa nell'ordinamento
// delle parole nuove (estraiCarte e estraiCarteDettato).
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
// Il comparatore era duplicato alla lettera in estraiCarte/estraiCarteDettato:
// estratto in pesoCEFRCarta(carta), condivisa dai due punti. Le carte di
// coniugazione (tipo:"coniugazione", entry sintetico senza MAI un campo
// livello) restano al peso 0 come prima: PESO_CEFR_SCONOSCIUTO non deve
// applicarsi a loro, non sono voci di VOCABOLARIO_DEFAULT senza livello.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Estrae `const NOME = ...;` da index.html e ne valuta il valore letterale.
function valoreCostante(nome) {
  const i = INDEX.indexOf('const ' + nome);
  assert.ok(i >= 0, `${nome} non trovata in index.html`);
  const fine = INDEX.indexOf(';', i) + 1;
  const codice = INDEX.slice(i, fine);
  return new Function('return ' + codice.replace(new RegExp('^const ' + nome + '\\s*=\\s*'), '').replace(/;$/, ''))();
}

test('PESO_CEFR non ha più un fallback "" -> 0 (che equivaleva "senza livello" ad A1)', () => {
  assert.deepStrictEqual(valoreCostante('PESO_CEFR'), { A1: 0, A2: 1, B1: 2, B2: 3 });
});

test('PESO_CEFR_SCONOSCIUTO è maggiore di B2 (le voci senza livello vanno per ultime)', () => {
  assert.ok(valoreCostante('PESO_CEFR_SCONOSCIUTO') > 3, `atteso > 3 (peso di B2), trovato ${valoreCostante('PESO_CEFR_SCONOSCIUTO')}`);
});

// edit.html può salvare esplicitamente livello:"" (non solo lasciarlo assente)
// quando un admin svuota la cella Livello di una voce già popolata — stato
// raggiungibile in pratica, non solo ipotetico. Deve valere come "sconosciuto"
// esattamente come una voce senza il campo, non più come A1.
test('livello:"" (svuotato in edit.html) vale come sconosciuto, non come A1', () => {
  const PESO_CEFR = valoreCostante('PESO_CEFR');
  const SCONOSCIUTO = valoreCostante('PESO_CEFR_SCONOSCIUTO');
  assert.strictEqual(PESO_CEFR[''] ?? SCONOSCIUTO, SCONOSCIUTO);
});

function estraiPesoCEFRCarta() {
  const i = INDEX.indexOf('function pesoCEFRCarta');
  assert.ok(i >= 0, 'pesoCEFRCarta non trovata in index.html (dovrebbe essere una funzione top-level condivisa)');
  const fine = INDEX.indexOf('\n}', i) + 2;
  const ctx = { PESO_CEFR: valoreCostante('PESO_CEFR'), PESO_CEFR_SCONOSCIUTO: valoreCostante('PESO_CEFR_SCONOSCIUTO') };
  vm.createContext(ctx);
  vm.runInContext(INDEX.slice(i, fine) + '\nthis.pesoCEFRCarta = pesoCEFRCarta;', ctx);
  return ctx.pesoCEFRCarta;
}

test('pesoCEFRCarta: una voce vocabolario con livello reale usa PESO_CEFR', () => {
  const pesoCEFRCarta = estraiPesoCEFRCarta();
  assert.strictEqual(pesoCEFRCarta({ entry: { livello: 'A1' } }), 0);
  assert.strictEqual(pesoCEFRCarta({ entry: { livello: 'B2' } }), 3);
});

test('pesoCEFRCarta: una voce vocabolario SENZA livello prende PESO_CEFR_SCONOSCIUTO', () => {
  const pesoCEFRCarta = estraiPesoCEFRCarta();
  assert.strictEqual(pesoCEFRCarta({ entry: {} }), 4);
});

// Regressione trovata in review: generaEserciziConiugazioni costruisce un
// `entry` sintetico (solo le due colonne lingua) che non ha MAI `livello` —
// prima di questo fix, il vecchio fallback "|| A1" le metteva comunque al
// peso 0 (prima fra le nuove, come le vere A1). Passando a
// PESO_CEFR_SCONOSCIUTO le avrebbe spostate in fondo per errore: non sono
// voci di vocabolario senza livello, sono un tipo di carta diverso.
test('pesoCEFRCarta: le carte di coniugazione restano al peso 0 (comportamento invariato)', () => {
  const pesoCEFRCarta = estraiPesoCEFRCarta();
  assert.strictEqual(pesoCEFRCarta({ tipo: 'coniugazione', entry: { it: 'amo', en: 'I love' } }), 0);
});

test('i due punti che ordinano le parole nuove usano pesoCEFRCarta (comparatore condiviso, non più duplicato)', () => {
  const occorrenze = INDEX.match(/da = pesoCEFRCarta\(a\),\s*\n\s*db = pesoCEFRCarta\(b\);/g) || [];
  assert.strictEqual(occorrenze.length, 2, 'attesi 2 usi (estraiCarte e estraiCarteDettato)');
  assert.doesNotMatch(INDEX, /PESO_CEFR\[a\.entry\.livello\]/, 'non deve restare il vecchio comparatore duplicato inline');
  assert.doesNotMatch(INDEX, /PESO_CEFR\[a\.entry\.livello \|\| "A1"\]/, 'non deve restare il vecchio fallback "A1" per il peso CEFR');
});
