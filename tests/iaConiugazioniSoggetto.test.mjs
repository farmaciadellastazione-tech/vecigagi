// edit-coniugazioni.html: le forme compilate dall'IA non devono contenere il
// pronome soggetto (lo aggiunge l'app). Anche con il prompt che lo vieta, l'IA
// a volte lo mette ("er/sie/es kann"): togliSoggettoIA() lo toglie comunque.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');

function estrai(src, inizio, fine) {
  const a = src.indexOf(inizio);
  if (a < 0) throw new Error('non trovato: ' + inizio);
  const b = src.indexOf(fine, a);
  return src.slice(a, b);
}
const codice = estrai(SRC, 'const PRONOMI_SOGGETTO_IA', '\nasync function');
const togliSoggettoIA = new Function(codice + '; return togliSoggettoIA;')();

test('toglie il pronome soggetto e le alternative fatte di soli pronomi', () => {
  assert.strictEqual(togliSoggettoIA('de', 'er/sie/es kann'), 'kann');
  assert.strictEqual(togliSoggettoIA('en', 'he/she/it can'), 'can');
  assert.strictEqual(togliSoggettoIA('fr', 'il/elle peut'), 'peut');
  assert.strictEqual(togliSoggettoIA('es', 'nosotros/as queremos'), 'queremos');
  assert.strictEqual(togliSoggettoIA('it', 'lui/lei sa'), 'sa');
  assert.strictEqual(togliSoggettoIA('la', 'is/ea scit'), 'scit');
  assert.strictEqual(togliSoggettoIA('ia', 'illes/illas pote'), 'pote');
  assert.strictEqual(togliSoggettoIA('pt', 'eu estou'), 'estou');
  assert.strictEqual(togliSoggettoIA('fr', "j'aime"), 'aime');
});

test('lascia intatte le forme senza soggetto, anche se somigliano a un pronome', () => {
  assert.strictEqual(togliSoggettoIA('de', 'liebt'), 'liebt');
  assert.strictEqual(togliSoggettoIA('en', 'will love'), 'will love');
  assert.strictEqual(togliSoggettoIA('la', 'is'), 'is');       // ire, 2ª sing.
  assert.strictEqual(togliSoggettoIA('la', 'it'), 'it');       // ire, 3ª sing.
  assert.strictEqual(togliSoggettoIA('es', 'es/está'), 'es/está');
  assert.strictEqual(togliSoggettoIA('pt', 'amávamos/amavamos'), 'amávamos/amavamos');
  assert.strictEqual(togliSoggettoIA('grc', 'φιλῶ'), 'φιλῶ');
  assert.strictEqual(togliSoggettoIA('en', "let's go"), "let's go");
});
