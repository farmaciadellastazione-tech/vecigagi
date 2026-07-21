// Test dello slug proposto per i nomi file della registrazione audio in-browser
// (edit.html + edit-storie.html, feature "Audio dialettale" fase 3/4).
//
// Vocabolario: lo slug si ricava dalla parte "pronuncia" (prima di "/") del
// valore corrente della cella dialettale — coerente con la voce pilota reale
// audio:{sp:"tiae.mp3"}, dove sp:"tià'e/tiae" → TTS legge "tià'e" (pronuncia).
// Storie: lo slug si ricava dal titolo della storia + indice 1-based a 2 cifre.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';

// Estrae il sorgente di una funzione breve senza graffe annidate a inizio riga:
// basta la prima "}" a inizio riga dopo la dichiarazione (stesso approccio di
// tests/audioVoce.test.mjs).
function estraiFunzione(src, nomeFunzione) {
  const start = src.indexOf('function ' + nomeFunzione + '(');
  assert.notStrictEqual(start, -1, `funzione ${nomeFunzione} non trovata`);
  const end = src.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, `chiusura di ${nomeFunzione} non trovata`);
  return src.slice(start, end + 2);
}

// ── edit.html: sluggifyAudio + nomeFileAudioProposto ──
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');
const ctxVocab = {};
vm.createContext(ctxVocab);
vm.runInContext(
  estraiFunzione(EDIT, 'sluggifyAudio') + '\n' + estraiFunzione(EDIT, 'nomeFileAudioProposto') +
  '\nthis.sluggifyAudio = sluggifyAudio; this.nomeFileAudioProposto = nomeFileAudioProposto;',
  ctxVocab
);
const { sluggifyAudio, nomeFileAudioProposto } = ctxVocab;

test('sluggifyAudio: pronuncia dialettale con apostrofo/accento → slug ASCII coerente con la voce pilota', () => {
  assert.strictEqual(sluggifyAudio("tià'e"), 'tiae');
});

test('sluggifyAudio: spazi e maiuscole → kebab-case minuscolo', () => {
  assert.strictEqual(sluggifyAudio('Ca Neigra'), 'ca-neigra');
});

test('sluggifyAudio: stringa vuota/assente → fallback "audio"', () => {
  assert.strictEqual(sluggifyAudio(''), 'audio');
  assert.strictEqual(sluggifyAudio(undefined), 'audio');
});

test('nomeFileAudioProposto: usa la parte pronuncia (prima di "/") della cella dialettale', () => {
  const v = { it: 'tirare', sp: "tià'e/tiae" };
  assert.strictEqual(nomeFileAudioProposto(v, 'sp'), 'tiae');
});

test('nomeFileAudioProposto: ignora alternative nascoste dopo "|"', () => {
  const v = { it: 'andare', sp: "vàddo/vado|antra forma" };
  assert.strictEqual(nomeFileAudioProposto(v, 'sp'), 'vaddo');
});

// ── edit-storie.html: slugify (esistente) + nomeFileAudioFraseProposto ──
const STORIE = fs.readFileSync(ROOT + '/edit-storie.html', 'utf8');
const ctxStorie = {};
vm.createContext(ctxStorie);
vm.runInContext(
  estraiFunzione(STORIE, 'slugify') + '\n' + estraiFunzione(STORIE, 'nomeFileAudioFraseProposto') +
  '\nthis.slugify = slugify; this.nomeFileAudioFraseProposto = nomeFileAudioFraseProposto;',
  ctxStorie
);
const { nomeFileAudioFraseProposto } = ctxStorie;

test('nomeFileAudioFraseProposto: slug del titolo + indice 1-based a 2 cifre', () => {
  const s = { id: 'sp-a2-patron-e-mezadro', titolo: { testo: 'Patron e mezadro' } };
  assert.strictEqual(nomeFileAudioFraseProposto(s, 0), 'patron-e-mezadro-01');
  assert.strictEqual(nomeFileAudioFraseProposto(s, 2), 'patron-e-mezadro-03');
});

test('nomeFileAudioFraseProposto: senza titolo usa l\'id della storia', () => {
  const s = { id: 'sp-a2-senza-titolo', titolo: { testo: '' } };
  assert.strictEqual(nomeFileAudioFraseProposto(s, 9), 'sp-a2-senza-titolo-10');
});
