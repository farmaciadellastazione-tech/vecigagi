#!/usr/bin/env node
// Genera pagine HTML statiche dedicate per le opere lunghe di Lettura Guidata
// (l'Eneide in genovese di Nicolò Bacigalupo, le poesie di Ubaldo Mazzini in
// spezzino) a partire da STORIE_DEFAULT in storie.js.
//
// Perché: storie.html mostra tutte le ~47 storie su un'unica URL, con testo
// iniettato a runtime da storie.js — Google vede un solo <title>/meta per
// l'intera collezione e deve fare un rendering JS completo anche solo per
// intravedere un verso dell'Eneide (vedi memoria
// project_storie_seo_singola_pagina). Le pagine generate qui hanno invece il
// testo già scritto nell'HTML e metadata (title/description/canonical/
// schema.org) propri per ciascuna opera.
//
// Uso:
//   node tools/build_storie_pages.mjs
//
// Le pagine generate (storia-eneide*.html, storia-mazzini-*.html) sono
// DERIVATE: non editarle a mano, rilancia questo script dopo ogni modifica a
// storie.js e committa il risultato (stesso spirito di "npm run build:css").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://linguaequiz.com';

const { formaDisplay } = require(path.join(ROOT, 'vocab.js'));

const storieSrc = fs.readFileSync(path.join(ROOT, 'storie.js'), 'utf8');
const STORIE_DEFAULT = new Function(storieSrc + '\nreturn STORIE_DEFAULT;')();

// Aggiorna a true quando la traduzione del libro è completa (2026-08-31: il
// libro 3 dell'Eneide è ancora in corso, per indicazione diretta di Dino —
// la pagina resta pubblicata così com'è e si aggiorna da sola ad ogni rebuild).
const LIBRO_COMPLETO = { 1: true, 2: true, 3: false };

// ── util ─────────────────────────────────────────────────────────────────

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function testoFrase(frase, lingua) {
  return formaDisplay(frase.testo, lingua) ?? frase.testo;
}

function fonteBlock(fonte) {
  if (!fonte) return '';
  let s;
  if (fonte.generato === 'ai') {
    s = `🤖 Testo generato${fonte.modello ? ' (' + esc(fonte.modello) + ')' : ''}`;
  } else {
    s = '📖 Testo autentico';
    if (fonte.autore) s += ' — ' + esc(fonte.autore);
    if (fonte.riferimento) s += ' · ' + esc(fonte.riferimento);
  }
  // "no" compare come placeholder su tutte le 37 parti dell'Eneide (probabile
  // valore di default lasciato in fase di inserimento, non un giudizio sulla
  // licenza reale — l'autore è morto nel 1904, quindi l'opera originale è
  // comunque di pubblico dominio in Italia): non lo mostriamo per non
  // suggerire il contrario. Va corretto alla fonte in storie.js.
  if (fonte.licenza && fonte.licenza.toLowerCase() !== 'no') s += `<br>Licenza: ${esc(fonte.licenza)}`;
  if (fonte.note) s += `<br>${esc(fonte.note)}`;
  return `<p class="fonte">${s}</p>`;
}

function renderFrasi(frasi, lingua, strofaLen) {
  const righe = frasi.map((f, i) => {
    const inizioStrofa = strofaLen > 0 && i > 0 && i % strofaLen === 0;
    return `      <div class="frase${inizioStrofa ? ' strofa-inizio' : ''}">
        <div class="native" lang="lij">${esc(testoFrase(f, lingua))}</div>
        <div class="it">${esc(f.it)}</div>
      </div>`;
  }).join('\n');
  return `    <div class="frasi">\n${righe}\n    </div>`;
}

