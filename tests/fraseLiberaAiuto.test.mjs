// Frase libera, aiuto per chi parte da zero (richiesta di Dino, 2026-10-15):
// "💡 Aiutami" traduce una frase scritta in italiano (lingua dei menu) nella
// lingua studiata, con spiegazione parola per parola; "Dammi un'idea" propone
// 2-3 frasi semplici con la parola. La traduzione NON va nella casella: si
// riscrive a mano (scelta di Dino).
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
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('// ── Aiuto Frase libera', '\nfunction SchermataFraseLibera('),
  tra('function estraiCampoStringaJSON(', '\n// Estrae un valore booleano'),
  'globalThis.estraiAiutoTraduzione = estraiAiutoTraduzione; globalThis.estraiIdeeFrase = estraiIdeeFrase; globalThis.evidenziaParola = evidenziaParola; globalThis.messaggioErroreAiuto = messaggioErroreAiuto; globalThis.linguaAiutoNome = linguaAiutoNome;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x)); // via gli oggetti della sandbox
const COMP = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');

test('traduttore: frase e spiegazione parola per parola', () => {
  const raw = '```json\n{"sentence":"Ma maison est près de la mer.","words":[{"w":"ma","t":"mia"},{"w":"maison","t":"casa"}]}\n```';
  assert.deepStrictEqual(j(ctx.estraiAiutoTraduzione(raw)), {
    frase: 'Ma maison est près de la mer.',
    parole: [{ w: 'ma', t: 'mia' }, { w: 'maison', t: 'casa' }],
  });
});

test('traduttore: senza spiegazione o con testo intorno va bene lo stesso', () => {
  assert.deepStrictEqual(j(ctx.estraiAiutoTraduzione('Ecco: {"sentence":"Hola"} fine')), { frase: 'Hola', parole: [] });
});

test('traduttore: risposta illeggibile → null (la UI mostra "riprova")', () => {
  assert.strictEqual(ctx.estraiAiutoTraduzione('non so'), null);
  assert.strictEqual(ctx.estraiAiutoTraduzione('{"sentence":""}'), null);
});

test('idee: al massimo 3 frasi con traduzione, scarta quelle vuote', () => {
  const raw = '{"ideas":[{"sentence":"La maison est grande.","translation":"La casa è grande."},{"sentence":""},{"sentence":"J\'aime ma maison.","translation":"Amo la mia casa."},{"sentence":"A","translation":"a"},{"sentence":"B","translation":"b"}]}';
  assert.deepStrictEqual(j(ctx.estraiIdeeFrase(raw)), [
    { frase: 'La maison est grande.', traduzione: 'La casa è grande.' },
    { frase: "J'aime ma maison.", traduzione: 'Amo la mia casa.' },
    { frase: 'A', traduzione: 'a' },
  ]);
  assert.deepStrictEqual(j(ctx.estraiIdeeFrase('boh')), []);
});

test('evidenzia la parola della carta, senza badare a maiuscole', () => {
  assert.deepStrictEqual(j(ctx.evidenziaParola('Ma Maison est belle', 'maison')), [
    { t: 'Ma ', hit: false }, { t: 'Maison', hit: true }, { t: ' est belle', hit: false },
  ]);
  assert.deepStrictEqual(j(ctx.evidenziaParola('Hello', 'casa')), [{ t: 'Hello', hit: false }]);
  assert.deepStrictEqual(j(ctx.evidenziaParola('un chat noir', 'chat/minou')), [
    { t: 'un ', hit: false }, { t: 'chat', hit: true }, { t: ' noir', hit: false },
  ], 'sinonimi separati da /');
});

test('la traduzione non finisce nella casella: niente setFrase con il risultato dell\'aiuto', () => {
  assert.match(COMP, /Aiutami/);
  assert.match(COMP, /Dammi un'idea/);
  assert.doesNotMatch(COMP, /setFrase\((aiuto|idea|risultato)/);
});

// Review di 327c7b2:
test('evidenzia solo parole intere: "cat" non dentro "category"', () => {
  assert.deepStrictEqual(j(ctx.evidenziaParola('The category: a cat.', 'cat')), [
    { t: 'The category: a ', hit: false }, { t: 'cat', hit: true }, { t: '.', hit: false },
  ]);
  assert.deepStrictEqual(j(ctx.evidenziaParola('Ça va, ça', 'ça')), [
    { t: 'Ça', hit: true }, { t: ' va, ', hit: false }, { t: 'ça', hit: true },
  ], 'lettere accentate ai bordi');
});

test('traduttore: JSON troncato, la frase si recupera lo stesso', () => {
  assert.deepStrictEqual(j(ctx.estraiAiutoTraduzione('{"sentence":"Ma maison est près de la mer.","words":[{"w":"ma","t":')), {
    frase: 'Ma maison est près de la mer.', parole: [],
  });
});

test('errori dell\'IA (chiave mancante, quota, rete) mostrati come sono', () => {
  assert.strictEqual(ctx.messaggioErroreAiuto('Errore AI (HTTP 401): invalid key'), 'Errore AI (HTTP 401): invalid key');
  assert.strictEqual(ctx.messaggioErroreAiuto('Errore connessione: failed'), 'Errore connessione: failed');
  assert.strictEqual(ctx.messaggioErroreAiuto('boh {'), "Non ho capito la risposta dell'IA. Riprova.");
});

test('lingua della spiegazione: quella dei menu, ma italiano se coincide con la lingua della carta', () => {
  assert.strictEqual(ctx.linguaAiutoNome({ codice: 'en', nome: 'Inglese' }, 'fr'), 'Inglese');
  assert.strictEqual(ctx.linguaAiutoNome({ codice: 'en', nome: 'Inglese' }, 'en'), 'Italiano');
  assert.strictEqual(ctx.linguaAiutoNome(undefined, 'en'), 'Italiano');
});

// Dino: l'aiuto IA resta anche sui dialetti (con l'avviso "AI alcolizzata").
// Alla IA e all'evidenziazione va la GRAFIA, non la pronuncia per la TTS.
test('dialetti: aiuto disponibile, con la parola nella grafia (formaDisplay)', () => {
  assert.doesNotMatch(COMP, /aiutoPossibile/);
  assert.match(COMP, /const parolaCarta = carta \? formaDisplay\(carta\.entry\[carta\.lingua\.codice\], carta\.lingua\.codice\)/);
  assert.match(COMP, /evidenziaParola\(aiutoRis\.frase, parolaCarta\)/);
  assert.match(COMP, /evidenziaParola\(idea\.frase, parolaCarta\)/);
  assert.strictEqual(ctx.formaDisplay("d'zena/Zena", 'sp'), 'Zena');
});
