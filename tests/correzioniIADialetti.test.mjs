// L'IA non deve ripetere gli errori di dialetto dopo una correzione (richiesta
// di Dino, 2026-10-15). Chiunque può correggere una frase dialettale scritta
// dall'IA (✏️ Correggi): la correzione resta nel browser e, a ogni richiesta
// in quel dialetto, l'IA la riceve insieme alle correzioni comuni
// (CORREZIONI_IA_COMUNI, controllate da Dino) e ad alcune voci verificate 🟢
// del vocabolario come modello.
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
const memoria = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); },
    removeItem: k => { delete memoria[k]; },
  },
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('// ── Correzioni IA dialetti', '\n// ── Aiuto Frase libera'),
  'globalThis.salva = salvaCorrezioneIA; globalThis.carica = caricaCorrezioniIA; globalThis.istruzioni = istruzioniDialetto; globalThis.esempi = esempiDialetto; globalThis.testoDaCopiare = testoCorrezioniDaCopiare; globalThis.svuota = svuotaCorrezioniIA; globalThis.COMUNI = CORREZIONI_IA_COMUNI; globalThis.parametriCorrezioneIA = parametriCorrezioneIA;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));

const VOC = [
  { tema: 'casa', it: 'casa', sp: "ca/cà", verif: 'sp:g' },
  { tema: 'animali', it: 'gatto', sp: 'gato', verif: 'sp:g' },
  { tema: 'animali', it: 'cane', sp: 'can' }, // non verificata: non va negli esempi
  { tema: 'casa', it: 'porta', sp: '?', verif: 'sp:g' },
  { tema: 'casa', it: 'finestra', ge: 'fnestra', verif: 'ge:g' },
];

test('salva e rilegge le correzioni per dialetto; stessa frase errata = sostituita', () => {
  ctx.svuota();
  ctx.salva('sp', 'a son andao', 'a son andà');
  ctx.salva('sp', 'A son andao ', 'a son andà via');
  ctx.salva('ge', 'mi son', 'mi sun');
  assert.deepStrictEqual(j(ctx.carica()), {
    sp: [{ errata: 'A son andao', corretta: 'a son andà via' }],
    ge: [{ errata: 'mi son', corretta: 'mi sun' }],
  });
});

test('correzione uguale all\'originale o vuota: non si salva', () => {
  ctx.svuota();
  ctx.salva('sp', 'a son', 'a son');
  ctx.salva('sp', 'a son', '  ');
  assert.deepStrictEqual(j(ctx.carica()), {});
});

test('al massimo 100 correzioni per dialetto, tenendo le più recenti', () => {
  ctx.svuota();
  for (let i = 0; i < 105; i++) ctx.salva('sp', 'e' + i, 'c' + i);
  const sp = ctx.carica().sp;
  assert.strictEqual(sp.length, 100);
  assert.strictEqual(sp[0].errata, 'e5');
  assert.strictEqual(sp[99].errata, 'e104');
});

test('esempi: solo voci verificate 🟢 del dialetto, in grafia, prima quelle della parola', () => {
  assert.deepStrictEqual(j(ctx.esempi(VOC, 'sp', 'gatto', 10)), ['gatto = gato', 'casa = cà']);
  assert.deepStrictEqual(j(ctx.esempi(VOC, 'sp', '', 1)), ['casa = cà']);
});

test('istruzioni per l\'IA: vuote per le lingue vere, con correzioni e vocabolario per i dialetti', () => {
  ctx.svuota();
  assert.strictEqual(ctx.istruzioni('fr', 'Francese', VOC, 'gatto'), '');
  ctx.salva('sp', 'a son andao', 'a son andà');
  const t = ctx.istruzioni('sp', 'Spezzino', VOC, 'gatto');
  assert.match(t, /Spezzino/);
  assert.match(t, /"a son andao" → "a son andà"/);
  assert.match(t, /gatto = gato/);
  assert.doesNotMatch(t, /cane = can/, 'voce non verificata esclusa');
});

test('le correzioni comuni (di Dino) vengono prima di quelle del browser', () => {
  ctx.svuota();
  ctx.COMUNI.sp.push({ errata: 'comune', corretta: 'giusta' });
  ctx.salva('sp', 'locale', 'giusta2');
  const t = ctx.istruzioni('sp', 'Spezzino', VOC, '');
  assert.ok(t.indexOf('"comune"') < t.indexOf('"locale"'));
  ctx.COMUNI.sp.pop();
});

test('nel prompt solo le ultime 30 correzioni del browser', () => {
  ctx.svuota();
  for (let i = 0; i < 40; i++) ctx.salva('sp', 'err' + i, 'ok' + i);
  const t = ctx.istruzioni('sp', 'Spezzino', VOC, '');
  assert.doesNotMatch(t, /"err9"/);
  assert.match(t, /"err10"/);
  assert.match(t, /"err39"/);
});

