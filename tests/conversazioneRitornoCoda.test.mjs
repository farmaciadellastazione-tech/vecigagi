// Segnalazione di Dino (2026-10-17): due verbi sbagliati; dalla prima frase
// "Continua a parlarne" porta alla Conversazione, ma da lì non si tornava alla
// seconda parola sbagliata (solo "← Home", e la coda si perdeva).
// Ora, se si arriva dalla coda, la Conversazione offre "← Prossima sbagliata"
// che riapre Frase libera sulla parola successiva (o i risultati se finita).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
vm.runInContext(tra('function ritornoDaConversazione(', '\n// ── fine ritorno coda') + '\nglobalThis.r = ritornoDaConversazione;', ctx);
const j = x => JSON.parse(JSON.stringify(x));

test('dalla coda: la prossima parola, poi i risultati', () => {
  const coda = [{ entry: { it: 'a' } }, { entry: { it: 'b' } }];
  assert.deepStrictEqual(j(ctx.r(coda, 0, 'quiz')), { tipo: 'frase', indice: 1, etichetta: '← Prossima sbagliata (2 di 2)' });
  assert.deepStrictEqual(j(ctx.r(coda, 1, 'quiz')), { tipo: 'risultati', schermata: 'quiz', etichetta: '← Torna ai risultati' });
});

test('senza coda niente ritorno speciale (resta Home)', () => {
  assert.strictEqual(ctx.r(null, 0, null), null);
  assert.strictEqual(ctx.r([], 0, 'quiz'), null);
});

test('Frase libera passa la sua posizione; la Conversazione mostra il ritorno', () => {
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  assert.match(fl, /onDiscutine\(carta\.lingua, \{[\s\S]*?\}, usaCoda \? posCoda : null\)/);
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(conv, /ritorno \? ritorno\.etichetta : "← Home"/);
  assert.match(conv, /onClick: ritorno \? onRitorno : onHome/);
  assert.match(HTML, /ritorno: ritornoConv,/);
});
