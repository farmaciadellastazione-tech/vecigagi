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
  const re = new RegExp('const ' + name + '\\s*=\\s*[^;\\n]+;');
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

// ── Guardia anti-clobber sui salvataggi admin (☁️ Salva e 🚀 Promuovi) ──────
// Stessa protezione già in edit.html: prima del PUT, adminGhPutFile confronta
// il contenuto remoto (GET /contents) con lo snapshot caricato all'apertura
// (adminDialFile/adminIndexFile). Se il file è cambiato (altra scheda, push),
// il salvataggio si ferma invece di sovrascrivere (clobber storico b8b23a0).

function makeGuardCtx({ remoto, snapshot, senzaContent = false }) {
  const chiamate = [];
  const sandbox = {
    console, atob, btoa, TextDecoder, TextEncoder,
    confirm: () => false,
    localStorage: { getItem: () => 'ghp_test', removeItem: () => {} },
    location: { search: '' },
    fetch: async (url, opts) => {
      const method = (opts && opts.method) || 'GET';
      chiamate.push(method);
      if (method === 'GET') {
        const body = senzaContent
          ? { sha: 'sha1' }
          : { sha: 'sha1', content: Buffer.from(remoto, 'utf8').toString('base64') };
        return { ok: true, status: 200, json: async () => body };
      }
      return { ok: true, status: 200, json: async () => ({ content: { sha: 'sha2' } }) };
    },
  };
  const ctx = vm.createContext(sandbox);
  for (const c of ['GH_OWNER', 'GH_REPO', 'GH_TOKEN_KEY', 'GH_PATH_INDEX', 'GH_PATH_DIALETTI']) {
    vm.runInContext(extractLineConst(DIAL, c), ctx);
  }
  vm.runInContext('const GH_BRANCH = "main";', ctx);
  vm.runInContext(`let adminDialFile = ${JSON.stringify(snapshot)}; let adminIndexFile = null;`, ctx);
  vm.runInContext(extractFn(DIAL, 'adminDecodificaContenutoGh'), ctx);
  vm.runInContext(extractFn(DIAL, 'adminSnapshotPerPath'), ctx);
  vm.runInContext(extractFn(DIAL, 'adminGhPutFile'), ctx);
  return { ctx, chiamate };
}

test('guardia dialetti: remoto identico allo snapshot → PUT eseguita', async () => {
  const { ctx, chiamate } = makeGuardCtx({ remoto: 'contenuto-v1', snapshot: 'contenuto-v1' });
  const sha = await vm.runInContext('adminGhPutFile(GH_PATH_DIALETTI, "nuovo", "msg")', ctx);
  assert.equal(sha, 'sha2');
  assert.deepEqual(chiamate, ['GET', 'PUT']);
});

test('guardia dialetti: remoto CAMBIATO → salvataggio bloccato, PUT non chiamata', async () => {
  const { ctx, chiamate } = makeGuardCtx({ remoto: 'contenuto-v2-modificato-altrove', snapshot: 'contenuto-v1' });
  await assert.rejects(
    () => vm.runInContext('adminGhPutFile(GH_PATH_DIALETTI, "nuovo", "msg")', ctx),
    /cambiat/i,
    'deve fermarsi spiegando che il file è cambiato'
  );
  assert.deepEqual(chiamate, ['GET'], 'la PUT non deve partire');
});

test('guardia dialetti: content assente dalla GET (file >1MB) → fail-open, PUT eseguita', async () => {
  const { ctx, chiamate } = makeGuardCtx({ remoto: '', snapshot: 'contenuto-v1', senzaContent: true });
  await vm.runInContext('adminGhPutFile(GH_PATH_DIALETTI, "nuovo", "msg")', ctx);
  assert.deepEqual(chiamate, ['GET', 'PUT']);
});

// ── Promozione e omonimi (bug "vassoio"/"cacciare", 2026-07-12) ─────────────
// 1. La rimozione post-promozione filtrava per CHIAVE it: un secondo candidato
//    omonimo NON ☑️ (es. il gemello {tema:"casa", it:"vassoio"}) veniva
//    cancellato in silenzio insieme a quello promosso. Ora si rimuove per
//    IDENTITÀ: sparisce solo ciò che è stato davvero promosso.
// 2. Se INDEX ha più voci con lo stesso it (26 gruppi di omonimi reali), la
//    Map it→voce aggiornava un gemello a caso (l'ultimo). Ora il candidato
//    ambiguo viene SALTATO con avviso, mai fuso nel gemello sbagliato.

function makePromoCtx() {
  const ctx = vm.createContext({ console });
  vm.runInContext(extractFn(DIAL, 'adminRowKey'), ctx);
  vm.runInContext(extractFn(DIAL, 'chiaviDoppie'), ctx);
  vm.runInContext(extractFn(DIAL, 'candidatiDopoPromozione'), ctx);
  return ctx;
}

test('chiaviDoppie: individua le chiavi it presenti più volte', () => {
  const ctx = makePromoCtx();
  const out = vm.runInContext(`[...chiaviDoppie([{ it: 'ora' }, { it: 'Ora ' }, { it: 'casa' }])]`, ctx);
  assert.deepEqual(out, ['ora'], 'stessa chiave normalizzata (case/spazi) → doppia');
});

test('candidatiDopoPromozione: rimozione per identità — il gemello non promosso sopravvive', () => {
  const ctx = makePromoCtx();
  const superstiti = vm.runInContext(`
    const promosso = { tema: 'dialetti', it: 'vassoio', mn: 'cabarè', ok: true };
    const gemello  = { tema: 'casa', it: 'vassoio', ge: 'cabaré' };
    const altro    = { it: 'sole', ge: 'sô' };
    candidatiDopoPromozione([promosso, gemello, altro], new Set([promosso])).map(v => v.tema || v.it);
  `, ctx);
  assert.deepEqual(superstiti, ['casa', 'sole'], 'deve sparire SOLO la voce promossa, non il gemello omonimo');
});

test('adminPromuovi: usa i nuovi helper e salta i candidati con omonimi in index (con avviso)', () => {
  const src = extractFn(DIAL, 'adminPromuovi');
  assert.ok(src.includes('candidatiDopoPromozione('), 'la rimozione deve essere per identità');
  assert.ok(src.includes('chiaviDoppie('), 'gli omonimi di index vanno individuati prima del merge');
  assert.ok(/omonim/i.test(src), 'il salto per ambiguità deve essere spiegato all\'utente');
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
