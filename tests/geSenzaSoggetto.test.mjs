// Genovese (segnalazione di Dino, 2026-10-03): il soggetto pieno (mi, ti, lé,
// niatri...) è facoltativo, il clitico (t', o, l', a) no. La risposta più
// naturale, "o l'amma" / "t'è" / "o va", veniva rifiutata: si accettavano solo
// la forma intera e quella nuda ("amma"). Idem il congiuntivo senza "che".
// Ora sono accettate anche le forme senza "che" e senza soggetto pieno, col
// clitico. La persona sbagliata resta sbagliata.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const NUMERI_PAROLE = {', '\nconst SR = '),
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  'globalThis.isCorretta = isCorretta;',
].join('\n'), ctx);

// come verificaRisposta: atteso + varianti dialettali
function giusta(atteso, risposta) {
  const basi = [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)];
  const conf = basi.length ? atteso + '|' + basi.join('|') : atteso;
  return ctx.isCorretta(conf, risposta, 'it-IT', 'ge', true);
}

test('senza soggetto pieno, col clitico: accettata', () => {
  assert.ok(giusta("lé u l'amma/lê o l'amma", "o l'amma"));
  assert.ok(giusta("lé u l'amma/lê o l'amma", "u l'amma"));
  assert.ok(giusta("ti t'ammi", "t'ammi"));
  assert.ok(giusta("ti t'è/ti t'æ", "t'æ"));
  assert.ok(giusta('ti ti vè/ti ti væ', 'ti væ'));
  assert.ok(giusta("lé u l'a ammuu/lê o l'à ammou", "o l'à ammou"), 'passato');
  assert.ok(giusta('niatri ammémmu/niatri ammemmo', 'ammemmo'));
});

test('congiuntivo senza "che": accettato, con o senza soggetto', () => {
  assert.ok(giusta('che mi amme', 'mi amme'));
  assert.ok(giusta("che lé u l'amme/che lê o l'amme", "lê o l'amme"));
  assert.ok(giusta("che lé u l'amme/che lê o l'amme", "o l'amme"));
});

test('le forme intere restano giuste, la persona sbagliata resta sbagliata', () => {
  assert.ok(giusta("lé u l'amma/lê o l'amma", "lê o l'amma"));
  assert.ok(!giusta('ti t\'ammi', "o l'amma"));
  assert.ok(!giusta("lé u l'amma/lê o l'amma", "t'ammi"));
});

test('verificaRisposta usa anche le varianti senza soggetto', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /variantiSenzaSoggettoDialetto\(atteso\)/);
});
