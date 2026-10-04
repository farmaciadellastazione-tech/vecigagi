// Review di efe092c: in modalità voce estraiCarte esclude le risposte nella
// lingua dell'interfaccia, ma il conteggio "N combinazioni" (carteDisp) no:
// con "vedo in spezzino" e solo it+sp attivi mostrava carte disponibili e la
// sessione partiva vuota. Ora carteDisp applica la stessa esclusione (e la
// stessa "lingua di risposta = qualsiasi" se era quella dell'interfaccia),
// quindi il pulsante d'avvio resta disattivato quando non c'è nulla.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('carteDisp esclude le risposte nella lingua dell\'interfaccia in modalità voce', () => {
  const a = HTML.indexOf('const carteDisp = (() => {');
  const blocco = HTML.slice(a, HTML.indexOf('})();', a));
  assert.match(blocco, /const escludiA = modalita === "voce" \? getUILang\(\) : null;/);
  assert.match(blocco, /const linguaAEff = escludiA && linguaA === escludiA \? "qualsiasi" : linguaA;/);
  assert.match(blocco, /if \(a === escludiA\) return;/);
  assert.match(blocco, /if \(linguaAEff !== "qualsiasi" && a !== linguaAEff\) return;/);
});
