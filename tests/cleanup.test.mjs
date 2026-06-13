// Test della pulizia "già-in-index" di dialetti.html.
// Estrae le funzioni REALI dal sorgente (non le re-implementa) e le esegue in
// un sandbox vm con i globali stubbati, poi verifica che la pulizia rimuova
// davvero righe/celle. Nessun framework esterno: usa node:test integrato.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const DIAL = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// — parser bracket-aware identico ad adminEstraiArray —
function estrai(src, re) {
  const m = re.exec(src); if (!m) throw new Error('marker non trovato');
  const start = m.index + m[0].length; let depth = 1, i = start, inStr = false, esc = false, q = null;
  while (i < src.length) { const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
    i++; }
  return (new Function('return [' + src.slice(start, i) + ']'))();
}

// — estrae il sorgente di una funzione per nome (brace matching) —
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  const at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  let i = src.indexOf('{', at), depth = 0, inStr = false, esc = false, q = null;
  const begin = i;
  for (; i < src.length; i++) { const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}

const CAND = estrai(DIAL, /^\s*const CANDIDATI = \[/m);
const VOC = estrai(INDEX, /^\s*const VOCABOLARIO_DEFAULT = \[/m);
const COLS = ['mn', 'sp', 'cr', 'ge'];

// Costruisce un sandbox con i globali necessari e le funzioni reali della pagina.
function makeCtx({ confirmReturns = true } = {}) {
  const sandbox = {
    ADMIN: true,
    DIALECT_ALL_COLS: COLS.slice(),
    DIALECT_COL: { mn: 'mn', sp: 'sp', cr: 'cr', ge: 'ge' },
    DIALECT_NAMES: { mn: 'Manarolese', sp: 'Spezzino', cr: 'Carrarino', ge: 'Genovese' },
    GH_BRANCH: 'dev',
    currentDialect: 'sp',
    adminVoc: JSON.parse(JSON.stringify(CAND)),
    adminIndexVoc: VOC,
    adminIndexByIt: new Map(),
    adminModifiedKeys: new Set(),
    adminOriginalKeys: new Map(),
    // stub DOM/IO
    alert: () => {},
    confirm: () => confirmReturns,
    renderTable: () => {},
    adminUpdateBadges: () => {},
    adminLog: () => {},
  };
  const ctx = vm.createContext(sandbox);
  // funzioni reali estratte dal sorgente
  const fns = ['adminRowKey', 'voceUtile', 'dialMancante', 'adminPulisciGiaInIndex', 'adminImportaDaIndex', 'adminScartaGiaInIndex']
    .map(n => extractFn(DIAL, n)).join('\n\n');
  vm.runInContext(fns, ctx);
  // popola la mappa di lookup come fa adminCaricaDaGitHub
  vm.runInContext('adminIndexVoc.forEach(v => adminIndexByIt.set(adminRowKey(v), v));', ctx);
  return { ctx, sandbox };
}

test('ci sono candidati già coperti da index (precondizione del bug)', () => {
  const { sandbox } = makeCtx();
  const byIt = new Map(); VOC.forEach(v => byIt.set((v.it || '').toLowerCase().trim(), v));
  const conMatch = CAND.filter(e => byIt.has((e.it || '').toLowerCase().trim())).length;
  assert.ok(conMatch > 0, 'attesi candidati con IT presente in index');
  assert.ok(sandbox.adminVoc.length === CAND.length, 'copia di lavoro intatta prima della pulizia');
});

test('la pulizia: dopo l\'esecuzione non restano duplicati né voci interamente coperte', () => {
  const { ctx, sandbox } = makeCtx({ confirmReturns: true });
  const prima = sandbox.adminVoc.length;
  vm.runInContext('adminPulisciGiaInIndex();', ctx);
  const dopo = sandbox.adminVoc.length;

  // La pulizia non può AUMENTARE le voci (vale anche se i dati erano già puliti).
  assert.ok(dopo <= prima, `il totale non deve crescere: prima=${prima} dopo=${dopo}`);

  const byIt = new Map(); VOC.forEach(v => byIt.set((v.it || '').toLowerCase().trim(), v));
  const utile = e => { // replica di voceUtile
    const idx = byIt.get((e.it || '').toLowerCase().trim());
    if (!idx) return true;
    return COLS.some(c => { const v = (e[c] || '').trim(); return v && v !== (idx[c] || '').trim(); });
  };
  // Invariante 1: nessuna cella superstite identica a index (duplicato)
  let dupResidui = 0;
  // Invariante 2: nessuna voce superstite interamente coperta da index
  let copertiResidui = 0;
  for (const e of sandbox.adminVoc) {
    const idx = byIt.get((e.it || '').toLowerCase().trim());
    if (!idx) continue;
    for (const c of COLS) { const v = (e[c] || '').trim(); if (v && v === (idx[c] || '').trim()) dupResidui++; }
    if (!utile(e)) copertiResidui++;
  }
  assert.equal(dupResidui, 0, 'non devono restare celle dialetto identiche a index');
  assert.equal(copertiResidui, 0, 'non devono restare voci interamente coperte da index');
  console.log(`    rimosse ${prima - dopo} righe (0 è ok se i dati erano già puliti)`);
});

test('annullando il confirm NON cambia nulla (confirm = Annulla)', () => {
  const { ctx, sandbox } = makeCtx({ confirmReturns: false });
  const prima = sandbox.adminVoc.length;
  vm.runInContext('adminPulisciGiaInIndex();', ctx);
  assert.equal(sandbox.adminVoc.length, prima, 'con Annulla il totale resta invariato');
  assert.equal(sandbox.adminModifiedKeys.size, 0, 'con Annulla nessuna modifica registrata');
});

test('importa da index: aggiunge le voci che mancano del dialetto selezionato', () => {
  const { ctx, sandbox } = makeCtx({ confirmReturns: true });
  sandbox.currentDialect = 'sp';
  const prima = sandbox.adminVoc.length;

  // quante voci index mancano di 'sp' e non sono già candidate (atteso)
  const haCand = new Set(CAND.map(v => (v.it || '').toLowerCase().trim()));
  const atteso = VOC.filter(v => v.it && !(v.sp || '').trim() && !haCand.has((v.it || '').toLowerCase().trim())).length;
  assert.ok(atteso > 0, 'precondizione: ci sono voci index senza sp da importare');

  vm.runInContext('adminImportaDaIndex();', ctx);
  const aggiunte = sandbox.adminVoc.length - prima;
  assert.equal(aggiunte, atteso, `attese ${atteso} voci aggiunte, trovate ${aggiunte}`);

  // le nuove voci NON devono avere il campo sp (è il lavoro da fare)
  const nuove = sandbox.adminVoc.filter(v => !haCand.has((v.it || '').toLowerCase().trim()));
  assert.ok(nuove.every(v => !(v.sp || '').trim()), 'le voci importate devono avere sp vuoto');
  console.log(`    importate ${aggiunte} voci (sp) da index`);
});

test('importa da index: niente duplicati e no-op su Annulla', () => {
  // Annulla: nessuna aggiunta
  const a = makeCtx({ confirmReturns: false });
  a.sandbox.currentDialect = 'sp';
  const prima = a.sandbox.adminVoc.length;
  vm.runInContext('adminImportaDaIndex();', a.ctx);
  assert.equal(a.sandbox.adminVoc.length, prima, 'con Annulla non aggiunge nulla');

  // Doppio import consecutivo: il secondo non deve aggiungere nulla (già candidate)
  const b = makeCtx({ confirmReturns: true });
  b.sandbox.currentDialect = 'sp';
  vm.runInContext('adminImportaDaIndex();', b.ctx);
  const dopoPrimo = b.sandbox.adminVoc.length;
  vm.runInContext('adminImportaDaIndex();', b.ctx);
  assert.equal(b.sandbox.adminVoc.length, dopoPrimo, 'il secondo import non deve creare duplicati');
});

test('scarta già-in-index: rimuove le voci con dialetto vuoto ma presente in index', () => {
  const { ctx, sandbox } = makeCtx({ confirmReturns: true });
  sandbox.currentDialect = 'sp';
  const byIt = new Map(); VOC.forEach(v => byIt.set((v.it || '').toLowerCase().trim(), v));
  // atteso: candidati con sp vuoto ma index ha sp
  const atteso = sandbox.adminVoc.filter(e => {
    if ((e.sp || '').trim()) return false;
    const idx = byIt.get((e.it || '').toLowerCase().trim());
    return idx && (idx.sp || '').trim();
  }).length;
  assert.ok(atteso > 0, 'precondizione: ci sono voci «già in index» per sp');
  const prima = sandbox.adminVoc.length;
  vm.runInContext('adminScartaGiaInIndex();', ctx);
  assert.equal(prima - sandbox.adminVoc.length, atteso, `attese ${atteso} voci scartate`);
  // nessuna voce superstite deve essere «già in index» per sp
  const resta = sandbox.adminVoc.some(e => {
    if ((e.sp || '').trim()) return false;
    const idx = byIt.get((e.it || '').toLowerCase().trim());
    return idx && (idx.sp || '').trim();
  });
  assert.equal(resta, false, 'non devono restare voci «già in index» per sp');
  console.log(`    scartate ${atteso} voci «già in index» (sp)`);
});

test('scarta già-in-index: no-op su Annulla', () => {
  const { ctx, sandbox } = makeCtx({ confirmReturns: false });
  sandbox.currentDialect = 'sp';
  const prima = sandbox.adminVoc.length;
  vm.runInContext('adminScartaGiaInIndex();', ctx);
  assert.equal(sandbox.adminVoc.length, prima, 'con Annulla non rimuove nulla');
});

test('dialMancante: una parola già in index NON è mancante', () => {
  const { ctx } = makeCtx();
  // prendo un caso reale: candidato con sp vuoto ma index con sp valorizzato
  const byIt = new Map(); VOC.forEach(v => byIt.set((v.it || '').toLowerCase().trim(), v));
  const caso = CAND.find(e => !(e.sp || '').trim() && (byIt.get((e.it || '').toLowerCase().trim())?.sp || '').trim());
  assert.ok(caso, 'serve almeno un candidato sp-vuoto ma presente in index');
  const r = vm.runInContext(`dialMancante(${JSON.stringify(caso)}, 'sp')`, ctx);
  assert.equal(r, false, 'sp presente in index ⇒ non mancante');
});
