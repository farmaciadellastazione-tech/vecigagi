# Analisi `index.html` — LinguaeQuiz

Data: 2026-05-16
File analizzato: `index.html` (~10.787 righe, React 18 + Babel + Tailwind via CDN, single-file).

Elenco ordinato per priorità.

## 🔴 Alta priorità

### 1. `mn` (manarolese) trattato in modo incoerente come dialetto
`index.html:3904` definisce `DIALETTI_TTS_ITA = ["mn", "sp", "ge", "cr"]`, ma negli altri punti chiave del codice il manarolese è escluso:
- `index.html:3942` (numeri dialetto), `:3961` (`isDialetto`), `:3964` (norm. finale in `isCorretta`), `:9216` (filtro lingue attive) usano l'array hard-coded `["sp", "ge", "cr"]`.

Conseguenza: per `mn` non viene applicata `normalizzaDialetto()` né la conversione cifre→parole. La voce ha la TTS italiana e la convenzione `pronuncia/grafia` per il display (giusto), ma nella verifica risposte si comporta come una lingua normale.

**Fix proposto**: o `mn` deve essere ovunque, o non sta in `DIALETTI_TTS_ITA`. Estrarre **una sola** costante e usarla ovunque (es. `DIALETTI_NUMERI` per i 3 con tabella numeri, `DIALETTI_TTS_ITA` per tutti e 4).

### 2. `JSON.parse(localStorage…)` senza `try/catch` in più punti
`index.html:3186, 3193, 3200, 3207, 10197` parsano direttamente: se un utente ha localStorage corrotto/sporcato (o cambia schema), l'app crasha al boot. Esiste già il pattern protetto a `:9004`.

**Fix proposto**: sostituire con un helper unico tipo `getJSON(key, fallback)`.

### 3. Convenzione `/` solo parzialmente rispettata
Le funzioni `formaDisplay`/`formaTTS` (`:3909-3938`) splittano su `/[/,;]/`, quindi trattano anche `,` e `;` come separatori. Per le lingue non-dialetto (`/` = sinonimi) è OK lasciar leggere solo la prima, ma il commento dice "evita di leggere mamma slash madre" — confermare che si voglia davvero scartare i sinonimi nel display di soluzione (a riga 3922 `if (!DIALETTI_TTS_ITA.includes…) return s;` lo fa intenzionalmente).

**Da verificare**: che `edit.html` produca sempre `pronuncia/grafia` (e non `grafia/pronuncia`) per `mn/sp/ge/cr` — il TTS legge sempre `parts[0]`.

### 4. ~~Reset progressi senza conferma~~ — falsa allarmata
**Verificato 2026-05-16: non applicabile.** Nessun bottone "reset progressi" esiste nell'app:
- `:4130` "Reset" è solo reset filtri locale (non distruttivo).
- `:7791` 🗑️ "Reset vocabolario" ha già `confirm()` e preserva i progressi.
- I 3 `localStorage.clear()` (`:3164`, `:10135`, `:10700`) sono path di recovery automatici (vocabolario corrotto, errore di boot, crash con `ErrorBoundary`), non azioni utente.

Cleanup secondario: la chiave i18n `resetbtn` (`:232, :397, :516, :657, :785, :916`) non è referenziata da nessuna parte → codice morto da rimuovere. ✅ **Fatto 2026-05-22**: rimosse tutte e 6 le definizioni (it/en/fr/es/de/pt).

## 🟡 Media priorità

### 5. Race condition su `speechSynthesis.cancel()` + `speak()`
`:3458-3475`, `:9404`, `:10376`: `cancel()` è asincrono nei browser Chromium; chiamate rapide possono produrre audio sovrapposto o silenzioso.

**Fix proposto**: piccolo debounce o un flag `lastUtterance` con `onend` per serializzare.

### 6. `useEffect` di generazione carte/domande con array vuoto
Verificare in `SceltaMultipla` (`~:9062`) e simili: se `[]` ma il corpo usa stato/props variabili (n. domande, lingue), cambi a runtime non rigenerano le carte.

**Fix proposto**: inserire le dipendenze reali o riavviare via `key=` sul componente.

✅ **Verificato 2026-05-22**: bug teorico ma non riproducibile nel flusso reale. Le props `lingue`/`vocabolario`/`filtri` cambiano solo dalla Home dove la schermata quiz non è montata; `nDom`/`nScelte` si aggiornano via `giocaAncora()` che chiama `generaCarte(nuovoStato)` esplicitamente. Aggiunti commenti esplicativi sui due `useEffect(()=>..., [])` di `SchermataSceltaMultipla` (`:9071`) e `SchermataFraseLibera` (`:9273`) per chiarire l'intento mount-only e prevenire fix sbagliati futuri. Non c'è ESLint nel progetto (React via CDN), quindi nessun warning `exhaustive-deps` da silenziare.

### 7. `getJSON` non centralizzato
`:3172` definisce un helper, ma `:3186-3207` e `:10197` non lo usano. Convergere su un'unica funzione protetta.

