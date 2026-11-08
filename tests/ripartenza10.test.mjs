// Ripartenza da 10 domande (richiesta di Dino, 2026-11-08): arrivare a 20
// domande richiede troppo tempo e la revisione degli errori è fondamentale.
// Sopra 10 domande, con meno del 90% di risposte giuste si torna SUBITO a 10
// (non più un passo indietro). Fino a 10 domande resta la regola di
// sogliaRetrocessione (sotto il 50% → un passo indietro, minimo 5).
// Vale per Quiz/Allenamento/Ascolto/Voce/Dettato, anche abbandonando a metà
// (con almeno 3 risposte). Scelta multipla ESCLUSA: resta come prima.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

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
function costante(nome) {
  const m = INDEX.match(new RegExp('const ' + nome + ' = [^;]+;'));
  if (!m) throw new Error('costante non trovata: ' + nome);
  return m[0];
}

test('ripartiDa10: sopra 10 domande e sotto il 90% → true', () => {
  const codice = [costante('NDOM_RIPARTENZA'), costante('SOGLIA_RIPARTENZA'), fn(INDEX, 'ripartiDa10')].join('\n');
  const ripartiDa10 = new Function(codice + '; return ripartiDa10;')();
  assert.strictEqual(ripartiDa10(20, 85), true);   // 17/20
  assert.strictEqual(ripartiDa10(20, 89), true);
  assert.strictEqual(ripartiDa10(11, 50), true);
  assert.strictEqual(ripartiDa10(20, 90), false);  // 18/20: resta
  assert.strictEqual(ripartiDa10(20, 95), false);
  assert.strictEqual(ripartiDa10(10, 30), false);  // ≤10: vale la regola vecchia
  assert.strictEqual(ripartiDa10(8, 60), false);
});

test('Quiz: fine sessione, badge "Ancora" e ← Home usano ripartiDa10', () => {
  const fine = INDEX.slice(INDEX.indexOf('// Progressione N. domande (adattiva'), INDEX.indexOf('saveJSON(SK_NDOM, { ...ndomMem, [modalita]: nDomProssimo })'));
  assert.match(fine, /ripartiDa10\(nDomandeUsate, percFin\) \? NDOM_RIPARTENZA/);
  const badge = INDEX.slice(INDEX.indexOf('const stepPross ='), INDEX.indexOf('return nDomandeUsate;', INDEX.indexOf('const stepPross =')));
  assert.match(badge, /ripartiDa10\(nDomandeUsate, perc\)\) return NDOM_RIPARTENZA/);
  const quizHome = INDEX.slice(INDEX.indexOf('React.createElement(SchermataQuiz, {'));
  const onHome = quizHome.slice(quizHome.indexOf('onHome:'), quizHome.indexOf('nuoveApprese:'));
  assert.match(onHome, /risposte >= 3 && ripartiDa10\(/);
});

test('Scelta multipla esclusa: non usa ripartiDa10', () => {
  assert.doesNotMatch(fn(INDEX, 'prossimoStatoSM'), /ripartiDa10/);
  assert.doesNotMatch(fn(INDEX, 'SchermataSceltaMultipla'), /ripartiDa10/);
});
