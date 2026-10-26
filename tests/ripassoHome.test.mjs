// Ripasso frasi, passo 5 (2026-10-26): pulsante in Home (dopo Conversazione,
// sempre sbloccato: se mancano frasi lo spiega la schermata) e collegamento.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('la Home ha il pulsante, dopo Conversazione, con la sua emoji', () => {
  const iConv = HTML.indexOf('key: "conversazione",');
  const iRip = HTML.indexOf('key: "ripassoFrasi",');
  const iLG = HTML.indexOf('key: "letturaGuidata",', iConv);
  assert.ok(iRip > iConv && iRip < iLG);
  assert.match(HTML, /ripassoFrasi: "🔁"/);
});

test('sempre sbloccato', () => {
  assert.match(HTML, /const SBLOCCHI = \{[^}]*ripassoFrasi: null/);
});

test('scegli() apre la schermata e l\'App la mostra', () => {
  assert.match(HTML, /if \(mod === "ripassoFrasi"\) \{\s*setSchermata\("ripassoFrasi"\);/);
  assert.match(HTML, /schermata === "ripassoFrasi"\) return \/\*#__PURE__\*\/React\.createElement\(SchermataRipassoFrasi,/);
});

test('tema chiaro: la tinta del pulsante ha il suo override in Home', () => {
  assert.match(HTML, /html\.light \.home-modi \.bg-indigo-950/);
  assert.match(HTML, /html\.light \.home-modi \.border-indigo-800/);
});
