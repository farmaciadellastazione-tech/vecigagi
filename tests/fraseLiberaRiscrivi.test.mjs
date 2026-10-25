// Frase libera, "✍️ Riscrivi" (richiesta di Dino, 2026-10-25): se la frase è
// sbagliata o dubbia si riscrive subito sulla stessa parola, a casella vuota,
// senza tornare ai risultati e senza avanzare nella fila delle sbagliate.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');

test('riscrivi(): stessa carta, casella vuota, cursore nella casella', () => {
  const r = tra('  function riscrivi()', '// "Salta" e "Nuova"');
  assert.match(r, /setFrase\(""\)/);
  assert.match(r, /setStato\("domanda"\)/);
  assert.match(r, /setFeedback\(null\)/);
  assert.match(r, /richiestaFrase\.current\+\+/);
  assert.match(r, /fraseRef\.current/);
  assert.doesNotMatch(r, /setCarta|setPosCoda|prossima\(|azzeraAiuto/, 'non cambia parola, non avanza nella fila, tiene gli aiuti');
  assert.match(fl, /ref: fraseRef,/);
});

test('il pulsante compare solo se la frase non è giusta', () => {
  assert.match(fl, /feedback\.correct !== true && \/\*#__PURE__\*\/React\.createElement\("button", \{\s*onClick: riscrivi,/);
  assert.match(fl, /Riscrivi/);
});
