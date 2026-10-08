// Segnalazione di Dino (2026-10-08): sbagliando "il conto per favore" in
// spezzino, la lettura automatica ha detto "air conto per piazze" (la parte di
// pronuncia per la voce sintetica), mentre l'altoparlante faceva sentire la
// registrazione vera (er-conto-pe-piase.mp3). Le letture automatiche (domanda
// e risposta giusta) ignoravano entry.audio: ora usano la registrazione se
// c'è, come BtnAudio. Per le coniugazioni non ci sono registrazioni.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('le letture automatiche del quiz passano la registrazione (audioVoce)', () => {
  const chiamate = HTML.match(/setTimeout\(\(\) => parla\([^;]*\), (300|400)\);/g) || [];
  assert.strictEqual(chiamate.length, 3, 'attese 3 letture automatiche: domanda, risposta giusta dopo errore, risposta giusta');
  for (const c of chiamate) assert.match(c, /audioVoce\(carta\.entry, /, c);
});
