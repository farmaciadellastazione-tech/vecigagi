// dialetti.html, "Invia contributi": conta come inviato solo se lo script
// risponde {"status":"ok"} (richiesta di Dino, 2026-10-15). Prima ogni
// risposta, anche una pagina d'errore di Google, valeva come successo: lo
// script di index.html è rimasto rotto per mesi senza che nessuno lo notasse.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };

function conFetch(fetch) {
  const ctx = vm.createContext({ fetch, AbortController, setTimeout, clearTimeout, console: { warn() {} } });
  vm.runInContext(tra('async function inviaRigaFoglio(', '\n// ── fine invio foglio') + '\nglobalThis.f = inviaRigaFoglio;', ctx);
  return ctx.f;
}

test('riuscito solo con {"status":"ok"}', async () => {
  assert.strictEqual(await conFetch(async () => ({ json: async () => ({ status: 'ok' }) }))('u'), true);
  assert.strictEqual(await conFetch(async () => ({ json: async () => ({ status: 'error' }) }))('u'), false);
  assert.strictEqual(await conFetch(async () => ({ json: async () => { throw new SyntaxError('html'); } }))('u'), false);
  assert.strictEqual(await conFetch(async () => { throw new TypeError('rete'); })('u'), false);
});

test('tutti gli invii (parole, parole nuove, audio) passano dal controllo', () => {
  assert.doesNotMatch(HTML, /await fetch\(SCRIPT_URL/);
  assert.strictEqual((HTML.match(/inviaRigaFoglio\(SCRIPT_URL/g) || []).length, 3);
});
