// Essere in manarolese (2026-10-10, dall'Abbecedario del dialetto manarolese,
// pp. 71–73, trascrizione e decisioni di Dino) e condizionale di essere in
// genovese (screenshot di Dino). Il condizionale manarolese 1ª plur. resta
// vuoto: il libro stampa "nui a saàvan", uguale alla 3ª plur., quasi certo
// refuso (Dino chiede conferma ai locali). 2ª sing. "ti è|tie": "tö tie brau"
// (tu sei buono) a p. 56.
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
  tra('const PRONUNCIA_TTS_SOGGETTO', '\nconst CONIUGAZIONI'),
  tra('const CONIUGAZIONI = {', '\n// Genera esercizi dal database coniugazioni'),
  'globalThis.C = CONIUGAZIONI; globalThis.isCorretta = isCorretta; globalThis.fcs = formaConSoggetto; globalThis.togli = togliPronomePienoDialetto;',
].join('\n'), ctx);

const forme = (t, l) => Object.fromEntries(ctx.C.essere.tempi[t].forme.map(f => [f.p.replace(/ \(.*\)/, '').trim(), f[l]]));

test('essere in manarolese, come nel libro', () => {
  assert.deepStrictEqual(forme('presente', 'mn'), {
    '1ª sing.': 'a sun', '2ª sing.': "ti è|tie|ti t'è", '3ª sing.': 'i lé', '3ª sing. f.': 'a lé',
    '1ª plur.': 'a sömu', '2ª plur.': 'a sö', '3ª plur.': 'i lèn', '3ª plur. f.': 'a lèn',
  });
  assert.deepStrictEqual(forme('imperfetto', 'mn'), {
    '1ª sing.': 'a gliéu', '2ª sing.': 'ti éi', '3ª sing.': 'i gliéa', '3ª sing. f.': 'a gliéa',
    '1ª plur.': 'a gliéun', '2ª plur.': 'a gliéi', '3ª plur.': 'i gliéan',
  });
  assert.deepStrictEqual(forme('futuro', 'mn'), {
    '1ª sing.': 'a saò', '2ª sing.': 'te saà', '3ª sing.': 'i saà', '3ª sing. f.': 'a saà',
    '1ª plur.': 'a saomu', '2ª plur.': 'a sao', '3ª plur.': 'i saàn',
  });
  assert.deepStrictEqual(forme('passato', 'mn'), {
    '1ª sing.': 'a sun stà|a sun a stà', '2ª sing.': 'ti è stà', '3ª sing.': 'i lè stà',
    '1ª plur.': 'a sömu stà', '2ª plur.': 'a sö stà', '3ª plur.': 'i lèn stà|i lèn a stà',
  });
  assert.deepStrictEqual(forme('congiuntivo', 'mn'), {
    '1ª sing.': 'siu|a siu', '2ª sing.': 'te siu', '3ª sing.': 'i sia', '3ª sing. f.': 'a sia',
    '1ª plur.': 'a siéun|a siun', '2ª plur.': 'a sii', '3ª plur.': 'i sian',
  });
  assert.deepStrictEqual(forme('congiuntivoImperfetto', 'mn'), {
    '1ª sing.': 'a fusu', '2ª sing.': 'te fusi', '3ª sing.': 'i fusa', '3ª sing. f.': 'a fusa',
    '1ª plur.': 'a fusun', '2ª plur.': 'a fusi', '3ª plur.': 'i fusan',
  });
  assert.deepStrictEqual(forme('condizionale', 'mn'), {
    '1ª sing.': 'a saā', '2ª sing.': 'te saàvi', '3ª sing.': 'i saàva', '3ª sing. f.': undefined,
    '1ª plur.': undefined, '2ª plur.': 'a saàvi', '3ª plur.': 'i saàvan',
  });
  assert.deepStrictEqual(forme('imperativo', 'mn'), { '2ª sing.': 'sii!', '1ª plur.': undefined, '2ª plur.': undefined });
});

test('condizionale di essere in genovese', () => {
  assert.deepStrictEqual(forme('condizionale', 'ge'), {
    '1ª sing.': 'mi saieiva|mi saiæ', '2ª sing.': 'ti ti saiésci/ti ti saiësci',
    '3ª sing.': 'lé u saieiva/lê o saieiva|lê o saiæ', '3ª sing. f.': 'a saieiva|a saiæ',
    '1ª plur.': 'niatri saiéscimu/niatri saiëscimo', '2ª plur.': 'viatri saiésci/viatri saiësci',
    '3ª plur.': 'liatri saieivan|liatri saiæn',
  });
});

test('domanda col soggetto manarolese, e il pronome pieno nella risposta è facoltativo', () => {
  assert.strictEqual(ctx.fcs('a sun', '1ª sing.', 'mn'), 'mö a sun');
  assert.strictEqual(ctx.fcs('a lé', '3ª sing. f.', 'mn'), 'glié a lé');
  assert.strictEqual(ctx.fcs('a sömu', '1ª plur.', 'mn'), 'nui a sömu');
  assert.strictEqual(ctx.togli('mö a sun', 'mn', '1ª sing.'), 'a sun');
  assert.strictEqual(ctx.togli('lù i lèn', 'mn', '3ª plur.'), 'i lèn');
  assert.strictEqual(ctx.togli('lù a sun', 'mn', '1ª sing.'), 'lù a sun', 'pronome di un\'altra persona: resta');
});

test('risposte manarolesi: forma, alternativa nascosta e forma senza particella', () => {
  const giusta = (atteso, risposta) => {
    const basi = [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)];
    return ctx.isCorretta(basi.length ? atteso + '|' + basi.join('|') : atteso, risposta, 'it-IT', 'mn', true);
  };
  assert.ok(giusta('a sun', 'a sun'));
  assert.ok(giusta('ti è|tie', 'tie'));
  assert.ok(giusta('a siéun|a siun', 'a siun'));
  assert.ok(!giusta('a sun', 'a sömu'));
});

test('2ª sing. anche alla genovese, "ti t\'è"', () => {
  const atteso = "ti è|tie|ti t'è";
  const basi = [...ctx.variantiBaseDialetto(atteso), ...ctx.variantiSenzaSoggettoDialetto(atteso)];
  assert.ok(ctx.isCorretta(atteso + '|' + basi.join('|'), "ti t'è", 'it-IT', 'mn', true));
  assert.strictEqual(ctx.formaDisplay(atteso, 'mn'), 'ti è');
});
