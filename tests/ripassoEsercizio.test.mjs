// Ripasso frasi, passo 4 (2026-10-26): l'esercizio. 10 frasi a sessione dalle
// raccolte del passo 3, ognuna con dettato o traduzione scelti a caso.
//  - Dettato: confronto locale (senza punteggiatura/maiuscole, CON accenti).
//  - Traduzione: verso un'altra lingua attiva, MAI verso un dialetto; i
//    riferimenti arrivano con una sola chiamata IA a inizio sessione e restano
//    salvati; se la risposta non coincide giudica l'IA.
//  - Senza IA: solo dettato. Statistiche per frase a parte (niente SM-2):
//    le sbagliate tornano più spesso.
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
  `Object.assign(globalThis, { confrontaRipasso, caricaStatsRipasso, registraEsitoRipasso, salvaTradRipasso,
     pesoRipasso, scegliFrasiRipasso, pianoRipasso, promptTraduzioniRipasso, estraiTraduzioniRipasso,
     promptGiudizioRipasso, estraiGiudizioRipasso, N_FRASI_RIPASSO });`,
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const azzera = () => { memoria = {}; };
// generatore ripetibile per i test
const rndDa = seq => { let i = 0; return () => seq[i++ % seq.length]; };

const LINGUE = [
  { codice: 'it', nome: 'Italiano', attiva: true },
  { codice: 'en', nome: 'Inglese', attiva: true },
  { codice: 'fr', nome: 'Francese', attiva: true },
  { codice: 'de', nome: 'Tedesco', attiva: false },
  { codice: 'sp', nome: 'Spezzino', attiva: true },
];

test('dettato: punteggiatura, maiuscole e spazi non contano; gli accenti sì', () => {
  assert.equal(ctx.confrontaRipasso('Je vais à la mer.', 'je vais  à la mer'), true);
  assert.equal(ctx.confrontaRipasso('¿Dónde está?', 'dónde está'), true);
  assert.equal(ctx.confrontaRipasso("L'acqua è fresca!", 'l’acqua è fresca'), true);
  assert.equal(ctx.confrontaRipasso('Je vais à la mer.', 'je vais a la mer'), false);
  assert.equal(ctx.confrontaRipasso('A vago a cà.', 'a vago a ca'), false);
  assert.equal(ctx.confrontaRipasso('Hello', ''), false);
});

test('statistiche: giuste/sbagliate per frase, riferimenti salvati', () => {
  azzera();
  ctx.registraEsitoRipasso('en|i go home.', true);
  ctx.registraEsitoRipasso('en|i go home.', false);
  ctx.registraEsitoRipasso('en|i go home.', false);
  ctx.salvaTradRipasso('en|i go home.', 'it', 'Vado a casa.');
  const s = j(ctx.caricaStatsRipasso())['en|i go home.'];
  assert.equal(s.g, 1);
  assert.equal(s.s, 2);
  assert.ok(s.ultima);
  assert.equal(s.trad.it, 'Vado a casa.');
  memoria.qml_v1_ripasso_stats = 'rotto';
  assert.deepEqual(j(ctx.caricaStatsRipasso()), {});
});

test('peso: le sbagliate valgono di più, le giuste di meno', () => {
  const nuova = ctx.pesoRipasso(undefined);
  assert.ok(ctx.pesoRipasso({ g: 0, s: 2 }) > nuova);
  assert.ok(ctx.pesoRipasso({ g: 3, s: 0 }) < nuova);
  assert.ok(ctx.pesoRipasso({ g: 50, s: 0 }) > 0);
});

test('scelta: N frasi senza ripetizioni (o tutte se sono meno)', () => {
  const frasi = Array.from({ length: 30 }, (_, i) => ({ chiave: 'en|' + i, testo: 'F' + i, cod: 'en' }));
  const scelte = j(ctx.scegliFrasiRipasso(frasi, {}, ctx.N_FRASI_RIPASSO, Math.random));
  assert.equal(scelte.length, 10);
  assert.equal(new Set(scelte.map(f => f.chiave)).size, 10);
  assert.equal(ctx.scegliFrasiRipasso(frasi.slice(0, 4), {}, 10, Math.random).length, 4);
});

