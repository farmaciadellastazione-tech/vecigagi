// Ripasso frasi (Dino, 2026-10-27): in Conversazione l'IA corregge a schermo
// solo gli errori importanti, ma il ripasso vuole frasi esatte. L'IA restituisce
// quindi anche "clean": la frase dello studente con TUTTI gli errori corretti
// (identica se perfetta). Non si vede in Conversazione: si salva nel turno come
// `pulita` e la usa solo il ripasso. Solo lingue normali: nei dialetti non si
// chiede (il ripasso dialettale usa solo testi corretti a mano).
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
const CONV = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
const ctx = vm.createContext({});
vm.runInContext([
  tra('function estraiCampoStringaJSON(', '\n}') + '\n}',
  tra('function estraiRispostaConversazione(', '\n}') + '\n}',
  'globalThis.estrai = estraiRispostaConversazione;',
].join('\n'), ctx);

test('la versione pulita si legge dal JSON', () => {
  const r = ctx.estrai('{"reply":"Nice!","correction":"","note":"","clean":"I am going home."}');
  assert.equal(r.clean, 'I am going home.');
  assert.equal(r.reply, 'Nice!');
});

// Seconda code review (2026-10-27): da un JSON rotto i campi recuperati possono
// essere monchi ("I went to the sto"): la frase pulita non si prende e la
// risposta è segnata tollerante (la battuta dell'IA diventa `parziale`).
test('da un JSON rotto niente frase pulita, risposta segnata tollerante', () => {
  const r = ctx.estrai('{"reply":"Nice!","correction":"","note":"","clean":"I am going ho');
  assert.equal(r.clean, '');
  assert.equal(r.tollerante, true);
  assert.equal(r.reply, 'Nice!');
  assert.ok(!ctx.estrai('{"reply":"Nice!","correction":"","note":"","clean":"Ok."}').tollerante);
});

test('la battuta dell\'IA da risposta tollerante si salva come parziale', () => {
  assert.match(CONV, /if \(reply\) next\.push\(\{ ruolo: "ia", testo: reply, \.\.\.\(tollerante \? \{ parziale: true \} : \{\}\) \}\);/);
});

test('il prompt chiede "clean" solo fuori dai dialetti', () => {
  assert.match(CONV, /const richiestaPulita = dialetto \? "" :/);
  assert.match(CONV, /"clean"/);
});

test('il turno dello studente salva la versione pulita', () => {
  // `clean` in inviaTurno è il testo grezzo dell'IA: il campo nuovo si chiama pulitaIA
  assert.match(CONV, /clean: pulitaIA, tollerante \} = estraiRispostaConversazione\(clean\)/);
  assert.match(CONV, /correzione: correction \|\| null, nota: note \|\| null, pulita: dialetto \? null : pulitaIA \|\| null/);
});
