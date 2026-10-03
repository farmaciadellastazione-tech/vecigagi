// vocab.js — text processing puro per vecigagi (LinguaeQuiz).
//
// Caricato da:
//   • index.html via <script src="vocab.js"> (precede il main script React inline).
//   • vitest tests via import (Node).
//
// Simboli esposti su globalThis per i consumatori browser e via module.exports
// per Node. Il main script di index.html li usa come globals dopo che vocab.js
// è stato caricato.

// ── Codici lingua / convenzioni ──────────────────────────────────────────

// Dialetti che NON hanno una loro TTS e usano la voce italiana del browser.
// In questi codici, "/" significa "stessa parola, due grafie" (pronuncia/tradizionale).
// Per gli altri codici, "/" è SINONIMI (parole diverse con stesso significato).
// Sono anche i dialetti per cui:
//  - si applica normalizzaDialetto() (strip prefissi fonetici)
//  - si escludono dalla modalità Frase Libera AI (l'AI non li conosce)
const DIALETTI_TTS_ITA = ["mn", "sp", "ge", "cr"];

// Sottoinsieme: dialetti con tabella NUMERI_DIALETTO (cifre → parola).
// mn non è incluso perché non ha la propria tabella in NUMERI_DIALETTO.
const DIALETTI_NUMERI = ["sp", "ge", "cr"];

// Mappa cifre → parole per dialetti (accetta "2" al posto di "dó" ecc.)
const NUMERI_DIALETTO = {
  sp: { "1": "in/en", "2": "dó", "3": "tré", "4": "quàtro", "5": "sénco", "6": "séi", "7": "séte", "8": "òto", "9": "nòve", "10": "diése" },
  cr: { "1": "un",    "2": "du",  "3": "tri", "4": "quatar", "5": "sénch", "6": "sei", "7": "sèt",  "8": "oto", "9": "nov",  "10": "déxe" },
  ge: { "1": "un",    "2": "dôe", "3": "trei", "4": "quattro","5": "çìnque","6": "sei", "7": "sètte","8": "ötto","9": "növe", "10": "diéxi" }
};

// Frasi scherzose in spezzino mostrate a fine esercizio (Allenamento/Quiz).
// Convenzione tts/vis come per il vocabolario sp: la TTS italiana legge `tts`,
// la UI mostra `vis`. Fasce per percentuale: min/max inclusivi, omessi = nessun limite.
//   - alta: min:80     (vittoria)
//   - media: min:50, max:79
//   - bassa: max:49    (bonario, mai offensivo)
// Campo opzionale `audio`: nome file sotto audio/sp/ (es. "belina-deh.mp3") con
// una registrazione vera al posto della TTS italiana "ingannata". Se assente,
// resta il fallback TTS su `tts` (comportamento invariato). Vedi audioVoce()
// in index.html per la stessa convenzione sulle voci del vocabolario.
const FRASI_FINE_SP = [
  { tts: "beelìiina dé... e chiteiiii ?", vis: "belina deh, e chi t'ei?", min: 80 },
  { tts: "mahcòstéféee??", vis: "ma costefé??", max: 49 },
  { tts: "te me pai naase", vis: "te me pai n'ase", max: 49 },
  { tts: "mia che te miio'''''''''' :'''''''''ooòcio", vis: "mia che te mio  ocio", min: 50, max: 79 },
  { tts: "teiin pagiasso", vis: "t'ei un pagiasso", max: 49 }
];

// ── Estrazione e display ─────────────────────────────────────────────────

// soloVisibile: rimuove le alternative nascoste (separate da |).
// Es. "cammino|tragitto|distanza" -> "cammino"
// Le alternative dopo | sono accettate da isCorretta ma mai mostrate né lette dal TTS.
function soloVisibile(s) {
  if (!s || typeof s !== "string") return s;
  const i = s.indexOf("|");
  return i < 0 ? s : s.slice(0, i).trim();
}

// formaDisplay: come mostrare la "soluzione corretta" all'utente.
// - Rimuove sempre le alternative nascoste (dopo |)
// - Per dialetti: mostra solo la forma tradizionale (ultima dopo /).
//   NB: split solo su "/", non su ",;" — la virgola/punto e virgola separa
//   sinonimi (vanno mostrati tutti, e il primo coincide con la TTS).
// - Per altre lingue: mostra tutto (i sinonimi sono utili da vedere)
function formaDisplay(s, codLingua) {
  if (!s || typeof s !== "string") return s;
  s = soloVisibile(s);
  if (!DIALETTI_TTS_ITA.includes(codLingua)) return s;
  const parts = s.split("/").map(p => p.trim()).filter(Boolean);
  if (parts.length <= 1) return s;
  return parts[parts.length - 1];
}

