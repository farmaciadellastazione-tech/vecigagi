// Rimuove dai CANDIDATI di dialetti.html i duplicati di index.html sfuggiti al
// confronto perché la chiave italiana è "sporca" (punto finale, glossa con virgole)
// — tipico delle voci importate dal dizionario manarolese (es. "giocare." vs "giocare").
//
// Politica CONSERVATIVA ("solo duplicati esatti"):
//   Un candidato viene scartato SOLO se:
//     a) il suo lemma italiano normalizzato combacia con una voce di index, E
//     b) non offre nulla di nuovo: per ogni dialetto (mn/sp/cr/ge) in cui ha un
//        valore, una voce di index con lo stesso lemma ha GIÀ lo stesso valore.
//   Se aggiunge o cambia anche un solo dialetto (arricchimento/conflitto) → si tiene.
//   Voci con flag `nt` (non-traducibile) → si tengono sempre.
//
// Normalizzazione lemma: lowercase, trim, via il punto finale, primo lemma prima
// della virgola, spazi compattati. Le alternative index con `|` sono espanse.
//
// Lancia: node tools/dedupe_mn_candidati.js [--apply]

const fs = require('fs');
const APPLY = process.argv.includes('--apply');
const SRC_DIALETTI = 'dialetti.html';
const SRC_INDEX = 'index.html';
const DIAL_COLS = ['mn', 'sp', 'cr', 'ge'];

function findArrayBlock(srcText, marker) {
  const re = new RegExp('^\\s*const\\s+' + marker + '\\s*=\\s*\\[', 'm');
  const m = re.exec(srcText);
  if (!m) throw new Error(marker + ' non trovato');
  const startBody = m.index + m[0].length;
  let depth = 1, i = startBody, inStr = false, esc = false, q = null;
  while (i < srcText.length) {
    const c = srcText[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
    i++;
  }
  return { startBody, endBody: i };
}
function parseArrayBody(srcText, marker) {
  const { startBody, endBody } = findArrayBlock(srcText, marker);
  return eval('([' + srcText.slice(startBody, endBody) + '])');
}

function normIt(s) {
  return (s || '').toString().toLowerCase().trim()
    .replace(/\.+$/, '')        // punto/i finale
    .split(',')[0].trim()       // primo lemma prima della virgola
    .replace(/\s+/g, ' ');
}

const dialFile = fs.readFileSync(SRC_DIALETTI, 'utf8');
const indexFile = fs.readFileSync(SRC_INDEX, 'utf8');
const candVoc = parseArrayBody(dialFile, 'CANDIDATI');
const indexVoc = parseArrayBody(indexFile, 'VOCABOLARIO_DEFAULT');
console.log(`CANDIDATI: ${candVoc.length} · VOCABOLARIO_DEFAULT: ${indexVoc.length}`);

// Lemma index normalizzato → lista di voci index (espande alternative con `|`).
const indexByLemma = new Map();
for (const v of indexVoc) {
  const it = (v.it || '').toString();
  for (const alt of it.split('|')) {
    const k = normIt(alt);
    if (!k) continue;
    if (!indexByLemma.has(k)) indexByLemma.set(k, []);
    indexByLemma.get(k).push(v);
  }
}

const norm = s => (s || '').toString().trim().toLowerCase();

const removable = [];
const keep = [];
for (const c of candVoc) {
  if (Array.isArray(c.nt) && c.nt.length) { keep.push(c); continue; }
  const matches = indexByLemma.get(normIt(c.it)) || [];
  if (!matches.length) { keep.push(c); continue; }
  // Per ogni dialetto valorizzato nel candidato, qualche voce index combaciante
  // deve avere LO STESSO valore. Se ne aggiunge/cambia uno → utile, si tiene.
  let offreQualcosa = false;
  for (const col of DIAL_COLS) {
    const cv = norm(c[col]);
    if (!cv) continue;
    const coperto = matches.some(m => norm(m[col]) === cv);
    if (!coperto) { offreQualcosa = true; break; }
  }
  if (offreQualcosa) keep.push(c);
  else removable.push(c);
}

console.log(`\nDuplicati rimovibili (lemma in index + nessun dialetto nuovo): ${removable.length}`);
removable.slice(0, 30).forEach(c => {
  const dial = DIAL_COLS.filter(col => c[col]).map(col => `${col}:${c[col]}`).join(' ');
  console.log(`  - "${c.it}"  →  index "${normIt(c.it)}"   [${dial}]`);
});
if (removable.length > 30) console.log(`  …e altri ${removable.length - 30}`);

if (!APPLY) {
  console.log('\nDry-run. Riesegui con --apply per scrivere dialetti.html.');
  process.exit(0);
}

// Serializzazione coerente con import_dict_mn.js
const ADMIN_KEY_ORDER_DIAL = ['tema','livello','it','en','fr','es','de','pt','ru','ca','sp','mn','cr','ge','ko','ar','zh','ja','ia','la','grc','pron','fonte','ok'];
function serializza(v) {
  const parts = [];
  ADMIN_KEY_ORDER_DIAL.forEach(k => {
    if (v[k] !== undefined && v[k] !== null && v[k] !== '' && v[k] !== false) parts.push(`${k}:${JSON.stringify(v[k])}`);
  });
  Object.keys(v).forEach(k => {
    if (!ADMIN_KEY_ORDER_DIAL.includes(k) && !k.startsWith('_') && v[k] !== undefined && v[k] !== '' && v[k] !== false) {
      parts.push(`${k}:${JSON.stringify(v[k])}`);
    }
  });
  return '{ ' + parts.join(', ') + ' }';
}

const block = findArrayBlock(dialFile, 'CANDIDATI');
const lines = keep.map(v => '      ' + serializza(v) + ',');
const nuovoSrc = dialFile.slice(0, block.startBody)
  + '\n      // ── CANDIDATI ──────────────────\n'
  + lines.join('\n')
  + '\n    '
  + dialFile.slice(block.endBody);
fs.writeFileSync(SRC_DIALETTI, nuovoSrc);
console.log(`\nScritto ${SRC_DIALETTI}: ${keep.length} voci tenute, ${removable.length} rimosse.`);
