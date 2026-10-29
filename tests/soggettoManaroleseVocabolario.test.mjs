// Bug segnalato da Dino (2026-10-29): nel vocabolario "tu sei" (mn "tèi")
// scrivendo "tö tèi" (o "to tei") dava errore. rimuoviSoggetto toglieva solo
// i soggetti di SOGGETTI, dove il manarolese non c'è: i suoi soggetti stanno
// in SOGGETTI_DOMANDA (quelli mostrati nelle domande delle coniugazioni).
// Nelle coniugazioni funzionava già (togliPronomePienoDialetto).
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
  'globalThis.isCorretta = isCorretta; globalThis.spb = soggettoPersonaSbagliata;',
].join('\n'), ctx);
const giusta = (atteso, r) => ctx.isCorretta(atteso, r, 'it-IT', 'mn');

test('manarolese, vocabolario: soggetto davanti accettato', () => {
  assert.equal(giusta('tèi', 'tö tèi'), true);
  assert.equal(giusta('tèi', 'to tei'), true);
  assert.equal(giusta(' a vagu', 'mö a vagu'), true);
  assert.equal(giusta('tèi', 'tèi'), true); // senza soggetto, come prima
});

test('manarolese, vocabolario: soggetto facoltativo anche nella forma prevista', () => {
  assert.equal(giusta('vautri a partii', 'a partii'), true);
  assert.equal(giusta('vautri a partii', 'vàutri a partii'), true);
});

test('il soggetto non salva una forma sbagliata', () => {
  assert.equal(giusta('tèi', 'tö sun'), false);
});

// Con rimuoviSoggetto che toglie i soggetti mn, nelle coniugazioni passava
// "tö a sun" alla 1ª sing.: soggettoPersonaSbagliata ora conosce il manarolese.
test('coniugazioni mn: soggetto di un\'altra persona resta sbagliato', () => {
  assert.equal(ctx.spb('tö a sun', 'mn', '1ª sing.'), true);
  assert.equal(ctx.spb('lù a sömu', 'mn', '1ª plur.'), true);
  assert.equal(ctx.spb('mö a sun', 'mn', '1ª sing.'), false);
  assert.equal(ctx.spb('glié a lé', 'mn', '3ª sing. f.'), false);
  assert.equal(ctx.spb('vàutri a sö', 'mn', '2ª plur.'), false);
  assert.equal(ctx.spb('a sun', 'mn', '1ª sing.'), false);
});
