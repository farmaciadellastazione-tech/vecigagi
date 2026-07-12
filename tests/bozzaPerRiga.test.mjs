// Test del ripristino bozza PER-RIGA in edit.html (task #5, 2026-07-12).
//
// Prima: provaRipristinoBozza sostituiva l'INTERO vocabolario con la
// fotografia della bozza — ripristinare una bozza vecchia riportava indietro
// tutta la tabella (episodio "cacciare": la bozza riproponeva una correzione
// già promossa, su una base pre-promozione; salvando si sarebbe regredito
// tutto il lavoro del giorno, e la guardia anti-clobber non copre questo caso).
//
// Dopo: la bozza salva SOLO le righe toccate + la loro versione di partenza
// (basi); il ripristino le riapplica sulla base fresca di GitHub, riga per
// riga, e SALTA con avviso quelle il cui remoto è cambiato dopo la bozza
// (conflitto), quelle già salvate nel frattempo, le sparite e gli omonimi.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

// Tokenizer bilanciato comment-aware e regex-aware (vedi tests/spiegaParola.test.mjs).
function scansionaBilanciato(src, start, apre, chiude) {
  let depth = 0, i = start, inStr = false, esc = false, q = null, inLineComment = false, inBlockComment = false, started = false, prevSignificant = '';
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (inLineComment) { if (c === '\n') inLineComment = false; continue; }
    if (inBlockComment) { if (c === '*' && c2 === '/') { inBlockComment = false; i++; } continue; }
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === q) inStr = false;
      continue;
    }
    if (c === '/' && c2 === '/') { inLineComment = true; i++; continue; }
    if (c === '/' && c2 === '*') { inBlockComment = true; i++; continue; }
    if (c === '/' && !/[A-Za-z0-9_$)\]]/.test(prevSignificant)) {
      let j = i + 1, inClass = false, rEsc = false;
      for (; j < src.length; j++) {
        const rc = src[j];
        if (rEsc) { rEsc = false; continue; }
        if (rc === '\\') { rEsc = true; continue; }
        if (rc === '[') { inClass = true; continue; }
        if (rc === ']') { inClass = false; continue; }
        if (rc === '/' && !inClass) { j++; break; }
        if (rc === '\n') break;
      }
      while (j < src.length && /[a-z]/i.test(src[j])) j++;
      i = j - 1;
      prevSignificant = '/';
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === apre) { depth++; started = true; }
    else if (c === chiude) { depth--; if (started && depth === 0) { i++; break; } }
    if (!/\s/.test(c)) prevSignificant = c;
  }
  return i;
}
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  let at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  if (src.slice(Math.max(0, at - 6), at) === 'async ') at -= 6;
  const parenOpen = src.indexOf('(', at);
  const parenClose = scansionaBilanciato(src, parenOpen, '(', ')');
  const bodyStart = src.indexOf('{', parenClose);
  const i = scansionaBilanciato(src, bodyStart, '{', '}');
  return src.slice(at, i);
}

function makeCtx() {
  const ctx = vm.createContext({ console });
  vm.runInContext(extractFn(EDIT, 'rowKey'), ctx);
  vm.runInContext(extractFn(EDIT, 'applicaBozzaPerRiga'), ctx);
  return (fresco, bozza) => vm.runInContext(
    `applicaBozzaPerRiga(${JSON.stringify(fresco)}, ${JSON.stringify(bozza)})`, ctx);
}

const FRESCO = [
  { tema: 'verbi', it: 'cacciare', sp: 'cacciahe/càciae', verif: 'sp:g' },
  { tema: 'cibo', it: 'carota', mn: 'gnifra' },
  { tema: 'natura', it: 'sole', ge: 'sô' },
];

test('remoto invariato dopo la bozza → riga riapplicata in place', () => {
  const applica = makeCtx();
  const r = applica(FRESCO, {
    perRiga: true,
    voci: { carota: { tema: 'cibo', it: 'carota', mn: 'gnifra-corretto' } },
    basi: { carota: { tema: 'cibo', it: 'carota', mn: 'gnifra' } }, // = fresco: nessuno ha toccato la voce
    nuove: [], modifiedKeys: ['carota'], newKeys: [],
  });
  assert.equal(r.applicate.length, 1);
  assert.equal(r.vocabolario.find(v => v.it === 'carota').mn, 'gnifra-corretto');
  assert.equal(r.vocabolario.length, FRESCO.length, 'nessuna riga aggiunta/persa');
  assert.equal(r.vocabolario.find(v => v.it === 'sole').ge, 'sô', 'le righe non toccate restano fresche');
});

test('remoto CAMBIATO dopo la bozza → conflitto, riga fresca INTATTA (caso "cacciare")', () => {
  const applica = makeCtx();
  const r = applica(FRESCO, {
    perRiga: true,
    voci: { cacciare: { tema: 'verbi', it: 'cacciare', sp: 'VECCHIA-CORREZIONE' } },
    basi: { cacciare: { tema: 'verbi', it: 'cacciare', sp: 'caciae' } }, // ≠ fresco: promossa nel frattempo
    nuove: [], modifiedKeys: ['cacciare'], newKeys: [],
  });
  assert.equal(r.applicate.length, 0);
  assert.equal(r.conflitti.length, 1);
  assert.equal(r.vocabolario.find(v => v.it === 'cacciare').sp, 'cacciahe/càciae',
    'la versione promossa NON deve essere sovrascritta dalla bozza vecchia');
});

