// Un crash React (ErrorBoundary) non deve più azzerare la progressione
// (segnalazione di Dino, 2026-11-05: "ripartito da zero parole apprese").
// Prima: qualunque crash → resetStorageRecovery() → via stats, streak, record.
// Ora: al primo crash si azzera solo ciò che può impedire l'avvio (vocabolario
// salvato, filtri) e si registra l'errore; il reset completo scatta solo se
// l'app ricrasha subito (crash in loop all'avvio), e prima salva un backup.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error('non trovato: ' + a); const j = HTML.indexOf(b, i); if (j < 0) throw new Error('non trovato: ' + b); return HTML.slice(i, j); };

function fakeStorage(init) {
  const map = new Map(Object.entries(init));
  return { map, getItem: k => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: k => map.delete(k) };
}

const PROGRESSI = {
  qml_v10_stats: '{"it|cane":{"livello":4}}',
  qml_v10_streak: '{"lastDay":1,"count":12}',
  qml_v10_record: '{"a":3}',
  qml_v10_record_perc: '{"a":90}',
  qml_v10_lingue: '[{"codice":"it","attiva":true}]',
  qml_v10_ndom: '{"quiz":15}',
  qml_v11_sm_global: '{"x":1}',
  qml_v1_fase1_temi: '{"completata":true}',
};

function makeCtx(extra = {}) {
  const localStorage = fakeStorage({ ...PROGRESSI, qml_v10_vocabolario: '[1]', qml_v10_voc_version: '9', qml_v10_filtri: '{}', ...extra });
  const ctx = vm.createContext({ localStorage, console: { warn() {}, error() {} } });
  const blocco = tra('function loadJSON(', '\nfunction esportaProgressi(');
  // Le SK_* dichiarate dentro il blocco estratto non vanno ridichiarate
  const skConsts = HTML.match(/^const (?:SK|GH)_[A-Z_]+ = .*$/gm).filter(l => !blocco.includes(l));
  vm.runInContext(skConsts.join('\n'), ctx);
  vm.runInContext(blocco, ctx);
  return { ctx, localStorage };
}

test('primo crash: la progressione resta, si azzerano solo vocabolario salvato e filtri', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('gestisciCrash(new Error("boom"), 1000000);', ctx);
  for (const [k, v] of Object.entries(PROGRESSI)) assert.equal(localStorage.map.get(k), v, `"${k}" doveva restare`);
  assert.equal(localStorage.map.has('qml_v10_vocabolario'), false);
  assert.equal(localStorage.map.has('qml_v10_filtri'), false);
});

test('il crash viene registrato (data e messaggio) per capire la causa', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('gestisciCrash(new Error("boom nella schermata"), 1000000);', ctx);
  const log = JSON.parse(localStorage.map.get('qml_v1_ultimo_crash'));
  assert.equal(log.t, 1000000);
  assert.match(log.msg, /boom nella schermata/);
});

test('crash ripetuto subito (loop all\'avvio): reset completo, ma prima backup della progressione', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('gestisciCrash(new Error("a"), 1000000); gestisciCrash(new Error("b"), 1003000);', ctx);
  assert.equal(localStorage.map.has('qml_v10_stats'), false, 'nel loop il reset completo serve per ripartire');
  const bk = JSON.parse(localStorage.map.get('qml_v1_backup_progressi'));
  assert.equal(bk.dati.qml_v10_stats, PROGRESSI.qml_v10_stats);
  assert.equal(bk.dati.qml_v10_streak, PROGRESSI.qml_v10_streak);
});

test('due crash distanti nel tempo: nessun reset della progressione', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('gestisciCrash(new Error("a"), 1000000); gestisciCrash(new Error("b"), 1000000 + 3600000);', ctx);
  assert.equal(localStorage.map.get('qml_v10_stats'), PROGRESSI.qml_v10_stats);
});

test('un reset su storage già vuoto non sovrascrive il backup buono con dati vuoti', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('resetStorageRecovery(); resetStorageRecovery();', ctx);
  const bk = JSON.parse(localStorage.map.get('qml_v1_backup_progressi'));
  assert.equal(bk.dati.qml_v10_stats, PROGRESSI.qml_v10_stats);
});

test('l\'ErrorBoundary usa gestisciCrash, non più il reset completo diretto', () => {
  const eb = tra('class ErrorBoundary', '\nif (!window.__TEST_MODE__)');
  assert.match(eb, /gestisciCrash\(err\)/);
  assert.doesNotMatch(eb, /resetStorageRecovery\(\)/);
});
