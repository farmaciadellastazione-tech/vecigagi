// Segnalazione di Dino (2026-10-17): due verbi sbagliati; dalla prima frase
// "Continua a parlarne" porta alla Conversazione, ma da lì non si tornava alla
// seconda parola sbagliata (solo "← Home", e la coda si perdeva).
// Ora, se si arriva dalla coda, la Conversazione offre "Prossima sbagliata →"
// (o "← Torna ai risultati" se era l'ultima), senza togliere "← Home".
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

test('dalla coda: la prossima parola (freccia in avanti), poi i risultati', () => {
  const coda = [{ entry: { it: 'a' } }, { entry: { it: 'b' } }];
  assert.deepStrictEqual(j(ctx.r(coda, 0, 'quiz')), { tipo: 'frase', indice: 1, etichetta: 'Prossima sbagliata (2 di 2) →' });
  assert.deepStrictEqual(j(ctx.r(coda, 1, 'quiz')), { tipo: 'risultati', schermata: 'quiz', etichetta: '← Torna ai risultati' });
});

test('senza coda niente ritorno speciale', () => {
  assert.strictEqual(ctx.r(null, 0, null), null);
  assert.strictEqual(ctx.r([], 0, 'quiz'), null);
});

test('Frase libera passa la sua posizione; "← Home" resta; il ritorno è un pulsante a parte, fermo mentre l\'IA risponde', () => {
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  assert.match(fl, /onDiscutine\(carta\.lingua, \{[\s\S]*?\}, usaCoda \? posCoda : null\)/);
  const conv = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.doesNotMatch(conv, /ritorno \? ritorno\.etichetta : "← Home"/);
  assert.match(conv, /disabled: !!occupata/);
  assert.ok((conv.match(/React\.createElement\(PulsanteRitorno, \{/g) || []).length >= 3, 'chat, fine, scelta lingua');
});

test('la coda della Conversazione si dimentica tornando alla Home o aprendola dal menu', () => {
  assert.match(HTML, /onHome: \(\) => \{\s*setConvPosCoda\(null\);\s*setSchermata\("home"\);/);
  const ramo = tra('if (mod === "conversazione") {', '\n      return;');
  assert.match(ramo, /setConvPosCoda\(null\);/);
});
