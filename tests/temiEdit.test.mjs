// Test delle funzioni sui temi di edit.html: temiEsistenti() e temaIADaUsare().
//
// Prima: la lista dei temi era derivata in 4 punti diversi e la risposta
// dell'IA (tema inventato o scritto male) veniva salvata senza controlli;
// il validatore la bloccava poi in CI, e nel quiz la voce non aveva badge.
//
// Dopo: una sola funzione temiEsistenti(); il tema proposto dall'IA vale
// solo se esiste già nel vocabolario, altrimenti si lascia la voce senza tema.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

// Estrae il codice di una funzione top-level (fino alla } di chiusura a colonna 0
// o, per le funzioni su una riga, fino a fine riga).
function estraiFunzione(nome) {
  const start = EDIT.indexOf('function ' + nome + '(');
  assert.ok(start >= 0, `funzione ${nome} non trovata in edit.html`);
  const fineRiga = EDIT.indexOf('\n', start);
  const riga = EDIT.slice(start, fineRiga);
  if (/\}\s*$/.test(riga) && !/\{\s*$/.test(riga)) return riga;             // funzione su una riga
  const chiusura = EDIT.indexOf('\n}', start);
  return EDIT.slice(start, chiusura + 2);
}

function ambiente(vocabolario) {
  const ctx = { vocabolario };
  vm.createContext(ctx);
  vm.runInContext(estraiFunzione('temiEsistenti') + '\n' + estraiFunzione('temaIADaUsare'), ctx);
  return ctx;
}

test('temiEsistenti: temi unici, ordinati, senza vuoti', () => {
  const c = ambiente([{ tema: 'verbi' }, { tema: 'casa' }, { tema: 'verbi' }, { it: 'senza tema' }, { tema: '' }, { tema: 'animali' }]);
  assert.deepStrictEqual([...c.temiEsistenti()], ['animali', 'casa', 'verbi']);
});

test('temiEsistenti: vocabolario vuoto -> lista vuota', () => {
  assert.deepStrictEqual([...ambiente([]).temiEsistenti()], []);
});

test('temaIADaUsare: un tema esistente è accettato', () => {
  const c = ambiente([{ tema: 'casa' }, { tema: 'animali' }]);
  assert.strictEqual(c.temaIADaUsare('animali'), 'animali');
});

test('temaIADaUsare: un tema inventato o scritto male è scartato', () => {
  const c = ambiente([{ tema: 'casa' }, { tema: 'animali' }]);
  assert.strictEqual(c.temaIADaUsare('animale'), '');
  assert.strictEqual(c.temaIADaUsare('dialetti'), '');
});

test('temaIADaUsare: undefined, null e stringa vuota danno stringa vuota', () => {
  const c = ambiente([{ tema: 'casa' }]);
  assert.strictEqual(c.temaIADaUsare(undefined), '');
  assert.strictEqual(c.temaIADaUsare(null), '');
  assert.strictEqual(c.temaIADaUsare(''), '');
});

test('edit.html: la lista dei temi è derivata in un solo punto', () => {
  // niente più derivazioni duplicate: l'unico "vocabolario.map(v => v.tema)" è dentro temiEsistenti
  const occorrenze = EDIT.match(/vocabolario\.map\(v => v\.tema\)/g) || [];
  assert.strictEqual(occorrenze.length, 1, 'la derivazione dei temi deve stare solo in temiEsistenti()');
});

test('edit.html: nessun tema "dialetti" di default né nel prompt all\'IA', () => {
  assert.doesNotMatch(EDIT, /\|\|\s*'dialetti'/);
  assert.doesNotMatch(EDIT, /"saluti",\s*"dialetti"/);
});
