#!/usr/bin/env node
// Bonifica dei doppioni "col punto": voci il cui `it` coincide con un'altra a
// meno di punto/puntini finali (es. "carota" vs "carota."), creati dalle
// promozioni di candidati importati da dizionario (glosse che finiscono col
// punto) prima della normalizzazione della chiave-voce (2026-07-12).
//
//   node tools/merge_doppioni_punto.mjs           # dry-run (report)
//   node tools/merge_doppioni_punto.mjs --apply   # scrive index.html e dialetti.html
//
// Regola di merge per gruppo (target = la voce con l'`it` pulito/più corto):
//   - campi DATI (tema, livello, lingue): copiati se il target è vuoto; se
//     entrambi pieni e DIVERSI → CONFLITTO, gruppo saltato e segnalato (si
//     gestisce a mano da edit.html).
//   - metadati (src/verif/note): merge per-chiave, il target vince.
//   - nt: unione. ok/fonte: il target vince, copiati se mancanti.
// Su index.html bumpa VOC_VERSION. Gli omonimi VERI (stesso `it` identico,
// sensi diversi) non vengono toccati: qui si uniscono solo it DIVERSI come
// stringa ma uguali dopo la normalizzazione.

import fs from 'node:fs';

const APPLY = process.argv.includes('--apply');
const norm = s => (s || '').toLowerCase().trim().replace(/[.…]+$/, '').trim();
const META = new Set(['src', 'verif', 'note', 'nt', 'ok', 'fonte']);

function trovaBlocco(src, marker) {
  const m = new RegExp('const ' + marker + ' = \\[').exec(src);
  if (!m) throw new Error('marcatore non trovato: ' + marker);
  const open = src.indexOf('[', m.index);
  let d = 0, inS = null, esc = false, i = open;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (esc) { esc = false; continue; }
    if (inS) { if (c === '\\') esc = true; else if (c === inS) inS = null; continue; }
    if (c === '/' && n === '/') { i = src.indexOf('\n', i); continue; }
    if (c === '"' || c === "'" || c === '`') { inS = c; continue; }
    if (c === '[') d++; else if (c === ']') { d--; if (d === 0) break; }
  }
  return { open, close: i };
}

// Serializzazione voce nello stile di edit.html/dialetti.html
const KEY_ORDER = ['tema','livello','it','en','fr','es','de','pt','ru','ca','sp','mn','cr','ge','ko','ar','zh','ja','ia','la','grc','pron','src','verif','note','nt','fonte','ok'];
function serializza(v) {
  const parts = [];
  KEY_ORDER.forEach(k => {
    const val = v[k];
    if (val === undefined || val === null || val === '' || val === false) return;
    parts.push(`${k}:${JSON.stringify(val)}`);
  });
  Object.keys(v).forEach(k => {
    if (!KEY_ORDER.includes(k) && v[k] !== undefined && v[k] !== '' && v[k] !== false) parts.push(`${k}:${JSON.stringify(v[k])}`);
  });
  return '{ ' + parts.join(', ') + ' }';
}

function mergeGruppo(voci) {
  // target = it più "pulito" (senza punto finale, poi il più corto)
  const ordinati = [...voci].sort((a, b) => {
    const ap = /[.…]\s*$/.test(a.it) ? 1 : 0, bp = /[.…]\s*$/.test(b.it) ? 1 : 0;
    return ap - bp || a.it.length - b.it.length;
  });
  const target = ordinati[0];
  const conflitti = [];
  for (const src of ordinati.slice(1)) {
    for (const k of Object.keys(src)) {
      if (k === 'it') continue;
      const vs = src[k];
      if (vs === undefined || vs === null || vs === '') continue;
      if (META.has(k)) {
        if (k === 'nt') target.nt = [...new Set([...(target.nt || []), ...vs])];
        else if (k === 'src' || k === 'note') {
          if (typeof vs === 'object') target[k] = Object.assign({}, vs, target[k] || {});
        } else if (k === 'verif') {
          const parse = s => new Map(String(s || '').split(',').map(t => t.trim()).filter(Boolean).map(t => { const i = t.indexOf(':'); return [t.slice(0, i), t.slice(i + 1)]; }));
          const mT = parse(target.verif), mS = parse(vs);
          for (const [lang, st] of mS) if (!mT.has(lang)) mT.set(lang, st);
          if (mT.size) target.verif = [...mT.entries()].map(([a, b]) => `${a}:${b}`).join(',');
        } else if (target[k] === undefined || target[k] === '' || target[k] === false) target[k] = vs;
      } else {
        const vt = target[k];
        if (vt === undefined || vt === null || String(vt).trim() === '') target[k] = vs;
        else if (String(vt).trim() !== String(vs).trim()) conflitti.push(`${k}: ${JSON.stringify(vt)} vs ${JSON.stringify(vs)}`);
      }
    }
  }
  return { target, rimosse: ordinati.slice(1), conflitti };
}

function bonifica(file, marker, bumpVersione) {
  let src = fs.readFileSync(file, 'utf8');
  const { open, close } = trovaBlocco(src, marker);
  const voci = new Function('return ' + src.slice(open, close + 1))();

  const gruppi = new Map();
  voci.forEach(v => {
    const k = norm(v.it);
    if (!gruppi.has(k)) gruppi.set(k, []);
    gruppi.get(k).push(v);
  });

  const daRimuovere = new Set();
  let fusi = 0, saltati = 0;
  console.log(`\n=== ${file} (${marker}: ${voci.length} voci) ===`);
  for (const [, grp] of gruppi) {
    const distinti = [...new Set(grp.map(v => v.it))];
    if (distinti.length < 2) continue; // omonimi veri (it identico) o voce singola: non si toccano
    const { target, rimosse, conflitti } = mergeGruppo(grp);
    if (conflitti.length) {
      console.log(`  ⚠️ CONFLITTO, saltato: ${distinti.map(x => JSON.stringify(x)).join(' vs ')}\n     ${conflitti.join('\n     ')}`);
      saltati++;
      continue;
    }
    rimosse.forEach(r => daRimuovere.add(r));
    console.log(`  ✅ ${JSON.stringify(target.it)} ← assorbe ${rimosse.map(r => JSON.stringify(r.it)).join(', ')}`);
    fusi++;
  }
  console.log(`  Totale: ${fusi} gruppi fusi, ${saltati} saltati per conflitto, ${daRimuovere.size} voci rimosse`);

  if (!APPLY || !daRimuovere.size) return { fusi, saltati };

  const superstiti = voci.filter(v => !daRimuovere.has(v));
  const corpo = '\n      // ── ' + (marker === 'CANDIDATI' ? 'CANDIDATI ──────────────────' : 'VOCABOLARIO ──────────────────────────') + '\n'
    + superstiti.map(v => '      ' + serializza(v) + ',').join('\n') + '\n    ';
  src = src.slice(0, open + 1) + corpo + src.slice(close);
  if (bumpVersione) {
    src = src.replace(/^(\s*const\s+VOC_VERSION\s*=\s*)(\d+)(\s*;)/m, (m, p, n, s2) => p + (parseInt(n, 10) + 1) + s2);
  }
  fs.writeFileSync(file, src);
  console.log(`  💾 scritto ${file} (${superstiti.length} voci${bumpVersione ? ', VOC_VERSION bumpata' : ''})`);
  return { fusi, saltati };
}

bonifica('index.html', 'VOCABOLARIO_DEFAULT', true);
bonifica('dialetti.html', 'CANDIDATI', false);
if (!APPLY) console.log('\nDry-run. Riesegui con --apply per scrivere.');
