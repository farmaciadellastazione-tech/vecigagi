// Test del controllo "il tema esiste in TEMI" in tools/validate_vocabolario.mjs.
//
// Prima: il validatore avvisava solo se il tema MANCAVA; un refuso (es.
// "animale" invece di "animali") passava senza segnalazioni, ma il quiz non
// mostra badge né filtro per un tema che non è in TEMI di index.html.
//
// Dopo: un tema che non è tra le chiavi di TEMI è un ERRORE (blocca la CI).
// Se il file non contiene un blocco TEMI, il controllo è saltato con un
// WARNING (per non rompere l'uso del validatore su file diversi da index.html).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const VALIDATORE = path.join(ROOT, 'tools', 'validate_vocabolario.mjs');

function htmlDiProva({ temi, voci }) {
  const blocco = temi
    ? `const TEMI = {\n${temi.map(t => `  ${t}: { label: "${t}", emoji: "🔹" },`).join('\n')}\n};\n`
    : '';
  const righe = voci.map(v => `  { ${v.tema !== undefined ? `tema:"${v.tema}", ` : ''}livello:"A1", it:"${v.it}", en:"${v.en}" },`).join('\n');
  return `<script>\n${blocco}const VOCABOLARIO_DEFAULT = [\n${righe}\n];\n</script>\n`;
}

function valida(html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'valtemi-'));
  const file = path.join(dir, 'prova.html');
  fs.writeFileSync(file, html, 'utf8');
  try {
    const r = spawnSync(process.execPath, [VALIDATORE, file, '--verbose'], { encoding: 'utf8' });
    return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('un tema definito in TEMI è accettato', () => {
  const r = valida(htmlDiProva({
    temi: ['casa', 'animali'],
    voci: [{ tema: 'casa', it: 'tavolo', en: 'table' }, { tema: 'animali', it: 'cane', en: 'dog' }],
  }));
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /ERRORI: 0/);
});

test('un tema NON definito in TEMI (refuso) è un errore che blocca la CI', () => {
  const r = valida(htmlDiProva({
    temi: ['casa', 'animali'],
    voci: [{ tema: 'animale', it: 'cane', en: 'dog' }],
  }));
  assert.strictEqual(r.code, 1, r.out);
  assert.match(r.out, /tema sconosciuto/);
  assert.match(r.out, /animale/);
});

test('il messaggio d\'errore indica il tema e la voce', () => {
  const r = valida(htmlDiProva({
    temi: ['casa'],
    voci: [{ tema: 'dialetti', it: 'bagolo', en: 'x' }],
  }));
  assert.strictEqual(r.code, 1, r.out);
  assert.match(r.out, /"bagolo".*tema sconosciuto.*dialetti/);
});

test('una voce senza tema resta un semplice WARNING, non un errore', () => {
  const r = valida(htmlDiProva({
    temi: ['casa'],
    voci: [{ it: 'tavolo', en: 'table' }],
  }));
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /manca "…"/);
});

test('senza blocco TEMI il controllo è saltato con un WARNING', () => {
  const r = valida(htmlDiProva({
    voci: [{ tema: 'qualunque', it: 'tavolo', en: 'table' }],
  }));
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /TEMI non trovato/);
});

// Prima: livello:"" (stato raggiungibile svuotando la cella in edit.html,
// vedi tests/pesoCefr.test.mjs) cadeva nel ramo "livello invalido" (ERRORE
// bloccante), perché il controllo era `v.livello === undefined` — "" non è
// `undefined`. Dopo: "" vale come "manca il livello" (solo WARNING), come
// documentato dal fix di PESO_CEFR/passaCEFR in index.html.
test('livello:"" (svuotato in edit.html) è un WARNING come "manca livello", non un errore', () => {
  const r = valida(`<script>\nconst TEMI = { casa: { label: "Casa", emoji: "🏠" } };\n` +
    `const VOCABOLARIO_DEFAULT = [\n  { tema:"casa", livello:"", it:"tavolo", en:"table" },\n];\n</script>\n`);
  assert.strictEqual(r.code, 0, r.out);
  assert.match(r.out, /manca "…"/);
  assert.doesNotMatch(r.out, /livello invalido/);
});

test('index.html reale: ogni tema usato è definito in TEMI', () => {
  const r = spawnSync(process.execPath, [VALIDATORE, path.join(ROOT, 'index.html')], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, (r.stdout || '') + (r.stderr || ''));
  assert.doesNotMatch(r.stdout, /tema sconosciuto/);
});
