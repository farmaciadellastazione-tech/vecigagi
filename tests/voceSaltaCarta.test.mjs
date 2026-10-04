// Review di 8f9363c: con "Salta" in modalità voce lo stato resta "domanda" e
// InputVocale restava montato sulla carta nuova, quindi il riconoscimento
// partito sulla carta saltata (o il suo invio ritardato di 300 ms) rispondeva
// alla carta sbagliata. Ora InputVocale ha una key per carta (si rimonta e
// useSpeechRecognition interrompe il riconoscimento) e annulla il timer
// d'invio quando sparisce.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('InputVocale ha una key per carta', () => {
  const uso = HTML.slice(HTML.indexOf('React.createElement(InputVocale, {'), HTML.indexOf('onVerifica: onVerifica', HTML.indexOf('React.createElement(InputVocale, {')));
  assert.match(uso, /key: carta\.key \+ "_" \+ indice,/);
});

test('il timer d\'invio di InputVocale si annulla quando sparisce', () => {
  const iv = HTML.slice(HTML.indexOf('function InputVocale({'), HTML.indexOf('\nfunction ', HTML.indexOf('function InputVocale({') + 10));
  assert.match(iv, /timerInvio\.current = setTimeout\(\(\) => onVerifica\(tConv\), 300\)/);
  assert.match(iv, /useEffect\(\(\) => \(\) => clearTimeout\(timerInvio\.current\), \[\]\)/);
});
