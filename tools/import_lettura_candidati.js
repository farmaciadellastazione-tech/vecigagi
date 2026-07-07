// Importa nel CANDIDATI di dialetti.html le voci esportate con "📋 Copia JSON" dal
// pannello candidati di Lettura Guidata (index.html).
// Schema input: array di { parola, lingua, it, tema, frase, storiaId, data }
//   (l'oggetto grezzo salvato in localStorage — vedi SK_CANDIDATI_LG in index.html)
//   oppure la forma già "pronta" esportata dal bottone { tema, it, [lingua]: parola }.
// Schema output (per ogni nuova voce di candidato):
//   { tema, it, [lingua]: parola, src:{[lingua]:"🤖 Lettura guidata (AI)"}, note:{[lingua]:"..."} }
//
// IMPORTANTE: a differenza di tools/import_dict_mn.js (fonte: dizionario cartaceo,
// verif:'xx:y' automatico), queste voci vengono dall'AI e NON sono verificate — il
// campo `verif` viene lasciato non impostato di proposito, così restano in stato
// "da revisionare" in dialetti.html finché un umano non le controlla e promuove.
//
// Politica:
//   - Voce con (it, lingua) identica a una già in index.html VOCABOLARIO_DEFAULT → skip duplicato.
//   - Voce con it presente in CANDIDATI e stessa lingua vuota → arricchisci (aggiungi lingua+src+note).
//   - Voce con it presente in CANDIDATI e stessa lingua diversa e non vuota → skip per conflitto.
//   - Tutte le altre → nuova entry in CANDIDATI.
//
// Lancia: node tools/import_lettura_candidati.js <path-json> [--apply]

const fs = require('fs');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const JSON_PATH = args.find(a => !a.startsWith('--'));
if (!JSON_PATH) { console.error('Uso: node tools/import_lettura_candidati.js <path-json> [--apply]'); process.exit(1); }

const SRC_DIALETTI = 'dialetti.html';
const SRC_INDEX = 'index.html';
const SRC_LABEL = '🤖 Lettura guidata (AI)';

const jsonData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
console.log(`JSON: ${jsonData.length} voci.`);

// Parse arrays bracket-aware (stessa funzione di import_dict_mn.js)
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

// Un candidato dal pannello di Lettura Guidata ha sempre esattamente UNA lingua
// straniera oltre a tema/it (più eventuali frase/storiaId/data/parola grezzi che ignoriamo).
const CAMPI_IGNORATI = new Set(['tema', 'it', 'frase', 'storiaId', 'data', 'parola', 'lingua']);
function estraiLinguaEValore(r) {
  // Forma "pronta" dal bottone Copia JSON: { tema, it, en: "cat" }
  const chiaviLingua = Object.keys(r).filter(k => !CAMPI_IGNORATI.has(k));
  if (chiaviLingua.length === 1) return { lingua: chiaviLingua[0], valore: r[chiaviLingua[0]] };
  // Forma grezza da localStorage: { parola, lingua, it, ... }
  if (r.lingua && r.parola) return { lingua: r.lingua, valore: r.parola };
  return null;
}

const dialFile = fs.readFileSync(SRC_DIALETTI, 'utf8');
const indexFile = fs.readFileSync(SRC_INDEX, 'utf8');
const candVoc = parseArrayBody(dialFile, 'CANDIDATI');
const indexVoc = parseArrayBody(indexFile, 'VOCABOLARIO_DEFAULT');
console.log(`CANDIDATI: ${candVoc.length} voci. VOCABOLARIO_DEFAULT: ${indexVoc.length} voci.`);

const indexByIt = new Map(indexVoc.map(v => [(v.it || '').trim(), v]));
const candByIt = new Map(candVoc.map(v => [(v.it || '').trim(), v]));

const stats = { scartate: 0, dup: 0, arricchCand: 0, conflCand: 0, nuove: 0 };

for (const r of jsonData) {
  const it = (r.it || '').trim();
  const parsed = estraiLinguaEValore(r);
  if (!it || !parsed || !parsed.valore) { stats.scartate++; continue; }
  const { lingua, valore } = parsed;
  const val = String(valore).trim();
  if (!val) { stats.scartate++; continue; }

  const noteParts = [];
  if (r.frase) noteParts.push(`frase: "${r.frase}"`);
  if (r.storiaId) noteParts.push(`storia: ${r.storiaId}`);
  const noteStr = noteParts.join(' | ');

  // 1. Duplicato esatto in index → skip
  const inIdx = indexByIt.get(it);
  if (inIdx && (inIdx[lingua] || '').trim() === val) { stats.dup++; continue; }

  // 2. Esiste già in CANDIDATI
  const inCand = candByIt.get(it);
  if (inCand) {
    const cur = (inCand[lingua] || '').trim();
    if (cur && cur !== val) { stats.conflCand++; continue; }
    inCand[lingua] = val;
    const srcObj = (inCand.src && typeof inCand.src === 'object' && !Array.isArray(inCand.src)) ? Object.assign({}, inCand.src) : {};
    srcObj[lingua] = SRC_LABEL;
    inCand.src = srcObj;
    // Niente auto-verif: fonte AI, resta da revisionare.
    if (noteStr) {
      const noteObj = (inCand.note && typeof inCand.note === 'object') ? Object.assign({}, inCand.note) : {};
      noteObj[lingua] = noteStr;
      inCand.note = noteObj;
    }
    stats.arricchCand++;
    continue;
  }

  // 3. Nuova entry — eredita tema dalla voce in index se presente
  const tema = (inIdx && inIdx.tema) ? inIdx.tema : (r.tema || 'dialetti');
  const newEntry = { tema, it, [lingua]: val, src: { [lingua]: SRC_LABEL } };
  if (noteStr) newEntry.note = { [lingua]: noteStr };
  candVoc.push(newEntry);
  candByIt.set(it, newEntry);
  stats.nuove++;
}

console.log('\n=== ESITO ===');
console.log(`Scartate (dati incompleti):              ${stats.scartate}`);
console.log(`Duplicati con index (skip):               ${stats.dup}`);
console.log(`Arricchimenti su CANDIDATI esistenti:      ${stats.arricchCand}`);
console.log(`Conflitti vs CANDIDATI esistenti (skip):   ${stats.conflCand}`);
console.log(`Nuove entry:                                ${stats.nuove}`);
console.log('\nRicorda: nessuna voce viene marcata verificata automaticamente (fonte AI) — vanno revisionate in dialetti.html?admin=1 prima di "🚀 Promuovi".');

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
