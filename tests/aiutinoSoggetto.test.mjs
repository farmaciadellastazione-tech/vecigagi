// Segnalazione di Dino (2026-10-03): tedesco "er wirdt konnen" per "wird
// können" non faceva scattare l'aiutino. quasiGiusta confrontava la risposta
// col soggetto ("er " = 3 caratteri in più + la "t" = 4, oltre la soglia).
// Il giudizio il soggetto lo toglie già: ora anche l'aiutino, per le
// coniugazioni, riprova senza soggetto.
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
  'globalThis.rimuoviSoggetto = rimuoviSoggetto;',
].join('\n'), ctx);

test('senza soggetto la risposta è "quasi giusta"', () => {
  assert.strictEqual(ctx.quasiGiusta('wird können', 'er wirdt konnen', 'de'), null, 'col soggetto: troppo lontana');
  const senza = ctx.rimuoviSoggetto('er wirdt konnen', 'de');
  assert.ok(ctx.quasiGiusta('wird können', senza, 'de'), 'senza soggetto: aiutino');
});

test('verificaRisposta riprova l\'aiutino senza soggetto per le coniugazioni', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /if \(!q && carta\.tipo === "coniugazione"\) \{[\s\S]*?rimuoviSoggetto\(rispostaConfronto, lA\?\.codice\)[\s\S]*?quasiGiusta\(attesoConfronto, senzaSogg, lA\?\.codice\)/);
});
