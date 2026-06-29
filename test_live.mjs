/**
 * Test live su linguaequiz.com — verifica fix formaDisplay
 * Da eseguire con: node test_live.mjs
 */
import { chromium } from 'playwright';

const URL = 'https://linguaequiz.com/';
const SCRATCHPAD = 'C:\\Users\\farma\\AppData\\Local\\Temp\\claude\\C--Progetti-vecigagi\\1167027c-8886-4ff3-b036-9e5c3b59c403\\scratchpad\\';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));

// Helper: chiude il modale onboarding se presente
async function skipOnboarding() {
  const skipBtn = page.locator('button').filter({ hasText: /^Skip$/ }).first();
  if (await skipBtn.count() > 0) {
    await skipBtn.click();
    await page.waitForTimeout(400);
    console.log('  (onboarding skippato)');
  }
}

// Helper: imposta localStorage per saltare onboarding nei reload
async function setLocalStorageDefaults() {
  await page.evaluate(() => {
    localStorage.setItem('qml_onboarding_done', 'true');
    localStorage.setItem('qml_tour_done', 'true');
  });
}

// ── CARICAMENTO ─────────────────────────────────────────────────────────────
console.log('=== CARICAMENTO ===');
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
const title = await page.title();
console.log('Titolo:', title);
await skipOnboarding();
await page.screenshot({ path: SCRATCHPAD + '01_home.png' });
console.log('✅ Pagina caricata');

// ── TEST 1: Bottone TTS in Ricerca ──────────────────────────────────────────
console.log('\n=== TEST 1: TTS button in Ricerca ===');

// Cerca il bottone 🔍 nella barra di navigazione
const btnSearch = page.locator('button[title*="Search"], button[title*="Dictionary"], button[title*="search"]').first();
const hasTitleSearch = await btnSearch.count() > 0;
if (hasTitleSearch) {
  await btnSearch.click();
  await page.waitForTimeout(600);
  console.log('✅ Aperta ricerca via title');
} else {
  const btn2 = page.locator('button').filter({ hasText: /^🔍$/ }).first();
  if (await btn2.count() > 0) {
    await btn2.click();
    await page.waitForTimeout(600);
    console.log('✅ Aperta ricerca via 🔍');
  }
}

// Cerca l'input
const input = page.locator('input[placeholder]').first();
if (await input.count() > 0) {
  const placeholder = await input.getAttribute('placeholder');
  console.log('Input trovato, placeholder:', placeholder);
  await input.fill('scusa');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: SCRATCHPAD + '02_search_scusa.png' });

  // Clicca sul primo risultato per espandere
  const firstCard = page.locator('[class*="zinc-900"][class*="rounded"]').first();
  if (await firstCard.count() > 0) {
    await firstCard.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: SCRATCHPAD + '03_search_expanded.png' });
  }

  const ttsBtns = page.locator('button[title="Ascolta pronuncia"]');
  const nTts = await ttsBtns.count();
  if (nTts > 0) {
    console.log(`✅ TEST 1 PASS — ${nTts} bottone/i TTS "Ascolta pronuncia" presenti in Ricerca`);
  } else {
    // Cerca qualunque bottone 🔊 nella sezione espansa
    const allBtns2 = await page.locator('button').allTextContents();
    const ttsFound = allBtns2.some(t => t.includes('🔊'));
    console.log(ttsFound ? '✅ TEST 1 PASS — bottone 🔊 trovato' : '❌ TEST 1 FAIL — nessun bottone TTS in Ricerca');
    console.log('  Bottoni visibili:', allBtns2.filter(t => t.trim().length < 10));
  }
} else {
  console.log('⚠️  Input ricerca non trovato');
}

// ── TEST 2: Words to review — no slash dialettale ───────────────────────────
console.log('\n=== TEST 2: Words to review ===');
await page.goto(URL, { waitUntil: 'networkidle' });
await skipOnboarding();

// Inietta stats per sbloccare allenamento
await page.evaluate(() => {
  const stats = {
    'scusa': { livello: 1, nextReview: Date.now() - 86400000, viste: 3 },
    'ciao':  { livello: 2, nextReview: Date.now() - 86400000, viste: 5 },
    'grazie':{ livello: 1, nextReview: Date.now() - 86400000, viste: 3 },
    'acqua': { livello: 1, nextReview: Date.now() - 86400000, viste: 2 },
    'pane':  { livello: 1, nextReview: Date.now() - 86400000, viste: 2 },
  };
  localStorage.setItem('qml_v10_stats', JSON.stringify(stats));
});
await page.reload({ waitUntil: 'networkidle' });
await skipOnboarding();

