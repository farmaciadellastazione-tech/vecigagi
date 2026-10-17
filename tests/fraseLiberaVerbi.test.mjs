// "Fai una frase con" anche sui verbi sbagliati (richiesta di Dino, 2026-10-17).
// La carta di una coniugazione diventa, per Frase libera, la forma coniugata
// con il soggetto ("je parle" / "io parlo") più verbo, tempo e persona; l'IA
// deve controllare che la frase usi proprio quella forma.
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
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  tra('const PRONUNCIA_TTS_SOGGETTO', '\nconst CONIUGAZIONI'),
  tra('const CONIUGAZIONI = {', '\n// Genera esercizi dal database coniugazioni'),
  tra('function entryFraseDaConiugazione(', '\n// ── fine verbi frase'),
  tra('function codaFraseDaErrate(', '\n// ── fine coda frase'),
  'globalThis.conv = entryFraseDaConiugazione; globalThis.nota = notaConiugazione; globalThis.coda = codaFraseDaErrate;',
  'globalThis.DIALETTI_TTS_ITA = DIALETTI_TTS_ITA;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const fr = { codice: 'fr', nome: 'Francese' };
const carta = { tipo: 'coniugazione', verbKey: 'parlare', tempoKey: 'presente', persona: '1ª sing. (io/I/je...)', lA: fr, atteso: 'parle', entry: { it: 'parlo', fr: 'parle' }, key: 'k1' };

test('il verbo diventa forma con soggetto, significato italiano, verbo/tempo/persona', () => {
  const e = j(ctx.conv(carta));
  assert.strictEqual(e.fr, 'je parle');
  assert.strictEqual(e.it, 'io parlo');
  assert.strictEqual(e.tema, 'verbi');
  assert.deepStrictEqual(e.coniugazione, { chiave: 'parlare__presente__1ª sing.', verbo: 'parlare', tempo: 'Presente', persona: '1ª sing.' });
});

test('nota per l\'IA solo per i verbi', () => {
  assert.match(ctx.nota(ctx.conv(carta)), /conjugated verb form .*parlare.*Presente.*1ª sing\..*this verb in this tense and person/);
  assert.strictEqual(ctx.nota({ it: 'casa', fr: 'maison' }), '');
});

test('in coda anche i verbi, una volta sola per forma', () => {
  const errate = [
    { carta, lA: fr },
    { carta: { ...carta, key: 'k2' }, lA: fr },
    { carta: { entry: { it: 'casa', fr: 'maison' }, tipo: 'normale' }, lA: fr },
  ];
  const c = ctx.coda(errate, e => e.carta.tipo === 'coniugazione' ? ctx.conv(e.carta) : e.carta.entry);
  assert.strictEqual(c.length, 2);
  assert.strictEqual(c[0].entry.fr, 'je parle');
});

test('il pulsante compare anche sui verbi e Frase libera mostra verbo e tempo', () => {
  assert.doesNotMatch(HTML, /onFaiFrase && e\.carta\.tipo !== "coniugazione"/);
  assert.match(HTML, /onFaiFrase\(voceFraseDaCarta\(e\.carta\), lA\)/);
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  assert.match(fl, /carta\.entry\.coniugazione && /);
  assert.ok((fl.match(/notaConiugazione\(carta\.entry\)/g) || []).length >= 2);
});

// Review di 8582747:
test('conta la forma del verbo, non il soggetto scelto', () => {
  const t = ctx.nota(ctx.conv(carta));
  assert.match(t, /any subject that fits/);
  assert.doesNotMatch(t, /exactly this form/);
});

test('dialetti: la forma resta "pronuncia/grafia" com\'è nei dati', () => {
  const sp = { codice: 'sp', nome: 'Spezzino' };
  const e = ctx.conv({ ...carta, lA: sp, atteso: "a pàrlo/a parlo" });
  assert.strictEqual(e.sp, 'a pàrlo/a parlo');
});

test('significato italiano anche se la riga del verbo non si trova', () => {
  const e = ctx.conv({ ...carta, verbKey: 'inesistente', entry: { it: 'parlo', fr: 'parle' } });
  assert.match(e.it, /parlo/);
});

test('due parole diverse con lo stesso italiano restano entrambe; i verbi senza conversione restano fuori', () => {
  const a = { it: 'pesca', fr: 'pêche' }, b = { it: 'pesca', fr: 'pêche (sport)' };
  const errate = [{ carta: { entry: a, tipo: 'normale' }, lA: fr }, { carta: { entry: b, tipo: 'normale' }, lA: fr }, { carta, lA: fr }];
  const c = ctx.coda(errate);
  assert.strictEqual(c.length, 2, 'la coniugazione senza conversione non entra');
  assert.ok(c[1].entry === b);
});

test('un solo convertitore carta → voce, usato dal pulsante e dalla coda', () => {
  assert.match(HTML, /function voceFraseDaCarta\(carta\)/);
  assert.match(HTML, /onFaiFrase\(voceFraseDaCarta\(e\.carta\), lA\)/);
  assert.match(HTML, /codaFraseDaErrate\(carteErrate, e => voceFraseDaCarta\(e\.carta\)\)/);
});
