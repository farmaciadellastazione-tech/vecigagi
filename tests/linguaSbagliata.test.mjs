// Risposta giusta ma nella lingua sbagliata (richiesta di Dino, 2026-10-25):
// si segnala la lingua usata e si riprova sulla stessa carta, senza togliere
// punti, senza statistiche e senza finire tra le sbagliate.
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

// isCorretta finta: confronto esatto senza maiuscole; registra le chiamate.
const chiamate = [];
const ctx = vm.createContext({
  isCorretta: (atteso, risposta, bcp47, cod, preciso) => {
    chiamate.push({ cod, preciso });
    return String(atteso).toLowerCase() === String(risposta).trim().toLowerCase();
  }
});
vm.runInContext(tra('function linguaDellaRisposta(', '\n// ── fine lingua della risposta') + '\nglobalThis.f = linguaDellaRisposta;', ctx);

const it = { codice: 'it', nome: 'Italiano' }, fr = { codice: 'fr', nome: 'Francese' };
const es = { codice: 'es', nome: 'Spagnolo' }, de = { codice: 'de', nome: 'Tedesco' };
const lingue = [it, fr, es, de];
const casa = { it: 'casa', fr: 'maison', es: 'casa', de: 'Haus' };
const cane = { it: 'cane', fr: 'chien', es: 'perro', de: 'Hund' };

test('giusta in un\'altra lingua: restituisce quella lingua', () => {
  assert.strictEqual(ctx.f(cane, 'perro', lingue, 'fr', 'it', false), es);
  assert.strictEqual(ctx.f(cane, 'hund', lingue, 'fr', 'it', false), de);
});

test('ricopiare la parola della domanda non conta come altra lingua', () => {
  assert.strictEqual(ctx.f(cane, 'cane', lingue, 'fr', 'it', false), null);
  // "casa" è anche spagnolo, ma è la parola della domanda ricopiata: errore
  // normale, altrimenti ricopiare eviterebbe sempre il ❌
  assert.strictEqual(ctx.f(casa, 'casa', lingue, 'de', 'it', false), null);
  assert.strictEqual(ctx.f(casa, 'maison', lingue, 'de', 'it', false), fr);
});

test('nessuna lingua: null; risposta vuota o voce assente: null', () => {
  assert.strictEqual(ctx.f(cane, 'gatto', lingue, 'fr', 'it', false), null);
  assert.strictEqual(ctx.f(cane, '  ', lingue, 'fr', 'it', false), null);
  assert.strictEqual(ctx.f(null, 'perro', lingue, 'fr', 'it', false), null);
  assert.strictEqual(ctx.f({ it: 'cane', fr: 'chien' }, 'perro', lingue, 'fr', 'it', false), null);
});

test('il controllo preciso delle coniugazioni passa a isCorretta', () => {
  chiamate.length = 0;
  ctx.f(cane, 'perro', lingue, 'fr', 'it', true);
  assert.ok(chiamate.length && chiamate.every(c => c.preciso === true));
  assert.ok(!chiamate.some(c => c.cod === 'fr'), 'non confronta con la lingua richiesta');
});

test('verificaRisposta: niente punti, statistiche o sbagliate; escluso Pronuncia', () => {
  const v = tra('  function verificaRisposta(', '  function nonLoSo()');
  const i = v.indexOf('linguaDellaRisposta(');
  assert.ok(i > 0, 'il controllo è in verificaRisposta');
  assert.ok(i < v.indexOf('aggiornaStatsCoppia('), 'prima delle statistiche');
  assert.ok(i < v.indexOf('quasiGiusta('), 'prima dell\'aiutino');
  const blocco = v.slice(v.lastIndexOf('\n', i - 200), v.indexOf('return;', i) + 7);
  assert.match(blocco, /setLinguaSbagliata\(altra\)/);
  assert.match(blocco, /setInput\(""\)/);
  assert.match(blocco, /!== "pronuncia"/);
  assert.doesNotMatch(blocco, /setPunteggio|setCarteErrate|setStats|setStato/);
});

test('riquadro visibile e azzerato a ogni carta nuova', () => {
  assert.match(HTML, /linguaSbagliata && \/\*#__PURE__\*\/React\.createElement\("div"/);
  assert.match(HTML, /t\.linguasbagliata/);
  assert.match(HTML, /t\.riprovain/);
  assert.match(HTML, /linguaSbagliata: linguaSbagliata,/);
  const azzera = (HTML.match(/setAiutino\(null\);\s*setLinguaSbagliata\(null\);/g) || []).length;
  assert.strictEqual(azzera, (HTML.match(/setAiutino\(null\);/g) || []).length, 'dove si azzera l\'aiutino si azzera anche la lingua sbagliata');
});
