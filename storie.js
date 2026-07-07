// storie.js — dati per la modalità "Lettura Guidata" (comprehensible input) di LinguaeQuiz.
//
// Caricato da:
//   • index.html via <script src="storie.js"> (parallelo a vocab.js).
//
// Ogni storia è un breve testo segmentato in frasi, con traduzione italiana
// e metadati di provenienza. NON contiene domande di comprensione né note
// etimologiche per parola: quelle sono generate al volo dall'AI (stessa
// infrastruttura di "Frase libera"), non salvate qui.
//
// Campo fonte.generato — SOLO due valori ammessi:
//   - "ai":         testo generato da un modello linguistico, calibrato sul
//                    livello. Ammesso SOLO per lingua != dialetto (oggi: en, de).
//                    La UI deve mostrare sempre un badge "testo generato".
//   - "autentico":  testo proveniente da una fonte reale (pubblico dominio o
//                    licenza verificata). Per i dialetti (fase futura:
//                    mn/sp/ge/cr) è l'UNICO valore ammesso — l'AI non deve MAI
//                    generare il testo dialettale stesso (può solo spiegare o
//                    fare domande di comprensione a runtime).
//
// Struttura di una storia:
// {
//   id: "slug-univoco",
//   lingua: "de" | "en" | ...,   // codice lingua del testo (coerente con LINGUE_DEFAULT)
//   livello: "A1" | "A2" | ...,  // CEFR, stessa scala di VOCABOLARIO_DEFAULT
//   tema: "fiaba" | "canzone popolare" | ...,
//   titolo: { testo: "...", it: "..." },
//   fonte: {
//     generato: "ai" | "autentico",
//     autore: "...",            // opzionale
//     riferimento: "...",       // opzionale: dove trovare l'originale
//     licenza: "...",           // opzionale
//     modello: "...",           // solo se generato === "ai"
//     note: "..."               // opzionale
//   },
//   frasi: [
//     { testo: "...", it: "..." },
//     ...
//   ]
// }

const STORIE_DEFAULT = [
  {
    id: "de-a1-ein-tag-im-park",
    lingua: "de",
    livello: "A1",
    tema: "vita quotidiana",
    titolo: { testo: "Ein Tag im Park", it: "Un giorno al parco" },
    fonte: {
      generato: "ai",
      modello: "claude-sonnet-5",
      note: "Testo generato per esercizio di lettura, calibrato su livello A1."
    },
    frasi: [
      { testo: "Heute ist ein schöner Tag.", it: "Oggi è una bella giornata." },
      { testo: "Anna geht mit ihrem Hund in den Park.", it: "Anna va al parco con il suo cane." },
      { testo: "Der Hund heißt Bruno.", it: "Il cane si chiama Bruno." },
      { testo: "Bruno läuft schnell zum Wasser.", it: "Bruno corre veloce verso l'acqua." },
      { testo: "Anna lacht und setzt sich auf eine Bank.", it: "Anna ride e si siede su una panchina." },
      { testo: "Am Ende gehen beide glücklich nach Hause.", it: "Alla fine tornano a casa entrambi felici." }
    ]
  },
  {
    id: "en-a1-the-cat-and-the-milk",
    lingua: "en",
    livello: "A1",
    tema: "vita quotidiana",
    titolo: { testo: "The Cat and the Milk", it: "Il gatto e il latte" },
    fonte: {
      generato: "ai",
      modello: "claude-sonnet-5",
      note: "Testo generato per esercizio di lettura, calibrato su livello A1."
    },
    frasi: [
      { testo: "There is a small white cat in the kitchen.", it: "C'è un gattino bianco in cucina." },
      { testo: "Her name is Luna.", it: "Si chiama Luna." },
      { testo: "Luna sees a glass of milk on the table.", it: "Luna vede un bicchiere di latte sul tavolo." },
      { testo: "She jumps up and drinks it slowly.", it: "Salta sul tavolo e lo beve piano." },
      { testo: "Then she falls asleep in the sun.", it: "Poi si addormenta al sole." }
    ]
  },
  {
    id: "de-a2-haenschen-klein",
    lingua: "de",
    livello: "A2",
    tema: "canzone popolare",
    titolo: { testo: "Hänschen klein", it: "Piccolo Hans" },
    fonte: {
      generato: "autentico",
      autore: "Testo: Franz Wiedemann (1861); variante nota anche come Volkslied",
      riferimento: "Canzone popolare tedesca tradizionale, ampiamente diffusa nel pubblico dominio",
      licenza: "pubblico-dominio"
    },
    frasi: [
      { testo: "Hänschen klein ging allein in die weite Welt hinein.", it: "Il piccolo Hans se ne andò da solo nel grande mondo." },
      { testo: "Stock und Hut steht ihm gut, ist ganz wohlgemut.", it: "Bastone e cappello gli stanno bene, è pieno di buonumore." },
      { testo: "Aber Mutter weinet sehr, hat ja nun kein Hänschen mehr.", it: "Ma la madre piange molto, ora non ha più il suo piccolo Hans." }
    ]
  }
];

// ── Export per browser + Node ────────────────────────────────────────────

const _exportsStorie = { STORIE_DEFAULT };
Object.assign(globalThis, _exportsStorie);
if (typeof module !== "undefined" && module.exports) module.exports = _exportsStorie;
