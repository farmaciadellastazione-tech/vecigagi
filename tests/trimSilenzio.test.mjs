// Test di trovaConfiniSilenzio() — cuore del trim automatico usato dalla
// registrazione audio in-browser (edit.html + edit-storie.html): individua il
// primo/ultimo blocco sopra soglia di ampiezza in un segnale PCM, per tagliare
// il silenzio iniziale/finale senza ffmpeg. Funzione pura (solo Float32Array),
// testabile senza AudioContext/browser.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';

function estraiFunzione(src, nomeFunzione) {
  const start = src.indexOf('function ' + nomeFunzione + '(');
  assert.notStrictEqual(start, -1, `funzione ${nomeFunzione} non trovata`);
  const end = src.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, `chiusura di ${nomeFunzione} non trovata`);
  return src.slice(start, end + 2);
}

function caricaTrovaConfiniSilenzio(src) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(estraiFunzione(src, 'trovaConfiniSilenzio') + '\nthis.trovaConfiniSilenzio = trovaConfiniSilenzio;', ctx);
  return ctx.trovaConfiniSilenzio;
}

const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');
const STORIE = fs.readFileSync(ROOT + '/edit-storie.html', 'utf8');

// sampleRate=1000, minMs=10 → finestra di 10 campioni: numeri tondi comodi da
// verificare a mano, allineati esattamente ai confini del segnale di test.
function segnaleSilenzioSuonoSilenzio() {
  const ch = new Float32Array(300);
  for (let i = 100; i < 200; i++) ch[i] = 0.5; // suono ben sopra la soglia di default (0.02)
  return ch;
}

for (const [nomeFile, src] of [['edit.html', EDIT], ['edit-storie.html', STORIE]]) {
  const trovaConfiniSilenzio = caricaTrovaConfiniSilenzio(src);

  // Nota: r è un oggetto creato nel realm della vm; deepStrictEqual fallirebbe
  // per prototype diversi ("same structure but not reference-equal") pur con
  // gli stessi valori — si confrontano quindi i campi singolarmente.
  test(`${nomeFile}: silenzio-suono-silenzio → confini allineati al suono`, () => {
    const r = trovaConfiniSilenzio([segnaleSilenzioSuonoSilenzio()], 1000, 0.02, 10);
    assert.strictEqual(r.start, 100); assert.strictEqual(r.end, 200);
  });

  test(`${nomeFile}: buffer interamente silenzioso → nessun taglio (fallback prudente)`, () => {
    const r = trovaConfiniSilenzio([new Float32Array(300)], 1000, 0.02, 10);
    assert.strictEqual(r.start, 0); assert.strictEqual(r.end, 300);
  });

  test(`${nomeFile}: buffer interamente sopra soglia → nessun taglio necessario`, () => {
    const r = trovaConfiniSilenzio([new Float32Array(300).fill(0.5)], 1000, 0.02, 10);
    assert.strictEqual(r.start, 0); assert.strictEqual(r.end, 300);
  });

  test(`${nomeFile}: multicanale → basta un canale sopra soglia per contare come "suono"`, () => {
    const silenzioso = new Float32Array(300);
    const conSuono = segnaleSilenzioSuonoSilenzio();
    const r = trovaConfiniSilenzio([silenzioso, conSuono], 1000, 0.02, 10);
    assert.strictEqual(r.start, 100); assert.strictEqual(r.end, 200);
  });
}
