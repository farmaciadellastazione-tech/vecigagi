// Un crash React (ErrorBoundary) non deve più azzerare la progressione
// (segnalazione di Dino, 2026-11-05: "ripartito da zero parole apprese").
// Prima: qualunque crash → resetStorageRecovery() → via stats, streak, record.
// Ora (rivisto dopo la code review):
// - crash ad app già partita (dentro una schermata): nessun reset dei dati,
//   solo i filtri; mai la progressione, per quanti crash ci siano;
// - crash all'avvio: il 1° toglie filtri e versione vocabolario; dal 2° di fila
//   reset completo con backup; dal 4° di fila niente più ricarica automatica.
// - il backup non viene sovrascritto da dati vuoti (stats "{}" riscritte da App).
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
  qml_v10_vocabolario: '[{"it":"parola mia","sp":"a me"}]', // solo le voci aggiunte dall'utente
};

function makeCtx(extra = {}) {
  const localStorage = fakeStorage({ ...PROGRESSI, qml_v10_voc_version: '9', qml_v10_filtri: '{}', ...extra });
  const ctx = vm.createContext({ localStorage, console: { warn() {}, error() {} } });
  const blocco = tra('function loadJSON(', '\nfunction esportaProgressi(');
  // Le SK_* dichiarate dentro il blocco estratto non vanno ridichiarate
  const skConsts = HTML.match(/^const (?:SK|GH)_[A-Z_]+ = .*$/gm).filter(l => !blocco.includes(l));
  vm.runInContext(skConsts.join('\n'), ctx);
  vm.runInContext(blocco, ctx);
  return { ctx, localStorage };
}
const crash = (ctx, avviata) => vm.runInContext(`gestisciCrash(new Error("boom"), ${avviata})`, ctx);

test('crash dentro una schermata (app partita): la progressione resta, anche se ricapita subito', () => {
  const { ctx, localStorage } = makeCtx();
  for (let i = 0; i < 5; i++) assert.equal(crash(ctx, true), true, 'ricarica');
  for (const [k, v] of Object.entries(PROGRESSI)) assert.equal(localStorage.map.get(k), v, `"${k}" doveva restare`);
  assert.equal(localStorage.map.has('qml_v10_filtri'), false);
});

test('primo crash all\'avvio: restano progressione e parole aggiunte dall\'utente', () => {
  const { ctx, localStorage } = makeCtx();
  assert.equal(crash(ctx, false), true);
  for (const [k, v] of Object.entries(PROGRESSI)) assert.equal(localStorage.map.get(k), v, `"${k}" doveva restare`);
  assert.equal(localStorage.map.has('qml_v10_filtri'), false);
});

test('secondo crash di fila all\'avvio: reset completo, ma prima backup (anche delle parole aggiunte)', () => {
  const { ctx, localStorage } = makeCtx();
  crash(ctx, false); crash(ctx, false);
  assert.equal(localStorage.map.has('qml_v10_stats'), false, 'nel loop il reset completo serve per ripartire');
  const bk = JSON.parse(localStorage.map.get('qml_v1_backup_progressi'));
  assert.equal(bk.dati.qml_v10_stats, PROGRESSI.qml_v10_stats);
  assert.equal(bk.dati.qml_v10_streak, PROGRESSI.qml_v10_streak);
  assert.equal(bk.dati.qml_v10_vocabolario, PROGRESSI.qml_v10_vocabolario);
});

test('l\'avvio riuscito azzera il conteggio: un crash dopo non è "di fila"', () => {
  const { ctx, localStorage } = makeCtx();
  crash(ctx, false);
  vm.runInContext('segnaAvvioRiuscito()', ctx);
  crash(ctx, false);
  assert.equal(localStorage.map.get('qml_v10_stats'), PROGRESSI.qml_v10_stats);
});

test('loop che il reset non risolve: il backup buono non viene sovrascritto dai default riscritti da App', () => {
  const { ctx, localStorage } = makeCtx();
  crash(ctx, false); crash(ctx, false);
  // dopo il reload App riscrive i default
  localStorage.setItem('qml_v10_stats', '{}');
  localStorage.setItem('qml_v10_lingue', '[{"codice":"it","attiva":true},{"codice":"en","attiva":true}]');
  crash(ctx, false);
  const bk = JSON.parse(localStorage.map.get('qml_v1_backup_progressi'));
  assert.equal(bk.dati.qml_v10_stats, PROGRESSI.qml_v10_stats);
});

test('dopo 4 crash di fila all\'avvio smette di ricaricare (niente loop infinito)', () => {
  const { ctx } = makeCtx();
  assert.deepEqual([1, 2, 3, 4].map(() => crash(ctx, false)), [true, true, true, false]);
});

test('il crash viene registrato (data e messaggio) per capire la causa', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('gestisciCrash(new Error("boom nella schermata"), true, 1000000);', ctx);
  const log = JSON.parse(localStorage.map.get('qml_v1_ultimo_crash'));
  assert.equal(log.t, 1000000);
  assert.match(log.msg, /boom nella schermata/);
});

test('ErrorBoundary usa gestisciCrash; App segna l\'avvio riuscito', () => {
  const eb = tra('class ErrorBoundary', '\nif (!window.__TEST_MODE__)');
  assert.match(eb, /gestisciCrash\(err\)/);
  assert.doesNotMatch(eb, /resetStorageRecovery\(\)/);
  assert.match(tra('function App()', '\n// Error boundary'), /useEffect\(\(\) => \{\s*segnaAvvioRiuscito\(\);\s*\}, \[\]\);/);
});
