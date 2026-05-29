// Importa il JSON estratto dal dizionario manarolese in CANDIDATI di dialetti.html.
// Schema input: array di { mn, it, cat, pag }.
// Schema output (per ogni nuova voce di candidato):
//   { it, mn, src:{mn:"📕 Dizionario manarolese"}, verif:"mn:y", note:{mn:"cat:... | p:..."} }
// (più tema:"dialetti" come default per le entry create da zero — facilita la promozione)
//
// Politica:
//   - Voci con (it, mn) identica a una in index.html VOCABOLARIO_DEFAULT → skip duplicato.
//   - Voci con it presente in CANDIDATI e mn vuoto → arricchisci (set mn+src+verif+note).
//   - Voci con it presente in CANDIDATI e mn diverso → skip per ora (raro, 0 nei test).
//   - Tutte le altre → nuova entry in CANDIDATI.
//
// Voci con it troppo lungo (>80 char) o senza spazi anomali NON vengono filtrate: vengono
// inserite con un avviso a log; le ripulisci a mano in dialetti.html (e.g. "vassoio di
// cartone per dolci." è una definizione PDF estratta male).
//
// Lancia: node tools/import_dict_mn.js <path-json> [--apply]

const fs = require('fs');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const JSON_PATH = args.find(a => !a.startsWith('--'));
if (!JSON_PATH) { console.error('Uso: node tools/import_dict_mn.js <path-json> [--apply]'); process.exit(1); }

const SRC_DIALETTI = 'dialetti.html';
const SRC_INDEX = 'index.html';
const SRC_LABEL = '📕 Dizionario manarolese';

const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
console.log(`JSON: ${jsonData.length} voci.`);

// Parse arrays bracket-aware
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

const dialFile = fs.readFileSync(SRC_DIALETTI, 'utf8');
const indexFile = fs.readFileSync(SRC_INDEX, 'utf8');
const candVoc = parseArrayBody(dialFile, 'CANDIDATI');
const indexVoc = parseArrayBody(indexFile, 'VOCABOLARIO_DEFAULT');
console.log(`CANDIDATI: ${candVoc.length} voci. VOCABOLARIO_DEFAULT: ${indexVoc.length} voci.`);

const indexByIt = new Map(indexVoc.map(v => [(v.it || '').trim(), v]));
// candByIt è mutabile (lo aggiorno mentre processo)
const candByIt = new Map(candVoc.map(v => [(v.it || '').trim(), v]));

const stats = { dup: 0, arricchIdx: 0, arricchCand: 0, conflCand: 0, nuove: 0, sporcheLog: 0 };
const sporche = [];

for (const r of jsonData) {
  const it = (r.it || '').trim();
  const mn = (r.mn || '').trim();
  if (!it || !mn) continue;
  const nota = [];
  if (r.cat) nota.push('cat:' + r.cat);
  if (r.pag) nota.push('p:' + r.pag);
  const noteStr = nota.join(' | ');

  // 1. Duplicato esatto in index → skip
  const inIdx = indexByIt.get(it);
  if (inIdx && (inIdx.mn || '').trim() === mn) { stats.dup++; continue; }

  // 2. Esiste in CANDIDATI
  const inCand = candByIt.get(it);
  if (inCand) {
    const cur = (inCand.mn || '').trim();
    if (cur && cur !== mn) { stats.conflCand++; continue; }
    // Arricchisci la voce esistente
    inCand.mn = mn;
    const srcObj = (inCand.src && typeof inCand.src === 'object' && !Array.isArray(inCand.src)) ? Object.assign({}, inCand.src) : {};
    srcObj.mn = SRC_LABEL;
    inCand.src = srcObj;
    // verif mn:y (mergea con eventuali altri)
    const verifMap = new Map();
    (typeof inCand.verif === 'string' ? inCand.verif : '').split(',').map(s => s.trim()).filter(Boolean).forEach(tok => {
      const j = tok.indexOf(':'); if (j > 0) verifMap.set(tok.slice(0, j), tok.slice(j + 1));
    });
    verifMap.set('mn', 'y');
    inCand.verif = [...verifMap.entries()].map(([k, v]) => `${k}:${v}`).join(',');
    if (noteStr) {
      const noteObj = (inCand.note && typeof inCand.note === 'object') ? Object.assign({}, inCand.note) : {};
      noteObj.mn = noteStr;
      inCand.note = noteObj;
    }
    stats.arricchCand++;
    continue;
  }

  // 3. Nuova entry — eredita tema dalla voce in index se presente (es. 14 conflitti + 3 arricch.idx)
  const tema = (inIdx && inIdx.tema) ? inIdx.tema : 'dialetti';
  const livello = (inIdx && inIdx.livello) ? inIdx.livello : undefined;
  const newEntry = {
    tema,
    it,
    mn,
    src: { mn: SRC_LABEL },
    verif: 'mn:y',
  };
  if (livello) newEntry.livello = livello;
  if (noteStr) newEntry.note = { mn: noteStr };
  candVoc.push(newEntry);
  candByIt.set(it, newEntry);
  if (inIdx) stats.arricchIdx++; else stats.nuove++;

  if (it.length > 80 || /\.\s/.test(it)) { stats.sporcheLog++; if (sporche.length < 10) sporche.push(it); }
}

console.log('\n=== ESITO ===');
console.log(`Duplicati con index (skip):              ${stats.dup}`);
console.log(`Arricchimenti su CANDIDATI esistenti:    ${stats.arricchCand}`);
console.log(`Conflitti vs CANDIDATI esistenti (skip): ${stats.conflCand}`);
console.log(`Nuove entry (sovrascrivono index al promo): ${stats.arricchIdx}`);
console.log(`Nuove entry (it non in index):           ${stats.nuove}`);
console.log(`Voci sporche (it sospetto, vai a vedere): ${stats.sporcheLog}`);
if (sporche.length) sporche.forEach(s => console.log('  ⚠️  ' + s));

if (!APPLY) {
  console.log('\nDry-run. Riesegui con --apply per scrivere dialetti.html.');
  process.exit(0);
}

// 4. Serializza il nuovo array CANDIDATI e scrivi
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
const lines = candVoc.map(v => '      ' + serializza(v) + ',');
const nuovoSrc = dialFile.slice(0, block.startBody)
  + '\n      // ── CANDIDATI ──────────────────\n'
  + lines.join('\n')
  + '\n    '
  + dialFile.slice(block.endBody);

fs.writeFileSync(SRC_DIALETTI, nuovoSrc);
console.log(`\nScritto ${SRC_DIALETTI} con ${candVoc.length} voci totali in CANDIDATI.`);
