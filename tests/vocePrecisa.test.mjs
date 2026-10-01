// Review 2026-10-02: in modalità voce InputVocale sceglie quale trascrizione
// inviare con isCorretta TOLLERANTE, mentre verificaRisposta giudica le
// coniugazioni col controllo preciso. Con atteso "parla" e trascrizioni
// ["parlano", "parla"] inviava "parlano" (accettata dal tollerante) che poi
// risultava sbagliata, pur avendo "parla" tra le alternative.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('InputVocale sceglie la trascrizione con lo stesso controllo (preciso) del giudizio', () => {
  const iv = HTML.slice(HTML.indexOf('function InputVocale({'), HTML.indexOf('const [trascritto, setTrascritto]', HTML.indexOf('function InputVocale({')));
  assert.match(iv, /\bpreciso\b/, 'InputVocale deve ricevere la prop preciso');
  assert.match(HTML, /alternative\.find\(alt => isCorretta\(atteso, alt, bcp47, codLingua, preciso\)\)/);
});

test('il quiz passa preciso a InputVocale per le carte coniugazione', () => {
  const uso = HTML.slice(HTML.indexOf('React.createElement(InputVocale, {'), HTML.indexOf('onVerifica: onVerifica', HTML.indexOf('React.createElement(InputVocale, {')));
  assert.match(uso, /preciso: carta\.tipo === "coniugazione"/);
});
