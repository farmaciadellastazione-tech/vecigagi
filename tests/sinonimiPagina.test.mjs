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
  'Object.assign(globalThis, { salvaSinonimo, sinonimiAccettati, elencoSinonimi, togliSinonimo, togliTuttiSinonimi, unisciSinonimi, contaSinonimi, SK_SINONIMI, MAX_SINONIMI_PER_VOCE });',
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
  // code review: stesso conteggio della pagina (dati rovinati = niente icona)
  assert.match(H, /contaSinonimi\(\) > 0 &&\/\*#__PURE__\*\/React\.createElement\("button", \{\s*onClick: onSinonimi,/);
  assert.match(tra('createElement(Home, {', '});'), /onSinonimi: \(\) => setSchermata\("sinonimi"\)/);
  assert.match(HTML, /if \(schermata === "sinonimi"\) return \/\*#__PURE__\*\/React\.createElement\(SchermataSinonimi, \{\s*vocabolario: vocabolario,\s*lingue: lingue,\s*onHome: \(\) => setSchermata\("home"\)\s*\}\);/);
});

// Passo 3: "Salva progressi" porta anche i sinonimi; caricando un file si
// uniscono a quelli già nel browser (niente doppioni, niente dati strani).
test('unire i sinonimi da un file di progressi', () => {
  azzera();
  ctx.salvaSinonimo(BELLO, 'pretty');
  const kBello = j(ctx.elencoSinonimi(VOC))[0].chiave;
  ctx.unisciSinonimi({
    [kBello]: ['Pretty', 'lovely', 3, '', 'a/b'],
    'it|perche|en|because': ['since'],
    'rotta': ['x'],
    'it|x|en|y': 'non una lista',
  });
  assert.deepEqual(j(ctx.sinonimiAccettati(BELLO)), ['pretty', 'lovely']);
  assert.deepEqual(j(ctx.sinonimiAccettati(PERCHE)), ['since']);
  assert.deepEqual(Object.keys(JSON.parse(memoria[ctx.SK_SINONIMI])).sort(), [kBello, 'it|perche|en|because'].sort());
  // file strani: nessun errore, niente cambia
  for (const x of [null, 'testo', ['a'], 42]) ctx.unisciSinonimi(x);
  assert.deepEqual(j(ctx.sinonimiAccettati(BELLO)), ['pretty', 'lovely']);
  // tetto per voce come al salvataggio
  ctx.unisciSinonimi({ [kBello]: Array.from({ length: 20 }, (_, i) => 'w' + i) });
  assert.equal(ctx.sinonimiAccettati(BELLO).length, ctx.MAX_SINONIMI_PER_VOCE);
});

test('esportazione e importazione dei progressi portano i sinonimi', () => {
  const E = tra('function esportaProgressi(', '\nfunction importaProgressi(');
  assert.match(E, /sinonimi: caricaSinonimi\(\)/);
  const I = tra('function importaProgressi(', '\n// ── Ripetizione spaziata');
  assert.match(I, /const sinonimiOk = !data\.sinonimi \|\| unisciSinonimi\(data\.sinonimi, codiciLingueNote\(data\.lingue\)\);/);
  assert.match(I, /onDone\(data, !sinonimiOk\);/);
});

// Code review (2026-10-27)
const kB = 'it|bello|en|beautiful';
test('unire: oltre il tetto si scartano quelli del file, mai quelli del browser', () => {
  azzera();
  ctx.salvaSinonimo(BELLO, 'pretty');
  ctx.salvaSinonimo(BELLO, 'lovely');
  assert.equal(ctx.unisciSinonimi({ [kB]: Array.from({ length: 10 }, (_, i) => 'w' + i) }), true);
  const l = j(ctx.sinonimiAccettati(BELLO));
  assert.equal(l.length, ctx.MAX_SINONIMI_PER_VOCE);
  assert.deepEqual(l.slice(0, 2), ['pretty', 'lovely']);
});

test('unire: lingue sconosciute e sinonimi uguali alla risposta prevista, fuori', () => {
  azzera();
  ctx.unisciSinonimi({ 'xx|foo|yy|bar': ['z'], [kB]: ['beautiful', 'Beautiful!', 'nice'] }, ['it', 'en']);
  assert.deepEqual(Object.keys(JSON.parse(memoria[ctx.SK_SINONIMI])), [kB]);
  assert.deepEqual(j(ctx.sinonimiAccettati(BELLO)), ['nice']);
});

test('memoria piena o bloccata: unire e cancellare tutti lo dicono', () => {
  azzera();
  const vero = ctx.localStorage;
  ctx.localStorage = { getItem: () => null, setItem: () => { throw new Error('quota'); }, removeItem: () => { throw new Error('bloccato'); } };
  try {
    assert.equal(ctx.unisciSinonimi({ [kB]: ['nice'] }), false);
    assert.equal(ctx.togliTuttiSinonimi(), false);
  } finally { ctx.localStorage = vero; }
  assert.equal(ctx.togliTuttiSinonimi(), true);
});

test('conteggio per l\'icona: come la pagina (dati rovinati non contano)', () => {
  azzera();
  memoria[ctx.SK_SINONIMI] = JSON.stringify({ 'it|bello|fr|beau': [], 'rotta': ['a'], 'it|x|en|y': 'no' });
  assert.equal(ctx.contaSinonimi(), 0);
  ctx.salvaSinonimo(BELLO, 'pretty');
  assert.equal(ctx.contaSinonimi(), 1);
});

test('la pagina avvisa se "Cancella tutti" non riesce; App avvisa se i sinonimi non sono stati salvati', () => {
  const P = tra('function SchermataSinonimi(', '\nfunction EraGiusta(');
  assert.match(P, /if \(!togliTuttiSinonimi\(\)\) alert\(/);
  assert.match(P, /useMemo\(\(\) => elencoSinonimi\(vocabolario\), \[vocabolario, versione\]\)/);
  assert.match(HTML, /importaProgressi\(file, \(data, sinonimiNonSalvati\) => \{/);
  assert.match(HTML, /alert\(UI\[getUILang\(\)\]\.progressiuniti \+ \(sinonimiNonSalvati \? /);
});

// Dino (2026-10-27): un sinonimo poi aggiunto al vocabolario (anche nascosto con
// "|") vale per tutti: nella pagina "✓", senza ✕ (toglierlo non cambierebbe nulla).
test('sinonimi già nel vocabolario (anche dopo "|"): segnati', () => {
  azzera();
  ctx.salvaSinonimo(BELLO, 'pretty');
  ctx.salvaSinonimo(BELLO, 'lovely');
  const voc = [{ it: 'bello', en: 'beautiful|Pretty' }];
  const [r] = j(ctx.elencoSinonimi(voc));
  assert.equal(r.atteso, 'beautiful'); // la parte nascosta non si mostra
  assert.deepEqual(r.sinonimi, ['pretty', 'lovely']);
  assert.deepEqual(r.nelVocabolario, ['pretty']);
  // voce non trovata: nessuno segnato
  assert.deepEqual(j(ctx.elencoSinonimi([]))[0].nelVocabolario, []);
});

test('la pagina: ✓ senza ✕ per quelli già nel vocabolario', () => {
  const P = tra('function SchermataSinonimi(', '\nfunction EraGiusta(');
  assert.match(P, /r\.nelVocabolario\.includes\(s\) \? \/\*#__PURE__\*\/React\.createElement\("span", \{/);
  assert.match(P, /nel vocabolario/);
});