test('scelta: una frase sbagliata spesso esce molto più spesso di una imparata', () => {
  const frasi = [{ chiave: 'a', testo: 'A', cod: 'en' }, { chiave: 'b', testo: 'B', cod: 'en' }];
  const stats = { a: { g: 0, s: 4 }, b: { g: 6, s: 0 } };
  let a = 0;
  for (let i = 0; i < 2000; i++) if (ctx.scegliFrasiRipasso(frasi, stats, 1, Math.random)[0].chiave === 'a') a++;
  assert.ok(a > 1600, 'a uscita ' + a + ' volte su 2000');
});

test('piano: traduzione solo verso lingue attive non dialettali e diverse dalla frase', () => {
  const frasi = [{ chiave: 'k', testo: 'I go home.', cod: 'en' }];
  for (const r of [0, 0.3, 0.6, 0.99]) {
    const [p] = j(ctx.pianoRipasso(frasi, LINGUE, true, rndDa([0.9, r])));
    if (p.modo === 'traduzione') {
      assert.ok(['it', 'fr'].includes(p.a), 'arrivo ' + p.a);
      assert.equal(p.nomeDa, 'Inglese');
      assert.ok(p.nomeA);
    }
  }
});

test('piano: mai traduzione verso un dialetto; dal dialetto sì', () => {
  const frasi = [{ chiave: 'k', testo: 'A vago a ca.', cod: 'sp' }];
  const piani = Array.from({ length: 50 }, () => j(ctx.pianoRipasso(frasi, LINGUE, true, Math.random))[0]);
  assert.ok(piani.every(p => p.modo === 'dettato' || ['it', 'en', 'fr'].includes(p.a)));
  assert.ok(piani.some(p => p.modo === 'traduzione'));
  assert.ok(piani.some(p => p.modo === 'dettato'));
});

test('piano: senza IA solo dettato; senza lingua d\'arrivo solo dettato', () => {
  const frasi = [{ chiave: 'k', testo: 'I go home.', cod: 'en' }];
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso(frasi, LINGUE, false, Math.random))[0]).every(p => p.modo === 'dettato'));
  const sole = [{ codice: 'en', nome: 'Inglese', attiva: true }, { codice: 'sp', nome: 'Spezzino', attiva: true }];
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso(frasi, sole, true, Math.random))[0]).every(p => p.modo === 'dettato'));
});

test('prompt traduzioni: una sola richiesta con tutte le frasi, JSON con id', () => {
  const items = [
    { testo: 'I go home.', nomeDa: 'Inglese', nomeA: 'Francese' },
    { testo: 'A vago a ca.', nomeDa: 'Spezzino', nomeA: 'Italiano' },
  ];
  const p = ctx.promptTraduzioniRipasso(items);
  assert.match(p.user, /I go home\./);
  assert.match(p.user, /A vago a ca\./);
  assert.match(p.user, /Francese/);
  assert.match(p.system, /"traduzioni"/);
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso('```json {"traduzioni":[{"id":0,"testo":"Je rentre."},{"id":1,"testo":"Vado a casa."}]} ```')),
    { 0: 'Je rentre.', 1: 'Vado a casa.' });
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso('niente json')), {});
});

test('giudizio IA: prompt con originale, riferimento e risposta; esito letto in modo robusto', () => {
  const p = ctx.promptGiudizioRipasso({ testo: 'I go home.', nomeDa: 'Inglese', nomeA: 'Francese' }, 'Je vais maison', 'Je rentre à la maison.');
  assert.match(p.user, /I go home\./);
  assert.match(p.user, /Je vais maison/);
  assert.match(p.user, /Je rentre à la maison\./);
  assert.match(p.system, /"correct"/);
  assert.deepEqual(j(ctx.estraiGiudizioRipasso('{"correct":false,"correction":"Je vais à la maison.","note":"Manca à la."}')),
    { correct: false, correction: 'Je vais à la maison.', note: 'Manca à la.' });
  assert.equal(ctx.estraiGiudizioRipasso('{"correct":true}').correct, true);
  assert.equal(ctx.estraiGiudizioRipasso('boh').correct, null);
});

// Code review 2026-10-27: le IA scrivono spesso l'id come testo ("0"); scartarlo
// faceva sparire in silenzio tutte le traduzioni (tutto a dettato).
test('traduzioni: id anche come testo ("0"), ma non id inventati', () => {
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso('{"traduzioni":[{"id":"0","testo":"Je rentre."},{"id":" 1 ","testo":"Vado."},{"id":"x","testo":"no"},{"id":1.5,"testo":"no"}]}')),
    { 0: 'Je rentre.', 1: 'Vado.' });
});
