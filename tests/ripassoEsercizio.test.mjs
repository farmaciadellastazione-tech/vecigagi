// Ripasso frasi, passo 4 (2026-10-26): l'esercizio. 10 frasi a sessione dalle
// raccolte del passo 3, ognuna con dettato o traduzione scelti a caso.
//  - Dettato: confronto locale (senza punteggiatura/maiuscole, CON accenti).
//  - Traduzione: verso un'altra lingua attiva, MAI verso un dialetto; i
//    riferimenti arrivano con una sola chiamata IA a inizio sessione e restano
//    salvati; se la risposta non coincide giudica l'IA.
//  - Senza IA: solo dettato. Statistiche per frase a parte (niente SM-2):
//    le sbagliate tornano più spesso.
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
  DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
  SK_CONVERSAZIONI: 'qml_v1_conversazioni',
});
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
// numeri in parole, come nel resto dell'app (convertiNumeri)
vm.runInContext(tra('const NUMERI_PAROLE = {', '\nfunction convertiNumeri(') + '\n' + tra('function convertiNumeri(', '\n}') + '\n}\nglobalThis.convertiNumeri = convertiNumeri;', ctx);
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  `Object.assign(globalThis, { confrontaRipasso, caricaStatsRipasso, registraEsitoRipasso, potaStatsRipasso, archiviRipassoLeggibili, salvaTradRipasso,
     pesoRipasso, scegliFrasiRipasso, testoDettatoRipasso, pianoRipasso, promptTraduzioniRipasso, estraiTraduzioniRipasso,
     promptGiudizioRipasso, estraiGiudizioRipasso, N_FRASI_RIPASSO });`,
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const azzera = () => { memoria = {}; };
// generatore ripetibile per i test
const rndDa = seq => { let i = 0; return () => seq[i++ % seq.length]; };

const LINGUE = [
  { codice: 'it', nome: 'Italiano', attiva: true },
  { codice: 'en', nome: 'Inglese', attiva: true },
  { codice: 'fr', nome: 'Francese', attiva: true },
  { codice: 'de', nome: 'Tedesco', attiva: false },
  { codice: 'sp', nome: 'Spezzino', attiva: true },
];

// Terza code review (2026-10-27), scelta di Dino: il confronto usa normalizza()
// come il resto dell'app, quindi accenti latini, apostrofi e trattini non contano
// (prima qui gli accenti contavano: regola cambiata, test aggiornato).
test('confronto: punteggiatura, maiuscole, spazi, accenti e apostrofi non contano', () => {
  assert.equal(ctx.confrontaRipasso('Je vais à la mer.', 'je vais  à la mer'), true);
  assert.equal(ctx.confrontaRipasso('¿Dónde está?', 'dónde está'), true);
  assert.equal(ctx.confrontaRipasso("L'acqua è fresca!", 'l’acqua è fresca'), true);
  assert.equal(ctx.confrontaRipasso('Je vais à la mer.', 'je vais a la mer'), true);
  assert.equal(ctx.confrontaRipasso('Il a été peut-être là', 'il a ete peutetre la'), true); // anche attaccato, come isCorretta
  assert.equal(ctx.confrontaRipasso('Il a été peut-être là', 'il a ete peut etre la'), true);
  assert.equal(ctx.confrontaRipasso('Je vais à la mer.', 'je vais a la plage'), false);
  assert.equal(ctx.confrontaRipasso('Hello', ''), false);
});

test('statistiche: giuste/sbagliate per frase, riferimenti salvati', () => {
  azzera();
  ctx.registraEsitoRipasso('en|i go home.', true);
  ctx.registraEsitoRipasso('en|i go home.', false);
  ctx.registraEsitoRipasso('en|i go home.', false);
  ctx.salvaTradRipasso('en|i go home.', 'it', 'Vado a casa.');
  const s = j(ctx.caricaStatsRipasso())['en|i go home.'];
  assert.equal(s.g, 1);
  assert.equal(s.s, 2);
  assert.ok(s.ultima);
  assert.equal(s.trad.it, 'Vado a casa.');
  memoria.qml_v1_ripasso_stats = 'rotto';
  assert.deepEqual(j(ctx.caricaStatsRipasso()), {});
});

