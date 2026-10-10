// Pagine statiche per dialetto (2026-10-10, richiesta di Dino: "dialetto
// spezzino" / "dialetto carrarino" su Google non trovavano nulla di nostro,
// perché dialetti.html carica il dizionario con JavaScript).
// tools/build_dialetti_pages.mjs genera dialetto-{spezzino,carrarino,
// manarolese,genovese}.html con tutte le voci scritte nell'HTML.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIALETTI, vociDialetto } from '../tools/build_dialetti_pages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const leggi = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('le voci mostrano la grafia, non la pronuncia per la voce sintetica', () => {
  const sp = vociDialetto('sp');
  assert.ok(sp.length > 1000);
  for (const v of sp) assert.ok(!/[|]/.test(v.dial), v.dial);
  const conto = sp.find(v => v.it === 'il conto per favore');
  assert.ok(conto, 'voce "il conto per favore" presente');
  assert.strictEqual(conto.dial, "er conto pe' piasée", 'grafia, non "air conto per piazze"');
});

test('niente doppioni né celle vuote o "?"', () => {
  for (const d of DIALETTI) {
    const voci = vociDialetto(d.cod);
    const chiavi = voci.map(v => v.it.toLowerCase() + '|' + v.dial.toLowerCase());
    assert.strictEqual(new Set(chiavi).size, chiavi.length, d.cod);
    assert.ok(voci.every(v => v.dial && v.dial !== '?'), d.cod);
  }
});

test('ogni pagina generata ha title, description, canonical e le parole scritte nell\'HTML', () => {
  for (const d of DIALETTI) {
    const html = leggi(d.slug);
    assert.match(html, new RegExp(`<title>Dialetto ${d.nome}: dizionario`), d.slug);
    assert.match(html, /<meta name="description" content="Come si dice in /, d.slug);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://linguaequiz.com/${d.slug}">`), d.slug);
    assert.ok((html.match(/<tr><td>/g) || []).length > 1000, d.slug + ': parole nell\'HTML');
    for (const altro of DIALETTI.filter(x => x !== d)) assert.ok(html.includes(`href="${altro.slug}"`), `${d.slug} → ${altro.slug}`);
  }
});

test('sitemap, collegamenti da dialetti.html e comando npm', () => {
  const sitemap = leggi('sitemap.xml');
  const dialetti = leggi('dialetti.html');
  for (const d of DIALETTI) {
    assert.ok(sitemap.includes(`<loc>https://linguaequiz.com/${d.slug}</loc>`), 'sitemap: ' + d.slug);
    assert.ok(dialetti.includes(`href="${d.slug}"`), 'dialetti.html: ' + d.slug);
  }
  assert.strictEqual(JSON.parse(leggi('package.json')).scripts['build:dialetti'], 'node tools/build_dialetti_pages.mjs');
});
