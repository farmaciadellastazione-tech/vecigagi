// Bug segnalato da Dino (2026-10-27): nelle coniugazioni, una risposta giusta
// ma in un'altra lingua non dava "lingua sbagliata, riprova" come nel
// vocabolario. Causa: la carta (generaEserciziConiugazioni) aveva in `entry`
// solo le due lingue della domanda, e linguaDellaRisposta cerca nelle altre.
// Ora `entry` ha le forme di tutte le lingue della stessa persona e tempo.
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
const ctx = vm.createContext({
  LINGUE_CONIUG: { it: 1, en: 1, fr: 1 },
  LIVELLO_TEMPO: { presente: 'A1' },
  CONIUGAZIONI: { amare: { tempi: { presente: { forme: [
    { p: '1ª sing.', it: 'amo', en: 'I love', fr: "j'aime", de: 'ich liebe' },
  ] } } } },
});
ctx.globalThis = ctx;
vm.runInContext(tra('function generaEserciziConiugazioni(', '\n// ── Schermata Verbi') + '\nglobalThis.genera = generaEserciziConiugazioni;', ctx);
const j = x => JSON.parse(JSON.stringify(x));
const L = c => ({ codice: c });

test('la carta di coniugazione ha le forme di tutte le lingue (stessa persona e tempo)', () => {
  const carte = j(ctx.genera([L('it'), L('en'), L('fr')]));
  const c = carte.find(x => x.lDA.codice === 'it' && x.lA.codice === 'en');
  assert.deepEqual(c.entry, { it: 'amo', en: 'I love', fr: "j'aime", de: 'ich liebe' });
  assert.equal(c.atteso, 'I love');
  assert.ok(!('p' in c.entry)); // la persona non è una lingua
});
