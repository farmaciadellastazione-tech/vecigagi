// Aiuti anche nella Conversazione (segnalazione di Dino, 2026-10-16: con
// "Continua a parlarne" sparivano i suggerimenti e la traduzione di Frase
// libera). "🌐 Traduci" sotto ogni battuta dell'IA; "💡 Aiutami" e
// "💭 Dammi un'idea" sotto la casella. Come in Frase libera il risultato si
// riscrive a mano; nei dialetti istruzioni + "✏️ Correggi".
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
const AIUTI = tra('// ── Aiuti Conversazione', '\nfunction estraiRispostaConversazione(');
const CONV = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
const ctx = vm.createContext({});
vm.runInContext(AIUTI + '\nglobalThis.promptIdeeRisposta = promptIdeeRisposta; globalThis.promptTraduciBattuta = promptTraduciBattuta;', ctx);

test('le idee rispondono all\'ultima battuta dell\'IA', () => {
  const p = ctx.promptIdeeRisposta('Francese', 'Italiano', 'Tu aimes la mer ?');
  assert.match(p.user, /Tu aimes la mer \?/);
  assert.match(p.system, /3 different/);
  assert.match(p.system, /"ideas"/);
});

test('la traduzione va nella lingua dei menu (o italiano)', () => {
  const p = ctx.promptTraduciBattuta('Spezzino', 'Italiano', 'A son a ca');
  assert.match(p.system, /into Italiano/);
  assert.match(p.user, /A son a ca/);
});

test('la Conversazione mostra Traduci sulle battute dell\'IA e gli aiuti sotto la casella', () => {
  assert.match(CONV, /React\.createElement\(TraduciBattuta, \{/);
  assert.match(CONV, /React\.createElement\(AiutiConversazione, \{/);
});

test('aiuti: dialetti con istruzioni e Correggi; il risultato non va nella casella', () => {
  assert.ok((AIUTI.match(/istruzioniDialetto\(/g) || []).length >= 2, 'Traduci + Aiutami/Idee (una chiamata comune)');
  assert.match(AIUTI, /React\.createElement\(CorreggiDialetto, \{/);
  assert.match(AIUTI, /origine: "Conversazione"/);
  assert.doesNotMatch(AIUTI, /setBozza|onUsa/);
  assert.match(AIUTI, /select-none/);
});
