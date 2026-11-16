// Ripasso frasi (Dino, 2026-11-16): come in Allenamento, dopo la risposta si
// vede la frase anche nella lingua dei menu, se né la domanda né la risposta
// sono in quella lingua. La traduzione la fa l'IA nella stessa richiesta dei
// riferimenti di inizio sessione e resta salvata (trad[lingua dei menu]).
// Con il solo dialetto niente traduzione (scelta di Dino: l'IA li traduce male
// e chi li scrive sa già cosa significano); dal dialetto verso una lingua sì.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
  SK_CONVERSAZIONI: 'qml_v1_conversazioni',
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext(tra('const NUMERI_PAROLE = {', '\nfunction convertiNumeri(') + '\n' + tra('function convertiNumeri(', '\n}') + '\n}\nglobalThis.convertiNumeri = convertiNumeri;', ctx);
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'Object.assign(globalThis, { serveTradUIRipasso, richiesteTradRipasso, promptTraduzioniRipasso, estraiTraduzioniRipasso, traduciLottiRipasso, LOTTO_TRAD_RIPASSO });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');

const frase = (cod, modo, a = null, extra = {}) => ({ testo: 'Frase.', cod, chiave: cod + '|frase.', modo, a, nomeDa: cod, nomeA: a || '', ...extra });

test('quando serve: frase e risposta entrambe fuori dalla lingua dei menu', () => {
  // dettato e voce: la risposta è nella lingua della frase
  assert.equal(ctx.serveTradUIRipasso(frase('en', 'dettato'), 'it'), true);
  assert.equal(ctx.serveTradUIRipasso(frase('en', 'voce'), 'it'), true);
  assert.equal(ctx.serveTradUIRipasso(frase('it', 'dettato'), 'it'), false);
  // traduzione: serve solo se né la frase né l'arrivo sono la lingua dei menu
  assert.equal(ctx.serveTradUIRipasso(frase('en', 'traduzione', 'fr'), 'it'), true);
  assert.equal(ctx.serveTradUIRipasso(frase('en', 'traduzione', 'it'), 'it'), false);
  assert.equal(ctx.serveTradUIRipasso(frase('it', 'traduzione', 'en'), 'it'), false);
  // lingua dei menu diversa dall'italiano
  assert.equal(ctx.serveTradUIRipasso(frase('it', 'dettato'), 'en'), true);
  assert.equal(ctx.serveTradUIRipasso(frase('fr', 'traduzione', 'en'), 'en'), false);
});

// Dino, 2026-11-16: con il solo dialetto (dettato, voce) niente; se oltre al
// dialetto c'è una lingua (traduzione dal dialetto) la traduzione si fa.
test('dialetti: solo se c\'è anche una lingua; senza lingua dei menu (niente IA) mai', () => {
  for (const d of ['sp', 'mn', 'ge', 'cr']) {
    assert.equal(ctx.serveTradUIRipasso(frase(d, 'dettato'), 'it'), false);
    assert.equal(ctx.serveTradUIRipasso(frase(d, 'voce'), 'it'), false);
    assert.equal(ctx.serveTradUIRipasso(frase(d, 'traduzione', 'en'), 'it'), true);
    assert.equal(ctx.serveTradUIRipasso(frase(d, 'traduzione', 'it'), 'it'), false);
  }
  assert.equal(ctx.serveTradUIRipasso(frase('en', 'dettato'), null), false);
  assert.equal(ctx.serveTradUIRipasso(undefined, 'it'), false);
});

test('una sola richiesta: riferimenti mancanti + traduzioni nella lingua dei menu non salvate', () => {
  const piano = [
    frase('en', 'traduzione', 'fr', { rif: '' }),            // rif + ui
    frase('de', 'dettato', null, { ui: '' }),                // solo ui
    frase('fr', 'dettato', null, { ui: 'Già salvata.' }),     // niente: già in cache
    frase('es', 'traduzione', 'it', { rif: '' }),            // solo rif (arrivo = menu)
    frase('sp', 'dettato'),                                  // solo dialetto: niente
    frase('mn', 'traduzione', 'en', { rif: 'Ok.', ui: '' }),  // dialetto → lingua: ui
  ];
  const r = ctx.richiesteTradRipasso(piano, 'it', 'Italiano');
  assert.deepEqual(r.map(x => [x.cod, x.campo, x.a, x.nomeA]), [
    ['en', 'rif', 'fr', 'fr'],
    ['en', 'ui', 'it', 'Italiano'],
    ['de', 'ui', 'it', 'Italiano'],
    ['es', 'rif', 'it', 'it'],
    ['mn', 'ui', 'it', 'Italiano'],
  ]);
  // ogni richiesta porta la frase a cui scrivere il risultato
  assert.equal(r[0].item, piano[0]);
  assert.equal(r[1].item, piano[0]);
  assert.equal(r[2].item, piano[1]);
  // tutto in cache: nessuna richiesta
  assert.deepEqual(j(ctx.richiesteTradRipasso([frase('de', 'dettato', null, { ui: 'Ok.' })], 'it', 'Italiano')), []);
});

