// Livello CEFR delle coniugazioni per tempo (tabella approvata da Dino,
// 2026-10-03). Prima le coniugazioni non avevano livello: peso 0 (prima di
// ogni A1), ignorate dal filtro per livello e mai bloccate dalla soglia
// adattiva, quindi il condizionale arrivava ai principianti col presente.
//   presente A1 · imperfetto/futuro/passato/imperativo A2 ·
//   congiuntivo/condizionale B1 · congiuntivo imperfetto B2
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };

const LIVELLO_TEMPO = new Function(tra('const LIVELLO_TEMPO = {', '\n};') + '\n}; return LIVELLO_TEMPO;')();
const pesoCEFRCarta = new Function(tra('const PESO_CEFR = {', '\n// ── Traduzione interfaccia') + '; return pesoCEFRCarta;')();

test('tabella dei livelli per tempo', () => {
  assert.deepStrictEqual(LIVELLO_TEMPO, {
    presente: 'A1', imperfetto: 'A2', futuro: 'A2', passato: 'A2', imperativo: 'A2',
    congiuntivo: 'B1', condizionale: 'B1', congiuntivoImperfetto: 'B2',
  });
});

test('ogni tempo nei dati ha un livello', () => {
  const C = new Function(tra('const CONIUGAZIONI = {', '\n// Genera esercizi dal database coniugazioni') + ';return CONIUGAZIONI')();
  for (const v of Object.values(C)) for (const t of Object.keys(v.tempi)) assert.ok(LIVELLO_TEMPO[t], 'manca il livello per ' + t);
});

test('peso per l\'ordine: dal livello del tempo', () => {
  assert.strictEqual(pesoCEFRCarta({ tipo: 'coniugazione', livello: 'A1', entry: {} }), 0);
  assert.strictEqual(pesoCEFRCarta({ tipo: 'coniugazione', livello: 'B1', entry: {} }), 2);
  assert.strictEqual(pesoCEFRCarta({ tipo: 'coniugazione', livello: 'B2', entry: {} }), 3);
});

test('le carte di coniugazione portano il livello del tempo', () => {
  const g = tra('function generaEserciziConiugazioni(', '\n// ── Schermata Verbi');
  assert.match(g, /livello: LIVELLO_TEMPO\[tempoKey\] \|\| "B1"/);
});

test('estraiCarte: filtro per livello e soglia adattiva anche per le coniugazioni', () => {
  const e = tra('// ── Esercizi coniugazione', '// ── Ordinamento intelligente');
  assert.match(e, /filtri\.livelli\.length > 0 && !filtri\.livelli\.includes\(ez\.livello\)/);
  assert.match(e, /cefrOrdine\.indexOf\(ez\.livello\) <= cefrIdx/);
});