test('testo da copiare per mandarle a Dino', () => {
  ctx.svuota();
  ctx.salva('sp', 'a son andao', 'a son andà');
  assert.deepStrictEqual(JSON.parse(ctx.testoDaCopiare()), { sp: [{ errata: 'a son andao', corretta: 'a son andà' }] });
});

test('i punti dove l\'IA scrive in dialetto usano le istruzioni e offrono ✏️ Correggi', () => {
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  for (const [nome, src, n] of [['Frase libera', fl, 4], ['Conversazione', conv, 2]]) {
    assert.strictEqual((src.match(/istruzioniDialetto\(/g) || []).length, n, nome + ': prompt con le istruzioni');
    assert.match(src, /React\.createElement\(CorreggiDialetto,/, nome + ': pulsante Correggi');
  }
  assert.match(fl, /Continua a parlarne/);
  assert.doesNotMatch(fl, /onDiscutine && !DIALETTI_TTS_ITA/, 'anche per i dialetti');
  assert.doesNotMatch(conv, /!DIALETTI_TTS_ITA\.includes\(l\.codice\)\)/, 'conversazione aperta ai dialetti');
});

test('Home: la Conversazione si sblocca anche con un solo dialetto attivo', () => {
  assert.doesNotMatch(HTML, /Serve almeno una lingua non dialettale attiva/);
  assert.match(HTML, /const lingueConversazione = lingueAttive\.filter\(l => l\.codice !== "it"\);/);
});

// Review di 6f3363b:
test('frasi errate diverse solo per gli accenti restano due correzioni distinte', () => {
  ctx.svuota();
  ctx.salva('sp', 'a son andà', 'X');
  ctx.salva('sp', 'a son anda', 'Y');
  assert.strictEqual(ctx.carica().sp.length, 2);
  ctx.salva('sp', 'A son anda ', 'Z');
  assert.strictEqual(ctx.carica().sp.length, 2, 'maiuscole e spazi non contano');
});

test('esempi legati alla parola: non per articoli e preposizioni, e senza doppioni', () => {
  const voc = [
    { it: 'a presto', sp: 'a prèsto', verif: 'sp:g' },
    { it: 'mercato', sp: 'mercà', verif: 'sp:g' },
    { it: 'mercato', sp: 'mercà', verif: 'sp:g' },
  ];
  assert.deepStrictEqual(j(ctx.esempi(voc, 'sp', 'a buon mercato', 10)), ['mercato = mercà', 'a presto = a prèsto']);
});

test('Conversazione: la correzione sostituisce la battuta sbagliata (anche nello storico per l\'IA)', () => {
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(conv, /onSalvato: nuovo => setTurni\(/);
  assert.match(HTML, /function CorreggiDialetto\(\{\s*testo,\s*cod,\s*origine,\s*onSalvato\s*\}\)/);
});

test('Conversazione in dialetto: la nota sull\'errore in italiano, non nel dialetto', () => {
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(conv, /const linguaNota = dialetto \? "italiano" : langName;/);
});

test('Copia funziona anche senza navigator.clipboard', () => {
  const sez = tra('function SezioneCorrezioniIA(', '\n// "✏️ Correggi"');
  assert.match(sez, /if \(!navigator\.clipboard\) \{\s*alert\(t\);/);
});

// Le correzioni arrivano anche a Dino: stesso foglio Google dei contributi
// ("Contribuisci con il tuo dialetto", SCRIPT_DIALETTI), stessi campi.
test('dati inviati al foglio dei contributi', () => {
  assert.deepStrictEqual(j(ctx.parametriCorrezioneIA('sp', 'a son andao', 'a son andà', 'Conversazione')), {
    parola: 'a son andao', dialetto: 'Spezzino', traduzione: 'a son andà',
    localita: '', note: 'Correzione IA (Conversazione)', nickname: '',
  });
  assert.strictEqual(ctx.parametriCorrezioneIA('mn', 'x', 'y', 'Frase libera').dialetto, 'Manarolese');
});

test('il pulsante Correggi invia la correzione e lo dice all\'utente', () => {
  const corr = tra('function CorreggiDialetto(', '\n// ── Aiuto Frase libera');
  assert.match(corr, /inviaCorrezioneIA\(cod, testo, n, origine\)/);
  assert.match(corr, /viene inviata anche a LinguaeQuiz/);
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.strictEqual((fl.match(/origine: "Frase libera"/g) || []).length, 4);
  assert.strictEqual((conv.match(/origine: "Conversazione"/g) || []).length, 2);
});
