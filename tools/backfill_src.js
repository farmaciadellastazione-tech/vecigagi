// Backfill v.src + v.verif su index.html dalla storia git.
// Per ogni cella dialettale (mn/sp/ge/cr) presente, usa git blame per attribuire
// la riga al commit che l'ha toccata per ultima, poi mappa al tag di sorgente:
//   - commit message "Promozione N voci da dialetti" -> src "🔗 dialetti.html" + verif ":g"
//   - commit message contiene "Capellini"            -> src "📕 Capellini"
//   - altri commit                                   -> nessun tag (lascia all'utente)
// Schema v.src / v.verif: vedi memoria project_tag_cella_dialettale.md
// (e i commenti nel blocco SORGENTI di edit.html).
//
// Filtro anti-riformattazione: scarta i commit "Promozione N" se blame attribuisce
// piu' di 2*N voci (commit di riformattazione cosmetica del file).
//
// Lancia da repo root.
// Modalita': --apply scrive il file. Senza flag, dry-run stampa solo le statistiche.
//
// Storia: primo apply nel commit c66ba5f (2026-05-28): 78 voci, 197 celle taggate
// dialetti.html, 1 Capellini. Riesegui dopo nuovi cicli di promozione per
// raccogliere nuove attribuzioni.

const fs = require('fs');
const { execSync } = require('child_process');

const APPLY = process.argv.includes('--apply');
const FILE  = 'index.html';
const SRC   = fs.readFileSync(FILE, 'utf8');
const LINES = SRC.split('\n');

const DIA = ['mn', 'sp', 'ge', 'cr'];

// 1. Trova il blocco VOCABOLARIO_DEFAULT con parser bracket-aware
const startRe = /^\s*const VOCABOLARIO_DEFAULT = \[/m;
const m = startRe.exec(SRC);
if (!m) { console.error('VOCABOLARIO_DEFAULT non trovato'); process.exit(1); }
const startIdx = m.index + m[0].length;
let depth = 1, i = startIdx, inStr = false, esc = false, q = null;
while (i < SRC.length) {
  const c = SRC[i];
  if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
  else { if (c === '"' || c === "'") { inStr = true; q = c; } else if (c === '[') depth++; else if (c === ']') { depth--; if (depth === 0) break; } }
  i++;
}
const blockBody = SRC.slice(startIdx, i);
const blockStartLine = SRC.slice(0, startIdx).split('\n').length; // 1-based numero di riga del primo char del body

// 2. Per ogni "voce" (oggetto top-level), trova la sua riga (1-based)
// Le voci sono scritte una per riga: "      { ... },"
const voci = [];
const bodyLines = blockBody.split('\n');
for (let li = 0; li < bodyLines.length; li++) {
  const ln = bodyLines[li];
  const trim = ln.trim();
  if (!trim.startsWith('{')) continue;
  // numero di riga assoluto in index.html
  const absLine = blockStartLine + li;
  voci.push({ lineNum: absLine, raw: trim });
}

console.log(`Trovate ${voci.length} voci nel vocabolario, da riga ${voci[0].lineNum} a riga ${voci[voci.length-1].lineNum}.`);

// 3. Git blame del file: una sola chiamata
console.log('Eseguo git blame...');
const blame = execSync(`git blame --line-porcelain HEAD -- ${FILE}`, { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });

// Parse blame: per ogni linea, "<sha> <orig> <final> <count>"
const lineToSha = new Map();
{
  const blockLines = blame.split('\n');
  let curSha = null, curFinal = null;
  for (const bl of blockLines) {
    const head = bl.match(/^([0-9a-f]{40}) (\d+) (\d+)(?: (\d+))?$/);
    if (head) { curSha = head[1]; curFinal = parseInt(head[3]); continue; }
    if (bl.startsWith('\t') && curSha) { lineToSha.set(curFinal, curSha); curSha = null; }
  }
}

// 4. Per ogni sha unico, prendi il messaggio (cached)
const shaToMsg = new Map();
const uniqueShas = new Set([...voci.map(v => lineToSha.get(v.lineNum)).filter(Boolean)]);
console.log(`Sha unici: ${uniqueShas.size}, recupero messaggi...`);
for (const sha of uniqueShas) {
  try {
    const msg = execSync(`git log -1 --format=%s ${sha}`, { encoding: 'utf8' }).trim();
    shaToMsg.set(sha, msg);
  } catch (e) {
    shaToMsg.set(sha, '');
  }
}

// 5a. Conta quante voci ogni sha attribuisce (per il filtro anti-riformattazione)
const shaCount = new Map();
for (const v of voci) {
  const sha = lineToSha.get(v.lineNum);
  if (sha) shaCount.set(sha, (shaCount.get(sha) || 0) + 1);
}

// 5b. Mappa sha -> tag (sorgente, stato). Scarta i commit "promozione" che hanno
// modificato cosmeticamente molte piu' righe di quelle dichiarate (riformattazione
// di massa: il blame li attribuisce ma il contenuto reale non viene da dialetti).
const SKIPPED_REFORMAT = [];
function mapSha(sha) {
  const msg = shaToMsg.get(sha) || '';
  if (/^Promozione/i.test(msg)) {
    // Estrai N da "Promozione N voci..."
    const m = msg.match(/^Promozione\s+(\d+)\s+voci/i);
    const claimed = m ? parseInt(m[1], 10) : null;
    const attributed = shaCount.get(sha) || 0;
    // Soglia: blame attribuisce al massimo 2 volte le voci dichiarate.
    if (claimed && attributed > 2 * claimed) {
      if (!SKIPPED_REFORMAT.includes(sha)) SKIPPED_REFORMAT.push(sha);
      return null;
    }
    return { src: '🔗 dialetti.html', verif: 'g' };
  }
  if (/Capellini/i.test(msg)) return { src: '📕 Capellini', verif: null };
  return null;
}

// 6. Statistiche e proposta di modifica
const stats = { dia: 0, cap: 0, skipped: 0, voci_modificate: 0 };
const updates = []; // { lineNum, raw, newSrc, newVerif }

for (const voce of voci) {
  const sha = lineToSha.get(voce.lineNum);
  const tag = sha ? mapSha(sha) : null;
  if (!tag) { stats.skipped++; continue; }
  // Estrai i campi dialettali presenti dalla riga raw (parse approssimativo per chiavi mn/sp/ge/cr)
  const cellsPresent = DIA.filter(c => new RegExp('\\b' + c + '\\s*:\\s*"').test(voce.raw));
  if (!cellsPresent.length) { stats.skipped++; continue; }

  // Costruisci src oggetto + verif csv da aggiungere (mergea con esistenti)
  const existingSrcMatch = voce.raw.match(/\bsrc\s*:\s*(\{[^}]*\})/);
  const existingSrc = existingSrcMatch ? eval('(' + existingSrcMatch[1] + ')') : {};
  const existingVerifMatch = voce.raw.match(/\bverif\s*:\s*"([^"]*)"/);
  const existingVerif = new Map();
  if (existingVerifMatch) {
    existingVerifMatch[1].split(',').map(s => s.trim()).filter(Boolean).forEach(tok => {
      const j = tok.indexOf(':'); if (j > 0) existingVerif.set(tok.slice(0, j), tok.slice(j + 1));
    });
  }
  let changed = false;
  for (const c of cellsPresent) {
    if (!existingSrc[c]) { existingSrc[c] = tag.src; changed = true; if (tag.src.includes('dialetti')) stats.dia++; else if (tag.src.includes('Capellini')) stats.cap++; }
    if (tag.verif && !existingVerif.has(c)) { existingVerif.set(c, tag.verif); changed = true; }
  }
  if (!changed) { stats.skipped++; continue; }
  stats.voci_modificate++;
  updates.push({
    lineNum: voce.lineNum,
    newSrc: existingSrc,
    newVerif: existingVerif.size ? [...existingVerif.entries()].map(([k, v]) => `${k}:${v}`).join(',') : null,
  });
}