### 8. ✅ Accessibilità: aria-label e focus visibile — fatto (2026-07-09)
Tasti lingua/numero domande, pulsanti TTS/microfono: mancavano `aria-label` espliciti e lo stato attivo non era mai veicolato oltre al colore (un ternario nel `className`, invisibile a uno screen reader).

Aggiunto `aria-pressed` (riflette lo stato selezionato) a tutti i gruppi di bottoni "a scelta" individuati nel codice: `PannelloFiltri` (livello, tema), `PannelloLingue` (toggle ON/OFF), `PannelloBilingue` (scelta lingua B), `ConfigurazioneQuiz` (lingua-da, lingua-a, numero domande). Aggiunto `aria-label` dove mancava del tutto un testo accessibile: `PannelloLingue` (bottone 🗑 rimuovi, prima solo emoji senza etichetta) e `InputVocale` (bottone microfono 🎤/⏹, etichetta che riflette anche lo stato "in registrazione"). I pulsanti TTS "Ascolta lentamente" avevano già `aria-label`/`title` da un giro precedente (8 occorrenze), non toccati.

Test: `tests/accessibilita.test.mjs` — verifica strutturale sul sorgente reale (nessun jsdom/React come dipendenza npm). Verificato anche dal vivo (server statico locale + Playwright): `aria-pressed` cambia correttamente `false`→`true` al click, `aria-label` corretti ("Disattiva Italiano", "Rimuovi Italiano"), nessuna regressione visiva (gli attributi ARIA non hanno impatto sullo stile).

### 9. i18n della UI: chiavi mancanti nelle traduzioni
Gli ultimi commit (`5d0f66d`, `d6f05f5`) hanno rimosso duplicati in fr/de/pt/zh/ko/es: vale la pena un controllo automatico (script ad hoc) che ogni oggetto UI abbia le stesse chiavi della versione `it`, per evitare stringhe vuote silenti.

## 🟢 Bassa priorità / cleanup

### 10. Letture ripetute di `localStorage.getItem("linguaUI")`
Sparse (≈20 occorrenze). Non è un problema di performance reale (localStorage è sincrono e veloce), ma rende il codice fragile. Un hook `useLinguaUI()` o una `Context` semplifica.

### 11. Backup `index17.html`
CLAUDE.md dice di non toccarlo, ma vale la pena nominarlo `_archive/` o `.bak` per evitare che venga indicizzato da motori (è già su GitHub Pages).

### 12. `dangerouslySetInnerHTML`
Da Grep rapido non emerge: verificato OK lato sicurezza.

### 13. Codice morto / variabili non usate
Suggerisco un giro mirato con la skill `simplify` su porzioni grandi (es. il blocco modalità) — più produttivo che cercarlo a mano in 10.787 righe.

---

## Ordine di intervento suggerito

I due interventi a maggior rapporto valore/costo:

1. **#1** — uniformare la gestione di `mn` nei dialetti (rischio dati reali sbagliati nel quiz).
2. **#2** — try/catch / `getJSON` su tutti i `JSON.parse(localStorage…)` (rischio crash al boot).

A seguire #4 (conferma reset) e #5 (race TTS).

---

## Stato fix

