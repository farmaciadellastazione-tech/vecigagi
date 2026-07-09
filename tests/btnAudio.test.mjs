// Test strutturale di BtnAudio (fix R6, audit 2026-07-08 in ANALISI.md).
// Bug: ogni istanza fa `window.speechSynthesis.onvoiceschanged = check` (assegnazione
// diretta, senza cleanup). Con più bottoni audio montati sulla stessa pagina (comune:
// ogni carta del quiz ne monta diversi) solo l'ultimo registrato riceve gli
// aggiornamenti delle voci, e le istanze smontate lasciano una closure stantia che
// continua a girare (chiama setAudioOk su un componente non più montato).
// Il progetto non ha jsdom/React come dipendenza npm (React è solo CDN nel browser),
// quindi non è possibile montare davvero il componente: verifichiamo staticamente,
// sul sorgente reale, che l'effetto usi addEventListener/removeEventListener con
// cleanup invece dell'assegnazione diretta — stesso approccio "no X nel sorgente"
// già usato in tests/recovery.test.mjs per localStorage.clear().
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` saltando stringhe ('/"/`), commenti riga (//) e
// commenti blocco (/* */) — necessario perché i commenti in italiano contengono
// spesso apostrofi (es. "l'utente") che un tokenizer senza supporto commenti
// scambia per apertura di stringa, sballando il bilanciamento su lunghe distanze
// (bug osservato in tests/callAI.test.mjs). `tracked` è l'insieme di caratteri
// apertura/chiusura da bilanciare insieme (qui `(`/`{`/`[` per i parametri
// destrutturati, che possono contenere graffe/parentesi quadre annidate).
function scansionaBilanciato(src, start, tracked) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false;
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
    if (tracked.apre.includes(c)) depth++;
    else if (tracked.chiude.includes(c)) { depth--; if (depth === 0) { i++; break; } }
  }
  return i;
}
// Estrae il sorgente di una funzione per nome (brace-matching sul CORPO, non sui
// parametri): a differenza di cleanup.test.mjs/recovery.test.mjs, i componenti React
// di questo file usano parametri destrutturati — `function BtnAudio({ testo, ... })`
// — che contengono già una coppia di graffe prima del corpo. Cercare "il primo {"
// come fanno gli altri file troncherebbe l'estrazione a quella graffa dei parametri.
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

const btnAudioSrc = extractFn(INDEX, 'BtnAudio');

test('BtnAudio: nessuna assegnazione diretta a onvoiceschanged (sovrascrive le altre istanze)', () => {
  assert.ok(
    !btnAudioSrc.includes('.onvoiceschanged ='),
    'trovata assegnazione diretta a onvoiceschanged: con più BtnAudio montati solo l\'ultimo riceve gli aggiornamenti'
  );
});

test('BtnAudio: registra "voiceschanged" con addEventListener', () => {
  assert.ok(
    /addEventListener\(\s*["']voiceschanged["']/.test(btnAudioSrc),
    'atteso addEventListener("voiceschanged", ...) nell\'useEffect di rilevamento audio'
  );
});

test('BtnAudio: l\'useEffect di rilevamento audio pulisce il listener allo smontaggio', () => {
  // Isola l'useEffect che gestisce noAudio/bcp47/speechSynthesis (quello del bug),
  // non un eventuale altro useEffect nello stesso componente.
  const m = btnAudioSrc.match(/React\.useEffect\(\(\)\s*=>\s*\{[\s\S]*?noAudio[\s\S]*?\}, \[bcp47, noAudio\]\)/);
  assert.ok(m, 'non trovato l\'useEffect [bcp47, noAudio] di rilevamento audio');
  const effettoSrc = m[0];
  assert.ok(
    /return\s*\(\)\s*=>[\s\S]{0,120}removeEventListener\(\s*["']voiceschanged["']/.test(effettoSrc),
    'l\'useEffect deve restituire una funzione di cleanup che fa removeEventListener("voiceschanged", ...)'
  );
});
