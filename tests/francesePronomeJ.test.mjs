// Review di 5ccd7b7: rimuoviSoggetto toglie la "j" solo se c'è "j'", ma
// isCorretta glielo passava sulla risposta attesa GIÀ normalizzata (senza
// apostrofo): "ai faim" non valeva più per "j'ai faim", mentre "sei" vale per
// "tu sei". Ora il soggetto dell'atteso si toglie dalla forma originale.
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
  'globalThis.isCorretta = isCorretta;',
].join('\n'), ctx);
const ok = (a, d) => ctx.isCorretta(a, d, 'fr-FR', 'fr');

test("atteso con j': vale anche senza soggetto", () => {
  assert.ok(ok("j'ai faim", 'ai faim'));
  assert.ok(ok("j'ai faim", "j'ai faim"));
});

test('la j di jardin/jour non è un soggetto', () => {
  assert.ok(!ok('jardin', 'ardin'));
  assert.ok(!ok('jour', 'our'));
  assert.ok(ok('jardin', 'jardin'));
});
