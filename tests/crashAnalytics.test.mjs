// Crash inviati a Google Analytics (richiesta di Dino, 2026-11-05: usa quasi
// solo il telefono, dove non c'è la console per leggere qml_v1_ultimo_crash;
// e così si vedono anche i crash degli altri utenti).
// Il crash viene segnato "da inviare" e spedito alla prima apertura riuscita
// (dopo un crash la pagina si ricarica in 100 ms: un evento immediato andrebbe
// perso, soprattutto all'avvio, quando gtag.js non è ancora caricato).
// Si inviano solo dati tecnici: messaggio, componente, link, niente dati utente.
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

function makeCtx(conGtag = true) {
  const map = new Map();
  const localStorage = { map, getItem: k => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: k => map.delete(k) };
  const eventi = [];
  const window = { location: { hash: '', hostname: 'linguaequiz.com', pathname: '/', search: '' }, history: { replaceState() {} } };
  if (conGtag) window.gtag = (...a) => eventi.push(a);
  const ctx = vm.createContext({ localStorage, window, console: { warn() {}, error() {} } });
  const blocco = tra('function loadJSON(', '\nfunction esportaProgressi(');
  vm.runInContext(HTML.match(/^const (?:SK|GH)_[A-Z_]+ = .*$/gm).filter(l => !blocco.includes(l)).join('\n'), ctx);
  vm.runInContext(blocco, ctx);
  return { ctx, map, eventi, window };
}

test('il crash viene registrato come "da inviare", con il componente in cui si è rotto', () => {
  const { ctx, map } = makeCtx();
  vm.runInContext('componenteCrash = "\\n    at SchermataQuiz (index.html:1:1)\\n    at App"; gestisciCrash(new Error("x is undefined"), true, 5);', ctx);
  const log = JSON.parse(map.get('qml_v1_ultimo_crash'));
  assert.equal(log.inviato, false);
  assert.equal(log.componente, 'SchermataQuiz');
});

test('all\'apertura successiva l\'evento app_crash parte una volta sola, con parametri ≤ 100 caratteri', () => {
  const { ctx, eventi } = makeCtx();
  vm.runInContext('componenteCrash = "\\n    at Home (a)"; gestisciCrash(new Error("' + 'm'.repeat(300) + '"), false, 5);', ctx);
  vm.runInContext('inviaCrashInSospeso(); inviaCrashInSospeso();', ctx);
  assert.equal(eventi.length, 1, 'una volta sola');
  const [tipo, nome, p] = eventi[0];
  assert.equal(tipo, 'event');
  assert.equal(nome, 'app_crash');
  assert.equal(p.componente, 'Home');
  assert.equal(p.all_avvio, 'si');
  assert.equal(p.sito, 'linguaequiz.com', 'per distinguere le prove da localhost');
  for (const [k, v] of Object.entries(p)) if (typeof v === 'string') assert.ok(v.length <= 100, `${k} troppo lungo`);
});

test('senza Google Analytics (bloccato, offline) resta in sospeso e parte la volta dopo', () => {
  const a = makeCtx(false);
  vm.runInContext('gestisciCrash(new Error("boom"), true, 5); inviaCrashInSospeso();', a.ctx);
  assert.equal(JSON.parse(a.map.get('qml_v1_ultimo_crash')).inviato, false);
});

test('nessun crash registrato: niente evento', () => {
  const { ctx, eventi } = makeCtx();
  vm.runInContext('inviaCrashInSospeso();', ctx);
  assert.equal(eventi.length, 0);
});

test('collegamenti: ErrorBoundary passa il componente; App e la schermata di blocco inviano', () => {
  const eb = tra('class ErrorBoundary', '\nif (!window.__TEST_MODE__)');
  assert.match(eb, /componentDidCatch\(err, info\)/);
  assert.match(eb, /componenteCrash = /);
  assert.match(eb, /inviaCrashInSospeso\(\)/, 'dalla schermata "non riesce ad avviarsi"');
  assert.match(tra('function App()', '\n// Error boundary'), /useEffect\(\(\) => \{\s*inviaCrashInSospeso\(\);\s*\}, \[\]\);/);
});
