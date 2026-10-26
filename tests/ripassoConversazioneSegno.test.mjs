// Ripasso frasi, passo 2 (2026-10-26): in Conversazione "✏️ Correggi" (solo
// dialetti) sostituiva il testo senza lasciare traccia. Per il ripasso serve
// sapere quali frasi dialettali sono state controllate da una persona: la
// battuta dell'IA corretta prende `corretta: true`, la correzione dell'IA a
// una frase dello studente, se sistemata a mano, `correzioneCorretta: true`.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');
const tra = (a, b) => { const i = HTML.indexOf(a); if (i < 0) throw new Error(a); return HTML.slice(i, HTML.indexOf(b, i)); };
const CONV = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');

test('battuta dell\'IA corretta a mano: testo nuovo e segno corretta', () => {
  assert.match(CONV, /\{ \.\.\.x, testo: nuovo, corretta: true \}/);
});

test('correzione dell\'IA sistemata a mano: segno correzioneCorretta', () => {
  assert.match(CONV, /\{ \.\.\.x, correzione: nuovo, correzioneCorretta: true \}/);
});

test('nessuna correzione rimasta senza segno', () => {
  assert.doesNotMatch(CONV, /\{ \.\.\.x, testo: nuovo \}/);
  assert.doesNotMatch(CONV, /\{ \.\.\.x, correzione: nuovo \}/);
});
