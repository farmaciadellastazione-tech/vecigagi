// Bug segnalato da Dino (2026-10-29): nel vocabolario "tu sei" (mn "tèi")
// scrivendo "tö tèi" (o "to tei") dava errore. rimuoviSoggetto conosce solo
// SOGGETTI, dove il manarolese non c'è; nelle coniugazioni funzionava già
// (togliPronomePienoDialetto, per persona).
// Dopo la code review: non si toglie qualunque soggetto mn (passavano "mö tèi"
// per "tu sei" e "tö cà" per "casa"), ma solo quello della persona ricavata
// dal soggetto italiano della voce ("tu sei" → 2ª sing.), dalla risposta e
// dalla forma prevista, con togliPronomePienoDialetto come nelle coniugazioni.
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
  tra('const NUMERI_PAROLE = {', '\nconst SR = '),
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  tra('const SEPARATORI_ALTERNATIVE = ', '\n'),
  'Object.assign(globalThis, { isCorretta, personaDaSoggettoItaliano, confrontoSenzaPronome });',
].join('\n'), ctx);
// Come verificaRisposta per una voce del vocabolario manarolese
const giusta = (it, atteso, r) => {
  if (ctx.isCorretta(atteso, r, 'it-IT', 'mn')) return true;
  const persona = ctx.personaDaSoggettoItaliano(it);
  if (!persona) return false;
  const c = ctx.confrontoSenzaPronome(atteso, r, 'mn', persona);
  return ctx.isCorretta(c.atteso, c.risposta, 'it-IT', 'mn');
};

test('persona dal soggetto italiano della voce', () => {
  assert.equal(ctx.personaDaSoggettoItaliano('tu sei'), '2ª sing.');
  assert.equal(ctx.personaDaSoggettoItaliano('io vado'), '1ª sing.');
  assert.equal(ctx.personaDaSoggettoItaliano('lei canta'), '3ª sing. f.');
  assert.equal(ctx.personaDaSoggettoItaliano('voi partite'), '2ª plur.');
  assert.equal(ctx.personaDaSoggettoItaliano('loro dormono'), '3ª plur.');
  assert.equal(ctx.personaDaSoggettoItaliano('casa'), null);
  assert.equal(ctx.personaDaSoggettoItaliano('tu'), null); // il pronome da solo non è un soggetto con verbo
  assert.equal(ctx.personaDaSoggettoItaliano(''), null);
});

test('manarolese, vocabolario: soggetto giusto davanti accettato', () => {
  assert.equal(giusta('tu sei', 'tèi', 'tö tèi'), true);
  assert.equal(giusta('tu sei', 'tèi', 'to tei'), true);
  assert.equal(giusta('io vado', ' a vagu', 'mö a vagu'), true);
  assert.equal(giusta('tu sei', 'tèi', 'tèi'), true); // senza soggetto, come prima
});

test('manarolese, vocabolario: soggetto facoltativo anche nella forma prevista', () => {
  assert.equal(giusta('voi partite', 'vautri a partii', 'a partii'), true);
  assert.equal(giusta('voi partite', 'vautri a partii', 'vàutri a partii'), true);
});

test('soggetto di un\'altra persona: errore (code review)', () => {
  assert.equal(giusta('tu sei', 'tèi', 'mö tèi'), false);
  assert.equal(giusta('tu sei', 'tèi', 'lü tèi'), false);
  assert.equal(giusta('voi partite', 'vautri a partii', 'mö a partii'), false);
  assert.equal(giusta('voi partite', 'vautri a partii', 'lù a partii'), false);
});

test('voce senza soggetto: niente da togliere (code review: "tö cà")', () => {
  assert.equal(giusta('casa', 'cà', 'tö cà'), false);
  assert.equal(giusta('tu sei', 'tèi', 'tö sun'), false);
});

test('verificaRisposta: solo voci mn del vocabolario, persona dal soggetto italiano', () => {
  const V = tra('function verificaRisposta(', '\n  function salta(');
  assert.match(V, /if \(!ok && carta\.tipo !== "coniugazione" && lA\?\.codice === "mn"\) \{\s*const persona = personaDaSoggettoItaliano\(carta\.entry\?\.it\);/);
  assert.match(V, /const c = confrontoSenzaPronome\(attesoConSinonimi, risposta, "mn", persona\);/);
});

test('rimuoviSoggetto e SOGGETTI_PER_PERSONA non conoscono il manarolese', () => {
  assert.doesNotMatch(tra('function rimuoviSoggetto(', '\n}'), /mn/);
  assert.doesNotMatch(tra('const SOGGETTI_PER_PERSONA = {', '\n};'), /mn:/);
});
