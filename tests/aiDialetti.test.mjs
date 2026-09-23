// Verifica che l'AI di edit.html non traduca mai i dialetti (mn/sp/ge/cr).
//
// Prima: aiCompletaRiga e completaConAI mandavano comunque il codice
// dialettale all'IA dopo un confirm() di avviso; in passato questo ha
// prodotto voci inventate ma plausibili (vedi memoria progetto, commit
// 5badd31 e 13198ab: 283 voci mn taggate AI_mn).
//
// Dopo: il filtro sta in un unico punto, aiClassificaERTraducici(), così
// vale per ogni chiamante presente e futuro — non serve più che ogni
// funzione ricordi da sé di escludere i dialetti.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

// Come temiEdit.test.mjs, ma riconosce anche il prefisso "async ".
function estraiFunzione(nome) {
  let start = EDIT.indexOf('async function ' + nome + '(');
  if (start === -1) start = EDIT.indexOf('function ' + nome + '(');
  assert.ok(start >= 0, `funzione ${nome} non trovata in edit.html`);
  const fineRiga = EDIT.indexOf('\n', start);
  const riga = EDIT.slice(start, fineRiga);
  if (/\}\s*$/.test(riga) && !/\{\s*$/.test(riga)) return riga;
  const chiusura = EDIT.indexOf('\n}', start);
  return EDIT.slice(start, chiusura + 2);
}

function estraiCostante(nome) {
  const start = EDIT.indexOf('const ' + nome + ' ');
  assert.ok(start >= 0, `const ${nome} non trovata in edit.html`);
  const fine = EDIT.indexOf(';', start); // non ';\n': il file usa CRLF
  return EDIT.slice(start, fine + 1);
}

// Ambiente minimo per aiClassificaERTraducici: le funzioni callGroq/callGemini/...
// sono sostituite da stub che registrano il prompt e restituiscono una
// risposta finta, così non serve una vera chiave API né rete.
function ambiente({ vocabolario = [], rispostaAI }) {
  const promptsUsati = [];
  const stubProvider = async prompt => { promptsUsati.push(prompt); return JSON.stringify(rispostaAI); };
  const ctx = {
    vocabolario,
    aiConfig: { provider: 'groq', key: 'test-key' },
    callGroq: stubProvider,
    callGemini: stubProvider,
    callAnthropic: stubProvider,
    callOpenAI: stubProvider,
  };
  vm.createContext(ctx);
  const codice = [
    estraiCostante('LINGUE'),
    estraiCostante('DIALETTI_TTS_ITA'),
    estraiFunzione('langName'),
    estraiFunzione('temiEsistenti'),
    estraiFunzione('buildAIPrompt'),
    estraiFunzione('aiClassificaERTraducici'),
  ].join('\n');
  vm.runInContext(codice, ctx);
  return { ctx, promptsUsati };
}

test('aiClassificaERTraducici: un dialetto richiesto insieme a una lingua normale viene tolto dal prompt', async () => {
  const { ctx, promptsUsati } = ambiente({ rispostaAI: { tema: '', livello: 'A1', translations: { en: 'dog' } } });
  await ctx.aiClassificaERTraducici('cane', ['mn', 'en']);
  assert.strictEqual(promptsUsati.length, 1);
  assert.doesNotMatch(promptsUsati[0], /mn \(Manarolese\)/);
  assert.match(promptsUsati[0], /en \(Inglese\)/);
});

test('aiClassificaERTraducici: se sono richiesti solo dialetti, il prompt chiede comunque tema/livello via inglese', async () => {
  const { ctx, promptsUsati } = ambiente({ rispostaAI: { tema: '', livello: 'A1', translations: { en: 'dog' } } });
  const sugg = await ctx.aiClassificaERTraducici('cane', ['mn', 'sp']);
  assert.match(promptsUsati[0], /en \(Inglese\)/);
  assert.doesNotMatch(promptsUsati[0], /mn \(Manarolese\)/);
  assert.doesNotMatch(promptsUsati[0], /sp \(Spezzino\)/);
  assert.strictEqual(sugg.livello, 'A1');
});

test('aiClassificaERTraducici: una chiave dialettale nella risposta dell\'AI viene scartata comunque', async () => {
  const { ctx } = ambiente({ rispostaAI: { tema: '', livello: 'A1', translations: { en: 'dog', mn: 'can/cân' } } });
  const sugg = await ctx.aiClassificaERTraducici('cane', ['en']);
  assert.strictEqual(sugg.translations.mn, undefined);
  assert.strictEqual(sugg.translations.en, 'dog');
});

test('aiClassificaERTraducici: nessun dialetto (ge, cr) finisce mai nel testo del prompt', async () => {
  const { ctx, promptsUsati } = ambiente({ rispostaAI: { tema: '', livello: 'A1', translations: {} } });
  await ctx.aiClassificaERTraducici('gatto', ['ge', 'cr', 'fr']);
  assert.doesNotMatch(promptsUsati[0], /ge \(Genovese\)|cr \(Carrarino\)/);
  assert.match(promptsUsati[0], /fr \(Francese\)/);
});
