// Spezzino (tabella data da Dino, 2026-10-03): soggetti me/te/lü/lé/noi/voi/lóo
// (prima mì/ti/lü/noi/voi/loo, senza femminile), femminile al presente di
// essere "l'è" e avere "la g'ha", e le grafie alternative accettate con "|":
// "a sémo|a semo", "a gh'avé|a g'avé".
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
  'globalThis.S = SOGGETTI; globalThis.C = CONIUGAZIONI; globalThis.ta = testoAudio; globalThis.fcs = formaConSoggetto;',
].join('\n'), ctx);
const riga = (v, p) => ctx.C[v].tempi.presente.forme.find(f => f.p.replace(/ \(.*\)/, '').trim() === p);

test('soggetti spezzini come nella tabella', () => {
  const attesi = { '1ª sing.': 'me', '2ª sing.': 'te', '3ª sing.': 'lü', '3ª sing. f.': 'lé', '1ª plur.': 'noi', '2ª plur.': 'voi', '3ª plur.': 'lóo' };
  for (const [p, s] of Object.entries(attesi)) assert.strictEqual(ctx.S.sp[p], s, p);
});

test('domanda e audio col soggetto spezzino', () => {
  assert.strictEqual(ctx.fcs("l'è", '3ª sing. f.', 'sp'), "lé l'è");
  assert.strictEqual(ctx.ta('i en', '3ª plur.', 'sp'), 'loho i en', 'la TTS legge "lóo" come "loho"');
});

test('femminile e grafie alternative di essere e avere', () => {
  assert.strictEqual(riga('essere', '3ª sing. f.').sp, "l'è");
  assert.strictEqual(riga('avere', '3ª sing. f.').sp, 'la g\'ha');
  assert.strictEqual(riga('essere', '1ª plur.').sp, 'a sémo|a semo');
  assert.strictEqual(riga('avere', '2ª plur.').sp, "a gh'avé|a g'avé");
});
