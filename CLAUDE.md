# LinguaeQuiz — convenzioni del progetto

## Architettura

- **App React single-file**: tutto il quiz vive in `index.html` (React 18 + Babel + Tailwind via CDN, nessun build step).
- **Nessun backend**: hosting su GitHub Pages, dati utente in `localStorage`.
- `edit.html` è l'editor del vocabolario (vedi sezione dedicata).
- `index17.html` è una copia di backup di una versione precedente — non modificare salvo richiesta esplicita.

## Vocabolario

Il vocabolario è l'array `VOCABOLARIO_DEFAULT` definito dentro `index.html` (cerca `const VOCABOLARIO_DEFAULT = [`). Ogni voce è un oggetto con `tema`, `livello` e i codici lingua come chiavi (`it`, `en`, `fr`, `sp`, `mn`, `ge`, `cr`, ecc.).

### Convenzione `/` nei campi lingua

Il carattere `/` ha **due significati diversi** in base al codice lingua:

- **Dialetti senza TTS propria — `mn`, `sp`, `ge`, `cr`** (manarolese, spezzino, genovese, carrarino): `/` separa **pronuncia/grafia tradizionale**.
  - Il TTS legge la **prima parte** (pronuncia foneticamente adattata per la voce italiana del browser).
  - La UI può mostrare la grafia tradizionale (seconda parte).
  - Esempio: `sp:"camalàaee/camalae"` → TTS dice `camalàaee`, grafia mostrata `camalae`.
  - Se manca la `/`, viene letta la grafia così com'è (fallback transitorio).
  - La lista canonica è in `DIALETTI_TTS_ITA` in `index.html`.
- **Tutti gli altri codici**: `/` separa **sinonimi** (parole diverse con stesso significato). Es. `cr:"branzin/branzino"`.

Quando aggiungi/modifichi voci dialettali, rispetta la convenzione `pronuncia/grafia` per `mn/sp/ge/cr`.

### `VOC_VERSION`

In `index.html` c'è `const VOC_VERSION = N;`. **Incrementa `VOC_VERSION` ogni volta che cambia la struttura del vocabolario** (nuovi campi, nuova semantica, nuove chiavi lingua). Serve a invalidare la cache locale degli utenti: se la versione salvata è inferiore, il browser ricarica il vocabolario.

Non serve incrementarlo per semplici aggiunte/correzioni di voci (lo fa già `edit.html` automaticamente).

## Workflow di editing del vocabolario — IMPORTANTE

`edit.html` è un editor che:
1. Carica `index.html` da GitHub (raw).
2. Estrae l'array `VOCABOLARIO_DEFAULT` riconoscendolo con `BLOCK_START_RE = /^\s*const VOCABOLARIO_DEFAULT = \[/m`.
3. Permette di modificare le voci.
4. Al salvataggio **riscrive `index.html` su GitHub** sostituendo il blocco `VOCABOLARIO_DEFAULT`.

**Conseguenza critica**: ogni modifica a `index.html` (anche al codice React, non solo al vocabolario) **deve essere committata e pushata su GitHub PRIMA** di aprire `edit.html`, altrimenti `edit.html` lavorerà sulla versione vecchia e il successivo salvataggio sovrascriverà le modifiche locali non pushate.

Sequenza corretta:
1. Modifica `index.html` (codice o vocabolario manuale).
2. `git add` + `git commit` + `git push`.
3. Solo ora apri `edit.html` per gestire il vocabolario.

## Linguaggio della comunicazione

L'autore è italiano: risposte e commenti nei file in italiano salvo richiesta diversa.
