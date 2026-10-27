// "🤖 Era giusta?" (richiesta di Dino, 2026-10-27), passo 3: pulsante sulla
// schermata d'errore di Quiz, Allenamento e Risposta vocale. Se l'IA accetta
// il sinonimo: carta giusta, punto e statistica SM-2 ripristinati, fuori dalle
// sbagliate, sinonimo salvato e inviato a Dino. Nei dialetti (mn/sp/ge/cr)
// niente giudizio dell'IA: "📨 Segnala sinonimo" lo manda a Dino e basta.
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
const ctx = vm.createContext({ localStorage: { getItem: () => null, setItem: () => {} }, MAX_CAR_INVIO: 300 });
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('// ── Sinonimi accettati', '\n// ── Archivio frasi da ripassare'),
  'Object.assign(globalThis, { eraGiustaDisponibile, parametriSinonimo });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const CARTA = { key: 'k', da: 'it', a: 'en', entry: { it: 'bello', en: 'beautiful' } };

test('disponibile solo in Quiz, Allenamento e Risposta vocale, sulle traduzioni', () => {
  for (const m of ['quiz', 'allenamento', 'voce']) assert.equal(ctx.eraGiustaDisponibile(CARTA, m, 'pretty'), true, m);
  for (const m of ['nonstop', 'dettato', 'ascolto', 'pronuncia', 'sceltamultipla']) assert.equal(ctx.eraGiustaDisponibile(CARTA, m, 'pretty'), false, m);
  assert.equal(ctx.eraGiustaDisponibile({ ...CARTA, tipo: 'coniugazione' }, 'quiz', 'pretty'), false);
  assert.equal(ctx.eraGiustaDisponibile({ ...CARTA, tipo: 'dettato' }, 'allenamento', 'pretty'), false);
  assert.equal(ctx.eraGiustaDisponibile(CARTA, 'quiz', '—'), false); // "Non lo so"
  assert.equal(ctx.eraGiustaDisponibile(CARTA, 'quiz', 'una frase lunghissima che non è certo un sinonimo di niente'), false);
  assert.equal(ctx.eraGiustaDisponibile(null, 'quiz', 'pretty'), false);
});

test('riga per il foglio Contributi: accettato dall\'IA o segnalato', () => {
  assert.deepEqual(j(ctx.parametriSinonimo({ nomeLingua: 'Inglese', italiano: 'bello', atteso: 'beautiful', sinonimo: 'pretty', accettato: true })), {
    parola: 'bello', dialetto: 'Inglese', traduzione: 'pretty', localita: '', note: 'Sinonimo accettato IA — previsto: «beautiful»', nickname: '',
  });
  const s = ctx.parametriSinonimo({ nomeLingua: 'Spezzino', italiano: 'casa', atteso: 'ca/cà', sinonimo: 'cà', accettato: false });
  assert.equal(s.note, 'Sinonimo segnalato — previsto: «ca/cà»');
  assert.equal(s.dialetto, 'Spezzino');
  assert.equal(ctx.parametriSinonimo({ nomeLingua: 'x', italiano: 'a'.repeat(500), atteso: 'b', sinonimo: 'c', accettato: true }).parola.length, 300);
});

const APP = tra('function verificaRisposta(', '\n  function avanti(');
test('verificaRisposta si ricorda com\'era prima dell\'errore', () => {
  assert.match(APP, /erroreRef\.current = ok \? null : \{\s*key: carta\.key,\s*prima: stats\[carta\.key\],\s*contata: \(cardErrori\[carta\.key\] \|\| 0\) < 2,\s*nuovaErrata: !carteErrate\.some\(e => e\.carta\.key === carta\.key\),\s*risposta,\s*conAiutino: !!aiutino\s*\};/);
  // prima di aggiornare la statistica con l'errore
  assert.ok(APP.indexOf('erroreRef.current = ok ? null') < APP.indexOf('const ns = aggiornaStatsCoppia(stats, carta.key, ok && !aiutino)'));
});

test('accettaComeGiusta ripristina statistica, punteggio e sbagliate', () => {
  const A = tra('function accettaComeGiusta(', '\n  }\n') ;
  assert.match(A, /statoRef\.current !== "sbagliato"/);
  assert.match(A, /if \(e\.prima === undefined\) delete base\[e\.key\];\s*else base\[e\.key\] = e\.prima;\s*return aggiornaStatsCoppia\(base, e\.key, !e\.conAiutino\);/);
  assert.match(A, /giusti: p\.giusti \+ 1,\s*sbagliati: p\.sbagliati - \(e\.contata \? 1 : 0\)/);
  assert.match(A, /if \(e\.nuovaErrata\) setCarteErrate\(p => p\.filter\(x => x\.carta\.key !== e\.key\)\);/);
  assert.match(A, /setStato\("corretto"\);/);
});

test('la schermata d\'errore mostra il pulsante e App lo collega', () => {
  assert.match(HTML, /React\.createElement\(EraGiusta, \{\s*carta: carta,\s*risposta: input,\s*modalita: modalita,\s*lingue: lingue,\s*aiSettings: aiSettings,\s*onAccettata: onAccettaGiusta\s*\}\)/);
  assert.match(HTML, /onAccettaGiusta: accettaComeGiusta,/);
});

test('EraGiusta: dialetti solo segnalazione, altrimenti giudizio dell\'IA', () => {
  const C = tra('function EraGiusta(', '\nfunction SpiegaAI(');
  assert.match(C, /const dialetto = DIALETTI_TTS_ITA\.includes\(lA\.codice\);/);
  assert.match(C, /📨 Segnala sinonimo/);
  assert.match(C, /🤖 Era giusta\?/);
  // accetta solo con true esplicito, salva, invia e poi avvisa App
  assert.match(C, /if \(g\.accettabile === true\) \{\s*salvaSinonimo\(voceSinonimo\(carta\), risposta\);\s*inviaAlFoglio\(parametriSinonimo\(\{[^}]*accettato: true[^}]*\}\)\);\s*onAccettata\(\{/);
  // la segnalazione dei dialetti non passa dall'IA
  const segnala = C.slice(C.indexOf('async function segnala('), C.indexOf('}', C.indexOf('setStato(ok ? "inviato"')));
  assert.doesNotMatch(segnala, /callAI/);
  assert.match(segnala, /accettato: false/);
});

// Code review (2026-10-27): un "sì" dell'IA arrivato dopo "Ho capito" poteva
// rendere giusta una risposta successiva alla stessa carta, mai giudicata.
test('risposta dell\'IA in ritardo: ignorata', () => {
  const C = tra('function EraGiusta(', '\nfunction SpiegaAI(');
  // uscendo dalla schermata d'errore la richiesta in corso non vale più
  assert.match(C, /useEffect\(\(\) => \(\) => \{\s*richiesta\.current\+\+;\s*\}, \[\]\);/);
  // App riceve carta e risposta giudicate
  assert.match(C, /onAccettata\(\{\s*key: carta\.key,\s*risposta\s*\}\);/);
  const V = tra('function verificaRisposta(', '\n  function salta(');
  assert.match(V, /risposta,\s*\n\s*conAiutino: !!aiutino/);
  const A = tra('function accettaComeGiusta(', '\n  }\n');
  assert.match(A, /function accettaComeGiusta\(giudicata\)/);
  assert.match(A, /giudicata\?\.key !== e\.key \|\| giudicata\?\.risposta !== e\.risposta/);
});
