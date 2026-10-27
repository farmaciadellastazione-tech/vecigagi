// Ripasso frasi, secondo rilascio (Dino, 2026-10-27): modalità "🎙️ Ripeti a
// voce". Si sente la frase e la si ripete al microfono; vale se una delle
// interpretazioni del riconoscimento coincide (stesse regole del dettato).
// Non nei dialetti (il riconoscimento non li capisce) né senza riconoscimento.
// Senza il parametro conVoce il piano resta quello di prima.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8').replace(/\r\n/g, '\n');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({ localStorage: { getItem: () => null, setItem: () => {} }, DIALETTI_TTS_ITA: ['mn', 'sp', 'ge', 'cr'],
  LINGUE_SENZA_AUDIO: new Set(['ia', 'la', 'grc']) });
ctx.globalThis = ctx;
vm.runInContext(fs.readFileSync(ROOT + '/vocab.js', 'utf8'), ctx);
vm.runInContext(tra('const NUMERI_PAROLE = {', '\nfunction convertiNumeri(') + '\n' + tra('function convertiNumeri(', '\n}') + '\n}\nglobalThis.convertiNumeri = convertiNumeri;', ctx);
vm.runInContext([
  tra('// ── Archivio frasi da ripassare', '\n// ── Aiuto Frase libera'),
  'Object.assign(globalThis, { pianoRipasso, esitoVoceRipasso });',
].join('\n'), ctx);
const j = x => JSON.parse(JSON.stringify(x));
const rndDa = seq => { let i = 0; return () => seq[i++ % seq.length]; };
const LINGUE = [
  { codice: 'it', nome: 'Italiano', attiva: true },
  { codice: 'en', nome: 'Inglese', attiva: true },
  { codice: 'sp', nome: 'Spezzino', attiva: true },
];
const en = { testo: 'I go to the sea.', cod: 'en' };
const sp = { testo: 'A vago a cà.', cod: 'sp' };

test('piano: con la voce, a volte "voce" (circa un terzo)', () => {
  const [p] = j(ctx.pianoRipasso([en], LINGUE, true, rndDa([0.1]), true));
  assert.equal(p.modo, 'voce');
  assert.equal(p.a, null);
  const piani = Array.from({ length: 90 }, () => j(ctx.pianoRipasso([en], LINGUE, true, Math.random, true))[0].modo);
  for (const m of ['voce', 'dettato', 'traduzione']) assert.ok(piani.includes(m), m);
});

test('piano: niente voce nei dialetti, senza riconoscimento, né di default', () => {
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso([sp], LINGUE, true, Math.random, true))[0]).every(p => p.modo !== 'voce'));
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso([en], LINGUE, true, Math.random, false))[0]).every(p => p.modo !== 'voce'));
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso([en], LINGUE, true, Math.random))[0]).every(p => p.modo !== 'voce'));
});

// Code review: latino, greco antico, interlingua non hanno né voce né riconoscimento
test('piano: niente voce per le lingue senza audio', () => {
  const la = { testo: 'Rosa rosae.', cod: 'la' };
  const lingue = [...LINGUE, { codice: 'la', nome: 'Latino', attiva: true }];
  assert.ok(Array.from({ length: 30 }, () => j(ctx.pianoRipasso([la], lingue, false, Math.random, true))[0]).every(p => p.modo === 'dettato'));
});

test('piano: senza IA ma con la voce, dettato o voce', () => {
  const modi = Array.from({ length: 60 }, () => j(ctx.pianoRipasso([en], LINGUE, false, Math.random, true))[0].modo);
  assert.ok(modi.includes('voce') && modi.includes('dettato'));
  assert.ok(!modi.includes('traduzione'));
});

test('esito a voce: basta una delle interpretazioni, con le regole del dettato', () => {
  const item = { testo: 'I have 3 cats.', cod: 'en' };
  assert.equal(ctx.esitoVoceRipasso(item, ['I have tree cats', 'I have three cats'], 'en-US'), 'I have three cats');
  assert.equal(ctx.esitoVoceRipasso(item, ['I have 3 cats'], 'en-US'), 'I have 3 cats');
  assert.equal(ctx.esitoVoceRipasso(item, ['I had cats', ''], 'en-US'), null);
  assert.equal(ctx.esitoVoceRipasso(item, [], 'en-US'), null);
  assert.equal(ctx.esitoVoceRipasso(item, undefined, 'en-US'), null);
});

test('la schermata: voce se c\'è il riconoscimento, microfono, controllo come il dettato', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /pianoRipasso\(scegliFrasiRipasso\(frasi, stats, N_FRASI_RIPASSO, Math\.random\), lingue, conIA, Math\.random, !!SR\)/);
  assert.match(S, /🎙️ Ripeti a voce/);
  // scritta a mano o detta: si controlla come il dettato, e si rilegge la frase
  assert.match(S, /if \(item\.modo !== "traduzione"\) return chiudi\(confrontaRipasso\(testoDettatoRipasso\(item\.testo\)/);
  assert.match(S, /const testoDaLeggere = item\.modo !== "traduzione" \? item\.testo/);
  assert.match(S, /if \(fase === "domanda" && item\?\.modo !== "traduzione"\) parla\(/);
});

// Code review (2026-10-27): microfono = InputVocale del quiz, uno per frase (si
// smonta cambiando frase o rispondendo: niente risultati in ritardo contati due
// volte); se ha capito male il testo va nella casella, senza giudizio.
test('voce: InputVocale uno per frase, niente giudizio se ha capito male', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.doesNotMatch(S, /useSpeechRecognition\(/);
  assert.match(S, /voce && fase === "domanda" && \/\*#__PURE__\*\/React\.createElement\("div", \{\s*onClickCapture: zittisci,[^}]*\}, \/\*#__PURE__\*\/React\.createElement\(InputVocale, \{\s*key: i,/);
  assert.match(S, /onVerifica: rispostaVoce,\s*onNonRiconosciuto: t => setRisposta\(t\)/);
  // InputVocale mette in parole i numeri detti: anche la frase attesa ("3" = "three")
  assert.match(S, /atteso: convertiNumeri\(testoDettatoRipasso\(item\.testo\), da\.bcp47\),/);
  assert.match(S, /function rispostaVoce\(t\) \{\s*if \(fase !== "domanda"\) return;\s*setRisposta\(t\);\s*if \(esitoVoceRipasso\(item, \[t\], lingua\(item\.cod\)\.bcp47\)\) chiudi\(true, testoDettatoRipasso\(item\.testo\), "", ""\);\s*\}/);
});

test('voce: premendo il microfono la lettura si ferma; niente tastiera da sola', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /function zittisci\(\) \{[\s\S]{0,200}clearTimeout\(_parlaTimer\)[\s\S]{0,200}speechSynthesis\.cancel\(\)/);
  assert.match(S, /if \(fase === "domanda" && item\?\.modo !== "voce"\) rispostaRef\.current\?\.focus\(\);/);
});

test('senza IA: la riga promette la voce solo se c\'è il riconoscimento', () => {
  const S = tra('function SchermataRipassoFrasi(', '\n// ── Aiuto Frase libera');
  assert.match(S, /"🔑 Senza IA solo dettato", SR \? " e voce" : "", ": con una chiave IA/);
});
