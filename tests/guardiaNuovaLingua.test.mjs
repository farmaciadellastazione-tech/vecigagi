// edit.html, "Aggiungi lingua" (review 2026-09-30): confermaNuovaLingua()
// riscriveva originalSourceFile con la versione modificata localmente; la
// guardia anti-clobber confrontava il file su GitHub proprio con quella
// variabile, quindi dopo aver aggiunto una lingua il salvataggio risultava
// SEMPRE "cambiato su GitHub" e veniva bloccato. Ora la guardia confronta con
// sorgenteRemoto: il file come letto/scritto su GitHub, che nessuna modifica
// locale tocca.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');

function estraiFn(src, nome) {
  let at = src.indexOf('function ' + nome + '(');
  if (at < 0) throw new Error('funzione non trovata: ' + nome);
  if (src.slice(at - 6, at) === 'async ') at -= 6;
  let i = src.indexOf('{', src.indexOf(')', at)), d = 0, q = null, lc = false, bc = false;
  for (; i < src.length; i++) {
    const c = src[i], c2 = src[i + 1];
    if (lc) { if (c === '\n') lc = false; continue; }
    if (bc) { if (c === '*' && c2 === '/') { bc = false; i++; } continue; }
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '/' && c2 === '/') { lc = true; i++; continue; }
    if (c === '/' && c2 === '*') { bc = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) break; }
  }
  return src.slice(at, i + 1);
}

test('la guardia confronta il file su GitHub con sorgenteRemoto, non con la copia di lavoro', () => {
  const salva = estraiFn(EDIT, 'salvaSuGitHub');
  assert.match(salva, /if \(remoto !== sorgenteRemoto\)/);
  assert.doesNotMatch(salva, /remoto !== originalSourceFile/);
});

test('sorgenteRemoto si aggiorna solo leggendo o scrivendo su GitHub', () => {
  assert.match(EDIT, /originalSourceFile = await res\.text\(\);\s*sorgenteRemoto = originalSourceFile;/,
    'al caricamento da GitHub');
  assert.match(estraiFn(EDIT, 'salvaSuGitHub'), /sorgenteRemoto = nuovoSrc;/, 'dopo una PUT riuscita');
  assert.doesNotMatch(estraiFn(EDIT, 'confermaNuovaLingua'), /sorgenteRemoto\s*=/,
    'aggiungere una lingua è una modifica locale: non deve toccare la copia di confronto');
});
