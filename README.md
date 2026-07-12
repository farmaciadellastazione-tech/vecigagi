# LinguaeQuiz 🌍

**Multilingual vocabulary quiz with spaced repetition and AI-assisted practice**

A free web app to learn and compare vocabulary across many languages simultaneously — including classical languages and endangered regional dialects.

👉 **[Try it live](https://linguaequiz.com)**

---

## Features

- **1,700+ vocabulary entries** organized by theme and CEFR level (A1→B2)
- **17 languages + 4 regional dialects** — see the [full list](#languages) below
- **9 study modes** with progressive unlock — from gentle multiple-choice to a final self-assessment Quiz
- **Guided Reading** — short stories read sentence by sentence with audio and translation; tap any word for an explanation ([storie.html](https://linguaequiz.com/storie.html))
- **Spaced repetition (SM-2)** — 8 levels with intervals from 1 day to 6 months
- **AI-assisted "Free Sentence" mode** — write a free sentence in your target language, the AI corrects it and explains your mistakes
- **Bring-your-own-key AI integration** — Gemini, Groq, Anthropic, OpenAI; keys stored locally in the browser, never sent to any server
- **Verb conjugation tables** — across multiple languages and tenses
- **Online dialect glossary** — browse and search the dialect vocabulary at [dialetti.html](https://linguaequiz.com/dialetti.html), and submit new words and expressions directly from the page
- **No build step, no backend** — static files on GitHub Pages, works offline after first load
- **No account, no install, no ads** — progress saved locally
- **Export/import** — back up your progress as JSON

---

## Languages

The base language is Italian. Coverage in the table below indicates how many of the 1,744 vocabulary entries are currently translated into each language (counts as of July 2026 — the vocabulary grows continuously).

### Major languages

| Language | Entries | Coverage |
|----------|--------:|---------:|
| 🇮🇹 Italian | 1,744 | 100% |
| 🇬🇧 English | 1,165 | 67% |
| 🇩🇪 German | 1,012 | 58% |
| 🇫🇷 French | 1,010 | 58% |
| 🇪🇸 Spanish | 1,004 | 58% |
| 🇵🇹 Portuguese | 1,004 | 58% |
| 🇷🇺 Russian | 669 | 38% |
| 🇨🇳 Chinese | 550 | 32% |
| 🇯🇵 Japanese | 548 | 31% |
| 🇰🇷 Korean | 547 | 31% |
| 🇸🇦 Arabic | 544 | 31% |

### European & community languages

| Language | Entries | Notes |
|----------|--------:|-------|
| 🟡🔴 Catalan | 704 | |
| 🇷🇴 Romanian | 240 | Vocabulary in progress |
| 🇦🇱 Albanian | — | Recently added · vocabulary in progress |

### Classical & constructed

| Language | Entries | Notes |
|----------|--------:|-------|
| 🌐 Interlingua | 545 | IALA international auxiliary language |
| 🏛 Latin | 444 | |
| 🏺 Ancient Greek | 399 | Polytonic Unicode |

### Regional dialects

| Dialect | Entries | Notes |
|---------|--------:|-------|
| ⚓ Spezzino | 1,225 | La Spezia, Liguria — most complete dialect |
| 🏖️ Manarolese | 1,144 | Manarola (Cinque Terre) — grown from community-lent printed sources |
| 🏛️ Genoese | 521 | Genoa, Liguria |
| 🪨 Carrarino | 303 | Carrara, Tuscany |

---

## Themes

60+ themes, including: Adjectives · Animals · Art · Home · Food · Quotes · Body · Dialogue · Emotions · Family · Medicines · Days · Grammar · Greetings · Places · Months · Professions · Nature · Numbers · Health · Proverbs · Insults (dialects!) · Sport · Verbs · Clothing · Travel · Work

---

## Study Modes

The modes are designed as a learning progression. Harder modes start locked and unlock as you accumulate learned words in the easier ones.

| Lv | Mode | Description |
|----|------|-------------|
| 0 | 🎯 Multiple Choice | Pick the right answer from 4 to 12 options. Adapts to your level; wrong answers come back until you get them right. |
| 0 | 📖 Guided Reading | Short stories sentence by sentence, with audio and translation. Tap a word for an explanation (from the vocabulary, or from the AI as fallback). |
| 1 | ✍️ Dictation | Hear a word and write it in the same language. |
| 2 | 🏋️ Training | Type the translation. Wrong answers come back in the same session. |
| 3 | 🎤 Voice Reply | Speak the translation out loud (browser speech recognition). |
| 4 | 🎧 Listen & Write | Hear the word, type the translation. |
| 5 | 🤖 Free Sentence | Write a free sentence; the AI corrects it and explains your mistakes. |
| 7 | ⚡ Non-stop | Keep going until your first mistake. Beat your own record. |
| 9 | 🎯 Quiz | Final self-assessment — type the translation with no hints. |

Guided Reading also accepts **private texts**: paste your own story (it stays in your browser only) and read it with the same sentence-by-sentence tools. You can propose a story for publication via [storie.html](https://linguaequiz.com/storie.html).

---

## How to use

1. Open the app in your browser
2. Select your active languages (🌍 button)
3. Choose a study mode
4. Select source and target language (or leave on random)
5. Study!

Progress is saved automatically in your browser's localStorage. Use 💾 to export and 📂 to import.

To use the AI-assisted features (Free Sentence mode, word explanations in Guided Reading), you'll need an API key from one of the supported providers (Gemini — recommended, free tier — Groq, Anthropic, OpenAI). All major providers offer free tiers that easily cover months of casual use.

---

## Technical notes

- Static site, no build step at runtime: the app lives in `index.html` (~800 KB), with `vocab.js` (shared text-processing helpers), `storie.js` (Guided Reading texts, lazy-loaded) and `tailwind.css`
- React 18 with **pre-compiled JSX** (no Babel in the browser) and a **pre-built Tailwind CSS** file (no CDN, no JIT compilation at runtime)
- No backend, no server, no account; progress and settings live in your browser's localStorage. Anonymous usage statistics via Google Analytics.
- Web Speech API for pronunciation and voice recognition (Chrome recommended)
- Dialect contributions submitted via a Google Apps Script endpoint (review queue); new vocabulary entries are staged and reviewed in `dialetti.html` before being promoted to the main vocabulary

### Local development

No build step required:

```bash
git clone https://github.com/farmaciadellastazione-tech/vecigagi.git
cd vecigagi
python3 -m http.server 8000
# open http://localhost:8000
```

You can also just open `index.html` directly in a browser — most features work, but the Web Speech API requires `http://` or `https://` to function reliably.

---

## Contributing

Translation errors are likely, especially in less common languages and dialects. If you spot a mistake, please open an **Issue** on GitHub or send an email with:

- The word/phrase
- The language
- The correct translation

Contributions are particularly welcome for:

- 🇷🇴 **Romanian** (started, ~240 entries) and 🇦🇱 **Albanian** (still to be populated). Native speakers from the La Spezia community especially welcome.
- 🏖️ **Manarolese** and 🏛️ **Genovese** — and all endangered Ligurian and Lunigiana dialects with limited documentation.
- 🏛 **Latin** and 🏺 **Ancient Greek** — current entries were generated with AI assistance and are provisional. Contributions from classicists and philologists would be especially valuable.
- 🌐 **Interlingua** — community language with active speakers worldwide.
- 📖 **Stories for Guided Reading** — short original or public-domain texts in any supported language or dialect: propose them from [storie.html](https://linguaequiz.com/storie.html).

You can also contribute dialect entries directly from [dialetti.html](https://linguaequiz.com/dialetti.html) using the "Save your dialect" feature — submissions are reviewed before being added.

---

## Bibliography & Sources

The vocabulary draws on a combination of printed sources, online dictionaries, and AI-assisted translations. Where possible, sources are credited per language; the goal is to be transparent about provenance so contributors and users know what to trust and what to verify.

### Regional dialects

**🏖️ Manarolese**
- *Abbecedario (piccola grammatica e glossario) del dialetto manarolese*, a cura di Nando Mauro Celsi, Edizioni del Parco delle Cinque Terre — **primary source of the initial vocabulary core**.
- *Di chi ti è figiu? Grammatica dialettale manarolese*, di Annetta Riccobaldi e Angelo Riccobaldi, Parco Nazionale delle Cinque Terre — **reference for the ongoing expansion**.
- Entries of uncertain provenance are being systematically reviewed against these printed sources by native-speaker consultation.

**⚓ Spezzino**
- *Il dialetto spezzino dalla A alla S (la Z per lo spezzino non esiste)*, Franco Lena, Edizioni Cinque Terre.
- Online dictionary of the **Accademia Lunigianese di Scienze "Giovanni Capellini"**.

**🪨 Carrarino**
- *'L Cararin*, Auda Fucigna — primary source.

**🏛️ Genoese**
- No specific bibliographic source so far: current entries are based on general online research and should be considered provisional. **Contributions from native speakers and Genoese dialect specialists are warmly welcomed.**

### Classical and constructed languages

**🏛 Latin** and **🏺 Ancient Greek**
- Current entries were generated with AI assistance (Claude) and should be considered provisional. Contributions from classicists are particularly welcome to refine register, period appropriateness, and semantic nuance.

**🌐 Interlingua**
- Entries draw on the standard IALA Interlingua vocabulary as documented in publicly available online dictionaries.

### Algorithm

- **Spaced repetition** is implemented following the SM-2 algorithm originally developed by Piotr Woźniak (SuperMemo, 1987), the same family of algorithms used by Anki.

---

## Acknowledgements

The Manarolese books listed in the bibliography were generously **lent or provided by members of the Manarola community** after they learned about the project, in response to specific requests for documentary sources. The same is true for the Carrarino source: the book was lent by someone from the Carrara community.

Without their willingness to share these increasingly rare publications — many of which are out of print and circulate primarily within the communities they document — this project would not have the depth of dialect coverage it has today. Their generosity is the single most important reason these languages are represented in a meaningful way, rather than as a small symbolic sample.

If contributors wish to be named individually in future releases, they are warmly invited to make themselves known.

### Tools and technologies

LinguaeQuiz is built on the work of many open-source and free services:

- **React** (Meta) for the UI (JSX pre-compiled with **Babel** at development time)
- **Tailwind CSS** for styling (pre-built CSS)
- **Web Speech API** for text-to-speech and voice recognition
- **Google Apps Script** + **Google Sheets** for the dialect contribution backend
- **GitHub Pages** for hosting and **Aruba** for the custom domain
- AI providers offering free or low-cost tiers usable with personal API keys: **Groq**, **Google Gemini**, **Anthropic Claude**, **OpenAI**

---

## License

This project uses two complementary licenses:

- **Code** — [MIT License](https://opensource.org/licenses/MIT). Free to use, modify, and redistribute, including for commercial purposes, with attribution.
- **Vocabulary content and translations** — [![CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/) Creative Commons Attribution-NonCommercial 4.0. Free to share and adapt for non-commercial purposes, with attribution.

The dialect entries in particular represent the work of native speakers and community contributors, and the non-commercial clause is intended to protect that effort.

---

## Contact

📬 **[linguaequiz@gmail.com](mailto:linguaequiz@gmail.com)**

- 💬 [Telegram](https://t.me/linguaequiz)
- 📘 [Facebook](https://www.facebook.com/LinguaeQuiz/)

---

## Author

**vecigagi** — Pharmacist, La Spezia, Italy
Built as a personal language learning tool, shared freely with the community.

© 2026 vecigagi
