// Riga persona "3ª sing. f." (lei/elle/she/sie...): esiste per i dialetti dove
// il femminile cambia la forma (ge "o va" / "a va"). Deve stare subito dopo
// "3ª sing.", avere il suo soggetto in SOGGETTI (sennò la carta mostrerebbe
// "kann" senza "sie") e il ge maschile non deve più usare "o/a ..." (il "/" nei
// dialetti è pronuncia/grafia: "o/a stà" = TTS "o", grafia "a stà").
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const EDIT = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');

function oggetto(src, inizio) {
  const m = inizio.exec(src);
  if (!m) throw new Error('non trovato: ' + inizio);
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
const C = oggetto(HTML, /^\s*const\s+CONIUGAZIONI\s*=\s*\{/m);
const SOGGETTI = oggetto(HTML, /^const SOGGETTI = \{/m);
const F = '3ª sing. f.';

test('i verbi con il femminile ge nei dati hanno la riga 3ª sing. f. nel presente', () => {
  const attesi = {
    andare: ['va', 'a va'], potere: ['può', 'a peu'], volere: ['vuole', 'a veu|a eu'],
    stare: ['sta', 'a stà'], tirare: ['tira', 'a tia'], sapere: ['sa', 'a sa'],
    dare: ['dà', 'a dà'], venire: ['viene', 'a vëgne|a ven'],
  };
  for (const [v, [it, ge]] of Object.entries(attesi)) {
    const f = C[v].tempi.presente.forme.find(x => x.p === F);
    assert.ok(f, `${v}: manca la riga ${F}`);
    assert.strictEqual(f.it, it, `${v} it`);
    assert.strictEqual(f.ge, ge, `${v} ge`);
  }
});

test('la riga 3ª sing. f. sta subito dopo 3ª sing.', () => {
  for (const [v, verbo] of Object.entries(C)) for (const [t, tempo] of Object.entries(verbo.tempi)) {
    const ps = tempo.forme.map(x => x.p.replace(/ \(.*\)/, '').trim());
    const i = ps.indexOf(F);
    if (i >= 0) assert.strictEqual(ps[i - 1], '3ª sing.', `${v}.${t}`);
  }
});

test('ge alla 3ª sing. non usa più "o/a ..." (il femminile ha la sua riga)', () => {
  for (const [v, verbo] of Object.entries(C)) for (const [t, tempo] of Object.entries(verbo.tempi)) {
    const f = tempo.forme.find(x => x.p.startsWith('3ª sing.') && x.p !== F);
    if (f?.ge) assert.ok(!/^\s*o\s*\/\s*a\b|\/\s*a /.test(f.ge), `${v}.${t} ge: "${f.ge}"`);
  }
});

test('SOGGETTI ha il soggetto femminile per ogni lingua non dialettale', () => {
  const attesi = { it: 'lei', fr: 'elle', es: 'ella', pt: 'ela', en: 'she', de: 'sie', ia: 'illa' };
  for (const [l, s] of Object.entries(attesi)) assert.strictEqual(SOGGETTI[l]?.[F], s, l);
});

test('edit-coniugazioni propone la riga e la inserisce dopo 3ª sing.', () => {
  assert.match(EDIT, /PERSONE_PRESET = \[[^\]]*'3ª sing\. f\.'/);
  assert.match(EDIT, /'3ª sing\. f\.'[\s\S]{0,300}splice/);
});