test('riga bozza identica al remoto → già salvata, nessuna modifica segnata', () => {
  const applica = makeCtx();
  const r = applica(FRESCO, {
    perRiga: true,
    voci: { sole: { tema: 'natura', it: 'sole', ge: 'sô' } },
    basi: { sole: { tema: 'natura', it: 'sole', ge: 'VECCHIO' } },
    nuove: [], modifiedKeys: ['sole'], newKeys: [],
  });
  assert.equal(r.applicate.length, 0);
  assert.equal(r.gia.length, 1);
  assert.equal(r.conflitti.length, 0);
});

test('voce nuova della bozza → aggiunta; se la chiave ormai esiste → conflitto', () => {
  const applica = makeCtx();
  const r = applica(FRESCO, {
    perRiga: true, voci: {}, basi: {},
    nuove: [
      { tema: 'natura', it: 'luna', ge: 'lünn-a' },
      { tema: 'natura', it: 'sole', ge: 'ALTRO' }, // esiste già nel fresco
    ],
    modifiedKeys: [], newKeys: ['luna', 'sole'],
  });
  assert.equal(r.aggiunte.length, 1);
  assert.ok(r.vocabolario.some(v => v.it === 'luna'));
  assert.equal(r.conflitti.length, 1);
  assert.equal(r.vocabolario.find(v => v.it === 'sole').ge, 'sô', 'la fresca non va toccata');
});

test('voce sparita dal remoto (promossa/eliminata) o con omonimi → conflitto, mai a caso', () => {
  const applica = makeCtx();
  const r = applica(
    [...FRESCO, { tema: 'dialetti', it: 'carota', mn: 'zgnìfra' }], // omonimo di carota
    {
      perRiga: true,
      voci: {
        sparita: { it: 'sparita', ge: 'x' },
        carota: { tema: 'cibo', it: 'carota', mn: 'EDIT' },
      },
      basi: {},
      nuove: [], modifiedKeys: ['sparita', 'carota'], newKeys: [],
    });
  assert.equal(r.applicate.length, 0);
  assert.equal(r.conflitti.length, 2, 'sparita + omonimi: entrambe da gestire a mano');
});

test('riga con IT EDITATO nella bozza: riagganciata alla voce fresca tramite la chiave di partenza', () => {
  const applica = makeCtx();
  // L'utente ha corretto l'italiano stesso ("carota" → "carota gialla"): la
  // bozza indicizza per chiave DI PARTENZA (carota) e la riga porta l'it nuovo.
  const r = applica(FRESCO, {
    perRiga: true,
    voci: { carota: { tema: 'cibo', it: 'carota gialla', mn: 'gnifra', _key0: 'carota' } },
    basi: { carota: { tema: 'cibo', it: 'carota', mn: 'gnifra' } },
    nuove: [], modifiedKeys: ['carota gialla'], newKeys: [],
  });
  assert.equal(r.applicate.length, 1);
  assert.ok(r.vocabolario.some(v => v.it === 'carota gialla'), 'la voce rinominata deve rientrare');
  assert.ok(!r.vocabolario.some(v => v.it === 'carota'), 'la vecchia riga è stata sostituita, non duplicata');
});

test('bozza legacy (fotografia intera): riapplicata comunque PER-RIGA, mai in blocco', () => {
  const applica = makeCtx();
  const legacy = FRESCO.map(v => ({ ...v }));
  legacy.find(v => v.it === 'carota').mn = 'gnifra-legacy';
  legacy.push({ it: 'voce-vecchia-non-toccata', ge: 'zzz' }); // nella fotografia ma NON tra le modificate
  const r = applica(FRESCO, {
    vocabolario: legacy, modifiedKeys: ['carota'], newKeys: [],
  });
  assert.equal(r.vocabolario.find(v => v.it === 'carota').mn, 'gnifra-legacy', 'la riga modificata si riapplica');
  assert.ok(!r.vocabolario.some(v => v.it === 'voce-vecchia-non-toccata'),
    'le righe NON modificate della fotografia non devono rientrare');
});

test('cablaggio: provaRipristinoBozza usa applicaBozzaPerRiga e salvaBozzaLocale salva basi (non tutta la tabella)', () => {
  const rip = extractFn(EDIT, 'provaRipristinoBozza');
  assert.ok(rip.includes('applicaBozzaPerRiga('), 'il ripristino deve essere per-riga');
  const salva = extractFn(EDIT, 'salvaBozzaLocale');
  assert.ok(/basi/.test(salva), 'la bozza deve salvare le versioni di partenza per rilevare i conflitti');
  assert.ok(/perRiga: true/.test(salva), 'nuovo formato bozza marcato perRiga');
});
