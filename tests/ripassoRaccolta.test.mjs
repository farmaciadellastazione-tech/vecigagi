// Ripasso frasi, passo 3 (2026-10-26): quali frasi si ripassano. Fonti:
// l'archivio di Frase libera (già filtrato al salvataggio) e le conversazioni
// salvate. Regola aggiornata dopo la code review (Dino, 2026-10-27): si
// ripassano solo frasi ESATTE.
//  - lingue normali: battute dell'IA valide (quelle che la voce legge: niente
//    "Errore..." né JSON rotto); della frase dello studente la versione
//    pulita dell'IA (`pulita`, tutti gli errori corretti, anche i piccoli) o,
//    nelle conversazioni vecchie senza `pulita`, la correzione. Una frase
//    "senza correzione" può avere errori piccoli: fuori.
//  - la frase dello studente conta solo se l'IA ha risposto davvero (turno
//    dopo = battuta IA valida); altrimenti non è stata valutata.
//  - dialetti (mn/sp/ge/cr): solo testi corretti a mano con ✏️ Correggi
//    (`corretta`, `correzioneCorretta`); il giudizio dell'IA non basta.
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
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx); // normalizza
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'globalThis.daConv = frasiDaConversazioni; globalThis.raccogli = frasiDaRipassare;',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const testi = l => j(l).map(f => f.testo);

const convFr = {
  id: 'a', lingua: 'fr', tema: 'viaggi', turni: [
    { ruolo: 'ia', testo: 'Salut ! Tu pars où cet été ?' },
    { ruolo: 'utente', testo: 'Je vais a la mer', correzione: null, nota: null, pulita: 'Je vais à la mer.' },
    { ruolo: 'ia', testo: 'Super, quelle mer ?' },
    { ruolo: 'utente', testo: 'Je aller en Sicile', correzione: 'Je vais en Sicile.', nota: '...' }, // vecchia: senza pulita
    { ruolo: 'ia', testo: 'La Sicile est belle !' },
    { ruolo: 'utente', testo: 'Oui c\'est tres beau', correzione: null }, // vecchia, "senza correzione": può avere errori
    { ruolo: 'ia', testo: 'Tu y vas en avion ?' },
  ],
};

test('lingue normali: battute IA, versione pulita o correzione; mai "senza correzione"', () => {
  assert.deepEqual(testi(ctx.daConv([convFr])), [
    'Salut ! Tu pars où cet été ?', 'Je vais à la mer.', 'Super, quelle mer ?', 'Je vais en Sicile.',
    'La Sicile est belle !', 'Tu y vas en avion ?',
  ]);
  const f = j(ctx.daConv([convFr]))[0];
  assert.equal(f.cod, 'fr');
  assert.equal(f.origine, 'Conversazione');
  assert.equal(f.tema, 'viaggi');
});

test('risposte dell\'IA fallite o rotte: fuori, e anche la frase dello studente non valutata', () => {
  const conv = {
    id: 'e', lingua: 'en', turni: [
      { ruolo: 'ia', testo: 'Hi! How are you?' },
      { ruolo: 'utente', testo: 'I am fine', correzione: null, pulita: 'I am fine.' },
      { ruolo: 'ia', testo: 'Errore connessione: Failed to fetch' },
      { ruolo: 'utente', testo: 'I go home', correzione: null, pulita: 'I am going home.' },
      { ruolo: 'ia', testo: '{"reply":"Why are you going ho' },
      { ruolo: 'utente', testo: 'Because late', correzione: 'Because it is late.', pulita: 'Because it is late.' },
      // ultima frase: l'IA non ha risposto (nessun turno dopo)
    ],
  };
  assert.deepEqual(testi(ctx.daConv([conv])), ['Hi! How are you?']);
});

const convSp = {
  id: 'b', lingua: 'sp', turni: [
    { ruolo: 'ia', testo: 'Ciao, cosa ti fai?' },                         // IA non controllata: fuori
    { ruolo: 'utente', testo: 'A vago a ca.', correzione: null, pulita: 'A vago a cà.' }, // giudizio IA: non basta
    { ruolo: 'ia', testo: 'Ciao, cos te fe?', corretta: true },            // corretta a mano: dentro
    { ruolo: 'utente', testo: 'A vado a ca', correzione: 'A vago a cà.' }, // correzione IA: fuori
    { ruolo: 'ia', testo: 'E po?' },
    { ruolo: 'utente', testo: 'A magno', correzione: 'A mangio', correzioneCorretta: true }, // sistemata a mano: dentro
    { ruolo: 'ia', testo: 'Ben!' },
  ],
};

