// Review di 3f90f5d: con le registrazioni anche nelle letture automatiche,
// parla() faceva partire il file senza fermare una lettura sintetica in corso
// o in coda (_parlaTimer): le due voci si sovrapponevano (es. si risponde
// mentre la voce sta ancora leggendo la domanda). Ora "l'ultimo vince" vale
// anche quando parte una registrazione.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const codice = HTML.slice(HTML.indexOf('let _audioCorrente = null;'), HTML.indexOf('function parlaTTS('));

test('una registrazione ferma la voce sintetica in corso e quella in coda', () => {
  const eventi = [];
  const ctx = vm.createContext({
    window: { speechSynthesis: { cancel: () => eventi.push('cancel') } },
    Audio: class { constructor(src) { this.src = src; } play() { eventi.push('play ' + this.src); return Promise.resolve(); } pause() {} },
    clearTimeout: id => eventi.push('clearTimeout ' + id),
    parlaTTS: () => eventi.push('tts'),
  });
  vm.runInContext(codice + '\n_parlaTimer = 42; globalThis.parla = parla;', ctx);
  ctx.parla('air conto per piazze', 'it-IT', false, 'sp/er-conto-pe-piase.mp3');
  assert.deepStrictEqual(eventi, ['clearTimeout 42', 'cancel', 'play audio/sp/er-conto-pe-piase.mp3']);
});
