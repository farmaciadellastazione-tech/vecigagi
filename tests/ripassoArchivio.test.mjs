// Ripasso frasi, passo 1 (richiesta di Dino, 2026-10-26): Frase libera salva
// le frasi riconosciute giuste dall'IA (quelle che la voce rilegge) e, nelle
// lingue non dialettali, la correzione delle frasi sbagliate. Serviranno al
// nuovo esercizio "Ripasso frasi". Nei dialetti la correzione dell'IA non
// entra: l'IA li conosce poco e lo studente imparerebbe i suoi errori.
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
let memoria = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); },
    removeItem: k => { delete memoria[k]; },
  },
  DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
});
ctx.globalThis = ctx;
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'globalThis.salva = salvaFraseRipasso; globalThis.carica = caricaFrasiRipasso; globalThis.daFeedback = salvaFraseDaFeedback; globalThis.MAX = MAX_FRASI_RIPASSO;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const azzera = () => { memoria = {}; };

test('una frase giusta si salva con lingua, origine e data', () => {
  azzera();
  assert.equal(ctx.salva({ testo: '  Je vais à la mer. ', cod: 'fr', origine: 'Frase libera', tema: 'viaggi' }), true);
  const l = j(ctx.carica());
  assert.equal(l.length, 1);
  assert.equal(l[0].testo, 'Je vais à la mer.');
  assert.equal(l[0].cod, 'fr');
  assert.equal(l[0].origine, 'Frase libera');
  assert.equal(l[0].tema, 'viaggi');
  assert.ok(l[0].data);
});

test('la stessa frase (maiuscole/spazi diversi) non si duplica, ma gli accenti contano', () => {
  azzera();
  ctx.salva({ testo: 'Je vais à la mer.', cod: 'fr', origine: 'Frase libera' });
  ctx.salva({ testo: 'je  vais à LA mer.', cod: 'fr', origine: 'Frase libera' });
  assert.equal(ctx.carica().length, 1);
  ctx.salva({ testo: 'Je vais a la mer.', cod: 'fr', origine: 'Frase libera' });
  assert.equal(ctx.carica().length, 2);
  // stessa frase in un'altra lingua: è un'altra voce
  ctx.salva({ testo: 'Je vais à la mer.', cod: 'ca', origine: 'Frase libera' });
  assert.equal(ctx.carica().length, 3);
});

test('frasi vuote o senza lingua non si salvano', () => {
  azzera();
  assert.equal(ctx.salva({ testo: '   ', cod: 'fr' }), false);
  assert.equal(ctx.salva({ testo: 'Hola', cod: '' }), false);
  assert.equal(ctx.carica().length, 0);
});

test('si tengono solo le più recenti', () => {
  azzera();
  for (let i = 0; i < ctx.MAX + 5; i++) ctx.salva({ testo: 'Frase ' + i, cod: 'en', origine: 'Frase libera' });
  const l = j(ctx.carica());
  assert.equal(l.length, ctx.MAX);
  assert.ok(l.some(x => x.testo === 'Frase ' + (ctx.MAX + 4)));
  assert.ok(!l.some(x => x.testo === 'Frase 0'));
});

test('archivio rovinato: si riparte da vuoto senza errori', () => {
  azzera();
  memoria.qml_v1_frasi_ripasso = '{non json';
  assert.deepEqual(j(ctx.carica()), []);
  memoria.qml_v1_frasi_ripasso = JSON.stringify([{ testo: 'ok', cod: 'en' }, null, { cod: 'en' }]);
  assert.equal(ctx.carica().length, 1);
});

test('feedback giusto: si salva la frase dello studente', () => {
  azzera();
  ctx.daFeedback({ correct: true, correction: '' }, 'I go to the sea.', 'en', 'viaggi');
  assert.deepEqual(j(ctx.carica()).map(x => x.testo), ['I go to the sea.']);
});

test('feedback sbagliato: si salva la correzione, non la frase errata', () => {
  azzera();
  ctx.daFeedback({ correct: false, correction: 'I go to the sea.' }, 'I goes to sea.', 'en', 'viaggi');
  assert.deepEqual(j(ctx.carica()).map(x => x.testo), ['I go to the sea.']);
});

test('dialetti: la frase giusta sì, la correzione dell\'IA no', () => {
  azzera();
  ctx.daFeedback({ correct: false, correction: 'A vago a ca.' }, 'A vado a ca', 'sp', 'casa');
  assert.equal(ctx.carica().length, 0);
  ctx.daFeedback({ correct: true, correction: '' }, 'A vago a ca.', 'sp', 'casa');
  assert.equal(ctx.carica().length, 1);
});

test('esito incerto (errore IA/parsing): non si salva nulla', () => {
  azzera();
  ctx.daFeedback({ correct: null, correction: 'x' }, 'frase', 'en');
  ctx.daFeedback(null, 'frase', 'en');
  assert.equal(ctx.carica().length, 0);
});

test('Frase libera salva dopo la verifica dell\'IA', () => {
  const FL = tra('function SchermataFraseLibera(', '\nfunction SchermataConversazione(');
  assert.match(FL, /salvaFraseDaFeedback\(fb, frase\.trim\(\), carta\.lingua\.codice/);
});
