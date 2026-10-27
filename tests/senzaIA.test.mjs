// Senza IA (richiesta di Dino, 2026-10-27): chi usa l'app spesso non ha una
// chiave IA. Ogni funzione con l'IA deve dirlo con un avviso e un pulsante
// "Configura IA", non partire a vuoto né mostrare errori HTTP.
// Passo 1: iaConfigurata (un solo controllo per tutti) e protezione di
// riserva in callAI: senza chiave nessuna chiamata, messaggio comprensibile.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
// a capo uniformati: con core.autocrlf la copia locale ha CRLF
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const chiamate = [];
const ctx = vm.createContext({
  fetch: async (url) => { chiamate.push(url); return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }) }; },
  AI_MAX_TOKENS: 1000,
});
ctx.globalThis = ctx;
vm.runInContext([
  tra('const GROQ_MODELS = {', '\n};') + '\n};',
  tra('function messaggioErroreHttpAI(', '\n}') + '\n}',
  tra('// ── Senza IA', '\nasync function callAI('),
  tra('async function callAI(', '\n}\n') + '\n}',
  'Object.assign(globalThis, { callAI, iaConfigurata, MSG_SENZA_IA });',
].join('\n'), ctx);

test('iaConfigurata: serve una chiave vera (più di 10 caratteri, spazi esclusi)', () => {
  assert.equal(ctx.iaConfigurata({ provider: 'gemini', apiKey: 'AIzaSyA-chiave-lunga' }), true);
  assert.equal(ctx.iaConfigurata({ provider: 'gemini', apiKey: '' }), false);
  assert.equal(ctx.iaConfigurata({ apiKey: '           ' }), false);
  assert.equal(ctx.iaConfigurata({ apiKey: 'corta' }), false);
  assert.equal(ctx.iaConfigurata(null), false);
  assert.equal(ctx.iaConfigurata(undefined), false);
});

test('callAI senza chiave: nessuna chiamata, messaggio comprensibile', async () => {
  chiamate.length = 0;
  const r = await ctx.callAI('sys', 'user', { provider: 'gemini', apiKey: '' });
  assert.equal(chiamate.length, 0);
  assert.equal(r, ctx.MSG_SENZA_IA);
  assert.match(r, /^Errore/); // gli estrattori la riconoscono come errore (messaggioErroreAiuto)
  assert.match(r, /chiave IA/);
  assert.match(r, /gratuit/);
  assert.equal(await ctx.callAI('s', 'u', undefined), ctx.MSG_SENZA_IA);
  assert.equal(chiamate.length, 0);
});

test('callAI con la chiave: la chiamata parte come prima', async () => {
  chiamate.length = 0;
  const r = await ctx.callAI('sys', 'user', { provider: 'gemini', apiKey: 'AIzaSyA-chiave-lunga' });
  assert.equal(chiamate.length, 1);
  assert.equal(r, 'ok');
});

test('i controlli sparsi della chiave usano iaConfigurata', () => {
  assert.equal(HTML.split('(aiSettings?.apiKey || "").length > 10').length - 1, 0);
});
