// Backfill v.src.mn = "🤖 IA" + v.verif "mn:r" per le voci elencate in un CSV
// di analisi (classe = "AI_mn=genovese" o "AI_mn=italiano"): manarolese che il
// modello ha ricopiato dal genovese o dall'italiano perche' non conosceva il
// dialetto. Vedi memoria feedback_voci_ai_inventate.md.
//
// Schema v.src / v.verif: vedi project_tag_cella_dialettale.md.
//
// CSV atteso: header con almeno le colonne "italiano" e "classe".
// Match per `it:"<italiano>"` (riga_index nel CSV puo' essere shiftato e va
// ignorato). Sovrascrive eventuali tag preesistenti su mn (l'attribuzione IA
// e' piu' specifica del precedente "🔗 dialetti.html" o simile).
//
// Lancia da repo root:
//   node tools/backfill_ai_mn.js <path-csv>           # dry-run
//   node tools/backfill_ai_mn.js <path-csv> --apply   # scrive index.html

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const CSV_PATH = args.find(a => !a.startsWith('--'));
if (!CSV_PATH) { console.error('Uso: node tools/backfill_ai_mn.js <csv> [--apply]'); process.exit(1); }
const INDEX_PATH = 'index.html';

// 1. CSV parser robusto (gestisce campi quotati con virgole interne e "" escape)
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inStr = false;
      } else field += c;
    } else {
      if (c === '"') inStr = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') {} // ignora CR
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const csvText = fs.readFileSync(CSV_PATH, 'utf8');
const csvRows = parseCsv(csvText).filter(r => r.length > 1);
const header = csvRows[0].map(h => h.trim());
const colIt = header.indexOf('italiano');
const colClass = header.indexOf('classe');
const colMn = header.indexOf('manarolese');
const colGe = header.indexOf('genovese');
if (colIt < 0 || colClass < 0) {
  console.error('CSV deve avere colonne "italiano" e "classe". Trovate:', header);
  process.exit(1);
}
const aiRows = csvRows.slice(1).filter(r => /^AI_mn=/i.test((r[colClass] || '').trim()));
console.log(`CSV: ${csvRows.length - 1} righe totali, ${aiRows.length} marcate AI_mn=*.`);

// 2. Parsa il blocco VOCABOLARIO_DEFAULT di index.html in righe-voce
const src = fs.readFileSync(INDEX_PATH, 'utf8');
const startRe = /^\s*const VOCABOLARIO_DEFAULT = \[/m;
const m = startRe.exec(src);
if (!m) { console.error('VOCABOLARIO_DEFAULT non trovato in index.html'); process.exit(1); }
const startIdx = m.index + m[0].length;
let depth = 1, i = startIdx, inStr = false, esc = false, q = null;
while (i < src.length) {
  const c = src[i];
  if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
  else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
  i++;
}
const blockStartLine = src.slice(0, startIdx).split('\n').length;
const bodyLines = src.slice(startIdx, i).split('\n');
const LINES = src.split('\n');

// Mappa it -> array di { lineNum, raw } (puo' essere duplicato)
const byIt = new Map();
for (let li = 0; li < bodyLines.length; li++) {
  const ln = bodyLines[li];
  const trim = ln.trim();
  if (!trim.startsWith('{')) continue;
  const itMatch = trim.match(/\bit\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!itMatch) continue;
  const itVal = itMatch[1].trim();
  const absLine = blockStartLine + li;
  if (!byIt.has(itVal)) byIt.set(itVal, []);
  byIt.get(itVal).push({ lineNum: absLine, raw: trim });
}

// 3. Per ogni riga AI del CSV, trova la voce e applica tag
const stats = { matched: 0, notFound: 0, noMn: 0, alreadyTagged: 0, applied: 0, ambiguous: 0 };
const notFound = [];
const updates = []; // { lineNum, newSrc, newVerifCsv }

for (const r of aiRows) {
  const itVal = (r[colIt] || '').trim();
  if (!itVal) continue;
  const candidates = byIt.get(itVal);
  if (!candidates || !candidates.length) { stats.notFound++; notFound.push(itVal); continue; }
  // Filtra ai soli candidati che hanno una cella mn non vuota
  const cands = candidates.filter(c => /\bmn\s*:\s*"[^"]+"/.test(c.raw));
  if (!cands.length) { stats.noMn++; continue; }
  if (cands.length > 1) stats.ambiguous++;
  // Applica a TUTTI i candidati con mn presente (raramente >1)
  for (const cand of cands) {
    stats.matched++;
    // Parsa src esistente (oggetto) e verif (csv)
    const srcMatch = cand.raw.match(/\bsrc\s*:\s*(\{[^}]*\})/);
    let srcObj = {};
    if (srcMatch) { try { srcObj = eval('(' + srcMatch[1] + ')'); } catch (_) { srcObj = {}; } }
    const verifMatch = cand.raw.match(/\bverif\s*:\s*"([^"]*)"/);
    const verifMap = new Map();
    if (verifMatch) {
      verifMatch[1].split(',').map(s => s.trim()).filter(Boolean).forEach(tok => {
        const j = tok.indexOf(':'); if (j > 0) verifMap.set(tok.slice(0, j), tok.slice(j + 1));
      });
    }
    // Sovrascrive sempre mn (l'attribuzione IA e' piu' specifica)
    const wasIA = srcObj.mn === '🤖 IA' && verifMap.get('mn') === 'r';
    if (wasIA) { stats.alreadyTagged++; continue; }
    srcObj.mn = '🤖 IA';
    verifMap.set('mn', 'r');
    const newSrc = srcObj;
    const newVerifCsv = verifMap.size ? [...verifMap.entries()].map(([k, v]) => `${k}:${v}`).join(',') : '';
    updates.push({ lineNum: cand.lineNum, newSrc, newVerifCsv });
    stats.applied++;
  }
}

