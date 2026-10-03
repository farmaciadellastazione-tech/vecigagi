// Review 2026-10-03: in modalità voce InputVocale sceglie la trascrizione da
// inviare confrontandola con l'atteso originale, senza le varianti dialettali
// (forma nuda, senza soggetto/"che") che verificaRisposta poi accetta. Se il
// riconoscimento mette "o l'amma" come seconda alternativa, veniva inviata la
// prima (sbagliata). Ora InputVocale riceve le stesse varianti.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const HTML = fs.readFileSync(ROOT + '/index.html', 'utf8');

test('InputVocale riceve l\'atteso con le varianti dialettali delle coniugazioni', () => {
  const uso = HTML.slice(HTML.indexOf('React.createElement(InputVocale, {'), HTML.indexOf('onVerifica: onVerifica', HTML.indexOf('React.createElement(InputVocale, {')));
  assert.match(uso, /atteso: attesoVoce,/);
  const a = HTML.indexOf('const attesoVoce =');
  assert.ok(a > 0, 'attesoVoce non definito');
  // \r?\n: con core.autocrlf=true i file locali hanno a capo Windows
  const fine = HTML.slice(a).search(/;\r?\n/);
  const def = HTML.slice(a, a + fine + 1);
  assert.match(def, /variantiBaseDialetto\(attesoCorrente\)/);
  assert.match(def, /variantiSenzaSoggettoDialetto\(attesoCorrente\)/);
  assert.match(def, /DIALETTI_TTS_ITA\.includes\(lA\?\.codice\)/);
});
