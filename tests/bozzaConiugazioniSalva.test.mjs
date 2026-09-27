// Test di regressione della bozza di edit-coniugazioni.html durante il
// salvataggio e con più schede aperte (review del commit 47f3262).
//
// Bug 1: una modifica fatta MENTRE il PUT su GitHub è in corso veniva data
// per salvata (coniugazioniCaricate copiato dopo l'await) → bozza cancellata
// e nessun avviso all'uscita, anche se quella modifica non era su GitHub.
// Bug 2: la bozza sta in un'unica chiave localStorage condivisa: una scheda
// SENZA modifiche la cancellava, facendo perdere la bozza di un'altra scheda.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');

function extractFn(src, name) {
  let at = src.indexOf('function ' + name + '(');
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const bodyStart = src.indexOf('{', src.indexOf(')', at));
  let depth = 0, i = bodyStart, inStr = false, esc = false, q = null, lc = false, bc = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (lc) { if (c === '\n') lc = false; continue; }
    if (bc) { if (c === '*' && c2 === '/') { bc = false; i++; } continue; }
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; continue; }
    if (c === '/' && c2 === '/') { lc = true; i++; continue; }
    if (c === '/' && c2 === '*') { bc = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}
// Righe di dichiarazione top-level della sezione bozza (DRAFT_LS, id scheda, ...).
function dichiarazioniBozza(src) {
  const a = src.indexOf('const DRAFT_LS');
  const b = src.indexOf('function stessoVerbo(');
  return src.slice(a, b);
}

const FUNZIONI = ['stessoVerbo', 'calcolaBozzaVerbi', 'haModifiche', 'leggiBozzaLocale', 'scriviBozzaOra', 'salvaBozzaLocale',
  'mostraIndicatoreBozza', 'trovaBloccoOggetto', 'jsStr', 'serializzaForma', 'serializzaTempo',
  'serializzaVerbo', 'serializzaConiugazioni', 'ricostruisciSorgente', 'decodificaContenutoGh', 'salvaSuGitHub'];

function fakeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
}

// Una "scheda" dell'editor: contesto vm isolato, localStorage eventualmente condiviso.
function nuovaScheda(localStorage, fetchTimeout) {
  const el = { textContent: '', disabled: false };
  const ctx = vm.createContext({
    localStorage, fetchTimeout, console,
    document: { getElementById: () => el },
    confirm: () => true, alert: () => {}, prompt: () => null,
    setHelp: () => {}, setTimeout: () => 0, clearTimeout: () => {},
    btoa, atob, TextEncoder, TextDecoder, Uint8Array, Date, JSON,
  });
  vm.runInContext(`
    const GH_OWNER = 'o', GH_REPO = 'r', GH_BRANCH = 'main', GH_PATH = 'index.html', GH_TOKEN_KEY = 'tok';
    let originalSourceFile = null, coniugazioni = null;
    ${dichiarazioniBozza(SRC)}
    ${FUNZIONI.map(n => extractFn(SRC, n)).join('\n')}
  `, ctx);
  return ctx;
}

const verbo = sp => ({ nome: 'essere', tempi: { presente: { nome: 'presente', forme: [{ p: '1ª sing.', it: 'io sono', sp }] } } });
const b64 = s => Buffer.from(s, 'utf8').toString('base64');

test('modifica fatta durante il PUT resta non salvata: bozza conservata e haModifiche() vero', async () => {
  const ls = fakeStorage(); ls.setItem('tok', 'x');
  let scheda;
  const fetchTimeout = async (url, opts) => {
    if (!opts || !opts.method) return { ok: true, json: async () => ({ sha: 's1', content: b64(scheda.__src) }) };
    // PUT in volo: l'utente continua a scrivere in una cella
    vm.runInContext(`coniugazioni.essere.tempi.presente.forme[0].sp = 'DURANTE'`, scheda);
    return { ok: true, json: async () => ({}) };
  };
  scheda = nuovaScheda(ls, fetchTimeout);
  scheda.__src = 'x\nconst CONIUGAZIONI = ' + JSON.stringify({ essere: verbo('mi a son') }) + ';\ny';
  vm.runInContext(`
    originalSourceFile = __src;
    coniugazioniCaricate = { essere: ${JSON.stringify(verbo('mi a son'))} };
    coniugazioni = { essere: ${JSON.stringify(verbo('PRIMA'))} };
  `, scheda);
  await vm.runInContext('salvaSuGitHub()', scheda);
  assert.strictEqual(vm.runInContext('haModifiche()', scheda), true, 'la modifica DURANTE non è su GitHub');
  const bozza = JSON.parse(ls.getItem('lq_editconiugazioni_draft_v1'));
  assert.ok(bozza, 'la bozza non deve essere cancellata');
  assert.strictEqual(bozza.verbi.essere.tempi.presente.forme[0].sp, 'DURANTE');
  assert.strictEqual(bozza.basi.essere.tempi.presente.forme[0].sp, 'PRIMA', 'la base è ciò che è stato caricato su GitHub');
});

test('una scheda senza modifiche non cancella la bozza di un\'altra scheda', () => {
  const ls = fakeStorage();
  const A = nuovaScheda(ls, null), B = nuovaScheda(ls, null);
  vm.runInContext(`coniugazioniCaricate = { essere: ${JSON.stringify(verbo('a'))} }; coniugazioni = { essere: ${JSON.stringify(verbo('MODIFICA A'))} }; scriviBozzaOra();`, A);
  assert.ok(ls.getItem('lq_editconiugazioni_draft_v1'));
  vm.runInContext(`coniugazioniCaricate = { essere: ${JSON.stringify(verbo('a'))} }; coniugazioni = { essere: ${JSON.stringify(verbo('a'))} }; scriviBozzaOra();`, B);
  const bozza = JSON.parse(ls.getItem('lq_editconiugazioni_draft_v1'));
  assert.ok(bozza, 'la bozza della scheda A deve sopravvivere');
  assert.strictEqual(bozza.verbi.essere.tempi.presente.forme[0].sp, 'MODIFICA A');
});

test('la scheda che ha scritto la bozza la cancella quando non ha più modifiche', () => {
  const ls = fakeStorage();
  const A = nuovaScheda(ls, null);
  vm.runInContext(`coniugazioniCaricate = { essere: ${JSON.stringify(verbo('a'))} }; coniugazioni = { essere: ${JSON.stringify(verbo('b'))} }; scriviBozzaOra();`, A);
  vm.runInContext(`coniugazioni = { essere: ${JSON.stringify(verbo('a'))} }; scriviBozzaOra();`, A);
  assert.strictEqual(ls.getItem('lq_editconiugazioni_draft_v1'), null);
});
