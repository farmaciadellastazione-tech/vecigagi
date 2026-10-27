// Senza IA (richiesta di Dino, 2026-10-27): chi usa l'app spesso non ha una
// chiave IA. Ogni funzione con l'IA deve dirlo con un avviso e un pulsante
// "Configura IA", non partire a vuoto né mostrare errori HTTP.
// Passo 1: iaConfigurata (un solo controllo per tutti) e protezione di
// riserva in callAI: senza chiave nessuna chiamata, messaggio comprensibile.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
// a capo uniformati: con core.autocrlf la copia locale ha CRLF
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const chiamate = [];
const ctx = vm.createContext({
  fetch: async (url) => { chiamate.push(url); return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }) }; },
  AI_MAX_TOKENS: 1000,
});
ctx.globalThis = ctx;
vm.runInContext([
  tra('const GROQ_MODELS = {', '\n};') + '\n};',
  tra('function messaggioErroreHttpAI(', '\n}') + '\n}',
  tra('// ── Senza IA', '\nasync function callAI('),
  tra('async function callAI(', '\n}\n') + '\n}',
  'Object.assign(globalThis, { callAI, iaConfigurata, MSG_SENZA_IA });',
].join('\n'), ctx);

test('iaConfigurata: serve una chiave vera (più di 10 caratteri, spazi esclusi)', () => {
  assert.equal(ctx.iaConfigurata({ provider: 'gemini', apiKey: 'AIzaSyA-chiave-lunga' }), true);
  assert.equal(ctx.iaConfigurata({ provider: 'gemini', apiKey: '' }), false);
  assert.equal(ctx.iaConfigurata({ apiKey: '           ' }), false);
  assert.equal(ctx.iaConfigurata({ apiKey: 'corta' }), false);
  assert.equal(ctx.iaConfigurata(null), false);
  assert.equal(ctx.iaConfigurata(undefined), false);
});

test('callAI senza chiave: nessuna chiamata, messaggio comprensibile', async () => {
  chiamate.length = 0;
  const r = await ctx.callAI('sys', 'user', { provider: 'gemini', apiKey: '' });
  assert.equal(chiamate.length, 0);
  assert.equal(r, ctx.MSG_SENZA_IA);
  assert.match(r, /^Errore/); // gli estrattori la riconoscono come errore (messaggioErroreAiuto)
  assert.match(r, /chiave IA/);
  assert.match(r, /gratuit/);
  assert.equal(await ctx.callAI('s', 'u', undefined), ctx.MSG_SENZA_IA);
  assert.equal(chiamate.length, 0);
});

test('callAI con la chiave: la chiamata parte come prima', async () => {
  chiamate.length = 0;
  const r = await ctx.callAI('sys', 'user', { provider: 'gemini', apiKey: 'AIzaSyA-chiave-lunga' });
  assert.equal(chiamate.length, 1);
  assert.equal(r, 'ok');
});

test('i controlli sparsi della chiave usano iaConfigurata', () => {
  assert.equal(HTML.split('(aiSettings?.apiKey || "").length > 10').length - 1, 0);
});

// Passo 2: un solo avviso (AvvisoIA, e la schermata intera SchermataSenzaIA)
// con il pulsante che apre le Impostazioni IA; App torna poi dov'era.
// Frase libera e Conversazione senza chiave mostrano l'avviso al posto
// dell'esercizio; in Home restano cliccabili con la riga "Serve una chiave IA".
const SEZ = tra('// ── Senza IA', '\nasync function callAI(');
test('AvvisoIA: spiega cosa serve e porta alle Impostazioni IA', () => {
  const A = tra('function AvvisoIA(', '\nfunction SchermataSenzaIA(');
  assert.match(A, /chiave IA/);
  assert.match(A, /Gemini/);
  assert.match(A, /gratuit/);
  assert.match(A, /ai\.google\.dev/);
  assert.match(A, /onClick: onConfigura/);
  assert.match(A, /Configura IA/);
  assert.match(SEZ, /function SchermataSenzaIA\(\{\s*titolo,\s*onHome,\s*onConfigura\s*\}\)/);
});

test('Frase libera senza chiave: avviso al posto dell\'esercizio', () => {
  const FL = tra('function SchermataFraseLibera(', '\n// ── Conversazioni salvate');
  const i = FL.indexOf('if (!iaConfigurata(aiSettings)) return /*#__PURE__*/React.createElement(SchermataSenzaIA, {');
  assert.ok(i > 0);
  assert.ok(i < FL.indexOf('if (!carta) return'));
  assert.match(FL, /onConfiguraIA\s*\}\) \{/);
});

