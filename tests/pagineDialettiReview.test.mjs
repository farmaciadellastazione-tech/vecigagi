// Review di fcb19a1 (pagine statiche per dialetto):
// 1) l'estrazione di VOCABOLARIO_DEFAULT/TEMI deve saltare i commenti JS (un
//    apostrofo in "// voci dell'IA" non deve aprire una stringa);
// 2) doppioni che differiscono solo per spazi/virgole ("sbassae,abassae," e
//    "sbassae, abassae") diventano una voce sola, senza virgola finale;
// 3) schema.org dichiara anche il ligure (lij) per sp/mn/ge;
// 4) la sitemap prende la data dell'ultima generazione delle pagine.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { letterale, ripulisci, vociDialetto, schemaPagina, aggiornaSitemap, DIALETTI } from '../tools/build_dialetti_pages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';

test('letterale salta i commenti con apostrofi e parentesi', () => {
  const src = `x; const A = [
    // voci dell'IA [da rivedere
    { it: "casa", sp: "ca" }, /* commento con ' e ] */
    { it: "cane", sp: "can" }
  ];`;
  const a = letterale(src, 'const A = [');
  assert.strictEqual(a.length, 2);
  assert.strictEqual(a[1].sp, 'can');
});

test('ripulisci uniforma spazi e virgole; i doppioni quasi uguali spariscono', () => {
  assert.strictEqual(ripulisci('sbassae,abassae,'), 'sbassae, abassae');
  assert.strictEqual(ripulisci(' sbassae ,  abassae '), 'sbassae, abassae');
  const sp = vociDialetto('sp').filter(v => v.it === 'abbassare');
  const visti = sp.map(v => v.dial);
  assert.strictEqual(new Set(visti).size, visti.length);
  assert.ok(visti.every(d => !/,\s*$/.test(d)), 'nessuna virgola finale');
});

test('schema.org: italiano e, dove esiste, il codice del dialetto', () => {
  const sp = DIALETTI.find(d => d.cod === 'sp');
  const cr = DIALETTI.find(d => d.cod === 'cr');
  assert.deepStrictEqual(schemaPagina(sp, 'x').inLanguage, ['it', 'lij']);
  assert.deepStrictEqual(schemaPagina(cr, 'x').inLanguage, ['it']);
});

test('aggiornaSitemap mette la data di oggi alle pagine dei dialetti', () => {
  const prima = `<url>\n    <loc>https://linguaequiz.com/dialetto-spezzino.html</loc>\n    <lastmod>2020-01-01</lastmod>\n  </url>\n<url>\n    <loc>https://linguaequiz.com/storie.html</loc>\n    <lastmod>2020-01-01</lastmod>\n  </url>`;
  const dopo = aggiornaSitemap(prima, '2026-10-11');
  assert.match(dopo, /dialetto-spezzino\.html<\/loc>\n    <lastmod>2026-10-11<\/lastmod>/);
  assert.match(dopo, /storie\.html<\/loc>\n    <lastmod>2020-01-01<\/lastmod>/, 'le altre pagine non cambiano');
});

test('CLAUDE.md documenta npm run build:dialetti', () => {
  assert.match(fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8'), /npm run build:dialetti/);
});