test('peso: le sbagliate valgono di più, le giuste di meno', () => {
  const nuova = ctx.pesoRipasso(undefined);
  assert.ok(ctx.pesoRipasso({ g: 0, s: 2 }) > nuova);
  assert.ok(ctx.pesoRipasso({ g: 3, s: 0 }) < nuova);
  assert.ok(ctx.pesoRipasso({ g: 50, s: 0 }) > 0);
});

test('scelta: N frasi senza ripetizioni (o tutte se sono meno)', () => {
  const frasi = Array.from({ length: 30 }, (_, i) => ({ chiave: 'en|' + i, testo: 'F' + i, cod: 'en' }));
  const scelte = j(ctx.scegliFrasiRipasso(frasi, {}, ctx.N_FRASI_RIPASSO, Math.random));
  assert.equal(scelte.length, 10);
  assert.equal(new Set(scelte.map(f => f.chiave)).size, 10);
  assert.equal(ctx.scegliFrasiRipasso(frasi.slice(0, 4), {}, 10, Math.random).length, 4);
});

test('scelta: una frase sbagliata spesso esce molto più spesso di una imparata', () => {
  const frasi = [{ chiave: 'a', testo: 'A', cod: 'en' }, { chiave: 'b', testo: 'B', cod: 'en' }];
  const stats = { a: { g: 0, s: 4 }, b: { g: 6, s: 0 } };
  let a = 0;
  for (let i = 0; i < 2000; i++) if (ctx.scegliFrasiRipasso(frasi, stats, 1, Math.random)[0].chiave === 'a') a++;
  assert.ok(a > 1600, 'a uscita ' + a + ' volte su 2000');
});

test('piano: traduzione solo verso lingue attive non dialettali e diverse dalla frase', () => {
  const frasi = [{ chiave: 'k', testo: 'I go home.', cod: 'en' }];
  for (const r of [0, 0.3, 0.6, 0.99]) {
    const [p] = j(ctx.pianoRipasso(frasi, LINGUE, true, rndDa([0.9, r])));
    if (p.modo === 'traduzione') {
      assert.ok(['it', 'fr'].includes(p.a), 'arrivo ' + p.a);
      assert.equal(p.nomeDa, 'Inglese');
      assert.ok(p.nomeA);
    }
  }
});

test('piano: mai traduzione verso un dialetto; dal dialetto sì', () => {
  const frasi = [{ chiave: 'k', testo: 'A vago a ca.', cod: 'sp' }];
  const piani = Array.from({ length: 50 }, () => j(ctx.pianoRipasso(frasi, LINGUE, true, Math.random))[0]);
  assert.ok(piani.every(p => p.modo === 'dettato' || ['it', 'en', 'fr'].includes(p.a)));
  assert.ok(piani.some(p => p.modo === 'traduzione'));
  assert.ok(piani.some(p => p.modo === 'dettato'));
});

test('piano: senza IA solo dettato; senza lingua d\'arrivo solo dettato', () => {
  const frasi = [{ chiave: 'k', testo: 'I go home.', cod: 'en' }];
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso(frasi, LINGUE, false, Math.random))[0]).every(p => p.modo === 'dettato'));
  const sole = [{ codice: 'en', nome: 'Inglese', attiva: true }, { codice: 'sp', nome: 'Spezzino', attiva: true }];
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso(frasi, sole, true, Math.random))[0]).every(p => p.modo === 'dettato'));
});

