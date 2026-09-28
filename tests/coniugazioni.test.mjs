// Integrità della tabella CONIUGAZIONI in index.html.
//
// 1) Un solo blocco: edit-coniugazioni.html legge e riscrive SOLO
//    "const CONIUGAZIONI = { ... }". Un secondo blocco (Object.assign)
//    sovrascriveva andare/fare/potere/volere in app: l'editor modificava copie
//    mai mostrate, e parlare/dire non erano modificabili.
// 2) Niente soggetto dentro le forme non dialettali: il soggetto lo aggiunge
//    l'app (SOGGETTI/testoAudio). Le forme compilate con l'IA lo includevano
//    ("er/sie/es kann") → a schermo/audio "er er/sie/es kann", e il "/" le
//    spezzava in sinonimi sbagliati ("er", "sie", "es kann").
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = fs.readFileSync(ROOT + '/index.html', 'utf8');

function estraiConiugazioni(src) {
  const m = /^\s*const\s+CONIUGAZIONI\s*=\s*\{/m.exec(src);
  if (!m) throw new Error('const CONIUGAZIONI non trovato');
  const start = m.index + m[0].length - 1;
  let depth = 0, i = start, inStr = false, esc = false, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return (new Function('return (' + src.slice(start, i) + ')'))();
}

// Pronomi soggetto per lingua (dialetti esclusi: lì il clitico fa parte della forma).
const PRONOMI = {
  it: ['io', 'tu', 'lui', 'lei', 'egli', 'ella', 'noi', 'voi', 'loro', 'essi', 'esse'],
  fr: ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'],
  es: ['yo', 'tú', 'él', 'ella', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'as', 'os'],
  pt: ['eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas'],
  en: ['i', 'you', 'he', 'she', 'it', 'we', 'they'],
  de: ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr'],
  ia: ['io', 'tu', 'ille', 'illa', 'nos', 'vos', 'illes', 'illas'],
  la: ['ego', 'tu', 'ea', 'id', 'nos', 'vos', 'ii', 'eae', 'ille', 'illa', 'illi'],
};

test('CONIUGAZIONI è definita in un unico blocco (quello letto da edit-coniugazioni)', () => {
  assert.ok(!/Object\.assign\(\s*CONIUGAZIONI\b/.test(SRC), 'trovato Object.assign(CONIUGAZIONI, ...)');
  assert.ok(!/\bCONIUGAZIONI(\.\w+|\[[^\]]+\])\s*=[^=]/.test(SRC), 'trovata assegnazione CONIUGAZIONI.x = ...');
});

test('nessuna forma non dialettale contiene il pronome soggetto', () => {
  const C = estraiConiugazioni(SRC);
  const errori = [];
  for (const [vk, v] of Object.entries(C)) for (const [tk, t] of Object.entries(v.tempi || {})) {
    for (const f of t.forme || []) for (const [l, prons] of Object.entries(PRONOMI)) {
      const val = f[l];
      if (!val) continue;
      // "|" = alternative nascoste, "/" = sinonimi: controlla ciascuna
      const conPronome = String(val).split(/[/|]/).some(alt => {
        const parole = alt.trim().toLowerCase().split(/\s+/);
        return parole.length >= 2 && prons.includes(parole[0]);
      });
      if (conPronome) errori.push(`${vk}.${tk} ${f.p} ${l}: "${val}"`);
    }
  }
  assert.deepStrictEqual(errori, []);
});
