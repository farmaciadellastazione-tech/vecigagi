// "🤖 Spiega" dopo una risposta sbagliata (richiesta di Dino, 2026-10-25):
// dopo la spiegazione si possono fare domande all'IA; il **grassetto**
// Markdown che l'IA usa comunque si vede in grassetto, non con gli asterischi.
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

// React finto: createElement restituisce un oggetto leggibile.
const ctx = vm.createContext({ React: { createElement: (tipo, props, ...figli) => ({ tipo, figli }) } });
vm.runInContext(tra('function conGrassetto(', '\nfunction SpiegaAI(') + '\nglobalThis.g = conGrassetto;', ctx);
const testo = parti => parti.map(p => typeof p === 'string' ? p : `<${p.tipo}>${p.figli.join('')}</${p.tipo}>`).join('');

test('**parola** diventa grassetto vero, senza asterischi', () => {
  assert.strictEqual(testo(ctx.g('In portoghese **“mulher”** indica una donna.')), 'In portoghese <strong>“mulher”</strong> indica una donna.');
  assert.strictEqual(testo(ctx.g('**a** e **b**')), '<strong>a</strong> e <strong>b</strong>');
});

test('asterischi spaiati tolti, testo senza Markdown invariato, vuoto innocuo', () => {
  assert.strictEqual(testo(ctx.g('troncato **qui')), 'troncato qui');
  assert.strictEqual(testo(ctx.g('3 * 4 = 12')), '3 * 4 = 12');
  assert.strictEqual(testo(ctx.g(null)), '');
});

test('SpiegaAI: domande dopo la spiegazione, testo semplice, azzerate cambiando carta', () => {
  const s = tra('function SpiegaAI(', '\n// Scelta multipla');
  assert.match(s, /async function chiedi\(\)/);
  assert.match(s, /Fai una domanda/);
  assert.strictEqual((s.match(/no Markdown/g) || []).length, 2, 'spiegazione e domande chiedono testo semplice');
  assert.match(s, /conGrassetto\(stato === "traduzione" \? traduzione : testo\)/);
  assert.match(s, /conGrassetto\(x\.r\)/);
  assert.match(s, /\}, \[carta\]\);/);
});
