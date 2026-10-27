// Bug segnalato da Dino (2026-10-27): nelle coniugazioni, una risposta giusta
// ma in un'altra lingua non dava "lingua sbagliata, riprova" come nel
// vocabolario: la carta (generaEserciziConiugazioni) ha in `entry` solo le
// due lingue della domanda, e linguaDellaRisposta cerca nelle altre.
// Dopo la code review: `entry` resta di due lingue (Segnala errore, doppioni
// della sessione e lista delle sbagliate la usano); le forme di tutte le
// lingue vanno in `forme`, usato solo da questo controllo, fra le lingue
// attive, e non se il soggetto indica un'altra persona ("tu amo").
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
const L = c => ({ codice: c });

test('carta di coniugazione: entry con le due lingue, forme con tutte (una copia sola)', () => {
  const carte = ctx.genera([L('it'), L('en'), L('fr')]);
  const c = carte.find(x => x.lDA.codice === 'it' && x.lA.codice === 'en');
  assert.deepEqual(JSON.parse(JSON.stringify(c.entry)), { it: 'amo', en: 'I love' });
  assert.deepEqual(JSON.parse(JSON.stringify(c.forme)), { it: 'amo', en: 'I love', fr: "j'aime", de: 'ich liebe' });
  assert.ok(carte.every(x => x.forme === c.forme), 'condivise fra le carte della stessa forma');
});

test('verificaRisposta: per le coniugazioni cerca in forme, fra le lingue attive, non col soggetto di un\'altra persona', () => {
  const v = tra('  function verificaRisposta(', '  function nonLoSo()');
  assert.match(v, /const soggettoSbagliato = carta\.tipo === "coniugazione" && soggettoPersonaSbagliata\(risposta, lA\?\.codice, carta\.persona\);/);
  assert.match(v, /if \(!ok && modoCarta !== "pronuncia" && !soggettoSbagliato\) \{/);
  assert.match(v, /linguaDellaRisposta\(carta\.tipo === "coniugazione" \? carta\.forme \|\| carta\.entry : carta\.entry, risposta, carta\.tipo === "coniugazione" \? lingue\.filter\(l => l\.attiva\) : lingue,/);
});
