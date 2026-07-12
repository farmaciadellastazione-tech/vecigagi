// Test di Scelta multipla: ripetizione delle sbagliate + riepilogo errori.
//
// Requisito (Dino, 2026-07-12): come negli altri esercizi (Allenamento, ecc.),
// le carte sbagliate devono tornare in coda finché non si indovinano, e il
// quadro finale deve riassumere gli errori ("Da rivedere") con la risposta
// corretta. Il punteggio/percentuale conta solo le corrette AL PRIMO COLPO
// (altrimenti la progressione 100% → +5 domande scatterebbe anche sbagliando).
//
// Verifica strutturale sul sorgente reale (il progetto non ha jsdom/React come
// dipendenza npm: il comportamento end-to-end è coperto dalla verifica live
// Playwright, vedi ANALISI.md).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Tokenizer bilanciato comment-aware e regex-aware (vedi tests/spiegaParola.test.mjs).
function scansionaBilanciato(src, start, apre, chiude) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, started = false, prevSignificant = '';
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
    if (c === '/' && !/[A-Za-z0-9_$)\]]/.test(prevSignificant)) {
      let j = i + 1, inClass = false, rEsc = false;
      for (; j < src.length; j++) {
        const rc = src[j];
        if (rEsc) { rEsc = false; continue; }
        if (rc === '\\') { rEsc = true; continue; }
        if (rc === '[') { inClass = true; continue; }
        if (rc === ']') { inClass = false; continue; }
        if (rc === '/' && !inClass) { j++; break; }
        if (rc === '\n') break;
      }
      while (j < src.length && /[a-z]/i.test(src[j])) j++;
      i = j - 1;
      prevSignificant = '/';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === apre) { depth++; started = true; }
    else if (c === chiude) { depth--; if (started && depth === 0) { i++; break; } }
    if (!/\s/.test(c)) prevSignificant = c;
  }
  return i;
}
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  let at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, i);
}

const SM = extractFn(INDEX, 'SchermataSceltaMultipla');

test('scegli(): la carta sbagliata torna in coda (_rimessa, come Allenamento)', () => {
  assert.ok(SM.includes('_rimessa: true'), 'sulla risposta sbagliata la carta deve essere rimessa in coda');
});

test('scegli(): il punteggio conta solo le corrette al primo colpo', () => {
  assert.ok(/errateKeys\[/.test(SM), 'serve la mappa delle carte già sbagliate');
  assert.ok(/if \(!errateKeys\[key\]\) setPunteggio/.test(SM),
    'una carta già sbagliata, indovinata alla ripetizione, non deve aumentare il punteggio');
});

test('percentuale e progressione calcolate sulle domande BASE, non sulle ripetizioni', () => {
  assert.ok(/nDomBase/.test(SM), 'serve il conteggio delle carte base (senza _rimessa)');
  assert.ok(!/punteggio \/ carte\.length/.test(SM),
    'la percentuale non deve più dividere per carte.length (che cresce con le ripetizioni)');
});

test('quadro finale: riepilogo "Da rivedere" con la risposta corretta', () => {
  assert.ok(/carteErrate/.test(SM), 'serve lo stato con le carte sbagliate della sessione');
  assert.ok(/Da rivedere/.test(SM), 'il quadro finale deve mostrare il riquadro degli errori');
  assert.ok(/hai scelto/.test(SM), 'per ogni errore va mostrata anche la scelta sbagliata');
});

test('generaCarte() azzera errori e riepilogo (nuova sessione pulita)', () => {
  const gen = SM.slice(SM.indexOf('function generaCarte'), SM.indexOf('// Mount-only'));
  assert.ok(/setCarteErrate\(\[\]\)/.test(gen), 'generaCarte deve azzerare il riepilogo errori');
  assert.ok(/setErrateKeys\(\{\}\)/.test(gen), 'generaCarte deve azzerare la mappa errori');
});
