// Test del salvataggio "solo delta" del vocabolario (fix R4, audit 2026-07-08 in
// ANALISI.md). Prima del fix, SK_VOC persisteva SEMPRE l'intero array (default +
// voci custom) a ogni modifica — duplicando ~600KB identici al default a ogni
// salvataggio e avvicinando inutilmente la quota di localStorage (~5MB tipico su
// mobile), con saveJSON che falliva in silenzio (`catch {}`) una volta piena.
// Estrae le funzioni REALI dal sorgente (non le re-implementa) e le esegue in un
// sandbox vm con localStorage fake, verificando che venga persistito solo il
// delta e che il formato "vecchio" (array completo, da prima del fix) si
// auto-ripari al primo caricamento.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
// vocab.js è CommonJS (module.exports = _exports con _exports variabile, non
// object literal): cjs-module-lexer non riesce a derivarne gli export nominati,
// quindi `import { wordKey } from '../vocab.js'` fallisce sotto node:test nativo
// (funziona sotto vitest solo perché vite-node applica un'interop diversa).
const { wordKey } = createRequire(import.meta.url)('../vocab.js');
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// — parser bracket-aware identico a cleanup.test.mjs —
function estraiArray(src, re) {
  const m = re.exec(src); if (!m) throw new Error('marker non trovato');
  const start = m.index + m[0].length; let depth = 1, i = start, inStr = false, esc = false, q = null;
  while (i < src.length) { const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
    i++; }
  return (new Function('return [' + src.slice(start, i) + ']'))();
}

function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  const at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  let i = src.indexOf('{', at), depth = 0, inStr = false, esc = false, q = null;
  for (; i < src.length; i++) { const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}

