// Giorni consecutivi e cambio dell'ora legale (segnalazione di Dino, 2026-11-05:
// "a volte si azzera la progressione dei giorni consecutivi").
// Bug: "ieri" era calcolato come oggi() - 86400000, ma il giorno del cambio
// d'ora dura 23 o 25 ore, quindi la mezzanotte di ieri non coincideva e la
// serie ripartiva da 1 due volte l'anno (ultima domenica di marzo e di ottobre).
//   eseguire con:  node --test
process.env.TZ = 'Europe/Rome';
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error('non trovato: ' + a); return HTML.slice(i, HTML.indexOf(b, i)); };
const mezzanotte = (y, m, d) => new Date(y, m - 1, d).getTime();

// Esegue la aggiornaStreak REALE di App con oggi() fissato
function aggiorna(oggiFissato, iniziale) {
  const m = HTML.match(/function aggiornaStreak\(\)\s*\{[\s\S]*?\n  \}/);
  if (!m) throw new Error('aggiornaStreak non trovata');
  const store = new Map();
  if (iniziale) store.set('k', JSON.stringify(iniziale));
  const ctx = vm.createContext({
    SK_STREAK: 'k',
    oggi: () => oggiFissato,
    loadJSON: (k, def) => (store.has(k) ? JSON.parse(store.get(k)) : def),
    saveJSON: (k, v) => store.set(k, JSON.stringify(v)),
    setStreak: () => {},
  });
  vm.runInContext(m[0] + '\naggiornaStreak();', ctx);
  return JSON.parse(store.get('k'));
}

const CAMBI_ORA = [
  [[2026, 10, 25], [2026, 10, 26], 'ottobre (giorno di 25 ore)'],
  [[2026, 3, 29], [2026, 3, 30], 'marzo (giorno di 23 ore)'],
];

test('la serie continua il giorno dopo il cambio d\'ora (ottobre e marzo)', () => {
  for (const [ieri, oggi, nome] of CAMBI_ORA) {
    const r = aggiorna(mezzanotte(...oggi), { lastDay: mezzanotte(...ieri), count: 12 });
    assert.deepEqual(r, { lastDay: mezzanotte(...oggi), count: 13 }, nome);
  }
});

test('giorno saltato, anche a cavallo del cambio d\'ora: riparte da 1', () => {
  const r = aggiorna(mezzanotte(2026, 10, 26), { lastDay: mezzanotte(2026, 10, 24), count: 12 });
  assert.equal(r.count, 1);
});

test('eIeri (usata dalla Home per "Streak attivo/finito") regge il cambio d\'ora', () => {
  const ctx = vm.createContext({});
  vm.runInContext(tra('function eIeri(', '\nfunction getCoppia('), ctx);
  for (const [ieri, oggi, nome] of CAMBI_ORA) assert.equal(ctx.eIeri(mezzanotte(...ieri), mezzanotte(...oggi)), true, nome);
  assert.equal(ctx.eIeri(mezzanotte(2026, 10, 24), mezzanotte(2026, 10, 26)), false, 'due giorni fa');
  assert.equal(ctx.eIeri(mezzanotte(2026, 10, 26), mezzanotte(2026, 10, 26)), false, 'oggi');
});

test('nessun confronto della serie con "- 86400000" esatto', () => {
  assert.doesNotMatch(HTML, /str\.lastDay === g - 86400000/);
  assert.doesNotMatch(HTML, /const ieri = g - 86400000/);
});

// Dalla code review: stesso errore in "rispetto a N giorni fa" (Statistiche)
test('trovaSnapshotVicino: una settimana dopo il cambio d\'ora trova lo snapshot di 7 giorni fa, non di 8', () => {
  const ctx = vm.createContext({ oggi: () => mezzanotte(2026, 4, 5) });
  vm.runInContext(tra('function trovaSnapshotVicino(', '\nfunction contaScadute('), ctx);
  const storico = [{ d: mezzanotte(2026, 3, 28), n: 10 }, { d: mezzanotte(2026, 3, 29), n: 20 }, { d: mezzanotte(2026, 3, 30), n: 30 }];
  assert.equal(ctx.trovaSnapshotVicino(storico, 7).n, 20, 'il 29 marzo');
  assert.equal(ctx.trovaSnapshotVicino(storico, 6).n, 30, 'il 30 marzo');
});
