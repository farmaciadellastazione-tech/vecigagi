// Review di 3fa7895:
// 1) voce: InputVocale sceglieva la prima trascrizione accettata da isCorretta
//    (che toglie qualunque soggetto), es. "il peut" prima di "elle peut" per
//    una carta "3ª sing. f.", poi bocciata da soggettoPersonaSbagliata. Ora,
//    per le coniugazioni, quelle trascrizioni si scartano prima della scelta.
// 2) cortesia: usted/você/Lei/Sie vogliono il verbo alla 3ª persona, quindi
//    sono ammessi solo lì (prima es/pt li ammettevano alla 2ª, it/de no).
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
vm.runInContext([tra('const SOGGETTI = {', '\n// Lingue dove il soggetto'), 'globalThis.s = soggettoPersonaSbagliata;'].join('\n'), ctx);

test('cortesia solo con la 3ª persona, in tutte le lingue', () => {
  assert.ok(ctx.s('usted puedes', 'es', '2ª sing.'));
  assert.ok(ctx.s('você podes', 'pt', '2ª sing.'));
  assert.ok(ctx.s('ustedes podéis', 'es', '2ª plur.'));
  assert.ok(!ctx.s('usted puede', 'es', '3ª sing.'));
  assert.ok(!ctx.s('você pode', 'pt', '3ª sing.'));
  assert.ok(!ctx.s('Lei può', 'it', '3ª sing.'));
  assert.ok(!ctx.s('Sie können', 'de', '3ª plur.'));
});

test('voce: le trascrizioni col soggetto sbagliato si scartano prima della scelta', () => {
  const iv = HTML.slice(HTML.indexOf('function InputVocale({'), HTML.indexOf('const {', HTML.indexOf('const onResult = useCallback', HTML.indexOf('function InputVocale({'))));
  assert.match(iv, /const alternative = preciso \? tutte\.filter\(alt => !soggettoPersonaSbagliata\(alt, codLingua, persona\)\) : tutte;/);
  assert.match(iv, /const tConv = scelta \|\| alternative\[0\] \|\| tutte\[0\] \|\| "";/);
});
