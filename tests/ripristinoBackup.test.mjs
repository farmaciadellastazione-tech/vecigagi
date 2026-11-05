// Ripristino del backup automatico dopo un azzeramento di emergenza (scelta di
// Dino, 2026-11-05): avviso in Home con "Ripristina", solo se c'è un backup non
// ancora usato/chiuso. Il ripristino UNISCE come "Importa progressi" (per ogni
// parola il livello più alto): non fa mai perdere quello che l'utente ha fatto
// dopo l'azzeramento.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error('non trovato: ' + a); const j = HTML.indexOf(b, i); if (j < 0) throw new Error('non trovato: ' + b); return HTML.slice(i, j); };

const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
const blocco = tra('function unisciStreak(', '\nfunction esportaProgressi(');
vm.runInContext(HTML.match(/^const SK_[A-Z_]+ = .*$/gm).filter(l => !blocco.includes(l)).join('\n'), ctx);
vm.runInContext(blocco, ctx);

const G = 86400000;
const unisci = (att, bk) => JSON.parse(JSON.stringify(ctx.unisciBackupProgressi(att, bk)));
const j = JSON.stringify;

test('stats: per ogni parola il livello più alto, nessuna persa', () => {
  const r = unisci(
    { qml_v10_stats: j({ a: { livello: 1 }, nuova: { livello: 2 } }) },
    { qml_v10_stats: j({ a: { livello: 4 }, b: { livello: 3 } }) });
  assert.deepEqual(JSON.parse(r.qml_v10_stats), { a: { livello: 4 }, b: { livello: 3 }, nuova: { livello: 2 } });
});

test('parole aggiunte dall\'utente (SK_VOC): tornano, senza doppioni', () => {
  const r = unisci(
    { qml_v10_vocabolario: j([{ it: 'oggi', sp: 'ancöi' }]) },
    { qml_v10_vocabolario: j([{ it: 'mia', sp: 'a me' }, { it: 'oggi', sp: 'vecchia' }]) });
  const v = JSON.parse(r.qml_v10_vocabolario);
  assert.deepEqual(v.map(e => e.it).sort(), ['mia', 'oggi']);
  assert.equal(v.find(e => e.it === 'oggi').sp, 'ancöi', 'vince la versione attuale');
});

test('lingue: tornano quelle dell\'utente (con i loro flag), più le nuove', () => {
  const r = unisci(
    { qml_v10_lingue: j([{ codice: 'it', attiva: true }, { codice: 'en', attiva: true }]) },
    { qml_v10_lingue: j([{ codice: 'it', attiva: true }, { codice: 'en', attiva: false }, { codice: 'sp', attiva: true }]) });
  assert.deepEqual(JSON.parse(r.qml_v10_lingue), [{ codice: 'it', attiva: true }, { codice: 'en', attiva: false }, { codice: 'sp', attiva: true }]);
});

test('record: il più alto per chiave', () => {
  const r = unisci({ qml_v10_record: j({ x: 5, y: 1 }) }, { qml_v10_record: j({ x: 3, z: 9 }) });
  assert.deepEqual(JSON.parse(r.qml_v10_record), { x: 5, y: 1, z: 9 });
});

test('serie di giorni: si ricongiunge se dopo l\'azzeramento hai continuato senza saltare', () => {
  assert.deepEqual(ctx.unisciStreak({ lastDay: 10 * G, count: 1 }, { lastDay: 9 * G, count: 12 }), { lastDay: 10 * G, count: 13 });
  assert.deepEqual(ctx.unisciStreak({ lastDay: 12 * G, count: 3 }, { lastDay: 9 * G, count: 12 }), { lastDay: 12 * G, count: 15 });
  assert.deepEqual(ctx.unisciStreak({ lastDay: 9 * G, count: 1 }, { lastDay: 9 * G, count: 12 }), { lastDay: 9 * G, count: 12 }, 'stesso giorno');
  assert.deepEqual(ctx.unisciStreak({ lastDay: 0, count: 0 }, { lastDay: 9 * G, count: 12 }), { lastDay: 9 * G, count: 12 }, 'niente dopo il reset');
  assert.deepEqual(ctx.unisciStreak({ lastDay: 15 * G, count: 2 }, { lastDay: 9 * G, count: 12 }), { lastDay: 15 * G, count: 2 }, 'giorni saltati: vale la nuova');
});

test('dati illeggibili in una chiave non bloccano le altre', () => {
  const r = unisci({ qml_v10_stats: '{rotto' }, { qml_v10_stats: j({ a: { livello: 2 } }), qml_v10_record: j({ x: 1 }) });
  assert.deepEqual(JSON.parse(r.qml_v10_stats), { a: { livello: 2 } });
  assert.deepEqual(JSON.parse(r.qml_v10_record), { x: 1 });
});

test('Home mostra l\'avviso solo con un backup non chiuso; App ripristina e ricarica', () => {
  const home = tra('function Home({', '\nfunction ');
  assert.match(home, /backupCrash && !backupCrash\.chiuso/);
  assert.match(home, /onRipristinaBackup/);
  const app = tra('function App()', '\n// Error boundary');
  assert.match(app, /function ripristinaBackup\(\)/);
  assert.match(app, /unisciBackupProgressi\(/);
  assert.match(app, /onRipristinaBackup: ripristinaBackup/);
});
