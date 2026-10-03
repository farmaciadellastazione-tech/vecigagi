// Review del lotto 3 spezzino: i tempi nuovi (congiuntivoImperfetto,
// condizionale) non avevano colore in coloriTempi e il ripiego "bg-black0"
// non esiste: pulsante e titolo bianchi su fondo chiaro, invisibili.
// Ogni tempo dei dati deve avere un colore, il ripiego dev'essere una classe
// vera, e tutte le classi devono esistere in tailwind.css.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const CSS = fs.readFileSync(ROOT + '/tailwind.css', 'utf8');
const a = HTML.indexOf('const coloriTempi = {');
const colori = new Function('return ' + HTML.slice(a + 'const coloriTempi = '.length, HTML.indexOf('};', a) + 1))();
const c0 = HTML.indexOf('const CONIUGAZIONI = {');
const C = new Function(HTML.slice(c0, HTML.indexOf('\n// Genera esercizi dal database coniugazioni', c0)) + ';return CONIUGAZIONI')();

test('ogni tempo presente nei dati ha un colore', () => {
  const tempi = new Set(Object.values(C).flatMap(v => Object.keys(v.tempi)));
  for (const t of tempi) assert.ok(colori[t], 'manca il colore per ' + t);
});

test('i colori e il ripiego esistono in tailwind.css', () => {
  for (const cls of Object.values(colori)) assert.ok(CSS.includes('.' + cls + '{'), cls);
  assert.ok(!HTML.includes('"bg-black0"'), 'ripiego inesistente');
});
