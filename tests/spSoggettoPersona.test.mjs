// Review di c3e3e54: con "te" e "me" tra i soggetti spezzini, rimuoviSoggetto
// (che toglie QUALUNQUE soggetto della lingua) faceva passare "me ami" e
// "lü ami" per "te ami". Ora per lo spezzino il soggetto nella risposta si
// toglie solo per persona (PRONOMI_PIENI_DIALETTO), come ge/cr/la.
// La forma nuda ("ami") resta accettata, come prima.
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
  'globalThis.isCorretta = isCorretta; globalThis.tps = togliPronomePienoDialetto;',
].join('\n'), ctx);

function giusta(atteso, risposta, persona) {
  const basi = [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)];
  const conf = basi.length ? atteso + '|' + basi.join('|') : atteso;
  if (ctx.isCorretta(conf, risposta, 'it-IT', 'sp', true)) return true;
  const s = ctx.tps(risposta, 'sp', persona);
  return s !== risposta && ctx.isCorretta(conf, s, 'it-IT', 'sp', true);
}

test('sp: soggetto della persona sbagliata → sbagliata', () => {
  assert.ok(!giusta('te ami', 'me ami', '2ª sing.'));
  assert.ok(!giusta('te ami', 'lü ami', '2ª sing.'));
  assert.ok(!giusta('i ama', 'me i ama', '3ª sing.'));
});

test('sp: soggetto giusto, forma completa e forma nuda → giusta', () => {
  assert.ok(giusta('te ami', 'te te ami', '2ª sing.'));
  assert.ok(giusta('te ami', 'te ami', '2ª sing.'));
  assert.ok(giusta('te ami', 'ami', '2ª sing.'));
  assert.ok(giusta('i ama', 'lü i ama', '3ª sing.'));
  assert.ok(giusta("l'è", "lé l'è", '3ª sing. f.'));
  assert.ok(giusta('i en', 'lóo i en', '3ª plur.'));
  assert.ok(giusta('a son', 'me a son', '1ª sing.'));
});
