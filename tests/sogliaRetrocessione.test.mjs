// Progressione del numero di domande (richiesta di Dino, 2026-09-28): per non
// allungare troppo gli esercizi, più domande = soglia più alta per restare.
//   fino a 10 domande → si scende sotto il 50% (come prima)
//   da 11 a 20        → sotto l'80%
//   oltre 20          → sotto il 90%
// Vale per Quiz/Allenamento/Ascolto/Voce/Dettato e per Scelta multipla.
// Abbandonando a metà (← Home prima della fine) si valuta sulle risposte date:
// almeno 3 risposte, solo retrocessione (mai promozione: non è finito).
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// Estrae "function nome(...) {...}" (i corpi qui non hanno stringhe con graffe)
function fn(src, nome) {
  const a = src.indexOf('function ' + nome + '(');
  if (a < 0) throw new Error('funzione non trovata: ' + nome);
  let d = 0, i = src.indexOf('{', src.indexOf(')', a));
  for (; i < src.length; i++) {
    if (src[i] === '{') d++;
    else if (src[i] === '}') { d--; if (d === 0) break; }
  }
  return src.slice(a, i + 1);
}
const codice = ['sogliaRetrocessione', 'nDomDopoAbbandono', 'prossimoStatoSM'].map(n => fn(INDEX, n)).join('\n');
const { sogliaRetrocessione, nDomDopoAbbandono, prossimoStatoSM } =
  new Function(codice + '; return { sogliaRetrocessione, nDomDopoAbbandono, prossimoStatoSM };')();

test('sogliaRetrocessione: 50% fino a 10, 80% da 11 a 20, 90% oltre 20', () => {
  for (const n of [1, 5, 10]) assert.strictEqual(sogliaRetrocessione(n), 50, 'n=' + n);
  for (const n of [11, 15, 20]) assert.strictEqual(sogliaRetrocessione(n), 80, 'n=' + n);
  for (const n of [21, 25, 50]) assert.strictEqual(sogliaRetrocessione(n), 90, 'n=' + n);
});

test('Quiz: fine sessione e badge "Ancora" usano sogliaRetrocessione, non più il 50% fisso', () => {
  const fine = INDEX.slice(INDEX.indexOf('// Progressione N. domande (adattiva'), INDEX.indexOf('saveJSON(SK_NDOM, { ...ndomMem, [modalita]: nDomProssimo })'));
  assert.match(fine, /percFin < sogliaRetrocessione\(nDomandeUsate\)/);
  assert.doesNotMatch(fine, /percFin < 50/);
  const badge = INDEX.slice(INDEX.indexOf('const stepPross ='), INDEX.indexOf('return nDomandeUsate;', INDEX.indexOf('const stepPross =')));
  assert.match(badge, /perc < sogliaRetrocessione\(nDomandeUsate\)/);
  assert.doesNotMatch(badge, /perc < 50/);
});

test('Scelta multipla: prossimoStatoSM applica le nuove soglie (passo 5, minimo 10)', () => {
  const st = (nDom, nScelte = 5) => ({ nScelte, nDom, corrette: 0 });
  assert.strictEqual(prossimoStatoSM(st(10), 40).nDom, 10);   // <50% ma già al minimo
  assert.strictEqual(prossimoStatoSM(st(10), 60).nDom, 10);   // 10 dom: soglia 50%
  assert.strictEqual(prossimoStatoSM(st(15), 73).nDom, 10);   // 15 dom: <80% → giù
  assert.strictEqual(prossimoStatoSM(st(15), 87).nDom, 15);   // resta
  assert.strictEqual(prossimoStatoSM(st(25), 88).nDom, 20);   // 25 dom: <90% → giù
  assert.strictEqual(prossimoStatoSM(st(25), 92).nDom, 25);   // resta
  assert.strictEqual(prossimoStatoSM(st(20), 100).nDom, 25);  // 100% → su
  assert.deepStrictEqual(prossimoStatoSM(st(50), 100), { nScelte: 7, nDom: 10, corrette: 0 });
});

test('Scelta multipla: la progressione parte dallo stato della sessione, non da quello già aggiornato', () => {
  // L'effetto di fine sessione fa setStato(nuovoStato): se l'anteprima
  // "Prossimo: ... dom" ricalcolasse da `stato`, conterebbe il passo due volte.
  const calc = fn(INDEX, 'calcolaProssimoStato');
  assert.match(calc, /prossimoStatoSM\(statoSessioneRef\.current/);
  const badge = INDEX.slice(INDEX.indexOf('"⬆️ +5 dom al prossimo giro"') - 200, INDEX.indexOf('"➡️ Stesso livello"'));
  assert.doesNotMatch(badge, /perc < 50/);
  assert.doesNotMatch(badge, /stato\.nDom >= 50/);
});

test('nDomDopoAbbandono: almeno 3 risposte, solo retrocessione, rispetta il minimo', () => {
  // (nDom, giusti, risposte, passo, minimo)
  assert.strictEqual(nDomDopoAbbandono(20, 1, 2, 1, 5), 20);   // < 3 risposte: niente
  assert.strictEqual(nDomDopoAbbandono(20, 7, 10, 1, 5), 19);  // 70% < 80% → -1
  assert.strictEqual(nDomDopoAbbandono(20, 9, 10, 1, 5), 20);  // 90% ≥ 80% → resta
  assert.strictEqual(nDomDopoAbbandono(20, 12, 12, 1, 5), 20); // 100%: mai promozione
  assert.strictEqual(nDomDopoAbbandono(15, 2, 5, 5, 5), 10);   // Quiz: passo 5
  assert.strictEqual(nDomDopoAbbandono(10, 0, 5, 5, 10), 10);  // SM: minimo 10
  assert.strictEqual(nDomDopoAbbandono(8, 1, 4, 1, 5), 7);     // ≤10: soglia 50%, 25% → -1
});

test('abbandono a metà: Quiz e Scelta multipla applicano nDomDopoAbbandono su ← Home', () => {
  const quizHome = INDEX.slice(INDEX.indexOf('React.createElement(SchermataQuiz, {'));
  const onHome = quizHome.slice(quizHome.indexOf('onHome:'), quizHome.indexOf('nuoveApprese:'));
  assert.match(onHome, /nDomDopoAbbandono\(/);
  assert.match(onHome, /!fine/);
  const sm = fn(INDEX, 'SchermataSceltaMultipla');
  assert.match(sm, /function esciAMeta\(\)[\s\S]*nDomDopoAbbandono\(/);
  assert.match(sm, /onClick: esciAMeta/);
});