function pageShell({ slug, title, description, h1, subtitle, breadcrumbHtml, bodyHtml, schema }) {
  const canonical = `${SITE}/${slug}`;
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="it" href="${canonical}">
<link rel="alternate" hreflang="x-default" href="${canonical}">

<link rel="icon" type="image/png" sizes="32x32" href="icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="icon-180.png">
<meta name="theme-color" content="#1e1b4b">

<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="LinguaeQuiz">
<meta property="og:locale" content="it_IT">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/og-image.png">

<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap">
<style>
  :root { --bg:#f8fafc; --surface:#ffffff; --border:#e2e8f0; --accent:#4f46e5; --text:#1e293b; --muted:#475569; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  header { background: #1e1b4b; border-bottom: 1px solid #312e81; padding: 20px 24px; }
  .header-inner { max-width: 820px; margin: 0 auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .logo { font-size: 20px; font-weight: 700; color: white; text-decoration: none; display: flex; align-items: center; gap: 8px; }
  .logo span { color: var(--accent); }
  .subtitle { color: #a5b4fc; font-size: 13px; flex: 1; }
  main { max-width: 820px; margin: 0 auto; padding: 32px 20px 80px; }
  .crumbs { font-size: 13px; color: var(--muted); margin-bottom: 18px; }
  .crumbs a { color: var(--accent); text-decoration: none; }
  .crumbs a:hover { text-decoration: underline; }
  h1 { font-size: 27px; margin-bottom: 6px; line-height: 1.25; }
  .sub { color: var(--muted); font-size: 16px; font-style: italic; margin-bottom: 18px; }
  .intro { color: var(--muted); font-size: 15px; line-height: 1.55; max-width: 640px; margin-bottom: 20px; }
  .fonte { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 24px; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; }
  .frasi { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
  .frase .native { font-family: 'Crimson Pro', serif; font-size: 19px; font-weight: 600; line-height: 1.55; }
  .frase .it { font-family: 'Crimson Pro', serif; font-style: italic; color: var(--muted); font-size: 15px; line-height: 1.45; margin-top: 3px; }
  .strofa-inizio { margin-top: 12px; padding-top: 20px; border-top: 1px dashed var(--border); }
  .nota { font-size: 13px; color: var(--muted); background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 10px 14px; margin-bottom: 24px; }
  .opere { display: flex; flex-direction: column; gap: 14px; margin: 20px 0 30px; }
  .opera-card { display: block; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; text-decoration: none; color: inherit; transition: border-color .15s; }
  .opera-card:hover { border-color: var(--accent); }
  .opera-card h2 { font-size: 17px; margin-bottom: 4px; color: var(--text); }
  .opera-card p { font-size: 13px; color: var(--muted); }
  .badge-corso { display: inline-block; font-size: 11px; font-weight: 700; color: #92400e; background: #fef3c7; border-radius: 20px; padding: 2px 8px; margin-left: 6px; vertical-align: middle; }
  .nav-opere { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0 30px; }
  .nav-opere a { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; border: 1px solid var(--border); border-radius: 20px; padding: 6px 14px; }
  .nav-opere a:hover { border-color: var(--accent); }
  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; }
  .cta { display: inline-block; background: var(--accent); color: white; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 18px; border-radius: 10px; }
  .cta:hover { opacity: .85; }
  .cta-secondary { display: inline-block; background: var(--surface); border: 1px solid var(--border); color: var(--text); text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 10px; }
</style>
</head>
<body>
<header>
  <div class="header-inner">
    <a class="logo" href="${SITE}/">📖 Lingua<span>e</span>Quiz</a>
    <div class="subtitle">Storie brevi per imparare leggendo</div>
  </div>
</header>
<main>
  <p class="crumbs">${breadcrumbHtml}</p>
  <h1>${esc(h1)}</h1>
${subtitle ? `  <p class="sub">${esc(subtitle)}</p>\n` : ''}${bodyHtml}
</main>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-G2KYH1T350"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-G2KYH1T350');
</script>
</body>
</html>
`;
}

function write(slug, html) {
  fs.writeFileSync(path.join(ROOT, slug), html, 'utf8');
  console.log('  scritto', slug);
}

// ── Eneide: raggruppa le "parte" per libro ──────────────────────────────

const RE_LIBRO = /libro\s+(\d+)\s+parte\s+(\d+)/i;
const eneideParti = STORIE_DEFAULT.filter(s => RE_LIBRO.test(s.titolo?.testo || ''));

const libri = new Map(); // numero libro -> [{ parte, storia }]
for (const storia of eneideParti) {
  const m = RE_LIBRO.exec(storia.titolo.testo);
  const libro = Number(m[1]), parte = Number(m[2]);
  if (!libri.has(libro)) libri.set(libro, []);
  libri.get(libro).push({ parte, storia });
}
for (const arr of libri.values()) arr.sort((a, b) => a.parte - b.parte);
const numeriLibri = [...libri.keys()].sort((a, b) => a - b);
const fonteEneide = eneideParti[0]?.fonte || {};
const STROFA_LEN_ENEIDE = 8; // l'Eneide di Bacigalupo è in ottave

console.log(`Eneide: ${eneideParti.length} parti su ${numeriLibri.length} libri (${numeriLibri.map(n => `libro ${n}: ${libri.get(n).length} parti`).join(', ')})`);

const eneideDescr = 'Libera versione in dialetto genovese dell’Eneide di Virgilio, scritta da Nicolò Bacigalupo (1837–1904): un reduce troiano racconta a modo suo, in ottave, l’incendio di Troia e il naufragio a Cartagine. Testo con traduzione italiana frase per frase.';

const opereHtml = numeriLibri.map(n => {
  const parti = libri.get(n);
  const primaFrase = parti[0].storia.frasi.find(f => f.testo);
  const teaser = primaFrase ? testoFrase(primaFrase, 'ge') : '';
  const inCorso = !LIBRO_COMPLETO[n];
  return `    <a class="opera-card" href="storia-eneide-libro-${n}.html">
      <h2>Libro ${n}${inCorso ? ' <span class="badge-corso">traduzione in corso</span>' : ''}</h2>
      <p>${esc(teaser)}${teaser ? '…' : ''}</p>
    </a>`;
}).join('\n');

write('storia-eneide.html', pageShell({
  slug: 'storia-eneide.html',
  title: 'Eneide in genovese, di Nicolò Bacigalupo — testo e traduzione | LinguaeQuiz',
  description: eneideDescr,
  h1: 'Eneide in genovese',
  subtitle: 'Traduzione in dialetto genovese di Nicolò Bacigalupo (1837–1904)',
  breadcrumbHtml: `<a href="storie.html">Storie brevi</a> › Eneide in genovese`,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'Eneide in genovese',
    url: `${SITE}/storia-eneide.html`,
    inLanguage: 'it',
    author: { '@type': 'Person', name: 'Nicolò Bacigalupo', birthDate: '1837', deathDate: '1904' },
    description: eneideDescr,
    isPartOf: { '@type': 'WebSite', name: 'LinguaeQuiz', url: `${SITE}/` },
  },
  bodyHtml: `  <p class="intro">${esc(eneideDescr)}</p>
${fonteBlock(fonteEneide)}
  <div class="opere">
${opereHtml}
  </div>
  <div class="nav-opere">
    <a href="storie.html">← Tutte le storie</a>
    <a href="${SITE}/#quiz">🎮 Gioca al quiz di LinguaeQuiz</a>
  </div>`,
}));

for (const n of numeriLibri) {
  const parti = libri.get(n);
  const frasi = parti.flatMap(p => p.storia.frasi);
  const primoId = parti[0].storia.id;
  const idx = numeriLibri.indexOf(n);
  const prevN = numeriLibri[idx - 1];
  const nextN = numeriLibri[idx + 1];
  const inCorso = !LIBRO_COMPLETO[n];

  const navLinks = [
    `<a href="storia-eneide.html">📖 Tutti i libri</a>`,
    prevN != null ? `<a href="storia-eneide-libro-${prevN}.html">← Libro ${prevN}</a>` : '',
    nextN != null ? `<a href="storia-eneide-libro-${nextN}.html">Libro ${nextN} →</a>` : '',
    `<a href="storie.html">Tutte le storie</a>`,
  ].filter(Boolean).join('\n    ');

  const slug = `storia-eneide-libro-${n}.html`;
  const title = `Eneide in genovese — Libro ${n} | Traduzione di Nicolò Bacigalupo | LinguaeQuiz`;

  write(slug, pageShell({
    slug,
    title,
    description: `Libro ${n} dell'Eneide in dialetto genovese di Nicolò Bacigalupo, ${frasi.length} versi con traduzione italiana frase per frase.`,
    h1: `Eneide in genovese — Libro ${n}`,
    breadcrumbHtml: `<a href="storie.html">Storie brevi</a> › <a href="storia-eneide.html">Eneide in genovese</a> › Libro ${n}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: `Eneide in genovese — Libro ${n}`,
      url: `${SITE}/${slug}`,
      inLanguage: 'it',
      author: { '@type': 'Person', name: 'Nicolò Bacigalupo', birthDate: '1837', deathDate: '1904' },
      isPartOf: { '@type': 'Book', name: 'Eneide in genovese', url: `${SITE}/storia-eneide.html` },
    },
    bodyHtml: `${inCorso ? `  <p class="nota">✏️ Traduzione in corso: questo libro viene aggiornato man mano che nuove parti vengono pubblicate.</p>\n` : ''}${fonteBlock(fonteEneide)}
${renderFrasi(frasi, 'ge', STROFA_LEN_ENEIDE)}
  <div class="cta-row">
    <a class="cta" href="index.html#storia/${encodeURIComponent(primoId)}">Continua in modalità interattiva →</a>
    <a class="cta-secondary" href="storia-eneide.html">📖 Tutti i libri dell'Eneide</a>
  </div>
  <div class="nav-opere">
    ${navLinks}
  </div>`,
  }));
}

// ── Poesie di Ubaldo Mazzini in spezzino ────────────────────────────────

const mazzini = STORIE_DEFAULT.filter(s => (s.fonte?.autore || '').includes('Mazzini'));
console.log(`Mazzini: ${mazzini.length} poesie`);

const mazziniPagine = mazzini.map(s => ({
  storia: s,
  slug: `storia-mazzini-${slugify(s.titolo?.testo) || s.id}.html`,
}));

for (const { storia, slug } of mazziniPagine) {
  const altre = mazziniPagine.filter(p => p.slug !== slug);
  const navLinks = [
    `<a href="storie.html">Tutte le storie</a>`,
    ...altre.map(p => `<a href="${p.slug}">${esc(p.storia.titolo?.testo || '')}</a>`),
  ].join('\n    ');

  const title = `${storia.titolo?.testo || ''} — poesia di Ubaldo Mazzini in spezzino | LinguaeQuiz`;
  const description = `"${storia.titolo?.testo}" (${storia.titolo?.it}), poesia in dialetto spezzino di Ubaldo Mazzini, con traduzione italiana frase per frase.`;

  write(slug, pageShell({
    slug,
    title,
    description,
    h1: storia.titolo?.testo || '',
    subtitle: storia.titolo?.it || '',
    breadcrumbHtml: `<a href="storie.html">Storie brevi</a> › Poesie di Ubaldo Mazzini`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: storia.titolo?.testo || '',
      url: `${SITE}/${slug}`,
      inLanguage: 'it',
      genre: 'poesia',
      author: { '@type': 'Person', name: 'Ubaldo Mazzini', birthDate: '1868', deathDate: '1923' },
      isPartOf: { '@type': 'WebSite', name: 'LinguaeQuiz', url: `${SITE}/` },
    },
    bodyHtml: `${fonteBlock(storia.fonte)}
${renderFrasi(storia.frasi, storia.lingua, 0)}
  <div class="cta-row">
    <a class="cta" href="index.html#storia/${encodeURIComponent(storia.id)}">Continua in modalità interattiva →</a>
    <a class="cta-secondary" href="storie.html">📖 Tutte le storie</a>
  </div>
  <div class="nav-opere">
    ${navLinks}
  </div>`,
  }));
}

console.log('Fatto.');
