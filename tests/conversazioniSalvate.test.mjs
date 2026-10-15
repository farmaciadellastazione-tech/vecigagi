// Conversazioni memorizzate (richiesta di Dino, 2026-10-15): 1) salvate da sole
// nel browser e rileggibili; 2) riprendibili da dove si era rimasti; 3) l'IA
// ricorda lo studente tra una conversazione e l'altra (promemoria breve, visibile
// e cancellabile); più esportazione divisa per lingua e per tema.
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
const memoria = {};
const ctx = vm.createContext({
  localStorage: { getItem: k => (k in memoria ? memoria[k] : null), setItem: (k, v) => { memoria[k] = String(v); }, removeItem: k => { delete memoria[k]; } },
});
vm.runInContext(tra('// ── Conversazioni salvate', '\n// ── fine conversazioni salvate') + `
globalThis.salvaConversazione = salvaConversazione; globalThis.caricaConversazioni = caricaConversazioni;
globalThis.eliminaConversazione = eliminaConversazione; globalThis.testoEsportazioneConversazioni = testoEsportazioneConversazioni;
globalThis.estraiFineConversazione = estraiFineConversazione; globalThis.caricaMemoriaIA = caricaMemoriaIA;
globalThis.salvaMemoriaIA = salvaMemoriaIA; globalThis.istruzioniMemoria = istruzioniMemoria;`, ctx);
const j = x => JSON.parse(JSON.stringify(x));
const conv = (id, data, lingua, tema, testi) => ({ id, data, lingua, linguaNome: lingua.toUpperCase(), tema, turni: testi.map((t, i) => ({ ruolo: i % 2 ? 'utente' : 'ia', testo: t })) });

test('salva e aggiorna per id; le più recenti per prime; al massimo 20', () => {
  for (const k of Object.keys(memoria)) delete memoria[k];
  ctx.salvaConversazione(conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['Salut', 'Bonjour']));
  ctx.salvaConversazione(conv('b', '2026-10-02T10:00:00Z', 'sp', '', ['Ciao']));
  ctx.salvaConversazione(conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['Salut', 'Bonjour', 'Ça va ?']));
  const l = ctx.caricaConversazioni();
  assert.deepStrictEqual(Array.from(l, c => c.id), ['b', 'a']);
  assert.strictEqual(l[1].turni.length, 3, 'aggiornata, non duplicata');
  for (let i = 0; i < 25; i++) ctx.salvaConversazione(conv('x' + i, `2026-11-${String(i + 1).padStart(2, '0')}T10:00:00Z`, 'en', '', ['Hi']));
  const l2 = ctx.caricaConversazioni();
  assert.strictEqual(l2.length, 20);
  assert.strictEqual(l2[0].id, 'x24');
});

test('conversazione vuota non si salva; si possono eliminare', () => {
  for (const k of Object.keys(memoria)) delete memoria[k];
  ctx.salvaConversazione(conv('v', '2026-10-01T10:00:00Z', 'fr', '', []));
  assert.strictEqual(ctx.caricaConversazioni().length, 0);
  ctx.salvaConversazione(conv('a', '2026-10-01T10:00:00Z', 'fr', '', ['Salut']));
  ctx.eliminaConversazione('a');
  assert.strictEqual(ctx.caricaConversazioni().length, 0);
});

test('esportazione divisa per lingua e per tema, con filtri', () => {
  const lista = [
    conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['Tu manges ?', 'Oui']),
    conv('b', '2026-10-02T10:00:00Z', 'fr', 'viaggi', ['Tu voyages ?']),
    conv('c', '2026-10-03T10:00:00Z', 'sp', 'cibo', ['Ti mangi?']),
  ];
  const TEMI = { cibo: { label: 'Cibo', emoji: '🍝' }, viaggi: { label: 'Viaggi', emoji: '✈️' } };
  const tutto = ctx.testoEsportazioneConversazioni(lista, {}, TEMI);
  assert.ok(tutto.indexOf('# FR') < tutto.indexOf('# SP'));
  assert.ok(tutto.indexOf('## 🍝 Cibo') < tutto.indexOf('## ✈️ Viaggi'));
  assert.match(tutto, /IA: Tu manges \?\nIo: Oui/);
  const soloCibo = ctx.testoEsportazioneConversazioni(lista, { tema: 'cibo' }, TEMI);
  assert.doesNotMatch(soloCibo, /voyages/);
  assert.match(soloCibo, /Ti mangi\?/);
  const soloSp = ctx.testoEsportazioneConversazioni(lista, { lingua: 'sp' }, TEMI);
  assert.doesNotMatch(soloSp, /# FR/);
});

test('fine conversazione: promemoria e tema dalla risposta dell\'IA', () => {
  assert.deepStrictEqual(j(ctx.estraiFineConversazione('```json\n{"memo":"Abita alla Spezia, ha un cane.","tema":"animali"}\n```', ['animali', 'cibo'])),
    { memo: 'Abita alla Spezia, ha un cane.', tema: 'animali' });
  assert.strictEqual(ctx.estraiFineConversazione('{"memo":"x","tema":"inventato"}', ['cibo']).tema, '', 'solo temi esistenti');
  assert.strictEqual(ctx.estraiFineConversazione('boh', ['cibo']), null);
});

test('promemoria dell\'IA: salvato corto, mandato nei prompt, cancellabile', () => {
  for (const k of Object.keys(memoria)) delete memoria[k];
  assert.strictEqual(ctx.istruzioniMemoria(), '');
  ctx.salvaMemoriaIA('x'.repeat(900));
  assert.strictEqual(ctx.caricaMemoriaIA().length, 600);
  ctx.salvaMemoriaIA('Ha un cane di nome Fido.');
  assert.match(ctx.istruzioniMemoria(), /Ha un cane di nome Fido\./);
  ctx.salvaMemoriaIA('');
  assert.strictEqual(ctx.caricaMemoriaIA(), '');
});

test('la Conversazione salva, riprende, usa la memoria e si chiude con il promemoria', () => {
  const c = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(c, /salvaConversazione\(\{/);
  assert.match(c, /istruzioniMemoria\(\)/);
  assert.match(c, /chiudiConversazioneIA\(/);
  assert.match(c, /React\.createElement\(ArchivioConversazioni, \{/);
  assert.match(c, /onContinua: /);
  assert.match(HTML, /tema: carta\.entry\.tema/, 'il tema arriva da Frase libera');
});
