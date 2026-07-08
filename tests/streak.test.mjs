// Test dello streak esteso a Scelta multipla e Lettura guidata (fix R5, audit
// 2026-07-08 in ANALISI.md). Prima del fix, `aggiornaStreak()` era una funzione
// LOCALE definita dentro `avanti()`, quindi utilizzabile solo dal flusso
// SchermataQuiz (Quiz/Allenamento/Ascolto/Voce/Dettato/Non-stop). Chi giocava
// solo a Scelta multipla (Lv0, la prima modalità che si sblocca) o a Lettura
// guidata non vedeva mai crescere lo streak né sbloccava i badge relativi.
//
// Due parti:
// 1. Comportamentale: la logica di calcolo dello streak (pura, indipendente da
//    React) estratta ed eseguita via vm — verifica che spostarla a livello di
//    App non ne abbia alterato la semantica (ieri→incrementa, oggi→invariato,
//    streak spezzato→riparte da 1).
// 2. Strutturale sul sorgente reale (il progetto non ha jsdom/React come
//    dipendenza npm, quindi non è possibile montare i componenti in test):
//    verifica che `aggiornaStreak` sia definita una sola volta a livello di
//    App (non più annidata dentro avanti) e che entrambi i componenti la
//    ricevano come prop e la richiamino.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` bilanciando i caratteri indicati in `apre`/`chiude`
// (stesso carattere per depth++/depth--), saltando stringhe ('/"/`), commenti
// riga (//) e commenti blocco (/* */). NECESSARIO per `App()` e i componenti
// grandi di questo file: i commenti in italiano contengono apostrofi
// (es. "l'ordine", "l'utente") che un tokenizer senza supporto commenti
// scambia per apertura di stringa, sballando il bilanciamento graffe/parentesi
// su distanze lunghe (bug scoperto proprio estraendo App()).
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
  let at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const bodyEnd = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, bodyEnd);
}

// ── 1. Comportamentale: aggiornaStreak deve esistere FUORI da avanti() ──────
// (se non è ancora stata estratta, extractFn la trova comunque annidata dentro
// avanti — il primo blocco di asserzioni strutturali lo verifica esplicitamente;
// qui verifichiamo solo che, ovunque sia, la sua LOGICA di calcolo sia corretta).

function estraiCorpoAggiornaStreak(src) {
  const appSrc = extractFn(src, 'App');
  const m = appSrc.match(/function aggiornaStreak\(\)\s*\{[\s\S]*?\n  \}/);
  if (!m) throw new Error('aggiornaStreak non trovata dentro App()');
  return m[0];
}

function makeStreakCtx(oggiFissato, statoIniziale) {
  const store = new Map();
  if (statoIniziale) store.set('qml_v10_streak', JSON.stringify(statoIniziale));
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
  };
  let ultimoStreakSettato = null;
  const sandbox = {
    localStorage,
    console,
    SK_STREAK: 'qml_v10_streak',
    oggi: () => oggiFissato,
    loadJSON: (k, def) => { const s = localStorage.getItem(k); return s ? JSON.parse(s) : def; },
    saveJSON: (k, v) => { localStorage.setItem(k, JSON.stringify(v)); return true; },
    setStreak: v => { ultimoStreakSettato = v; },
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(estraiCorpoAggiornaStreak(INDEX), ctx);
  vm.runInContext('aggiornaStreak();', ctx);
  return JSON.parse(store.get('qml_v10_streak'));
}

const UN_GIORNO = 86400000;
const OGGI = 20000 * UN_GIORNO; // data arbitraria, allineata a mezzanotte

test('aggiornaStreak: streak spezzato (ultimo giorno non è ieri) → riparte da 1', () => {
  const r = makeStreakCtx(OGGI, { lastDay: OGGI - 5 * UN_GIORNO, count: 12 });
  assert.deepEqual(r, { lastDay: OGGI, count: 1 });
});

test('aggiornaStreak: ultimo giorno = ieri → incrementa', () => {
  const r = makeStreakCtx(OGGI, { lastDay: OGGI - UN_GIORNO, count: 4 });
  assert.deepEqual(r, { lastDay: OGGI, count: 5 });
});

test('aggiornaStreak: seconda chiamata nello stesso giorno → nessun cambiamento', () => {
  const r = makeStreakCtx(OGGI, { lastDay: OGGI, count: 7 });
  assert.deepEqual(r, { lastDay: OGGI, count: 7 });
});

test('aggiornaStreak: nessuno streak precedente → parte da 1', () => {
  const r = makeStreakCtx(OGGI, null);
  assert.deepEqual(r, { lastDay: OGGI, count: 1 });
});

// ── 2. Strutturale sul sorgente reale ───────────────────────────────────────

test('aggiornaStreak è definita a livello di App, non più annidata dentro avanti()', () => {
  const appSrc = extractFn(INDEX, 'App');
  const avantiSrc = extractFn(appSrc, 'avanti');
  assert.ok(
    !avantiSrc.includes('function aggiornaStreak('),
    'aggiornaStreak deve essere estratta a livello di App: annidata dentro avanti() non è utilizzabile da altri componenti'
  );
  assert.ok(
    appSrc.includes('function aggiornaStreak('),
    'aggiornaStreak deve esistere direttamente dentro App()'
  );
});

test('SchermataSceltaMultipla riceve onStreak come prop dal render in App', () => {
  const appSrc = extractFn(INDEX, 'App');
  const m = appSrc.match(/React\.createElement\(SchermataSceltaMultipla,\s*\{[\s\S]*?\}\)/);
  assert.ok(m, 'chiamata a SchermataSceltaMultipla non trovata in App');
  assert.ok(/onStreak\s*:/.test(m[0]), 'manca la prop onStreak nella chiamata a SchermataSceltaMultipla');
});

test('SchermataLetturaGuidata riceve onStreak come prop dal render in App', () => {
  const appSrc = extractFn(INDEX, 'App');
  const m = appSrc.match(/React\.createElement\(SchermataLetturaGuidata,\s*\{[\s\S]*?\}\)/);
  assert.ok(m, 'chiamata a SchermataLetturaGuidata non trovata in App');
  assert.ok(/onStreak\s*:/.test(m[0]), 'manca la prop onStreak nella chiamata a SchermataLetturaGuidata');
});

test('SchermataSceltaMultipla chiama onStreak() a fine sessione (almeno 1 corretta)', () => {
  const src = extractFn(INDEX, 'SchermataSceltaMultipla');
  assert.ok(src.includes('onStreak'), 'onStreak non referenziata dentro SchermataSceltaMultipla');
  assert.ok(/onStreak\(\)/.test(src), 'atteso un richiamo onStreak()');
});

test('SchermataLetturaGuidata chiama onStreak() alla prima interazione con una frase', () => {
  const src = extractFn(INDEX, 'SchermataLetturaGuidata');
  assert.ok(src.includes('onStreak'), 'onStreak non referenziata dentro SchermataLetturaGuidata');
  assert.ok(/onStreak\(\)/.test(src), 'atteso un richiamo onStreak()');
});
