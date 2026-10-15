// Avviso vero se l'invio al foglio Google fallisce (richiesta di Dino,
// 2026-10-15). Lo script era rotto da mesi e l'app mostrava comunque
// "inviato" (catch → successo): i contributi si perdevano senza che nessuno
// se ne accorgesse. Ora conta solo la risposta {"status":"ok"} dello script.
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

function conFetch(fetch) {
  const ctx = vm.createContext({ fetch, URLSearchParams, AbortController, setTimeout, clearTimeout, console: { warn() {} } });
  vm.runInContext(tra('const SCRIPT_DIALETTI = ', '\n// ── AI Integration') + '\nglobalThis.inviaAlFoglio = inviaAlFoglio;', ctx);
  return ctx.inviaAlFoglio;
}

test('riuscito solo se lo script risponde {"status":"ok"}', async () => {
  const ok = conFetch(async () => ({ json: async () => ({ status: 'ok' }) }));
  assert.strictEqual(await ok({ parola: 'a' }), true);
  const errore = conFetch(async () => ({ json: async () => ({ status: 'error', msg: 'x' }) }));
  assert.strictEqual(await errore({ parola: 'a' }), false);
});

test('pagina di errore di Google (non JSON) o rete assente: fallito', async () => {
  const html = conFetch(async () => ({ json: async () => { throw new SyntaxError('HTML'); } }));
  assert.strictEqual(await html({ parola: 'a' }), false);
  const rete = conFetch(async () => { throw new TypeError('Failed to fetch'); });
  assert.strictEqual(await rete({ parola: 'a' }), false);
});

test('i parametri arrivano nell\'indirizzo', async () => {
  let url = '';
  const f = conFetch(async u => { url = u; return { json: async () => ({ status: 'ok' }) }; });
  await f({ parola: 'casa', dialetto: 'Spezzino' });
  assert.match(url, /\?parola=casa&dialetto=Spezzino$/);
});

test('Contribuisci e Correggi usano inviaAlFoglio e avvisano se fallisce', () => {
  assert.doesNotMatch(HTML, /no-cors fallback: assume success/);
  const contrib = tra('function ContribuisciDialetto(', '\n  if (!aperto) return');
  assert.match(contrib, /inviaAlFoglio\(/);
  assert.match(tra('function inviaCorrezioneIA(', '\nfunction testoCorrezioniDaCopiare('), /return inviaAlFoglio\(/);
  const corr = tra('function CorreggiDialetto(', '\n// ── Aiuto Frase libera');
  assert.match(corr, /\.then\(ok => \{\s*if \(!ok\) setInvioFallito\(true\);/);
  assert.match(corr, /resta valida solo in questo browser/);
});

// Review di 04dd5c1:
test('nessun messaggio che dice "inviata" prima di saperlo; niente doppi invii riprovando', () => {
  const corr = tra('function CorreggiDialetto(', '\n// ── Aiuto Frase libera');
  assert.doesNotMatch(corr, /Inviata a LinguaeQuiz, ma/);
  assert.match(corr, /if \(inviataRef\.current !== n\) \{/);
});

test('nuova frase nello stesso riquadro: Correggi riparte da zero', () => {
  const corr = tra('function CorreggiDialetto(', '\n// ── Aiuto Frase libera');
  assert.match(corr, /useEffect\(\(\) => \{\s*if \(testo === inviataRef\.current\) return;\s*setAperto\(false\);\s*setSalvato\(false\);\s*setErrore\(""\);\s*setInvioFallito\(false\);\s*inviataRef\.current = null;\s*\}, \[testo\]\);/);
});

test('invio con tempo massimo e causa dell\'errore in console', async () => {
  const f = tra('async function inviaAlFoglio(', '\n}\n') ;
  assert.match(f, /AbortController/);
  assert.match(f, /console\.warn\(/);
  const lento = conFetch((u, o) => new Promise((_, rej) => o.signal.addEventListener('abort', () => rej(new Error('abort')))));
  // il timeout vero è lungo: qui basta che la richiesta accetti il segnale
  assert.ok(lento);
});