// Quarta code review (2026-10-27): le traduzioni si abbinano alle frasi per
// TESTO (l'IA ripete l'originale in "originale"), non per numero: una
// numerazione sbagliata non sposta più le traduzioni sulla frase accanto.
const ITEMS2 = [
  { testo: 'I go home.', nomeDa: 'Inglese', nomeA: 'Francese' },
  { testo: 'A vago a ca.', nomeDa: 'Spezzino', nomeA: 'Italiano' },
];
test('prompt traduzioni: una sola richiesta, l\'IA ripete l\'originale', () => {
  const p = ctx.promptTraduzioniRipasso(ITEMS2);
  assert.match(p.user, /I go home\./);
  assert.match(p.user, /A vago a ca\./);
  assert.match(p.user, /Francese/);
  assert.match(p.system, /"traduzioni"/);
  assert.match(p.system, /"originale"/);
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso('```json {"traduzioni":[{"id":0,"originale":"I go home.","testo":"Je rentre."},{"id":1,"originale":"A vago a ca.","testo":"Vado a casa."}]} ```', ITEMS2)),
    { 0: 'Je rentre.', 1: 'Vado a casa.' });
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso('niente json', ITEMS2)), {});
});

test('giudizio IA: prompt con originale, riferimento e risposta; esito letto in modo robusto', () => {
  const p = ctx.promptGiudizioRipasso({ testo: 'I go home.', nomeDa: 'Inglese', nomeA: 'Francese' }, 'Je vais maison', 'Je rentre à la maison.');
  assert.match(p.user, /I go home\./);
  assert.match(p.user, /Je vais maison/);
  assert.match(p.user, /Je rentre à la maison\./);
  assert.match(p.system, /"correct"/);
  assert.deepEqual(j(ctx.estraiGiudizioRipasso('{"correct":false,"correction":"Je vais à la maison.","note":"Manca à la."}')),
    { correct: false, correction: 'Je vais à la maison.', note: 'Manca à la.' });
  assert.equal(ctx.estraiGiudizioRipasso('{"correct":true}').correct, true);
  assert.equal(ctx.estraiGiudizioRipasso('boh').correct, null);
});

// Code review 2026-10-27 (prima l'id come testo "0" faceva sparire tutto) e
// quarta: con l'abbinamento per testo la numerazione non conta più.
test('traduzioni: numerazione da 1, scambiata, saltata o come testo: abbinate giuste', () => {
  const tre = [{ testo: 'Uno.' }, { testo: 'Due.' }, { testo: 'Tre.' }];
  const voce = (id, o, t) => ({ id, originale: o, testo: t });
  const r = arr => j(ctx.estraiTraduzioniRipasso(JSON.stringify({ traduzioni: arr }), tre));
  assert.deepEqual(r([voce(1, 'Uno.', 'One'), voce(2, 'Due.', 'Two'), voce(3, 'Tre.', 'Three')]), { 0: 'One', 1: 'Two', 2: 'Three' });
  assert.deepEqual(r([voce(0, 'Due.', 'Two'), voce(1, 'Uno.', 'One')]), { 0: 'One', 1: 'Two' });
  // la seconda saltata e le altre numerate di seguito: la terza resta sulla terza
  assert.deepEqual(r([voce(0, 'Uno.', 'One'), voce(1, 'Tre.', 'Three')]), { 0: 'One', 2: 'Three' });
  assert.deepEqual(r([voce('0', 'uno', 'One')]), { 0: 'One' }); // originale con maiuscole/punteggiatura diverse
});

test('traduzioni: originale assente o che non corrisponde a nessuna frase = scartata', () => {
  const r = arr => j(ctx.estraiTraduzioniRipasso(JSON.stringify({ traduzioni: arr }), ITEMS2));
  assert.deepEqual(r([{ id: 0, testo: 'Je rentre.' }]), {});
  assert.deepEqual(r([{ id: 0, originale: 'I went home.', testo: 'Je suis rentré.' }]), {});
});

test('traduzioni: stessa frase in due lingue di partenza, decide il numero', () => {
  const doppie = [{ testo: 'Hola.', nomeDa: 'Spagnolo', nomeA: 'Inglese' }, { testo: 'Hola.', nomeDa: 'Catalano', nomeA: 'Francese' }];
  const raw = JSON.stringify({ traduzioni: [{ id: 1, originale: 'Hola.', testo: 'Salut.' }, { id: 0, originale: 'Hola.', testo: 'Hello.' }] });
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso(raw, doppie)), { 0: 'Hello.', 1: 'Salut.' });
});

