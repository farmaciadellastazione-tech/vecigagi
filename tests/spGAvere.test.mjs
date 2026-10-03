// Spezzino, avere (conferma di Dino, 2026-10-03): "g'avevi" senza il clitico
// "te" è una risposta accettabile. Si toglie il clitico (a/te/i) solo davanti
// alla particella g'/gh' di avere; le altre forme non cambiano.
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

function giusta(atteso, risposta) {
  const basi = [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)];
  return ctx.isCorretta(basi.length ? atteso + '|' + basi.join('|') : atteso, risposta, 'it-IT', 'sp', true);
}

test('sp avere: accettata la forma con g\' senza clitico', () => {
  assert.ok(giusta("te g'avevi", "g'avevi"));
  assert.ok(giusta("a g'ho", "g'ho"));
  assert.ok(giusta("te gh'è", "gh'è"));
  assert.ok(giusta("a g'avémo", "g'avémo"));
});

test('sp: le altre forme restano come prima', () => {
  assert.ok(giusta("te g'avevi", "te g'avevi"));
  assert.ok(giusta("te g'avevi", 'avevi'));
  assert.ok(!giusta("te g'avevi", "g'aveva"), 'persona sbagliata');
  assert.ok(!giusta('te ami', 'tami'));
});