test('stessa frase verso due lingue: le traduzioni non si scambiano', () => {
  const piano = [frase('en', 'traduzione', 'fr', { testo: 'I go home.', nomeDa: 'Inglese', nomeA: 'Francese', rif: '' })];
  const r = ctx.richiesteTradRipasso(piano, 'it', 'Italiano');
  assert.equal(r.length, 2);
  // il prompt chiede la lingua d'arrivo nella risposta
  assert.match(ctx.promptTraduzioniRipasso(r).system, /"lingua"/);
  // l'IA le restituisce invertite e senza numero: decide la lingua
  const raw = JSON.stringify({ traduzioni: [
    { originale: 'I go home.', lingua: 'Italiano', testo: 'Vado a casa.' },
    { originale: 'I go home.', lingua: 'Francese', testo: 'Je rentre.' },
  ] });
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso(raw, r)), { 0: 'Je rentre.', 1: 'Vado a casa.' });
  // numero sbagliato ma lingua giusta: vince la lingua
  const raw2 = JSON.stringify({ traduzioni: [
    { id: 0, originale: 'I go home.', lingua: 'italiano', testo: 'Vado a casa.' },
    { id: 1, originale: 'I go home.', lingua: 'francese', testo: 'Je rentre.' },
  ] });
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso(raw2, r)), { 0: 'Je rentre.', 1: 'Vado a casa.' });
});

test('la schermata: cache, richiesta unica, salvataggio, niente senza IA', () => {
  assert.match(S, /const ui = conIA \? getUILang\(\) : null;/);
  // dal dialetto, come il riferimento, non si riusa (né si salva: vedi sotto)
  assert.match(S, /ui: serveTradUIRipasso\(x, ui\) && !DIALETTI_TTS_ITA\.includes\(x\.cod\) \? stats\[x\.chiave\]\?\.trad\?\.\[ui\] \|\| "" : ""/);
  assert.match(S, /if \(!DIALETTI_TTS_ITA\.includes\(x\.cod\)\) salvaTradRipasso\(x\.chiave, x\.a, trad\[k\]\);/);
  assert.match(S, /const mancanti = richiesteTradRipasso\(piano, ui, lingua\(ui\)\.nome\);/);
  assert.match(S, /x\.item\[x\.campo\] = trad\[k\];/);
  // se manca il riferimento si passa al dettato; se manca solo la traduzione nei menu, niente
  assert.match(S, /\} else if \(x\.campo === "rif"\) x\.item\.modo = "dettato";/);
});

