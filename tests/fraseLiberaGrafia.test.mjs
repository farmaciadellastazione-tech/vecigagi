// Frase libera nei dialetti (segnalazione di Dino, 2026-10-25): la parola
// della carta compariva come "pronuncia/grafia" (mn "kuse ghe anchè/cuse gh'é
// anchè"). Va mostrata e data all'IA nella sola grafia, come fa parolaCarta.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');

test('la parola della carta passa sempre da parolaCarta (grafia), mai da soloVisibile', () => {
  assert.match(fl, /const parolaCarta = carta \? formaDisplay\(/);
  // L'unica rimasta è il ripiego dentro parolaCarta stessa.
  const usi = fl.match(/soloVisibile\(carta\.entry\[carta\.lingua\.codice\]\)/g) || [];
  assert.strictEqual(usi.length, 1);
});

test('titolo, casella, IA (correzione e Traduci) e Continua a parlarne', () => {
  assert.match(fl, /tracking-tight"\s*\}, parolaCarta\)/);
  assert.match(fl, /placeholder: `Frase con "\$\{parolaCarta\}"\.\.\.`/);
  assert.match(tra('  async function verificaFrase()', '  const n = ++richiestaFrase'), /const parola = parolaCarta;/);
  assert.match(tra('  async function traduci()', '  const langName'), /const parola = parolaCarta;/);
  assert.match(fl, /parola: parolaCarta,/);
});
