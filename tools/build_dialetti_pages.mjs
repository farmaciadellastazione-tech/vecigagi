#!/usr/bin/env node
// Genera una pagina HTML statica per dialetto (spezzino, carrarino,
// manarolese, genovese) con tutte le voci del vocabolario: italiano → dialetto.
//
// Perché: dialetti.html carica il dizionario con JavaScript, quindi Google ne
// legge pochissimo (~3800 caratteri di testo statico) e i quattro dialetti
// condividono un'unica URL. Ricerche come "dialetto carrarino" o "come si dice
// cucchiaio in spezzino" non trovavano nulla di nostro (segnalazione di Dino,
// 2026-10-10). Qui le parole sono scritte nell'HTML, con title/description/
// canonical/schema.org propri per ciascun dialetto. Stesso schema di
// tools/build_storie_pages.mjs.
//
// Uso:
//   npm run build:dialetti        (= node tools/build_dialetti_pages.mjs)
//
// Le pagine generate (dialetto-*.html) sono DERIVATE: non editarle a mano,
// rilancia questo script dopo le modifiche al vocabolario (edit.html) e
// committa il risultato. Le voci si prendono TUTTE, verificate o no (scelta di
// Dino), nella grafia (formaDisplay: senza la parte di pronuncia per la voce
// sintetica e senza le alternative nascoste dopo "|").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = 'https://linguaequiz.com';

const { formaDisplay, soloVisibile } = require(path.join(ROOT, 'vocab.js'));
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Letterale JS che inizia dopo `marcatore` (array o oggetto), bilanciando le
// parentesi e saltando le stringhe.
function letterale(marcatore) {
  const i = INDEX.indexOf(marcatore);
  if (i < 0) throw new Error('non trovato: ' + marcatore);
  let j = i + marcatore.length - 1, d = 0, q = null;
  const start = j;
  for (; j < INDEX.length; j++) {
    const c = INDEX[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '[' || c === '{') d++;
    else if (c === ']' || c === '}') { d--; if (d === 0) break; }
  }
  return new Function('return ' + INDEX.slice(start, j + 1))();
}

export const VOCABOLARIO = letterale('const VOCABOLARIO_DEFAULT = [');
export const TEMI = letterale('const TEMI = {');

export const DIALETTI = [
  {
    cod: 'sp', nome: 'spezzino', slug: 'dialetto-spezzino.html', lang: 'lij',
    intro: 'Il dialetto spezzino è la parlata della Spezia e del suo golfo, nel levante ligure.',
  },
  {
    cod: 'cr', nome: 'carrarino', slug: 'dialetto-carrarino.html', lang: null, // non ligure: nessun codice ISO adatto
    intro: 'Il dialetto carrarino è la parlata di Carrara, nella Lunigiana storica, tra Toscana e Liguria.',
  },
  {
    cod: 'mn', nome: 'manarolese', slug: 'dialetto-manarolese.html', lang: 'lij',
    intro: 'Il dialetto manarolese è la parlata di Manarola, uno dei borghi delle Cinque Terre.',
  },
  {
    cod: 'ge', nome: 'genovese', slug: 'dialetto-genovese.html', lang: 'lij',
    intro: 'Il genovese è la parlata di Genova, il dialetto ligure più conosciuto.',
  },
];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Voci del dialetto: [{tema, it, dial}], senza doppioni (stessa coppia it/dial)
// e senza celle vuote o "?". Ordinate per tema (ordine di TEMI) e per italiano.
export function vociDialetto(cod) {
  const viste = new Set();
  const out = [];
  for (const e of VOCABOLARIO) {
    const v = e[cod];
    if (typeof v !== 'string' || !v.trim() || v.trim() === '?') continue;
    const dial = (formaDisplay(v, cod) || '').trim();
    const it = (soloVisibile(e.it || '') || '').trim();
    if (!dial || !it || dial === '?') continue;
    const chiave = it.toLowerCase() + '\u0000' + dial.toLowerCase();
    if (viste.has(chiave)) continue;
    viste.add(chiave);
    out.push({ tema: e.tema || '', it, dial });
  }
  const ordineTemi = Object.keys(TEMI);
  const pos = t => { const k = ordineTemi.indexOf(t); return k < 0 ? ordineTemi.length : k; };
  return out.sort((a, b) => pos(a.tema) - pos(b.tema) || a.it.localeCompare(b.it, 'it'));
}

