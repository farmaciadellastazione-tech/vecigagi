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

// Scansiona `src` da `start` bilanciando `apre`/`chiude`, saltando stringhe
// ('/"/`), commenti riga (//) e commenti blocco (/* */). Necessario: i commenti
// in italiano contengono spesso apostrofi (es. "l'utente") che un tokenizer
// senza supporto commenti scambia per apertura di stringa, sballando il
// bilanciamento graffe su lunghe distanze (bug osservato in tests/callAI.test.mjs
// quando una modifica altrove nel file cambiava la parità di apostrofi
// attraversati durante la scansione).
function scansionaBilanciato(src, start, apre, chiude) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, started = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (inLineComment) { if (c === '\n') inLineComment = false; continue; }
    if (inBlockComment) { if (c === '*' && c2 === '/') { inBlockComment = false; i++; } continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === q) inStr = false;
      continue;
    }
    if (c === '/' && c2 === '/') { inLineComment = true; i++; continue; }
    if (c === '/' && c2 === '*') { inBlockComment = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === apre) { depth++; started = true; }
    else if (c === chiude) { depth--; if (started && depth === 0) { i++; break; } }
  }
  return i;
}
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  const at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
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
  vm.runInContext(extractFn(INDEX, 'raggruppaPerChiave'), ctx);
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

// Fix R3 (audit 2026-07-08, ANALISI.md): una modifica locale a una voce del
// default (es. via ✏️ nel Vocabolario) ha lo STESSO wordKey del default — prima
// di questo fix, vociCustom la scartava come "già nel default" e la modifica
// spariva al caricamento successivo (regressione introdotta da R4, che ora fa
// il merge a ogni boot invece che solo al bump di VOC_VERSION).
test('vociCustom: una voce default MODIFICATA (stesso wordKey, campo diverso) sopravvive al filtro', () => {
  const { ctx } = makeCtx(makeFakeStorage());
  const modificata = { ...VOC[0], sp: '__valore_modificato_dall_utente__' };
  const input = [modificata, VOC[5]]; // VOC[5] invariata: deve restare filtrata
  const r = vm.runInContext('vociCustom(' + JSON.stringify(input) + ')', ctx);
  assert.equal(r.length, 1, 'solo la voce modificata deve sopravvivere, non quella invariata');
  assert.equal(r[0].sp, '__valore_modificato_dall_utente__');
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

test('mergeVocabolario: una voce default modificata appare UNA SOLA volta nel risultato (non duplicata) con i valori aggiornati', () => {
  const { ctx } = makeCtx(makeFakeStorage());
  const modificata = { ...VOC[0], sp: '__valore_modificato_dall_utente__' };
  const merged = vm.runInContext('mergeVocabolario(' + JSON.stringify([modificata]) + ')', ctx);

  assert.equal(merged.length, VOC.length, 'nessuna voce in più: la modifica sostituisce, non aggiunge');
  const occorrenze = merged.filter(e => wordKey(e) === wordKey(VOC[0]));
  assert.equal(occorrenze.length, 1, `atteso 1 sola occorrenza di "${wordKey(VOC[0])}", trovate ${occorrenze.length}`);
  assert.equal(occorrenze[0].sp, '__valore_modificato_dall_utente__', 'deve riflettere il valore modificato, non quello originale del default');
});

test('caricaVocabolario: una modifica locale a una voce default sopravvive a caricamenti ripetuti (fix regressione R4)', () => {
  const { ctx, localStorage } = makeCtx(makeFakeStorage());
  const modificata = { ...VOC[0], sp: '__valore_modificato_dall_utente__' };
  // Prima "sessione": salva la modifica (come farebbe l'useEffect di persistenza in App).
  vm.runInContext('saveJSON(SK_VOC, vociCustom(' + JSON.stringify([modificata]) + '))', ctx);
  // Seconda e terza "sessione" (reload): la modifica deve sopravvivere, non solo alla prima ricarica.
  for (let volta = 0; volta < 2; volta++) {
    const r = vm.runInContext('caricaVocabolario()', ctx);
    const occorrenze = r.filter(e => wordKey(e) === wordKey(VOC[0]));
    assert.equal(occorrenze.length, 1, `giro ${volta}: attesa 1 occorrenza`);
    assert.equal(occorrenze[0].sp, '__valore_modificato_dall_utente__', `giro ${volta}: la modifica deve persistere, non sparire al reload`);
  }
});

// Il vocabolario ha OMONIMI reali: coppie di voci con lo stesso wordKey ma
// tema/traduzioni diversi (26 gruppi trovati nel vocabolario attuale, es. due
// voci "adesso" per sensi diversi). Un Map(wordKey -> voce) ne perderebbe una
// per collisione — bug scoperto proprio scrivendo questo test.
test('mergeVocabolario: con OMONIMI (stesso wordKey, più voci default), modificarne uno non tocca né duplica il gemello invariato', () => {
  // Costruisce un omonimo artificiale: due voci con lo stesso "it" ma temi diversi
  // (il vocabolario reale ne ha 26 gruppi, es. due voci "adesso" per sensi diversi).
  const omonimoA = { it: '__omonimo_test__', tema: 'senso-a', livello: 'A1', en: 'meaning-a' };
  const omonimoB = { it: '__omonimo_test__', tema: 'senso-b', livello: 'A1', en: 'meaning-b' };
  const vocConOmonimi = [...VOC, omonimoA, omonimoB];
  const omonimoAModificato = { ...omonimoA, en: 'meaning-a-corretto' };

  // Sandbox dedicato con VOCABOLARIO_DEFAULT = vocConOmonimi (i due omonimi
  // devono essere parte del "default" per questo scenario, non voci custom).
  const sandbox = { localStorage: makeFakeStorage(), console, wordKey };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(`const VOCABOLARIO_DEFAULT = ${JSON.stringify(vocConOmonimi)}; const SK_VOC = ${JSON.stringify(SK_VOC)};`, ctx);
  vm.runInContext(extractFn(INDEX, 'saveJSON'), ctx);
  vm.runInContext(extractFn(INDEX, 'raggruppaPerChiave'), ctx);
  vm.runInContext(extractFn(INDEX, 'vociCustom'), ctx);
  vm.runInContext(extractFn(INDEX, 'mergeVocabolario'), ctx);

  const custom = vm.runInContext('vociCustom(' + JSON.stringify([omonimoAModificato, omonimoB]) + ')', ctx);
  assert.equal(custom.length, 1, 'solo il gemello modificato deve risultare custom, non quello invariato');
  assert.equal(custom[0].en, 'meaning-a-corretto');

  const merged = vm.runInContext('mergeVocabolario(' + JSON.stringify([omonimoAModificato]) + ')', ctx);
  const occorrenze = merged.filter(e => wordKey(e) === '__omonimo_test__');
  assert.equal(occorrenze.length, 2, 'devono restare esattamente 2 occorrenze (nessuna persa, nessuna duplicata)');
  const trovataA = occorrenze.find(e => e.tema === 'senso-a');
  const trovataB = occorrenze.find(e => e.tema === 'senso-b');
  assert.equal(trovataA?.en, 'meaning-a-corretto', 'il senso modificato deve riflettere la modifica');
  assert.equal(trovataB?.en, 'meaning-b', 'il senso NON modificato deve restare quello originale del default');
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