- ✅ **#1 fatto (2026-05-16)** — introdotte `DIALETTI_TTS_ITA` (tutti e 4) e `DIALETTI_NUMERI` (solo `sp/ge/cr`); rimossi gli array `["sp","ge","cr"]` hardcoded in `isCorretta` e nel filtro Frase Libera AI.
- ✅ **#2 fatto (2026-05-16)** — refactor verso `loadJSON`/`saveJSON`: rimosse le IIFE try/catch in `esportaProgressi`, gli `setItem(... JSON.stringify(...))` in `importaProgressi` e nell'`useEffect` di `aiSettings`, semplificata l'inizializzazione di `aiSettings` e di `loadStato/salvaStato` in `SceltaMultipla`. Tutti i parse passano ora dall'helper protetto. *Nota: l'analisi originale parlava di "mancanza di try/catch", ma in realtà i punti erano già protetti — il valore del fix è uniformità e uso delle costanti `SK_*` (prima alcune chiavi erano stringhe hardcoded come `"qml_v10_ai"`).*
- ✅ **#5 fatto (2026-05-16)** — serializzazione di `parla()`: aggiunta variabile `_parlaTimer` per evitare timer sovrapposti; se `speechSynthesis.speaking || .pending`, chiama `cancel()` e ritarda `speak()` di 60 ms (cancel() è asincrono in Chromium e provocava audio scartato/sovrapposto su click rapidi). Nessuna API esterna cambia: `parla(testo, bcp47)` resta identico per i chiamanti.
- ❌ **#4 non applicabile (2026-05-16)** — l'analisi originale aveva interpretato male il codice. Vedi sezione 4 sopra: tutti i path distruttivi sono o già protetti o di recovery automatico.
- 🔍 **#3 audit fatto (2026-05-22), correzioni in sospeso** — verificato che `edit.html` rispetta la convenzione `pronuncia/grafia` (banner help, prompt AI `aiTrascriviTTS`, esportazione CSV). Scan di 247 coppie con `/` nei campi `mn/sp/ge/cr`. Voci sospette elencate sotto: vanno corrette caso per caso a mano.
- ✅ **AI default model (2026-05-16, fuori dalla lista originale)** — cambiato il default AI provider da Groq/Llama-3.1-8b-instant (debole su multilingua: generava output in lingua sbagliata e grammatica inventata) a Google Gemini 2.5 Flash (`:8109-8112`, prima era 2.0 Flash che va in EOL il 1° giugno 2026). Modificati: fallback `callAI` (`:8115`), default `aiSettings` (`:10182`), default UI `:8298`, riordino `PROVIDERS` con Gemini primo + label "consigliato 🆓", aggiornato messaggio fallback no-key (`:8997`). Utenti esistenti con provider già salvato non sono toccati (solo nuovi utenti vedono Gemini come default).
- ✅ **Cleanup `resetbtn` (2026-05-22)** — rimosse 6 definizioni dialetti morte (it/en/fr/es/de/pt). Commit `aecdf60`.
- ✅ **#6 (2026-05-22)** — bug teorico ma non riproducibile. Aggiunti commenti su `useEffect(()=>..., [])` di `SchermataSceltaMultipla` e `SchermataFraseLibera` per chiarire l'intento mount-only.
- ✅ **Prompt AI verificaFrase (2026-05-22)** — riscritto il system prompt di `SchermataFraseLibera.verificaFrase`: era misto francese/inglese ("Tu es un professeur de langues...") con output schema condensato in una riga, niente few-shot. Nuovo prompt tutto in inglese (coerente con chiavi JSON `correct/correction/grammar/example` e con `traduci()` che usa già inglese), con: (a) campo-per-campo spiegazione del JSON, (b) nota esplicita che `correct` deve essere JSON boolean, non stringa (il display usa `===` strict), (c) due esempi few-shot di formato. La regola "all text in ${langName}" è ripetuta sia in system che in user prompt.
- ✅ **#9 fatto (2026-07-11)** — `tests/i18nUI.test.mjs`: estrae l'oggetto `UI` reale dal sorgente (pre-merge fallback) e verifica: parità completa di chiavi tra `it` e tutte le lingue (mancanti E orfane, con elenco nel messaggio), nessun valore vuoto/non-stringa, coerenza delle tre liste di lingue scritte a mano in punti diversi (`UI`, `UI_LINGUE`, `supported` in `detectUILang`), esistenza in `en` delle chiavi usate negli accessi diretti `UI[getUILang()].chiave`. Stato al momento del fix: 128 chiavi identiche in tutte e 10 le lingue (il commento nel sorgente su ru/ca/zh/ko "parziali" è superato: oggi sono complete; il merge di fallback resta come rete di sicurezza). Verificato in negativo: rimuovendo una chiave da `ca` il test fallisce elencandola. Nota tecnica: gli array estratti via `vm.runInNewContext` hanno prototipi di un altro realm — normalizzare con `Array.from` prima di `deepStrictEqual`.

---

## Audit fix #3 — voci sospette nel vocabolario (2026-05-22)

Scan eseguito su 247 coppie `pronuncia/grafia` nei campi `mn/sp/ge/cr`. Tre categorie di anomalie. **Lista da decidere caso per caso, nessuna modifica applicata.**

### Gruppo A — duplicati (slash inutile, parti identiche) ✅ corretto 2026-05-22

Slash rimosso, lasciata una sola occorrenza.

| Lang | Valore precedente | Nuovo valore |
|---|---|---|
| ge | `gatto/gatto` | `gatto` |
| mn | `melanzana/melanzana` | `melanzana` |
| mn | `ananas/ananas` | `ananas` |
| mn | `ingrediente/ingrediente` | `ingrediente` |

### Gruppo B — convenzione `dialetto/italiano` invece di `pronuncia/grafia` ✅ corretto 2026-05-22

Parte italiana rimossa (già presente nel campo `it`).

| Lang | Valore precedente | Nuovo valore |
|---|---|---|
| cr | `branzin/branzino` | `branzin` |
| cr | `camalà/camallare` | `camalà` |
| ge | `tosse con cataro/tosse con catarro` | `tosse con cataro` |
| ge | `baratöu/barattolo` | `baratöu` |
| cr | `bongiorn / buongiorno` | `bongiorn` |
| cr | `bun sera / buonasera` | `bun sera` |

### Gruppo C — apostrofo `s'X` (ordine invertito) ✅ corretto 2026-05-22

