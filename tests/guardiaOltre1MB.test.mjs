// Guardia anti-clobber degli editor oltre 1 MB (2026-09-30, index.html a 949 KB).
// L'API /contents di GitHub, per file sopra ~1 MB, risponde senza `content`
// (encoding "none"): la guardia confrontava null e si disattivava in silenzio,
// permettendo di sovrascrivere modifiche fatte altrove. Ora, se il contenuto
// manca, lo si rilegge dalla stessa API in formato raw; se anche quello
// fallisce, il salvataggio si annulla.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const leggi = f => fs.readFileSync(ROOT + '/' + f, 'utf8');

// Estrae "[async ]function nome(...) {...}" saltando stringhe e commenti.
function estraiFn(src, nome) {
  let at = src.indexOf('function ' + nome + '(');
  if (at < 0) throw new Error('funzione non trovata: ' + nome);
  if (src.slice(at - 6, at) === 'async ') at -= 6;
  let i = src.indexOf('{', src.indexOf(')', at)), d = 0, q = null, lc = false, bc = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (lc) { if (c === '\n') lc = false; continue; }
    if (bc) { if (c === '*' && c2 === '/') { bc = false; i++; } continue; }
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '/' && c2 === '/') { lc = true; i++; continue; }
    if (c === '/' && c2 === '*') { bc = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
  }
  return src.slice(at, i + 1);
}

// dialetti.html: adminGhPutFile con una GitHub finta. `raw` = contenuto
// restituito dalla GET in formato raw (null = quella GET fallisce).
function dialetti({ snapshot, raw }) {
  const DIAL = leggi('dialetti.html');
  const chiamate = [];
  const ctx = vm.createContext({
    console, atob, btoa, TextDecoder, TextEncoder, Buffer,
    confirm: () => false,
    localStorage: { getItem: () => 'ghp_test', removeItem: () => {} },
    fetch: async (url, opts = {}) => {
      const method = opts.method || 'GET';
      const isRaw = opts.headers && opts.headers.Accept === 'application/vnd.github.raw';
      chiamate.push(isRaw ? 'GET-raw' : method);
      if (isRaw) return raw === null
        ? { ok: false, status: 500, text: async () => '' }
        : { ok: true, status: 200, text: async () => raw };
      if (method === 'GET') return { ok: true, status: 200, json: async () => ({ sha: 'sha1', content: '', encoding: 'none' }) };
      return { ok: true, status: 200, json: async () => ({ content: { sha: 'sha2' } }) };
    },
  });
  vm.runInContext(`const GH_OWNER = "o", GH_REPO = "r", GH_BRANCH = "main", GH_TOKEN_KEY = "k";
    const GH_PATH_INDEX = "index.html", GH_PATH_DIALETTI = "dialetti.html";
    let adminDialFile = ${JSON.stringify(snapshot)}; let adminIndexFile = null;`, ctx);
  for (const fn of ['adminDecodificaContenutoGh', 'adminSnapshotPerPath', 'adminGhPutFile']) vm.runInContext(estraiFn(DIAL, fn), ctx);
  return { put: () => vm.runInContext('adminGhPutFile(GH_PATH_DIALETTI, "nuovo", "msg")', ctx), chiamate };
}

test('dialetti oltre 1 MB: file invariato → rilegge in raw e salva', async () => {
  const d = dialetti({ snapshot: 'v1', raw: 'v1' });
  assert.strictEqual(await d.put(), 'sha2');
  assert.deepStrictEqual(d.chiamate, ['GET', 'GET-raw', 'PUT']);
});

test('dialetti oltre 1 MB: file cambiato altrove → salvataggio bloccato', async () => {
  const d = dialetti({ snapshot: 'v1', raw: 'v2-modificato-altrove' });
  await assert.rejects(d.put(), /cambiat/i);
  assert.deepStrictEqual(d.chiamate, ['GET', 'GET-raw'], 'la PUT non deve partire');
});

test('dialetti oltre 1 MB: rilettura raw fallita → salvataggio annullato', async () => {
  const d = dialetti({ snapshot: 'v1', raw: null });
  await assert.rejects(d.put(), /annullat/i);
  assert.deepStrictEqual(d.chiamate, ['GET', 'GET-raw']);
});

for (const file of ['edit.html', 'edit-coniugazioni.html']) {
  test(`${file}: la guardia non si disattiva più oltre 1 MB`, () => {
    const salva = estraiFn(leggi(file), 'salvaSuGitHub');
    assert.doesNotMatch(salva, /remoto !== null &&/, 'niente più fail-open quando manca il contenuto');
    assert.match(salva, /if \(remoto === null\) \{[\s\S]*?'Accept': 'application\/vnd\.github\.raw'[\s\S]*?if \(!rawRes\.ok\) throw/);
    assert.match(salva, /apiBase \+ '\?ref=' \+ GH_BRANCH, \{ headers: \{ \.\.\.headers/, 'rilettura dall\'API autenticata, non da raw.githubusercontent');
  });
}