// formaTTS: cosa leggere alla TTS.
// - Rimuove sempre le alternative nascoste (dopo |)
// - Split solo su "/" (in dialetti separa TTS/grafia; in altre lingue
//   eviterebbe di sentire "mamma slash madre"): prende la prima parte.
// - Virgola e punto e virgola NON splittano: vengono lette come punteggiatura,
//   così frasi tipo sp:"no, a chino ciü en là" si sentono per intero.
function formaTTS(s) {
  if (!s || typeof s !== "string") return s;
  s = soloVisibile(s);
  const parts = s.split("/").map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return s;
  return parts[0];
}

// ── Normalizzazione (per match risposte utente) ──────────────────────────

function normalizza(str) {
  // "\u00e6" (grafia genovese, es. "amm\u00e6") \u00e8 una legatura Unicode non scomponibile
  // da NFD: senza questa riga il filtro successivo la elimina silenziosamente
  // invece di convertirla (es. "amm\u00e6" -> "amm" invece di "amme").
  // Lettere greche (\u03b1-\u03c9) tenute: senza, una risposta in greco antico diventava
  // vuota e risultava sempre sbagliata. Accenti/spiriti/iota sottoscritto
  // sono segni combinanti e cadono con il filtro NFD; \u03c2 finale = \u03c3.
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u00e6/g, "e").replace(/\u03c2/g, "\u03c3").replace(/[-_]/g, " ").replace(/[^a-z\u03b1-\u03c9\s]/g, "").replace(/\s+/g, " ").trim();
}

// Normalizza per dialetti: rimuove prefissi fonetici comuni (gh', sc', etc.)
function normalizzaDialetto(str) {
  const n = normalizza(str);
  return n.replace(/^(gh|sc|sgn|gn)/, "");
}

