// Dino 2026-11-01: la voce legge "o vëgne" staccato ("veg-ne"), mentre "ti vëgni"
// suona giusto: la 3ª persona deve avere lo stesso "gn" delle altre.
// Solo la pronuncia (prima della /): grafia mostrata e risposte giuste restano.
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
  tra('const PRONUNCIA_TTS_SOGGETTO', '// Restituisce il testo da leggere'),
  tra('function testoAudio', '\n}\n') + '\n}',
  tra('function rimuoviSoggetto', '// Solo confronti esatti'),
  tra('function isCorretta', '\n}\n') + '\n}',
  tra('const CONIUGAZIONI = {', '\n};\n') + '\n};',
  'globalThis.CONIUGAZIONI = CONIUGAZIONI; globalThis.testoAudio = testoAudio; globalThis.ok = isCorretta; globalThis.senzaPronome = togliPronomePienoDialetto;',
].join('\n'), ctx);
const forma = p => ctx.CONIUGAZIONI.venire.tempi.presente.forme.find(f => f.p === p).ge;

test('audio della 3ª persona: gn unito, col soggetto', () => {
  assert.strictEqual(ctx.testoAudio(forma('3ª sing.'), '3ª sing.', 'ge'), 'lê o vegne');
  assert.strictEqual(ctx.testoAudio(forma('3ª sing. f.'), '3ª sing. f.', 'ge'), 'lê a vegne');
});

test('grafia mostrata: resta vëgne', () => {
  assert.strictEqual(ctx.formaDisplay(forma('3ª sing.'), 'ge'), 'o vëgne');
  assert.strictEqual(ctx.formaDisplay(forma('3ª sing. f.'), 'ge'), 'a vëgne');
});

test('risposte: valgono ancora vëgne e ven', () => {
  for (const r of ['o vëgne', 'o vegne', 'o ven', ctx.senzaPronome('lê o vëgne', 'ge', '3ª sing.')])
    assert.ok(ctx.ok(forma('3ª sing.'), r, 'it-IT', 'ge', true), r);
  for (const r of ['a vëgne', 'a ven'])
    assert.ok(ctx.ok(forma('3ª sing. f.'), r, 'it-IT', 'ge', true), r);
});

test('le altre persone non cambiano', () => {
  assert.strictEqual(forma('1ª sing.'), 'vëgno');
  assert.strictEqual(forma('2ª sing.'), 'ti vëgni');
});

test('solo la parola intera: una forma più lunga non cambia', () => {
  assert.strictEqual(ctx.testoAudio('vëgnesse', '1ª sing.', 'ge'), 'mi vëgnesse');
});
