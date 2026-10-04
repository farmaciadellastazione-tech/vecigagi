// Review di 94b38f3: il riquadro "Ho capito" si azzerava solo al cambio di
// indice; ricominciando una sessione da indice 0 ("Ancora") poteva restare il
// messaggio vecchio. Ora si azzera anche appena la risposta viene giudicata.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('il riquadro "Ho capito" si azzera quando la carta esce dallo stato "domanda"', () => {
  assert.match(HTML, /useEffect\(\(\) => \{\s*if \(stato !== "domanda"\) setPercepito\(null\);\s*\}, \[stato\]\);/);
});
