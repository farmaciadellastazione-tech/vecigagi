// Test dell'opzione "senza livello" nei due filtri per livello di index.html
// (aggiunta insieme al fix di PESO_CEFR/passaCEFR: prima le 343 voci senza
// livello non avevano MODO di essere viste/filtrate esplicitamente — questo
// test copre solo l'aggiunta della possibilità di vederle, non il
// comportamento di scheduling già coperto da pesoCefr/passaCefr.test.mjs).
//
// 1. PannelloFiltri (quiz): loc.livelli può contenere "" (bottone "❓ Senza
//    livello") — passaFiltri (già corretto in precedenza) la interpreta
//    correttamente, qui si verifica solo che l'interfaccia offra il bottone
//    e che il riepilogo testuale non mostri una voce vuota nell'elenco.
// 2. Vocabolario (lista admin): nuovo <option value="__senza__"> nel select
//    di livelloFiltro, con filtro dedicato (e.livello falsy).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('PannelloFiltri: c\'è un bottone toggleLivello("") per "senza livello"', () => {
  const i = INDEX.indexOf('function PannelloFiltri');
  const fine = INDEX.indexOf('\nfunction ', i + 10);
  const corpo = INDEX.slice(i, fine);
  assert.match(corpo, /onClick: \(\) => toggleLivello\(""\)/, 'manca il bottone per il livello ""');
  assert.match(corpo, /t\.senzalivello/, 'il bottone deve usare la traduzione t.senzalivello');
});

test('il riepilogo dei filtri attivi non mostra una voce vuota per il livello ""', () => {
  assert.match(INDEX, /loc\.livelli\.map\(l => l \|\| t\.senzalivello\)/,
    'il riepilogo deve sostituire "" con t.senzalivello, non lasciarla vuota nell\'elenco');
});

test('tutte le 10 lingue dell\'interfaccia hanno la chiave senzalivello', () => {
  const occorrenzeTutti = (INDEX.match(/tuttilivelli:\s*"/g) || []).length;
  const occorrenzeSenza = (INDEX.match(/senzalivello:\s*"/g) || []).length;
  assert.strictEqual(occorrenzeTutti, 10, `attese 10 lingue con tuttilivelli, trovate ${occorrenzeTutti}`);
  assert.strictEqual(occorrenzeSenza, occorrenzeTutti, 'senzalivello deve esistere in tutte le lingue che hanno tuttilivelli');
});

test('Vocabolario (lista admin): il select di livello offre l\'opzione "senza livello", con un\'unica costante condivisa', () => {
  const i = INDEX.indexOf('function Vocabolario');
  const fine = INDEX.indexOf('\nfunction ', i + 10);
  const corpo = INDEX.slice(i, fine);
  assert.match(corpo, /const SENZA_LIVELLO = "__senza__";/, 'manca la costante condivisa SENZA_LIVELLO');
  assert.match(corpo, /value: SENZA_LIVELLO/, 'l\'opzione del select deve usare la costante, non il letterale ripetuto');
  assert.match(corpo, /livelloFiltro === SENZA_LIVELLO \? !!e\.livello : livelloFiltro && e\.livello !== livelloFiltro/,
    'il filtro deve trattare SENZA_LIVELLO come "solo le voci senza livello", non come un livello letterale');
  // le due occorrenze del sentinel devono derivare dalla stessa costante,
  // non essere due stringhe "__senza__" scollegate
  const occorrenzeLetterale = (corpo.match(/"__senza__"/g) || []).length;
  assert.strictEqual(occorrenzeLetterale, 1, 'il letterale "__senza__" deve comparire una sola volta (nella dichiarazione della costante)');
});
