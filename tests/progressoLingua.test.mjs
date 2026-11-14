// Test del riquadro "Progressi per lingua" (schermata Statistiche).
// Bug 2026-11-14: la percentuale "appreso" usava come denominatore le COPPIE
// (voce × ogni altra lingua attiva), non le voci: con 10 lingue attive lo
// spagnolo mostrava 177 / 11277 = 2% invece di circa 13%, perché le coppie
// mai praticate (es. spagnolo↔catalano) finivano tutte tra le "non iniziate".
// Ora si conta per voce, con lo stesso criterio di parolaAppresa: contano solo
// le direzioni che coinvolgono la lingua e sono state praticate.
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
  if (/\}\s*$/.test(riga) && !/\{\s*$/.test(riga)) return riga;
  const chiusura = src.indexOf('\n}', start);
  return src.slice(start, chiusura + 2);
}

function ambiente() {
  const ctx = {};
  vm.createContext(ctx);
  const codice = [
    'const SOGLIA_APPRESA = 3;',
    estraiFunzione(VOCAB, 'soloVisibile'),
    estraiFunzione(VOCAB, 'wordKey'),
    estraiFunzione(INDEX, 'coppiaKey'),
    estraiFunzione(INDEX, 'getCoppia'),
    estraiFunzione(INDEX, 'isAppresa'),
    estraiFunzione(INDEX, 'lingueAttiveEntry'),
    estraiFunzione(INDEX, 'progressoLingua'),
  ].join('\n');
  vm.runInContext(codice, ctx);
  return ctx;
}

// 4 lingue attive: it, en, es, ca. L'utente pratica solo it↔es.
const LINGUE = ['it', 'en', 'es', 'ca'].map(codice => ({ codice, attiva: true }))
  .concat([{ codice: 'de', attiva: false }]);
const voce = (it) => ({ it, en: it + '_en', es: it + '_es', ca: it + '_ca', de: it + '_de' });
const VOC = [voce('uno'), voce('due'), voce('tre'), voce('quattro')];
const appresa = { livello: 4, risposte: 5, corrette: 5, prossima: 0 };
const inCorso = { livello: 1, risposte: 2, corrette: 1, prossima: 0 };

test('progressoLingua: denominatore = voci della lingua, non coppie', () => {
  const c = ambiente();
  const stats = {
    'uno__it__es': appresa, 'uno__es__it': appresa,
    'due__it__es': appresa,
    'tre__it__es': inCorso,
  };
  const r = c.progressoLingua(VOC, stats, LINGUE, 'es');
  assert.strictEqual(r.voci, 4);
  assert.strictEqual(r.apprese, 2);
  assert.strictEqual(r.inCorso, 1);
  assert.strictEqual(r.nonIniziate, 1);
  assert.strictEqual(r.apprese + r.inCorso + r.nonIniziate, r.voci);
});

test('progressoLingua: le direzioni mai praticate non abbassano la voce', () => {
  const c = ambiente();
  // solo it→es praticata e appresa: es↔en, es↔ca mai viste → la voce è appresa
  const stats = { 'uno__it__es': appresa };
  const r = c.progressoLingua(VOC, stats, LINGUE, 'es');
  assert.strictEqual(r.apprese, 1);
});

test('progressoLingua: regola 75% sulle direzioni praticate', () => {
  const c = ambiente();
  // 2 direzioni praticate, 1 appresa = 50% → in corso
  const stats = { 'uno__it__es': appresa, 'uno__es__it': inCorso };
  const r = c.progressoLingua(VOC, stats, LINGUE, 'es');
  assert.strictEqual(r.apprese, 0);
  assert.strictEqual(r.inCorso, 1);
});

test('progressoLingua: coppie con lingue non attive ignorate', () => {
  const c = ambiente();
  const stats = { 'uno__es__de': appresa };
  const r = c.progressoLingua(VOC, stats, LINGUE, 'es');
  assert.strictEqual(r.apprese, 0);
  assert.strictEqual(r.nonIniziate, 4);
});

test('progressoLingua: livello senza contatore risposte (dati vecchi) conta come praticata', () => {
  const c = ambiente();
  const stats = { 'uno__it__es': { livello: 3, prossima: 0 } };
  const r = c.progressoLingua(VOC, stats, LINGUE, 'es');
  assert.strictEqual(r.apprese, 1);
});

test('progressoLingua: voci senza la lingua escluse dal totale', () => {
  const c = ambiente();
  const voc = VOC.concat([{ it: 'cinque', en: 'five' }]);
  const r = c.progressoLingua(voc, {}, LINGUE, 'es');
  assert.strictEqual(r.voci, 4);
});

test('Statistiche usa progressoLingua', () => {
  const start = INDEX.indexOf('function Statistiche(');
  const corpo = INDEX.slice(start, INDEX.indexOf('return ', start));
  assert.match(corpo, /progressoLingua\(/);
});