// Code review 2026-10-27: la voce (parla) salta le parentesi e si ferma al
// primo "/", quindi il dettato va confrontato con ciò che si sente davvero.
test('dettato: si confronta con il testo che la voce legge', () => {
  assert.equal(ctx.testoDettatoRipasso('Vengo lunedì/martedì.'), 'Vengo lunedì');
  assert.equal(ctx.testoDettatoRipasso('Ho un cane (bassotto) nero.'), 'Ho un cane  nero.');
  assert.equal(ctx.confrontaRipasso(ctx.testoDettatoRipasso('Ho un cane (bassotto) nero.'), 'ho un cane nero'), true);
});

// Code review 2026-10-27: nei dialetti la voce italiana non fa sentire gli
// accenti della grafia ("ca"/"cà"): nel dettato non si pretendono.
test('dettato nei dialetti: accenti facoltativi (ora anche altrove, vedi sopra)', () => {
  assert.equal(ctx.confrontaRipasso('A vago a cà.', 'a vago a ca', true), true);
  assert.equal(ctx.confrontaRipasso('A vago a ca.', 'à vàgo a cà', true), true);
  assert.equal(ctx.confrontaRipasso('A vago a cà.', 'a vago a ca'), true);
  assert.equal(ctx.confrontaRipasso('A vago a cà.', 'a vago a ca casa', true), false);
});

test('la schermata usa testo letto e accenti facoltativi per i dialetti nel dettato', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  // (terza code review: dopo c'è anche la lingua, per i numeri)
  assert.match(S, /confrontaRipasso\(testoDettatoRipasso\(item\.testo\), r, DIALETTI_TTS_ITA\.includes\(item\.cod\)[,)]/);
});

// Code review 2026-10-27: le frasi che l'IA non è riuscita a controllare "non
// contano", quindi non vanno nemmeno nel totale (9 giuste su 9 = 🏆, non 9/10).
test('punteggio finale sulle sole frasi controllate', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /const \[controllate, setControllate\] = useState\(0\)/);
  assert.match(S, /if \(giusta !== null\) \{\s*registraEsitoRipasso\(item\.chiave, giusta\);\s*setControllate\(c => c \+ 1\);/);
  assert.match(S, /punti, " \/ ", controllate/);
  assert.match(S, /controllate > 0 && punti === controllate \? "\uD83C\uDFC6"/);
  assert.doesNotMatch(S, /punti, " \/ ", items\.length/);
});

// Code review 2026-10-27: le statistiche (con le traduzioni salvate) non
// devono crescere per sempre con frasi uscite dall'archivio o da conversazioni
// cancellate. Si potano sulle frasi esistenti in TUTTE le lingue (non solo le
// attive: spegnere una lingua non deve cancellarne i progressi).
test('statistiche: restano solo quelle delle frasi ancora esistenti', () => {
  azzera();
  ctx.registraEsitoRipasso('en|vecchia.', true);
  ctx.registraEsitoRipasso('en|ancora qui.', false);
  ctx.registraEsitoRipasso('sp|lingua spenta.', true);
  ctx.potaStatsRipasso(['en|ancora qui.', 'sp|lingua spenta.']);
  assert.deepEqual(Object.keys(j(ctx.caricaStatsRipasso())).sort(), ['en|ancora qui.', 'sp|lingua spenta.']);
});

test('statistiche: niente da potare = niente da riscrivere', () => {
  azzera();
  ctx.registraEsitoRipasso('en|a.', true);
  const prima = memoria.qml_v1_ripasso_stats;
  let scritture = 0;
  const vero = ctx.localStorage.setItem;
  ctx.localStorage.setItem = (k, v) => { scritture++; vero(k, v); };
  ctx.potaStatsRipasso(['en|a.']);
  ctx.localStorage.setItem = vero;
  assert.equal(scritture, 0);
  assert.equal(memoria.qml_v1_ripasso_stats, prima);
});

