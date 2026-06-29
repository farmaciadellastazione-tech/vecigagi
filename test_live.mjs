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

// ── TEST 2: Words to review — no slash dialettale (via modalità Quiz) ─────────
// "Words to review" appare in SchermataQuiz (quiz/allenamento/dettato/voce),
// NON in SchermataSceltaMultipla che ha il proprio schermo risultati.
// Quiz mode (key "quiz") non rimette in coda le risposte sbagliate (conRipetizione=false),
// quindi finisce dopo nDomande risposte indipendentemente dagli errori.
console.log('\n=== TEST 2: Words to review (via Quiz) ===');
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await skipOnboarding();

// Inietta stats con livello>0 per sbloccare quiz mode (isSbloccata usa Math.max(paroleViste, apprese))
// + salta onboarding/tour al reload
await page.evaluate(() => {
  const stats = {
    'scusa': { livello: 1, prossima: Date.now() - 86400000 },
    'ciao':  { livello: 2, prossima: Date.now() - 86400000 },
    'grazie':{ livello: 1, prossima: Date.now() - 86400000 },
    'acqua': { livello: 1, prossima: Date.now() - 86400000 },
    'pane':  { livello: 1, prossima: Date.now() - 86400000 },
  };
  localStorage.setItem('qml_v10_stats', JSON.stringify(stats));
  localStorage.setItem('qml_onboarding_done', 'true');
  localStorage.setItem('qml_tour_done', 'true');
  localStorage.setItem('qml_tour_seen', '1');
});
await page.reload({ waitUntil: 'networkidle' });
await page.screenshot({ path: SCRATCHPAD + '04_home_t2.png' });

// Trova e clicca il bottone Quiz (t.quiz = "🎯 Quiz" in tutte le lingue)
// Nota: Scelta multipla non contiene "Quiz", quindi la stringa è univoca.
const btnQuiz = page.locator('button').filter({ hasText: 'Quiz' }).first();
if ((await btnQuiz.count()) === 0) {
  console.log('⚠️  Bottone Quiz non trovato');
  const allBtns = await page.locator('button').allTextContents();
  console.log('  Bottoni disponibili:', allBtns.filter(t => t.trim()).slice(0, 25));
} else {
  await btnQuiz.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: SCRATCHPAD + '05_config_quiz.png' });

  // ConfigurazioneQuiz: scegli 5 domande (meno attesa), poi "Inizia →"
  const btn5 = page.locator('button').filter({ hasText: /^5$/ }).first();
  if ((await btn5.count()) > 0) { await btn5.click(); await page.waitForTimeout(200); }
  const btnInizia = page.locator('button').filter({ hasText: /Inizia/ }).first();
  if ((await btnInizia.count()) > 0) {
    await btnInizia.click();
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: SCRATCHPAD + '06_quiz_start.png' });

  // Loop quiz: 5 domande × (input "zzzzz" + Enter + "Continua →")
  // Quiz mode non rimette in coda → finisce in esattamente nDomande passi.
  let step = 0;
  while (step < 40) {
    step++;
    const body = await page.locator('body').innerText().catch(() => '');
    if (body.includes('Words to review')) break;
    if (body.includes('corrette\n') && body.includes('%')) break; // schermata risultati senza errori

    // Stato "domanda": input testuale visibile
    const inp = page.locator('input[type="text"]').first();
    if ((await inp.count()) > 0 && await inp.isVisible().catch(() => false)) {
      await inp.fill('zzzzz');
      await inp.press('Enter');
      await page.waitForTimeout(600);
      continue;
    }

    // Stato "corretto" o "sbagliato": bottone Continua →
    const continua = page.locator('button').filter({ hasText: /Continua|Continue/ }).first();
    if ((await continua.count()) > 0 && await continua.isVisible().catch(() => false)) {
      await continua.click();
      await page.waitForTimeout(400);
      continue;
    }

    await page.waitForTimeout(300); // breve attesa se né input né continua
  }

  await page.screenshot({ path: SCRATCHPAD + '07_risultati_quiz.png' });
  const bodyFinal = await page.locator('body').innerText().catch(() => '');
  const hasReview = bodyFinal.includes('Words to review');

  if (hasReview) {
    await page.screenshot({ path: SCRATCHPAD + '07b_words_to_review.png' });
    // Legge il testo della sezione Words to review e cerca slash dialettali (pronuncia/grafia)
    const reviewDiv = page.locator('div').filter({ hasText: 'Words to review' }).first();
    const reviewText = await reviewDiv.innerText().catch(() => '');
    const lines = reviewText.split('\n').filter(l => l.trim() && l.trim() !== 'Words to review');
    const withSlash = lines.filter(l => /[a-záàéèíìóòúùü'']+\/[a-záàéèíìóòúùü'']+/i.test(l));
    if (withSlash.length === 0) {
      console.log(`✅ TEST 2 PASS — nessuno slash dialettale in "Words to review" (${lines.length} righe)`);
    } else {
      console.log(`❌ TEST 2 FAIL — ${withSlash.length} righe con slash:`, withSlash.slice(0, 5));
    }
  } else {
    // Se non ci sono "Words to review" è perché tutte le risposte erano corrette (improbabile con "zzzzz")
    // oppure il quiz non è arrivato alla fine
    const hasResults = bodyFinal.includes('%') && bodyFinal.includes('corrette');
    if (hasResults) {
      console.log('⚠️  TEST 2 — quiz finito senza errori (nessuna "Words to review", inaspettato con "zzzzz")');
    } else {
      console.log(`⚠️  TEST 2 — risultati non raggiunto in ${step} passi`);
      console.log('  Body:', bodyFinal.slice(0, 300));
    }
  }
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
