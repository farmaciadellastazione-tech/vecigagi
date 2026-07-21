// Test di trovaSegmentiAudio() — segmentazione automatica della registrazione
// "intera poesia" in edit-storie.html: divide il segnale PCM in N segmenti
// separati da pause di silenzio >= minPausaMs (un file audio per verso).
// Funzione pura (solo Float32Array), testabile senza AudioContext/browser.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/edit-storie.html', 'utf8');

function estraiFunzione(src, nomeFunzione) {
  const start = src.indexOf('function ' + nomeFunzione + '(');
  assert.notStrictEqual(start, -1, `funzione ${nomeFunzione} non trovata`);
  const end = src.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, `chiusura di ${nomeFunzione} non trovata`);
  return src.slice(start, end + 2);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(estraiFunzione(SRC, 'trovaSegmentiAudio') + '\nthis.trovaSegmentiAudio = trovaSegmentiAudio;', ctx);
const trovaSegmentiAudio = ctx.trovaSegmentiAudio;

// sampleRate=1000 → finestra 30 campioni, numeri comodi da verificare a mano.
// I bordi attesi sono alla granularità della finestra (30 campioni) ± pad.
function segnale(spec, n) { // spec: [[inizio,fine], ...] dei tratti con suono
  const ch = new Float32Array(n);
  for (const [a, b] of spec) for (let i = a; i < b; i++) ch[i] = 0.5;
  return ch;
}

// Nota: i risultati arrivano dal realm della vm; niente deepStrictEqual su
// oggetti (prototype diversi) — confronto via JSON.stringify.
function assertSegmenti(actual, expected) {
  assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
}

test('due burst separati da pausa lunga → 2 segmenti con pad sui bordi', () => {
  const ch = segnale([[300, 600], [1200, 1500]], 2000); // pausa 600ms > minPausa 300ms
  assertSegmenti(trovaSegmentiAudio([ch], 1000, 0.02, 300, 50),
    [{ start: 250, end: 650 }, { start: 1150, end: 1550 }]);
});

test('pausa più breve di minPausaMs (respiro/cesura) → resta 1 segmento solo', () => {
  const ch = segnale([[300, 600], [750, 1000]], 1500); // pausa 150ms < 300ms
  assertSegmenti(trovaSegmentiAudio([ch], 1000, 0.02, 300, 50),
    [{ start: 250, end: 1070 }]); // fine allineata alla finestra successiva (34*30) + pad
});

test('silenzio iniziale/finale escluso dai segmenti', () => {
  const ch = segnale([[300, 600]], 2000); // 300ms di silenzio prima, 1400ms dopo
  const r = trovaSegmentiAudio([ch], 1000, 0.02, 300, 0);
  assertSegmenti(r, [{ start: 300, end: 600 }]);
});

test('buffer interamente silenzioso → nessun segmento ([])', () => {
  assertSegmenti(trovaSegmentiAudio([new Float32Array(1000)], 1000, 0.02, 300, 50), []);
});

test('pad clampato ai limiti del buffer (suono fino ai bordi)', () => {
  const ch = segnale([[0, 300]], 300);
  assertSegmenti(trovaSegmentiAudio([ch], 1000, 0.02, 300, 50),
    [{ start: 0, end: 300 }]);
});

test('minPausaMs più alto fonde segmenti che a soglia più bassa erano separati (effetto slider)', () => {
  const ch = segnale([[300, 600], [1000, 1300]], 1600); // pausa 400ms
  const separati = trovaSegmentiAudio([ch], 1000, 0.02, 300, 0);
  assert.strictEqual(separati.length, 2);
  const uniti = trovaSegmentiAudio([ch], 1000, 0.02, 500, 0);
  assert.strictEqual(uniti.length, 1);
});

test('multicanale → basta un canale sopra soglia per contare come suono', () => {
  const silenzioso = new Float32Array(2000);
  const conSuono = segnale([[300, 600], [1200, 1500]], 2000);
  const r = trovaSegmentiAudio([silenzioso, conSuono], 1000, 0.02, 300, 0);
  assert.strictEqual(r.length, 2);
});
