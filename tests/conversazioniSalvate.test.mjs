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
globalThis.salvaMemoriaIA = salvaMemoriaIA; globalThis.istruzioniMemoria = istruzioniMemoria; globalThis.passaFiltroConversazione = passaFiltroConversazione; globalThis.dataLocale = dataLocale;`, ctx);
const j = x => JSON.parse(JSON.stringify(x));
const conv = (id, data, lingua, tema, testi) => ({ id, data, lingua, linguaNome: lingua.toUpperCase(), tema, turni: testi.map((t, i) => ({ ruolo: i % 2 ? 'utente' : 'ia', testo: t })) });

test('salva e aggiorna per id; le più recenti per prime; al massimo 20', () => {
  for (const k of Object.keys(memoria)) delete memoria[k];
  // ordine per ultima attività (review di 8a70166): 'a' ripresa dopo 'b' viene prima
  ctx.salvaConversazione({ ...conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['Salut', 'Bonjour']), aggiornata: '2026-10-01T10:00:00Z' });
  ctx.salvaConversazione({ ...conv('b', '2026-10-02T10:00:00Z', 'sp', '', ['Ciao']), aggiornata: '2026-10-02T10:00:00Z' });
  ctx.salvaConversazione({ ...conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['Salut', 'Bonjour', 'Ça va ?']), aggiornata: '2026-10-03T10:00:00Z' });
  const l = ctx.caricaConversazioni();
  assert.deepStrictEqual(Array.from(l, c => c.id), ['a', 'b']);
  assert.strictEqual(l[0].turni.length, 3, 'aggiornata, non duplicata');
  for (let i = 0; i < 25; i++) { const d = `2026-11-${String(i + 1).padStart(2, '0')}T10:00:00Z`; ctx.salvaConversazione({ ...conv('x' + i, d, 'en', '', ['Hi']), aggiornata: d }); }
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

// Review di 8a70166:
test('ordine e tetto per ultima attività, non per data d\'inizio', () => {
  for (const k of Object.keys(memoria)) delete memoria[k];
  for (let i = 0; i < 20; i++) ctx.salvaConversazione({ ...conv('n' + i, `2026-11-${String(i + 1).padStart(2, '0')}T10:00:00Z`, 'en', '', ['Hi']), aggiornata: `2026-11-${String(i + 1).padStart(2, '0')}T10:00:00Z` });
  // la più vecchia ripresa oggi resta, anche quando ne arriva una nuova
  ctx.salvaConversazione({ ...conv('n0', '2026-11-01T10:00:00Z', 'en', '', ['Hi', 'again']), aggiornata: '2026-12-01T10:00:00Z' });
  ctx.salvaConversazione({ ...conv('nuova', '2026-12-02T10:00:00Z', 'en', '', ['Hi']), aggiornata: '2026-12-02T10:00:00Z' });
  const ids = Array.from(ctx.caricaConversazioni(), c => c.id);
  assert.ok(ids.includes('n0'), 'ripresa = recente');
  assert.ok(!ids.includes('n1'));
});

test('voci rovinate nel browser vengono ignorate', () => {
  memoria.qml_v1_conversazioni = JSON.stringify([{ id: 'ok', data: '2026-10-01', turni: [{ ruolo: 'ia', testo: 'x' }] }, { id: 'rotta' }, null]);
  assert.deepStrictEqual(Array.from(ctx.caricaConversazioni(), c => c.id), ['ok']);
});

test('filtro "Senza tema" anche nell\'esportazione; un solo filtro per lista ed esportazione', () => {
  const lista = [conv('a', '2026-10-01T10:00:00Z', 'fr', 'cibo', ['A']), conv('b', '2026-10-02T10:00:00Z', 'fr', '', ['B'])];
  const t = ctx.testoEsportazioneConversazioni(lista, { tema: '__senza' }, {});
  assert.match(t, /IA: B/);
  assert.doesNotMatch(t, /IA: A/);
  assert.strictEqual(ctx.passaFiltroConversazione(lista[1], { tema: '__senza' }), true);
  const arch = tra('function ArchivioConversazioni(', '\n// ── fine conversazioni salvate');
  assert.match(arch, /passaFiltroConversazione\(c, filtro\)/);
  assert.match(arch, /testoEsportazioneConversazioni\(lista, filtro, TEMI\)/);
});

test('data nel fuso del telefono, non in UTC', () => {
  assert.match(ctx.dataLocale('2026-10-15T10:00:00Z'), /^2026-10-15$/);
});

test('niente archivio né Termina mentre l\'IA sta rispondendo; Termina salva la conversazione giusta', () => {
  const c = tra('function SchermataConversazione(', '\n// Modalità "Lettura guidata"');
  assert.match(c, /const occupata = stato === "generando" \|\| stato === "elaborando";/);
  assert.strictEqual((c.match(/disabled: occupata/g) || []).length, 2, '📜 e Termina');
  assert.match(c, /const fine = \{ \.\.\.convRef\.current \};/);
  assert.match(c, /if \(convRef\.current\.id === fine\.id\) convRef\.current\.tema = r\.tema;/);
  assert.match(c, /onEliminata: id => \{/);
});