test('la schermata pota su tutte le lingue e filtra le attive dopo', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /const tutte = frasiDaRipassare\(caricaFrasiRipasso\(\), caricaConversazioni\(\)\);\s*potaStatsRipasso\(tutte\.map\(f => f\.chiave\)\);/);
  assert.match(S, /const frasi = tutte\.filter\(f => attive\.includes\(f\.cod\)\);/);
});

// Code review 2026-10-27: dal dialetto l'IA traduce male; un riferimento
// sbagliato salvato resterebbe per sempre. Dal dialetto si richiede ogni volta.
test('traduzione dal dialetto: il riferimento non si salva né si riusa', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /rif: x\.modo === "traduzione" && !DIALETTI_TTS_ITA\.includes\(x\.cod\) \? stats\[x\.chiave\]\?\.trad\?\.\[x\.a\] \|\| "" : ""/);
  assert.match(S, /if \(!DIALETTI_TTS_ITA\.includes\(x\.cod\)\) salvaTradRipasso\(x\.chiave, x\.a, trad\[k\]\);/);
});

// Seconda code review (2026-10-27): se un archivio non si legge (JSON rovinato,
// localStorage che dà errore) le raccolte risultano vuote e la potatura
// cancellerebbe tutte le statistiche. Si pota solo se entrambi si leggono.
test('archivi leggibili: assenti o validi sì, rovinati o in errore no', () => {
  azzera();
  assert.equal(ctx.archiviRipassoLeggibili(), true);
  memoria.qml_v1_frasi_ripasso = '[]';
  memoria.qml_v1_conversazioni = '[{"id":"a","turni":[]}]';
  assert.equal(ctx.archiviRipassoLeggibili(), true);
  memoria.qml_v1_conversazioni = '{rotto';
  assert.equal(ctx.archiviRipassoLeggibili(), false);
  memoria.qml_v1_conversazioni = '{"non":"lista"}';
  assert.equal(ctx.archiviRipassoLeggibili(), false);
  memoria.qml_v1_conversazioni = '[]';
  const vero = ctx.localStorage.getItem;
  ctx.localStorage.getItem = () => { throw new Error('bloccato'); };
  assert.equal(ctx.archiviRipassoLeggibili(), false);
  ctx.localStorage.getItem = vero;
});

test('con un archivio rovinato la potatura non cancella nulla', () => {
  azzera();
  ctx.registraEsitoRipasso('en|a.', true);
  ctx.registraEsitoRipasso('en|b.', false);
  memoria.qml_v1_frasi_ripasso = '{rotto';
  ctx.potaStatsRipasso([]); // le raccolte risultano vuote per l'errore di lettura
  assert.deepEqual(Object.keys(j(ctx.caricaStatsRipasso())).sort(), ['en|a.', 'en|b.']);
});

// Seconda code review (2026-10-27): uscendo dal ripasso la frase letta
// continuava sopra la Home. Chiudendo la schermata si ferma la voce, anche
// quella ancora in coda in parla() (_parlaTimer).
test('chiudendo la schermata la voce si ferma', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  const pulizia = S.slice(S.indexOf('return () => {'), S.indexOf('}, []);', S.indexOf('return () => {')));
  assert.match(pulizia, /richiesta\.current\+\+/);
  assert.match(pulizia, /clearTimeout\(_parlaTimer\)/);
  assert.match(pulizia, /window\.speechSynthesis\.cancel\(\)/);
});

// Seconda code review (2026-10-27), scelta di Dino: nel dettato dei dialetti
// la voce italiana non fa sentire nemmeno apostrofi e spazi ("gh'è" = "ghè",
// "a l'è" = "a lè" = "alè"): non si pretendono. Le lettere sì.
test('dettato nei dialetti: apostrofi e spazi facoltativi, lettere no', () => {
  assert.equal(ctx.confrontaRipasso("Gh'è o sô.", 'ghe o so', true), true);
  assert.equal(ctx.confrontaRipasso("A l'è bela.", 'a lè bela', true), true);
  assert.equal(ctx.confrontaRipasso("A l'è bela.", 'alè bela', true), true);
  assert.equal(ctx.confrontaRipasso("A l'è bela.", 'a le bella', true), false);
  // fuori dai dialetti: apostrofi non contano (normalizza), gli spazi sì
  assert.equal(ctx.confrontaRipasso("L'acqua è fresca", 'lacqua è fresca'), true);
  assert.equal(ctx.confrontaRipasso('Good morning', 'goodmorning'), false);
});

