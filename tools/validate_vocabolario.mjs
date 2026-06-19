#!/usr/bin/env node
// Validatore di VOCABOLARIO_DEFAULT sul FORMATO ATTUALE (embedded in index.html).
// Non modifica nulla. Esce con codice 1 se ci sono ERRORI (per la CI).
//
//   node tools/validate_vocabolario.mjs [index.html]
//
// ERRORI (bloccanti): livello/tema mancanti o invalidi, chiave "undefined",
//   valore non-stringa, verif malformato, e COLONNE DISALLINEATE (testo in un
//   alfabeto incompatibile con la lingua della colonna — la classe di bug
//   delle 115 voci bonificate).
// WARNING (non bloccanti): orfani verif/src/note, chiavi lingua ignote,
//   celle vuote, pattern IA sospetti (mn = it/ge con fonte IA non verificata).

import fs from 'node:fs';

const VERBOSE = process.argv.includes('--verbose');
const SRC_HTML = process.argv.find(a => a.endsWith('.html')) || 'index.html';

const META = new Set(['tema', 'livello', 'tipo', 'src', 'verif', 'note', 'nt']);
const DIALETTI = new Set(['mn', 'sp', 'ge', 'cr']);
const LIVELLI = new Set(['A1', 'A2', 'B1', 'B2']);
const VERIF_ST = new Set(['g', 'y', 'r']);
const LINGUE = new Set(['it','en','fr','es','de','pt','mn','sp','ge','cr',
  'la','grc','ia','ru','ca','ar','zh','ja','ko','nl','pl','ro']);

// Alfabeti per rilevare colonne disallineate
const SCRIPT = {
  cyr: /[Ѐ-ӿ]/, arab: /[؀-ۿ]/, hebr: /[֐-׿]/,
  grek: /[Ͱ-Ͽἀ-῿]/, han: /[一-鿿]/,
  hang: /[가-힯ᄀ-ᇿ]/, kana: /[぀-ヿ]/,
};
// per ogni lingua: alfabeti VIETATI (presenza = disallineamento)
const ALL = Object.keys(SCRIPT);
const VIETATI = {};
for (const l of LINGUE) VIETATI[l] = new Set(ALL);             // default: tutti vietati...
const consenti = (l, ...ok) => ok.forEach(s => VIETATI[l].delete(s));
// Lingue a base latina: vietato qualunque altro alfabeto
for (const l of ['it','en','fr','es','de','pt','mn','sp','ge','cr','la','ia','ca','nl','pl','ro'])
  consenti(l, /* nessun alfabeto non-latino ammesso */);
consenti('grc', 'grek');
consenti('ru', 'cyr');
consenti('ar', 'arab');
consenti('zh', 'han');
consenti('ja', 'han', 'kana');
consenti('ko', 'hang', 'han');

function alfabetoEstraneo(val, lang) {
  const vietati = VIETATI[lang];
  if (!vietati) return null;
  for (const s of vietati) if (SCRIPT[s].test(val)) return s;
  return null;
}

