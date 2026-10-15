// Lingue di partenza per zona (richiesta di Dino, 2026-10-15): al primo
// accesso, a chi ha il browser in italiano si chiede "Dove abiti?".
//   Cinque Terre → it + manarolese; provincia SP → it + spezzino;
//   resto della Liguria → it + genovese; provincia MS → it + carrarino;
//   altrove / salta → come prima (LINGUE_DEFAULT, it + en).
// Mai a chi ha già lingue salvate, né a chi arriva da un link con hash
// (#ricerca/sp, #storia/..., ecc.: lì decide il link).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const ctx = vm.createContext({});
vm.runInContext([
  tra('const LINGUE_DEFAULT = [', '\n// ── Fine zone'),
  'globalThis.LINGUE_DEFAULT = LINGUE_DEFAULT; globalThis.lingueDaZona = lingueDaZona; globalThis.deveChiedereZona = deveChiedereZona; globalThis.ZONE = ZONE;',
].join('\n'), ctx);

const attive = l => Array.from(l.filter(x => x.attiva), x => x.codice).sort();

test('ogni zona attiva italiano + il suo dialetto', () => {
  assert.deepStrictEqual(attive(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, '5terre')), ['it', 'mn']);
  assert.deepStrictEqual(attive(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, 'sp')), ['it', 'sp']);
  assert.deepStrictEqual(attive(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, 'liguria')), ['ge', 'it']);
  assert.deepStrictEqual(attive(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, 'ms')), ['cr', 'it']);
});

test('altrove o zona sconosciuta: lingue invariate', () => {
  assert.strictEqual(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, 'altrove'), ctx.LINGUE_DEFAULT);
  assert.strictEqual(ctx.lingueDaZona(ctx.LINGUE_DEFAULT, 'boh'), ctx.LINGUE_DEFAULT);
  assert.deepStrictEqual(attive(ctx.LINGUE_DEFAULT), ['en', 'it'], 'default di prima');
});

test('le cinque risposte, nell\'ordine richiesto', () => {
  assert.deepStrictEqual(Array.from(ctx.ZONE, z => z.id), ['5terre', 'sp', 'liguria', 'ms', 'altrove']);
});

test('quando fare la domanda', () => {
  const base = { lingueSalvate: false, zonaSalvata: false, uiLang: 'it', hash: '' };
  assert.strictEqual(ctx.deveChiedereZona(base), true);
  assert.strictEqual(ctx.deveChiedereZona({ ...base, lingueSalvate: true }), false, 'utente già esistente');
  assert.strictEqual(ctx.deveChiedereZona({ ...base, zonaSalvata: true }), false, 'già risposto o saltato');
  assert.strictEqual(ctx.deveChiedereZona({ ...base, uiLang: 'en' }), false, 'browser non italiano');
  assert.strictEqual(ctx.deveChiedereZona({ ...base, hash: '#ricerca/sp' }), false, 'arriva da un link');
  assert.strictEqual(ctx.deveChiedereZona({ ...base, hash: '#' }), true, 'hash vuoto');
});

test('App: la domanda viene prima della home e del tour', () => {
  assert.match(HTML, /deveChiedereZona\(\{/);
  assert.match(HTML, /if \(chiediZona\) return \/\*#__PURE__\*\/React\.createElement\(SceltaZona,/);
  assert.match(HTML, /const SK_ZONA = "qml_v1_zona";/);
});
