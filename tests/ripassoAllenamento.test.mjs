// Ripasso frasi, allenamento (richiesta di Dino, 2026-10-27): una frase
// sbagliata torna in fondo alla sessione finché non è giusta, nella stessa
// modalità e con lo stesso riferimento; al massimo 3 tentativi. Le frasi non
// controllate (🤔) non tornano. Punteggio e statistiche: solo il primo tentativo.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({ localStorage: { getItem: () => null, setItem: () => {} }, DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
  LINGUE_SENZA_AUDIO: new Set(['ia', 'la', 'grc']) });
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'Object.assign(globalThis, { codaDopoEsitoRipasso, primoTentativoRipasso, MAX_TENTATIVI_RIPASSO });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const A = { chiave: 'en|a', testo: 'A.', modo: 'traduzione', a: 'fr', rif: 'A fr.' };
const B = { chiave: 'en|b', testo: 'B.', modo: 'dettato' };

test('sbagliata: torna in fondo, uguale (modalità e riferimento), col tentativo dopo', () => {
  const l = j(ctx.codaDopoEsitoRipasso([A, B], 0, false));
  assert.equal(l.length, 3);
  assert.deepEqual(l[2], { ...A, tentativo: 2 });
});

test('giusta o non controllata: niente cambia', () => {
  assert.equal(ctx.codaDopoEsitoRipasso([A, B], 0, true).length, 2);
  assert.equal(ctx.codaDopoEsitoRipasso([A, B], 0, null).length, 2);
});

test('al massimo 3 tentativi', () => {
  assert.equal(ctx.MAX_TENTATIVI_RIPASSO, 3);
  const l2 = j(ctx.codaDopoEsitoRipasso([{ ...A, tentativo: 2 }], 0, false));
  assert.equal(l2[1].tentativo, 3);
  assert.equal(ctx.codaDopoEsitoRipasso([{ ...A, tentativo: 3 }], 0, false).length, 1);
});

test('primo tentativo: senza segno o 1', () => {
  assert.equal(ctx.primoTentativoRipasso(A), true);
  assert.equal(ctx.primoTentativoRipasso({ ...A, tentativo: 1 }), true);
  assert.equal(ctx.primoTentativoRipasso({ ...A, tentativo: 2 }), false);
  assert.equal(ctx.primoTentativoRipasso(undefined), false);
});

// Passo 2: la schermata
test('schermata: statistiche e punteggio solo al primo tentativo, sbagliata in coda', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /if \(!primoTentativoRipasso\(item\)\) \{\s*if \(giusta\) setRifatte\(n => n \+ 1\);\s*\} else \{/);
  assert.match(S, /setItems\(l => codaDopoEsitoRipasso\(l, i, giusta\)\);/);
  assert.match(S, /setRifatte\(0\);/);
});

test('schermata: contatore delle ripetizioni, "Di nuovo", riepilogo', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  // le frasi della sessione (senza ripetizioni) per "non controllate"
  assert.match(S, /const nBase = items\.filter\(primoTentativoRipasso\)\.length;/);
  assert.match(S, /controllate < nBase && /);
  assert.match(S, /const daRifare = items\.slice\(i \+ 1\)\.filter\(x => !primoTentativoRipasso\(x\)\)\.length;/);
  assert.match(S, /🔁 Di nuovo/);
  assert.match(S, /rifatte > 0 && /);
});
