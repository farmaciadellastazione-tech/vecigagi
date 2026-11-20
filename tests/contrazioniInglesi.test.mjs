// Segnalato da Dino (2026-11-20): "I'm" scritto dal telefono veniva dato
// sbagliato per "I am". La tastiera mette l'apostrofo tipografico (’) e
// espandiContrazioni riconosceva solo quello dritto ('): "I’m" → "im".
// Inoltre le contrazioni si espandevano solo nella risposta, non nella
// soluzione: con "I'm" nel vocabolario, "I am" risultava sbagliato.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const NUMERI_PAROLE = {', '\nconst SR = '),
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  'globalThis.isCorretta = isCorretta;',
].join('\n'), ctx);
const ok = (atteso, dato) => ctx.isCorretta(atteso, dato, 'en-US', 'en');

test('apostrofo tipografico: espandiContrazioni come con quello dritto', () => {
  assert.strictEqual(ctx.espandiContrazioni('I’m'), 'i am');
  assert.strictEqual(ctx.espandiContrazioni('don’t'), 'do not');
  assert.strictEqual(ctx.espandiContrazioni('can’t'), 'can not');
  assert.strictEqual(ctx.normalizzaEn('I’m tired'), 'i am tired');
});

test('"I’m" dal telefono vale "I am"', () => {
  assert.strictEqual(ok('I am', "I'm"), true); // già prima
  assert.strictEqual(ok('I am', 'I’m'), true);
  assert.strictEqual(ok('I am tired', 'I’m tired'), true);
  assert.strictEqual(ok('I do not know', 'I don’t know'), true);
});

test('contrazione nella soluzione: vale anche la forma intera', () => {
  assert.strictEqual(ok("I'm", 'I am'), true);
  assert.strictEqual(ok('I’m tired', 'I am tired'), true);
  assert.strictEqual(ok("don't", 'do not'), true);
});

test('solo parole intere: niente espansioni a metà parola', () => {
  assert.strictEqual(ctx.espandiContrazioni("Hi'm"), "Hi'm");
  assert.strictEqual(ctx.espandiContrazioni("ohe's"), "ohe's");
});

test('risposte sbagliate restano sbagliate', () => {
  assert.strictEqual(ok('I am', 'I’ve'), false);
  assert.strictEqual(ok('I am', 'you’re'), false);
  assert.strictEqual(ok("I'm", 'I was'), false);
});
