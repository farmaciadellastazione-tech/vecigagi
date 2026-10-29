// Segnalazione di Dino (2026-10-29): in CONIUGAZIONI.stare en/fr/de hanno il
// senso di "restare" (stay/rester/bleiben), es/pt quello di "trovarsi in uno
// stato" (estar/estar): francese → spagnolo chiedeva "reste" → "estoy".
// Ora es/pt mostrano quedarse/ficar; estar resta alternativa nascosta con "|",
// perché dall'italiano "sto" (sto bene) è giusta anche quella.
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
  tra('const CONIUGAZIONI = {', '\n// Genera esercizi dal database coniugazioni'),
  'globalThis.C = CONIUGAZIONI;',
].join('\n'), ctx);

const forme = (l) => Object.fromEntries(ctx.C.stare.tempi.presente.forme.filter(f => f[l]).map(f => [f.p, f[l]]));

test('stare presente, spagnolo: quedarse, estar come alternativa nascosta', () => {
  assert.deepStrictEqual(forme('es'), {
    '1ª sing.': 'me quedo|estoy', '2ª sing.': 'te quedas|estás', '3ª sing.': 'se queda|está',
    '1ª plur.': 'nos quedamos|estamos', '2ª plur.': 'os quedáis|estáis', '3ª plur.': 'se quedan|están',
  });
});

test('stare presente, portoghese: ficar, estar come alternativa nascosta', () => {
  assert.deepStrictEqual(forme('pt'), {
    '1ª sing.': 'fico|estou', '2ª sing.': 'ficas|estás', '3ª sing.': 'fica|está',
    '1ª plur.': 'ficamos|estamos', '2ª plur.': 'ficais|estais', '3ª plur.': 'ficam|estão',
  });
});
