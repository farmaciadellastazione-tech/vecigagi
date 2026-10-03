// Review 2026-10-03 (commit 1580bf4): aggiungere ge/cr/la a SOGGETTI per
// mostrarli nella domanda li faceva usare anche a rimuoviSoggetto, che toglie
// QUALUNQUE pronome della lingua: "ti son" passava per "mi son", "tu sum" per
// "sum", cr "lór a son" per la 1ª sing. Ora quei soggetti sono solo per la
// domanda; nella risposta si toglie solo il pronome della persona giusta.
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
  tra('const PRONUNCIA_TTS_SOGGETTO', '\nconst CONIUGAZIONI'),
  'globalThis.isCorretta = isCorretta; globalThis.tps = togliPronomePienoDialetto; globalThis.fcs = formaConSoggetto;',
].join('\n'), ctx);

// come verificaRisposta per una carta coniugazione
function giusta(atteso, risposta, cod, persona) {
  const dial = ctx.DIALETTI_TTS_ITA.includes(cod);
  const basi = dial ? [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)] : [];
  const conf = basi.length ? atteso + '|' + basi.join('|') : atteso;
  if (ctx.isCorretta(conf, risposta, 'it-IT', cod, true)) return true;
  const s = ctx.tps(risposta, cod, persona);
  return s !== risposta && ctx.isCorretta(conf, s, 'it-IT', cod, true);
}

test('soggetto della persona sbagliata: sbagliata', () => {
  assert.ok(!giusta('a son', 'lór a son', 'cr', '1ª sing.'));
  assert.ok(!giusta('a son', 'te a son', 'cr', '1ª sing.'));
  assert.ok(!giusta('mi sun/mi son', 'ti son', 'ge', '1ª sing.'));
  assert.ok(!giusta('niatri sémmu/niatri semmo', 'viatri semmo', 'ge', '1ª plur.'));
  assert.ok(!giusta("lé u l'é/lê o l'é", "niatri o l'é", 'ge', '3ª sing.'));
  assert.ok(!giusta('sum', 'tu sum', 'la', '1ª sing.'));
  assert.ok(!giusta('o tia', 'ti o tia', 'ge', '3ª sing.'));
});

test('soggetto della persona giusta (quello mostrato nella domanda): giusta', () => {
  assert.ok(giusta('o tia', 'lê o tia', 'ge', '3ª sing.'));
  assert.ok(giusta('poemmo|poemo', 'niatri poemmo', 'ge', '1ª plur.'));
  assert.ok(giusta('sum', 'ego sum', 'la', '1ª sing.'));
  assert.ok(giusta('amat', 'is amat', 'la', '3ª sing.'));
  assert.ok(giusta('a son', 'me a son', 'cr', '1ª sing.'));
});

test('la domanda mostra ancora i soggetti di ge/cr/la', () => {
  assert.strictEqual(ctx.fcs('o tia', '3ª sing.', 'ge'), 'lê o tia');
  assert.strictEqual(ctx.fcs('amat', '3ª sing.', 'la'), 'is amat');
  assert.strictEqual(ctx.fcs("t'sen", '2ª sing.', 'cr'), "te t'sen");
});
