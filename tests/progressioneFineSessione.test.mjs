// Due regressioni trovate in review (2026-09-28) sulla progressione n. domande:
// 1) Quiz/Allenamento: a fine sessione avanti() sommava di nuovo l'ultima
//    risposta giusta (verificaRisposta l'aveva già contata in punteggio):
//    15 giuste + 4 sbagliate = 79% a schermo ("15 → 14 ⬇"), ma salvato 80%
//    (nessuna retrocessione). Con la soglia 80% succede in sessioni normali.
// 2) Scelta multipla: a 12 scelte e 50 domande un 100% resetta a 10 domande
//    senza aumentare le scelte: la scritta diceva "⬇️ -5 dom" dopo un 100%.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('fine sessione: percentuale e streak non contano due volte l\'ultima risposta', () => {
  const a = INDEX.indexOf('function avanti() {\n    const ok = stato === "corretto";');
  assert.ok(a > 0, 'avanti() di App non trovata');
  const fine = INDEX.slice(a, INDEX.indexOf('saveJSON(SK_NDOM, { ...ndomMem, [modalita]: nDomProssimo })', a));
  assert.doesNotMatch(fine, /punteggio\.giusti \+ \(ok \? 1 : 0\)/,
    'punteggio include già l\'ultima risposta (aggiornato in verificaRisposta)');
});

test('Scelta multipla: dopo un 100% a 50 domande la scritta è il reset, non "-5 dom"', () => {
  const badge = INDEX.slice(INDEX.indexOf('"🎉 +2 scelte, reset a 10 dom"') - 250, INDEX.indexOf('"🎉 +2 scelte, reset a 10 dom"'));
  assert.match(badge, /perc === 100 && stSess\.nDom >= 50/);
});
