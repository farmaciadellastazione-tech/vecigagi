// Review 2026-10-02 sul pronome pieno carrarino facoltativo ("(Me) a son"):
// 1) si toglieva qualunque pronome della lista, anche di persona sbagliata:
//    "lór a son" per la 1ª sing. risultava giusta. Ora, se si conosce la
//    persona della carta, si toglie solo il pronome di quella persona.
// 2) l'aiutino (quasiGiusta) riceveva la risposta CON il pronome: "me a sun"
//    contro "a son" non era "quasi giusta" e l'aiutino non scattava.
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

const ctx = vm.createContext({});
ctx.globalThis = ctx;
vm.runInContext(VOCAB, ctx);
const a = HTML.indexOf('const PRONOMI_PIENI_DIALETTO');
const b = HTML.indexOf('\n}', HTML.indexOf('function togliPronomePienoDialetto(', a)) + 2;
vm.runInContext(HTML.slice(a, b) + '; globalThis.f = togliPronomePienoDialetto;', ctx);

test('con la persona nota si toglie solo il suo pronome', () => {
  assert.strictEqual(ctx.f('me a son', 'cr', '1ª sing.'), 'a son');
  assert.strictEqual(ctx.f('lor a son', 'cr', '1ª sing.'), 'lor a son', 'persona sbagliata: resta e sarà sbagliata');
  assert.strictEqual(ctx.f("le a l'è", 'cr', '3ª sing. f.'), "a l'è");
  assert.strictEqual(ctx.f("lu' a l'è", 'cr', '3ª sing. f.'), "lu' a l'è");
  assert.strictEqual(ctx.f('lór i en', 'cr', '3ª plur.'), 'i en');
  assert.strictEqual(ctx.f("lór a l'en", 'cr', '3ª plur. f.'), "a l'en");
  assert.strictEqual(ctx.f('noàltri a sian', 'cr', '1ª plur. (noi/we/nous...)'), 'a sian', 'etichetta con parentesi');
});

test('verificaRisposta passa la persona e usa la risposta senza pronome anche per l\'aiutino', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /togliPronomePienoDialetto\(risposta, lA\?\.codice, carta\.persona\)/);
  assert.match(v, /quasiGiusta\(attesoConfronto, rispostaConfronto, lA\?\.codice\)/);
  assert.match(v, /mascheraAiutino\(q\.forma, rispostaConfronto\)/);
});
