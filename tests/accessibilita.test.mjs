// Test strutturale del fix #8 (ANALISI.md, analisi di maggio 2026): diversi
// gruppi di bottoni "a scelta" (lingue, livelli, temi, numero domande,
// ON/OFF) veicolano lo stato selezionato SOLO col colore (className
// ternario), senza alcun aria-pressed — uno screen reader non ha modo di
// sapere quale opzione sia attualmente selezionata. Il microfono e il
// bottone "rimuovi lingua" non hanno alcuna etichetta accessibile (solo
// un'emoji come contenuto).
// Il progetto non ha jsdom/React come dipendenza npm (React è solo CDN nel
// browser), quindi verifica strutturale sul sorgente reale, come già fatto
// per BtnAudio (R6) e lo streak (R5).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` saltando stringhe, commenti (// e /* */) e
// letterali regex — vedi tests/spiegaParola.test.mjs per il perché.
function scansionaBilanciato(src, start, tracked) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, prevSignificant = '';
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
    if (tracked.apre.includes(c)) depth++;
    else if (tracked.chiude.includes(c)) { depth--; if (depth === 0) { i++; break; } }
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
  const j = scansionaBilanciato(src, parenOpen, { apre: '({[', chiude: ')}]' });
  const bodyStart = src.indexOf('{', j);
  const i = scansionaBilanciato(src, bodyStart, { apre: '{', chiude: '}' });
  return src.slice(at, i);
}

function contaOccorrenze(src, sub) {
  return src.split(sub).length - 1;
}

test('PannelloFiltri: i bottoni livello e tema hanno aria-pressed', () => {
  const src = extractFn(INDEX, 'PannelloFiltri');
  assert.ok(contaOccorrenze(src, 'aria-pressed') >= 2, 'attesi almeno 2 aria-pressed (livello + tema)');
});

test('PannelloLingue: il toggle ON/OFF ha aria-pressed, il bottone rimuovi ha aria-label', () => {
  const src = extractFn(INDEX, 'PannelloLingue');
  assert.ok(src.includes('aria-pressed'), 'manca aria-pressed sul toggle ON/OFF');
  assert.ok(/toggleAttiva[\s\S]{0,200}aria-pressed/.test(src), 'aria-pressed deve essere vicino al toggle ON/OFF');
  assert.ok(/rimuovi\(l\.codice\)[\s\S]{0,200}aria-label/.test(src), 'manca aria-label sul bottone rimuovi (oggi solo emoji 🗑, nessun testo accessibile)');
});

test('PannelloBilingue: la scelta della lingua B ha aria-pressed', () => {
  const src = extractFn(INDEX, 'PannelloBilingue');
  assert.ok(src.includes('aria-pressed'), 'manca aria-pressed sulla selezione lingua B');
});

test('ConfigurazioneQuiz: i bottoni lingua-da/lingua-a/numero-domande hanno aria-pressed', () => {
  const src = extractFn(INDEX, 'ConfigurazioneQuiz');
  assert.ok(contaOccorrenze(src, 'aria-pressed') >= 5, 'attesi almeno 5 aria-pressed (qualsiasi+lingue x2 gruppi, numero domande)');
});

test('InputVocale: il bottone microfono ha aria-label che riflette lo stato', () => {
  const src = extractFn(INDEX, 'InputVocale');
  assert.ok(/onClick: avviaAscolto[\s\S]{0,300}aria-label/.test(src), 'manca aria-label sul bottone microfono');
});