// Avvia "Scelta multipla" (prima modalità disponibile senza lock)
const cardScelta = page.locator('text=Scelta multipla').first();
if (await cardScelta.count() > 0) {
  await cardScelta.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: SCRATCHPAD + '04_scelta_start.png' });

  // Rispondo sbagliato per N carte — clicca la card risposta via JS (evita icon buttons)
  let attempts = 0;
  while (attempts < 50) {
    attempts++;

    const stato = await page.evaluate(() => {
      // Cerca il pannello "Words to review"
      const body = document.body.innerText;
      if (body.includes('Words to review')) return 'done';
      if (body.includes('Fine sessione')) return 'done';
      if (body.includes('Session results')) return 'done';

      // Cerca le card risposta (div con testo "A.", "B.", ecc.) e clicca la prima sbagliata
      // Cerca tutti gli elementi cliccabili che contengono "A. " come prefisso
      const allDivs = [...document.querySelectorAll('div, li')];
      const cardRisposte = allDivs.filter(el => {
        const txt = el.innerText?.trim() || '';
        return /^[A-E]\.\s+\w/.test(txt) && el.innerText.length < 100;
      });

      // Prendi l'ultima risposta (spesso sbagliata) o la prima disponibile
      const target = cardRisposte[cardRisposte.length - 1] || cardRisposte[0];
      if (target) {
        target.click();
        return 'clicked:' + target.innerText.trim().slice(0, 30);
      }

      // Fallback: cerca bottone "Avanti" / "Continua"
      const btns = [...document.querySelectorAll('button')];
      const avanti = btns.find(b => /avanti|next|continua|→/i.test(b.innerText));
      if (avanti) { avanti.click(); return 'avanti'; }

      return 'nothing';
    });

    await page.waitForTimeout(500);
    if (stato === 'done') break;
    if (stato === 'nothing') break;

    // Dopo ogni risposta, cerca e clicca "Avanti"
    const avanti = page.locator('button').filter({ hasText: /avanti|next|→/i }).first();
    if (await avanti.count() > 0) { await avanti.click(); await page.waitForTimeout(400); }
  }

  await page.screenshot({ path: SCRATCHPAD + '06_risultati.png' });

  const hasReview = await page.locator('text=Words to review').count() > 0;
  if (hasReview) {
    await page.screenshot({ path: SCRATCHPAD + '06b_words_to_review.png' });
    const greenWords = await page.locator('.text-green-400').allTextContents();
    const boldWhite = await page.locator('.text-slate-200.font-bold').allTextContents();
    console.log('Parole risposta (verde):', greenWords.slice(0, 5));
    console.log('Parole sorgente (bold):', boldWhite.slice(0, 5));

    const slashGreen = greenWords.filter(w => w.includes('/'));
    const slashWhite = boldWhite.filter(w => w.includes('/'));

    if (slashGreen.length === 0 && slashWhite.length === 0) {
      console.log('✅ TEST 2 PASS — nessuno slash nelle parole da rivedere');
    } else {
      if (slashGreen.length) console.log('❌ TEST 2 FAIL — slash in verde:', slashGreen);
      if (slashWhite.length) console.log('❌ TEST 2 FAIL — slash in bold:', slashWhite);
    }
  } else {
    console.log('⚠️  "Words to review" non raggiunto (' + attempts + ' step), forse nessun errore');
    console.log('  Testo:', (await page.locator('body').innerText()).slice(0, 200));
  }
} else {
  console.log('⚠️  Card Scelta multipla non trovata');
  console.log('  Testo pagina:', (await page.locator('body').innerText()).slice(0, 300));
}

// ── TEST 3: Glossario — no slash nei titoli ──────────────────────────────────
console.log('\n=== TEST 3: Glossario ===');
await page.goto(URL, { waitUntil: 'networkidle' });
await skipOnboarding();

// Il Glossario è il bottone 📚 o 📊 nella sidebar sinistra
const btnGloss = page.locator('button').filter({ hasText: /^📚$/ }).first();
const btnStats = page.locator('button').filter({ hasText: /^📊$/ }).first();
const hasGloss = await btnGloss.count() > 0;
const hasStats = await btnStats.count() > 0;
if (hasGloss || hasStats) {
  await (hasGloss ? btnGloss : btnStats).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: SCRATCHPAD + '07_glossario.png' });

  // Verifica che i titoli delle voci non abbiano slash dialettali
  // Esclude "X/Y" con entrambi numeri (frazioni come 1738/1738) e parole corte come la/lo
  const allText = await page.locator('.font-bold.text-slate-100, .font-semibold.text-slate-100').allTextContents();
  const withSlash = allText.filter(t => {
    if (!t.includes('/')) return false;
    if (/\d+\/\d+/.test(t)) return false; // fraction like 1738/1738
    if (t.length > 60) return false; // header text
    // Check if it's a dialect TTS slash (word/word pattern)
    return /[a-záàéèíìóòúù']+\/[a-záàéèíìóòúù']+/i.test(t);
  });
  if (withSlash.length === 0) {
    console.log(`✅ TEST 3 PASS — nessuno slash dialettale nei ${allText.length} testi del glossario`);
  } else {
    console.log(`❌ TEST 3 FAIL — ${withSlash.length} testi con slash dialettale:`, withSlash.slice(0, 5));
  }
} else {
  console.log('⚠️  Bottone 📚/📊 non trovato; provo testo...');
  const btnAlt = page.locator('button[title*="Vocab"], button[title*="Glossar"], button[title*="Statistic"]').first();
  if (await btnAlt.count() > 0) {
    const t = await btnAlt.getAttribute('title');
    console.log('  Trovato via title:', t);
    await btnAlt.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: SCRATCHPAD + '07_glossario.png' });
  } else {
    console.log('  Nessun bottone trovato. Bottoni disponibili:', (await page.locator('button').allTextContents()).filter(t => t.trim().length < 10));
  }
}

// ── Errori JS ────────────────────────────────────────────────────────────────
console.log('\n=== ERRORI JS ===');
if (errors.length === 0) {
  console.log('✅ Nessun errore JavaScript');
} else {
  console.log(`❌ ${errors.length} errori:`);
  errors.forEach(e => console.log(' -', e.slice(0, 200)));
}

await browser.close();
console.log('\nScreenshot in:', SCRATCHPAD);