// Seconda code review (2026-10-27): un solo JSON per tutta la sessione; se
// arriva troncato o rovinato si perdevano tutte le traduzioni. Ora si
// recuperano le voci COMPLETE (chiuse da virgolette e graffa), mai quelle monche.
const QUATTRO = [{ testo: 'Je rentre.' }, { testo: 'Il dit oui.' }, { testo: 'Vado.' }, { testo: 'Vado a casa.' }];
test('traduzioni da JSON troncato: le voci complete sì, quella tagliata no', () => {
  const raw = '{"traduzioni":[{"id":0,"originale":"Je rentre.","testo":"I go home."},{"id":"1","originale":"Il dit oui.","testo":"He says \\"yes\\"."},{"testo":"I go.","originale":"Vado.","id":2},{"id":3,"originale":"Vado a casa.","testo":"I go ho';
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso(raw, QUATTRO)), { 0: 'I go home.', 1: 'He says "yes".', 2: 'I go.' });
});

test('traduzioni da JSON rovinato a metà (non troncato)', () => {
  const raw = '{"traduzioni":[{"id":0,"originale":"Je rentre.","testo":"Uno."},{"id":1,"originale":"Il dit oui.","testo":"Due."} {"id":2,"originale":"Vado.","testo":"Tre."}]}';
  assert.deepEqual(j(ctx.estraiTraduzioniRipasso(raw, QUATTRO)), { 0: 'Uno.', 1: 'Due.', 2: 'Tre.' });
});

test('la schermata passa le frasi da abbinare', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /estraiTraduzioniRipasso\(await callAI\(p\.system, p\.user, aiSettings\), mancanti\)/);
});

// Terza code review (2026-10-27): la voce legge le cifre come parole ("Ho 3
// gatti" → "ho tre gatti"): cifre e parole valgono uguale, nella lingua della
// frase, come in isCorretta (convertiNumeri).
test('numeri: cifre e parole valgono uguale nella lingua della frase', () => {
  assert.equal(ctx.confrontaRipasso('Ho 3 gatti.', 'ho tre gatti', false, 'it-IT'), true);
  assert.equal(ctx.confrontaRipasso('Ho tre gatti.', 'ho 3 gatti', false, 'it-IT'), true);
  assert.equal(ctx.confrontaRipasso('I have 3 cats.', 'i have three cats', false, 'en-US'), true);
  assert.equal(ctx.confrontaRipasso('Ho 3 gatti.', 'ho quattro gatti', false, 'it-IT'), false);
  // senza lingua le cifre restano cifre
  assert.equal(ctx.confrontaRipasso('Ho 3 gatti.', 'ho tre gatti'), false);
});

test('la schermata passa la lingua al confronto (dettato e traduzione)', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /confrontaRipasso\(testoDettatoRipasso\(item\.testo\), r, DIALETTI_TTS_ITA\.includes\(item\.cod\), lingua\(item\.cod\)\.bcp47\)/);
  assert.match(S, /confrontaRipasso\(item\.rif, r, false, lingua\(item\.a\)\.bcp47\)/);
});

// Quarta code review (2026-10-27): il trattino vale come spazio o come niente
// in tutti e due i versi (riferimento attaccato, risposta col trattino e viceversa).
test('trattino simmetrico', () => {
  assert.equal(ctx.confrontaRipasso('peutetre', 'peut-être'), true);
  assert.equal(ctx.confrontaRipasso('peut-être', 'peutetre'), true);
  assert.equal(ctx.confrontaRipasso('peut-être', 'peut être'), true);
  assert.equal(ctx.confrontaRipasso('peut etre', 'peut-être'), true);
  assert.equal(ctx.confrontaRipasso('peutetre', 'peut etre'), false); // lo spazio vero conta (come isCorretta)
});
