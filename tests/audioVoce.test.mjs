// Test di audioVoce() — feature "voci dialettali registrate" (fase 1, 2026-07-19).
//
// Il campo opzionale `audio` di una voce del vocabolario mappa codice lingua →
// nome file registrato (es. audio:{sp:"tiae.mp3"} → audio/sp/tiae.mp3).
// audioVoce(entry, codice) risolve il path relativo sotto audio/ oppure
// ritorna null: in quel caso parla() usa il TTS come sempre (fallback che
// copre anche il file mancante o l'autoplay bloccato, via catch su play()).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Estrae il sorgente di audioVoce: funzione breve senza graffe annidate,
// basta la prima "}" a inizio riga dopo la dichiarazione.
function estraiAudioVoce(src) {
  const start = src.indexOf('function audioVoce(');
  assert.notStrictEqual(start, -1, 'funzione audioVoce non trovata in index.html');
  const end = src.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, 'chiusura di audioVoce non trovata');
  return src.slice(start, end + 2);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(estraiAudioVoce(INDEX) + '\nthis.audioVoce = audioVoce;', ctx);
const audioVoce = ctx.audioVoce;

test('voce con audio per la lingua richiesta → path relativo lingua/file', () => {
  const entry = { it: 'tirare', sp: "tià'e/tiae", audio: { sp: 'tiae.mp3' } };
  assert.strictEqual(audioVoce(entry, 'sp'), 'sp/tiae.mp3');
});

test('voce con audio ma non per la lingua richiesta → null (fallback TTS)', () => {
  const entry = { it: 'tirare', sp: "tià'e/tiae", mn: 'tiaa', audio: { sp: 'tiae.mp3' } };
  assert.strictEqual(audioVoce(entry, 'mn'), null);
});

test('voce senza campo audio → null (comportamento invariato)', () => {
  const entry = { it: 'acqua', sp: 'aigua/àigoa' };
  assert.strictEqual(audioVoce(entry, 'sp'), null);
});

test('entry null/undefined → null, niente crash', () => {
  assert.strictEqual(audioVoce(null, 'sp'), null);
  assert.strictEqual(audioVoce(undefined, 'sp'), null);
});

test('la voce pilota "tirare" in VOCABOLARIO_DEFAULT ha il file che esiste nel repo', () => {
  assert.match(INDEX, /it:"tirare"[^\n]*audio:\{sp:"tiae\.mp3"\}/,
    'la voce "tirare" deve avere audio:{sp:"tiae.mp3"}');
  assert.ok(fs.existsSync(ROOT + '/audio/sp/tiae.mp3'),
    'audio/sp/tiae.mp3 deve esistere nel repo');
});
