// Pagina "🤝 Sinonimi accettati" (richiesta di Dino, 2026-10-27), passo 1: le
// funzioni. I sinonimi accettati con "🤖 Era giusta?" restavano nel browser
// senza modo di rivederli o cancellarli. La chiave salva le parole normalizzate
// (senza accenti): per mostrarle si ritrova la voce del vocabolario; se non
// c'è più (cambiata con edit.html) si mostra la parola della chiave.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
let memoria = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); },
    removeItem: k => { delete memoria[k]; },
  },
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('// ── Sinonimi accettati', '\n// ── Archivio frasi da ripassare'),
  'Object.assign(globalThis, { salvaSinonimo, sinonimiAccettati, elencoSinonimi, togliSinonimo, togliTuttiSinonimi, SK_SINONIMI });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const azzera = () => { memoria = {}; };
const VOC = [
  { it: 'perché', en: 'because', tema: 'grammatica' },
  { it: 'bello', en: 'beautiful', fr: 'beau' },
];
const PERCHE = { da: 'it', parola: 'perché', a: 'en', atteso: 'because' };
const BELLO = { da: 'it', parola: 'bello', a: 'en', atteso: 'beautiful' };
const BELLO_FR = { da: 'it', parola: 'bello', a: 'fr', atteso: 'beau' };

test('elenco: parole come nel vocabolario (accenti), ordinate per lingue e parola', () => {
  azzera();
  ctx.salvaSinonimo(PERCHE, 'since');
  ctx.salvaSinonimo(BELLO_FR, 'joli');
  ctx.salvaSinonimo(BELLO, 'pretty');
  ctx.salvaSinonimo(BELLO, 'lovely');
  const l = j(ctx.elencoSinonimi(VOC));
  assert.deepEqual(l.map(r => [r.da, r.parola, r.a, r.atteso, r.sinonimi]), [
    ['it', 'bello', 'en', 'beautiful', ['pretty', 'lovely']],
    ['it', 'perché', 'en', 'because', ['since']],
    ['it', 'bello', 'fr', 'beau', ['joli']],
  ]);
  assert.ok(l.every(r => typeof r.chiave === 'string' && r.chiave.startsWith('it|')));
});

test('elenco: voce non più nel vocabolario → la parola della chiave', () => {
  azzera();
  ctx.salvaSinonimo(PERCHE, 'since');
  const [r] = j(ctx.elencoSinonimi([]));
  assert.deepEqual([r.da, r.parola, r.a, r.atteso, r.sinonimi], ['it', 'perche', 'en', 'because', ['since']]);
});

test('elenco: dati rovinati o vuoti non rompono nulla', () => {
  azzera();
  assert.deepEqual(j(ctx.elencoSinonimi(VOC)), []);
  memoria[ctx.SK_SINONIMI] = JSON.stringify({ 'it|bello|en|beautiful': 'x', 'rotta': ['a'], 'it|bello|fr|beau': [], 'it|perche|en|because': ['since', 3, ''] });
  assert.deepEqual(j(ctx.elencoSinonimi(VOC)).map(r => r.sinonimi), [['since']]);
  memoria[ctx.SK_SINONIMI] = '{rotto';
  assert.deepEqual(j(ctx.elencoSinonimi(undefined)), []);
});

test('togliere un sinonimo; la voce sparisce quando resta vuota', () => {
  azzera();
  ctx.salvaSinonimo(BELLO, 'pretty');
  ctx.salvaSinonimo(BELLO, 'lovely');
  const [r] = j(ctx.elencoSinonimi(VOC));
  assert.equal(ctx.togliSinonimo(r.chiave, 'pretty'), true);
  assert.deepEqual(j(ctx.sinonimiAccettati(BELLO)), ['lovely']);
  assert.equal(ctx.togliSinonimo(r.chiave, 'lovely'), true);
  assert.deepEqual(Object.keys(JSON.parse(memoria[ctx.SK_SINONIMI])), []);
  assert.equal(ctx.togliSinonimo(r.chiave, 'lovely'), false); // già tolto
});

test('togliere tutti', () => {
  azzera();
  ctx.salvaSinonimo(BELLO, 'pretty');
  ctx.salvaSinonimo(PERCHE, 'since');
  ctx.togliTuttiSinonimi();
  assert.deepEqual(j(ctx.elencoSinonimi(VOC)), []);
});

// Passo 2: la pagina, aperta da un'icona 🤝 in Home (solo se ce n'è almeno uno).
test('la pagina: elenco per coppia di lingue, ✕ per uno, Cancella tutti con conferma', () => {
  const P = tra('function SchermataSinonimi(', '\nfunction EraGiusta(');
  assert.match(P, /function SchermataSinonimi\(\{\s*vocabolario,\s*lingue,\s*onHome\s*\}\)/);
  assert.match(P, /elencoSinonimi\(vocabolario\)/);
  assert.match(P, /togliSinonimo\(r\.chiave, s\)/);
  assert.match(P, /if \(!confirm\(/);
  assert.match(P, /togliTuttiSinonimi\(\)/);
  assert.match(P, /Era giusta\?/); // spiega da dove vengono
  assert.match(P, /solo da questo browser/);
});

test('Home: icona 🤝 solo con almeno un sinonimo; App apre la pagina', () => {
  const H = tra('function Home(', '\n// ── Modifica parola');
  assert.match(H, /onSinonimi\s*\}\) \{/);
  assert.match(H, /Object\.keys\(caricaSinonimi\(\)\)\.length > 0 && \/\*#__PURE__\*\/React\.createElement\("button", \{\s*onClick: onSinonimi,/);
  assert.match(tra('createElement(Home, {', '});'), /onSinonimi: \(\) => setSchermata\("sinonimi"\)/);
  assert.match(HTML, /if \(schermata === "sinonimi"\) return \/\*#__PURE__\*\/React\.createElement\(SchermataSinonimi, \{\s*vocabolario: vocabolario,\s*lingue: lingue,\s*onHome: \(\) => setSchermata\("home"\)\s*\}\);/);
});
