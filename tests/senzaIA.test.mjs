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
  assert.match(SEZ, /function SchermataSenzaIA\(\{\s*titolo,\s*onHome,\s*onConfigura,/);
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
  // review: l'archivio (rileggere, esportare) non usa l'IA e resta raggiungibile
  const i = C.indexOf('if (!iaConfigurata(aiSettings) && stato !== "archivio") return /*#__PURE__*/React.createElement(SchermataSenzaIA, {');
  assert.ok(i > 0);
  assert.ok(i < C.indexOf('if (stato === "archivio") return'));
  // review: con la finestra sopra la schermata non si rimonta, quindi parte
  // anche quando la chiave arriva dopo (una volta sola)
  assert.match(C, /useEffect\(\(\) => \{\s*if \(linguaAuto && conIA && !convRef\.current\.id\) iniziaConversazione\(linguaAuto, linguaSeed \? iniziale\.argomento : null\);\s*\}, \[conIA\]\);/);
  assert.match(C, /async function iniziaConversazione\(l, argomento\) \{\s*if \(!iaConfigurata\(aiSettings\)\) return;/);
});

// Code review: cambiando schermata quella di partenza si rimontava e perdeva
// tutto (ripasso a metà, testo nel form, frase letta). Ora le Impostazioni IA
// sono una finestra sopra: la schermata sotto resta com'era.
test('App apre le Impostazioni IA in una finestra sopra la schermata', () => {
  assert.match(HTML, /const \[iaAperta, setIaAperta\] = useState\(false\);\s*function apriImpostazioniAI\(\) \{\s*setIaAperta\(true\);\s*\}/);
  assert.doesNotMatch(HTML, /schermata === "impostazioniAI"|ritornoIA/);
  assert.match(tra('createElement(Home, {', '});'), /onImpostazioniAI: apriImpostazioniAI,/);
  const A = tra('function App() {', '\n// Error boundary');
  assert.match(A, /const vista = \(\(\) => \{\s*\/\/[^\n]*\n\s*if \(chiediZona\) return/);
  // sempre lo stesso Fragment: la schermata resta montata mentre la finestra si apre
  assert.match(A, /return \/\*#__PURE__\*\/React\.createElement\(React\.Fragment, null, vista, iaAperta && \/\*#__PURE__\*\/React\.createElement\("div", \{\s*className: "fixed inset-0 z-50 overflow-y-auto bg-black focus:outline-none",\s*onKeyDown: e => e\.stopPropagation\(\),\s*\/\/[^\n]*\n(\s*\/\/[^\n]*\n)*\s*tabIndex: -1,\s*ref: el => \{\s*if \(el && !el\.contains\(document\.activeElement\)\) el\.focus\(\);\s*\}\s*\}, \/\*#__PURE__\*\/React\.createElement\(ImpostazioniAI, \{\s*aiSettings: aiSettings,\s*setAiSettings: setAiSettings,\s*onIndietro: \(\) => setIaAperta\(false\)\s*\}\)\)\);\s*\}\s*$/);
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
  assert.match(R, /!conIA && (i === 0 && )?\/\*#__PURE__\*\/React\.createElement\(/);
  assert.match(R, /Senza IA solo dettato/);
  assert.match(R, /onClick: onConfiguraIA/);
  assert.match(tra('createElement(SchermataRipassoFrasi, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});

test('Lettura guidata senza chiave: avviso al posto degli alert', () => {
  const L = tra('function SchermataLetturaGuidata(', '\nfunction SchermataQuiz(');
  assert.doesNotMatch(L, /alert\("Inserisci una chiave/);
  assert.match(L, /onConfiguraIA\s*\}\) \{/);
  assert.match(L, /setStatoSpiega\("senzaIA"\)/);
  assert.match(L, /statoSpiega === "senzaIA" && React\.createElement\("div", \{[^}]*\}, React\.createElement\(AvvisoIA, \{\s*onConfigura: onConfiguraIA\s*\}\)/);
  assert.match(L, /setFormSenzaIA\(true\)/);
  assert.match(L, /formSenzaIA && React\.createElement\(AvvisoIA, \{\s*onConfigura: onConfiguraIA\s*\}\)/);
  assert.match(tra('createElement(SchermataLetturaGuidata, {', '});'), /onConfiguraIA: apriImpostazioniAI/);
});

// Code review (2026-10-27), punti 1, 4-7
test('Conversazione senza chiave: dall\'avviso si arriva alle conversazioni salvate', () => {
  const C = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(C, /extra: caricaConversazioni\(\)\.length > 0 && \/\*#__PURE__\*\/React\.createElement\("button", \{\s*onClick: apriArchivio,/);
  const S = tra('function SchermataSenzaIA(', '\nasync function callAI(');
  assert.match(S, /function SchermataSenzaIA\(\{\s*titolo,\s*onHome,\s*onConfigura,\s*etichetta = "← Home",\s*extra\s*\}\)/);
  assert.match(S, /\}, etichetta\)/);
  assert.match(S, /onConfigura: onConfigura\s*\}\), extra\)/);
});

test('Frase libera dai risultati: il pulsante dell\'avviso dice dove porta', () => {
  const FL = tra('function SchermataFraseLibera(', '\n// ── Conversazioni salvate');
  assert.match(FL, /onHome: onTornaRisultati \|\| onHome,\s*etichetta: onTornaRisultati \? "\u2190 Risultati" : "\u2190 Home",/);
});

test('Lettura guidata: l\'avviso non tocca la card; con la chiave sparisce', () => {
  const L = tra('function SchermataLetturaGuidata(', '\nfunction SchermataQuiz(');
  assert.match(L, /statoSpiega === "senzaIA" && React\.createElement\("div", \{\s*onClick: e => e\.stopPropagation\(\),\s*className: "mt-3 w-full"\s*\}, React\.createElement\(AvvisoIA, \{/);
  assert.match(L, /useEffect\(\(\) => \{\s*if \(!hasKey\) return;\s*setFormSenzaIA\(false\);\s*setStatoSpiega\(s => s === "senzaIA" \? "idle" : s\);\s*\}, \[hasKey\]\);/);
});

test('Ripasso frasi: la riga "Senza IA" solo sulla prima frase', () => {
  const R = tra('function SchermataRipassoFrasi(', '\n}\n');
  assert.match(R, /!conIA && i === 0 && \/\*#__PURE__\*\/React\.createElement\(/);
});

test('Spiega/Era giusta? fuori dal quiz: il pulsante spiega comunque cosa fare', () => {
  assert.match(HTML, /const ContestoConfiguraIA = React\.createContext\(\(\) => alert\(MSG_SENZA_IA\.replace\(\/\^Errore: \/, ""\)\)\);/);
});
