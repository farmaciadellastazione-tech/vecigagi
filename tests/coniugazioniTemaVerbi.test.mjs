// Richiesta di Dino (2026-10-03): le coniugazioni compaiono anche col tema
// "verbi", non solo senza filtro o con "grammatica".
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('coniugazioni incluse con i temi "grammatica" e "verbi"', () => {
  const m = HTML.match(/const includiConiug = ([^;]*);/);
  assert.ok(m, 'includiConiug non trovato');
  const includi = new Function('filtri', `return ${m[1]};`);
  assert.ok(includi({ temi: [] }));
  assert.ok(includi({ temi: ['grammatica'] }));
  assert.ok(includi({ temi: ['verbi'] }));
  assert.ok(includi({ temi: ['cibo', 'verbi'] }));
  assert.ok(!includi({ temi: ['cibo'] }));
});
