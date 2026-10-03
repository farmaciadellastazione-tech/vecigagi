// edit-coniugazioni, prompt dell'IA (2026-10-03): l'IA coniugava l'interlingua
// per persona come lo spagnolo ("paga, pagas, pagamos"), mentre in interlingua
// il verbo ha una sola forma per tutte le persone ("paga"). Il prompt ora lo dice.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const EDIT = fs.readFileSync(ROOT + '/edit-coniugazioni.html', 'utf8');

test('il prompt spiega che in interlingua il verbo non cambia con la persona', () => {
  const p = EDIT.slice(EDIT.indexOf('const prompt = `Sei un linguista'), EDIT.indexOf('`;', EDIT.indexOf('const prompt = `Sei un linguista')));
  assert.match(p, /Interlingua \(ia\)/);
  assert.match(p, /stessa forma per tutte le persone/);
  assert.match(p, /"paga"/);
});
