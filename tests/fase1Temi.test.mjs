// Test delle due funzioni pure della "fase 1" (solo nuovi utenti, vedi
// SK_FASE1_TEMI in index.html): sessione bloccata su un tema alla volta
// finché non li si è passati in rassegna tutti.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');
const VOCAB = fs.readFileSync(ROOT + '/vocab.js', 'utf8');

function estraiFunzione(src, nome) {
  const start = src.indexOf('function ' + nome + '(');
  assert.ok(start >= 0, `funzione ${nome} non trovata`);
  const fineRiga = src.indexOf('\n', start);
  const riga = src.slice(start, fineRiga);
  if (/\}\s*$/.test(riga) && !/\{\s*$/.test(riga)) return riga; // funzione su una riga
  const chiusura = src.indexOf('\n}', start);
  return src.slice(start, chiusura + 2);
}

function estraiOggetto(src, nome) {
  const start = src.indexOf('const ' + nome + ' = {');
  assert.ok(start >= 0, `const ${nome} non trovata`);
  const fine = src.indexOf('};', start); // non '};\n': index.html usa CRLF
  return src.slice(start, fine + 2);
}

function ambiente() {
  const ctx = {};
  vm.createContext(ctx);
  const codice = [
    estraiOggetto(INDEX, 'TEMI'),
    estraiFunzione(VOCAB, 'soloVisibile'),
    estraiFunzione(VOCAB, 'wordKey'),
    estraiFunzione(INDEX, 'coppiaKey'),
    estraiFunzione(INDEX, 'getCoppia'),
    estraiFunzione(INDEX, 'lingueAttiveEntry'),
    estraiFunzione(INDEX, 'ordinaTemiPerDimensione'),
    estraiFunzione(INDEX, 'paroleToccateTema'),
  ].join('\n');
  vm.runInContext(codice, ctx);
  return ctx;
}

const LINGUE = [
  { codice: 'it', attiva: true },
  { codice: 'en', attiva: true },
  { codice: 'sp', attiva: false },
];

test('ordinaTemiPerDimensione: ordine crescente per numero di voci', () => {
  const c = ambiente();
  const vocabolario = [
    { tema: 'verbi', it: 'a' }, { tema: 'verbi', it: 'b' }, { tema: 'verbi', it: 'c' },
    { tema: 'saluti', it: 'd' },
    { tema: 'numeri', it: 'e' }, { tema: 'numeri', it: 'f' },
  ];
  // Array.from: l'array torna dal contesto vm, di un realm diverso (prototipo
  // diverso) — deepStrictEqual lo tratterebbe come non uguale pur avendo lo
  // stesso contenuto.
  assert.deepStrictEqual(Array.from(c.ordinaTemiPerDimensione(vocabolario)), ['saluti', 'numeri', 'verbi']);
});

test('ordinaTemiPerDimensione: esclude temi a conteggio zero e temi sconosciuti', () => {
  const c = ambiente();
  const vocabolario = [{ tema: 'saluti', it: 'ciao' }, { tema: 'temaInventato', it: 'x' }, { it: 'senza tema' }];
  assert.deepStrictEqual(Array.from(c.ordinaTemiPerDimensione(vocabolario)), ['saluti']);
});

test('ordinaTemiPerDimensione: vocabolario vuoto -> lista vuota', () => {
  const c = ambiente();
  assert.deepStrictEqual(Array.from(c.ordinaTemiPerDimensione([])), []);
});

test('paroleToccateTema: conta solo le parole con una coppia a livello >= 1', () => {
  const c = ambiente();
  const vocabolario = [
    { tema: 'saluti', it: 'ciao', en: 'hi' },      // toccata
    { tema: 'saluti', it: 'salve', en: 'hello' },  // mai praticata
    { tema: 'saluti', it: 'addio', en: 'bye' },    // praticata ma sempre sbagliata (livello resta 0)
    { tema: 'numeri', it: 'uno', en: 'one' },      // altro tema, non deve contare
  ];
  const stats = {
    [c.coppiaKey(vocabolario[0], 'it', 'en')]: { livello: 1 },
    [c.coppiaKey(vocabolario[2], 'it', 'en')]: { livello: 0 },
  };
  assert.strictEqual(c.paroleToccateTema('saluti', vocabolario, stats, LINGUE), 1);
});

test('paroleToccateTema: ignora le lingue non attive', () => {
  const c = ambiente();
  const vocabolario = [{ tema: 'saluti', it: 'ciao', sp: 'hola' }]; // sp non attiva -> solo 1 lingua attiva, non conta
  assert.strictEqual(c.paroleToccateTema('saluti', vocabolario, {}, LINGUE), 0);
});

test('paroleToccateTema: tema assente -> zero', () => {
  const c = ambiente();
  const vocabolario = [{ tema: 'numeri', it: 'uno', en: 'one' }];
  assert.strictEqual(c.paroleToccateTema('saluti', vocabolario, {}, LINGUE), 0);
});