console.log('\n=== STATISTICHE ===');
console.log(`Voci da modificare: ${stats.voci_modificate} su ${voci.length}`);
console.log(`Celle taggate 🔗 dialetti.html (+verif g): ${stats.dia}`);
console.log(`Celle taggate 📕 Capellini:                ${stats.cap}`);
console.log(`Voci saltate (no tag o gia' presente):    ${stats.skipped}`);
if (SKIPPED_REFORMAT.length) {
  console.log('\n=== Commit SCARTATI (riformattazione di massa, blame inaffidabile) ===');
  SKIPPED_REFORMAT.forEach(sha => console.log(`  ${sha.slice(0,7)} attrib=${shaCount.get(sha)}  ${shaToMsg.get(sha)}`));
}

// Breakdown per commit
const perCommit = new Map();
for (const v of voci) {
  const sha = lineToSha.get(v.lineNum);
  if (!sha) continue;
  const msg = shaToMsg.get(sha) || '';
  perCommit.set(sha.slice(0, 7) + ' ' + msg.slice(0, 70), (perCommit.get(sha.slice(0, 7) + ' ' + msg.slice(0, 70)) || 0) + 1);
}
const top = [...perCommit.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
console.log('\n=== TOP 15 COMMIT (per N voci attribuite da blame) ===');
top.forEach(([k, n]) => console.log(`  ${n.toString().padStart(4)}  ${k}`));

if (!APPLY) {
  console.log('\nDry-run. Riesegui con --apply per scrivere index.html.');
  process.exit(0);
}

// 7. Applica le modifiche: ricostruisci ogni riga modificata
// La riga ha forma: "      { tema:..., ..., src:..., verif:... },"
// Rimuovo gli eventuali src/verif esistenti e li riaggiungo in coda (prima della parentesi chiusa).
console.log('\nScrivo modifiche...');
let updated = 0;
for (const u of updates) {
  const lineIdx0 = u.lineNum - 1;
  let line = LINES[lineIdx0];
  // Rimuovi src e verif esistenti
  line = line.replace(/,\s*src\s*:\s*\{[^}]*\}/g, '');
  line = line.replace(/,\s*verif\s*:\s*"[^"]*"/g, '');
  // Trova la "} ," finale
  const closeIdx = line.lastIndexOf('}');
  if (closeIdx < 0) continue;
  const before = line.slice(0, closeIdx).replace(/\s*$/, '');
  const after  = line.slice(closeIdx);
  const newParts = [];
  if (Object.keys(u.newSrc).length) newParts.push('src:' + JSON.stringify(u.newSrc));
  if (u.newVerif) newParts.push('verif:' + JSON.stringify(u.newVerif));
  const newLine = before + (newParts.length ? ', ' + newParts.join(', ') + ' ' : ' ') + after;
  LINES[lineIdx0] = newLine;
  updated++;
}

fs.writeFileSync(FILE, LINES.join('\n'));
console.log(`Scritte ${updated} righe in ${FILE}.`);