console.log('\n=== STATISTICHE ===');
console.log(`Righe AI nel CSV: ${aiRows.length}`);
console.log(`Voci trovate in index.html: ${stats.matched}`);
console.log(`  - di cui gia' taggate IA (skip): ${stats.alreadyTagged}`);
console.log(`  - di cui ambigue (>1 voce stesso IT): ${stats.ambiguous}`);
console.log(`Voci non trovate (IT non presente): ${stats.notFound}`);
console.log(`Voci trovate ma senza cella mn (skip): ${stats.noMn}`);
console.log(`Modifiche da scrivere: ${stats.applied}`);

if (notFound.length) {
  console.log(`\nPrime 10 non trovate: ${notFound.slice(0, 10).map(x => `"${x}"`).join(', ')}${notFound.length > 10 ? ` ...e altre ${notFound.length - 10}` : ''}`);
}

if (!APPLY) {
  console.log('\nDry-run. Riesegui con --apply per scrivere index.html.');
  process.exit(0);
}

// 4. Applica: per ogni updates, riscrivi la riga rimpiazzando src/verif
console.log('\nScrivo modifiche...');
let written = 0;
for (const u of updates) {
  const lineIdx0 = u.lineNum - 1;
  let line = LINES[lineIdx0];
  // Rimuovi src e verif esistenti
  line = line.replace(/,\s*src\s*:\s*\{[^}]*\}/g, '');
  line = line.replace(/,\s*verif\s*:\s*"[^"]*"/g, '');
  // Inserisci prima della parentesi chiusa finale
  const closeIdx = line.lastIndexOf('}');
  if (closeIdx < 0) continue;
  const before = line.slice(0, closeIdx).replace(/\s*$/, '');
  const after  = line.slice(closeIdx);
  const newParts = [];
  if (Object.keys(u.newSrc).length) newParts.push('src:' + JSON.stringify(u.newSrc));
  if (u.newVerifCsv) newParts.push('verif:' + JSON.stringify(u.newVerifCsv));
  LINES[lineIdx0] = before + (newParts.length ? ', ' + newParts.join(', ') + ' ' : ' ') + after;
  written++;
}

fs.writeFileSync(INDEX_PATH, LINES.join('\n'));
console.log(`Scritte ${written} righe in ${INDEX_PATH}.`);
