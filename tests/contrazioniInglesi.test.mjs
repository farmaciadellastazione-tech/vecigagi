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

// Code review 2026-11-20 ───────────────────────────────────────────────────

test('contrazione nella soluzione: il soggetto sbagliato resta sbagliato', () => {
  assert.strictEqual(ok("she's tired", 'he is tired'), false);
  assert.strictEqual(ok("she's tired", 'she is tired'), true);
  assert.strictEqual(ok("I'm", 'you am'), false);
});

test('"cannot" nella soluzione vale anche "can\'t" e "can not"', () => {
  assert.strictEqual(ok('cannot', "can't"), true);
  assert.strictEqual(ok('cannot', 'can not'), true);
  assert.strictEqual(ok('cannot', 'cannot'), true);
});

test('altre contrazioni comuni', () => {
  assert.strictEqual(ctx.espandiContrazioni("let's go"), 'let us go');
  assert.strictEqual(ctx.espandiContrazioni("who's there"), 'who is there');
  assert.strictEqual(ctx.espandiContrazioni("it'll rain"), 'it will rain');
  assert.strictEqual(ctx.espandiContrazioni("mustn't"), 'must not');
  assert.strictEqual(ctx.espandiContrazioni("needn't"), 'need not');
  assert.strictEqual(ctx.espandiContrazioni("here's"), 'here is');
  assert.strictEqual(ctx.espandiContrazioni("where's"), 'where is');
  assert.strictEqual(ok("let's go", 'let us go'), true);
});

test('prompt "Era giusta?": la regola delle contrazioni solo per l\'inglese', () => {
  const ctx2 = vm.createContext({ localStorage: { getItem: () => null, setItem() {}, removeItem() {} } });
  ctx2.globalThis = ctx2;
  vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx2);
  vm.runInContext(tra('// ── Sinonimi accettati', '\n// ── Archivio frasi da ripassare') + '\nglobalThis.promptSinonimo = promptSinonimo;', ctx2);
  const caso = { parola: 'io sono', nomeDa: 'Italiano', atteso: 'x', risposta: 'y' };
  assert.match(ctx2.promptSinonimo({ ...caso, nomeA: 'Inglese', codA: 'en' }).system, /contrazion/i);
  assert.doesNotMatch(ctx2.promptSinonimo({ ...caso, nomeA: 'Francese', codA: 'fr' }).system, /contrazion/i);
  assert.doesNotMatch(ctx2.promptSinonimo({ ...caso, nomeA: 'Italiano', codA: 'it' }).system, /contrazion/i);
});

test('risposte sbagliate restano sbagliate', () => {
  assert.strictEqual(ok('I am', 'I’ve'), false);
  assert.strictEqual(ok('I am', 'you’re'), false);
  assert.strictEqual(ok("I'm", 'I was'), false);
});
