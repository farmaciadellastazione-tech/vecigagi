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
    "id": "sp-a2-padrone-e-mezzadro4",
    "lingua": "sp",
    "livello": "A2",
    "tema": "",
    "titolo": {
      "testo": "",
      "it": ""
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Ubaldo Mazzini",
      "riferimento": "Strafugi"
    },
    "frasi": [
      {
        "testo": "(dialetto della campagna)",
        "it": ""
      },
      {
        "testo": "Anguano, sior patron, l’è ’n gramo afae!",
        "it": "Quest'anno, signor padrone, è una magra annata!"
      },
      {
        "testo": "E oive i n’han brica, e ’nquanto a l’üa,",
        "it": "Gli olivi non ne hanno affatto, e in quanto all'uva,"
      },
      {
        "testo": "A voreai sbagiame, ma ho paüa",
        "it": "vorrei sbagliarmi, ma ho paura"
      },
      {
        "testo": "Ch’a südeemo pogo a vendegnae!",
        "it": "che suderemo poco a vendemmiare!"
      },
      {
        "testo": "Der granon la ne gh’è manco ciü a püa,",
        "it": "Del granturco non ce n'è più nemmeno la polvere,"
      },
      {
        "testo": "E castagne s’i n’han, posti crepae,",
        "it": "e castagne, se ne hanno, ch'io possa crepare!,"
      },
      {
        "testo": "E ’nca de ciü la m’è ’nca morta a müa,",
        "it": "e per di più mi è anche morta la mula,"
      },
      {
        "testo": "E a vaca la ne posse ’ngravedae.",
        "it": "e la vacca non riesce a restare pregna."
      },
      {
        "testo": "Donca siché, ’oi die, Ussignoia",
        "it": "Dunque insomma, voglio dire, Vossignoria,"
      },
      {
        "testo": "’Nta che la se daga ’n po’ passensia",
        "it": "che Lei porti un po' di pazienza,"
      },
      {
        "testo": "Se anguano ne ghe toca n’assidente.",
        "it": "se quest'anno non Le spetta un accidente."
      },
      {
        "testo": "Donca a me ’n vago, adio. -Ma dame odensia:",
        "it": "Dunque me ne vado, addio. — Ma dammi retta:"
      },
      {
        "testo": "Come te fè a campae se ne gh’è gnente?",
        "it": "come fai a campare, se non c'è niente?"
      },
      {
        "testo": "-Per me ghe n’è; bongiorno signoia!",
        "it": "— Per me ce n'è; buongiorno, signoria!"
      }
    ]
  },
  {
    "id": "sp-a2-nuova-storia-4",
    "lingua": "sp",
    "livello": "A2",
    "tema": "",
    "titolo": {
      "testo": "A \"Cavalaìa rüsticana\"",
      "it": "La Cavalleria rusticana"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Ubaldo Mazzini",
      "riferimento": "Strufugi"
    },
    "frasi": [
      {
        "testo": "I en dui che se vè ben, ma lü ir fa aposta,",
        "it": "Ci sono due che si vogliono bene, ma lui lo fa apposta,"
      },
      {
        "testo": "Ch'i gh'ha n'autra pe e man che l'ha maì;",
        "it": "ché ha un'altra fra le mani, che ha marito;"
      },
      {
        "testo": "Le, che la o sa, 'n beo dì la ghe fa a posta,",
        "it": "lei, che lo sa, un bel giorno gli fa la posta"
      },
      {
        "testo": "E la ghe disa sc-ciao: te m'è tradì.",
        "it": "e gli dice chiaro: m'hai tradito!"
      },
      {
        "testo": "Lü, ch'i è 'n fantame cen de presümì,",
        "it": "Lui, che è un giovinastro pieno di presunzione,"
      },
      {
        "testo": "I ne vè daghe manco de risposta;",
        "it": "non le vuole dare nemmeno una risposta;"
      },
      {
        "testo": "Mentre che le la cianza, i se gh'acosta",
        "it": "mentre lei piange, lui le si accosta"
      },
      {
        "testo": "e i ghe fa, diza: levete de chì!",
        "it": "e le fa, dice: togliti di qui!"
      },
      {
        "testo": "Aloa ven er maì, e lü i se 'n va,",
        "it": "Allora arriva il marito, e lui se ne va,"
      },
      {
        "testo": "E le la ghe fa a spia, da 'r gran ghignon,",
        "it": "e lei,  gli fa la spia, dal gran rancore,"
      },
      {
        "testo": "Che se mugee... de chì, de sà e de là.",
        "it": "che sua moglie... di qui, di qua e di là."
      },
      {
        "testo": "Lü i mangia a fogia, e i grida: pelandron!",
        "it": "Lui mangia la foglia, e grida: pelandrone!"
      },
      {
        "testo": "I me l'ha fata, ma i la pagheà!",
        "it": "Me l'ha fatta, ma la pagherà!"
      },
      {
        "testo": "E i t'o destenda lì come 'n strasson.",
        "it": "E te lo stende lì come uno straccione."
      }
    ]
  },
  {
    "id": "sp-a1-aloa-e-aoa-4",
    "lingua": "sp",
    "livello": "A1",
    "tema": "poesia",
    "titolo": {
      "testo": "Aloa e aoa",
      "it": "allora e ora"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Ubaldo Mazzini",
      "riferimento": "Strafugi"
    },
    "frasi": [
      {
        "testo": "Quand'a eimo trei gati de spezin",
        "it": "Quando eravamo tre gatti di spezzini"
      },
      {
        "testo": "Ciü luisi che quei de Riomazoe,",
        "it": "più sempliciotti di quelli di Riomaggiore"
      },
      {
        "testo": "E a Speza l'ea tegnü pe' 'n cagadoe,",
        "it": "E La Spezia era tenuta per un  cesso"
      },
      {
        "testo": "E e serve i ne portavo 'r capelin;",
        "it": "e le serve non portavano il cappellino"
      },
      {
        "testo": "Quand'aa sea ne ziava de signoe",
        "it": "Quando alla sera non giravano delle signore"
      },
      {
        "testo": "A cacia d'ufissiali e de lechin;",
        "it": "A caccia di ufficiali e di lecchini,"
      },
      {
        "testo": "Quando s'andava ao tridoo e ae quaant'oe,",
        "it": "Quando si andava al triduo ed alle quarant'ore"
      },
      {
        "testo": "E a reze 'r Cristo e l'asta ar bardachin;",
        "it": "E a reggere il Cristo e l'asta al baldacchino"
      },
      {
        "testo": "Quand'andaimo 'nt'er prado dea maina",
        "it": "Quando andavamo nel prato della marina"
      },
      {
        "testo": "A mete ai fisc-ci a guardia nassionale,",
        "it": "a fischiare la guardia nazionale."
      },
      {
        "testo": "Dì quelo che te vè, sangue de dina!",
        "it": "Di quello che ti pare, sangue de dina!"
      },
      {
        "testo": "L'ea n'autra Speza, serv'assè, Pasquale.",
        "it": "Era un'altra Spezia, servo tuo, Pasquale."
      },
      {
        "testo": "-Ma aloa te ne gh'andavi ogni matina,",
        "it": "Ma allora non ci andavi ogni mattina"
      },
      {
        "testo": "Per no fae gnente, drento a l'arsenale!",
        "it": "Per non fare niente, dentro all'arsenale!"
      }
    ]
  },
  {
    "id": "en-a1-nuova-storia-3",
    "lingua": "en",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "",
      "it": ""
    },
    "fonte": {
      "generato": "ai",
      "modello": "claude-sonnet-5",
      "note": ""
    },
    "frasi": [
      {
        "testo": "",
        "it": ""
      }
    ]
  },
  {
    "id": "en-a1-nuova-storia-2",
    "lingua": "sp",
    "livello": "A1",
    "tema": "scioglilingua",
    "titolo": {
      "testo": "Cian cianin",
      "it": ""
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": ""
    },
    "frasi": [
      {
        "testo": "Cian cianin",
        "it": "Pian pianino"
      },
      {
        "testo": "andemo fino aa Ciapa",
        "it": "andiamo fino alla Chiappa"
      }
    ]
  },
  {
    "id": "en-a1-nuova-storia",
    "lingua": "sp",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Er figio der marinao",
      "it": ""
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "anonimo"
    },
    "frasi": [
      {
        "testo": "Er figio der mainao",
        "it": "Il figlio del marinaio"
      },
      {
        "testo": "i è caito n'ter canao",
        "it": "è caduto nel canale"
      },
      {
        "testo": "e ne s'è fato manco mao",
        "it": "e non si è neanche fatto male"
      }
    ]
  },
  {
    "id": "de-a1-ein-tag-im-park",
    "lingua": "de",
    "livello": "A1",
    "tema": "vita quotidiana",
    "titolo": {
      "testo": "Ein Tag im Park",
      "it": "Un giorno al parco"
    },
    "fonte": {
      "generato": "ai",
      "modello": "claude-sonnet-5",
      "note": "Testo generato per esercizio di lettura, calibrato su livello A1."
    },
    "frasi": [
      {
        "testo": "Heute ist ein schöner Tag.",
        "it": "Oggi è una bella giornata."
      },
      {
        "testo": "Anna geht mit ihrem Hund in den Park.",
        "it": "Anna va al parco con il suo cane."
      },
      {
        "testo": "Der Hund heißt Bruno.",
        "it": "Il cane si chiama Bruno."
      },
      {
        "testo": "Bruno läuft schnell zum Wasser.",
        "it": "Bruno corre veloce verso l'acqua."
      },
      {
        "testo": "Anna lacht und setzt sich auf eine Bank.",
        "it": "Anna ride e si siede su una panchina."
      },
      {
        "testo": "Am Ende gehen beide glücklich nach Hause.",
        "it": "Alla fine tornano a casa entrambi felici."
      }
    ]
  },
  {
    "id": "en-a1-the-cat-and-the-milk",
    "lingua": "en",
    "livello": "A1",
    "tema": "vita quotidiana",
    "titolo": {
      "testo": "The Cat and the Milk",
      "it": "Il gatto e il latte"
    },
    "fonte": {
      "generato": "ai",
      "modello": "claude-sonnet-5",
      "note": "Testo generato per esercizio di lettura, calibrato su livello A1."
    },
    "frasi": [
      {
        "testo": "There is a small white cat in the kitchen.",
        "it": "C'è un gattino bianco in cucina."
      },
      {
        "testo": "Her name is Luna.",
        "it": "Si chiama Luna."
      },
      {
        "testo": "Luna sees a glass of milk on the table.",
        "it": "Luna vede un bicchiere di latte sul tavolo."
      },
      {
        "testo": "She jumps up and drinks it slowly.",
        "it": "Salta sul tavolo e lo beve piano."
      },
      {
        "testo": "Then she falls asleep in the sun.",
        "it": "Poi si addormenta al sole."
      }
    ]
  },
  {
    "id": "de-a2-haenschen-klein",
    "lingua": "de",
    "livello": "A2",
    "tema": "canzone popolare",
    "titolo": {
      "testo": "Hänschen klein",
      "it": "Piccolo Hans"
    },
    "fonte": {
      "generato": "autentico",
      "autore": "Testo: Franz Wiedemann (1861); variante nota anche come Volkslied",
      "riferimento": "Canzone popolare tedesca tradizionale, ampiamente diffusa nel pubblico dominio",
      "licenza": "pubblico-dominio"
    },
    "frasi": [
      {
        "testo": "Hänschen klein ging allein in die weite Welt hinein.",
        "it": "Il piccolo Hans se ne andò da solo nel grande mondo."
      },
      {
        "testo": "Stock und Hut steht ihm gut, ist ganz wohlgemut.",
        "it": "Bastone e cappello gli stanno bene, è pieno di buonumore."
      },
      {
        "testo": "Aber Mutter weinet sehr, hat ja nun kein Hänschen mehr.",
        "it": "Ma la madre piange molto, ora non ha più il suo piccolo Hans."
      }
    ]
  },
  {
    "id": "sp-b1-nfra-tute-e-sita",
    "lingua": "sp",
    "livello": "B1",
    "tema": "poesia",
    "titolo": {
      "testo": "'Nfra tüte e sità de l'üniverso",
      "it": "Tra tutte le città dell'universo"
    },
    "fonte": {
      "generato": "autentico",
      "autore": "Ubaldo Mazzini (\"Gamin\"), 1868-1923",
      "riferimento": "Poesie in vernacolo, a cura di P.E. Faggioni, Cassa di Risparmio della Spezia, 1989",
      "licenza": "pubblico-dominio (autore deceduto nel 1923, oltre 70 anni)",
      "note": "Titolo non attestato: uso il primo verso, come da convenzione per componimenti senza titolo proprio noto."
    },
    "frasi": [
      {
        "testo": "'Nfra tüte e sità de l'üniverso",
        "it": "Tra tutte le città dell'universo"
      },
      {
        "testo": "me a credo che paege né ghe 'n sia;",
        "it": "io credo non ve ne siano di pari"
      },
      {
        "testo": "mia propio die che Cristo i agia perso,",
        "it": "bisogna proprio dire che Cristo abbia perso,"
      },
      {
        "testo": "dopo d'avela fabricà, a magìa!",
        "it": "dopo averla creata, la magia!"
      },
      {
        "testo": "Bela l'è bela, la la veda 'n guerso!",
        "it": "Bella è bella, lo vede un cieco!"
      },
      {
        "testo": "E ho sentì a die che per quanto se zia",
        "it": "e ho sentito dire che per quanto si giri"
      },
      {
        "testo": "er mondo 'n lüngo, e 'n largo, ne gh'è verso!",
        "it": "il mondo in lungo e in largo, non c'è verso!"
      },
      {
        "testo": "En gorfo cossì beo i ne s'amìa.",
        "it": "Un golfo così bello non si ammira."
      },
      {
        "testo": "Ma a ciü belessa bela e sorprendente",
        "it": "Ma la bellezza più bella e sorprendente"
      },
      {
        "testo": "l'è che se gh'è 'n spezin ch'agia 'nt'a testa",
        "it": "è che se c'è uno spezzino che ha nella testa"
      },
      {
        "testo": "doi ünse de criteio e de talento",
        "it": "due once di criterio e di talento"
      },
      {
        "testo": "I 'o schivo tüti, e i ne 'r consideo gnente;",
        "it": "Lo schivano tutti e non lo considerano niente"
      },
      {
        "testo": "ma se ven n'ase chi daa cà dea pesta",
        "it": "ma se viene un asino qui da casa del diavolo"
      },
      {
        "testo": "i' en capaci de faghe 'r monümento.",
        "it": "sono capaci di fargli il monumento."
      }
    ]
  }
];

// ── Export per browser + Node ────────────────────────────────────────────

const _exportsStorie = { STORIE_DEFAULT };
Object.assign(globalThis, _exportsStorie);
if (typeof module !== "undefined" && module.exports) module.exports = _exportsStorie;
