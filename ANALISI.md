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

### 8. Accessibilità: aria-label e focus visibile
Tasti lingua/numero domande (`~:7025-7048`), pulsanti TTS/microfono: mancano `aria-label` espliciti e stato attivo non sempre veicolato (solo colore). Costa poco aggiungerli e aiuta su mobile screen reader.

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
