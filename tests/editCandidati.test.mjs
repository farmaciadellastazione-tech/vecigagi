// Test della sorgente "Candidati (dialetti)" in edit.html + guardia anti-clobber.
//
// edit.html diventa l'unico editor: oltre a VOCABOLARIO_DEFAULT (index.html)
// può caricare/salvare il blocco CANDIDATI di dialetti.html (il cuscinetto di
// staging). Requisiti verificati qui:
//  - helper di sorgente (path/marker/bozza) commutano con currentSource
//  - estrazione del blocco CANDIDATI dal dialetti.html REALE
//  - roundtrip candidati: serializza→ricostruisci→ri-estrai identico,
//    campi extra (ok, fonte) preservati, NESSUN bump di VOC_VERSION
//  - regressione modalità index: roundtrip identico e bump VOC_VERSION +1
//    (comportamento storico invariato)
//  - guardia anti-clobber: il salvataggio confronta il file remoto con quello
//    caricato e si ferma se è cambiato (protegge dal clobber tipo b8b23a0)
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');
const DIAL = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Tokenizer bilanciato comment-aware e regex-aware (vedi tests/spiegaParola.test.mjs).
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
function extractLineConst(src, name) {
  const re = new RegExp('const ' + name + ' = [^;\\n]+;');
  const m = re.exec(src);
  if (!m) throw new Error('costante non trovata: ' + name);
  return m[0];
}

// Sandbox con le funzioni REALI di edit.html per estrazione/serializzazione.
// `sorgente` = 'index' | 'candidati'; `file` = contenuto del file remoto simulato.
function makeCtx(sorgente, file) {
  const sandbox = { console };
  const ctx = vm.createContext(sandbox);
  for (const c of ['GH_PATH', 'BLOCK_START_RE', 'GH_PATH_DIALETTI', 'BLOCK_CANDIDATI_RE', 'KEY_ORDER', 'DRAFT_LS']) {
    vm.runInContext(extractLineConst(EDIT, c), ctx);
  }
  vm.runInContext(`let currentSource = ${JSON.stringify(sorgente)};`, ctx);
  vm.runInContext('let originalSourceFile = null; let frasiSP = []; let originalKeysByEntry = new Map(); let vocabolario = [];', ctx);
  for (const f of ['isCandidatiMode', 'sorgentePath', 'sorgenteMarkerRe', 'draftKey', 'rowKey',
                   'estraiVocabolario', 'trovaBloccoArray', 'serializzaVoce', 'serializzaFraseSP', 'ricostruisciSorgente']) {
    vm.runInContext(extractFn(EDIT, f), ctx);
  }
  if (file !== undefined) {
    ctx.__file = file;
    vm.runInContext('originalSourceFile = __file;', ctx);
  }
  return ctx;
}

test('helper sorgente: index di default, candidati commutano path/marker/bozza', () => {
  const a = makeCtx('index');
  assert.equal(vm.runInContext('sorgentePath()', a), 'index.html');
  assert.equal(vm.runInContext('draftKey()', a), 'lq_edit_draft_v1');
  const b = makeCtx('candidati');
  assert.equal(vm.runInContext('sorgentePath()', b), 'dialetti.html');
  assert.notEqual(vm.runInContext('draftKey()', b), 'lq_edit_draft_v1', 'la bozza dei candidati deve avere una chiave separata');
  assert.ok(vm.runInContext('sorgenteMarkerRe().source', b).includes('CANDIDATI'));
});

test('estrazione candidati dal dialetti.html reale', () => {
  const ctx = makeCtx('candidati', DIAL);
  const n = vm.runInContext('vocabolario = estraiVocabolario(originalSourceFile); vocabolario.length', ctx);
  assert.ok(n > 100, `attese >100 voci candidate, trovate ${n}`);
  assert.ok(vm.runInContext('vocabolario.every(v => typeof v.it === "string")', ctx));
});