// Coniugazioni sp/ge: le forme sono scritte con pronome soggetto e/o
// particella clitica obbligatoria davanti al verbo (es. sp "i g'agia",
// ge "lê o l'agge", ge "che mi agge"). Questa funzione toglie soggetto,
// clitico e (per sp) l'infisso "g'"/"gh'" di avere, isolando la sola
// radice verbale — così la risposta "agia" viene accettata oltre a
// "i g'agia". Usata solo come candidato IN PIÙ per isCorretta, mai per
// il testo mostrato/letto (quello resta la forma completa in atteso).
function formaBaseDialetto(str) {
  let t = str.trim();
  t = t.replace(/^che\s+/i, ""); // congiuntivo ge ("che mi agge")
  t = t.replace(/^(mi|ti|lé|lê|niatri|viatri|liatri|no[aà]ltri|vo[aà]ltri)\s+/i, ""); // soggetto pieno (ge, cr)
  t = t.replace(/^(a|te|ti|i|o|u)['’]\s*/i, ""); // clitico + apostrofo isolato
  t = t.replace(/^(a|te|ti|i|o|u|la)\s+/i, ""); // clitico staccato (sp; "la" = 3ª sing. f.)
  t = t.replace(/^[tl]['’]/i, ""); // clitico eliso fuso alla radice (t'æ, l'agge)
  t = t.replace(/^g['’]?h?['’]?/i, ""); // infisso avere spezzino (g'/gh')
  return normalizza(t);
}

// Genera, per una stringa atteso (eventualmente con alternative separate da
// "/ , ; |"), le varianti "solo radice verbale" da aggiungere come candidati
// extra al confronto — una per ogni alternativa che ha davvero un prefisso
// da togliere (altrimenti sarebbe un duplicato inutile).
function variantiBaseDialetto(atteso) {
  // Anche le alternative nascoste (dopo "|"): "a vëgne|a ven" deve accettare
  // "ven" oltre a "vëgne". Sono solo candidati per isCorretta, mai mostrati.
  // Da quelle nascoste però niente basi sotto le 3 lettere: isCorretta accetta
  // qualunque risposta che CONTENGA un'attesa di ≤4 lettere, e "o veu|o eu" →
  // "eu" farebbe passare anche "veuan" (3ª plur.).
  const visibili = soloVisibile(atteso).split(/[/,;|]/).map(s => s.trim()).filter(Boolean);
  const iNascoste = atteso.indexOf("|");
  const nascoste = iNascoste < 0 ? [] : atteso.slice(iNascoste + 1).split(/[/,;|]/).map(s => s.trim()).filter(Boolean);
  const base = p => { const b = formaBaseDialetto(p); return b && b !== normalizza(p) ? b : null; };
  const basi = [
    ...visibili.map(base),
    ...nascoste.map(base).filter(b => b && b.length >= 3),
  ].filter(Boolean);
  return [...new Set(basi)];
}

// Varianti intermedie, tra la forma intera e quella nuda: senza "che"
// (congiuntivo) e senza soggetto pieno, ma CON il clitico obbligatorio.
// In genovese il soggetto pieno è facoltativo e il clitico no: "o l'amma",
// "t'è", "mi amme" (cong.) sono le risposte più naturali. Come
// variantiBaseDialetto: solo candidati per isCorretta, mai mostrati.
function variantiSenzaSoggettoDialetto(atteso) {
  const parti = atteso.split(/[/,;|]/).map(s => s.trim()).filter(Boolean);
  const out = [];
  for (const p of parti) {
    const senzaChe = p.replace(/^che\s+/i, "");
    const senzaSogg = senzaChe.replace(/^(mi|ti|lé|lê|le|niatri|viatri|liatri)\s+/i, "");
    // sp avere: anche senza clitico davanti a g'/gh' ("te g'avevi" → "g'avevi",
    // confermato da Dino)
    const senzaCliticoG = senzaSogg.replace(/^(a|te|i|la)\s+(?=gh?['’])/i, "");
    for (const v of [senzaChe, senzaSogg, senzaCliticoG]) {
      const n = normalizza(v);
      if (n && n !== normalizza(p)) out.push(n);
    }
  }
  return [...new Set(out)];
}

// Espande contrazioni inglesi comuni
function espandiContrazioni(str) {
  return str.replace(/i'll/gi, "i will").replace(/i'm/gi, "i am").replace(/i've/gi, "i have").replace(/i'd/gi, "i would").replace(/you'll/gi, "you will").replace(/you're/gi, "you are").replace(/you've/gi, "you have").replace(/you'd/gi, "you would").replace(/he'll/gi, "he will").replace(/he's/gi, "he is").replace(/he'd/gi, "he would").replace(/she'll/gi, "she will").replace(/she's/gi, "she is").replace(/she'd/gi, "she would").replace(/we'll/gi, "we will").replace(/we're/gi, "we are").replace(/we've/gi, "we have").replace(/we'd/gi, "we would").replace(/they'll/gi, "they will").replace(/they're/gi, "they are").replace(/they've/gi, "they have").replace(/they'd/gi, "they would").replace(/won't/gi, "will not").replace(/can't/gi, "cannot").replace(/cannot/gi, "can not").replace(/don't/gi, "do not").replace(/doesn't/gi, "does not").replace(/didn't/gi, "did not").replace(/isn't/gi, "is not").replace(/aren't/gi, "are not").replace(/wasn't/gi, "was not").replace(/weren't/gi, "were not").replace(/hadn't/gi, "had not").replace(/hasn't/gi, "has not").replace(/haven't/gi, "have not").replace(/wouldn't/gi, "would not").replace(/couldn't/gi, "could not").replace(/shouldn't/gi, "should not").replace(/it's/gi, "it is").replace(/that's/gi, "that is").replace(/there's/gi, "there is").replace(/what's/gi, "what is");
}

// Accetta sia "eat" che "to eat" per verbi inglesi
function normalizzaEn(str) {
  const expanded = espandiContrazioni(str);
  const n = normalizza(expanded);
  return n.startsWith("to ") ? n.slice(3) : n;
}

// Converte "2" in "dó" (sp), "du" (cr), "dôe" (ge), ecc. Solo per dialetti
// elencati in DIALETTI_NUMERI. Per altri codici lingua ritorna `testo` invariato.
function convertiNumeriDialetto(testo, codLingua) {
  const map = NUMERI_DIALETTO[codLingua];
  if (!map) return testo;
  return map[testo.trim()] || testo;
}

// ── Helpers vocabolario ──────────────────────────────────────────────────

// Chiave stabile per le statistiche SM-2: la traduzione "principale"
// (prima del primo |) di una voce. Aggiungere/rimuovere alternative dopo |
// non rompe la chiave.
function wordKey(entry) {
  const raw = entry.it || entry.en || Object.values(entry).find(v => typeof v === "string" && v.trim());
  return typeof raw === "string" ? soloVisibile(raw) : raw;
}

// Pesca una frase scherzosa spezzina coerente con il punteggio. null se nessuna
// frase è disponibile per quella fascia (non dovrebbe mai succedere col set attuale).
function frasaFineSP(perc) {
  const cand = FRASI_FINE_SP.filter(f =>
    (f.min === undefined || perc >= f.min) &&
    (f.max === undefined || perc <= f.max)
  );
  return cand.length ? cand[Math.floor(Math.random() * cand.length)] : null;
}

// ── Aiutino sulle risposte "quasi giuste" ────────────────────────────────

// Distanza di modifica (Damerau "optimal string alignment"): sostituzione,
// inserimento, cancellazione e scambio di due lettere vicine valgono 1.
function distanzaOSA(a, b) {
  const d = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

// Se `dato` è sbagliato di poco rispetto a una delle forme di `atteso`
// (1 lettera fino a 5 lettere, 2 oltre), restituisce { forma } con la forma
// più vicina così come è scritta nel vocabolario; altrimenti null.
// Stesse regole di isCorretta: sinonimi su "/ , ; |", parentesi ignorate,
// accenti e maiuscole non contano, in inglese il "to" iniziale è facoltativo.
function quasiGiusta(atteso, dato, codLingua) {
  if (!atteso || !dato) return null;
  const isEn = codLingua === "en";
  const senzaTo = s => s.startsWith("to ") ? s.slice(3) : s;
  const nDato = isEn ? normalizzaEn(dato) : normalizza(dato);
  if (!nDato) return null;
  const datoConTo = isEn && normalizza(dato).startsWith("to ");
  let migliore = null;
  for (const grezza of atteso.split(/[/,;|]/)) {
    let forma = grezza.replace(/\(.*?\)/g, "").trim();
    let nForma = normalizza(forma);
    if (!nForma) continue;
    if (isEn && !datoConTo && nForma.startsWith("to ")) { forma = forma.replace(/^to\s+/i, ""); nForma = senzaTo(nForma); }
    const nConfronto = isEn ? senzaTo(nForma) : nForma;
    const dist = distanzaOSA(nConfronto, nDato);
    if (dist === 0) return null;
    const soglia = nConfronto.replace(/\s/g, "").length <= 5 ? 1 : 2;
    if (dist <= soglia && (!migliore || dist < migliore.dist)) migliore = { forma, dist };
  }
  return migliore ? { forma: migliore.forma } : null;
}

// La forma giusta con "_" al posto delle lettere che nella risposta mancano
// o sono sbagliate. Spazi, apostrofi e accenti della forma restano visibili.
function mascheraAiutino(forma, dato) {
  const chars = [...forma];
  const pos = [], a = [];
  chars.forEach((c, i) => { const b = normalizza(c); if (b) { pos.push(i); a.push(b); } });
  const b = [...normalizza(dato).replace(/\s/g, "")];
  const d = [];
  for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  // Ripercorre l'allineamento dalla fine: le lettere della forma allineate a
  // una lettera uguale restano, le altre diventano "_".
  const visibile = new Array(a.length).fill(false);
  let i = a.length, j = b.length;
  while (i > 0) {
    if (j > 0 && a[i - 1] === b[j - 1] && d[i][j] === d[i - 1][j - 1]) { visibile[i - 1] = true; i--; j--; }
    else if (j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { i--; j--; }
    else if (d[i][j] === d[i - 1][j] + 1) i--;
    else j--;
  }
  visibile.forEach((v, k) => { if (!v) chars[pos[k]] = "_"; });
  return chars.join("");
}

// ── Export per browser + Node ────────────────────────────────────────────

const _exports = {
  DIALETTI_TTS_ITA, DIALETTI_NUMERI, NUMERI_DIALETTO, FRASI_FINE_SP,
  soloVisibile, formaDisplay, formaTTS,
  normalizza, normalizzaDialetto, espandiContrazioni, normalizzaEn,
  convertiNumeriDialetto, wordKey, frasaFineSP,
  formaBaseDialetto, variantiBaseDialetto, variantiSenzaSoggettoDialetto,
  distanzaOSA, quasiGiusta, mascheraAiutino,
};
Object.assign(globalThis, _exports);
if (typeof module !== 'undefined' && module.exports) module.exports = _exports;
