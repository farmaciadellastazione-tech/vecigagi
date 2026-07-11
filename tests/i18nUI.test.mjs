// Controllo automatico i18n della UI (ANALISI.md #9, 2026-07-11).
// L'oggetto UI di index.html ha 10 lingue; il fallback runtime
// `UI[_l] = { ...UI.en, ...UI[_l] }` evita gli `undefined` ma NON segnala
// una traduzione dimenticata: la UI mostra silenziosamente l'inglese (o, se
// la chiave manca anche in en, undefined). Questi test estraggono l'oggetto
// UI REALE dal sorgente e verificano:
//   1. ogni lingua ha esattamente le stesse chiavi di `it` (parità completa,
//      stato attuale: 128 chiavi ovunque — se aggiungi una chiave, aggiungila
//      in tutte le lingue o il test te lo ricorda elencando le mancanti);
//   2. nessun valore vuoto (chiave presente ma stringa vuota = buco silente);
//   3. le tre liste di lingue (chiavi di UI, UI_LINGUE, `supported` in
//      detectUILang) coincidono — sono scritte a mano in tre punti diversi;
//   4. gli accessi diretti `UI[getUILang()].chiave` nel codice puntano a
//      chiavi esistenti in en (la base del fallback).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` bilanciando `apre`/`chiude`, saltando stringhe
// ('/"/`), commenti riga (//) e commenti blocco (/* */). Stessa versione
// comment-aware di tests/recovery.test.mjs (gli apostrofi nei commenti in
// italiano sballano i tokenizer che non riconoscono i commenti).
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

// — estrae e valuta una const oggetto/array per nome, PRIMA del merge di fallback —
function extractEval(name, delimA, delimB) {
  const sig = 'const ' + name + ' = ' + delimA;
  const at = INDEX.indexOf(sig);
  assert.ok(at >= 0, `dichiarazione non trovata: const ${name} = ${delimA}`);
  const open = INDEX.indexOf(delimA, at);
  const end = scansionaBilanciato(INDEX, open, delimA, delimB);
  return vm.runInNewContext(INDEX.slice(at, end) + '; ' + name);
}

const UI = extractEval('UI', '{', '}');
const UI_LINGUE = extractEval('UI_LINGUE', '[', ']');

const LINGUE = Object.keys(UI);
// `|| {}`: se l'estrazione di it fallisse, meglio il messaggio chiaro del
// primo test che un TypeError all'import del modulo.
const CHIAVI_IT = Object.keys(UI.it || {});

test('UI: l\'estrazione è sana (10 lingue, it presente e non banale)', () => {
  assert.ok(UI.it && UI.en, 'UI deve avere it e en');
  assert.ok(LINGUE.length >= 10, `attese >= 10 lingue, trovate ${LINGUE.length}`);
  assert.ok(CHIAVI_IT.length >= 100, `attese >= 100 chiavi in it, trovate ${CHIAVI_IT.length} (estrazione rotta?)`);
});

test('UI: ogni lingua ha esattamente le stesse chiavi di it', () => {
  const setIt = new Set(CHIAVI_IT);
  for (const lang of LINGUE) {
    if (lang === 'it') continue;
    const chiavi = Object.keys(UI[lang]);
    const mancanti = CHIAVI_IT.filter(k => !(k in UI[lang]));
    const orfane = chiavi.filter(k => !setIt.has(k));
    assert.deepStrictEqual(mancanti, [],
      `${lang}: chiavi mancanti rispetto a it (la UI mostrerebbe l'inglese del fallback): ${mancanti.join(', ')}`);
    assert.deepStrictEqual(orfane, [],
      `${lang}: chiavi orfane assenti in it (refuso o chiave rinominata a metà? la traduzione non verrebbe mai usata): ${orfane.join(', ')}`);
  }
});

test('UI: nessun valore vuoto o non-stringa (buchi silenti nella UI)', () => {
  const vuoti = [];
  for (const lang of LINGUE) {
    for (const [k, v] of Object.entries(UI[lang])) {
      if (typeof v !== 'string' || v.trim() === '') vuoti.push(`${lang}.${k}`);
    }
  }
  assert.deepStrictEqual(vuoti, [], `valori vuoti/non-stringa: ${vuoti.join(', ')}`);
});

test('UI: le tre liste di lingue (UI, UI_LINGUE, supported) coincidono', () => {
  const daUI = [...LINGUE].sort();
  // Array.from: UI_LINGUE viene dal realm del vm e il suo .map() creerebbe un
  // array con prototipo estraneo, che deepStrictEqual rifiuta pur a contenuto uguale.
  const daLingue = Array.from(UI_LINGUE, l => l.codice).sort();
  assert.deepStrictEqual(daLingue, daUI,
    'UI_LINGUE (selettore lingua) non coincide con le lingue di UI');
  const mSupported = INDEX.match(/const supported = \[([^\]]+)\]/);
  assert.ok(mSupported, 'lista `supported` non trovata in detectUILang');
  const daSupported = mSupported[1].match(/"(\w+)"/g).map(s => s.replace(/"/g, '')).sort();
  assert.deepStrictEqual(daSupported, daUI,
    '`supported` (detectUILang) non coincide con le lingue di UI');
});

test('UI: ogni accesso diretto UI[getUILang()].chiave esiste in en', () => {
  const usi = new Set();
  for (const m of INDEX.matchAll(/UI\[getUILang\(\)\]\.([A-Za-z_$][\w$]*)/g)) usi.add(m[1]);
  assert.ok(usi.size >= 5, `attesi >= 5 accessi diretti, trovati ${usi.size} (pattern cambiato?)`);
  const rotti = [...usi].filter(k => !(k in UI.en));
  assert.deepStrictEqual(rotti, [],
    `accessi a chiavi inesistenti in en (mostrerebbero undefined): ${rotti.join(', ')}`);
});
