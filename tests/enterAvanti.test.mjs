// Enter globale della schermata quiz (bug 2026-09-26).
//
// Prima: lo stesso Enter che conferma la risposta nella casella arrivava, dopo
// il cambio di stato fatto da React, anche all'ascoltatore su window, che lo
// prendeva per "Continua": il verde/rosso restava a schermo ~100 ms e la carta
// passava da sola.
//
// Dopo: handleKey ignora gli Enter partiti da una casella di testo e quelli
// ripetuti tenendo premuto il tasto; un Enter successivo fa "Continua" come prima.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

function estraiHandleKey() {
  const start = INDEX.indexOf('function handleKey(e) {');
  assert.ok(start >= 0, 'handleKey non trovata in index.html');
  assert.strictEqual(INDEX.indexOf('function handleKey(e) {', start + 1), -1, 'attesa una sola handleKey');
  let depth = 0, i = INDEX.indexOf('{', start);
  for (; i < INDEX.length; i++) {
    if (INDEX[i] === '{') depth++;
    else if (INDEX[i] === '}' && --depth === 0) break;
  }
  return INDEX.slice(start, i + 1);
}

function prova(stato, evento) {
  let avanti = 0;
  const ctx = { stato, onAvanti: () => avanti++, setTimeout: fn => fn() };
  vm.createContext(ctx);
  vm.runInContext(estraiHandleKey(), ctx);
  ctx.handleKey({ key: 'Enter', repeat: false, target: { tagName: 'BODY' }, ...evento });
  return avanti;
}

test('Enter che conferma dalla casella di risposta: non fa anche "Continua"', () => {
  assert.strictEqual(prova('corretto', { target: { tagName: 'INPUT' } }), 0);
  assert.strictEqual(prova('sbagliato', { target: { tagName: 'INPUT' } }), 0);
  assert.strictEqual(prova('corretto', { target: { tagName: 'TEXTAREA' } }), 0);
});

test('Enter successivo sulla pagina: fa "Continua" come prima', () => {
  assert.strictEqual(prova('corretto', {}), 1);
  assert.strictEqual(prova('sbagliato', {}), 1);
});

test('Enter tenuto premuto (ripetizione automatica): ignorato', () => {
  assert.strictEqual(prova('corretto', { repeat: true }), 0);
});

test('altri tasti o stato "domanda": niente', () => {
  assert.strictEqual(prova('corretto', { key: 'a' }), 0);
  assert.strictEqual(prova('domanda', {}), 0);
});
