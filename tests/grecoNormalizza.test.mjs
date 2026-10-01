// Greco antico (2026-10-02): normalizza() teneva solo a-z, quindi una risposta
// scritta in greco diventava vuota e risultava SEMPRE sbagliata (vocabolario
// e coniugazioni, 385 voci + 153 celle). Ora tiene le lettere greche; accenti,
// spiriti e iota sottoscritto si tolgono come gli accenti latini, e il sigma
// finale ς vale σ. Così "φιλω" è giusta per "φιλῶ".
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
const n = s => ctx.normalizza(s);

test('le lettere greche restano, senza accenti né spiriti', () => {
  assert.strictEqual(n('φιλῶ'), 'φιλω');
  assert.strictEqual(n('ἐφίλουν'), 'εφιλουν');
  assert.strictEqual(n('φιλῇς'), 'φιλησ', 'iota sottoscritto tolto, sigma finale unificato');
  assert.strictEqual(n('Ἀθῆναι'), 'αθηναι', 'maiuscole');
  assert.strictEqual(n('φίλει!'), 'φιλει', 'punteggiatura tolta');
});

test('la risposta greca senza accenti coincide con l\'attesa accentata', () => {
  assert.strictEqual(n('φιλεις'), n('φιλεῖς'));
  assert.strictEqual(n('λογος'), n('λόγος'));
});

test('il latino non cambia', () => {
  assert.strictEqual(n('Caffè  '), 'caffe');
  assert.strictEqual(n("ti t'æ"), 'ti te');
});
