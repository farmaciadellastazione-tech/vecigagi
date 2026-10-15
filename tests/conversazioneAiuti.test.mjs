// Aiuti anche nella Conversazione (segnalazione di Dino, 2026-10-15: con
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
vm.runInContext(AIUTI + '\nglobalThis.promptIdeeRisposta = promptIdeeRisposta; globalThis.promptTraduciBattuta = promptTraduciBattuta; globalThis.promptAiutoRisposta = promptAiutoRisposta;', ctx);

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

// Review di 1d3f4a2:
test('Traduci: corretta la battuta, la traduzione vecchia si azzera', () => {
  const tb = tra('function TraduciBattuta(', '\nfunction AiutiConversazione(');
  assert.match(tb, /useEffect\(\(\) => \{\s*setStato\("idle"\);\s*setTrad\(""\);\s*setAperta\(false\);\s*\}, \[testo\]\);/);
});

test('aiuti: si azzerano a ogni nuova battuta dell\'IA (anche se uguale) e restano fermi mentre l\'IA scrive', () => {
  assert.match(CONV, /key: "aiuti-" \+ nBattuteIA/);
  assert.match(CONV, /occupato: stato === "generando" \|\| stato === "elaborando"/);
  assert.match(AIUTI, /disabled: occupato \|\| stato === "loading"/);
});

test('l\'italiano mandato al foglio è quello tradotto davvero, e solo se è italiano', () => {
  assert.match(AIUTI, /italiano: ris\.italiano,/);
  assert.match(AIUTI, /const italianoChiesto = userLangName === "Italiano" \? testoAiuto\.trim\(\) : "";/);
  assert.match(AIUTI, /italiano: userLangName === "Italiano" \? idea\.traduzione : ""/);
});

test('prompt del traduttore come funzione, e niente blocchi se l\'IA va in errore', () => {
  const p = ctx.promptAiutoRisposta('Francese', 'Italiano', 'Tu aimes la mer ?', 'sì, molto');
  assert.match(p.user, /sì, molto/);
  assert.match(p.user, /Tu aimes la mer \?/);
  assert.match(p.system, /"sentence"/);
  assert.ok((AIUTI.match(/\} catch \(e\) \{/g) || []).length >= 2);
});
