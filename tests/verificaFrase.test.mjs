// Test del fix per il feedback IA di "Frase libera" che mostra JSON grezzo
// quando la risposta arriva troncata (stessa classe di bug di
// tests/spiegaParola.test.mjs, stessa causa: callAI ha max_tokens fisso a 300).
//
// A differenza di spiegaParola (un solo campo "spiegazione"), verificaFrase
// attende 4 campi: {"correct": boolean, "correction": string, "grammar":
// string, "example": string}. Se la risposta viene tagliata, il vecchio
// codice ricadeva su `clean.slice(0, 200)` nel campo "grammar" — mostrando il
// JSON grezzo (compreso il "{"correct":true,..." iniziale) nella UI.
//
// Fix: estraiFeedbackFrase prova prima il parse JSON completo (comportamento
// invariato quando la risposta non è troncata), poi recupera ogni campo
// singolarmente con un'estrazione tollerante (funziona anche a JSON
// troncato/malformato), e solo se NESSUN campo è recuperabile ricade sul
// vecchio comportamento.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Scansiona `src` da `start` bilanciando `apre`/`chiude`, saltando stringhe,
// commenti (// e /* */) e letterali regex (che possono contenere '"'/"'"
// letterali, es. /"correct"\s*:.../ — vedi tests/spiegaParola.test.mjs).
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
  vm.runInContext(extractFn(INDEX, 'estraiCampoStringaJSON'), ctx);
  vm.runInContext(extractFn(INDEX, 'estraiCampoBoolean'), ctx);
  vm.runInContext(extractFn(INDEX, 'estraiFeedbackFrase'), ctx);
  return vm.runInContext(code, ctx);
}

test('JSON completo e valido: tutti i campi (comportamento invariato)', () => {
  const testo = '{"correct":true,"correction":"","grammar":"Presente indicativo corretto.","example":"La mia casa è grande."}';
  const r = run('estraiFeedbackFrase(' + JSON.stringify(testo) + ')');
  assert.equal(r.correct, true);
  assert.equal(r.correction, '');
  assert.equal(r.grammar, 'Presente indicativo corretto.');
  assert.equal(r.example, 'La mia casa è grande.');
});

test('JSON troncato a metà del campo "grammar": recupera i campi disponibili, non il JSON grezzo', () => {
  const testo = '{"correct":false,"correction":"Io vado a casa.","grammar":"Manca la preposizione';
  const r = run('estraiFeedbackFrase(' + JSON.stringify(testo) + ')');
  assert.equal(r.correct, false);
  assert.equal(r.correction, 'Io vado a casa.');
  assert.equal(r.grammar, 'Manca la preposizione');
  assert.ok(!r.grammar.includes('{"correct"'), 'grammar non deve contenere il JSON grezzo');
});

test('JSON troncato subito dopo "correct" (nessun altro campo disponibile)', () => {
  const testo = '{"correct":true,"correc';
  const r = run('estraiFeedbackFrase(' + JSON.stringify(testo) + ')');
  assert.equal(r.correct, true);
  assert.equal(r.correction, '');
  assert.equal(r.grammar, '');
});

test('Gestisce le sequenze di escape nel campo troncato', () => {
  const testo = '{"correct":false,"correction":"","grammar":"Manca l\'accento su \\"perché\\"';
  const r = run('estraiFeedbackFrase(' + JSON.stringify(testo) + ')');
  assert.equal(r.grammar, 'Manca l\'accento su "perché"');
});

test('Testo senza alcuna struttura JSON attesa: fallback al vecchio comportamento (grammar = testo grezzo)', () => {
  const testo = 'Risposta libera dell\'AI che ha ignorato il formato JSON richiesto.';
  const r = run('estraiFeedbackFrase(' + JSON.stringify(testo) + ')');
  assert.equal(r.correct, null);
  assert.equal(r.correction, '');
  assert.equal(r.grammar, testo);
  assert.equal(r.example, '');
});

test('Stringa vuota non lancia', () => {
  const r = run('estraiFeedbackFrase("")');
  assert.equal(r.correct, null);
  assert.equal(r.grammar, '');
});

test('verificaFrase usa estraiFeedbackFrase invece del vecchio fallback clean.slice diretto', () => {
  const src = extractFn(INDEX, 'verificaFrase');
  assert.ok(src.includes('estraiFeedbackFrase('), 'verificaFrase deve usare estraiFeedbackFrase per evitare di mostrare JSON grezzo');
});
