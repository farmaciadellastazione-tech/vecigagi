// Review di 9bc5016: con la casella "oppure scrivi", si può rispondere per
// iscritto mentre il microfono è ancora in ascolto. Il riconoscimento non si
// fermava quando la schermata spariva e il suo risultato tardivo chiamava di
// nuovo verificaRisposta (stats e punteggio contati due volte, esito ribaltato,
// o persino sulla carta successiva). Ora:
// 1) useSpeechRecognition interrompe il riconoscimento allo smontaggio;
// 2) verificaRisposta ignora le risposte che arrivano fuori dallo stato "domanda".
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('useSpeechRecognition ferma il riconoscimento quando la schermata sparisce', () => {
  const h = HTML.slice(HTML.indexOf('function useSpeechRecognition('), HTML.indexOf('// ── Componenti base'));
  assert.match(h, /useEffect\(\(\) => \(\) => \{[\s\S]*?srRef\.current[\s\S]*?onresult = null[\s\S]*?abort/);
});

test('verificaRisposta ignora le risposte fuori dallo stato "domanda"', () => {
  const v = HTML.slice(HTML.indexOf('function verificaRisposta('), HTML.indexOf('function salta()'));
  assert.match(v.slice(0, 300), /if \(statoRef\.current !== "domanda"\) return;/);
  assert.match(HTML, /const statoRef = useRef\(stato\);\s*statoRef\.current = stato;/);
});
