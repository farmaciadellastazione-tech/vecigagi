// Ripasso frasi, passo 3 (2026-10-26): quali frasi si ripassano. Fonti:
// l'archivio di Frase libera (già filtrato al salvataggio) e le conversazioni
// salvate. Regola concordata con Dino:
//  - lingue normali: battute dell'IA; frasi dello studente valutate dall'IA
//    (la correzione se c'è, altrimenti il testo);
//  - dialetti (mn/sp/ge/cr): MAI testo dell'IA non controllato da una persona.
//    Battute dell'IA solo con `corretta`; frasi dello studente giudicate giuste
//    o con la correzione sistemata a mano (`correzioneCorretta`).
// Frasi non valutate (chiamata IA fallita: niente campo `correzione`) escluse.
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
const ctx = vm.createContext({ localStorage: { getItem: () => null, setItem: () => {} }, DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'] });
ctx.globalThis = ctx;
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'globalThis.daConv = frasiDaConversazioni; globalThis.raccogli = frasiDaRipassare;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const testi = l => j(l).map(f => f.testo);

const convFr = {
  id: 'a', lingua: 'fr', tema: 'viaggi', turni: [
    { ruolo: 'ia', testo: 'Salut ! Tu pars où cet été ?' },
    { ruolo: 'utente', testo: 'Je vais à la mer.', correzione: null, nota: null },
    { ruolo: 'ia', testo: 'Super, quelle mer ?' },
    { ruolo: 'utente', testo: 'Je aller en Sicile', correzione: 'Je vais en Sicile.', nota: '...' },
    { ruolo: 'utente', testo: 'frase mai valutata' },
  ],
};

test('lingue normali: battute IA, frasi giuste e correzioni; niente frasi non valutate', () => {
  assert.deepEqual(testi(ctx.daConv([convFr])), [
    'Salut ! Tu pars où cet été ?', 'Je vais à la mer.', 'Super, quelle mer ?', 'Je vais en Sicile.',
  ]);
  const f = j(ctx.daConv([convFr]))[0];
  assert.equal(f.cod, 'fr');
  assert.equal(f.origine, 'Conversazione');
  assert.equal(f.tema, 'viaggi');
});

const convSp = {
  id: 'b', lingua: 'sp', turni: [
    { ruolo: 'ia', testo: 'Ciao, cosa ti fai?' },                       // IA non controllata: fuori
    { ruolo: 'ia', testo: 'Ciao, cos te fe?', corretta: true },          // corretta a mano: dentro
    { ruolo: 'utente', testo: 'A vago a ca.', correzione: null },        // giusta: dentro
    { ruolo: 'utente', testo: 'A vado a ca', correzione: 'A vago a cà.' }, // correzione IA: fuori del tutto
    { ruolo: 'utente', testo: 'A magno', correzione: 'A mangio', correzioneCorretta: true }, // sistemata: dentro
  ],
};

test('dialetti: solo testi controllati da una persona', () => {
  assert.deepEqual(testi(ctx.daConv([convSp])), ['Ciao, cos te fe?', 'A vago a ca.', 'A mangio']);
});

test('conversazioni rovinate o vuote non rompono nulla', () => {
  assert.deepEqual(testi(ctx.daConv([null, { id: 'x' }, { id: 'y', lingua: 'en', turni: [null, { ruolo: 'ia' }, { ruolo: 'ia', testo: '  ' }] }])), []);
  assert.deepEqual(testi(ctx.daConv(undefined)), []);
});

test('raccolta: archivio + conversazioni, senza doppioni nella stessa lingua', () => {
  const archivio = [
    { testo: 'je vais à la MER.', cod: 'fr', origine: 'Frase libera', tema: 'mare' },
    { testo: 'I go home.', cod: 'en', origine: 'Frase libera' },
  ];
  const l = j(ctx.raccogli(archivio, [convFr]));
  assert.equal(l.filter(f => f.testo.toLowerCase() === 'je vais à la mer.').length, 1);
  assert.ok(l.some(f => f.testo === 'I go home.'));
  assert.equal(l.length, 5);
});

test('raccolta: solo le lingue attive, se indicate', () => {
  const archivio = [{ testo: 'I go home.', cod: 'en' }];
  assert.deepEqual(testi(ctx.raccogli(archivio, [convFr, convSp], ['en', 'sp'])), [
    'I go home.', 'Ciao, cos te fe?', 'A vago a ca.', 'A mangio',
  ]);
});

test('ogni frase ha la chiave per le statistiche (lingua + testo normalizzato)', () => {
  const l = j(ctx.raccogli([{ testo: 'I  go Home.', cod: 'en' }], []));
  assert.equal(l[0].chiave, 'en|i go home.');
});
