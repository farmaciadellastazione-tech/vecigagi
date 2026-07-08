// Test del recovery mirato di index.html (fix R1, audit 2026-07-08).
// Il vecchio recovery faceva localStorage.clear() cancellando anche le storie
// private (uniche, solo in quel browser), il token GitHub admin e la chiave API.
// Qui estraiamo la funzione REALE resetStorageRecovery dal sorgente e verifichiamo
// che rimuova solo lo stato dell'app e preservi tutto il resto.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const INDEX = fs.readFileSync(ROOT + '/index.html', 'utf8');

// — estrae il sorgente di una funzione per nome (brace matching, come cleanup.test.mjs) —
function extractFn(src, name) {
  const sig = 'function ' + name + '(';
  const at = src.indexOf(sig);
  if (at < 0) throw new Error('funzione non trovata: ' + name);
  let i = src.indexOf('{', at), depth = 0, inStr = false, esc = false, q = null;
  for (; i < src.length; i++) { const c = src[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === q) inStr = false; }
    else if (c === '"' || c === "'" || c === '`') { inStr = true; q = c; }
    else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(at, i);
}

// — estrae una dichiarazione const per nome (fino al `];` o `;` di chiusura) —
function extractConst(src, name) {
  const re = new RegExp('^const ' + name + ' = ', 'm');
  const m = re.exec(src);
  if (!m) throw new Error('costante non trovata: ' + name);
  const end = src.indexOf(';', m.index);
  return src.slice(m.index, end + 1);
}

// Fake localStorage minimale (API usata dal codice: removeItem)
function makeFakeStorage(init) {
  const map = new Map(Object.entries(init));
  return {
    map,
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    clear: () => { throw new Error('clear() non deve più essere usato nel recovery'); },
  };
}

// Chiavi che il recovery DEVE rimuovere (stato app che può impedire il boot)
const DA_RIMUOVERE = {
  qml_v10_vocabolario: '[corrotto',
  qml_v10_stats: '{}',
  qml_v10_lingue: '[]',
  qml_v10_filtri: '{}',
  qml_v10_voc_version: '405',
  qml_v10_record: '{}',
  qml_v10_record_perc: '{}',
  qml_v10_streak: '{}',
  qml_v10_ndom: '{}',
  qml_v11_sm_global: '{}',
};
// Chiavi che il recovery DEVE preservare
const DA_PRESERVARE = {
  qml_v1_storie_private: '[{"id":"privata-x","frasi":[]}]', // testi unici dell'utente
  qml_v1_candidati_lg: '[]',
  qml_v10_ai: '{"provider":"gemini","apiKey":"k"}',
  gh_pat_vecigagi: 'github_pat_xxx',
  lq_tema: 'dark',
  linguaUI: 'it',
  qml_tour_seen: '1',
  chiave_di_altra_pagina: 'non toccare', // edit.html/dialetti.html condividono l'origin
};

function makeCtx() {
  const localStorage = makeFakeStorage({ ...DA_RIMUOVERE, ...DA_PRESERVARE });
  const sandbox = { localStorage, console };
  const ctx = vm.createContext(sandbox);
  // Le costanti SK_* reali del sorgente + la whitelist + la funzione reale
  // (esclusa SK_RESET_RECOVERY, estratta a parte con extractConst)
  const skConsts = INDEX.match(/^const (?:SK|GH)_[A-Z_]+ = .*$/gm)
    .filter(l => !l.startsWith('const SK_RESET_RECOVERY'));
  vm.runInContext(skConsts.join('\n'), ctx);
  vm.runInContext(extractConst(INDEX, 'SK_RESET_RECOVERY'), ctx);
  vm.runInContext(extractFn(INDEX, 'resetStorageRecovery'), ctx);
  return { ctx, localStorage };
}

test('resetStorageRecovery esiste ed è usata al posto di localStorage.clear()', () => {
  assert.ok(INDEX.includes('function resetStorageRecovery('), 'manca resetStorageRecovery in index.html');
  // Nessuna CHIAMATA a localStorage.clear() (i commenti che la citano sono ok).
  // [^\n] e non `.` perché il file è CRLF e `.` non matcha \r.
  const senzaCommenti = INDEX.replace(/\/\/[^\n]*/g, '');
  assert.ok(!senzaCommenti.includes('localStorage.clear()'), 'nessuna chiamata a localStorage.clear() deve restare in index.html');
  // I tre path di recovery devono chiamarla
  const chiamate = (INDEX.match(/resetStorageRecovery\(\);/g) || []).length;
  assert.ok(chiamate >= 3, `attese >=3 chiamate nei path di recovery, trovate ${chiamate}`);
});

test('rimuove lo stato app e preserva storie private, token, chiave API, tema, lingua UI', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('resetStorageRecovery();', ctx);
  for (const k of Object.keys(DA_RIMUOVERE)) {
    assert.equal(localStorage.map.has(k), false, `"${k}" doveva essere rimossa`);
  }
  for (const [k, v] of Object.entries(DA_PRESERVARE)) {
    assert.equal(localStorage.map.get(k), v, `"${k}" doveva essere preservata intatta`);
  }
});

test('è idempotente e non lancia se le chiavi mancano', () => {
  const { ctx, localStorage } = makeCtx();
  vm.runInContext('resetStorageRecovery(); resetStorageRecovery();', ctx);
  assert.equal(localStorage.map.has('qml_v10_stats'), false);
  assert.equal(localStorage.map.get('qml_v1_storie_private'), DA_PRESERVARE.qml_v1_storie_private);
});