// ── Estrazione array (rispetta stringhe e commenti) ─────────────────────────
function estraiArray(html) {
  const m = /const\s+VOCABOLARIO_DEFAULT\s*=\s*\[/.exec(html);
  if (!m) throw new Error('Blocco VOCABOLARIO_DEFAULT non trovato');
  const open = html.indexOf('[', m.index);
  let depth = 0, inStr = null, esc = false, i = open;
  for (; i < html.length; i++) {
    const ch = html[i], nx = html[i + 1];
    if (esc) { esc = false; continue; }
    if (inStr) { if (ch === '\\') esc = true; else if (ch === inStr) inStr = null; continue; }
    if (ch === '/' && nx === '/') { i = html.indexOf('\n', i); if (i < 0) break; continue; }
    if (ch === '/' && nx === '*') { i = html.indexOf('*/', i) + 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++; else if (ch === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  return new Function('return ' + html.slice(open, i))();
}

// ── Validazione ──────────────────────────────────────────────────────────────
const errors = [], warns = [];
const html = fs.readFileSync(SRC_HTML, 'utf8');
const voci = estraiArray(html);

const visti = new Map();
voci.forEach((v, idx) => {
  const et = v && v.it ? `"${v.it}"` : `#${idx}`;
  const E = msg => errors.push(`[${idx}] ${et}: ${msg}`);
  const W = msg => warns.push(`[${idx}] ${et}: ${msg}`);

  if (!v || typeof v !== 'object') { E('voce non è un oggetto'); return; }
  if (!v.tema) W('manca "tema" (l\'app non applica filtri/bilanciamento tema)');
  if (v.livello === undefined) W('manca "livello" (l\'app usa A1 di default)');
  else if (!LIVELLI.has(v.livello)) E(`livello invalido: ${JSON.stringify(v.livello)}`);

  const langKeys = Object.keys(v).filter(k => !META.has(k));
  for (const k of langKeys) {
    if (k === 'undefined') { E('chiave "undefined" presente'); continue; }
    if (!LINGUE.has(k)) W(`chiave lingua ignota: "${k}"`);
    const val = v[k];
    if (typeof val !== 'string') { E(`valore non-stringa per "${k}": ${JSON.stringify(val)}`); continue; }
    if (val.trim() === '') { W(`cella vuota per "${k}"`); continue; }
    // disallineamento colonne
    const part = DIALETTI.has(k) ? val.split('/')[0] : val;   // dialetti: guarda la pronuncia
    const estraneo = alfabetoEstraneo(part, k);
    if (estraneo) E(`colonna disallineata? "${k}" contiene alfabeto ${estraneo}: ${JSON.stringify(val.slice(0, 30))}`);
  }

  // nt = array di dialetti intraducibili
  if (v.nt !== undefined) {
    if (!Array.isArray(v.nt)) E(`"nt" deve essere un array: ${JSON.stringify(v.nt)}`);
    else for (const d of v.nt) {
      if (!DIALETTI.has(d)) W(`"nt" referenzia non-dialetto "${d}"`);
      if (v[d] !== undefined) W(`"${d}" è in nt (intraducibile) ma ha anche un valore`);
    }
  }

  // verif: "lang:st,lang:st"
  if (v.verif !== undefined) {
    if (typeof v.verif !== 'string') E(`"verif" non-stringa: ${JSON.stringify(v.verif)}`);
    else for (const tok of v.verif.split(',')) {
      const [lang, st] = tok.split(':');
      if (!lang || !VERIF_ST.has(st)) { E(`verif malformato: "${tok}"`); continue; }
      if (v[lang] === undefined && !(Array.isArray(v.nt) && v.nt.includes(lang)))
        W(`verif orfano: "${lang}" non ha valore nella voce`);
    }
  }

  // src: { lang: "..." }
  if (v.src !== undefined) {
    if (typeof v.src !== 'object' || Array.isArray(v.src)) E(`"src" deve essere un oggetto`);
    else for (const lang of Object.keys(v.src)) {
      if (v[lang] === undefined) W(`src orfano: "${lang}" non ha valore`);
      // pattern IA sospetto: cella IA non verificata verde
      const isIA = /🤖|\bIA\b/.test(String(v.src[lang]));
      const verde = (v.verif || '').split(',').some(t => t === `${lang}:g`);
      if (isIA && !verde) W(`fonte IA non verificata (verde) per "${lang}"`);
      // mn copia di it/ge (firma voci inventate)
      if (lang === 'mn' && isIA && (v.mn === v.it || v.mn === v.ge))
        W(`"mn" identico a ${v.mn === v.it ? 'it' : 'ge'} con fonte IA`);
    }
  }

  if (v.note !== undefined && (typeof v.note !== 'object' || Array.isArray(v.note)))
    E(`"note" deve essere un oggetto`);

  // duplicati (tema|it)
  if (v.it) {
    const key = `${v.tema}|${v.it}`;
    if (visti.has(key)) W(`duplicato di [${visti.get(key)}] (stesso tema+it)`);
    else visti.set(key, idx);
  }
});

// ── Report ────────────────────────────────────────────────────────────────────
console.log(`Voci analizzate: ${voci.length}`);
console.log(`ERRORI: ${errors.length}   WARNING: ${warns.length}\n`);
if (errors.length) {
  console.log('── ERRORI (bloccano la CI) ──');
  errors.slice(0, 60).forEach(e => console.log('  ✖ ' + e));
  if (errors.length > 60) console.log(`  … e altri ${errors.length - 60}`);
  console.log('');
}
if (warns.length) {
  console.log('── WARNING (da rivedere, non bloccanti) ──');
  const byType = {};
  warns.forEach(w => {
    const t = w.replace(/^\[\d+\][^:]*:\s*/, '').replace(/"[^"]*"/g, '"…"');  // collassa i dettagli fra virgolette
    byType[t] = (byType[t] || 0) + 1;
  });
  Object.entries(byType).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ⚠ ${String(n).padStart(3)}×  ${t}`));
  if (VERBOSE) { console.log('\n── dettaglio warning ──'); warns.forEach(w => console.log('  ⚠ ' + w)); }
  else console.log('\n  (dettaglio voce-per-voce: aggiungi --verbose)');
}
process.exit(errors.length ? 1 : 0);
