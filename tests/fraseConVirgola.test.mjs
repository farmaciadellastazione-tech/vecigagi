// Dino 2026-10-30: "Chi pè pè, chi ne pè va a pé" bocciata anche se identica
// alla soluzione: isCorretta spezzava sempre sulla virgola, quindi valevano le
// due metà e mai la frase intera. Le metà restano valide perché la virgola può
// separare anche sinonimi veri.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  'const getOmofoni = () => []; const convertiNumeri = s => s;',
  tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'),
  tra('function rimuoviSoggetto', '// Solo confronti esatti'),
  tra('function isCorretta', '\n}\n') + '\n}',
  'globalThis.ok = isCorretta;',
].join('\n'), ctx);
const FRASE = 'Chi pè pè, chi ne pè va a pé ';

test('frase intera con la virgola: giusta, con e senza virgola e accenti', () => {
  for (const r of ['Chi pè pè, chi ne pè va a pé', 'Chi pè pe, chi ne pe va a pe', 'chi pe pe chi ne pe va a pe'])
    assert.ok(ctx.ok(FRASE, r, 'it-IT', 'sp'), r);
  assert.ok(ctx.ok('quien puede, puede, quien no puede va a pie', 'quien puede, puede, quien no puede va a pie', 'es-ES', 'es'));
});

test('frase con la virgola accanto ad alternative | e /', () => {
  assert.ok(ctx.ok('a, b c|d e', 'a b c', 'it-IT', 'sp'));
  assert.ok(ctx.ok('a, b c|d e', 'd e', 'it-IT', 'sp'));
  assert.ok(ctx.ok('a, b/c, d', 'c d', 'it-IT', 'it'));
});

test('le parti restano valide, una frase diversa no', () => {
  assert.ok(ctx.ok(FRASE, 'Chi pè pè', 'it-IT', 'sp'));
  assert.ok(ctx.ok('casa, abitazione', 'abitazione', 'it-IT', 'it'));
  assert.ok(!ctx.ok(FRASE, 'Chi pè pè, chi ne pè va', 'it-IT', 'sp'));
  assert.ok(!ctx.ok('casa, abitazione', 'casa abitazione due', 'it-IT', 'it'));
});
