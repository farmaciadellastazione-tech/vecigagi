// Review 2026-10-03: in modalità voce, InputVocale non rifaceva il secondo
// tentativo di verificaRisposta (togliere il pronome pieno facoltativo, cr
// "me a son"). Con trascrizioni ["mia son", "me a son"] inviava la prima.
// Ora, per le coniugazioni, se nessuna alternativa passa così com'è, si
// riprova togliendo il pronome pieno della persona della carta.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('InputVocale riprova senza pronome pieno per le coniugazioni', () => {
  assert.match(HTML, /preciso && alternative\.find\(alt => isCorretta\(atteso, togliPronomePienoDialetto\(alt, codLingua, persona\), bcp47, codLingua, preciso\)\)/);
  const firma = HTML.slice(HTML.indexOf('function InputVocale({'), HTML.indexOf('}) {', HTML.indexOf('function InputVocale({')));
  assert.match(firma, /\bpersona\b/);
  const uso = HTML.slice(HTML.indexOf('React.createElement(InputVocale, {'), HTML.indexOf('onVerifica: onVerifica', HTML.indexOf('React.createElement(InputVocale, {')));
  assert.match(uso, /persona: carta\.persona,/);
});
