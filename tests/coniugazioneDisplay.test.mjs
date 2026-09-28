// Coniugazioni dialettali nel quiz: "mi sun/mi son" (pronuncia/grafia) veniva
// mostrato per intero nelle schermate "Risposta"/"Corretta" e letto tutto dalla
// TTS. Deve mostrarsi solo la grafia ("mi son") e leggersi solo la pronuncia.
// Causa: per le carte coniugazione si usava carta.atteso grezzo e carta.a, che
// le carte coniugazione non hanno (hanno carta.lA).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const VOCAB = fs.readFileSync(ROOT + '/vocab.js', 'utf8');

function tra(src, inizio, fine) {
  const a = src.indexOf(inizio);
  if (a < 0) throw new Error('non trovato: ' + inizio);
  return src.slice(a, src.indexOf(fine, a));
}
const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(VOCAB, ctx);
vm.runInContext([
  tra(HTML, 'const SOGGETTI = {', '\n// Altri pronomi soggetto'),
  tra(HTML, 'const PRONUNCIA_TTS_SOGGETTO', '\nconst CONIUGAZIONI'),
  'globalThis.testoAudio = testoAudio;',
].join('\n'), ctx);

test('testoAudio legge solo la pronuncia delle forme dialettali', () => {
  assert.strictEqual(ctx.testoAudio('mi sun/mi son', '1ª sing.', 'ge'), 'mi sun');
  assert.strictEqual(ctx.testoAudio('mi vaggu/mi vaggo|vaddo', '1ª sing.', 'ge'), 'mi vaggu');
});

test('testoAudio non legge le alternative nascoste né i sinonimi dopo "/"', () => {
  assert.strictEqual(ctx.testoAudio('soy/estoy', '1ª sing.', 'es'), 'yo soy');
  assert.strictEqual(ctx.testoAudio('do/make', '1ª sing.', 'en'), 'I do');
});

test('testoAudio aggiunge ancora il soggetto', () => {
  assert.strictEqual(ctx.testoAudio('kann', '3ª sing.', 'de'), 'er kann');
  assert.strictEqual(ctx.testoAudio('kann', '3ª sing. f.', 'de'), 'sie kann');
  assert.strictEqual(ctx.testoAudio('aime', '1ª sing.', 'fr'), "j'aime");
});

test('il quiz non mostra carta.atteso grezzo né usa carta.a per le coniugazioni', () => {
  assert.ok(!HTML.includes('carta.tipo === "coniugazione" ? carta.atteso : formaDisplay('),
    'la risposta di una coniugazione va passata da formaDisplay');
  assert.ok(!HTML.includes('testoAudio(carta.atteso, carta.persona, carta.a)'),
    'le carte coniugazione non hanno carta.a: usare lA.codice');
});
