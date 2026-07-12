// Test dell'import multi-lingua in dialetti.html (admin, 📤 Importa).
//
// Prima: l'import agiva SOLO sul dialetto selezionato nel chip (currentDialect);
// un JSON di candidati in altre lingue (es. tedeschi da Lettura guidata,
// formato [{tema, it, de:"..."}]) finiva tutto in "∅ Vuote" e non entrava mai.
//
// Dopo: adminImportAnalizza legge TUTTI i codici lingua noti presenti nel file
// (colonne di ADMIN_KEY_ORDER_INDEX), e adminImportApplica pre-spunta ok:true
// sulle voci NUOVE i cui campi importati sono tutti in LINGUE_AFFIDABILI_AI
// (lingue maggiori dove la traduzione IA è affidabile). I dialetti mn/sp/ge/cr
// NON sono mai pre-spuntati: nascono da vagliare come sempre. Regola di
// processo: qualunque candidato passa da dialetti.html prima di index
// (decisione autore 2026-07-12, vedi ANALISI.md).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const DIAL = fs.readFileSync(ROOT + '/dialetti.html', 'utf8');

// Tokenizer bilanciato comment-aware e regex-aware (stessa versione di
// tests/spiegaParola.test.mjs: dialetti.html contiene sia commenti in italiano
// con apostrofi sia letterali regex con virgolette).
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

// Sandbox con le funzioni REALI di analisi/applicazione dell'import e stub
// minimi per DOM/log. `candidatiIniziali` popola adminVoc (i CANDIDATI live).
function makeCtx(candidatiIniziali, currentDialect = 'sp') {
  const chiamateAggiorna = [];
  const sandbox = {
    console,
    alert: () => {},
    adminImportRender: () => {},
    adminImportChiudi: () => {},
    adminUpdateBadges: () => {},
    renderTable: () => {},
    updateStats: () => {},
    adminLog: () => {},
    adminOriginalKeys: new Map(),
    adminModifiedKeys: new Set(),
    currentDialect,
    adminVoc: candidatiIniziali.map(v => ({ ...v })),
    adminAggiornaValore: (it, col, val) => { chiamateAggiorna.push([it, col, val]); },
  };
  sandbox.localStorage = { removeItem: () => {}, getItem: () => null };
  const ctx = vm.createContext(sandbox);
  vm.runInContext('let impParsed = null;', ctx);
  vm.runInContext('let impDaLG = false;', ctx);
  vm.runInContext(extractLineConst(DIAL, 'ADMIN_KEY_ORDER_INDEX'), ctx);
  vm.runInContext(extractLineConst(DIAL, 'LINGUE_AFFIDABILI_AI'), ctx);
  vm.runInContext(extractLineConst(DIAL, 'DIALETTI_TTS_ITA'), ctx);
  vm.runInContext(extractFn(DIAL, 'adminRowKey'), ctx);
  vm.runInContext(extractFn(DIAL, 'adminImportAnalizza'), ctx);
  vm.runInContext(extractFn(DIAL, 'adminImportApplica'), ctx);
  return {
    ctx,
    chiamateAggiorna,
    analizza: arr => vm.runInContext(`adminImportAnalizza(${JSON.stringify(arr)}); impParsed;`, ctx),
    applica: () => vm.runInContext('adminImportApplica(); adminVoc;', ctx),
  };
}

test('LINGUE_AFFIDABILI_AI esiste e non contiene dialetti', () => {
  const src = extractLineConst(DIAL, 'LINGUE_AFFIDABILI_AI');
  const ctx = vm.createContext({});
  vm.runInContext(src + ' this.out = LINGUE_AFFIDABILI_AI;', ctx);
  const lista = ctx.out;
  assert.ok(Array.isArray(lista) && lista.length > 0);
  for (const d of ['mn', 'sp', 'ge', 'cr']) {
    assert.ok(!lista.includes(d), `il dialetto "${d}" non deve mai essere pre-spuntato`);
  }
});

test('candidato tedesco (formato Lettura guidata) → riconosciuto come NUOVA, non più "vuota"', () => {
  const { analizza } = makeCtx([]);
  const p = analizza([{ tema: 'vita quotidiana', it: 'oggi', de: 'heute' }]);
  assert.equal(p.nuove.length, 1, 'la voce tedesca deve entrare tra le nuove');
  assert.equal(p.vuote, 0, 'non deve più finire in "vuote" solo perché non è nel dialetto del chip');
  assert.equal(p.nuove[0].vals.de, 'heute');
});

test('nuova tedesca applicata → voce nei CANDIDATI con campo de e ok:true (pre-spunta lingua affidabile)', () => {
  const { analizza, applica } = makeCtx([]);
  analizza([{ tema: 'vita quotidiana', it: 'oggi', de: 'heute' }]);
  const voci = applica();
  const v = voci.find(x => x.it === 'oggi');
  assert.ok(v, 'voce non creata');
  assert.equal(v.de, 'heute');
  assert.equal(v.ok, true, 'lingua affidabile: deve nascere già ☑️ OK');
  assert.equal(v.tema, 'vita quotidiana');
});

test('nuova dialettale (sp) → NESSUNA pre-spunta (nasce da vagliare)', () => {
  const { analizza, applica } = makeCtx([]);
  analizza([{ it: 'oggi', sp: 'ancö' }]);
  const v = applica().find(x => x.it === 'oggi');
  assert.ok(v && v.sp === 'ancö');
  assert.ok(!v.ok, 'i dialetti non devono mai nascere pre-spuntati');
});

