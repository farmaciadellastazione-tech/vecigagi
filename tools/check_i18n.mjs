/**
 * tools/check_i18n.mjs — verifica copertura chiavi UI rispetto alla versione `it`
 * Uso: node tools/check_i18n.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(ROOT, 'index.html'), 'utf8');

// Estrae il blocco `const UI = { ... };` con bracket-matching
const start = src.indexOf('const UI = {');
if (start === -1) { console.error('UI non trovato'); process.exit(1); }
let depth = 0, i = start + 'const UI = '.length, inStr = false, strChar = '';
const startBrace = src.indexOf('{', start);
i = startBrace;
depth = 0;
let end = -1;
while (i < src.length) {
  const c = src[i];
  if (inStr) {
    if (c === '\\') { i += 2; continue; }
    if (c === strChar) inStr = false;
  } else {
    if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  i++;
}
if (end === -1) { console.error('Blocco UI non chiuso'); process.exit(1); }

const uiBlock = src.slice(start, end + 1);

// Eval sicuro: rimpiazza `const UI = ` e aggiungi parentesi per eval
const evalSrc = '(' + uiBlock.replace(/^const UI = /, '') + ')';
let UI;
try {
  UI = eval(evalSrc); // eslint-disable-line no-eval
} catch (e) {
  console.error('Eval UI fallito:', e.message);
  process.exit(1);
}

const itKeys = new Set(Object.keys(UI.it));
const langs = Object.keys(UI).filter(l => l !== 'it');

let totalMissing = 0;
let totalExtra = 0;

for (const lang of langs) {
  const langKeys = new Set(Object.keys(UI[lang]));
  const missing = [...itKeys].filter(k => !langKeys.has(k));
  const extra = [...langKeys].filter(k => !itKeys.has(k));
  if (missing.length || extra.length) {
    console.log(`\n── ${lang} ──`);
    if (missing.length) console.log(`  ❌ mancanti (${missing.length}): ${missing.join(', ')}`);
    if (extra.length)   console.log(`  ⚠️  extra    (${extra.length}): ${extra.join(', ')}`);
    totalMissing += missing.length;
    totalExtra += extra.length;
  }
}

if (totalMissing === 0 && totalExtra === 0) {
  console.log(`✅ Tutte le lingue (${langs.length}) hanno le stesse ${itKeys.size} chiavi di 'it'`);
} else {
  console.log(`\nTotale: ${totalMissing} chiavi mancanti, ${totalExtra} chiavi extra`);
}