In ligure/manarolese `s'c` con apostrofo distingue `[stʃ]` da `[ʃ]`. È **grafia tradizionale**, non pronuncia. La TTS italiana ignora l'apostrofo, quindi `s'ciàfu` e `sciàfu` suonano uguali — ma la convenzione vuole pronuncia in P1, grafia in P2.

Inversione applicata mantenendo gli spazi interni originali (`s' ciopu`, `s' ciancà`); pulito uno spazio anomalo dopo `/` nella voce schioppo.

| Lang | Valore precedente | Nuovo valore |
|---|---|---|
| mn | `s'ciàfu/sciàfu` | `sciàfu/s'ciàfu` |
| mn | `s' ciopu/ sciòpu` | `sciòpu/s' ciopu` |
| mn | `s' ciancà/sciancà` | `sciancà/s' ciancà` |
| mn | `s'ciancùn/sciancùn` | `sciancùn/s'ciancùn` |

### Gruppo D — casi ambigui ✅ analizzati 2026-05-22, nessuna correzione necessaria

**Chiarimento dell'autore (2026-05-22)**: la `d'` davanti a `z` in voci come `d'zena`, `d'zeneo`, `d'zèneo` è un **trucco TTS intenzionale**, NON un errore. Serve a far pronunciare il suono [z] sonoro (la `s` di "casa"/"rosa" del nord italia) perché la TTS italiana legge la `z` come affricata sorda [ts] (es. "zucchero"). Mettendo `d'` davanti, la TTS produce [dz] ≈ [z]. Quindi le 4 voci con `d'z` sono già conformi alla convenzione `pronuncia/grafia`.

Le restanti voci del gruppo D risultano anch'esse coerenti con la convenzione (P1 italianizzata per TTS, P2 grafia tradizionale).

| Lang | Valore | it | Verdict |
|---|---|---|---|
| sp | `d'zena/Zena` | Genova | ✅ OK (d'z = TTS trick per [z]) |
| ge | `d'zena/Zena` | Genova | ✅ OK |
| sp | `d'zeneo/zéneo` | genero | ✅ OK |
| ge | `d'zèneo/zeneo` | genero | ✅ OK |
| cr | `cand'da/candeda` | candela | ✅ OK (apostrofo = e sincopata, TTS legge ≈ pronuncia reale) |
| cr | `v'ci/veç` | vecchio | ✅ probabile OK |
| mn | `v'ree ben/vrëëbën` | amare | ✅ OK |
| mn | `tra'féguu/tràfégu` | traffico, movimento | ✅ OK |
| mn | `sghi'nda/zghìnda` | colui che evita | ✅ OK |
| sp | `amen baato 'r belin/a men bato er belin` | me ne frego | ✅ OK |

**Suggerimento**: il trucco `d'z` per simulare [z] sonoro è una convenzione fonetica non documentata in `CLAUDE.md`. Aggiungerla aiuterebbe future sessioni di audit a non segnalare falsi positivi.

### Note sull'audit

Il primo passaggio (score fonetico) aveva segnalato 33 candidati ma includeva molti falsi positivi (es. `sgualdrìna/zgùaldrina` è OK: P1 italianizzata, P2 con `z-` dialettale tipica). Le tre categorie A/B/C sono il filtraggio più affidabile.

Non audited: voci con `/` nei campi non-dialetto (es. `cr:"branzin/branzino"` se vista come sinonimi vs. pronuncia/grafia — `cr` è dialetto secondo `DIALETTI_TTS_ITA`, quindi va trattata come pronuncia/grafia).

---

## Audit completo 2026-07-08

File analizzato: `index.html` (12.304 righe, ~800KB — ~5.900 righe di dati, ~6.400 di codice). Letto integralmente il codice; blocchi dati (i18n UI, VOCABOLARIO_DEFAULT, CONIUGAZIONI, NUMERI/OMOFONI) solo mappati.

### 🔴 R1. Recovery con `localStorage.clear()` cancella contenuti unici dell'utente

`ErrorBoundary.componentDidCatch` (~:12204), catch di `caricaVocabolario` (~:3824) e init di `App` (~:11558) fanno `localStorage.clear()`. Nato quando cancellava solo progressi ricostruibili, oggi cancella anche `SK_STORIE_PRIVATE` (testi privati che esistono SOLO in quel browser), il token GitHub admin (`gh_pat_vecigagi`), la chiave API IA, tema e lingua UI. Un bug di render qualsiasi = perdita irreversibile.

