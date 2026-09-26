// Limite giornaliero del provider IA in edit.html (bug 2026-09-26).
//
// Prima: finito il limite giornaliero di Groq gratuito (TPD/RPD), ogni 429
// chiedeva di riprovare tra minuti; conRetryAI tagliava l'attesa a 90 s e
// ritentava 3 volte, poi completaConAI passava alla voce dopo e ripeteva:
// ~4,5 minuti per voce, il batch sembrava bloccato per mezz'ora e più.
//
// Dopo: un 429 giornaliero (o con attesa oltre il tetto) non si ritenta,
// l'errore è marcato limiteGiornaliero e il batch si ferma subito.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

function estraiFunzione(nome) {
  let start = EDIT.indexOf('async function ' + nome + '(');
  if (start === -1) start = EDIT.indexOf('function ' + nome + '(');
  assert.ok(start >= 0, `funzione ${nome} non trovata in edit.html`);
  const chiusura = EDIT.indexOf('\n}', start);
  return EDIT.slice(start, chiusura + 2);
}

// setTimeout istantaneo che registra le attese richieste.
function ambiente(extra = {}) {
  const attese = [];
  const ctx = {
    setTimeout: (fn, ms) => { attese.push(ms); fn(); },
    aiConfig: { provider: 'groq', key: 'k' },
    ...extra,
  };
  vm.createContext(ctx);
  vm.runInContext(estraiFunzione('conRetryAI'), ctx);
  return { ctx, attese };
}

const MSG_TPD = 'Groq HTTP 429: {"error":{"message":"Rate limit reached for model `openai/gpt-oss-20b` in organization `org_x` service tier `on_demand` on tokens per day (TPD): Limit 200000, Used 199654, Requested 734. Please try again in 2m50.4s. Need more tokens?","type":"tokens","code":"rate_limit_exceeded"}}';
const MSG_TPM = 'Groq HTTP 429: {"error":{"message":"Rate limit reached for model `openai/gpt-oss-20b` in organization `org_x` service tier `on_demand` on tokens per minute (TPM): Limit 8000, Used 7800, Requested 734. Please try again in 7.5s.","code":"rate_limit_exceeded"}}';

test('429 giornaliero (TPD): nessun ritentativo, errore marcato', async () => {
  const { ctx, attese } = ambiente();
  let chiamate = 0;
  ctx.fn = async () => { chiamate++; throw new Error(MSG_TPD); };
  await assert.rejects(vm.runInContext('conRetryAI(fn)', ctx), e => e.limiteGiornaliero === true && /giornaliero/i.test(e.message));
  assert.strictEqual(chiamate, 1);
  assert.deepStrictEqual(attese, []);
});

test('429 con attesa oltre il tetto (anche senza "per day"): nessun ritentativo', async () => {
  const { ctx, attese } = ambiente();
  let chiamate = 0;
  ctx.fn = async () => { chiamate++; throw new Error('Groq HTTP 429: Please try again in 1h2m3s.'); };
  await assert.rejects(vm.runInContext('conRetryAI(fn)', ctx), e => e.limiteGiornaliero === true);
  assert.strictEqual(chiamate, 1);
  assert.deepStrictEqual(attese, []);
});

test('429 al minuto (TPM): attende e ritenta come prima', async () => {
  const { ctx, attese } = ambiente();
  let chiamate = 0;
  ctx.fn = async () => { if (++chiamate < 2) throw new Error(MSG_TPM); return 'ok'; };
  assert.strictEqual(await vm.runInContext('conRetryAI(fn)', ctx), 'ok');
  assert.strictEqual(chiamate, 2);
  assert.deepStrictEqual(attese, [8000]);
});

test('completaConAI: al limite giornaliero il batch si ferma alla prima voce', async () => {
  const voci = [{ it: 'uno' }, { it: 'due' }, { it: 'tre' }];
  const messaggi = [];
  const btn = { disabled: false, textContent: '✨' };
  let chiamate = 0;
  const { ctx } = ambiente({
    filtroVoci: () => voci,
    currentLangs: ['it', 'en'],
    DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
    confirm: () => true,
    alert: () => {},
    document: { getElementById: () => btn },
    setHelp: (m, t) => messaggi.push([m, t]),
    visiblePart: s => s,
    contestoVoce: () => ({}),
    temaIADaUsare: t => t,
    rowKey: v => v.it,
    newKeys: new Set(),
    modifiedKeys: new Set(),
    popolaTemiSelect: () => {},
    render: () => {},
    console: { error: () => {} },
    aiClassificaERTraducici: async () => { chiamate++; throw new Error(MSG_TPD); },
  });
  vm.runInContext(estraiFunzione('completaConAI'), ctx);
  await vm.runInContext('completaConAI()', ctx);
  assert.strictEqual(chiamate, 1, 'dopo il limite giornaliero non deve chiamare le voci successive');
  const ultimo = messaggi[messaggi.length - 1][0];
  assert.match(ultimo, /giornaliero/i);
  assert.strictEqual(btn.disabled, false);
});
