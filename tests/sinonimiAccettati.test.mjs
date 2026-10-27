// "🤖 Era giusta?" (richiesta di Dino, 2026-10-27), passo 1: l'app segnava
// errore per sinonimi assenti dal vocabolario. Un sinonimo accettato dall'IA
// resta in questo browser e la volta dopo vale subito, senza IA. Chiave =
// lingua + risposta attesa normalizzata (non wordKey: voci con lo stesso
// italiano la condividono, bug noto dei doppioni).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
let memoria = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); },
    removeItem: k => { delete memoria[k]; },
  },
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx); // normalizza
vm.runInContext([
  tra('// ── Sinonimi accettati', '\n// ── Archivio frasi da ripassare'),
  'Object.assign(globalThis, { caricaSinonimi, salvaSinonimo, sinonimoAccettato, MAX_SINONIMI_PER_VOCE });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const azzera = () => { memoria = {}; };

test('un sinonimo salvato vale per la stessa risposta attesa nella stessa lingua', () => {
  azzera();
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'pretty'), false);
  assert.equal(ctx.salvaSinonimo('en', 'beautiful', 'pretty'), true);
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'pretty'), true);
  assert.equal(ctx.sinonimoAccettato('en', 'Beautiful!', ' Pretty '), true); // normalizza
  assert.equal(ctx.sinonimoAccettato('fr', 'beautiful', 'pretty'), false);  // altra lingua
  assert.equal(ctx.sinonimoAccettato('en', 'nice', 'pretty'), false);       // altra parola
});

test('niente doppioni, niente vuoti, niente sinonimo uguale all\'atteso', () => {
  azzera();
  ctx.salvaSinonimo('en', 'beautiful', 'pretty');
  ctx.salvaSinonimo('en', 'beautiful', 'Pretty.');
  assert.equal(ctx.salvaSinonimo('en', 'beautiful', '   '), false);
  assert.equal(ctx.salvaSinonimo('', 'beautiful', 'pretty'), false);
  assert.equal(ctx.salvaSinonimo('en', 'beautiful', 'Beautiful'), false);
  assert.deepEqual(Object.values(j(ctx.caricaSinonimi())).map(l => l.length), [1]);
});

test('per ogni voce si tengono gli ultimi sinonimi', () => {
  azzera();
  for (let i = 0; i < ctx.MAX_SINONIMI_PER_VOCE + 3; i++) ctx.salvaSinonimo('en', 'beautiful', 'sin' + i);
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'sin0'), false);
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'sin' + (ctx.MAX_SINONIMI_PER_VOCE + 2)), true);
});

test('archivio rovinato o localStorage bloccato: nessun errore, nessun sinonimo', () => {
  azzera();
  memoria.qml_v1_sinonimi_accettati = '{rotto';
  assert.deepEqual(j(ctx.caricaSinonimi()), {});
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'pretty'), false);
  memoria.qml_v1_sinonimi_accettati = '[1,2]';
  assert.deepEqual(j(ctx.caricaSinonimi()), {});
  const vero = ctx.localStorage.getItem;
  ctx.localStorage.getItem = () => { throw new Error('bloccato'); };
  assert.equal(ctx.sinonimoAccettato('en', 'beautiful', 'pretty'), false);
  ctx.localStorage.getItem = vero;
});

test('verificaRisposta accetta i sinonimi salvati, ma non nelle coniugazioni', () => {
  const V = tra('function verificaRisposta(', '\n  function salta(');
  assert.match(V, /if \(!ok && carta\.tipo !== "coniugazione" && sinonimoAccettato\(lA\?\.codice, atteso, risposta\)\) ok = true;/);
  // prima della "lingua sbagliata" e dell'aiutino: un sinonimo accettato è giusto e basta
  assert.ok(V.indexOf('sinonimoAccettato(') < V.indexOf('linguaDellaRisposta('));
});
