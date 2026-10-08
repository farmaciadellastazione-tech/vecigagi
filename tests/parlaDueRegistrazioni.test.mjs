// Review di 5c1fa9e: con due registrazioni ravvicinate, la pause() della
// prima ne fa fallire la play() (AbortError) DOPO che la seconda è partita:
// il catch azzerava _audioCorrente (la seconda non si fermava più) e leggeva
// la prima con la voce sintetica sopra la seconda. Ora il ripiego TTS scatta
// solo se quella registrazione è ancora la corrente.
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

function ambiente() {
  const eventi = [];
  const rifiuti = [];
  const ctx = vm.createContext({
    window: { speechSynthesis: { cancel: () => {} } },
    Audio: class {
      constructor(src) { this.src = src; }
      play() { return new Promise((_, rej) => rifiuti.push(() => rej(new Error('AbortError')))); }
      pause() { eventi.push('pause ' + this.src); }
    },
    clearTimeout: () => {},
    parlaTTS: t => eventi.push('tts ' + t),
  });
  vm.runInContext(codice + '\nglobalThis.parla = parla; globalThis.corrente = () => _audioCorrente && _audioCorrente.src;', ctx);
  return { ctx, eventi, rifiuti };
}

test('la play() interrotta della prima registrazione non legge con la voce sintetica', async () => {
  const { ctx, eventi, rifiuti } = ambiente();
  ctx.parla('A', 'it-IT', false, 'sp/a.mp3');
  ctx.parla('B', 'it-IT', false, 'sp/b.mp3');
  rifiuti[0](); // la play() di A fallisce dopo che B è partita
  await new Promise(r => setTimeout(r, 0));
  assert.ok(!eventi.includes('tts A'), 'A non va letta con la voce sintetica');
  assert.strictEqual(ctx.corrente(), 'audio/sp/b.mp3', 'B resta la registrazione corrente');
});

test('se la registrazione corrente non si carica, ripiego sulla voce sintetica come prima', async () => {
  const { ctx, eventi, rifiuti } = ambiente();
  ctx.parla('B', 'it-IT', false, 'sp/b.mp3');
  rifiuti[0]();
  await new Promise(r => setTimeout(r, 0));
  assert.ok(eventi.includes('tts B'));
});
