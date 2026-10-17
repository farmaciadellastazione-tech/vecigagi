// Frase libera sulle parole sbagliate, una dopo l'altra (richiesta di Dino,
// 2026-10-17): aperta da "Fai una frase con" nei risultati di un esercizio,
// "Prossima sbagliata → (2 di 5)" e "Salta" passano alla parola sbagliata
// successiva invece che a una a caso; "← Torna ai risultati" ben visibile;
// finite le parole, un messaggio con il ritorno ai risultati.
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
const ctx = vm.createContext({});
vm.runInContext(tra('function codaFraseDaErrate(', '\n// ── fine coda frase') + '\nglobalThis.coda = codaFraseDaErrate;', ctx);

const fr = { codice: 'fr', nome: 'Francese' };
const it = { codice: 'it', nome: 'Italiano' };
const e1 = { it: 'casa', fr: 'maison' }, e2 = { it: 'gatto', fr: 'chat' }, e3 = { it: 'cane', fr: 'chien' };

test('in coda solo le parole su cui si può fare una frase, come il pulsante dei risultati', () => {
  const errate = [
    { carta: { entry: e1, tipo: 'normale' }, lA: fr },
    { carta: { entry: e2, tipo: 'coniugazione' }, lA: fr },
    { carta: { entry: e3, tipo: 'normale' }, lA: it },
    { carta: { entry: e2, tipo: 'normale' }, lA: fr },
  ];
  const c = ctx.coda(errate);
  assert.strictEqual(c.length, 2);
  assert.strictEqual(c[0].entry, e1);
  assert.strictEqual(c[1].entry, e2);
  assert.strictEqual(c[1].lingua, fr);
});

test('App: la coda parte dalla parola scelta, solo se si arriva da un esercizio con i risultati', () => {
  const app = tra('  function apriFraseLiberaCon(', '\n  function apriConversazioneCon(');
  assert.match(app, /codaFraseDaErrate\(carteErrate\)/);
  assert.match(app, /schermata === "quiz"/);
  assert.match(HTML, /coda: fraseCoda,/);
});

test('Frase libera: Prossima sbagliata, Salta sulla coda, ritorno ai risultati, fine coda', () => {
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  assert.match(fl, /function prossima\(\)/);
  assert.match(fl, /Prossima sbagliata/);
  assert.match(fl, /Torna ai risultati/);
  assert.match(fl, /Hai praticato tutte le parole sbagliate/);
  assert.doesNotMatch(fl, /onClick: nuovaCarta,/, 'Salta e Nuova passano da prossima()');
});

// Review di 572e1df:
test('stessa parola e stessa lingua una volta sola', () => {
  const errate = [
    { carta: { entry: e1, tipo: 'normale' }, lA: fr },
    { carta: { entry: e1, tipo: 'normale' }, lA: { codice: 'fr', nome: 'Francese' } },
  ];
  assert.strictEqual(ctx.coda(errate).length, 1);
});

test('Frase libera dal menu non eredita la lista di un esercizio precedente', () => {
  const ramo = tra('if (mod === "fraseLibera") {', '\n      return;');
  assert.match(ramo, /setFraseCoda\(null\);/);
});

test('una correzione in arrivo dopo Salta non finisce sulla parola nuova', () => {
  const fl = tra('function SchermataFraseLibera(', '\n// Modalità "Conversazione"');
  assert.match(fl, /const richiestaFrase = useRef\(0\);/);
  assert.ok((fl.match(/if \(n !== richiestaFrase\.current\) return;/g) || []).length >= 2, 'verifica e traduci');
});