const VOC = estraiArray(INDEX, /^\s*const VOCABOLARIO_DEFAULT = \[/m);
const SK_VOC = 'qml_v10_vocabolario';
const SK_VOC_VER = 'qml_v10_voc_version';
const VOC_VER_MATCH = INDEX.match(/^const VOC_VERSION = (\d+);/m);
const VOC_VERSION = Number(VOC_VER_MATCH[1]);

function makeFakeStorage(init = {}) {
  const map = new Map(Object.entries(init));
  return {
    map,
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
  };
}

function makeCtx(localStorage) {
  const sandbox = { localStorage, console, wordKey };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(`const VOCABOLARIO_DEFAULT = ${JSON.stringify(VOC)};`, ctx);
  vm.runInContext(`const SK_VOC = ${JSON.stringify(SK_VOC)}; const SK_VOC_VER = ${JSON.stringify(SK_VOC_VER)}; const VOC_VERSION = ${VOC_VERSION};`, ctx);
  vm.runInContext(extractFn(INDEX, 'loadJSON'), ctx);
  vm.runInContext(extractFn(INDEX, 'saveJSON'), ctx);
  vm.runInContext(extractFn(INDEX, 'vociCustom'), ctx);
  vm.runInContext(extractFn(INDEX, 'mergeVocabolario'), ctx);
  // resetStorageRecovery è chiamata dal catch di caricaVocabolario: stub innocuo,
  // non è oggetto di questo test (coperto da tests/recovery.test.mjs).
  vm.runInContext('function resetStorageRecovery() {}', ctx);
  vm.runInContext(extractFn(INDEX, 'caricaVocabolario'), ctx);
  return { ctx, localStorage };
}

const PAROLA_CUSTOM = { it: 'gagigo', en: 'test-word-not-in-default', tema: 'test', livello: 'A1' };

test('vociCustom: filtra via le voci già presenti nel default (per wordKey)', () => {
  const { ctx } = makeCtx(makeFakeStorage());
  const input = [VOC[0], VOC[5], PAROLA_CUSTOM];
  const r = vm.runInContext('vociCustom(' + JSON.stringify(input) + ')', ctx);
  assert.equal(r.length, 1, 'solo la voce custom deve sopravvivere al filtro');
  assert.equal(r[0].it, PAROLA_CUSTOM.it);
});

test('vociCustom: input vuoto o non-array non lancia', () => {
  const { ctx } = makeCtx(makeFakeStorage());
  assert.deepEqual(vm.runInContext('vociCustom(null)', ctx), []);
  assert.deepEqual(vm.runInContext('vociCustom([])', ctx), []);
});

test('mergeVocabolario: persiste in SK_VOC SOLO il delta, mai l\'intero default duplicato', () => {
  const { ctx, localStorage } = makeCtx(makeFakeStorage());
  const input = [...VOC, PAROLA_CUSTOM]; // formato "vecchio": default + custom insieme
  const merged = vm.runInContext('mergeVocabolario(' + JSON.stringify(input) + ')', ctx);

  assert.equal(merged.length, VOC.length + 1, 'il valore di ritorno deve restare il vocabolario COMPLETO');

  const persistito = JSON.parse(localStorage.map.get(SK_VOC));
  assert.equal(persistito.length, 1, `SK_VOC deve contenere solo il delta (1 voce custom), non l'intero default (${VOC.length} voci)`);
  assert.equal(persistito[0].it, PAROLA_CUSTOM.it);
});

test('caricaVocabolario: nessun dato salvato → default, nessun custom', () => {
  const { ctx } = makeCtx(makeFakeStorage());
  const r = vm.runInContext('caricaVocabolario()', ctx);
  assert.equal(r.length, VOC.length);
});

test('caricaVocabolario: SK_VOC già in formato delta → ricostruisce il completo e ri-salva lo stesso delta', () => {
  const { ctx, localStorage } = makeCtx(makeFakeStorage({
    [SK_VOC]: JSON.stringify([PAROLA_CUSTOM]),
    [SK_VOC_VER]: String(VOC_VERSION),
  }));
  const r = vm.runInContext('caricaVocabolario()', ctx);
  assert.equal(r.length, VOC.length + 1, 'atteso default + 1 voce custom');
  assert.ok(r.some(e => e.it === PAROLA_CUSTOM.it));

  const persistito = JSON.parse(localStorage.map.get(SK_VOC));
  assert.equal(persistito.length, 1, 'il delta ri-salvato deve restare di 1 voce, non gonfiarsi');
});

test('caricaVocabolario: self-healing — SK_VOC in formato "vecchio" (array completo) si riduce al delta dopo il caricamento', () => {
  const { ctx, localStorage } = makeCtx(makeFakeStorage({
    // Formato salvato da versioni precedenti dell'app: l'intero array completo.
    [SK_VOC]: JSON.stringify([...VOC, PAROLA_CUSTOM]),
    [SK_VOC_VER]: String(VOC_VERSION),
  }));
  const r = vm.runInContext('caricaVocabolario()', ctx);
  assert.equal(r.length, VOC.length + 1, 'il vocabolario restituito deve restare corretto (nessun duplicato)');

  const persistito = JSON.parse(localStorage.map.get(SK_VOC));
  assert.equal(
    persistito.length, 1,
    `dopo il caricamento SK_VOC deve auto-ripararsi al solo delta (1), non restare gonfio a ${VOC.length + 1}`
  );
});

test('caricaVocabolario: delta vuoto ([]) è uno stato VALIDO (nessuna parola custom), non corruzione', () => {
  const { ctx } = makeCtx(makeFakeStorage({
    [SK_VOC]: '[]',
    [SK_VOC_VER]: String(VOC_VERSION),
  }));
  const r = vm.runInContext('caricaVocabolario()', ctx);
  assert.equal(r.length, VOC.length, 'array vuoto salvato → solo il default, non un reset da corruzione');
});

test('saveJSON: ritorna true su successo, false e non lancia su quota superata', () => {
  const storageCheOverflow = {
    map: new Map(),
    getItem: () => null,
    setItem: () => { throw new DOMException('quota exceeded', 'QuotaExceededError'); },
    removeItem: () => {},
  };
  const { ctx } = makeCtx(storageCheOverflow);
  const ok1 = vm.runInContext('saveJSON("k", {a: 1})', ctx);
  assert.equal(ok1, false);

  const { ctx: ctx2 } = makeCtx(makeFakeStorage());
  const ok2 = vm.runInContext('saveJSON("k", {a: 1})', ctx2);
  assert.equal(ok2, true);
});