test('dialetti: solo testi corretti a mano', () => {
  assert.deepEqual(testi(ctx.daConv([convSp])), ['Ciao, cos te fe?', 'A mangio']);
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
  assert.equal(l.length, 7);
});

test('raccolta: solo le lingue attive, se indicate', () => {
  const archivio = [{ testo: 'I go home.', cod: 'en' }];
  assert.deepEqual(testi(ctx.raccogli(archivio, [convFr, convSp], ['en', 'sp'])), [
    'I go home.', 'Ciao, cos te fe?', 'A mangio',
  ]);
});

test('ogni frase ha la chiave per le statistiche (lingua + testo normalizzato)', () => {
  const l = j(ctx.raccogli([{ testo: 'I  go Home.', cod: 'en' }], []));
  // terza code review: la chiave usa normalizza come il confronto (senza punteggiatura)
  assert.equal(l[0].chiave, 'en|i go home');
});

// Seconda code review (2026-10-27): battuta dell'IA recuperata da una risposta
// troncata (`parziale`): può essere monca, fuori; e con lei la frase dello
// studente prima (l'IA non ha risposto per intero).
test('battute IA parziali: fuori, e anche la frase dello studente prima', () => {
  const conv = {
    id: 'p', lingua: 'en', turni: [
      { ruolo: 'ia', testo: 'Hi! How are you?' },
      { ruolo: 'utente', testo: 'I am fine', correzione: 'I am fine.' },
      { ruolo: 'ia', testo: 'Why are you going ho', parziale: true },
    ],
  };
  assert.deepEqual(testi(ctx.daConv([conv])), ['Hi! How are you?']);
});

// Terza code review (2026-10-27): una battuta troncata (`parziale`) poi
// corretta a mano con ✏️ Correggi (`corretta`) l'ha controllata una persona:
// vale, e con lei la frase dello studente prima.
test('battuta parziale corretta a mano: dentro, e la frase dello studente prima', () => {
  const conv = {
    id: 'q', lingua: 'sp', turni: [
      { ruolo: 'ia', testo: 'Ciao!', corretta: true },
      { ruolo: 'utente', testo: 'A magno', correzione: 'A mangio', correzioneCorretta: true },
      { ruolo: 'ia', testo: 'E cosa te mangi?', parziale: true, corretta: true },
    ],
  };
  assert.deepEqual(testi(ctx.daConv([conv])), ['Ciao!', 'A mangio', 'E cosa te mangi?']);
});

test('pulita che non è testo (dati vecchi o strani): si usa la correzione', () => {
  const conv = { id: 'r', lingua: 'en', turni: [
    { ruolo: 'utente', testo: 'I goes', correzione: 'I go.', pulita: { text: 'x' } },
    { ruolo: 'ia', testo: 'Where?' },
  ] };
  assert.deepEqual(testi(ctx.daConv([conv])), ['I go.', 'Where?']);
});

// Terza code review (2026-10-27): "Ciao, come stai?" e "Ciao come stai" erano
// due frasi con statistiche separate, mentre il confronto le considera uguali.
test('stessa frase con punteggiatura o accenti diversi: una sola', () => {
  const l = j(ctx.raccogli([
    { testo: 'Ciao, come stai?', cod: 'it' },
    { testo: 'ciao come stai', cod: 'it' },
    { testo: 'Ciào come stai!', cod: 'it' },
  ], []));
  assert.equal(l.length, 1);
  assert.equal(l[0].testo, 'Ciao, come stai?'); // vince la prima
});

// Quarta code review (2026-10-27): archivio e ripasso usano la stessa funzione
// per riconoscere la stessa frase (prima due regole diverse).
test('una sola regola per "stessa frase": chiaveFraseRipasso con normalizza', () => {
  assert.match(HTML, /const chiaveFraseRipasso = x => normalizza\(String\(x \|\| ""\)\);/);
  assert.match(HTML, /const chiave = f\.cod \+ "\|" \+ chiaveFraseRipasso\(f\.testo\);/);
});
