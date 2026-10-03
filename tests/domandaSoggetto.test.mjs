// Richiesta di Dino (2026-10-03): nella domanda di una coniugazione il soggetto
// deve esserci sempre. Prima si aggiungeva solo per fr/en/de/pt/ia: ge "o tia"
// (tirare, 3ª sing.) usciva senza "lê", l'italiano "tira" senza "lui".
// Ora formaConSoggetto lo antepone per ogni lingua che ha SOGGETTI, tranne se
// la forma lo contiene già all'inizio (anche dopo "che") o è un imperativo
// (forme che finiscono con "!"). Audio e testo della domanda coincidono.
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
  tra('const SOGGETTI = {', '\n// Altri pronomi soggetto'),
  tra('const PRONUNCIA_TTS_SOGGETTO', '\nconst CONIUGAZIONI'),
  'globalThis.formaConSoggetto = formaConSoggetto; globalThis.testoAudio = testoAudio;',
].join('\n'), ctx);
const f = (forma, p, l) => ctx.formaConSoggetto(forma, p, l);

test('soggetto aggiunto in tutte le lingue che lo hanno', () => {
  assert.strictEqual(f('o tia', '3ª sing.', 'ge'), 'lê o tia');
  assert.strictEqual(f('a tia', '3ª sing. f.', 'ge'), 'lê a tia');
  assert.strictEqual(f('poemmo', '1ª plur.', 'ge'), 'niatri poemmo');
  assert.strictEqual(f('tira', '3ª sing.', 'it'), 'lui tira');
  assert.strictEqual(f('tira', '3ª sing. (lui/il/él...)', 'es'), 'él tira');
  assert.strictEqual(f("t'sen", '2ª sing.', 'cr'), "te t'sen");
  assert.strictEqual(f('amat', '3ª sing.', 'la'), 'is amat');
  assert.strictEqual(f('kann', '3ª sing.', 'de'), 'er kann');
});

test('niente doppioni se la forma ha già il soggetto', () => {
  assert.strictEqual(f("ti t'ammi", '2ª sing.', 'ge'), "ti t'ammi");
  assert.strictEqual(f("lê o l'amma", '3ª sing.', 'ge'), "lê o l'amma");
  assert.strictEqual(f('che mi amme', '1ª sing.', 'ge'), 'che mi amme');
  assert.strictEqual(f('voàltri siet', '2ª plur.', 'cr'), 'voàltri siet');
});

test('niente soggetto negli imperativi e nelle lingue senza soggetti', () => {
  assert.strictEqual(f('ama!', '2ª sing.', 'it'), 'ama!');
  assert.strictEqual(f('vanni ti!', '2ª sing.', 'ge'), 'vanni ti!');
  assert.strictEqual(f('φιλεῖ', '3ª sing.', 'grc'), 'φιλεῖ');
  assert.strictEqual(f('a vagu', '1ª sing.', 'mn'), 'a vagu');
});

test('francese: elisione di je', () => {
  assert.strictEqual(f('aime', '1ª sing.', 'fr'), "j'aime");
});

test('l\'audio usa la stessa regola (niente doppioni)', () => {
  assert.strictEqual(ctx.testoAudio("ti t'ammi", '2ª sing.', 'ge'), "ti t'ammi");
  assert.strictEqual(ctx.testoAudio('o tia', '3ª sing.', 'ge'), 'lê o tia');
  assert.strictEqual(ctx.testoAudio('ama!', '2ª sing.', 'it'), 'ama!');
});

test('la domanda usa formaConSoggetto per tutte le lingue', () => {
  const i = HTML.indexOf('const forma = formaDisplay(carta.entry[lDA?.codice] || "", lDA?.codice);');
  assert.ok(i > 0);
  const blocco = HTML.slice(i, i + 400);
  assert.match(blocco, /formaConSoggetto\(forma, carta\.persona, lDA\?\.codice\)/);
  assert.doesNotMatch(blocco, /LINGUE_CON_SOGGETTO/);
});