test('la schermata: dopo la risposta la frase nella lingua dei menu', () => {
  assert.match(S, /item\.ui && \/\*#__PURE__\*\/React\.createElement\("div", \{[^}]*\}, \/\*#__PURE__\*\/React\.createElement\("span", \{[^}]*\}, lingua\(getUILang\(\)\)\.bandiera\), \/\*#__PURE__\*\/React\.createElement\("p", \{[^}]*\}, item\.ui\)\)/);
});

// Bug 2026-11-16 (Dino, Gemini dal cellulare): dettato in francese, nessuna
// traduzione. Tutte le traduzioni della sessione (fino a ~20) andavano in UNA
// richiesta con tetto di 1000 token, e Gemini 2.5 Flash spende parte del tetto
// nel "ragionamento": risposta vuota o tagliata, traduzioni perse in silenzio.
// Ora: richieste piccole (lotti), Gemini senza ragionamento, avviso se manca.
test('traduzioni a lotti: richieste piccole, risultati rimessi al loro posto', async () => {
  const piano = Array.from({ length: 10 }, (_, k) => frase('en', 'dettato', null, { testo: `Frase ${k}.`, nomeDa: 'Inglese', ui: '' }));
  const r = ctx.richiesteTradRipasso(piano, 'it', 'Italiano');
  assert.equal(r.length, 10);
  const chiamate = [];
  const finta = async (system, user, cfg, opts) => {
    chiamate.push({ user, opts });
    const righe = [...user.matchAll(/^(\d+)\. Da .*?: "(.*)"$/gm)];
    return JSON.stringify({ traduzioni: righe.map(m => ({ id: Number(m[1]), originale: m[2], lingua: 'Italiano', testo: 'IT ' + m[2] })) });
  };
  const trad = await ctx.traduciLottiRipasso(r, {}, finta);
  assert.ok(chiamate.length > 1, 'più richieste');
  chiamate.forEach(c => {
    assert.ok([...c.user.matchAll(/^\d+\. /gm)].length <= ctx.LOTTO_TRAD_RIPASSO);
    assert.deepEqual(j(c.opts), { senzaRagionamento: true });
  });
  for (let k = 0; k < 10; k++) assert.equal(trad[k], `IT Frase ${k}.`);
});

test('traduzioni a lotti: un lotto fallito non fa perdere gli altri', async () => {
  const piano = Array.from({ length: 2 * ctx.LOTTO_TRAD_RIPASSO }, (_, k) => frase('en', 'dettato', null, { testo: `Frase ${k}.`, nomeDa: 'Inglese', ui: '' }));
  const r = ctx.richiesteTradRipasso(piano, 'it', 'Italiano');
  let n = 0;
  const finta = async (system, user) => {
    if (n++ === 0) return 'Errore risposta AI';
    const righe = [...user.matchAll(/^(\d+)\. Da .*?: "(.*)"$/gm)];
    return JSON.stringify({ traduzioni: righe.map(m => ({ id: Number(m[1]), originale: m[2], testo: 'IT ' + m[2] })) });
  };
  const trad = await ctx.traduciLottiRipasso(r, {}, finta);
  for (let k = 0; k < ctx.LOTTO_TRAD_RIPASSO; k++) assert.equal(trad[k], undefined);
  const ultima = 2 * ctx.LOTTO_TRAD_RIPASSO - 1;
  assert.equal(trad[ultima], `IT Frase ${ultima}.`);
  // anche un lotto che lancia un'eccezione
  const lancia = async () => { throw new Error('rete'); };
  assert.deepEqual(j(await ctx.traduciLottiRipasso(r, {}, lancia)), {});
});

test('Gemini senza ragionamento solo quando richiesto', () => {
  const ai = tra('async function callAI(', '\nfunction ContribuisciDialetto(');
  assert.match(ai, /async function callAI\(systemPrompt, userPrompt, aiCfg, opts = \{\}\)/);
  assert.match(ai, /\.\.\.\(opts\.senzaRagionamento \? \{\s*thinkingConfig: \{\s*thinkingBudget: 0\s*\}\s*\} : \{\}\)/);
});

test('la schermata: traduzioni a lotti e avviso se la traduzione nei menu manca', () => {
  assert.match(S, /const trad = await traduciLottiRipasso\(mancanti, aiSettings\);/);
  assert.match(S, /if \(x\.campo === "ui"\) x\.item\.tradPersa = true;/);
  assert.match(S, /!item\.ui && item\.tradPersa && /);
});

// Code review 2026-11-16: se fallisce il riferimento di una traduzione verso la
// lingua dei menu, la frase passa a dettato senza che nessuno abbia chiesto la
// traduzione nei menu: niente traduzione e niente avviso (lo stesso sintomo).
test('riferimento fallito → dettato: avviso anche lì', () => {
  assert.match(S, /piano\.forEach\(x => \{\s*if \(!x\.ui && serveTradUIRipasso\(x, ui\)\) x\.tradPersa = true;\s*\}\);/);
  // il caso: fr → it con menu in italiano, diventato dettato
  assert.equal(ctx.serveTradUIRipasso(frase('fr', 'dettato'), 'it'), true);
});

// Code review 2026-11-16: anche il modello Groq (gpt-oss) ragiona dentro il tetto.
test('Groq: ragionamento al minimo quando richiesto', () => {
  const ai = tra('async function callAI(', '\nfunction ContribuisciDialetto(');
  assert.match(ai, /\.\.\.\(opts\.senzaRagionamento && aiCfg\?\.provider === "groq" \? \{\s*reasoning_effort: "low"\s*\} : \{\}\)/);
});

// Code review 2026-11-16: 5 richieste insieme sforavano il limite al minuto di
// Gemini gratuito; con il ragionamento spento 8 traduzioni stanno nel tetto.
test('al massimo 3 richieste per una sessione da 10 frasi', () => {
  assert.ok(Math.ceil(20 / ctx.LOTTO_TRAD_RIPASSO) <= 3);
});
