# LinguaeQuiz 🌍

**Multilingual vocabulary quiz with spaced repetition and AI-assisted practice**

A free web app to learn and compare vocabulary across many languages simultaneously — including classical languages and endangered regional dialects.

👉 **[Try it live](https://linguaequiz.com)**

---

## Features

- **2,196 vocabulary entries** organized by 28 themes and CEFR level (A1→B2)
- **19 languages + 4 regional dialects** — see the [full list](#languages) below
- **8 study modes** with progressive unlock — from gentle multiple-choice to a final self-assessment Quiz
- **Spaced repetition (SM-2)** — 8 levels with intervals from 1 day to 6 months
- **AI-assisted "Free Sentence" mode** — write a free sentence in your target language, the AI corrects it and explains your mistakes
- **Bring-your-own-key AI integration** — Groq, Gemini, Anthropic, OpenAI; keys stored locally in the browser, never sent to any server
- **Verb conjugation tables** — across multiple languages and tenses
- **Dialect contribution system** — submit words and expressions in regional dialects directly from the app (via Google Sheets backend)
- **Single HTML file** — runs in any modern browser, works offline after first load
- **No account, no install, no ads** — progress saved locally
- **Export/import** — back up your progress as JSON

---

## Languages

The base language is Italian. Coverage in the table below indicates how many of the 2,196 vocabulary entries are currently translated into each language.

### Major languages

| Language | Entries | Coverage |
|----------|--------:|---------:|
| 🇮🇹 Italian | 2,196 | 100% |
| 🇬🇧 English | 1,627 | 74% |
| 🇫🇷 French | 1,565 | 71% |
| 🇪🇸 Spanish | 1,565 | 71% |
| 🇩🇪 German | 1,565 | 71% |
| 🇵🇹 Portuguese | 1,565 | 71% |
| 🇷🇺 Russian | 1,099 | 50% |
| 🇰🇷 Korean | 873 | 40% |
| 🇯🇵 Japanese | 873 | 40% |
| 🇨🇳 Chinese | 873 | 40% |
| 🇸🇦 Arabic | 873 | 40% |

### European & community languages

| Language | Entries | Notes |
|----------|--------:|-------|
| 🟡🔴 Catalan | 1,099 | |
| 🇷🇴 Romanian | — | Recently added · vocabulary in progress |
| 🇦🇱 Albanian | — | Recently added · vocabulary in progress |

### Classical & constructed

| Language | Entries | Notes |
|----------|--------:|-------|
| 🏛 Latin | 497 | |
| 🏺 Ancient Greek | 497 | Polytonic Unicode |
| 🌐 Interlingua | 721 | IALA international auxiliary language |

### Regional dialects

| Dialect | Entries | Notes |
|---------|--------:|-------|
| ⚓ Spezzino | 1,031 | La Spezia, Liguria — most complete dialect |
| 🏖️ Manarolese | 293 | Manarola (Cinque Terre) — vocabulary expansion in progress |
| 🪨 Carrarino | 287 | Carrara, Tuscany |
| 🏛️ Genoese | 63 | Genoa, Liguria — early stage |

---

## Themes

Adjectives · Animals · Art · Home · Food · Quotes · Body · Cosmetics · Dialects · Dialogue · Family · Medicines · Days · Grammar · Instructions · Places · Months · Professions · Nature · Numbers · Pathologies · Health · Symptoms · Sport · Currencies · Verbs · Clothing · Travel

---

## Study Modes

The eight modes are designed as a learning progression. Harder modes start locked and unlock as you accumulate learned words in the easier ones.

| Lv | Mode | Description |
|----|------|-------------|
| 0 | 🎯 Multiple Choice | Pick the right answer from 4 to 12 options. Adapts to your level. |
| 1 | ✍️ Dictation | Hear a word and write it in the same language. |
| 2 | 🏋️ Training | Type the translation. Wrong answers come back in the same session. |
| 3 | 🎤 Voice Reply | Speak the translation out loud (browser speech recognition). |
| 4 | 🎧 Listen & Write | Hear the word, type the translation. |
| 5 | 🤖 Free Sentence | Write a free sentence; the AI corrects it and explains your mistakes. |
| 7 | ⚡ Non-stop | Keep going until your first mistake. Beat your own record. |
| 9 | 🎯 Quiz | Final self-assessment — type the translation with no hints. |

---

## How to use

1. Open the app in your browser
2. Select your active languages (🌍 button)
3. Choose a study mode
4. Select source and target language (or leave on random)
5. Study!

Progress is saved automatically in your browser's localStorage. Use 💾 to export and 📂 to import.

To use the AI-assisted Free Sentence mode, you'll need an API key from one of the supported providers (Groq, Gemini, Anthropic, OpenAI). All major providers offer free tiers that easily cover months of casual use.

---

## Technical notes

- Single HTML file (~700 KB)
- React 18 (CDN) + Babel + Tailwind CSS (CDN)
- No backend, no server, no cookies, no tracking
- Web Speech API for pronunciation and voice recognition (Chrome recommended)
- Dialect contributions submitted via a Google Apps Script endpoint to a Google Sheet (review queue)

### Local development

No build step required:

```bash
git clone https://github.com/dinostorti/linguaequiz.git
cd linguaequiz
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

- 🇷🇴 **Romanian** and 🇦🇱 **Albanian** — recently added, vocabulary still to be populated. Native speakers from the La Spezia community especially welcome.
- 🏖️ **Manarolese** and 🏛️ **Genoese** — endangered Ligurian dialects with limited documentation.
- 🌐 **Interlingua** — community language with active speakers worldwide.

You can also contribute dialect entries directly from the app using the "Save your dialect" feature — submissions are reviewed before being added.

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

**Dino Storti** — Pharmacist, La Spezia, Italy
Built as a personal language learning tool, shared freely with the community.

© 2026 Dino Storti
