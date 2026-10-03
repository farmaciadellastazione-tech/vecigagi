// Richiesta di Dino (2026-10-03): anche in it/fr/es/pt/en/de/ia una risposta
// con il soggetto della persona sbagliata dev'essere sbagliata. Prima
// rimuoviSoggetto toglieva qualunque soggetto: "du kann" passava per la 3ª
// sing. "kann". Ora verificaRisposta, per le coniugazioni, boccia la risposta
// se comincia con un soggetto della lingua non ammesso per quella persona.
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
  'globalThis.sbagliato = soggettoPersonaSbagliata;',
].join('\n'), ctx);
const s = (r, l, p) => ctx.sbagliato(r, l, p);

test('soggetto di un\'altra persona: sbagliato', () => {
  assert.ok(s('du kann', 'de', '3ª sing.'));
  assert.ok(s('ich kann', 'de', '3ª sing. (lui/il/él...)'));
  assert.ok(s('I can', 'en', '3ª sing.'));
  assert.ok(s('nous pouvons', 'fr', '1ª sing.'));
  assert.ok(s("j'aime", 'fr', '3ª sing.'));
  assert.ok(s('yo puedo', 'es', '2ª sing.'));
  assert.ok(s('eu posso', 'pt', '3ª plur.'));
  assert.ok(s('io posso', 'it', '3ª sing.'));
  assert.ok(s('il peut', 'fr', '3ª sing. f.'), 'carta femminile: solo il femminile');
});

test('soggetto della persona giusta (anche femminile/neutro): non sbagliato', () => {
  for (const [r, l, p] of [
    ['er kann', 'de', '3ª sing.'], ['sie kann', 'de', '3ª sing.'], ['es kann', 'de', '3ª sing.'],
    ['sie können', 'de', '3ª plur.'], ['she can', 'en', '3ª sing.'], ['you can', 'en', '2ª plur.'],
    ['elle peut', 'fr', '3ª sing.'], ['elle peut', 'fr', '3ª sing. f.'], ["j'aime", 'fr', '1ª sing.'],
    ['ellas pueden', 'es', '3ª plur.'], ['nosotras podemos', 'es', '1ª plur.'], ['tú puedes', 'es', '2ª sing.'],
    ['ela pode', 'pt', '3ª sing.'], ['lei può', 'it', '3ª sing.'], ['illa pote', 'ia', '3ª sing.'],
  ]) assert.ok(!s(r, l, p), `${l} ${p}: "${r}"`);
});

test('senza soggetto, o lingue/persone non previste: non sbagliato', () => {
  assert.ok(!s('kann', 'de', '3ª sing.'));
  assert.ok(!s('will be able', 'en', '3ª sing.'));
  assert.ok(!s('es', 'es', '3ª sing.'), 'una parola sola è il verbo, non un soggetto');
  assert.ok(!s('te ami', 'sp', '2ª sing.'));
  assert.ok(!s('kann', 'de', 'infinito'));
});

test('verificaRisposta boccia le coniugazioni con soggetto di persona sbagliata', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /if \(ok && carta\.tipo === "coniugazione" && soggettoPersonaSbagliata\(risposta, lA\?\.codice, carta\.persona\)\) ok = false;/);
});
