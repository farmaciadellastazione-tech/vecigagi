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

// Review di 7733f8d: niente doppioni nel foglio riprovando dopo un errore
// parziale (o premendo di nuovo Invia dopo un invio riuscito).
test('le parole confermate escono dalla lista; restano solo quelle fallite', () => {
  const f = tra('async function copyAndOpen(', '\nfunction blobToBase64(');
  assert.match(f, /delete contributions\[parola\];/);
  assert.match(f, /extraWords = extraWords\.filter\(x => !inviateExtra\.has\(x\)\);/);
  assert.match(f, /renderExtraWords\(\);\s*updateProgress\(\);\s*updateSubmit\(\);/);
  assert.match(f, /\} finally \{\s*btn\.disabled = false;/);
});
