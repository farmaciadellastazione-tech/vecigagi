// Analisi del JSON estratto dal dizionario manarolese vs lo stato attuale.
// Confronta ogni voce { mn, it, cat, pag } con:
//   - VOCABOLARIO_DEFAULT in index.html (gia' pubblicate)
//   - CANDIDATI in dialetti.html      (in staging)
// e classifica: nuove / arricch (it presente ma mn vuoto) / conflitti / duplicati.
//
// Lancia: node tools/analyze_dict_mn.js <path-json>

const fs = require('fs');

const JSON_PATH = process.argv[2];
if (!JSON_PATH) { console.error('Uso: node tools/analyze_dict_mn.js <path-json>'); process.exit(1); }

const raw = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
console.log(`JSON: ${raw.length} voci.`);

function parseArray(srcText, marker) {
  const re = new RegExp('^\\s*const\\s+' + marker + '\\s*=\\s*\\[', 'm');
  const m = re.exec(srcText);
  if (!m) throw new Error(marker + ' non trovato');
  const start = m.index + m[0].length;
  let depth = 1, i = start, inStr = false, esc = false, q = null;
  while (i < srcText.length) {
    const c = srcText[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
    i++;
  }
  return eval('([' + srcText.slice(start, i) + '])');
}

const indexVoc  = parseArray(fs.readFileSync('index.html', 'utf8'),    'VOCABOLARIO_DEFAULT');
const candVoc   = parseArray(fs.readFileSync('dialetti.html', 'utf8'), 'CANDIDATI');
console.log(`index VOCABOLARIO_DEFAULT: ${indexVoc.length} voci.`);
console.log(`dialetti CANDIDATI: ${candVoc.length} voci.`);

const indexByIt = new Map(indexVoc.map(v => [(v.it || '').trim(), v]));
const candByIt  = new Map(candVoc.map(v => [(v.it || '').trim(), v]));

const stats = {
  total: raw.length,
  vuote: 0,
  idx_dup: 0,        // it presente, mn coincide
  idx_arricch: 0,    // it presente in index ma mn vuoto
  idx_confl: 0,      // it presente con mn diverso (probabile IA da sovrascrivere)
  cand_dup: 0,
  cand_arricch: 0,
  cand_confl: 0,
  nuove: 0,
};
const samples = { idx_confl: [], cand_confl: [], nuove: [] };

for (const r of raw) {
  const it = (r.it || '').trim();
  const mn = (r.mn || '').trim();
  if (!it || !mn) { stats.vuote++; continue; }
  // Priorita': index > candidati > nuova
  const ix = indexByIt.get(it);
  if (ix) {
    const cur = (ix.mn || '').trim();
    if (!cur)            { stats.idx_arricch++; }
    else if (cur === mn) { stats.idx_dup++; }
    else                 { stats.idx_confl++; if (samples.idx_confl.length < 8) samples.idx_confl.push(`"${it}" — idx="${cur}" vs json="${mn}"`); }
    continue;
  }
  const cd = candByIt.get(it);
  if (cd) {
    const cur = (cd.mn || '').trim();
    if (!cur)            { stats.cand_arricch++; }
    else if (cur === mn) { stats.cand_dup++; }
    else                 { stats.cand_confl++; if (samples.cand_confl.length < 5) samples.cand_confl.push(`"${it}" — cand="${cur}" vs json="${mn}"`); }
    continue;
  }
  stats.nuove++;
  if (samples.nuove.length < 8) samples.nuove.push(`"${it}" -> mn:"${mn}"`);
}

console.log('\n=== ANALISI ===');
console.log(`Voci vuote (it o mn assente):   ${stats.vuote}`);
console.log('\nVs INDEX.html (VOCABOLARIO_DEFAULT):');
console.log(`  duplicate identiche (it+mn):  ${stats.idx_dup}`);
console.log(`  arricchimento (mn vuoto):     ${stats.idx_arricch}`);
console.log(`  conflitto (mn diverso):       ${stats.idx_confl}  ← probabili voci IA da sovrascrivere col dizionario`);
console.log('\nVs DIALETTI.html (CANDIDATI):');
console.log(`  duplicate identiche:          ${stats.cand_dup}`);
console.log(`  arricchimento mn:             ${stats.cand_arricch}`);
console.log(`  conflitto:                    ${stats.cand_confl}`);
console.log(`\nNuove (it non presente da nessuna parte): ${stats.nuove}`);

const checksum = stats.vuote + stats.idx_dup + stats.idx_arricch + stats.idx_confl + stats.cand_dup + stats.cand_arricch + stats.cand_confl + stats.nuove;
console.log(`\n(check: somma = ${checksum} / totale ${stats.total})`);

console.log('\n=== Esempi conflitti vs INDEX (top 8) ===');
samples.idx_confl.forEach(s => console.log('  ' + s));
console.log('\n=== Esempi conflitti vs CANDIDATI (top 5) ===');
samples.cand_confl.forEach(s => console.log('  ' + s));
console.log('\n=== Esempi nuove (top 8) ===');
samples.nuove.forEach(s => console.log('  ' + s));