**Fix**: helper `resetStorageRecovery()` con whitelist esplicita delle sole chiavi di stato app (SK_VOC, SK_STATS, ecc.); mai `clear()`, mai chiavi sconosciute (edit.html/dialetti.html condividono l'origin).

### 🔴 R2. Provider "Anthropic Claude" non funzionante dal browser

`callAI` (~:8744) chiama `api.anthropic.com` senza l'header `anthropic-dangerous-direct-browser-access: true`, obbligatorio per CORS da browser: la fetch viene bloccata → "Errore connessione". Inoltre `callAI` non controlla `res.ok` per nessun provider (401/429 → "Errore risposta AI" generico).

### 🟡 R3. Correzioni utente alle voci default perse a ogni bump di VOC_VERSION

`mergeVocabolario` (~:3794) conserva solo le voci *nuove* dell'utente: le modifiche via ✏️/"Segnala errore" a voci default spariscono silenziosamente al successivo salvataggio da edit.html (che bumpa sempre). By design, ma senza avviso all'utente. Policy da decidere, non bug.

### 🟡 R4. Quota localStorage senza segnalazione

`SK_VOC` duplica l'intero vocabolario (~600KB) anche se identico al default; `saveJSON` ha `catch {}`: a quota piena (≈5MB mobile) i progressi smettono di salvarsi senza alcun errore visibile. Possibile: salvare solo le voci custom + avvisare al fallimento.

### 🟡 R5. Streak incoerente tra modalità

Aggiornato solo in `SchermataQuiz.avanti()`: Scelta multipla (modalità d'ingresso Lv0) e Lettura guidata non lo toccano mai.

### 🟡 R6. `BtnAudio` sovrascrive handler globale

Ogni istanza fa `window.speechSynthesis.onvoiceschanged = check` (~:4609) senza cleanup: con più bottoni montati solo l'ultimo riceve gli aggiornamenti. Usare `addEventListener` + cleanup nell'`useEffect`.

### 🟢 Minori

- Eliminazione parola dal Vocabolario senza `confirm` (~:9491); per voci default torna comunque al prossimo bump (vedi R3, direzione opposta).
- Prop `"aria-label"` duplicata (~:4626, ~:9865). ✅ **Fatto 2026-07-11** (commit `a37f061`): rimossa la chiave ripetuta nei due bottoni 🐢 (BtnAudio e scelta multipla), valore identico quindi nessun cambio di comportamento.
- `Home` ricalcola `parolaAppresa`/`contaScadute` su tutto il vocabolario a ogni render senza memo (~50k lookup con 6 lingue attive). Non misurato come problema reale.
- Verificato OK: l'oggetto `UI` copre tutte le 10 lingue di `detectUILang` (nessun rischio `UI[lang] === undefined`); `TOUR_STEPS_I18N` idem.

### Bundle

~48% del file sono dati: CONIUGAZIONI (~2.250 righe), VOCABOLARIO (~1.750), i18n UI (~1.300), tour+numeri+omofoni (~600). Gzip di GitHub Pages mitiga la rete, resta il parse. Estrazioni possibili: i18n lingue non attive; CONIUGAZIONI (ma serve a `estraiCarte` → non lazy banale). **Vincolo**: `VOCABOLARIO_DEFAULT` resta in index.html finché edit.html/dialetti.html lo riscrivono lì.

### Stato fix audit 2026-07-08

- ✅ **R1 fatto (2026-07-08)** — `resetStorageRecovery()` con whitelist `SK_RESET_RECOVERY`; sostituiti i 3 `localStorage.clear()`. Preservate: storie private, candidati LG, chiave API, token GitHub, tema, lingua UI, tour visto. Test: `tests/recovery.test.mjs`.
- ✅ **R2 fatto (2026-07-08)** — aggiunto header `anthropic-dangerous-direct-browser-access: true` alla chiamata Anthropic (obbligatorio per CORS da browser, senza restava bloccata silenziosamente come "Errore connessione"). Aggiunto controllo `res.ok` su tutti e tre i provider: un errore HTTP (401 chiave errata, 429 rate limit, ecc.) ora restituisce `Errore AI (HTTP <status>): <dettaglio>` invece del generico "Errore risposta AI" indistinguibile da un JSON valido ma inatteso. Nuova funzione `messaggioErroreHttpAI(res, d)`. Test: `tests/callAI.test.mjs` (funzione reale via vm, fetch mockato).
- ✅ **R6 fatto (2026-07-08)** — `BtnAudio` non assegna più direttamente `window.speechSynthesis.onvoiceschanged = check` (con più bottoni montati solo l'ultimo riceveva gli aggiornamenti). Ora usa `addEventListener("voiceschanged", check)` con `removeEventListener` nel cleanup dell'`useEffect`. Test: `tests/btnAudio.test.mjs` — verifica strutturale sul sorgente reale (il progetto non ha jsdom/React come dipendenza npm, quindi non è possibile montare/smontare davvero il componente in test).
- ✅ **R4 fatto (2026-07-08)** — `SK_VOC` persiste ora SOLO il delta (voci non presenti in `VOCABOLARIO_DEFAULT`, nuova funzione `vociCustom()`), mai l'intero array completo (~600KB duplicati). Aggiornati i 3 punti di scrittura: `mergeVocabolario`, l'`useEffect` di persistenza in `App`, `handleImporta`. `caricaVocabolario` ora ricostruisce sempre `[...VOCABOLARIO_DEFAULT, ...custom]` (non solo al bump di `VOC_VERSION`): self-healing automatico per chi ha ancora il vecchio formato "array completo" salvato da prima di questo fix, senza bisogno di bump di versione per la migrazione. Rimosso il controllo `salvato.length === 0 → corrotto`: un delta vuoto (nessuna parola custom) è ora uno stato valido. `saveJSON` ritorna `true`/`false` e logga `console.warn` sul fallimento (visibile in devtools) invece di fallire in silenzio — un avviso *utente* resta una decisione UX a parte, non implementata qui. Test: `tests/vocDelta.test.mjs` (funzioni reali via vm, incluso lo scenario self-healing; verificato fallire su codice originale via `git stash`, passare dopo il fix).
- ✅ **R5 fatto (2026-07-08)** — `aggiornaStreak()` estratta da funzione locale dentro `avanti()` (usabile solo da `SchermataQuiz`) a livello di `App`, passata come prop `onStreak` anche a `SchermataSceltaMultipla` (chiamata a fine sessione se almeno 1 risposta corretta, stessa condizione di `SchermataQuiz`) e `SchermataLetturaGuidata` (chiamata una sola volta per visita, alla prima interazione sostanziale con una frase — rivelarne la traduzione o cambiare frase; scelta dell'autore tra le opzioni proposte). Test: `tests/streak.test.mjs` — parte comportamentale pura (i 4 rami di calcolo dello streak, via vm) + parte strutturale sul cablaggio (prop passate, chiamate presenti nel sorgente reale). *Effetto collaterale scoperto e corretto in corsa*: il tokenizer `extractFn` copiato tra i file di test non gestiva i commenti (`//`/`/* */`), quindi gli apostrofi nei commenti in italiano (es. "l'API", "l'utente") venivano scambiati per apertura di stringa — funzionava "per fortuna" quando il numero di apostrofi nei commenti attraversati era pari. Una modifica in `SchermataSceltaMultipla` (nuovo commento con "l'aggiornamento") ha rotto `tests/callAI.test.mjs`, che estraeva codice a valle. Corretto il tokenizer in `tests/callAI.test.mjs` e `tests/streak.test.mjs` (comment-aware); gli altri file di test (`recovery`, `btnAudio`, `vocDelta`, `cleanup`) usano ancora la versione non comment-aware e continuano a funzionare "per fortuna" — stessa fragilità latente, non toccata perché non in regressione.
- ✅ **R3 fatto (2026-07-09)** — decisione di prodotto: le due vie di correzione restano diverse. **✏️ nel Vocabolario**: resta SOLO locale, nessuna email (l'utente può personalizzare una voce per sé senza proporla a tutti). **🚩 "Segnala errore" nel quiz**: invia la correzione via email a `linguaequiz@gmail.com` (stesso meccanismo mailto di "Proponi una storia"), SOLO se la voce esiste nel default (le parole custom dell'utente sono già "sue", non ha senso proporsele da solo) e solo se c'è una differenza reale. Nuove funzioni: `campiModificati(vecchia, nuova)` (diff campo per campo, pura) e `proponiCorrezioneParola(vecchia, nuova)` (guardia + costruzione mailto). Test: `tests/correzioneParola.test.mjs`.
  **Precondizione scoperta e corretta in corsa**: implementare "✏️ resta locale" richiedeva che le modifiche a voci del default sopravvivessero ai reload — ma R4 (persistenza solo-delta) aveva introdotto una regressione: `vociCustom` filtrava per sola PRESENZA del wordKey nel default (non per differenza di contenuto), quindi un campo modificato con `it` invariato veniva scartato dal delta e la modifica spariva già al **reload successivo** (prima di R4 spariva solo al bump di `VOC_VERSION`, quindi peggiorativo). Corretto `vociCustom` per confrontare il contenuto, non solo la chiave. Questo ha rivelato un secondo problema più sottile: il vocabolario contiene **26 gruppi di omonimi reali** (stesso wordKey, voci diverse per tema/senso — es. due voci "adesso"), e un `Map(wordKey → voce)` ne perde uno per collisione. Riscritti `vociCustom`/`mergeVocabolario` con `raggruppaPerChiave()`: confrontano/consumano le voci custom contro TUTTI gli omonimi con quella chiave, non solo il primo, così una modifica su un omonimo non tocca né duplica il gemello invariato. Test aggiunti in `tests/vocDelta.test.mjs` (voce default modificata, dedup nel merge, roundtrip su reload multipli, scenario omonimi dedicato).
  **Verifica dal vivo (2026-07-09)**: merge su `main` + test end-to-end con server statico locale e Playwright. Confermato: 🚩 Segnala errore apre il modale, salva in locale, genera correttamente il mailto con il diff (intercettato via CDP `Page.frameRequestedNavigation`, dato che `framenavigated` non si attiva per schemi `mailto:`); ✏️ nel Vocabolario salva in locale senza alcun tentativo di invio email; nessun errore console in tutta la sessione.

### Bug trovato durante la verifica: spiegazione IA mostra JSON grezzo se la risposta arriva troncata

Durante la verifica dal vivo di R3, richiesti alcuni screenshot Drive del 2026-07-08 (precedenti a tutte le modifiche di questa sessione) che mostravano, in Lettura guidata, la spiegazione IA di una parola sostituita dal JSON grezzo e troncato, es. `{"spiegazione": "«Propio» è la variante spezzina di` — riprodotto sia su una storia in spezzino che su una in tedesco.

**Causa**: `callAI` ha `max_tokens`/`maxOutputTokens` fisso a 300 per tutti i provider. Se la risposta dell'IA viene tagliata prima della `}` di chiusura, in `spiegaParola` (componente `SchermataLetturaGuidata`) il regex `/\{[\s\S]*\}/` non trova alcun match (nessuna `}` presente) → `JSON.parse` non viene nemmeno tentato → il codice ricadeva su `clean.slice(0, 300)`, mostrando il testo grezzo (compreso il `{"spiegazione":` iniziale) come se fosse la spiegazione.

- ✅ **Fatto (2026-07-09)** — nuova funzione `estraiSpiegazioneDaTesto(clean)`: prova prima il parse JSON completo (comportamento invariato quando la risposta non è troncata); se fallisce, estrae comunque il valore di `"spiegazione"` con un regex tollerante (funziona anche a stringa non chiusa, gestisce `\n`/`\"`/`\\`); solo se il testo non assomiglia per niente al JSON atteso ricade sul vecchio comportamento (`clean.slice(0, 300)` — utile se l'IA ha risposto in prosa libera ignorando il formato richiesto). `spiegaParola` ora usa questa funzione al posto del parsing inline. Test: `tests/spiegaParola.test.mjs`, inclusi i due casi ESATTI degli screenshot ("«Propio» è la variante spezzina di" e "Ging è la forma"). Verificato anche dal vivo: intercettata la chiamata di rete a Gemini restituendo la stessa risposta troncata reale, confermato che l'app mostra il testo pulito e non il JSON grezzo.
  Non toccato `max_tokens` (cambio globale con impatto su costo/latenza di tutte le chiamate IA del sito, fuori scope di questo fix mirato).
  **Effetto collaterale nel tokenizer di test**: la regex di estrazione contiene caratteri `"` letterali (`/"spiegazione"\s*:.../`), che il tokenizer non-regex-aware dei file di test scambiava per apertura di stringa (terza variante dello stesso problema di R5/apostrofi nei commenti). Aggiunto riconoscimento dei letterali regex in `tests/spiegaParola.test.mjs`.

### Fix IA Lettura guidata (2026-07-12) — causa radice troncamento + candidati dialettali

Due interventi collegati sull'IA, entrambi con impatto principale su Lettura guidata:

- ✅ **`max_tokens` 300 → `AI_MAX_TOKENS` = 1000** — rimossa la causa radice dei JSON troncati (i fix del 2026-07-09 su `estraiSpiegazioneDaTesto`/`estraiFeedbackFrase` evitavano il JSON grezzo a schermo, ma il testo restava tagliato a metà frase perché mai generato). Nuova costante condivisa dai tre provider (Anthropic/Gemini/Groq-OpenAI) al posto dei tre `300` hardcoded. Gli estrattori tolleranti restano come rete di sicurezza. Test: 3 casi nuovi in `tests/callAI.test.mjs` (catturano il body della fetch mockata e verificano il tetto ≥ 800 su ogni provider); l'harness `makeRunner` ora inietta anche `AI_MAX_TOKENS` nel sandbox vm.
- ✅ **Avvertenza IA sui dialetti (candidati INVARIATI)** — prima proposta: bloccare il salvataggio in `SK_CANDIDATI_LG` per le parole dialettali (`mn/sp/ge/cr`), perché l'IA non conosce i dialetti e inventa traduzioni plausibili (vedi bonifica delle 283 voci mn "🤖 IA"). **Decisione dell'autore (2026-07-12): il blocco NON serve** — i candidati passano sempre dalla sua revisione manuale prima di entrare nel vocabolario, quindi il circuito è sicuro e la raccolta di parole dialettali dalle storie è anzi utile. Implementata solo l'**avvertenza a schermo** ("⚠️ L'IA non conosce bene i dialetti…"), mostrata quando `fonteSpiega === "ai"` e la storia è in dialetto — solo classi Tailwind già presenti nel file, nessun rebuild CSS. Test: 2 casi nuovi in `tests/spiegaParola.test.mjs` (candidato non filtrato per lingua + avvertenza presente e condizionata correttamente).

Verifica dal vivo (server statico Node + Playwright, rete Gemini interamente mockata): storia spezzina → spiegazione mostrata, avvertenza visibile, candidato salvato; storia tedesca → spiegazione senza avvertenza, candidato salvato; `maxOutputTokens: 1000` su tutte le chiamate intercettate; nessun errore console. Suite completa verde.

### Import multi-lingua in dialetti.html (2026-07-12)

Regola di processo fissata dall'autore: **qualunque candidato — dialettale o no — entra da dialetti.html (cuscinetto) e arriva a index solo con 🚀 Promuovi**. I candidati IA di Lettura guidata in lingue non dialettali (es. tedesco) però non avevano una porta d'ingresso: l'📤 Importa agiva solo sul dialetto del chip attivo e il resto finiva in "∅ Vuote".

- ✅ **Import esteso a tutte le lingue** — `adminImportAnalizza` legge ora TUTTE le colonne-lingua dello schema (`ADMIN_KEY_ORDER_INDEX` meno tema/livello/it/pron) presenti nel file JSON/JS/HTML; le liste nuove/arricchimenti/conflitti portano il codice lingua (badge `[de]` nel modal). Il CSV resta vincolato al chip dialetto (guardia esplicita in `adminImportCsv`); il modal si apre anche senza chip selezionato.
- ✅ **Pre-spunta ☑️ OK per le lingue affidabili** — nuova costante `LINGUE_AFFIDABILI_AI` (`en/fr/es/de/pt`): le voci NUOVE i cui campi importati sono tutti in quella lista nascono già `ok:true` (revisione-lampo: si scorrono i badge e si promuove). Mai pre-spuntati: voci con anche un solo campo dialettale, e arricchimenti su voci esistenti (potrebbero avere celle dialettali da vagliare). Una volta in CANDIDATI, la voce tedesca ha le celle dialettali libere → si può aggiungere a mano l'eventuale traduzione in dialetto; alla promozione il toggle "🤖 Riempimento AI" già esistente completa le altre lingue maggiori mancanti.
- Test: `tests/importDialetti.test.mjs` (8 casi comportamentali via vm sulle funzioni reali: nuova tedesca pre-spuntata, dialettale e mista mai pre-spuntate, arricchimento senza toccare `ok`, duplicati per campo, regressione sul flusso dialettale classico). Verifica dal vivo con Playwright e GitHub raw mockato sui file locali: JSON misto de+sp → 2 nuove/0 vuote, tedesca `ok:true`, spezzina senza `ok`, nessun errore console.

### Un solo editor: edit.html per index E candidati (2026-07-12)

Feedback dell'autore: "edit dialetti è fatto malissimo… perché dovrei avere modalità diverse di editare?" — l'admin di dialetti.html ha un modello a un-dialetto-per-volta, mentre edit.html ha quello giusto (lingue in colonna a scelta, filtri, celle inline). Decisione (opzione A): edit.html diventa l'unico editor, dialetti.html admin resta solo porta d'ingresso/uscita (import + 🚀 Promuovi).

- ✅ **"📖 Importa da Lettura guidata" in dialetti.html admin** — index e dialetti condividono l'origine: i candidati LG (`SK_CANDIDATI_LG`) si importano con un click dal localStorage, senza il giro appunti→file→upload (`lgCandidatiToVoci` + pipeline import esistente con pre-spunta). Dopo l'applica propone di svuotare la lista LG. Commit `da477b5`.
- ✅ **Sorgente "Candidati (dialetti)" in edit.html** — selettore in header: 📗 Vocabolario (index, default, intonso) ↔ 🗂 Candidati (blocco `CANDIDATI` di dialetti.html). Stessa tabella/filtri/AI; in modalità candidati: colonna ☑️ OK (stesso flag della promozione), NESSUN bump di `VOC_VERSION`, campi extra `ok`/`fonte` preservati (roundtrip byte-identico fuori dal blocco), bozze locali con chiave separata per sorgente, frasi SP e vocab.js solo in modalità index, commit message dedicato ("Candidati aggiornati da edit.html …").
- ✅ **Guardia anti-clobber su TUTTI i salvataggi di edit.html** — prima del PUT confronta il contenuto remoto (dalla GET /contents, base64→utf8 con `decodificaContenutoGh`) con lo snapshot caricato: se il file è cambiato (salvataggio da altra pagina/dispositivo, push) il salvataggio si ferma con spiegazione. È la protezione contro il clobber storico (b8b23a0, che azzerò 283 tag verif). Fail-open se l'API omette il contenuto (file > ~1 MB).
- ✅ **Bug latente corretto in corsa**: l'hookup generico `tr.querySelectorAll('input')` agganciava `onCellEdit` anche a input senza `data-field` (combobox sorgente 🏷️), scrivendo `voce[undefined]` — probabile origine storica delle chiavi `undefined` nel vocabolario (vedi commit `2764dce`). Ora `input[data-field]`.
- Test: `tests/editCandidati.test.mjs` (7 casi: helper di sorgente, estrazione CANDIDATI dal file reale, roundtrip candidati con ok/fonte e zero VOC_VERSION, regressione roundtrip index con bump +1, decodifica base64 multibyte, guardia strutturale, UI) + 3 nuovi in `tests/importDialetti.test.mjs`. Verifica dal vivo Playwright con GitHub (raw+api) mockato: 18 controlli, inclusi PUT catturata su dialetti.html, clobber bloccato con avviso, ritorno a index pulito.

### Stessa fragilità estesa a Frase libera (2026-07-09)

`SchermataFraseLibera.verificaFrase` aveva lo stesso identico bug (fallback `clean.slice(0, 200)` sul campo `grammar` quando il JSON di `{"correct", "correction", "grammar", "example"}` arrivava troncato), non ancora segnalato/riprodotto ma con la stessa causa (`max_tokens` fisso).

- ✅ **Fatto (2026-07-09)** — estratti due helper condivisi riusati da entrambe le funzioni: `estraiCampoStringaJSON(clean, chiave)` (valore stringa tollerante a JSON troncato, gestisce `\n`/`\"`/`\\`) e `estraiCampoBoolean(clean, chiave)`. `estraiSpiegazioneDaTesto` rifattorizzata per usare il primo (DRY, comportamento invariato — riverificato con la sua suite esistente). Nuova `estraiFeedbackFrase(clean)`: prova il parse JSON completo, poi recupera OGNI campo disponibile singolarmente (a differenza di spiegazione, qui sono 4 campi: se il taglio avviene a metà di uno, gli altri già ricevuti restano utilizzabili), e solo se NESSUN campo è recuperabile ricade sul vecchio comportamento. `verificaFrase` ora la usa al posto del parsing inline. Test: `tests/verificaFrase.test.mjs` (7 casi, incluso troncamento a metà campo e subito dopo il primo campo). Verificato anche dal vivo: intercettata la stessa risposta troncata via rete, confermato che il pannello di feedback mostra "✏️ Io vado a casa." / "📚 Manca la preposizione" invece del JSON grezzo.
