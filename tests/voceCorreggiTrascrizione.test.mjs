// Richiesta di Dino (2026-10-04): negli esercizi vocali, se nessuna
// trascrizione è giusta la risposta NON viene giudicata subito: quello che il
// quiz ha capito va nella casella "oppure scrivi", con un messaggio, così si
// può correggere e confermare (conta come risposta scritta: giusta piena).
// Se la voce è giusta, tutto come prima (accettata subito).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const iv = HTML.slice(HTML.indexOf('function InputVocale({'), HTML.indexOf('\nfunction ', HTML.indexOf('function InputVocale({') + 10));

test('InputVocale: trascrizione non giusta → niente verifica, passa il testo da correggere', () => {
  assert.match(iv, /onNonRiconosciuto = null/);
  assert.match(iv, /if \(!scelta && onNonRiconosciuto\) \{[\s\S]*?onNonRiconosciuto\(tConv\);[\s\S]*?return;/);
  assert.match(iv, /timerInvio\.current = setTimeout\(\(\) => onVerifica\(tConv\), 300\)/, 'se giusta: verifica come prima');
});

test('il quiz mette la trascrizione nella casella e mostra cosa ha capito', () => {
  const a = HTML.indexOf('stato === "domanda" && modalitaEffettiva === "voce" && lA &&');
  const voce = HTML.slice(a, HTML.indexOf('stato === "corretto" &&', a));
  assert.match(voce, /onNonRiconosciuto: t => \{[\s\S]*?setInput\(t\);[\s\S]*?setPercepito\(t\);/);
  assert.match(voce, /Ho capito/);
  assert.match(HTML, /const \[percepito, setPercepito\] = useState\(null\);/);
  assert.match(HTML, /useEffect\(\(\) => setPercepito\(null\), \[indice\]\);/);
});
