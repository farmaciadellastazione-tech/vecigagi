// Contatore "modifiche non salvate" di edit.html quando si edita il campo IT
// (bug 2026-11-10).
//
// Prima: onCellEdit segnava la riga con rowKey(voce), che dipende dal testo
// italiano. Editando proprio l'IT, ogni tasto produceva una chiave nuova
// ("chiedere (", "chiedere (d", …) e le precedenti non venivano mai tolte:
// due voci "chiedere" rinominate davano "24 modifiche". Una voce NUOVA con
// l'IT corretto dopo la creazione smetteva di essere "nuova" (newKeys teneva
// la chiave vecchia) e veniva contata come modificata.
//
// Dopo: quando cambia la chiave, rinominaChiaveRiga sposta il segno dalla
// chiave vecchia alla nuova (togliendo la vecchia solo se nessun'altra riga
// la usa ancora: omonimi).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

// Estrazione semplice a graffe bilanciate (le funzioni coinvolte non hanno
// graffe dentro stringhe/regex che sbilancino il conteggio, salvo i template
// literal `${...}` che restano comunque bilanciati).
function extractFn(src, name) {
  const at = src.indexOf('function ' + name + '(');
  if (at < 0) return null;
  const bodyStart = src.indexOf('{', src.indexOf(')', at));
  let depth = 0, i = bodyStart;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}

function makeEditor(vocabolario, { nuove = [] } = {}) {
  const footer = { innerHTML: '' };
  const ctx = vm.createContext({
    console,
    vocabolario,
    modifiedKeys: new Set(),
    newKeys: new Set(),
    deletedCount: 0,
    currentLangs: ['en'],
    DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
    document: { getElementById: () => footer, createElement: () => ({}) },
    salvaBozzaLocale: () => {},
    dialNT: () => false,
    ntSet: () => {},
  });
  vm.runInContext('var vocabolario = this.vocabolario, modifiedKeys = this.modifiedKeys, newKeys = this.newKeys;', ctx);
  for (const fn of ['rowKey', 'rinominaChiaveRiga', 'onCellEdit']) {
    const src = extractFn(EDIT, fn);
    if (src) vm.runInContext(src, ctx);
  }
  vm.runInContext(`nuoveIniziali.forEach(i => newKeys.add(rowKey(vocabolario[i])));`,
    Object.assign(ctx, { nuoveIniziali: nuove }));
  const stubCell = { querySelector: () => null, appendChild() {}, classList: { add() {}, remove() {} } };
  const stubTr = { classList: { contains: () => false, add() {} }, querySelector: () => null };
  // Simula la digitazione lettera per lettera, come fa l'evento input.
  function digita(idx, field, testoFinale) {
    const voce = vocabolario[idx];
    const partenza = voce[field] || '';
    let corrente = partenza;
    // Se il testo finale prolunga quello di partenza, aggiunge un carattere
    // alla volta; altrimenti cancella fino al prefisso comune e poi aggiunge.
    let comune = 0;
    while (comune < corrente.length && corrente[comune] === testoFinale[comune]) comune++;
    const passi = [];
    for (let n = corrente.length - 1; n >= comune; n--) passi.push(corrente.slice(0, n));
    for (let n = comune + 1; n <= testoFinale.length; n++) passi.push(testoFinale.slice(0, n));
    for (const v of passi) {
      vm.runInContext('onCellEdit(tr, voce, input)', Object.assign(ctx, {
        tr: stubTr, voce, input: { dataset: { field }, value: v, parentElement: stubCell },
      }));
    }
  }
  return {
    digita,
    conta: () => vm.runInContext('modifiedKeys.size + newKeys.size + deletedCount', ctx),
    mod: () => [...vm.runInContext('modifiedKeys', ctx)],
    nuove: () => [...vm.runInContext('newKeys', ctx)],
  };
}

test('rinominare l\'IT di una voce lettera per lettera conta UNA modifica', () => {
  const voc = [
    { tema: 'verbi', it: 'chiedere', en: 'ask for' },
    { tema: 'cibo', it: 'pane', en: 'bread' },
  ];
  const ed = makeEditor(voc);
  ed.digita(0, 'it', 'chiedere (per ottenere)');
  assert.equal(ed.conta(), 1, 'chiavi segnate: ' + JSON.stringify(ed.mod()));
  assert.deepEqual(ed.mod(), ['chiedere (per ottenere)']);
});

test('due omonimi "chiedere" rinominati entrambi → 2 modifiche (caso reale 24)', () => {
  const voc = [
    { tema: 'verbi', it: 'chiedere', en: 'ask' },
    { tema: 'verbi', it: 'chiedere', en: 'ask for' },
  ];
  const ed = makeEditor(voc);
  ed.digita(0, 'it', 'chiedere (domandare)');
  ed.digita(1, 'it', 'chiedere (per avere)');
  assert.equal(ed.conta(), 2, 'chiavi segnate: ' + JSON.stringify(ed.mod()));
});

test('rinominare un omonimo non toglie il segno all\'altra voce con lo stesso IT', () => {
  const voc = [
    { tema: 'verbi', it: 'chiedere', en: 'ask' },
    { tema: 'verbi', it: 'chiedere', en: 'ask for' },
  ];
  const ed = makeEditor(voc);
  ed.digita(0, 'en', 'to ask');            // segna "chiedere" (la riga 0)
  ed.digita(1, 'it', 'chiedere (per avere)'); // rinomina la riga 1
  assert.ok(ed.mod().includes('chiedere'), 'la riga 0 resta modificata');
  assert.ok(ed.mod().includes('chiedere (per avere)'));
  assert.equal(ed.conta(), 2);
});

test('una voce NUOVA con l\'IT corretto resta nuova (non diventa "modificata")', () => {
  const voc = [
    { tema: 'natura', it: 'lun', en: 'moon' },
    { tema: 'cibo', it: 'pane', en: 'bread' },
  ];
  const ed = makeEditor(voc, { nuove: [0] });
  ed.digita(0, 'it', 'luna');
  assert.deepEqual(ed.nuove(), ['luna']);
  assert.deepEqual(ed.mod(), []);
  assert.equal(ed.conta(), 1);
});

test('modificare un campo diverso dall\'IT continua a contare la riga una volta', () => {
  const voc = [{ tema: 'cibo', it: 'pane', en: 'bread' }];
  const ed = makeEditor(voc);
  ed.digita(0, 'en', 'loaf of bread');
  assert.deepEqual(ed.mod(), ['pane']);
  assert.equal(ed.conta(), 1);
});

test('correggere l\'IT di una riga già modificata sposta il segno, non lo raddoppia', () => {
  const voc = [{ tema: 'cibo', it: 'pane', en: 'bread' }];
  const ed = makeEditor(voc);
  ed.digita(0, 'en', 'loaf');
  ed.digita(0, 'it', 'pane bianco');
  assert.deepEqual(ed.mod(), ['pane bianco']);
  assert.equal(ed.conta(), 1);
});
