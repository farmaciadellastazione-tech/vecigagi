// Test della bozza locale di edit-coniugazioni.html.
//
// Requisito (Dino, 2026-09-27): come edit.html, l'editor delle coniugazioni
// non deve far perdere il lavoro — né per chiusura/refresh accidentale, né
// quando la guardia anti-clobber blocca il salvataggio perché index.html è
// cambiato su GitHub nel frattempo (prima bisognava rifare tutto a mano).
// La bozza è PER VERBO: al ripristino ogni verbo toccato viene riapplicato
// sulla base fresca, e i verbi cambiati anche su GitHub finiscono in
// "conflitti" invece di essere sovrascritti in silenzio.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');

// Estrae "function nome(...) { ... }" con scansione bilanciata delle graffe
// (stringhe e commenti ignorati).
function extractFn(src, name) {
  const at = src.indexOf('function ' + name + '(');
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  const bodyStart = src.indexOf('{', src.indexOf(')', at));
  let depth = 0, i = bodyStart, inStr = false, esc = false, q = null, lc = false, bc = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (lc) { if (c === '\n') lc = false; continue; }
    if (bc) { if (c === '*' && c2 === '/') { bc = false; i++; } continue; }
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; continue; }
    if (c === '/' && c2 === '/') { lc = true; i++; continue; }
    if (c === '/' && c2 === '*') { bc = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}

const ctx = vm.createContext({});
['stessoVerbo', 'calcolaBozzaVerbi', 'applicaBozzaVerbi'].forEach(n => vm.runInContext(extractFn(SRC, n), ctx));
const run = (expr, vars) => {
  Object.assign(ctx, JSON.parse(JSON.stringify(vars)));
  return JSON.parse(JSON.stringify(vm.runInContext(expr, ctx)));
};

const essere = { nome: 'essere', tempi: { presente: { nome: 'presente', forme: [{ p: '1ª sing.', it: 'io sono', sp: 'mi a son' }] } } };
const avere  = { nome: 'avere',  tempi: { presente: { nome: 'presente', forme: [{ p: '1ª sing.', it: 'io ho' }] } } };
const clone = o => JSON.parse(JSON.stringify(o));

test('nessuna modifica → bozza vuota', () => {
  const b = run('calcolaBozzaVerbi(caricate, attuali)', { caricate: { essere, avere }, attuali: { essere, avere } });
  assert.deepStrictEqual(b, { basi: {}, verbi: {} });
});

test('verbo modificato, aggiunto e rimosso finiscono in bozza con la loro base', () => {
  const essere2 = clone(essere); essere2.tempi.presente.forme[0].sp = 'mi son';
  const fare = { nome: 'fare', tempi: {} };
  const b = run('calcolaBozzaVerbi(caricate, attuali)', { caricate: { essere, avere }, attuali: { essere: essere2, fare } });
  assert.deepStrictEqual(Object.keys(b.verbi).sort(), ['avere', 'essere', 'fare']);
  assert.deepStrictEqual(b.verbi.essere, essere2);
  assert.deepStrictEqual(b.basi.essere, essere);
  assert.strictEqual(b.verbi.avere, null);   // rimosso
  assert.deepStrictEqual(b.basi.avere, avere);
  assert.deepStrictEqual(b.verbi.fare, fare);
  assert.strictEqual(b.basi.fare, null);     // nuovo
});

test('remoto invariato → la bozza viene riapplicata (modifica, aggiunta, rimozione)', () => {
  const essere2 = clone(essere); essere2.tempi.presente.forme[0].sp = 'mi son';
  const fare = { nome: 'fare', tempi: {} };
  const bozza = { basi: { essere, avere, fare: null }, verbi: { essere: essere2, avere: null, fare } };
  const r = run('applicaBozzaVerbi(fresco, bozza)', { fresco: { essere, avere }, bozza });
  assert.deepStrictEqual(r.coniugazioni, { essere: essere2, fare });
  assert.deepStrictEqual(r.applicati.sort(), ['avere', 'essere', 'fare']);
  assert.deepStrictEqual(r.conflitti, []);
});

test('verbo cambiato anche su GitHub dopo la bozza → conflitto, remoto intatto', () => {
  const mio = clone(essere); mio.tempi.presente.forme[0].sp = 'mi son';
  const loro = clone(essere); loro.tempi.presente.forme[0].en = 'I am';
  const bozza = { basi: { essere }, verbi: { essere: mio } };
  const r = run('applicaBozzaVerbi(fresco, bozza)', { fresco: { essere: loro, avere }, bozza });
  assert.deepStrictEqual(r.coniugazioni.essere, loro);
  assert.deepStrictEqual(r.conflitti, ['essere']);
  assert.deepStrictEqual(r.applicati, []);
});

test('bozza già salvata su GitHub → "gia", nessun conflitto', () => {
  const mio = clone(essere); mio.tempi.presente.forme[0].sp = 'mi son';
  const bozza = { basi: { essere }, verbi: { essere: mio } };
  const r = run('applicaBozzaVerbi(fresco, bozza)', { fresco: { essere: mio }, bozza });
  assert.deepStrictEqual(r.gia, ['essere']);
  assert.deepStrictEqual(r.conflitti, []);
  assert.deepStrictEqual(r.coniugazioni, { essere: mio });
});

test('verbo nuovo in bozza ma creato nel frattempo anche su GitHub → conflitto', () => {
  const mioFare = { nome: 'fare', tempi: { a: { nome: 'a', forme: [] } } };
  const loroFare = { nome: 'fare', tempi: {} };
  const bozza = { basi: { fare: null }, verbi: { fare: mioFare } };
  const r = run('applicaBozzaVerbi(fresco, bozza)', { fresco: { fare: loroFare }, bozza });
  assert.deepStrictEqual(r.conflitti, ['fare']);
  assert.deepStrictEqual(r.coniugazioni.fare, loroFare);
});

test('non muta l\'oggetto fresco passato', () => {
  const fresco = { essere: clone(essere) };
  const mio = clone(essere); mio.nome = 'essere!';
  Object.assign(ctx, { fresco, bozza: { basi: { essere }, verbi: { essere: mio } } });
  vm.runInContext('applicaBozzaVerbi(fresco, bozza)', ctx);
  assert.deepStrictEqual(fresco, { essere });
});