test('nuova mista (de + sp) → NESSUNA pre-spunta (basta un campo dialettale)', () => {
  const { analizza, applica } = makeCtx([]);
  analizza([{ it: 'oggi', de: 'heute', sp: 'ancö' }]);
  const v = applica().find(x => x.it === 'oggi');
  assert.ok(v && v.de === 'heute' && v.sp === 'ancö', 'entrambi i campi lingua devono entrare');
  assert.ok(!v.ok, 'la presenza di un campo dialettale esclude la pre-spunta');
});

test('arricchimento su candidato esistente: campo de vuoto riempito, ok NON toccato', () => {
  const { analizza, applica, chiamateAggiorna, ctx } = makeCtx([{ it: 'oggi', sp: 'ancö' }]);
  const p = analizza([{ it: 'oggi', de: 'heute' }]);
  assert.equal(p.nuove.length, 0);
  assert.equal(p.arricch.length, 1);
  assert.equal(p.arricch[0].lang, 'de');
  applica();
  assert.deepEqual(chiamateAggiorna, [['oggi', 'de', 'heute']]);
  const v = vm.runInContext('adminVoc', ctx).find(x => x.it === 'oggi');
  assert.ok(!v.ok, "l'arricchimento non deve pre-spuntare una voce esistente (può avere celle dialettali da vagliare)");
});

test('duplicato esatto (stesso valore de) → conteggiato, nessuna modifica', () => {
  const { analizza, applica, chiamateAggiorna } = makeCtx([{ it: 'oggi', de: 'heute' }]);
  const p = analizza([{ it: 'oggi', de: 'heute' }]);
  assert.equal(p.dupl, 1);
  assert.equal(p.nuove.length + p.arricch.length + p.conflitti.length, 0);
  applica();
  assert.equal(chiamateAggiorna.length, 0);
});

// ── Ponte "Importa da Lettura guidata" ───────────────────────────────────────
// index.html e dialetti.html condividono l'origine: i candidati di Lettura
// guidata (SK_CANDIDATI_LG, formato {parola, lingua, it, tema, frase?, ...})
// sono leggibili direttamente dal localStorage, senza passare da file/appunti.
// lgCandidatiToVoci li converte nel formato dell'import ({it, tema, [lingua]: parola}).

test('lgCandidatiToVoci: converte i candidati LG nel formato import', () => {
  const ctx = vm.createContext({});
  vm.runInContext(extractFn(DIAL, 'lgCandidatiToVoci'), ctx);
  const out = vm.runInContext(`lgCandidatiToVoci(${JSON.stringify([
    { parola: 'Heute', lingua: 'de', it: 'oggi', tema: 'vita quotidiana', frase: 'Heute ist...', storiaId: 'x', data: '2026' },
    { parola: 'ancö', lingua: 'sp', it: 'oggi (sp)' },
    { parola: '', lingua: 'de', it: 'vuota' },        // scartata: parola vuota
    { parola: 'x', lingua: '', it: 'senza lingua' },  // scartata: lingua vuota
    null,                                              // scartata: non-oggetto
  ])})`, ctx);
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], { it: 'oggi', tema: 'vita quotidiana', de: 'Heute' });
  assert.deepEqual(out[1], { it: 'oggi (sp)', sp: 'ancö' });
});

test('flusso LG completo: candidato tedesco da localStorage → voce nei CANDIDATI con ok:true', () => {
  const { analizza, applica, ctx } = makeCtx([]);
  vm.runInContext(extractFn(DIAL, 'lgCandidatiToVoci'), ctx);
  const voci = vm.runInContext(`lgCandidatiToVoci(${JSON.stringify([
    { parola: 'Heute', lingua: 'de', it: 'oggi', tema: 'vita quotidiana' },
  ])})`, ctx);
  analizza(voci);
  const v = applica().find(x => x.it === 'oggi');
  assert.ok(v && v.de === 'Heute' && v.ok === true);
});

test('UI: bottone "Importa da Lettura guidata" presente e proposta di svuotare la lista LG dopo l\'applica', () => {
  assert.ok(DIAL.includes('adminImportDaLG()'), 'manca il bottone/handler adminImportDaLG');
  assert.ok(DIAL.includes('qml_v1_candidati_lg'), 'manca la lettura di SK_CANDIDATI_LG dal localStorage');
  const applicaSrc = extractFn(DIAL, 'adminImportApplica');
  assert.ok(/impDaLG/.test(applicaSrc) && /removeItem/.test(applicaSrc),
    'dopo un import da LG, adminImportApplica deve proporre di svuotare la lista in localStorage');
});

test('regressione: import dialettale classico (chip sp) — nuova, arricchimento e conflitto come prima', () => {
  const { analizza } = makeCtx([
    { it: 'casa', sp: 'ca' },       // conflitto (valore diverso nel file)
    { it: 'mare', tema: 'natura' }, // arricchimento (campo sp vuoto)
  ], 'sp');
  const p = analizza([
    { it: 'casa', sp: 'câ' },
    { it: 'mare', sp: 'mâe' },
    { it: 'sole', sp: 'sô' },       // nuova
  ]);
  assert.equal(p.nuove.length, 1);
  assert.equal(p.nuove[0].vals.sp, 'sô');
  assert.equal(p.arricch.length, 1);
  assert.equal(p.arricch[0].lang, 'sp');
  assert.equal(p.conflitti.length, 1);
  assert.equal(p.conflitti[0].valAttuale, 'ca');
  assert.equal(p.conflitti[0].valNuovo, 'câ');
  assert.equal(p.conflitti[0].scelta, 'attuale', 'default conservativo invariato');
});
