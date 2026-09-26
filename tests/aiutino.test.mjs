// Aiutino sulle risposte "quasi giuste" (richiesta di Dino, 2026-09-26).
//
// In Allenamento, Ascolta e scrivi e Dettato, una risposta sbagliata di 1-2
// lettere (1 per le parole fino a 5 lettere) non diventa subito ❌: il quiz
// mostra la parola giusta con un "_" al posto delle lettere sbagliate e
// concede un secondo tentativo. Qui si testano le funzioni pure in vocab.js:
//   - distanzaOSA: distanza di modifica, due lettere scambiate = 1 errore;
//   - quasiGiusta: la forma attesa più vicina, se entro la soglia;
//   - mascheraAiutino: la parola con i buchi.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const { distanzaOSA, quasiGiusta, mascheraAiutino } = createRequire(import.meta.url)('../vocab.js');

test('distanzaOSA: sostituzione, inserimento, cancellazione, scambio', () => {
  assert.strictEqual(distanzaOSA('sparrow', 'sparrow'), 0);
  assert.strictEqual(distanzaOSA('sparrow', 'sparow'), 1);
  assert.strictEqual(distanzaOSA('car', 'cat'), 1);
  assert.strictEqual(distanzaOSA('wardrobe', 'wardorbe'), 1);
  assert.strictEqual(distanzaOSA('dog', 'cat'), 3);
  assert.strictEqual(distanzaOSA('', 'abc'), 3);
});

test('quasiGiusta: soglia 1 fino a 5 lettere, 2 oltre', () => {
  assert.deepStrictEqual(quasiGiusta('sparrow', 'sparow', 'en'), { forma: 'sparrow' });
  assert.deepStrictEqual(quasiGiusta('wardrobe', 'wardorbe', 'en'), { forma: 'wardrobe' });
  assert.deepStrictEqual(quasiGiusta('sparrow', 'sparo', 'en'), { forma: 'sparrow' }); // 2 su 7 lettere
  assert.deepStrictEqual(quasiGiusta('car', 'cat', 'en'), { forma: 'car' });
  assert.strictEqual(quasiGiusta('car', 'cut', 'en'), null); // 2 su 3 lettere
  assert.strictEqual(quasiGiusta('cat', 'dog', 'en'), null);
  assert.strictEqual(quasiGiusta('sparrow', 'spa', 'en'), null);
});

test('quasiGiusta: risposta vuota o già giusta → null', () => {
  assert.strictEqual(quasiGiusta('sparrow', '', 'en'), null);
  assert.strictEqual(quasiGiusta('sparrow', '   ', 'en'), null);
  assert.strictEqual(quasiGiusta('sparrow', 'Sparrow', 'en'), null);
});

test('quasiGiusta: accenti e maiuscole non contano, la forma resta quella originale', () => {
  assert.deepStrictEqual(quasiGiusta('perché', 'perhce', 'it'), { forma: 'perché' });
});

test('quasiGiusta: sceglie il sinonimo più vicino, anche nascosto dopo |', () => {
  assert.deepStrictEqual(quasiGiusta('cupboard/wardrobe', 'wardorbe', 'en'), { forma: 'wardrobe' });
  assert.deepStrictEqual(quasiGiusta('stroll|walk', 'wakl', 'en'), { forma: 'walk' });
  assert.deepStrictEqual(quasiGiusta('slice (of bread)', 'slise', 'en'), { forma: 'slice' });
});

test('quasiGiusta: inglese, "to" iniziale facoltativo', () => {
  assert.deepStrictEqual(quasiGiusta('to lower', 'lowr', 'en'), { forma: 'lower' });
  assert.deepStrictEqual(quasiGiusta('to lower', 'to lowr', 'en'), { forma: 'to lower' });
});

test('quasiGiusta: dialetto pronuncia/grafia, vale la forma più vicina', () => {
  assert.deepStrictEqual(quasiGiusta("camalàaee/camalae", 'camale', 'sp'), { forma: 'camalae' });
});

test('mascheraAiutino: "_" al posto delle lettere sbagliate o mancanti', () => {
  // Con due lettere uguali di fila si maschera la prima: vale lo stesso.
  assert.strictEqual(mascheraAiutino('sparrow', 'sparow'), 'spa_row');
  assert.strictEqual(mascheraAiutino('car', 'cat'), 'ca_');
  assert.strictEqual(mascheraAiutino('sparrow', 'sparrov'), 'sparro_');
});

test('mascheraAiutino: spazi, apostrofi e accenti della forma originale restano', () => {
  assert.strictEqual(mascheraAiutino('sea bass', 'sea bas'), 'sea ba_s');
  assert.strictEqual(mascheraAiutino("t'ei", 'tei'), "t'ei");
  assert.strictEqual(mascheraAiutino('perché', 'perche'), 'perché');
});

test('mascheraAiutino: scambio di due lettere → un buco su una delle due', () => {
  const m = mascheraAiutino('wardrobe', 'wardorbe');
  assert.strictEqual(m.length, 'wardrobe'.length);
  assert.strictEqual((m.match(/_/g) || []).length >= 1, true);
  assert.ok(/^ward.{2}be$/.test(m));
});