function pagina(d, voci) {
  const altri = DIALETTI.filter(x => x.cod !== d.cod);
  const n = voci.length;
  const title = `Dialetto ${d.nome}: dizionario italiano–${d.nome} con ${n} parole | LinguaeQuiz`;
  const description = `Come si dice in ${d.nome}? ${n} parole e frasi italiane tradotte in dialetto ${d.nome}, divise per temi. Gioca al quiz di LinguaeQuiz per impararle e aiutaci ad arricchire il dizionario.`;
  const canonical = `${SITE}/${d.slug}`;

  // raggruppa per tema
  const gruppi = [];
  for (const v of voci) {
    const g = gruppi[gruppi.length - 1];
    if (g && g.tema === v.tema) g.voci.push(v); else gruppi.push({ tema: v.tema, voci: [v] });
  }
  const indice = gruppi.map(g => {
    const t = TEMI[g.tema];
    return `<a href="#tema-${esc(g.tema || 'altro')}">${t ? esc(t.emoji + ' ' + t.label) : 'Altro'}</a>`;
  }).join('\n      ');
  const sezioni = gruppi.map(g => {
    const t = TEMI[g.tema];
    const righe = g.voci.map(v => `        <tr><td>${esc(v.it)}</td><td${d.lang ? ` lang="${d.lang}"` : ""}>${esc(v.dial)}</td></tr>`).join('\n');
    return `    <section id="tema-${esc(g.tema || 'altro')}">
      <h2>${t ? esc(t.emoji + ' ' + t.label) : 'Altro'} <span class="conta">(${g.voci.length})</span></h2>
      <table>
        <thead><tr><th>Italiano</th><th>${esc(d.nome[0].toUpperCase() + d.nome.slice(1))}</th></tr></thead>
        <tbody>
${righe}
        </tbody>
      </table>
    </section>`;
  }).join('\n');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: `Dizionario italiano–${d.nome}`,
    url: canonical,
    inLanguage: ['it'],
    description,
    isPartOf: { '@type': 'WebSite', name: 'LinguaeQuiz', url: `${SITE}/` },
  };

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
<meta property="og:type" content="website">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap">
<style>
  :root { --bg:#f8fafc; --surface:#ffffff; --border:#e2e8f0; --accent:#4f46e5; --text:#1e293b; --muted:#475569; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  header { background: #1e1b4b; border-bottom: 1px solid #312e81; padding: 20px 24px; }
  .header-inner { max-width: 820px; margin: 0 auto; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .logo { font-size: 20px; font-weight: 700; color: white; text-decoration: none; display: flex; align-items: center; gap: 8px; }
  .logo span { color: var(--accent); }
  .subtitle { color: #a5b4fc; font-size: 13px; flex: 1; }
  main { max-width: 820px; margin: 0 auto; padding: 32px 16px 80px; }
  .crumbs { font-size: 13px; color: var(--muted); margin-bottom: 18px; }
  .crumbs a { color: var(--accent); text-decoration: none; }
  h1 { font-size: 27px; margin-bottom: 10px; line-height: 1.25; }
  .intro { color: var(--muted); font-size: 15px; line-height: 1.55; max-width: 660px; margin-bottom: 18px; }
  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin: 10px 0 24px; }
  .cta { display: inline-block; background: var(--accent); color: white; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 18px; border-radius: 10px; }
  .cta-secondary { display: inline-block; background: var(--surface); border: 1px solid var(--border); color: var(--text); text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 18px; border-radius: 10px; }
  .temi { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 28px; }
  .temi a, .altri a { font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; background: var(--surface); }
  section { margin-bottom: 30px; }
  h2 { font-size: 19px; margin-bottom: 10px; }
  .conta { color: var(--muted); font-weight: 400; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--border); font-size: 15px; vertical-align: top; overflow-wrap: anywhere; }
  th { background: #eef2ff; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
  td:last-child { font-weight: 600; }
  .altri { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
</style>
</head>
<body>
<header>
  <div class="header-inner">
    <a class="logo" href="${SITE}/">🌍 Lingua<span>e</span>Quiz</a>
    <div class="subtitle">Dizionari e quiz dei dialetti liguri e lunigianesi</div>
  </div>
</header>
<main>
  <p class="crumbs"><a href="dialetti.html">Dialetti</a> › Dialetto ${esc(d.nome)}</p>
  <h1>Dialetto ${esc(d.nome)} — dizionario italiano-${esc(d.nome)}</h1>
  <p class="intro">${esc(d.intro)} In questa pagina trovi ${n} parole e frasi italiane con la traduzione in ${esc(d.nome)}, divise per temi. Le voci sono raccolte su LinguaeQuiz, il quiz gratuito per imparare i dialetti: se conosci il ${esc(d.nome)} puoi aiutarci a correggerle e arricchirle.</p>
  <div class="cta-row">
    <a class="cta" href="${SITE}/#quiz">🎮 Impara il ${esc(d.nome)} col quiz</a>
    <a class="cta-secondary" href="dialetti.html">✍️ Contribuisci con il tuo dialetto</a>
  </div>
  <nav class="temi" aria-label="Temi">
      ${indice}
  </nav>
${sezioni}
  <h2>Gli altri dialetti</h2>
  <div class="altri">
${altri.map(a => `    <a href="${a.slug}">Dialetto ${esc(a.nome)}</a>`).join('\n')}
  </div>
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

// Esegue solo se lanciato direttamente (i test importano le funzioni)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const d of DIALETTI) {
    const voci = vociDialetto(d.cod);
    fs.writeFileSync(path.join(ROOT, d.slug), pagina(d, voci), 'utf8');
    console.log(`  scritto ${d.slug} (${voci.length} voci)`);
  }
  console.log('Fatto.');
}
