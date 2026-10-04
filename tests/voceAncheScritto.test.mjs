// Richiesta di Dino (2026-10-04): negli esercizi vocali il riconoscimento
// spesso non funziona; sotto il microfono c'è anche "oppure scrivi", con una
// casella che usa la stessa verifica della voce (onVerifica). Niente
// autofocus, così sul telefono la tastiera non copre il microfono.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

const a = HTML.indexOf('stato === "domanda" && modalitaEffettiva === "voce" && lA &&');
const b = HTML.indexOf('stato === "corretto" &&', a);
const voce = HTML.slice(a, b);

test('in modalità voce ci sono sia il microfono sia la casella di testo', () => {
  assert.ok(a > 0, 'blocco voce non trovato');
  assert.match(voce, /React\.createElement\(InputVocale,/);
  assert.match(voce, /oppure scrivi/);
  assert.match(voce, /React\.createElement\("input", \{/);
});

test('la risposta scritta usa la stessa verifica della voce', () => {
  assert.match(voce, /onKeyDown: e => \{[\s\S]*?e\.key === "Enter"[\s\S]*?onVerifica\(input\)/);
  assert.match(voce, /onClick: \(\) => \{[\s\S]*?onVerifica\(input\)/);
});

test('la casella della voce non si apre da sola (niente ref/autofocus)', () => {
  const input = voce.slice(voce.indexOf('React.createElement("input", {'), voce.indexOf('})', voce.indexOf('React.createElement("input", {')));
  assert.doesNotMatch(input, /ref: inputRef|autoFocus/);
});
