#!/usr/bin/env node
// Migrazione VOCABOLARIO_DEFAULT (formato attuale, embedded in index.html)
// -> nuovo schema "a piani separati" con provenienza esplicita.
//
//   node tools/migrate_to_provenance.mjs [index.html] [out.json]
//
// NON modifica index.html. Scrive solo il JSON di destinazione e un report.
// Conservativo: preserva sempre la stringa originale della fonte in prov.src.ref.

import fs from 'node:fs';

const SRC_HTML = process.argv[2] || 'index.html';
const OUT_JSON = process.argv[3] || 'vocabolario.json';

// nt = array dei dialetti "intraducibili" per la voce (filtro 🚫), NON una lingua
const META_KEYS = new Set(['tema', 'livello', 'tipo', 'src', 'verif', 'note', 'nt']);
const DIALETTI = new Set(['mn', 'sp', 'ge', 'cr']);          // pron/grafia con "/"
const LINGUE_NOTE = new Set(['it','en','fr','es','de','pt','mn','sp','ge','cr',
  'la','grc','ia','ru','ca','ar','zh','ja','ko','nl','pl','ro']);
const VERIF_MAP = { g: 'verde', y: 'giallo', r: 'rosso' };

const warn = { slashNonDialetto: 0, verifDefault: 0, senzaIt: 0, chiaviIgnote: new Set(), undefinedKeys: 0 };

// ── 1. Estrai il blocco array rispettando stringhe e commenti ──────────────
function estraiArray(html) {
  const m = /const\s+VOCABOLARIO_DEFAULT\s*=\s*\[/.exec(html);
  if (!m) throw new Error('Blocco VOCABOLARIO_DEFAULT non trovato');
  const open = html.indexOf('[', m.index);
  let depth = 0, inStr = null, esc = false, i = open;
  for (; i < html.length; i++) {
    const ch = html[i], nx = html[i + 1];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (ch === '\\') esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '/' && nx === '/') { i = html.indexOf('\n', i); if (i < 0) break; continue; }
    if (ch === '/' && nx === '*') { i = html.indexOf('*/', i) + 1; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) { i++; break; } }
  }
  const txt = html.slice(open, i);
  return new Function('return ' + txt)();   // dati puri: nessuno scope esterno
}

// ── 2. Helpers ─────────────────────────────────────────────────────────────
function slug(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}
function parseVerif(str) {
  const out = {};
  for (const tok of String(str).split(',')) {
    const [lang, st] = tok.split(':').map(x => x && x.trim());
    if (lang && VERIF_MAP[st]) out[lang] = VERIF_MAP[st];
  }
  return out;
}
function parseSrc(raw) {
  const s = String(raw);
  let kind = 'web';
  if (/🤖|\bIA\b/.test(s)) kind = 'ia';
  else if (/🔗|dialetti\.html/.test(s)) kind = 'derivato';
  else if (/📘|📖|diziona/i.test(s)) kind = 'dizionario';
  else if (/🗣|parlant/i.test(s)) kind = 'parlante';
  return { kind, ref: s };
}

// ── 3. Trasforma una voce ───────────────────────────────────────────────────
function migraVoce(v, idx) {
  const tr = {}, phon = {}, prov = {};
  const langs = Object.keys(v).filter(k => !META_KEYS.has(k));

  for (const lang of langs) {
    if (lang === 'undefined') { warn.undefinedKeys++; continue; }
    if (!LINGUE_NOTE.has(lang)) warn.chiaviIgnote.add(lang);
    const val = v[lang];
    if (val == null || val === '') continue;

    if (DIALETTI.has(lang)) {
      // "/" = pronuncia(TTS) / grafia(mostrata). Senza "/": valore = grafia.
      const slash = String(val).indexOf('/');
      if (slash >= 0) {
        phon[lang] = String(val).slice(0, slash).trim();   // ciò che legge il TTS
        tr[lang] = String(val).slice(slash + 1).trim();    // grafia tradizionale
      } else {
        tr[lang] = String(val).trim();
      }
    } else {
      // non-dialetto: "|" e "/" separano sinonimi/risposte accettate. [0] = canonica mostrata.
      const parts = String(val).split(/[|/]/).map(x => x.trim()).filter(Boolean);
      if (String(val).includes('/')) warn.slashNonDialetto++;
      tr[lang] = parts.length > 1 ? parts : parts[0];
    }
  }

  // provenienza: unione delle lingue citate in verif/src/note
  const verif = v.verif ? parseVerif(v.verif) : {};
  const src = v.src && typeof v.src === 'object' ? v.src : {};
  const note = v.note && typeof v.note === 'object' ? v.note : {};
  const provLangs = new Set([...Object.keys(verif), ...Object.keys(src), ...Object.keys(note)]);
  for (const lang of provLangs) {
    const p = {};
    if (verif[lang]) p.verif = verif[lang];
    else { p.verif = 'giallo'; warn.verifDefault++; }   // status mancante -> da controllare
    if (src[lang]) p.src = parseSrc(src[lang]);
    if (note[lang]) p.note = String(note[lang]);
    prov[lang] = p;
  }

  const ancora = v.it || tr.it || tr[langs[0]] || 'voce';
  const out = {
    id: `${slug(v.tema)}-${slug(Array.isArray(ancora) ? ancora[0] : ancora)}-${String(idx).padStart(4, '0')}`,
    tema: v.tema, livello: v.livello,
  };
  if (v.tipo) out.tipo = v.tipo;
  if (Array.isArray(v.nt) && v.nt.length) out.intraducibile = v.nt;  // dialetti senza traduzione (🚫)
  out.tr = tr;
  if (Object.keys(phon).length) out.phon = phon;
  if (Object.keys(prov).length) out.prov = prov;
  if (!v.it) warn.senzaIt++;
  return out;
}

// ── 4. Run ───────────────────────────────────────────────────────────────────
const html = fs.readFileSync(SRC_HTML, 'utf8');
const voci = estraiArray(html);
const migrate = voci.map(migraVoce);

// id univoci
const seen = new Map();
for (const v of migrate) {
  const n = (seen.get(v.id) || 0) + 1; seen.set(v.id, n);
  if (n > 1) v.id += `-${n}`;
}

fs.writeFileSync(OUT_JSON, JSON.stringify(migrate, null, 2), 'utf8');

const conProv = migrate.filter(v => v.prov).length;
const conPhon = migrate.filter(v => v.phon).length;
console.log('── MIGRAZIONE COMPLETATA ──');
console.log('voci totali        :', migrate.length);
console.log('voci con provenienza:', conProv);
console.log('voci con phon (TTS):', conPhon);
console.log('output             :', OUT_JSON);
console.log('\n── WARNING (da rivedere a mano) ──');
console.log('verif default "giallo" applicato a', warn.verifDefault, 'celle (avevano src/note ma niente stato)');
console.log('sinonimi non-dialetto con "/" splittati:', warn.slashNonDialetto, '(controllare che non siano testo legittimo)');
console.log('voci senza campo it:', warn.senzaIt);
console.log('chiavi lingua ignote:', [...warn.chiaviIgnote].join(', ') || '(nessuna)');
console.log('chiavi "undefined" scartate:', warn.undefinedKeys);
