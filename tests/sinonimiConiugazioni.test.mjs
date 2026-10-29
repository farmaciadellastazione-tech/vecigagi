// Richiesta di Dino (2026-10-29): "nelle coniugazioni non c'è la facoltà di
// accettare sinonimi". Prima "🤖 Era giusta?" le escludeva ("conta la forma
// esatta"); ora vale anche lì. Le carte di coniugazione hanno lDA/lA (oggetti
// lingua) invece di da/a: voceSinonimo e EraGiusta devono leggerle. All'IA
// vanno verbo, tempo e persona: il sinonimo deve avere la stessa persona e lo
// stesso tempo ("estás" al posto di "estoy" resta un errore).
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
let memoria = {};
const ctx = vm.createContext({
  localStorage: {
    getItem: k => (k in memoria ? memoria[k] : null),
    setItem: (k, v) => { memoria[k] = String(v); },
    removeItem: k => { delete memoria[k]; },
  },
  MAX_CAR_INVIO: 300,
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext([
  tra('const tagliaInvio = ', '\n') + '\n' + tra('function rigaContributi(', '\n}') + '\n}',
  tra('// ── Sinonimi accettati', '\n// ── Archivio frasi da ripassare'),
  'Object.assign(globalThis, { voceSinonimo, cartaConLingue, descriviConiugazione, salvaSinonimo, sinonimiAccettati, eraGiustaDisponibile, promptSinonimo });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));

// Come la costruisce generaEserciziConiugazioni
const CARTA = {
  key: 'coniug__stare__presente__1ª sing.__fr__es',
  tipo: 'coniugazione',
  atteso: 'me quedo|estoy',
  lDA: { codice: 'fr' },
  lA: { codice: 'es' },
  verbKey: 'stare',
  tempoKey: 'presente',
  persona: '1ª sing.',
  entry: { fr: 'reste', es: 'me quedo|estoy' },
};

test('carta di coniugazione: pulsante disponibile in Quiz, Allenamento, Risposta vocale', () => {
  for (const m of ['quiz', 'allenamento', 'voce']) assert.equal(ctx.eraGiustaDisponibile(CARTA, m, 'permanezco'), true, m);
  assert.equal(ctx.eraGiustaDisponibile(CARTA, 'sceltamultipla', 'permanezco'), false);
});

test('voceSinonimo legge lDA/lA delle coniugazioni', () => {
  assert.deepEqual(j(ctx.voceSinonimo(CARTA)), { da: 'fr', parola: 'reste', a: 'es', atteso: 'me quedo|estoy' });
  // le carte del vocabolario restano come prima
  assert.deepEqual(j(ctx.voceSinonimo({ da: 'it', a: 'en', entry: { it: 'bello', en: 'beautiful' } })), { da: 'it', parola: 'bello', a: 'en', atteso: 'beautiful' });
});

test('sinonimo di una coniugazione: si salva e la volta dopo vale', () => {
  memoria = {};
  assert.equal(ctx.salvaSinonimo(ctx.voceSinonimo(CARTA), 'permanezco'), true);
  assert.deepEqual(j(ctx.sinonimiAccettati(ctx.voceSinonimo(CARTA))), ['permanezco']);
  // un'altra persona dello stesso verbo non lo eredita
  const tu = { ...CARTA, persona: '2ª sing.', atteso: 'te quedas|estás', entry: { fr: 'restes', es: 'te quedas|estás' } };
  assert.deepEqual(j(ctx.sinonimiAccettati(ctx.voceSinonimo(tu))), []);
});

test('verificaRisposta aggiunge i sinonimi anche alle coniugazioni, anche col pronome tolto', () => {
  const V = tra('function verificaRisposta(', '\n  function salta(');
  assert.match(V, /if \(carta\.tipo !== "dettato" && MODALITA_ERA_GIUSTA\.includes\(modoCarta\)\) \{/);
  assert.match(V, /ok = isCorretta\(attesoConSinonimi, senzaPronome,/);
});

test('all\'IA: verbo, tempo e persona, con la regola della stessa persona e tempo', () => {
  const p = ctx.promptSinonimo({ parola: 'reste', nomeDa: 'Francese', nomeA: 'Spagnolo', atteso: 'me quedo|estoy', risposta: 'permanezco',
    coniugazione: { verbo: 'stare', tempo: 'presente', persona: '1ª sing.' } });
  assert.match(p.user, /Verbo coniugato: "stare", tempo presente, 1ª sing\./);
  assert.match(p.system, /stessa persona/);
  assert.match(p.system, /stesso tempo/);
  // senza coniugazione il prompt resta quello del vocabolario
  const v = ctx.promptSinonimo({ parola: 'bello', nomeDa: 'Italiano', nomeA: 'Inglese', atteso: 'beautiful', risposta: 'pretty' });
  assert.doesNotMatch(v.user, /Verbo coniugato/);
  assert.doesNotMatch(v.system, /stessa persona/);
});

test('cartaConLingue: da/a dalle lingue della coniugazione, le altre carte invariate', () => {
  const c = ctx.cartaConLingue(CARTA);
  assert.equal(c.da, 'fr');
  assert.equal(c.a, 'es');
  assert.equal(c.key, CARTA.key);
  const voc = { da: 'it', a: 'en', entry: { it: 'bello', en: 'beautiful' } };
  assert.equal(ctx.cartaConLingue(voc), voc);
  assert.equal(ctx.cartaConLingue(null), null);
});

test('EraGiusta lavora sulla carta con da/a e passa la coniugazione all\'IA', () => {
  const C = tra('function EraGiusta(', '\nfunction SpiegaAI(');
  assert.match(C, /carta: cartaProp,/);
  assert.match(C, /const carta = cartaConLingue\(cartaProp\);/);
  assert.match(C, /const coniug = descriviConiugazione\(carta\);/);
  assert.match(C, /coniugazione: coniug\s*\}\);/);
  // coniugazione fra due lingue straniere: l'italiano per il foglio da forme
  assert.match(C, /const italiano = soloVisibile\(carta\.entry\?\.it \|\| carta\.forme\?\.it \|\| ""\);/);
  // al foglio Contributi con verbo, tempo e persona (code review)
  assert.match(C, /const parolaFoglio = coniug \? `\$\{italiano\} \(\$\{coniug\.verbo\}, \$\{coniug\.tempo\}, \$\{coniug\.persona\}\)` : italiano;/);
  assert.equal((C.match(/italiano: parolaFoglio,/g) || []).length, 2, 'accettato e segnalato');
  assert.doesNotMatch(C, /parametriSinonimo\(\{\s*nomeLingua: lA\.nome,\s*italiano,/);
});

// Code review (2026-10-29): all'IA e al foglio i nomi leggibili, non le chiavi
// interne (congiuntivoImperfetto), e la persona senza "(io/I/je...)".
test('descriviConiugazione: nomi del verbo e del tempo da CONIUGAZIONI', () => {
  ctx.CONIUGAZIONI = { essere: { nome: 'essere', tempi: { congiuntivoImperfetto: { nome: 'Congiuntivo imperfetto' } } } };
  const d = ctx.descriviConiugazione({ tipo: 'coniugazione', verbKey: 'essere', tempoKey: 'congiuntivoImperfetto', persona: '1ª sing. (io/I/je)' });
  assert.deepEqual(j(d), { verbo: 'essere', tempo: 'congiuntivo imperfetto', persona: '1ª sing.' });
  // senza nome: la chiave
  assert.equal(ctx.descriviConiugazione({ tipo: 'coniugazione', verbKey: 'x', tempoKey: 'futuro', persona: '2ª plur.' }).tempo, 'futuro');
  assert.equal(ctx.descriviConiugazione({ da: 'it', a: 'en' }), null);
  assert.equal(ctx.descriviConiugazione(null), null);
});
