// Test del fix per la spiegazione IA che mostra JSON grezzo quando la risposta
// arriva troncata (bug osservato dal vivo: screenshot Drive 2026-07-08, sia su
// una storia in spezzino che una in tedesco — in entrambe compariva testo tipo
// `{"spiegazione": "«Propio» è la variante spezzina di` invece della
// spiegazione vera e propria).
//
// Causa: callAI ha max_tokens fisso (300); se la risposta dell'AI viene
// tagliata prima della "}" di chiusura, il regex /\{[\s\S]*\}/ non trova match,
// JSON.parse non viene nemmeno tentato, e il vecchio codice ricadeva su
// `clean.slice(0, 300)` — mostrando il JSON grezzo (compreso il
// `{"spiegazione":` iniziale) come se fosse la spiegazione.
//
// Fix: estraiSpiegazioneDaTesto prova prima il parse JSON completo (comportamento
// invariato quando la risposta non è troncata), poi un'estrazione tollerante del
// solo valore di "spiegazione" anche da JSON troncato/malformato, e SOLO se il
// testo non assomiglia per niente al JSON atteso ricade sul vecchio
// comportamento (mostra il testo grezzo — utile se l'AI ha risposto in prosa
// libera ignorando il formato richiesto).
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
// ('/"/`), commenti riga (//) e commenti blocco (/* */) — vedi
// tests/callAI.test.mjs per il perché (apostrofi nei commenti italiani).
// NB: riconosce anche i letterali regex (es. /"spiegazione"\s*:.../ ) come
// blocco opaco — altrimenti i caratteri '"'/"'" AL LORO INTERNO (frequenti in
// regex che cercano chiavi JSON) vengono scambiati per apertura di stringa,
// desincronizzando il conteggio graffe su tutto il resto del file (variante
// dello stesso problema degli apostrofi nei commenti, vedi callAI.test.mjs).
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

function run(code) {
  const ctx = vm.createContext({ console });
  vm.runInContext(extractFn(INDEX, 'estraiSpiegazioneDaTesto'), ctx);
  return vm.runInContext(code, ctx);
}

test('JSON completo e valido: estrae spiegazione e traduzione (comportamento invariato)', () => {
  const testo = '{"spiegazione": "Propio significa davvero.", "traduzione": "davvero"}';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, 'Propio significa davvero.');
  assert.equal(r.traduzione, 'davvero');
});

test('JSON troncato SENZA graffa di chiusura (caso esatto dello screenshot): estrae il testo parziale, non il JSON grezzo', () => {
  const testo = '{"spiegazione": "«Propio» è la variante spezzina di';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, '«Propio» è la variante spezzina di');
  assert.ok(!r.spiegazione.includes('{"spiegazione"'), 'non deve contenere il JSON grezzo');
  assert.equal(r.traduzione, null);
});

test('JSON troncato, altro caso reale dagli screenshot ("ging è la forma")', () => {
  const testo = '{"spiegazione": "Ging è la forma';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, 'Ging è la forma');
});

test('JSON con "spiegazione" chiusa ma senza graffa finale: estrae comunque il testo completo', () => {
  const testo = '{"spiegazione": "Testo completo e chiuso correttamente."';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, 'Testo completo e chiuso correttamente.');
});

test('Gestisce le sequenze di escape comuni (\\n, \\", \\\\) nel testo troncato', () => {
  const testo = '{"spiegazione": "Riga uno\\nRiga due con \\"virgolette\\" e backslash \\\\';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, 'Riga uno\nRiga due con "virgolette" e backslash \\');
});

test('Testo senza alcuna struttura JSON attesa: fallback al testo grezzo (comportamento invariato)', () => {
  const testo = 'Risposta libera dell\'AI che ha ignorato il formato JSON richiesto.';
  const r = run('estraiSpiegazioneDaTesto(' + JSON.stringify(testo) + ')');
  assert.equal(r.spiegazione, testo);
  assert.equal(r.traduzione, null);
});

test('Stringa vuota non lancia', () => {
  const r = run('estraiSpiegazioneDaTesto("")');
  assert.equal(r.spiegazione, '');
});

test('spiegaParola usa estraiSpiegazioneDaTesto invece del vecchio fallback clean.slice diretto', () => {
  const src = extractFn(INDEX, 'spiegaParola');
  assert.ok(src.includes('estraiSpiegazioneDaTesto('), 'spiegaParola deve usare estraiSpiegazioneDaTesto per evitare di mostrare JSON grezzo');
});
