// Test del badge di livello CEFR mostrato nella lista vocabolario e nella
// card del quiz (index.html).
//
// Prima: LIVELLI[entry.livello || "A1"] rendeva SEMPRE un badge "A1" (verde,
// "Principiante assoluto") anche per una voce senza livello — nonostante il
// rendering avesse già una guardia `lv && ...` pensata per saltare il badge
// quando manca un dato (lo stesso schema già usato per `tema`:
// TEMI[entry.tema || ""]). L'utente vedeva un'etichetta "A1" fuorviante,
// proprio mentre lo scheduler (PESO_CEFR/passaCEFR) tratta quella stessa
// voce come la più difficile, non come A1: due parti dello stesso file in
// contraddizione visibile.
//
// Dopo: LIVELLI[entry.livello || ""] → undefined per una voce senza livello →
// la guardia `lv &&` esistente salta il badge, come già fa per `tema`.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('LIVELLI non ha una voce per la chiave "" (il fallback "" deve restare "nessun badge")', () => {
  const i = INDEX.indexOf('const LIVELLI = {');
  assert.ok(i >= 0, 'LIVELLI non trovata in index.html');
  const fine = INDEX.indexOf('\n};', i) + 3;
  const LIVELLI = new Function('return ' + INDEX.slice(i + 'const LIVELLI = '.length, fine - 1))();
  assert.deepStrictEqual(Object.keys(LIVELLI).sort(), ['A1', 'A2', 'B1', 'B2']);
});

test('i due badge di livello usano il fallback "" (niente badge), non più "A1"', () => {
  const occorrenze = INDEX.match(/LIVELLI\[(?:entry|carta\.entry)\.livello \|\| (""|"A1")\]/g) || [];
  assert.strictEqual(occorrenze.length, 2, 'attesi 2 usi (lista vocabolario e card del quiz)');
  assert.ok(occorrenze.every(o => o.endsWith('""]')), `nessuno dei due deve più usare "A1" come fallback: ${occorrenze.join(', ')}`);
});
