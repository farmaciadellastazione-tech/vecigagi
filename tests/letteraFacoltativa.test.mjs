// Lettere facoltative tra parentesi attaccate alla parola, es. grc "ἴσασι(ν)"
// (ν efelcistico): valgono sia "ἴσασι" sia "ἴσασιν". Prima il secondo passava
// solo per la tolleranza "inizia con", che il controllo preciso delle
// coniugazioni non ha più.
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

test('lettera facoltativa: accettate entrambe le forme, anche col controllo preciso', () => {
  assert.strictEqual(ctx.isCorretta('ἴσασι(ν)', 'ισασι', 'el', 'grc', true), true);
  assert.strictEqual(ctx.isCorretta('ἴσασι(ν)', 'ισασιν', 'el', 'grc', true), true);
  assert.strictEqual(ctx.isCorretta('ἴσασι(ν)', 'ισασιμ', 'el', 'grc', true), false);
});

test('le note staccate tra parentesi restano solo note', () => {
  assert.strictEqual(ctx.isCorretta('bello (m.)', 'bello', 'it-IT', 'it', true), true);
});
