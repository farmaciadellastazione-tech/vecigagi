// Test della proposta di correzione via email per le voci del default (fix R3,
// audit 2026-07-08 in ANALISI.md — decisione di prodotto, non bug).
//
// Prima di questo fix, correggere una voce del default (✏️ nel Vocabolario o
// 🚩 "Segnala errore" nel quiz) modificava solo lo stato locale: la correzione
// non arrivava mai a chi cura il vocabolario e spariva al successivo bump di
// VOC_VERSION (o, dopo il fix R4, al successivo reload — vedi
// tests/vocDelta.test.mjs). Scelta del prodotto (2026-07-09): le due vie
// restano diverse.
//   - ✏️ nel Vocabolario: resta SOLO locale (nessuna email) — l'utente può
//     personalizzare una voce per sé senza proporla a tutti.
//   - 🚩 "Segnala errore" nel quiz: invia la correzione via email (stesso
//     meccanismo mailto già usato per "Proponi una storia"), SOLO se la voce
//     modificata esiste nel default (le parole custom dell'utente sono già
//     "sue", non ha senso proporsele da solo).
//
// Due parti:
// 1. Comportamentale: campiModificati (pura) via vm.
// 2. Strutturale sul sorgente reale: proponiCorrezioneParola è chiamata dal
//    percorso "Segnala errore" (segnalando) in App, MAI dal percorso ✏️ del
//    Vocabolario (onModifica/modificaParola).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');
const { wordKey } = createRequire(import.meta.url)('../vocab.js');

// Scansiona `src` da `start` bilanciando `apre`/`chiude`, saltando stringhe
// ('/"/`), commenti riga (//) e commenti blocco (/* */) — vedi
// tests/callAI.test.mjs per il perché (apostrofi nei commenti italiani).
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
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, i);
}

// ── 1. Comportamentale: campiModificati ─────────────────────────────────────

function makeCtx() {
  const sandbox = { console, wordKey };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(extractFn(INDEX, 'campiModificati'), ctx);
  return ctx;
}

test('campiModificati: rileva un campo cambiato, ignora quelli invariati', () => {
  const ctx = makeCtx();
  const vecchia = { it: 'gatto', en: 'cat', sp: 'gato' };
  const nuova = { it: 'gatto', en: 'cat', sp: 'micio' };
  const r = vm.runInContext('campiModificati(' + JSON.stringify(vecchia) + ',' + JSON.stringify(nuova) + ')', ctx);
  assert.deepEqual(Object.keys(r), ['sp']);
  assert.equal(r.sp.da, 'gato');
  assert.equal(r.sp.a, 'micio');
});

test('campiModificati: nessuna differenza → oggetto vuoto', () => {
  const ctx = makeCtx();
  const entry = { it: 'gatto', en: 'cat' };
  const r = vm.runInContext('campiModificati(' + JSON.stringify(entry) + ',' + JSON.stringify(entry) + ')', ctx);
  assert.deepEqual(r, {});
});

test('campiModificati: rileva un campo aggiunto ex-novo (assente in "vecchia")', () => {
  const ctx = makeCtx();
  const vecchia = { it: 'gatto', en: 'cat' };
  const nuova = { it: 'gatto', en: 'cat', fr: 'chat' };
  const r = vm.runInContext('campiModificati(' + JSON.stringify(vecchia) + ',' + JSON.stringify(nuova) + ')', ctx);
  assert.deepEqual(Object.keys(r), ['fr']);
  assert.equal(r.fr.da, '');
  assert.equal(r.fr.a, 'chat');
});

// ── 2. Strutturale sul sorgente reale ───────────────────────────────────────

test('proponiCorrezioneParola: propone SOLO se la voce esiste nel default (non per parole custom dell\'utente)', () => {
  const src = extractFn(INDEX, 'proponiCorrezioneParola');
  assert.ok(
    /VOCABOLARIO_DEFAULT\.(some|find)\(/.test(src),
    'atteso un controllo di appartenenza a VOCABOLARIO_DEFAULT prima di inviare la proposta'
  );
});

test('proponiCorrezioneParola: usa campiModificati e non invia nulla se non ci sono differenze', () => {
  const src = extractFn(INDEX, 'proponiCorrezioneParola');
  assert.ok(src.includes('campiModificati('), 'atteso uso di campiModificati per calcolare il diff');
});

test('App: il percorso "Segnala errore" (segnalando) chiama proponiCorrezioneParola', () => {
  const appSrc = extractFn(INDEX, 'App');
  const m = appSrc.match(/segnalando && cartaCorrente[\s\S]*?onAnnulla: \(\) => setSegnalando\(false\)/);
  assert.ok(m, 'blocco JSX del percorso "Segnala errore" non trovato in App');
  assert.ok(m[0].includes('proponiCorrezioneParola('), 'atteso che il salvataggio da "Segnala errore" chiami proponiCorrezioneParola');
});

test('App: il percorso ✏️ del Vocabolario (onModifica) NON chiama proponiCorrezioneParola (resta locale)', () => {
  const appSrc = extractFn(INDEX, 'App');
  const m = appSrc.match(/if \(schermata === "vocabolario"\)[\s\S]*?\}\);/);
  assert.ok(m, 'render di Vocabolario non trovato in App');
  assert.ok(
    !m[0].includes('proponiCorrezioneParola'),
    'la modifica ✏️ nel Vocabolario deve restare solo locale, senza inviare proposte via email'
  );
});