test('Conversazione senza chiave: avviso, e nessuna partenza automatica', () => {
  const C = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  const i = C.indexOf('if (!iaConfigurata(aiSettings)) return /*#__PURE__*/React.createElement(SchermataSenzaIA, {');
  assert.ok(i > 0);
  assert.ok(i < C.indexOf('if (stato === "archivio") return'));
  assert.match(C, /if \(linguaAuto && iaConfigurata\(aiSettings\)\) iniziaConversazione\(/);
  assert.match(C, /async function iniziaConversazione\(l, argomento\) \{\s*if \(!iaConfigurata\(aiSettings\)\) return;/);
});

test('App apre le Impostazioni IA dalla funzione e poi ci torna', () => {
  assert.match(HTML, /function apriImpostazioniAI\(\) \{\s*setRitornoIA\(schermata\);\s*setSchermata\("impostazioniAI"\);\s*\}/);
  assert.match(HTML, /onIndietro: \(\) => \{\s*setSchermata\(ritornoIA \|\| "home"\);\s*setRitornoIA\(null\);\s*\}/);
  assert.match(tra('createElement(SchermataFraseLibera, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
  assert.match(tra('createElement(SchermataConversazione, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});

test('Home: Frase libera e Conversazione cliccabili, con la riga "Serve una chiave IA"', () => {
  const H = tra('function Home(', '\n// ── Modifica parola');
  assert.match(H, /const serveIA = \(m\.key === "fraseLibera" \|\| m\.key === "conversazione"\) && !iaConfigurata\(aiSettings\);/);
  assert.match(H, /(🔑|\\uD83D\\uDD11) Serve una chiave IA \(gratuita\)/); // emoji letterale o in escape
  assert.match(tra('createElement(Home, {', '});'), /aiSettings: aiSettings,/);
  // non le blocca: niente motivoBlocco per la chiave
  assert.doesNotMatch(H, /motivoBlocco = "[^"]*chiave/);
});

// Passo 3: niente alert() né pulsanti che spariscono. Spiega ed Era giusta?
// mostrano "(configura IA)" che apre le Impostazioni; Ripasso frasi dice che
// senza IA fa solo dettato; Lettura guidata mostra l'avviso al posto dell'alert.
test('Spiega ed Era giusta? senza chiave: "(configura IA)" apre le Impostazioni', () => {
  const S = tra('function SpiegaAI(', '\n// Scelta multipla, progressione globale');
  assert.doesNotMatch(S, /alert\(/);
  const E = tra('function EraGiusta(', '\nfunction SpiegaAI(');
  assert.doesNotMatch(E, /if \(!dialetto && !hasKey\) return null;/);
  // la funzione arriva da un contesto: la chiamata a EraGiusta resta quella
  // fissata da eraGiusta.test
  for (const X of [S, E]) {
    assert.match(X, /\}\) \{\s*const onConfigura = React\.useContext\(ContestoConfiguraIA\);/);
    assert.match(X, /onClick: onConfigura,[\s\S]{0,200}configura IA/);
  }
  assert.match(HTML, /createElement\(ContestoConfiguraIA\.Provider, \{\s*value: onConfiguraIA\s*\}, \/\*#__PURE__\*\/React\.createElement\(SpiegaAI, \{/);
  assert.match(tra('function SchermataQuiz(', '}) {'), /onConfiguraIA/);
  assert.match(tra('createElement(SchermataQuiz, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});

test('Ripasso frasi senza chiave: dice che fa solo dettato e porta alle Impostazioni', () => {
  const R = tra('function SchermataRipassoFrasi(', '\n}\n');
  assert.match(R, /onConfiguraIA\s*\}\) \{/);
  assert.match(R, /!conIA && \/\*#__PURE__\*\/React\.createElement\(/);
  assert.match(R, /Senza IA solo dettato/);
  assert.match(R, /onClick: onConfiguraIA/);
  assert.match(tra('createElement(SchermataRipassoFrasi, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});

test('Lettura guidata senza chiave: avviso al posto degli alert', () => {
  const L = tra('function SchermataLetturaGuidata(', '\nfunction SchermataQuiz(');
  assert.doesNotMatch(L, /alert\("Inserisci una chiave/);
  assert.match(L, /onConfiguraIA\s*\}\) \{/);
  assert.match(L, /setStatoSpiega\("senzaIA"\)/);
  assert.match(L, /statoSpiega === "senzaIA" && React\.createElement\(AvvisoIA, \{\s*onConfigura: onConfiguraIA\s*\}\)/);
  assert.match(L, /setFormSenzaIA\(true\)/);
  assert.match(L, /formSenzaIA && React\.createElement\(AvvisoIA, \{\s*onConfigura: onConfiguraIA\s*\}\)/);
  assert.match(tra('createElement(SchermataLetturaGuidata, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});
