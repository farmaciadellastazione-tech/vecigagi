// 2026-10-02, richieste di Dino:
// 1) carrarino (cr) e manarolese (mn) tra le lingue delle coniugazioni: prima
//    mancavano da LINGUE_CONIUG, quindi le loro colonne restavano nei dati
//    senza comparire né nella schermata Verbi né nel quiz.
// 2) riga persona "3ª plur. f." (elles/ellas/elas/sie...), come la "3ª sing. f.":
//    solo la possibilità (soggetti + preset nell'editor), le righe le crea Dino.
// 3) cr "(Me) a son": il pronome pieno tra parentesi è facoltativo; la cella ha
//    "a son", ma anche la risposta "me a son" deve essere giusta.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const EDIT = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');
const VOCAB = fs.readFileSync(ROOT + '/vocab.js', 'utf8');

function oggetto(src, re) {
  const m = re.exec(src);
  if (!m) throw new Error('non trovato: ' + re);
  const start = m.index + m[0].length - 1;
  let d = 0, i = start, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
  }
  return new Function('return (' + src.slice(start, i + 1) + ')')();
}

test('cr e mn sono lingue delle coniugazioni', () => {
  const L = oggetto(HTML, /^const LINGUE_CONIUG = \{/m);
  assert.strictEqual(L.cr?.nome, 'Carrarino');
  assert.strictEqual(L.mn?.nome, 'Manarolese');
});

test('SOGGETTI ha la 3ª plur. f.', () => {
  const S = oggetto(HTML, /^const SOGGETTI = \{/m);
  const attesi = { it: 'loro', fr: 'elles', es: 'ellas', pt: 'elas', en: 'they', de: 'sie', ia: 'illas' };
  for (const [l, s] of Object.entries(attesi)) assert.strictEqual(S[l]?.['3ª plur. f.'], s, l);
});

test('edit-coniugazioni propone "3ª plur. f." e la inserisce dopo "3ª plur."', () => {
  assert.match(EDIT, /PERSONE_PRESET = \[[^\]]*'3ª plur\. f\.'/);
  const ctx = vm.createContext({});
  const conferma = EDIT.slice(EDIT.indexOf('function confermaPersonaModal()'), EDIT.indexOf('function aggiungiLingua()'));
  vm.runInContext(`
    let verboCorrente = 'v', tempoCorrente = 't', etichetta = '';
    const coniugazioni = { v: { tempi: { t: { forme: ['1ª sing.','2ª sing.','3ª sing.','1ª plur.','2ª plur.','3ª plur.'].map(p => ({ p })) } } } };
    const document = { getElementById: () => ({ value: '', hidden: true, trim() { return ''; } }) };
    function chiudiPersonaModal() {} function renderTabella() {}
    ${conferma}
  `, ctx);
  // simula la scelta del preset
  vm.runInContext(`document.getElementById = id => id === 'persona-preset-select' ? { value: '3ª plur. f.' } : { value: '', hidden: true };`, ctx);
  vm.runInContext('confermaPersonaModal()', ctx);
  const ps = JSON.parse(vm.runInContext('JSON.stringify(coniugazioni.v.tempi.t.forme.map(f => f.p))', ctx));
  assert.deepStrictEqual(ps.slice(-2), ['3ª plur.', '3ª plur. f.']);
});

test('cr: il pronome pieno facoltativo davanti alla risposta viene tolto', () => {
  const ctx = vm.createContext({});
  ctx.globalThis = ctx;
  vm.runInContext(VOCAB, ctx);
  const a = HTML.indexOf('const PRONOMI_PIENI_DIALETTO');
  assert.ok(a > 0, 'PRONOMI_PIENI_DIALETTO non trovata');
  const b = HTML.indexOf('\n}', HTML.indexOf('function togliPronomePienoDialetto(', a)) + 2;
  vm.runInContext(HTML.slice(a, b) + '; globalThis.f = togliPronomePienoDialetto;', ctx);
  assert.strictEqual(ctx.f('me a son', 'cr'), 'a son');
  assert.strictEqual(ctx.f("lu' i è", 'cr'), 'i è');
  assert.strictEqual(ctx.f('le a l\'è', 'cr'), "a l'è");
  assert.strictEqual(ctx.f('lor i en', 'cr'), 'i en');
  assert.strictEqual(ctx.f('noaltri a sian', 'cr'), 'a sian');
  assert.strictEqual(ctx.f('a son', 'cr'), 'a son');          // niente da togliere
  assert.strictEqual(ctx.f('me', 'cr'), 'me');                // una parola sola: resta
  assert.strictEqual(ctx.f('me a vago', 'sp'), 'me a vago');  // solo i dialetti previsti
});

test('verificaRisposta riprova senza pronome pieno per le coniugazioni dialettali', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v, /togliPronomePienoDialetto\(risposta, lA\?\.codice(, carta\.persona)?\)/);
});

test('cr: "voàltri siet" accetta anche la sola forma "siet"', () => {
  const ctx = vm.createContext({});
  ctx.globalThis = ctx;
  vm.runInContext(VOCAB, ctx);
  assert.ok(vm.runInContext('variantiBaseDialetto("voàltri siet")', ctx).includes('siet'));
});