test('roundtrip candidati: ricostruisci → ri-estrai identico, ok/fonte preservati, NESSUN VOC_VERSION', () => {
  const ctx = makeCtx('candidati', DIAL);
  vm.runInContext(`
    vocabolario = estraiVocabolario(originalSourceFile);
    vocabolario.forEach(v => originalKeysByEntry.set(rowKey(v), new Set(Object.keys(v))));
    // Simula il lavoro dell'editor: una voce marcata OK + una con fonte
    vocabolario[0].ok = true;
    vocabolario[1].fonte = 'prova-roundtrip';
    __rebuilt = ricostruisciSorgente();
  `, ctx);
  const rebuilt = ctx.__rebuilt;
  // dialetti.html non ha VOC_VERSION: il rebuild non deve introdurlo né alterare nulla fuori dal blocco
  assert.equal((rebuilt.match(/VOC_VERSION/g) || []).length, (DIAL.match(/VOC_VERSION/g) || []).length,
    'il salvataggio candidati non deve toccare VOC_VERSION');
  // Ri-estrai e confronta
  ctx.__file2 = rebuilt;
  const uguali = vm.runInContext(`
    const rilette = (() => { const s = originalSourceFile; originalSourceFile = __file2; const r = estraiVocabolario(originalSourceFile); originalSourceFile = s; return r; })();
    JSON.stringify(rilette) === JSON.stringify(vocabolario)
  `, ctx);
  assert.ok(uguali, 'le voci ri-estratte dal file ricostruito devono essere identiche (ok e fonte inclusi)');
  // Fuori dal blocco CANDIDATI il file deve restare byte-identico
  const tagliaBlocco = (src) => {
    const m = /^\s*const CANDIDATI = \[/m.exec(src);
    const start = m.index + m[0].length;
    let depth = 1, i = start, inS = false, esc = false, q = null;
    while (i < src.length) {
      const c = src[i];
      if (inS) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inS = false; }
      else { if (c === '"' || c === "'") { inS = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
      i++;
    }
    return src.slice(0, start) + src.slice(i);
  };
  assert.equal(tagliaBlocco(rebuilt), tagliaBlocco(DIAL), 'tutto ciò che sta fuori dal blocco CANDIDATI deve restare intatto');
});

test('regressione modalità index: roundtrip identico e bump VOC_VERSION +1 (come sempre)', () => {
  const ctx = makeCtx('index', INDEX);
  vm.runInContext(`
    vocabolario = estraiVocabolario(originalSourceFile);
    vocabolario.forEach(v => originalKeysByEntry.set(rowKey(v), new Set(Object.keys(v))));
    __rebuilt = ricostruisciSorgente();
  `, ctx);
  const rebuilt = ctx.__rebuilt;
  const verPrima = parseInt(INDEX.match(/const\s+VOC_VERSION\s*=\s*(\d+)\s*;/)[1], 10);
  const verDopo = parseInt(rebuilt.match(/const\s+VOC_VERSION\s*=\s*(\d+)\s*;/)[1], 10);
  assert.equal(verDopo, verPrima + 1, 'in modalità index VOC_VERSION deve essere bumpata (comportamento storico)');
  ctx.__file2 = rebuilt;
  const uguali = vm.runInContext(`
    const rilette = (() => { const s = originalSourceFile; originalSourceFile = __file2; const r = estraiVocabolario(originalSourceFile); originalSourceFile = s; return r; })();
    JSON.stringify(rilette) === JSON.stringify(vocabolario)
  `, ctx);
  assert.ok(uguali, 'roundtrip index: voci ri-estratte identiche');
});

test('decodificaContenutoGh: decodifica il content base64 (multibyte) della GET /contents', () => {
  const ctx = vm.createContext({ atob, TextDecoder, console });
  vm.runInContext(extractFn(EDIT, 'decodificaContenutoGh'), ctx);
  const testo = 'ancö è già qui — “ü” 🏖️';
  const b64 = Buffer.from(testo, 'utf8').toString('base64');
  // GitHub spezza il base64 con newline: la funzione deve tollerarli
  const spezzato = b64.match(/.{1,10}/g).join('\n');
  assert.equal(vm.runInContext(`decodificaContenutoGh({ content: ${JSON.stringify(spezzato)} })`, ctx), testo);
  assert.equal(vm.runInContext('decodificaContenutoGh({})', ctx), null);
  assert.equal(vm.runInContext('decodificaContenutoGh(null)', ctx), null);
});

test('guardia anti-clobber: salvaSuGitHub confronta il remoto con il caricato e si ferma', () => {
  const src = extractFn(EDIT, 'salvaSuGitHub');
  assert.ok(src.includes('decodificaContenutoGh('), 'il salvataggio deve decodificare il contenuto remoto dalla GET');
  assert.ok(/originalSourceFile/.test(src) && /cambiat/i.test(src),
    'deve confrontare il file remoto con quello caricato e spiegare che è cambiato');
});

test('UI: selettore sorgente e colonna OK presenti in edit.html', () => {
  assert.ok(EDIT.includes('id="source-select"'), 'manca il selettore di sorgente');
  assert.ok(EDIT.includes('cambiaSorgente('), 'manca il gestore del cambio sorgente');
  assert.ok(EDIT.includes('toggleOkVoce('), 'manca il toggle della colonna ☑️ OK');
});
