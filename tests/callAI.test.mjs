// Test di callAI() (fix R2, audit 2026-07-08 in ANALISI.md).
// Due bug: (1) la chiamata ad Anthropic manca dell'header
// "anthropic-dangerous-direct-browser-access", obbligatorio per CORS da browser —
// senza, la fetch viene bloccata e l'utente vede solo "Errore connessione";
// (2) nessun provider controlla res.ok, quindi un 401/429 diventa il generico
// "Errore risposta AI" invece di un messaggio utile.
// Estrae la funzione REALE dal sorgente ed esegue con fetch mockato.
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
// ('/"/`), commenti riga (//) e commenti blocco (/* */). Necessario: i commenti
// in italiano contengono spesso apostrofi (es. "l'API", "l'utente") che un
// tokenizer senza supporto commenti scambia per apertura di stringa, sballando
// il bilanciamento graffe su lunghe distanze — bug osservato in pratica quando
// una modifica altrove nel file (in un'altra funzione, anche lontana) cambiava
// la parità di apostrofi nei commenti attraversati durante la scansione.
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
  // Include il modificatore "async " se presente subito prima (perso altrimenti:
  // "function callAI(" è una sottostringa di "async function callAI(").
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, i);
}
function extractConst(src, name) {
  const re = new RegExp('^const ' + name + ' = ', 'm');
  const m = re.exec(src);
  if (!m) throw new Error('costante non trovata: ' + name);
  const start = m.index + m[0].length;
  const i = scansionaBilanciato(src, start, '{', '}');
  return src.slice(m.index, i) + ';';
}

// Prepara un sandbox con GROQ_MODELS + callAI reali e fetch mockato.
// Ritorna una funzione run(code) che esegue `code` nel sandbox e restituisce
// la Promise risultante (da await-are fuori, dove i veri async/await vivono).
function makeRunner(fetchImpl) {
  const sandbox = { fetch: fetchImpl, console };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(extractConst(INDEX, 'GROQ_MODELS'), ctx);
  vm.runInContext(extractFn(INDEX, 'messaggioErroreHttpAI'), ctx);
  vm.runInContext(extractFn(INDEX, 'callAI'), ctx);
  return (code) => vm.runInContext(code, ctx);
}

function jsonRes(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

test('Anthropic: invia header anthropic-dangerous-direct-browser-access (richiesto per CORS da browser)', async () => {
  let capturedHeaders = null;
  const run = makeRunner(async (url, opts) => {
    capturedHeaders = opts.headers;
    return jsonRes(200, { content: [{ text: 'ok' }] });
  });
  await run('callAI("sys", "user", { provider: "anthropic", apiKey: "sk-ant-x" })');
  assert.ok(capturedHeaders, 'fetch non chiamata');
  assert.equal(
    capturedHeaders['anthropic-dangerous-direct-browser-access'],
    'true',
    'manca header richiesto per CORS da browser verso api.anthropic.com'
  );
});

test('Anthropic: risposta 200 valida estrae il testo', async () => {
  const run = makeRunner(async () => jsonRes(200, { content: [{ text: 'risposta AI' }] }));
  const r = await run('callAI("sys", "user", { provider: "anthropic", apiKey: "k" })');
  assert.equal(r, 'risposta AI');
});

test('Anthropic: 401 restituisce messaggio con status, non il generico "Errore risposta AI"', async () => {
  const run = makeRunner(async () => jsonRes(401, { error: { message: 'invalid x-api-key' } }));
  const r = await run('callAI("sys", "user", { provider: "anthropic", apiKey: "bad" })');
  assert.ok(r.includes('401'), `atteso status 401 nel messaggio, ricevuto: "${r}"`);
  assert.ok(!r.includes('Errore risposta AI'), 'il messaggio non deve essere il fallback generico su errore HTTP');
});

test('Gemini: 429 (rate limit) restituisce messaggio con status', async () => {
  const run = makeRunner(async () => jsonRes(429, { error: { message: 'quota exceeded' } }));
  const r = await run('callAI("sys", "user", { provider: "gemini", apiKey: "k" })');
  assert.ok(r.includes('429'), `atteso status 429 nel messaggio, ricevuto: "${r}"`);
});

test('Gemini: risposta 200 valida estrae il testo (nessuna regressione)', async () => {
  const run = makeRunner(async () => jsonRes(200, { candidates: [{ content: { parts: [{ text: 'ciao' }] } }] }));
  const r = await run('callAI("sys", "user", { provider: "gemini", apiKey: "k" })');
  assert.equal(r, 'ciao');
});

test('Groq/OpenAI: 401 restituisce messaggio con status', async () => {
  const run = makeRunner(async () => jsonRes(401, { error: { message: 'Invalid API Key' } }));
  const r = await run('callAI("sys", "user", { provider: "groq", apiKey: "bad" })');
  assert.ok(r.includes('401'), `atteso status 401 nel messaggio, ricevuto: "${r}"`);
});

test('Groq/OpenAI: risposta 200 valida estrae il testo (nessuna regressione)', async () => {
  const run = makeRunner(async () => jsonRes(200, { choices: [{ message: { content: 'hello' } }] }));
  const r = await run('callAI("sys", "user", { provider: "openai", apiKey: "k" })');
  assert.equal(r, 'hello');
});

test('Errore di rete (fetch che lancia) resta gestito come prima', async () => {
  const run = makeRunner(async () => { throw new Error('network down'); });
  const r = await run('callAI("sys", "user", { provider: "gemini", apiKey: "k" })');
  assert.ok(r.includes('network down'), `atteso messaggio di errore connessione, ricevuto: "${r}"`);
});
