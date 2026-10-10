// Avere in manarolese (2026-10-10, Abbecedario del dialetto manarolese p. 74,
// screenshot di Dino): presente, futuro, passato prossimo. L'imperfetto nel
// libro non c'è (dopo il presente viene il passato remoto, "manca"); il
// femminile non è dato. Varianti stampate tra parentesi, "(l'ò)", accettate
// con "|". Congiuntivi e condizionale da p. 75 (test in fondo); "a laveà"
// (cond. 1ª sing.), "a laveàun" e "i lagian" senza accento sono stampati così.
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

const forme = (v, t) => Object.fromEntries(ctx.C[v].tempi[t].forme.filter(f => f.mn).map(f => [f.p.replace(/ \(.*\)/, '').trim(), f.mn]));

test('avere in manarolese: presente, futuro, passato come nel libro', () => {
  assert.deepStrictEqual(forme('avere', 'presente'), {
    '1ª sing.': "a lò|a l'ò", '2ª sing.': 'tà', '3ª sing.': "i là|i l'à",
    '1ª plur.': 'a lömu', '2ª plur.': 'a lö', '3ª plur.': 'i lan',
  });
  assert.deepStrictEqual(forme('avere', 'futuro'), {
    '1ª sing.': 'a laveò', '2ª sing.': "t'avea", '3ª sing.': 'i laveà',
    '1ª plur.': 'a laveömu', '2ª plur.': 'a laveö', '3ª plur.': 'i laveàn',
  });
  assert.deepStrictEqual(forme('avere', 'passato'), {
    '1ª sing.': 'a lò aù', '2ª sing.': 'tà aù', '3ª sing.': 'i là aù',
    '1ª plur.': 'a lömu aù', '2ª plur.': 'a lö aù', '3ª plur.': 'i lan aù',
  });
  assert.deepStrictEqual(forme('avere', 'imperfetto'), {}, 'il libro non ha l\'imperfetto');
});

test('essere, congiuntivo 1ª sing.: "siu" come stampato, accettato anche "a siu"', () => {
  assert.strictEqual(forme('essere', 'congiuntivo')['1ª sing.'], 'siu|a siu');
});

// p. 75 (screenshot di Dino): congiuntivo presente e imperfetto, condizionale.
// Il segno su "ō" è un trattino (Dino); "a losi" stampato senza, uniformato
// alle altre persone su indicazione di Dino. Femminile non dato.
test('avere in manarolese: congiuntivi e condizionale come a p. 75', () => {
  assert.deepStrictEqual(forme('avere', 'congiuntivo'), {
    '1ª sing.': 'a làgiu', '2ª sing.': "t'àgi", '3ª sing.': 'i làgia',
    '1ª plur.': 'a làgiun', '2ª plur.': 'a làgi', '3ª plur.': 'i lagian',
  });
  assert.deepStrictEqual(forme('avere', 'congiuntivoImperfetto'), {
    '1ª sing.': 'a lōsu', '2ª sing.': "t'ōsi", '3ª sing.': 'i lōsa',
    '1ª plur.': 'a lōsun', '2ª plur.': 'a lōsi', '3ª plur.': 'i lōsan',
  });
  assert.deepStrictEqual(forme('avere', 'condizionale'), {
    '1ª sing.': 'a laveà', '2ª sing.': "t'aveàvi", '3ª sing.': 'i laveàva',
    '1ª plur.': 'a laveàun', '2ª plur.': 'a laveàvi', '3ª plur.': 'i laveàvan',
  });
});
