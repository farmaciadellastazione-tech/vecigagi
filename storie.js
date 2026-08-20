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
    "id": "ge-a1-eneide-1",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 1",
      "it": "Cornice: Enea inizia il racconto"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Appenn-a han visto Enea tiâ sciû ö mandillo",
        "it": "Appena hanno visto Enea tirar fuori il fazzoletto"
      },
      {
        "testo": "Sciûsciase ö naso e mettise a scraccâ,",
        "it": "Soffiarsi il naso e mettersi a scracchiare,"
      },
      {
        "testo": "Tutti han çercôu dove pösâ ö bacillo,",
        "it": "Tutti han cercato dove posare il sedere,"
      },
      {
        "testo": "Pe sentilo ciû comodi a parlâ.",
        "it": "Per sentirlo più comodi parlare."
      },
      {
        "testo": "Quando l'é stæto ognûn quieto e tranquillo",
        "it": "Quando ognuno si è messo quieto e tranquillo"
      },
      {
        "testo": "Che se pûeiva sentî ûnn-a mosca sghæuâ,",
        "it": "Che si poteva sentire una mosca volare,"
      },
      {
        "testo": "Enea, dall'äto dö so caregon",
        "it": "Enea, dall'alto del suo cadregone"
      },
      {
        "testo": "Ö commensa, c'ûn pö de commozion:",
        "it": "Comincia, con un po' di commozione:"
      },
      {
        "testo": "Mi nö fasso pe dî, bèlla reginn-a,",
        "it": "Io non faccio per dire, bella regina,"
      },
      {
        "testo": "Ma se parlo, mi ö fasso pe vosciâ",
        "it": "Ma se parlo, lo faccio per vossia"
      },
      {
        "testo": "Quando penso ai mæ caxi, ä mæ rovinn-a,",
        "it": "Quando penso ai miei casi, alla mia rovina,"
      },
      {
        "testo": "A morte de Creûsa e dö pappâ,",
        "it": "Alla morte di Creusa e del papà,"
      },
      {
        "testo": "Mi ghe confesso che n'ho a mussa pinn-a",
        "it": "Io le confesso che ne ho la mussa piena,"
      },
      {
        "testo": "Sciâ scûse l'esprescion, ma chi a ghe stâ,",
        "it": "Vossia scusi l'espressione, ma qui ci sta,"
      },
      {
        "testo": "E invece de contâ di avvenimenti",
        "it": "E invece di raccontare degli avvenimenti"
      },
      {
        "testo": "Mi tieivo zû di tacchi e di aççidenti.",
        "it": "Tirerei giù delle imprecazioni e degli accidenti."
      },
      {
        "testo": "Ma andemmo là, sebben segge za l'ôa",
        "it": "Ma andiamo là, sebbene sia già l'ora"
      },
      {
        "testo": "D'andâse a inghœûgge in mezo a duî lensœû,",
        "it": "Di andarsi ad avvolgere in mezzo a due lenzuola,"
      },
      {
        "testo": "Benché sente ö magon, serrâme a gôa",
        "it": "Benché senta il magone chiudermi la gola"
      },
      {
        "testo": "E me vegne ö sappin comme ai figgiœû,",
        "it": "E mi venga il broncio come ai bambini,"
      },
      {
        "testo": "Se sciâ vœû che ghe conte, câ scignôa",
        "it": "Se vossia vuole che glielo racconti, cara signora"
      },
      {
        "testo": "Mi m'arrendo e faiô comme sciâ vœû,",
        "it": "Io mi arrendo e farò come lei vuole,"
      },
      {
        "testo": "E ghe desteghiô zû tutta a mæ stoia",
        "it": "E le sbroglierò giù tutta la mia storia"
      },
      {
        "testo": "E l'incendio terribile de Troia.",
        "it": "E l'incendio terribile di Troia."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-1-parte-2-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 2",
      "it": "Il cavallo e la finta partenza"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Sti bonægia de greci inveninæ",
        "it": "Questa gentaglia di Greci inveleniti"
      },
      {
        "testo": "De no pûeinelo mette ciû derë,",
        "it": "Per non potercelo più mettere di dietro,"
      },
      {
        "testo": "Doppo avei caccioû via sangue e dinæ",
        "it": "Dopo aver buttato via sangue e denari"
      },
      {
        "testo": "Senza costrûto e mette avanti ûn pë,",
        "it": "Senza costrutto e senza fare un passo avanti,"
      },
      {
        "testo": "Comme tûtti i batösi e i mandilæ",
        "it": "Come tutti i teppisti e i borsaioli"
      },
      {
        "testo": "Han misso man ai færi dö mestë,",
        "it": "Hanno messo mano ai ferri del mestiere,"
      },
      {
        "testo": "All'inganno, ai manezzi, all'impostûa:",
        "it": "All'inganno, ai maneggi, all'impostura:"
      },
      {
        "testo": "Arti che riescian dacché ö mondo ö dûa!",
        "it": "Arti che riescono da che il mondo dura!"
      },
      {
        "testo": "Sciâ s'immagine ûn pô, che han misso man",
        "it": "Lei s'immagini un po', che han messo mano"
      },
      {
        "testo": "Con di travi e de tôe ben cömentæ,",
        "it": "Con delle travi e delle tavole ben assestate,"
      },
      {
        "testo": "A ûn cavallo che ö l'ëa scinn-a doman,",
        "it": "A un cavallo che non finiva mai,"
      },
      {
        "testo": "Äto comme i balûardi da çittæ;",
        "it": "Alto come i baluardi della città;"
      },
      {
        "testo": "Poi finzendo, i ruffien, de fûtte ö can,",
        "it": "Poi, fingendo, i ruffiani, di svignarsela,"
      },
      {
        "testo": "Han piggioû sporta e færi e son filæ,",
        "it": "Han preso sporta e ferri e se la sono filata,"
      },
      {
        "testo": "Ma lasciando i ciû bûlli e i ciû batôsi",
        "it": "ma lasciando i più bulli e i più teppisti"
      },
      {
        "testo": "Dentro da pansa dö cavallo ascösi.",
        "it": "Dentro la pancia del cavallo nascosti."
      },
      {
        "testo": "Pe contro a Troia, forse sciâ ö saviâ,",
        "it": "Di fronte a Troia, forse Lei lo saprà,"
      },
      {
        "testo": "Gh'é un'isöa comme quella de Berzezzi,",
        "it": "c'è un'isola come quella di Bergeggi,"
      },
      {
        "testo": "Ûnn'a votta, fiorente e popolâ,",
        "it": "una volta fiorente e popolata,"
      },
      {
        "testo": "Aôa ûn mûggio de sasci, a picco e sgrezzi;",
        "it": "ora un mucchio di sassi, a picco e rocciosi;"
      },
      {
        "testo": "I greci, fando mostra de filâ,",
        "it": "i Greci, facendo finta di filare,"
      },
      {
        "testo": "Se ghe son fermæ dietro in sce i ormezzi;",
        "it": "si son fermati lì dietro, agli ormeggi;"
      },
      {
        "testo": "Noî, cose serve dighe ûnn-a bôxia,",
        "it": "noi, a che serve dirle una bugia,"
      },
      {
        "testo": "Semmo stæti bedûin, l'emmo sciorbia!",
        "it": "siamo stati beduini, ce la siamo bevuta!"
      },
      {
        "testo": "Sciâ se pœû immaginâ quant'allegria",
        "it": "Lei si può immaginare quanta allegria,"
      },
      {
        "testo": "Quanto sciato, che fö, che ramadan!",
        "it": "quanto chiasso, che frastuono, che ramadan!"
      },
      {
        "testo": "Stemmo allegri figgiœû che a le finîa,",
        "it": "Stiamo allegri, ragazzi, che è finita,"
      },
      {
        "testo": "Sti brûttöî finalmente se ne van!",
        "it": "questi vigliacchi finalmente se ne vanno!"
      },
      {
        "testo": "Chi s'abbrassa, chi spaxima, chi cria,",
        "it": "Chi si abbraccia, chi spasima, chi grida,"
      },
      {
        "testo": "Chi s'ammalocca, chi se tocca a man,",
        "it": "chi si aggroviglia, chi si stringe la mano,"
      },
      {
        "testo": "E chi sâta, chi balla, chi sgambetta,",
        "it": "e chi salta, chi balla, chi sgambetta,"
      },
      {
        "testo": "Chi cianze da-o piaxei, chi s'incicchetta!",
        "it": "chi piange dal piacere, chi si sbronza!"
      },
      {
        "testo": "Comme quande se sente ö campanin",
        "it": "Come quando si sente la campanella"
      },
      {
        "testo": "Che ö l'é ö segno dö termine da schœûa",
        "it": "che è il segnale della fine della scuola,"
      },
      {
        "testo": "Tûtti quanti i scolai, grendi e piccin,",
        "it": "tutti quanti gli scolari, grandi e piccini,"
      },
      {
        "testo": "S'asbrian, se spuncian, pe sciortî de fœûa,",
        "it": "si precipitano, si spingono per uscire fuori,"
      },
      {
        "testo": "Pensando za a-e delizie dö scrollin,",
        "it": "pensando già alle delizie dello scrollin,"
      },
      {
        "testo": "Dö pampano e da lippa all'Accassœûa,",
        "it": "del pampano e della lippa all'Acquasola,"
      },
      {
        "testo": "Cosî noi, quæxi imbriæghi, invexendæ",
        "it": "così noi, quasi ubriachi, in subbuglio,"
      },
      {
        "testo": "S'asbriemmo a futti cû, fœûa da çittæ",
        "it": "ci precipitammo a rotta di collo, fuori dalla città."
      },
      {
        "testo": "E lì tûtti pe-o campo abbandonoû",
        "it": "E lì tutti per il campo abbandonato,"
      },
      {
        "testo": "Chi da ûn canto e dall'âltro a frûgattâ;",
        "it": "Chi da un canto e chi dall'altro a frugare;"
      },
      {
        "testo": "Chi gh'ëa e navi, se dîva, chi accampoû",
        "it": "Qui c'erano le navi, si diceva, qui accampato"
      },
      {
        "testo": "Gh'ëa Diomede, chi quello mandilâ",
        "it": "C'era Diomede, qui quel borsaiolo"
      },
      {
        "testo": "D'Ulisse, chi Achille ö se retioû;",
        "it": "Di Ulisse, qui Achille si era ritirato;"
      },
      {
        "testo": "Chi gh'ëa ö stato maggiö, chi gh'ëa l'armâ,",
        "it": "Qui c'era lo stato maggiore, qui c'era l'armata,"
      },
      {
        "testo": "Chi gh'ëa a primma caxon dö noströ gûao",
        "it": "Qui c'era la causa prima dei nostri guai:"
      },
      {
        "testo": "Quello becco fottûo de Menelao",
        "it": "Quel becco fottuto di Menelao."
      },
      {
        "testo": "Ma tûtti da-o cavallo s'ëan fermæ,",
        "it": "Ma tutti dal cavallo si erano fermati,"
      },
      {
        "testo": "E ciascûn tiava a mezo a so opinion,",
        "it": "E ciascuno tirava a mezzo la sua opinione,"
      },
      {
        "testo": "Chi vueiva tiâlo dentro da çittæ,",
        "it": "Chi voleva tirarlo dentro alla città,"
      },
      {
        "testo": "Chi dâghe fœûgo sensa remiscion,",
        "it": "Chi dargli fuoco senza pietà,"
      },
      {
        "testo": "Chi scì, chi nö, s'ëan tanto inveninæ,",
        "it": "Chi sì, chi no, si erano talmente inveleniti,"
      },
      {
        "testo": "Da dâse dö brütô, dö belinon",
        "it": "Da darsi del vigliacco, del belinone,"
      },
      {
        "testo": "E ö cæto ö s'ëa za fæto coscì grosso,",
        "it": "E il putiferio si era già fatto così grande,"
      },
      {
        "testo": "Che se stavan pe mette e man addosso.",
        "it": "Che stavano per mettersi le mani addosso"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-1-parte-2-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 3",
      "it": "Laocoonte avverte invano"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Tutt'assemme Laoconte, ûn de comando,",
        "it": "Tutt'a un tratto Laocoonte, uno di comando,"
      },
      {
        "testo": "Che ö l'aveiva ciù musse che dinæ,",
        "it": "Che aveva più musse che denari,"
      },
      {
        "testo": "Ö s'asbria in sce a ciassa giastemmando",
        "it": "Si precipita sulla piazza bestemmiando,"
      },
      {
        "testo": "Co-a faccia rössa e i œûggi stralûnæ;",
        "it": "Con la faccia rossa e gli occhi stralunati;"
      },
      {
        "testo": "E comme a l'é st'affare, ö cria, da quando",
        "it": "E com'è questo affare\", grida, \"da quando"
      },
      {
        "testo": "Séi vegnûi coscì nesci, abbelinæ?",
        "it": "Siete diventati così scemi, abbelinati?"
      },
      {
        "testo": "E piggiæ pe beduin quelle pellisse",
        "it": "E prendete per beduini quelle pellacce"
      },
      {
        "testo": "De greci e quello mandilâ d'Ulisse?",
        "it": "Dei Greci e quel borsaiolo d'Ulisse?\""
      },
      {
        "testo": "Cose gh'é? cose fæ? ma in mæ davvei",
        "it": "Cosa c'è? Cosa fate? Ma per davvero"
      },
      {
        "testo": "Me pâ che raxonæ dall'ombrisallo",
        "it": "Mi pare che ragioniate con l'ombelico!"
      },
      {
        "testo": "Ma comme se pœû dâ che nö veddei",
        "it": "Ma com'è possibile che non vediate"
      },
      {
        "testo": "Per côse han lascioû chi questo cavallo?",
        "it": "Perché hanno lasciato qui questo cavallo?"
      },
      {
        "testo": "Ma nö fæ da figgiœû, fæme ö piaxei,",
        "it": "Ma non fate i bambini, fatemi il piacere,"
      },
      {
        "testo": "Mandæ a fâ fûtte i greci e ö so regallö,",
        "it": "Mandate a farsi fottere i Greci e il loro regalo,"
      },
      {
        "testo": "Per mi, tant'è l'affare a no l'é liscia",
        "it": "Per me, tanto è, la faccenda non è liscia,"
      },
      {
        "testo": "E in Troia stö cavallo ö nö ghe piscia.",
        "it": "E in Troia questo cavallo non ci piscia!"
      },
      {
        "testo": "E coscì, senza azzunze ûnn'a parolla",
        "it": "E così, senza aggiungere una parola"
      },
      {
        "testo": "Ö te piggia l'amîa con a so lansa,",
        "it": "Prende la mira con la sua lancia,"
      },
      {
        "testo": "E con tûtta a so forza ö te ghe-a molla",
        "it": "E con tutta la sua forza gliela ammolla"
      },
      {
        "testo": "Che a se ghe va a ciantâ drita in ta pansa;",
        "it": "Che le si va a piantare dritta nella pancia;"
      },
      {
        "testo": "Ö cavallo dä botta, ö scroscie, ö scrolla,",
        "it": "Il cavallo per il colpo, scricchiola, trema,"
      },
      {
        "testo": "E ö rimbomba con tanta risonanza,",
        "it": "E rimbomba con tanta risonanza,"
      },
      {
        "testo": "Che ghe vœiva ûnn-a manega de matti,",
        "it": "Che ci voleva una manica di matti,"
      },
      {
        "testo": "Pê nö vedde che ö l'ëa pin de sordatti.",
        "it": "Per non vedere che era pieno di soldati"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-1-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 4",
      "it": "Schenone catturato"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Tutt'assemme ûnn-a strœûppa de paisen",
        "it": "Tutti assieme un gruppo di paesani"
      },
      {
        "testo": "Portan davanti a-o re, che ö l'ëa arrivoû,",
        "it": "Portano davanti al re, che era arrivato,"
      },
      {
        "testo": "Ûn zûenotto co-a faccia da putten,",
        "it": "Un giovanotto con la faccia da angioletto,"
      },
      {
        "testo": "Streito comme ûn salamme e ammanettoû;",
        "it": "Stretto come un salame e ammanettato;"
      },
      {
        "testo": "Ö l'ëa ascoso, dixeivan, in tö fen,",
        "it": "Era nascosto, dicevano, nel fieno,"
      },
      {
        "testo": "E appenn-a che l'han visto, ö se mostroû,",
        "it": "E appena lo hanno visto, si è fatto avanti,"
      },
      {
        "testo": "E lö da asperti, pe savei chi ö fösse,",
        "it": "E loro da navigati, per sapere chi fosse,"
      },
      {
        "testo": "Te l'han ligoû senza fâ tante mösse",
        "it": "Te l'hanno legato senza fare tante storie."
      },
      {
        "testo": "Stö zûenotto, ö l'ëa ûn greco, che d'inteisa",
        "it": "Questo giovanotto era un Greco, che d'intesa"
      },
      {
        "testo": "Con quella remenâ de mandilæ,",
        "it": "Con quella masnada di borsaioli,"
      },
      {
        "testo": "Morto pe morto, ö s'ëa piggioû l'impreisa",
        "it": "Morto per morto, si era preso l'incarico"
      },
      {
        "testo": "De fâli cö cavallo, intrâ in çittæ.",
        "it": "Di farli, con il cavallo, entrare in città."
      },
      {
        "testo": "Aôa attenta, scignöa, che chi ghe a speisa",
        "it": "Ora attenta, signora, che qui viene il bello:"
      },
      {
        "testo": "Sciâ sente che regîö, che abilitæ!",
        "it": "Senta che raggiro, che abilità!"
      },
      {
        "testo": "E da stö greco sciâ i conosce tûtti,",
        "it": "E da questo greco lei li conosce tutti,"
      },
      {
        "testo": "Cose son sti ruffien, sti farabûtti",
        "it": "Cosa sono sti ruffiani, sti farabutti."
      },
      {
        "testo": "Quande l'han visto, mi ghe lascio dî!",
        "it": "Quando l'hanno visto, le lascio dire!"
      },
      {
        "testo": "Ghe vosciûo i savi e i matti pe salvalö!",
        "it": "Ci son voluti i savi e i matti per salvarlo!"
      },
      {
        "testo": "Lascian tûtti ö cavallo, pe corrî",
        "it": "Lasciano tutti il cavallo, per correre"
      },
      {
        "testo": "A veddilo dappresso, a circondalo;",
        "it": "A vederlo da vicino, a circondarlo;"
      },
      {
        "testo": "Vœûan vedde tûtti, tûtti sta a sentî,",
        "it": "Volevano vedere tutti, tutti stare a sentire,"
      },
      {
        "testo": "Dîghe tûtti ûnn-a cosa e cuggionalo",
        "it": "Dirgli tutti qualcosa e coglionarlo"
      },
      {
        "testo": "E lé o strenzeiva ö cû dâ scagabûggia",
        "it": "E lui  stringeva il culo per la caga"
      },
      {
        "testo": "Da nö pöeighe ciû infiâ mancö ûn'agûggia.",
        "it": "Da non poterci più infilare manco un aghetto."
      },
      {
        "testo": "Poi, ö se misso a criâ: Poviö Schenön!",
        "it": "Poi, si è messo a gridare: \"Povero Schenone!"
      },
      {
        "testo": "Te ghe l'han proprio missö e rebattûo,",
        "it": "Ti ce l'hanno proprio messo e ribattuto,"
      },
      {
        "testo": "I troien, me vœan morto, e con raxön,",
        "it": "I Troiani mi vogliono morto, e con ragione,"
      },
      {
        "testo": "I mæ conçittadin, m'han zà fottûo,",
        "it": "I miei concittadini mi hanno già fottuto,"
      },
      {
        "testo": "Vöî dæghe ö restö senza compasciön,",
        "it": "Voi date il resto senza compassione,"
      },
      {
        "testo": "Ammazzæme figgiœû, che ve sprezûo,",
        "it": "Ammazzatemi ragazzi, ve lo giuro,"
      },
      {
        "testo": "Me ciû cao de finîla in t'ûnn-a votta,",
        "it": "Mi è più caro farla finita in una volta sola,"
      },
      {
        "testo": "Che provâ questo spaximo de potta!",
        "it": "Che provare questo spasimo di potta!\""
      },
      {
        "testo": "Ö l'aveiva ö singûlto, ö crescentin,",
        "it": "Aveva il singulto, il singhiozzo,"
      },
      {
        "testo": "Ö tegniva ö respïo comme i figgiœû",
        "it": "Tratteneva il respiro come i bambini"
      },
      {
        "testo": "Tanto che ö Re con tûtti i çittadin,",
        "it": "Tanto che il Re con tutti i cittadini,"
      },
      {
        "testo": "Ch'ëan za prönti a crövilo de rissœû,",
        "it": "Che erano già pronti a coprirlo di sassate,"
      },
      {
        "testo": "N'han avûo compasciön; divan: meschin,",
        "it": "Ne hanno avuto compassione; dicevano: \"meschino,"
      },
      {
        "testo": "Andæ là, n'aggiæ püia, fæve dö chœû,",
        "it": "Forza , non abbiate paura, rincuoratevi,\""
      },
      {
        "testo": "E inscisteivan, pregandolo che ö disse",
        "it": "E insistevano, pregandolo che dicesse"
      },
      {
        "testo": "Cose ö fâva, chi ö l'ëa, donde ö vegnisse.",
        "it": "Cosa faceva, chi era, da dove veniva."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-1-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 5",
      "it": "L'inganno di Sinone"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "E lë che ö voeiva fâne ingoâ de vesce,",
        "it": "E lui, che voleva farci ingoiare delle frottole,"
      },
      {
        "testo": "Rivolgendose a-o re, che ö l'ëa presente:",
        "it": "Rivolgendosi al re, che era presente:"
      },
      {
        "testo": "Sciâ no credde, scignor, che mi ghe tesce",
        "it": "\"Vossia non creda, signore, che io le tessa"
      },
      {
        "testo": "Di romanzi, ö che immagine, che invente;",
        "it": "Dei romanzi, o che mi immagini, che inventi;"
      },
      {
        "testo": "Mi son greco, anzi scì, no me rincresce",
        "it": "Io sono greco, anzi sì, non mi rincresce"
      },
      {
        "testo": "De dîghelo in sce-a faccia avertamente",
        "it": "Di dirglielo in faccia apertamente"
      },
      {
        "testo": "Che mi son ûn bellinön a çento döggie",
        "it": "Che io sono un belinöne cento volte raddoppiato ,"
      },
      {
        "testo": "Ma nisciun m'ha mai dito: contacöggie.",
        "it": "Ma nessuno mi ha mai detto: contaballe.\""
      },
      {
        "testo": "Sciâ l'aviâ, za m'immagino, sentîo",
        "it": "Lei avrà, già m'immagino, sentito"
      },
      {
        "testo": "Parlâ de Palamede, rinomoû",
        "it": "Parlare di Palamede, rinomato"
      },
      {
        "testo": "Comme ommo valoroso, onesto e ardîo,",
        "it": "Come uomo valoroso, onesto e ardito,"
      },
      {
        "testo": "Che i greci per invidia han ammazzoû.",
        "it": "Che i Greci per invidia hanno ammazzato."
      },
      {
        "testo": "Quando lë pe sta guæra ö le partîo,",
        "it": "Quando lui per questa guerra è partito,"
      },
      {
        "testo": "Pe vôéntæ dö papà, l'ho accompagnoû;",
        "it": "Per volontà del padre, l'ho accompagnato;"
      },
      {
        "testo": "Vivo lë mi ho sciûscioû sempre in coverta",
        "it": "Finché era vivo lui, me la passavo sempre alla grande,"
      },
      {
        "testo": "E nisciûn se azzardoû de dâme a berta.",
        "it": "E nessuno si è azzardato a prendermi in giro"
      },
      {
        "testo": "Ma lë morto, pe invidia e tradimento.",
        "it": "Ma morto lui, per invidia e tradimento"
      },
      {
        "testo": "De quello brûtto mandilâ d'Ulisse,",
        "it": "Di quel brutto borsaiolo di Ulisse,"
      },
      {
        "testo": "Mi n'ho sentîo tanto rincrescimento.",
        "it": "Io ne ho provato un tale dispiacere,"
      },
      {
        "testo": "Che no saveivo ciû cose me disse!",
        "it": "Che non sapevo più nemmeno io cosa dire!"
      },
      {
        "testo": "Ho sbraggioû comme un matto, e mæ zûamento,",
        "it": "Ho sbraitato come un matto, e parola mia"
      },
      {
        "testo": "Se no ghe l'ho picchæ, ghe l'ho promisse,",
        "it": "Se non gliele ho picchiate, gliele ho promesse,"
      },
      {
        "testo": "L'ho provöcoû, g'ho ditö cose ö l'ea",
        "it": "L'ho provocato, gli ho detto che cosa era:"
      },
      {
        "testo": "Pendin da forca, avanzo de galea.",
        "it": "Un pendaglio da forca, un avanzo di galera."
      },
      {
        "testo": "E da quello momento ö s'é sprezûoû",
        "it": "E da quel momento ha giurato"
      },
      {
        "testo": "Stö vile, stö brutû, de fame a pelle;",
        "it": "Questo vile, questo vigliacco, di farmi la pelle;"
      },
      {
        "testo": "Nö ghe diô, cose ö l'agge immanegoû",
        "it": "Non vi dirò che cosa abbia immaginato"
      },
      {
        "testo": "De regii, perché desse in ciampanelle",
        "it": "Di raggiri, perché andasse in ciampanelle (impazzire)"
      },
      {
        "testo": "E ö non ha dæto fondo, ö n'ha quietoû,",
        "it": "E non si è fermato, non si è quietato,"
      },
      {
        "testo": "Scin che Calcante consûltando e stelle...",
        "it": "Sino a che Calcante consultando le stelle..."
      },
      {
        "testo": "Ma cose staggo chi a sciûgaghe e balle?",
        "it": "Ma cosa sto qui ad asciugarvi le balle?"
      },
      {
        "testo": "Son chi son, zû unn-a botta, e che a nö falle!",
        "it": "Sono chi sono, giù una botta, e che non fallisca!"
      },
      {
        "testo": "Ma noî, za punti dâ cûrioxitæ",
        "it": "Ma noi, già punti dalla curiosità"
      },
      {
        "testo": "S'eimo missi a pregalö comme i santi,",
        "it": "Ci eravamo messi a pregarlo come i santi,"
      },
      {
        "testo": "Perché ö nö ne lasciesse lì â meitæ",
        "it": "Perché non ci lasciasse lì a metà"
      },
      {
        "testo": "Ö se fesse coraggio e ö tiasse avanti,",
        "it": "Si facesse coraggio e andasse avanti,"
      },
      {
        "testo": "Saveivimo che i greci ëan mandilæ",
        "it": "Sapevamo che i Greci erano furfanti"
      },
      {
        "testo": "E n'aveivimo avûo prœûve bastanti,",
        "it": "E ne avevamo avuto prove bastanti,"
      },
      {
        "testo": "Ma quandö pe derê ö s'ha da piggiâ",
        "it": "Ma quando nel di dietro si ha da pigliarlo,"
      },
      {
        "testo": "Son tûtte cuggie, no se pœu sarvâ",
        "it": "Son tutte balle, non ci si può salvare"
      },
      {
        "testo": "Lë, finzendo ûn momento d'inçertezza,",
        "it": "Lui, fingendo un momento d'incertezza,"
      },
      {
        "testo": "Ö se reiso, e coscì ö l'ha continûoû",
        "it": "Si arrese, e così ha continuato:"
      },
      {
        "testo": "Stæme dunque a sentî: l'ëa za ûnn-a pezza",
        "it": "\"Statemi dunque a sentire: era già da un pezzo"
      },
      {
        "testo": "Che fra i greci s'ëa dîto e combinoû",
        "it": "Che fra i Greci si era detto e combinato"
      },
      {
        "testo": "De çercâ, con l'andasene a sarvezza,",
        "it": "Di cercare, con l'andarsene, la salvezza,"
      },
      {
        "testo": "Vedendo che ö l'ëa ûn caxo disperoû,",
        "it": "Vedendo che era un caso disperato,"
      },
      {
        "testo": "Ma e battaglie, a burrasca, a pestilenza",
        "it": "Ma le battaglie, la burrasca, la pestilenza"
      },
      {
        "testo": "N'han sempre fætö ritardâ a partenza;",
        "it": "Ci hanno sempre fatto ritardare la partenza;\""
      },
      {
        "testo": "Aôa poi, ch'ëan decisi de filâ,",
        "it": "Ora poi, che erano decisi a filarsela,"
      },
      {
        "testo": "Prontö ö cavallo e i ordini za dæti",
        "it": "Pronto il cavallo e gli ordini già dati,"
      },
      {
        "testo": "Se mette torna ö vento de meistrâ",
        "it": "Si alza di nuovo il vento di maestrale"
      },
      {
        "testo": "E besœûgna stâ lì, cöi baûli fæti;",
        "it": "E bisogna stare lì, coi bauli fatti;"
      },
      {
        "testo": "Ma sciccome nö gh'ëa da zinzannâ",
        "it": "Ma siccome non c'era da cincischiare"
      },
      {
        "testo": "Pe poi no se trovâ torna in ti cæti,",
        "it": "Per non trovarsi poi di nuovo nei guai,"
      },
      {
        "testo": "Euripilo han spedìo, perché ö sentisse",
        "it": "Hanno spedito Euripilo, perché sentisse"
      },
      {
        "testo": "L'oracolo de Delfo cose ö disse;",
        "it": " l'oracolo di Delfi cosa dicesse;"
      },
      {
        "testo": "E a risposta ve a chì: se pe vegnî",
        "it": "E la risposta eccola qui: se per venire"
      },
      {
        "testo": "Aveivan piggioû a pelle a ûnn-a zûenotta,",
        "it": "Avevano fatto la pelle a una giovanotta,"
      },
      {
        "testo": "Aôa poi che l'ëa ö caxo de partî,",
        "it": "Ora poi che era il caso di partire,"
      },
      {
        "testo": "Besœûgnava fâ come l'atra votta,",
        "it": "Bisognava fare come l'altra volta,"
      },
      {
        "testo": "Ma co-a diverscitæ... miæ che brûtûi,",
        "it": "Ma con la differenza... guardate che bruttura,"
      },
      {
        "testo": "Che ghe vueiva ûn belin, non ûnn-a potta,",
        "it": "Che ci voleva un belino, non una potta,"
      },
      {
        "testo": "Cioè pe parlâ comme se fa in famiggia",
        "it": "Cioè, per parlare come si fa in famiglia,"
      },
      {
        "testo": "Ghe sæiva vosciûo ûn masccio e nö ûnn-a figgia.",
        "it": "Ci sarebbe voluto un maschio e non una ragazza."
      },
      {
        "testo": "Quande se propaloû questo verdetto",
        "it": "Quando si propagò questo verdetto"
      },
      {
        "testo": "Ognidûn se sentîo strenze o panê",
        "it": "Ognuno si sentì stringere il paniere,"
      },
      {
        "testo": "No savendose ancon chi sæ l'eletto",
        "it": "Non sapendosi ancora chi sia l'eletto"
      },
      {
        "testo": "E temendo ognidûn d'esilo lë,",
        "it": "E temendo ognuno di esserlo lui;"
      },
      {
        "testo": "Ma mi poi, che saveivo da ûn pessetto",
        "it": "Ma io poi, che sapevo da un pezzetto"
      },
      {
        "testo": "Che çercavan de mettiméo derê,",
        "it": "Che cercavano di mettermelo di dietro,"
      },
      {
        "testo": "No me ghe vosciûo gûæi a mangiâ a lamma",
        "it": "Non ci ho messo molto a mangiar la foglia"
      },
      {
        "testo": "E a vedde ûn tiö de quello pellegramma.",
        "it": "E a vederci un tiro mancino di quel pellegrama."
      },
      {
        "testo": "E de fæto, Calcante, interrogoû",
        "it": "E di fatto, Calcante, interrogato"
      },
      {
        "testo": "(A l'ëa cosa za inteisa e combinâ)",
        "it": "(Era una cosa già intesa e combinata)"
      },
      {
        "testo": "Perché ö disse chi ö l'ëa sto disgrazioû",
        "it": "Affinché dicesse chi era questo disgraziato"
      },
      {
        "testo": "Che se sæiva dovûo sacrificâ,",
        "it": "Che si sarebbe dovuto sacrificare,"
      },
      {
        "testo": "Ö se reiso all'invito, ö se cegoû",
        "it": "Si arrese all'invito, si piegò"
      },
      {
        "testo": "Doppo d'esise fæto ûn pô pregâ,",
        "it": "Dopo essersi fatto un po' pregare,"
      },
      {
        "testo": "E comme me l'aveivo zâ previsto",
        "it": "E come avevo già previsto"
      },
      {
        "testo": "Chi ö le andæto a çercâ? mi poviou Cristo!",
        "it": "Chi è andato a cercare? Me, povero Cristo!"
      },
      {
        "testo": "Ghe lascio dî, comme se son resciôæ",
        "it": "Le lascio immaginare, come si sono risollevati (rianimati)"
      },
      {
        "testo": "Quando a scelta a l’é chéita adosso a mi,",
        "it": "Quando la scelta è caduta addosso a me,"
      },
      {
        "testo": "Tutti a reo se son parsci recoviæ",
        "it": "Tutti quanti sono sembrati riprendersi"
      },
      {
        "testo": "De vedde e cose andâ a finî coscì.",
        "it": "Nel vedere le cose andare a finire così."
      },
      {
        "testo": "M'han sûbito ligoù pe l'anscietê",
        "it": "Mi hanno subito legato per l'ansia"
      },
      {
        "testo": "Che mi no ghe ne desse ûn cianto lì,",
        "it": "Che io non li piantassi lì,"
      },
      {
        "testo": "E in quinta e sprescia, han preparoû l'artâ",
        "it": "E in fretta e furia, hanno preparato l'altare"
      },
      {
        "testo": "E legne, ö fœûgo, i sacri anghæsi, a sâ.",
        "it": "La legna, il fuoco, i sacri arnesi, il sale."
      },
      {
        "testo": "Me son visto fottûo! primma de mûi",
        "it": "Mi sono visto fottuto! Prima di morire"
      },
      {
        "testo": "Ho vosciûo, sacranon, veddighe drento,",
        "it": "Ho voluto, perdinci, guardarci dentro,"
      },
      {
        "testo": "Ho aspëtoû quande tûtti ëan a dormî,",
        "it": "Ho aspettato che tutti fossero a dormire,"
      },
      {
        "testo": "E me son deslìgou in t'ûn momento,",
        "it": "E mi sono slegato in un momento,"
      },
      {
        "testo": "E lì dalli, in te quante ö staggo a dî",
        "it": "E lì dagli, nel tempo che ci metto a dirlo"
      },
      {
        "testo": "Me son trovoû fœûa dell'accampamento,",
        "it": "Mi sono trovato fuori dall'accampamento,"
      },
      {
        "testo": "E poi mettime a andâ comme ûnn-a leccia;",
        "it": "E poi mi sono messo a correre come una scheggia;"
      },
      {
        "testo": "Pe sta votta Calcante ö no me beccia.",
        "it": "Per questa volta Calcante non mi fotte!"
      },
      {
        "testo": "Pin d'anscietæ, de spaximo, de puia,",
        "it": "Pieno d'ansia, di spasimo, di paura,"
      },
      {
        "testo": "Senza pûeime sfamâ c'ûn pô de pan,",
        "it": "Senza potermi sfamare con un po' di pane,"
      },
      {
        "testo": "Scin che n'ho visto ch'ëan andæti via,",
        "it": "Finché non ho visto che erano andati via,"
      },
      {
        "testo": "Mi son stæto ammûggioû in t'ûn pâtan",
        "it": "Me ne sono stato appallottolato in un pantano;"
      },
      {
        "testo": "Quande poi... ma a mæ storia a le finia,",
        "it": "Quando poi... ma la mia storia è finita,"
      },
      {
        "testo": "Mi son chi che me metto in tê so man,",
        "it": "Io sono qui che mi metto nelle sue mani,"
      },
      {
        "testo": "Sciâ ne fassan de mi, cose se sæ",
        "it": "Facciate di me qualsiasi cosa sia "
      },
      {
        "testo": "Ma sciâ m'aggian un'ombra da caitæ.",
        "it": "Ma abbiate di me un'ombra di carità."
      },
      {
        "testo": "Cose serve! ö n'ha tanto inverdûgoû",
        "it": "A che serve dirlo! Ci ha così tanto intortati"
      },
      {
        "testo": "Che cianzeivimo quæxi comme lê",
        "it": "Che piangevamo quasi come lui"
      },
      {
        "testo": "Quindi ö re pe so bocca ö l'ha ordinou",
        "it": "Quindi il re di sua bocca ha ordinato"
      },
      {
        "testo": "Che ö se desmanettasse in sce döi pë",
        "it": "Che gli si togliessero le manette su due piedi"
      },
      {
        "testo": "E ö ga dîto: va là, ti ë perdonoû;",
        "it": "E gli ha detto: \"Va' là, sei perdonato;"
      },
      {
        "testo": "D'aôa in poi, ti no sæ ciù prexonné,",
        "it": "Da ora in poi, non sarai più prigioniero,"
      },
      {
        "testo": "Ti restiæ con noi atri e ti troviæ",
        "it": "Resterai con noialtri e troverai"
      },
      {
        "testo": "Ûnn-a patria in te Troia, e in noi, di fræ",
        "it": "Una patria in Troia, e in noi, dei fratelli.\""
      },
      {
        "testo": "Ma contine ûn pittin cose vœû dî",
        "it": "\"Ma raccontaci un pochino cosa vuol dire"
      },
      {
        "testo": "Questo enorme cavallo che han lascioû;",
        "it": "Questo enorme cavallo che hanno lasciato;"
      },
      {
        "testo": "Han fæto ûn voto primma de partî,",
        "it": "Hanno fatto un voto prima di partire,"
      },
      {
        "testo": "O l’ë inganno o magía che han preparoû?",
        "it": "O è un inganno o una magia che hanno preparato?"
      },
      {
        "testo": "A quarcosa, perdie, ö l'ha da servì,",
        "it": "A qualcosa, perdinci, deve pur servire,"
      },
      {
        "testo": "Che dunque nö l'avieivan fabbricoû!",
        "it": "Che altrimenti non l'avrebbero mica fabbricato!\""
      },
      {
        "testo": "E lë, che ö l'aspetava a balla a-o botto,",
        "it": "E lui, che aspettava la palla al balzo,"
      },
      {
        "testo": "Ghe lascio dî, se ö ne g'ha dæto sotto.",
        "it": "Le lascio immaginare, se non ci ha dato sotto!"
      },
      {
        "testo": "Aôa, per tûtto zû, ö se misso a criâ:",
        "it": "Allora, per tutto giù, si è messo a gridare:"
      },
      {
        "testo": "Mi greco nö son ciû pe ûn aççidente,",
        "it": "\"Io greco non sono più per un accidente,"
      },
      {
        "testo": "Vœûggio vedde un pittin, chi m'obblighiâ",
        "it": "Voglio vedere un pochino, chi mi obbligherà"
      },
      {
        "testo": "A fâme fâ ö rûffian a questa gente;",
        "it": "A farmi fare il ruffiano per questa gente;"
      },
      {
        "testo": "Conto tûtto, perdie, vœûggio mostrâ",
        "it": "Racconto tutto, perdinci, voglio mostrare"
      },
      {
        "testo": "Che almeno mi ve son riconoscente;",
        "it": "Che almeno io vi sono riconoscente;"
      },
      {
        "testo": "E d'in cangio a-o servixio che ve fasso",
        "it": "E in cambio del servizio che vi faccio"
      },
      {
        "testo": "Voi atri ascì, nö me brûxiæ ö paggiasso.",
        "it": "Voi altri però, non mi bruciate il pagliaccio.\" (tradite)"
      },
      {
        "testo": "I greci, han sempre avûo da divozion",
        "it": "I Greci, hanno sempre avuto della devozione"
      },
      {
        "testo": "Pe Santa Ratalegua e l'han portâ,",
        "it": "Per Santa Ratalegua e l'hanno portata,"
      },
      {
        "testo": "Primma de vegnî in guæra, in procescion;",
        "it": "Prima di venire in guerra, in processione;"
      },
      {
        "testo": "E chi, gh'aveivan misso sciû ûn artâ.",
        "it": "E qui, le avevano messo su un altare."
      },
      {
        "testo": "Lë a g'ha sempre mostroû da protezion",
        "it": "Lei ha sempre mostrato loro protezione"
      },
      {
        "testo": "Scinn-a a-o giorno che quello mandilâ",
        "it": "Fino al giorno in cui quel furfante"
      },
      {
        "testo": "D'Ulisse, che ö l'aveiva un pô e sampette,",
        "it": "Di Ulisse, che aveva un po' le zampette lunghe,"
      },
      {
        "testo": "Ö se azzardoû de tiâghe sciû e fâdette.",
        "it": "Si azzardò a tirarle su la gonna."
      },
      {
        "testo": "E d'alöa in poi, nö ghe ciû stæto verso",
        "it": "E da allora in poi, non c'è stato più verso"
      },
      {
        "testo": "Che ghe ne vûesse andâ unn-a pe drito,",
        "it": "Che ne volesse andare una per il dritto,"
      },
      {
        "testo": "E voti e tridui, tûtto tempo perso,",
        "it": "E voti e tridui, tutto tempo perso,"
      },
      {
        "testo": "E zazuin e novenn-e all'infinito;",
        "it": "E digiuni e novene all'infinito;"
      },
      {
        "testo": "A l'aveiva piggiæ tanto a-o reverso",
        "it": "L'aveva presa talmente male "
      },
      {
        "testo": "Che quande l'han vosciûa cangiâ de scîto",
        "it": "Che quando l'hanno voluta cambiare di posto"
      },
      {
        "testo": "A se missa a giâ i œûggi, a cianse, a sûâ",
        "it": "Si è messa a girare gli occhi, a piangere, a sudare"
      },
      {
        "testo": "E a l'ha fæto trei bötti in sce l'artâ.",
        "it": "E ha fatto tre salti sull'altare."
      },
      {
        "testo": "Figgiœu cai, chi no ghe ciù remiscion,",
        "it": "\"Cari ragazzi, qui non c'è più remissione,"
      },
      {
        "testo": "Alöa Calcante o ne se misso a dî,",
        "it": "Allora Calcante si è messo a dirci,"
      },
      {
        "testo": "A santa a no vœû intende de raxon,",
        "it": "La santa non vuole intendere ragione,"
      },
      {
        "testo": "A vœû andasene a casa, a vœû partî;",
        "it": "Vuole andarsene a casa, vuole partire;"
      },
      {
        "testo": "Quande lë a l'aviâ avûo soddisfazion,",
        "it": "Quando lei avrà avuto soddisfazione,"
      },
      {
        "testo": "Solo alôa se porriâ torna vegnî;",
        "it": "Solo allora si potrà torna venire;"
      },
      {
        "testo": "Se dûnque, persûadeive che ghe spûssa",
        "it": "Sicché, persuadetevi che le puzza"
      },
      {
        "testo": "Ö fiato a Troia e che ghe scrito: sûssa",
        "it": "Il fiato a Troia e che c'è scritto: sûssa\""
      },
      {
        "testo": "E l'é pe so vûentæ, che han fabbricoû",
        "it": "\"Ed è per sua volontà, che hanno fabbricato"
      },
      {
        "testo": "Sto cavallo de legno che le chi,",
        "it": "Questo cavallo di legno che è qui,"
      },
      {
        "testo": "O l'é ûn voto pe-a santa, e l'han lascioû",
        "it": "È un voto per la santa, e l'hanno lasciato"
      },
      {
        "testo": "Invece de palladio o che so mi,",
        "it": "Invece del palladio o che so io,"
      },
      {
        "testo": "E l'han fæto tant'âto e spertegoû",
        "it": "E l'hanno fatto tanto alto e sperticato"
      },
      {
        "testo": "Perché nö pûesci remesciâ de lî",
        "it": "Perché non possiate rimuovere da lì"
      },
      {
        "testo": "E nö rende i so calcoli sbagliæ",
        "it": "E non rendere i loro calcoli sbagliati "
      },
      {
        "testo": "Con portavelo drento da çittæ.",
        "it": "Portandovelo dentro la città.\""
      },
      {
        "testo": "E l'é chi dove sta tûtto ö segreto;",
        "it": "\"Ed è qui che sta tutto il segreto;"
      },
      {
        "testo": "Dæme a mente figgiêu che no v'inganno,",
        "it": "Datemi retta ragazzi che non vi inganno,"
      },
      {
        "testo": "Se ö rompî, se ö guastæ, ve ö diggo sccetto,",
        "it": "Se lo rompete, se lo guastate, ve lo dico schietto,"
      },
      {
        "testo": "Vöi, sei belli fottûi fin da quest'anno;",
        "it": "Voi, siete belli fottuti fin da quest'anno;"
      },
      {
        "testo": "Ma se invece gh'aviei cûra e rispetto,",
        "it": "Ma se invece ne avrete cura e rispetto,"
      },
      {
        "testo": "Nö solo i greci nö ve fan ciû danno,",
        "it": "Non solo i Greci non vi faranno più danno,"
      },
      {
        "testo": "Ma dovian fâ a figûa de præe Michë,",
        "it": "Ma dovranno fare la figura di prete Michele,"
      },
      {
        "testo": "Che ö se ö metteiva in tö stoppin da lë.",
        "it": "Che se lo metteva nello stoppino da solo.\""
      },
      {
        "testo": "E noi da belinoïn s'emmo credûo",
        "it": "E noi da belinoni abbiamo creduto"
      },
      {
        "testo": "E sô cûgge e sô scene, e sô sciortîe,",
        "it": "Alle sue balle, alle sue scene, e alle sue uscite,"
      },
      {
        "testo": "Noi ch'eimo sempre stæti ûn osso dûo",
        "it": "Noi che eravamo sempre stati un osso duro"
      },
      {
        "testo": "Pe Diomede e pe Achille e che perdîe",
        "it": "Per Diomede e per Achille e che, perdinci,"
      },
      {
        "testo": "Dexe anni de patî, no n'han fottûo,",
        "it": "Dieci anni di patimenti non ci hanno fottuto,"
      },
      {
        "testo": "Se semmo rovinæ pe due böxie;",
        "it": "Ci siamo rovinati per due bugie;"
      },
      {
        "testo": "Ma pe futtine ben, pe dâne adosso,",
        "it": "Ma per fotterci per bene, per darci adosso,"
      },
      {
        "testo": "N'è successo ûn anghæso ancon ciû grosso.",
        "it": "Ci è successo un guaio ancora più grosso."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-1",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 6",
      "it": "Laocoonte e i serpenti"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Laoconte che ö l'ëa stæto nominoû",
        "it": "Laocoonte che era stato nominato"
      },
      {
        "testo": "Cappellan de Nettûno, in sce l'artà",
        "it": "Cappellano di Nettuno, sull'altare"
      },
      {
        "testo": "Ö l'aveiva za ûn toro preparôu",
        "it": "Aveva già preparato un toro"
      },
      {
        "testo": "E ö l'ëa za lì pe daghe ûnn-a massûa,",
        "it": "Ed era già lì per dargli una mazzata,"
      },
      {
        "testo": "Quande dall'Isöa, che g'ho za çittôu,",
        "it": "Quando dall'Isola, che ho già citato,"
      },
      {
        "testo": "(Se ghe penso me ven ancon da sûâ)",
        "it": "(Se ci penso mi viene ancora da sudare)"
      },
      {
        "testo": "Se vedde vegnî a nêuo, döi sacramenti",
        "it": "Si vedono venire a nuoto due \"sacramenti\" "
      },
      {
        "testo": "Che ä sagoma, a-o regìo, paivan serpenti",
        "it": "Che per la sagoma, per l'andamento, sembravano serpenti."
      },
      {
        "testo": "Vegnivan zû cö stêumago addrizzôu,",
        "it": "Venivano giù con lo stomaco drizzato,"
      },
      {
        "testo": "Co-a bocca spalancâ pinn-a de bava",
        "it": "Con la bocca spalancata piena di bava,"
      },
      {
        "testo": "Tûtto ö resto dö corpo arriguelôu,",
        "it": "Tutto il resto del corpo attorcigliato,"
      },
      {
        "testo": "Ö regïava in te l'ægûa e ö se regïava,",
        "it": "Che rigirava nell'acqua e si rigirava,"
      },
      {
        "testo": "Se servivan da côa comme battûou",
        "it": "Si servivano della coda come frusta"
      },
      {
        "testo": "Che paiva læte ö mâ tanto ö scciûmmava;",
        "it": "Che sembrava latte il mare tanto che schiumava;"
      },
      {
        "testo": "E vegnûi zû corrindo in fin ä spiaggia",
        "it": "E venuti giù di corsa fino alla spiaggia"
      },
      {
        "testo": "Se son missi a scigôà neigri dä raggia.",
        "it": "Si son messi a sibilare neri dalla rabbia."
      },
      {
        "testo": "Semmo tûtti restæ senza respîo,",
        "it": "Siamo tutti restati senza respiro,"
      },
      {
        "testo": "Senza gambe e ciû gianchi che un lenzêu,",
        "it": "Senza gambe e più bianchi di un lenzuolo,"
      },
      {
        "testo": "Nö ghe stæto che ûn ûrlo, ûn sbraggio, un crio,",
        "it": "Non c'è stato che un urlo, uno sbraitare, un grido,"
      },
      {
        "testo": "«Andævene, son chi, sarva chi pêu»,",
        "it": "«Andatevene, sono qui, si salvi chi può!»,"
      },
      {
        "testo": "I serpenti in t'ûn botto, in t'ûn asbrîo,",
        "it": "I serpenti in un botto, in uno slancio,"
      },
      {
        "testo": "S'arrissan a Laoconte e a-i sô figgiêu",
        "it": "Si avventano su Laocoonte e sui suoi figli"
      },
      {
        "testo": "E primma a questi, senza tante cûgge",
        "it": "E prima a questi, senza tante balle"
      },
      {
        "testo": "Te i strenzan, te i ingöan che pän fregugge.",
        "it": "Te li stringono, te li ingoiano che sembrano briciole."
      },
      {
        "testo": "E a Laoconte che ö i voeiva soccorî",
        "it": "E a Laocoonte che li voleva soccorrere"
      },
      {
        "testo": "Se ghe asbrîan, se ghe inghêuggian in sce l'atto,",
        "it": "Gli si avventano contro, gli si aggrovigliano all'istante,"
      },
      {
        "testo": "Se ghe doggian in gîo, te ö fan scroscî,",
        "it": "Gli si attorcigliano intorno, te lo fanno scricchiolare,"
      },
      {
        "testo": "Lë ö sbraggia, ö l'ûrla, ö cria pëzo che ûn matto,",
        "it": "Lui sbraita, urla, grida peggio di un matto,"
      },
      {
        "testo": "E ghe scappa e correzze a ciû no dî,",
        "it": "E gli scappano le scorregge a più non dire,"
      },
      {
        "testo": "In t'ûn momento te ghe dan recatto,",
        "it": "In un momento lo sistemano,"
      },
      {
        "testo": "E te ö ridûan coscì che ö te diventa",
        "it": "E te lo riducono così che ti diventa"
      },
      {
        "testo": "Ûn mûggetto de strasse e dâ rûmenta.",
        "it": "Un mucchietto di stracci e di spazzatura."
      },
      {
        "testo": "Poi se desghêuggian, quande l'han finîo,",
        "it": "Poi si sbrogliano, quando l'hanno finito,"
      },
      {
        "testo": "E scigoando ädreitûa comme ûn vapore,",
        "it": "E fischiando addirittura come un un vapore,"
      },
      {
        "testo": "Se ne van, senza ascâdi e senza asbrîo,",
        "it": "Se ne vanno, senza scaldarsi e senza fretta,"
      },
      {
        "testo": "Senza manco ciû giâse in çimma a töre;",
        "it": "Senza nemmeno più girarsi, in cima alla torre;"
      },
      {
        "testo": "E là, sotto l'artâ, comme in t'un nîo",
        "it": "E là, sotto l'altare, come in un nido"
      },
      {
        "testo": "S'accomodan, se giân, senza che i scöre",
        "it": "Si accomodano, si acciambellano, senza che li scacci"
      },
      {
        "testo": "Nisciûn de noî, che ahimé, senza pensaghe,",
        "it": "Nessuno di noi, che ahimè, senza pensarci,"
      },
      {
        "testo": "S'aveivimo cagôu tûtti in te braghe.",
        "it": "Ci eravamo cagati tutti nelle braghe."
      },
      {
        "testo": "Quande se semmo repiggiæ ûn momento",
        "it": "Quando ci siamo ripresi un momento"
      },
      {
        "testo": "E a quanto l'é successo emmo pensôu,",
        "it": "E a quanto è successo abbiamo pensato,"
      },
      {
        "testo": "S'é dito in generale, che ö portento",
        "it": "Si è detto in generale, che il portento "
      },
      {
        "testo": "Se l'aveiva Laoconte meritôu,",
        "it": "Se lo era Laocoonte meritato,"
      },
      {
        "testo": "Per avei avûo a tolla e l'ardimento",
        "it": "Per aver avuto la tolla e l'ardimento"
      },
      {
        "testo": "De tiâ a lansa in tö legno consacrôu",
        "it": "Di tirare la lancia nel legno consacrato"
      },
      {
        "testo": "E che, pe appaxentâ a divinitæ,",
        "it": "E che, per pacificare la divinità,"
      },
      {
        "testo": "Ö cavallo ö doveiva intrâ in çittæ.",
        "it": "Il cavallo doveva entrare in città"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-1-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 7",
      "it": "Il cavallo entra; Cassandra inascoltata"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "E lì sûbito a-o laôu se semmo missi",
        "it": "E lì subito ci siamo messi al lavoro"
      },
      {
        "testo": "Con päfæri, badî, masse, piccoin,",
        "it": "Con palanchini, badili, mazze, picconi,"
      },
      {
        "testo": "A daghe drento pe fâ andâ in menissi",
        "it": "A darci dentro per mandare in frantumi"
      },
      {
        "testo": "A porta, e pe fâ ûn sguaro in ti bastioin.",
        "it": "La porta, e per fare uno squarcio nei bastioni."
      },
      {
        "testo": "E con corde, con lëve, atri bordissi,",
        "it": "E con corde, con leve e altri armamentari,"
      },
      {
        "testo": "Adattemmo a-o cavallo î scalandroin,",
        "it": "Adattammo al cavallo gli scalandroni,"
      },
      {
        "testo": "E lì, tia, forza, arranca, ö mescia, ö passa",
        "it": "E lì, tira, forza, arranca, si muove, passa:"
      },
      {
        "testo": "Sciû coraggio figgiêu, che ö le in sciâ ciassa.",
        "it": "\"Su coraggio ragazzi, che è sulla piazza!\""
      },
      {
        "testo": "A brûttûi, bulicugge, orbi inaiæ,",
        "it": "\"Ah vili, frociazzi, ciechi in confusione,"
      },
      {
        "testo": "Besêugna proprio che ne ö lasciæ dî,",
        "it": "Bisogna proprio che ce lo lasciate dire,"
      },
      {
        "testo": "Træ votte ö se fermôu pe intrâ in çittæ,",
        "it": "Tre volte si è fermato per entrare in città,"
      },
      {
        "testo": "E pe trae votte ö se sentîo scroscî!",
        "it": "E per tre volte si è sentito scricchiolare!"
      },
      {
        "testo": "E paiva che ö dixesse: Cose fæ",
        "it": "E sembrava che dicesse: 'Cosa fate?"
      },
      {
        "testo": "Ö reciocco dö færo, nö sentî?",
        "it": "Il rimbombo del ferro, non lo sentite?'"
      },
      {
        "testo": "Ma noî, ninte, ëimo sordi, emmo vosciûo,",
        "it": "Ma noi, niente, eravamo sordi, abbiamo voluto"
      },
      {
        "testo": "Mettisegheo da noî, ben rebattûo.",
        "it": "Mettercelo dentro da soli, ben ribattuto.\""
      },
      {
        "testo": "Alôa Cassandra, che a n'ëa gûæi credûa",
        "it": "Allora Cassandra, che non era per niente creduta"
      },
      {
        "testo": "Perché paiva che a fosse ascemelâ,",
        "it": "Perché sembrava che fosse rimbambita,"
      },
      {
        "testo": "A l'arve a bocca e a spiffera ädreitûa",
        "it": "Apre la bocca e spiffera addirittura"
      },
      {
        "testo": "Tutto quanto doveiva capità;",
        "it": "Tutto quanto doveva capitare;"
      },
      {
        "testo": "Ma nisciûn ghe dà mente e se ne cûa,",
        "it": "Ma nessuno le dà retta e se ne cura,"
      },
      {
        "testo": "Gh'è chi invece a cugionn-a e a piggia a fâ,",
        "it": "C'è chi invece la cogliona e la sfotte,"
      },
      {
        "testo": "Ghe dixan che a l'ha a testa fêua de cascia",
        "it": "Le dicono che ha la testa fuori posto "
      },
      {
        "testo": "E ghe dan dö ciappetto e da bagascia.",
        "it": "E le danno della baldracca e della bagascia."
      },
      {
        "testo": "E frattanto zà a nêutte ciancianin",
        "it": "E frattanto già la notte pian pianino"
      },
      {
        "testo": "A l'aveiva inghêuggeito tæra e mâ",
        "it": "Aveva avvolto terra e mare"
      },
      {
        "testo": "E a sorpreisa che quelli mascarsoin",
        "it": "E la sorpresa che quei mascalzoni"
      },
      {
        "testo": "Ne vûeivan d'arescöso preparâ;",
        "it": "Ci volevano di nascosto preparare;"
      },
      {
        "testo": "A poco a poco, tutti i çittadin",
        "it": "A poco a poco, tutti i cittadini"
      },
      {
        "testo": "Ëan andæti in sce ö letto ûn pò a quetâ",
        "it": "Erano andati sul letto un po' a quietare"
      },
      {
        "testo": "E doppo avei provôu tante emozioin",
        "it": "E dopo aver provato tante emozioni"
      },
      {
        "testo": "Dormivan ädreitûa comme succoin",
        "it": "Dormivano addirittura come ceppi."
      },
      {
        "testo": "Alôa dall'isoa donde a fâva ö scemmo",
        "it": "Allora dall'isola dove faceva lo scemo"
      },
      {
        "testo": "Sciorte a flotta di greci in ordinanza;",
        "it": "Esce la flotta dei greci in ordinanza;"
      },
      {
        "testo": "Pe fâ intende a Schenon, (miæ che ghe semmo)",
        "it": "Per far capire a Schenone (guarda che ci siamo)"
      },
      {
        "testo": "A brûxia ûn fûrgaô mentre che a s'avanza;",
        "it": "Brucia un razzo di segnalazione  mentre avanza;"
      },
      {
        "testo": "A-o segno convegnûo con sto malemmo,",
        "it": "Al segno convenuto con questo maledetto,"
      },
      {
        "testo": "Lë ö s'accosta a-o cavallo e ö gh'arve a pansa",
        "it": "Lui si avvicina al cavallo e gli apre la pancia"
      },
      {
        "testo": "Ciancianinetto, tûtta quella scciûmma",
        "it": "Pian pianino, e tutta quella schiuma"
      },
      {
        "testo": "Pe ûnn-a corda, zû in tæra a se calûmma.",
        "it": "Per mezzo di una corda, giù a terra si cala."
      },
      {
        "testo": "Vegnûi tûtti de fêua senza parlâ",
        "it": "venuti tutti fuori senza parlare"
      },
      {
        "testo": "(Ëan d'accordo, zà primma de sciortî)",
        "it": "(Erano d'accordo, già prima di uscire)"
      },
      {
        "testo": "Ognid'ûn sa zà dove ö deve andâ,",
        "it": "Ognuno sa già dove deve andare,"
      },
      {
        "testo": "Cose ghe tocca e comme ö deve agî,",
        "it": "Cosa gli tocca e come deve agire,"
      },
      {
        "testo": "Chi a-o palazzo dö re, chi all'arsenâ",
        "it": "Chi al palazzo del re, chi all'arsenale"
      },
      {
        "testo": "Chi a-e porte pe piggiale e fâle arvî,",
        "it": "Chi alle porte per prenderle e farle aprire,"
      },
      {
        "testo": "E chi va cö petrolio e coi brichetti",
        "it": "E chi va col petrolio e con i fiammiferi"
      },
      {
        "testo": "Pe fâne brûstolì comme oxeletti.",
        "it": "Per farci abbrustolire come uccelletti."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-1-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 8",
      "it": "L'ombra di Ettore"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "L'ëa l'ôa dö primmo sêunno, e mi ronfava",
        "it": "Era l'ora del primo sonno, e io ronfavo"
      },
      {
        "testo": "Comme ûn sûcco dappresso ä mæ scignöa,",
        "it": "Come un ceppo vicino alla mia signora,"
      },
      {
        "testo": "Quando, mentre che meno ghe pensava,",
        "it": "Quando, mentre meno ci pensavo,"
      },
      {
        "testo": "Veddo Ettore stecchìo comme un'anciöa,",
        "it": "Vedo Ettore stecchito come un'acciuga,"
      },
      {
        "testo": "Pin de sangue, strassôu che ö me fissava.",
        "it": "Pieno di sangue, stracciato che mi fissava."
      },
      {
        "testo": "Ö no l'ëa ciû quell'Ettore d'alöa",
        "it": "Non era più quell'Ettore di allora"
      },
      {
        "testo": "Che ö tornava trionfante e pin de botta,",
        "it": "Che tornava trionfante e pieno di boria,"
      },
      {
        "testo": "Percose Achille ö gh'ëa restôu de sotta.",
        "it": "Perché Achille gli era rimasto sotto."
      },
      {
        "testo": "Ö l'aveiva ûnn-a barba speronsîa",
        "it": "Aveva una barba ispida e arruffata"
      },
      {
        "testo": "Tutta pinn-a de bratta e insanguinâ,",
        "it": "Tutta piena di fango e insanguinata,"
      },
      {
        "testo": "Ûn muro allampanôu da mette puîa,",
        "it": "Un viso allampanato da far paura,"
      },
      {
        "testo": "A roba tûtta sguari astrofoggiâ,",
        "it": "La veste tutta a strappi e sgualcita,"
      },
      {
        "testo": "No gh'ëa posto da faghe ûnn-a ferîa,",
        "it": "Non c'era posto per fargli una ferita,"
      },
      {
        "testo": "Tanto a pelle ö l'aveiva pertûsà,",
        "it": "Tanto aveva la pelle bucherellata,"
      },
      {
        "testo": "E me paiva che fosse ö primmo mì",
        "it": "E mi sembrava di essere il primo io"
      },
      {
        "testo": "A parlaghe, dixendoghe coscì:",
        "it": "A parlargli, dicendogli così:"
      },
      {
        "testo": "E brao, cameadda, comme a l'é, ti ë chi?",
        "it": "\"E bravo, camerata, com'è, sei qui?"
      },
      {
        "testo": "Dove diao ti t'é andæto a bûzzarâ?",
        "it": "Dove diavolo sei andato a rovinarti?"
      },
      {
        "testo": "E cose ti æ fottûo? l'é pe coscì",
        "it": "E cosa hai combinato? È da per così"
      },
      {
        "testo": "Che nöiatri te stavimo a aspettâ;",
        "it": "Che noialtri ti stavamo ad aspettare;"
      },
      {
        "testo": "Per cose mai, ti æ quella faccia lì,",
        "it": "Perché mai, hai quella faccia lì,"
      },
      {
        "testo": "Brûtto de sangue comme ûn maxellâ?",
        "it": "Sporco di sangue come un macellaio?"
      },
      {
        "testo": "Contime, parla, cose t'é successo?",
        "it": "Raccontami, parla, cosa ti è successo?"
      },
      {
        "testo": "A-oa ti l'æ piggiæ, tanto, l'é ö stesso.",
        "it": "Ormai le hai prese, tanto, è lo stesso.\""
      },
      {
        "testo": "E lë, senza risponde a-e mæ parolle,",
        "it": "E lui, senza rispondere alle mie parole,"
      },
      {
        "testo": "Ö l'ha tiôu sciû ûn sospîo da strenze ö chêu:",
        "it": "Ha tirato su un sospiro da stringere il cuore:"
      },
      {
        "testo": "Scappa, ö m'ha dito, Enea, primma che a scrolle",
        "it": "\"Scappa – mi ha detto – Enea, prima che crolli "
      },
      {
        "testo": "E ti resti de dentro a-o rattaiêu,",
        "it": "E tu resti dentro, in una trappola per topi,"
      },
      {
        "testo": "Nö l'e tempo de fa de braghe molle,",
        "it": "Non è tempo di fare delle braghe molle,"
      },
      {
        "testo": "Se ne deve sciortî comme se pêu,",
        "it": "Se ne deve uscire  come si può,"
      },
      {
        "testo": "E mi sön vegnûo apposta pe avvertîte,",
        "it": "E io sono venuto apposta per avvertirti,"
      },
      {
        "testo": "Troia a l'ha in tö stoppin, sön messe dîte.",
        "it": "Troia ce l'ha nello stoppino, sono messe dette.\""
      },
      {
        "testo": "Sarva almeno i gexû co-i reliquai",
        "it": "Salva almeno i gesù con i reliquiari,"
      },
      {
        "testo": "Fûtti tûtto in t'ûn baûlo e fanni fîto,",
        "it": "Fotti tutto in un baule  e fallo in fretta,"
      },
      {
        "testo": "Mettíte in t'ûn vagon, piggia ö tramvai",
        "it": "Mettiti in un vagone, prendi il tramvai"
      },
      {
        "testo": "E portili a straquâ in te ûn atro scito:",
        "it": "E portali a scaricare in un altro posto:"
      },
      {
        "testo": "Doppo ûn mondo de lastime e de guai",
        "it": "Dopo un mondo di lamenti e di guai"
      },
      {
        "testo": "Ti ghe ö torniæ a piggiâ torna pe drîto",
        "it": "Ti tornerà ad andare per il verso giusto"
      },
      {
        "testo": "E ti fondiæ a çittæ dell'Arpexella,",
        "it": "E fonderai la città di Arpesella,"
      },
      {
        "testo": "Ciû grande ancon de Troia e ancon ciû bella.",
        "it": "Ancora più grande di Troia e ancora più bella."
      },
      {
        "testo": "E ö sparisce: frattanto pe-a çittæ",
        "it": "E lui sparisce: frattanto per la città"
      },
      {
        "testo": "Se commensa a sentî cianze e sbraggiâ,",
        "it": "Si comincia a sentire piangere e sbraitare,"
      },
      {
        "testo": "Ûn remescio, ûn tambûscio, ûn nö saviæ",
        "it": "Un rimescolamento, un trambusto, un non saprei"
      },
      {
        "testo": "Comme quando se sente sbatte ö mâ,",
        "it": "Come quando si sente sbattere il mare,"
      },
      {
        "testo": "Poi ö piggia ciû forza e intenscitæ,",
        "it": "Poi prende più forza e intensità,"
      },
      {
        "testo": "Ö cresce, ö monta che ö me fâ adesciâ;",
        "it": "Cresce, monta tanto che mi fa svegliare;"
      },
      {
        "testo": "Sâto da-o letto e tastonando a-o scûo,",
        "it": "Salto dal letto e tastonando all'oscuro,"
      },
      {
        "testo": "Camminn-o in sce a terrazza bello nûo.",
        "it": "Cammino sulla terrazza bello nudo."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-1-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 9 ",
      "it": "Enea nella mischia; il sacco"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Comme quando a campann-a a martelletto,",
        "it": "Come quando la campana a martelletto,"
      },
      {
        "testo": "A n'adescia de nêutte in t'ûn scrollon,",
        "it": "Ci sveglia di notte in uno scossone,"
      },
      {
        "testo": "Co-i êûggi ancon serræ, se sâta ö letto,",
        "it": "Con gli occhi ancora chiusi, si salta giù dal letto,"
      },
      {
        "testo": "E se cöre tremândo da-o barcon,",
        "it": "E si corre tremando al balcone,"
      },
      {
        "testo": "E se vedde a gragnêua che a lascia netto",
        "it": "E si vede la grandine che lascia netto"
      },
      {
        "testo": "E ûn incendio che ö porta a distrûzion,",
        "it": "E un incendio che porta la distruzione,"
      },
      {
        "testo": "E sovven solo allöa che s'é scordôu",
        "it": "E viene in mente solo allora che ci si è scordati"
      },
      {
        "testo": "Da quarche compagnia d'ëse assegûoû;",
        "it": "Da qualche compagnia d'essere assicurati;"
      },
      {
        "testo": "Coscì mi stavo a amiâ co-e balle in man",
        "it": "Così io stavo a guardare con le balle in mano"
      },
      {
        "testo": "A rovinn-a de Troia e mæ rovinn-a;",
        "it": "La rovina di Troia e la mia rovina;"
      },
      {
        "testo": "Za l'incendio che primma ö l'ëa lontan",
        "it": "Già l'incendio che prima era lontano"
      },
      {
        "testo": "Ö l'aumenta de forza, ö s'avvixinn-a,",
        "it": "Aumenta di forza, si avvicina,"
      },
      {
        "testo": "Ö l'attacca zà Tursci, ö piggia man,",
        "it": "Attacca già Tursi, prende mano,"
      },
      {
        "testo": "Da-e artûe, tûtto zû, scinn-a ä marinn-a",
        "it": "Dalle alture, tutto giù, fino alla marina"
      },
      {
        "testo": "Che l'ëa tûtto ûnn-a fiamma, ûnn-a förnaxe,",
        "it": "Che era tutta una fiamma, una fornace,"
      },
      {
        "testo": "L'aia pinn-a de zimme, ö mâ de braxe.",
        "it": "L'aria piena di faville, il mare di braci."
      },
      {
        "testo": "Me và sûbito a testa in tö ballon,",
        "it": "Mi va subito la testa nel pallone,"
      },
      {
        "testo": "Nö sô ciû cose fûtte e cose fâ,",
        "it": "Non so più cosa diavolo fare e combinare,"
      },
      {
        "testo": "M'infio e braghe, metto ö çenturon,",
        "it": "Mi infilo le braghe, metto il cinturone,"
      },
      {
        "testo": "Me ven coæ de sciortî pe andame a dâ,",
        "it": "Mi vien cuore di uscire per andarle a dare,"
      },
      {
        "testo": "Sciorto e lì abbretiö ammûggio ûn pelotton",
        "it": "Esco e lì alla rinfusa ammucchio un plotone"
      },
      {
        "testo": "De militi acchêuggeiti in tö scappâ,",
        "it": "Di soldati raccolti mentre scappavano,"
      },
      {
        "testo": "E ghe diggo: battemosene a mössa",
        "it": "E dico loro: sbattiamocene la mussa,"
      },
      {
        "testo": "Zà che se gh'é: merda o berretta rössa.",
        "it": "Già che ci siamo: merda o berretta rossa."
      },
      {
        "testo": "E lì in marcia: quand'ecco che incontremmo",
        "it": "E lì in marcia: quand'ecco che incontrammo"
      },
      {
        "testo": "Ö sciö Oberti, che ö l'ëa seatê in Campetto,",
        "it": "Il signor Oberti, che era sagrestano in Campetto,"
      },
      {
        "testo": "Capitanio da quinta, mëzo scemmo",
        "it": "Capitano della quinta, mezzo scemo"
      },
      {
        "testo": "Da-o sciato, da-o remescio, da-o spaghetto,",
        "it": "Dal fiatone, dal trambusto, dalla gran paura,"
      },
      {
        "testo": "Ö scappava vestîo comme ûn malemmo",
        "it": "Scappava vestito come un disgraziato"
      },
      {
        "testo": "Co-i argenti de casa in t'ûn sacchetto;",
        "it": "Con l'argenteria di casa in un sacchetto;"
      },
      {
        "testo": "Ö sciö Oberti, ghe crîo, sciâ vegne chì",
        "it": "\"Signor Oberti\", gli grido, \"venga qui,"
      },
      {
        "testo": "Comm'a l'é, sciâ ghe molla vosciâ ascì ?",
        "it": "Come l'è, ci molla anche lei?\""
      },
      {
        "testo": "Lë ö se ferma, e tremando a ciû nö pûei,",
        "it": "E lui si ferma, e tremando a più non posso,"
      },
      {
        "testo": "Ö me dixe: A l'é a votta che a nö falla,",
        "it": "Mi dice: \"È la volta che non fallisce,"
      },
      {
        "testo": "Nö sön miga demöe, fan pe davvei",
        "it": "Non sono mica scherzi, fanno per davvero"
      },
      {
        "testo": "Sti ruffien n'êuan de cugge e tian con balla,",
        "it": "Questi ruffiani non raccontano frottole e sparano con proiettili,"
      },
      {
        "testo": "E sciâ vêu che nö scappe? ma me pai",
        "it": "E lei vuole che non scappi? Ma mi sa"
      },
      {
        "testo": "Ö çervello in ta testa ö ghe traballa,",
        "it": "Che il cervello in testa le traballi,"
      },
      {
        "testo": "Semmo bell'e fottûi nö gh'é ciû verso,",
        "it": "Siamo belli e fottuti, non c'è più verso,"
      },
      {
        "testo": "Sciâ nö ghe vedde, che l'é tempo perso.",
        "it": "Non lo vede che è tempo perso?\""
      },
      {
        "testo": "Stö brûttö de cavallo ö bêutta zû",
        "it": "Questo brutto di un cavallo butta giù"
      },
      {
        "testo": "Strêuppe e strêuppe de greci a tutt'andâ",
        "it": "Torme e torme di greci a tutto andare"
      },
      {
        "testo": "Sciortan da tutti i canti e vegnan sciû",
        "it": "Escono da tutti gli angoli e vengono su"
      },
      {
        "testo": "Ädreitûa comme funzi. Ei bello fâ",
        "it": "Addirittura come funghi. Hai un bel da fare"
      },
      {
        "testo": "Ma scì cuggie, ne ven sempre de ciû",
        "it": "Ma sì, palle, ne vengono sempre di più"
      },
      {
        "testo": "E se mettan lì, sûbito a piccâ;",
        "it": "E si mettono lì, subito a picchiare;"
      },
      {
        "testo": "E quello brûtto siôto de Schenon",
        "it": "E quel brutto impiastro di Schenone"
      },
      {
        "testo": "Che ö ne bûzara, ö ne mincionn-a ancon.",
        "it": "Che ci rovina,e ci minchiona ancora."
      },
      {
        "testo": "Tûtti scappan, nö gh'é che i granatë",
        "it": "\"Tutti scappano, non ci sono che i granatieri"
      },
      {
        "testo": "Che fan ûn pô de rexistenza a-o scûo",
        "it": "Che fanno un po' di resistenza al buio,"
      },
      {
        "testo": "Ma piggian i compagni per foestë",
        "it": "Ma pigliano i compagni per foresti"
      },
      {
        "testo": "E i ammassan pe mettise a-o segûo;",
        "it": "E li ammazzano per mettersi al sicuro;"
      },
      {
        "testo": "Sciâ se credde, sciö Enea, l'emmo derë",
        "it": "Mi creda, signor Enea, l'abbiamo nel didietro"
      },
      {
        "testo": "Ben ciantôu, senza spago e rebattûo;",
        "it": "Ben piantato, senza spago e ribattuto;"
      },
      {
        "testo": "Vosciâ sciâ vedde, nö sô cose dighe,",
        "it": "Vossignoria vede, non so cosa dirle,"
      },
      {
        "testo": "Ma mì vêuggio sarvâ a pansa a-e fighe.",
        "it": "Ma io voglio salvare la pancia per i fichi"
      },
      {
        "testo": "Mì me sâta ûnn-a vêuggia mascarsonn-a",
        "it": "Mi salta una voglia mascalzona"
      },
      {
        "testo": "De mettime a corrî dove fa cado,",
        "it": "Di mettermi a correre dove fa caldo,"
      },
      {
        "testo": "Primma amîo chi ho con mì: gh'é ö Câsabonn-a",
        "it": "Prima guardo chi ho con me: c'è il Casabona"
      },
      {
        "testo": "E gh'é ö Döi södi, cö chirurgo Ansâdo,",
        "it": "E c'è il \"Due soldi\", col chirurgo Ansaldo,"
      },
      {
        "testo": "Ö sciû Gherscí, Nattin Carabalonn-a,",
        "it": "Il signor Ghersì, Nattin Carabalona,"
      },
      {
        "testo": "Cesare ö giardinë, cö sunnôu Bado,",
        "it": "Cesare il giardiniere, col suonatore Bado,"
      },
      {
        "testo": "Capitan Questa, Piransola e Rigo",
        "it": "Il Capitan Questa, Piransola e Rigo"
      },
      {
        "testo": "Con Ciöngin ö procûoû e Campantigo.",
        "it": "Con Ciongin il procuratore e Campantigo."
      },
      {
        "testo": "Tûtti bûlli da reo, tûtti çernûi",
        "it": "Tutti veri duri, tutti scelti (selezionati)"
      },
      {
        "testo": "Che nö pûeivo ëse mëgio accompagnôu,",
        "it": "Che non potevo essere meglio accompagnato,"
      },
      {
        "testo": "Ma pe fali ciû cädi e ciû segûi",
        "it": "Ma per farli più caldi e più sicuri"
      },
      {
        "testo": "Me ghe son misso in mëzo e g'ho parlôu:",
        "it": "Mi ci sono messo in mezzo e gli ho parlato:"
      },
      {
        "testo": "Zovenotti, v'ho sempre conosciûi",
        "it": "\"Giovanotti, vi ho sempre conosciuti"
      },
      {
        "testo": "Pe ûn ciû cado che l'âtro e desgaggiôu",
        "it": "Per uno più caldo dell'altro e disinvolti,"
      },
      {
        "testo": "Sô che sei tanti eroi, se nö savesse,",
        "it": "So che siete tanti eroi, se non lo sapessi,"
      },
      {
        "testo": "Me n'accorzieivo solo che v'ammiesse!",
        "it": "Me ne accorgerei solo a guardarvi!\""
      },
      {
        "testo": "Ma, perdîe tûtto zû, nö ghêu de cöggie",
        "it": "Ma, perdinci tutto giù, non dico balle,"
      },
      {
        "testo": "Chi se tratta de fáse massacrâ",
        "it": "Qui si tratta di farsi massacrare,"
      },
      {
        "testo": "In tö zielo ghe l'emmo a çento döggie,",
        "it": "Nel didietro ce l'abbiamo al quadrato,"
      },
      {
        "testo": "Nö se pêu ciû ne vinse ne appattâ,",
        "it": "Non si può più né vincere né pareggiare,"
      },
      {
        "testo": "Se nö sei unn-a niâ de bullicöggie,",
        "it": "Se non siete una nidiata di coglioncelli stralunati,"
      },
      {
        "testo": "Solo böin a men.... e a cagâ,",
        "it": "Solo buoni a mast... e a cagare,"
      },
      {
        "testo": "Perdiesann-a, l'é tempo de provâlo",
        "it": "Perdiana, è tempo di dimostrarlo"
      },
      {
        "testo": "Con piggiâlo in tö cû, senza mezualo!",
        "it": "Col prenderlo nel culo, senza misurarlo!"
      },
      {
        "testo": "Ste parolle, per lö, sön fêugo e fiamme",
        "it": "Queste parole, per loro, sono fuoco e fiamme"
      },
      {
        "testo": "Che s'ëan cädi, buggï son diventæ;",
        "it": "Che se erano caldi, bolliti sono diventati;"
      },
      {
        "testo": "Comme ûn branco de lôi, morti da fämme,",
        "it": "Come un branco di lupi, morti di fame,"
      },
      {
        "testo": "Comme matti furiosi deslighæ,",
        "it": "Come matti furiosi slegati,"
      },
      {
        "testo": "Senza piano d'attacco e senza esamme,",
        "it": "Senza piano d'attacco e senza esame,"
      },
      {
        "testo": "Nöi s'asbriemmo ädreitûa dentro a çittæ",
        "it": "Noi ci scagliamo a dirittura dentro la città"
      },
      {
        "testo": "E zû botte ruffiann-e a ciû nö dî,",
        "it": "E giù botte da orbi da non poterne più,"
      },
      {
        "testo": "Che me fâvan mâveggia scinn-a a mî",
        "it": "Che mi facevano meraviglia perfino a me."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-1-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 10",
      "it": "Zorzin, Ciöngin e i travestimenti"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Ma in che moddo porriô rende e tradûe",
        "it": "Ma in che modo potrò rendere e tradurre"
      },
      {
        "testo": "A rovinn-a l'orrö de quella nêutte!",
        "it": "La rovina, l'orrore di quella notte!"
      },
      {
        "testo": "Pâ che Troia a precipite, a derûe",
        "it": "Pare che Troia precipiti, che dirupi"
      },
      {
        "testo": "Sotto a forza d'ûn argano che a bêutte,",
        "it": "Sotto la forza di un uragano che la butti,"
      },
      {
        "testo": "Vëgi, donne brûxæ, figgie fottûe,",
        "it": "Vecchi, donne bruciate, ragazze fottute,"
      },
      {
        "testo": "Sacchezzi, malazioin de tûtte e chêutte",
        "it": "Saccheggi, nefandezze di ogni sorta,"
      },
      {
        "testo": "Sangue e morti, ammûggiæ pe tutti i canti",
        "it": "Sangue e morti, ammucchiati in ogni angolo,"
      },
      {
        "testo": "Giastemme e sacranoin da tiâ zû i santi,",
        "it": "Bestemmie e sacramentoni da scomodare i santi."
      },
      {
        "testo": "Ö primmo di nemixi che incontremmo",
        "it": "Il primo dei nemici che incontrammo"
      },
      {
        "testo": "Ö l'é Zorzin, perla di negozianti,",
        "it": "È Zorzin, perla dei negozianti,"
      },
      {
        "testo": "E ö ne piggia pe greci... Eh cose femmo,",
        "it": "E ci prende per greci... \"Eh, cosa facciamo,\""
      },
      {
        "testo": "Ö se mette a sbraggiâ, vegnimmo avanti,",
        "it": "Si mette a sbraitare, \"andiamo avanti,"
      },
      {
        "testo": "Noi âtri l'é dö bello che se demmo,",
        "it": "Noialtri è del bello che ci diamo (dentro),  "
      },
      {
        "testo": "E voi ve ne stæ lì a pisciâ pei canti?",
        "it": "E voi ve ne state lì a pisciare negli angoli?"
      },
      {
        "testo": "Ah brûtûi... ma ö s'afferma spaventôu,",
        "it": "Ah, disgraziati...\" ma si ferma spaventato,"
      },
      {
        "testo": "Accorzendose alôa che ö s'êa sbagliôu.",
        "it": "Accorgendosi allora che si era sbagliato."
      },
      {
        "testo": "Comme quande succede quarche votta",
        "it": "Come quando succede qualche volta"
      },
      {
        "testo": "Che ûnn-a figgia, acchêuggendo da viovetta",
        "it": "Che una ragazza, raccogliendo delle violette,"
      },
      {
        "testo": "A te posa ûnn-a man sorva ûnn-a sotta",
        "it": "Ti posa una mano sopra una sciolta"
      },
      {
        "testo": "Che a l'êa ascosa in ti fiori e in te l'erbetta,",
        "it": "Che era nascosta tra i fiori e tra l'erbetta,"
      },
      {
        "testo": "A fâ ûn schitto, a te piggia ûnn-a giavotta",
        "it": "Fa uno scatto, ti fa una giravolta,"
      },
      {
        "testo": "Comme se l'æse visto a sciâ Cichetta,",
        "it": "Come se avesse visto la Morte,"
      },
      {
        "testo": "E a se mette a scappâ senza ciû giâse,",
        "it": "E si mette a scappare senza più girarsi,"
      },
      {
        "testo": "Tegnindo larga a man pe nö brûttase,",
        "it": "Tenendo la mano larga per non sporcarsi;"
      },
      {
        "testo": "Coscì Zorzin, quande ö n'ha conosciûo",
        "it": "Così Zorzin, quando ci ha riconosciuti"
      },
      {
        "testo": "Fæto ûn bottö ö se misso pe scappâ,",
        "it": "Fatto un balzo si è messo a scappare,"
      },
      {
        "testo": "Ma piggiôu de sorpreisa e mëzo a-o scûo,",
        "it": "Ma preso di sorpresa e in mezzo all'oscurità,"
      },
      {
        "testo": "Indeciso in sce a stradda da piggiâ,",
        "it": "Indeciso sulla strada da prendere,"
      },
      {
        "testo": "Ö s'ingamba, ö va zû longo boccûo",
        "it": "Si inciampa, e va giù lungo disteso a bocconi"
      },
      {
        "testo": "Criando: agiutto, nö me fæ dö mâ!",
        "it": "Gridando: \"Aiuto, non fatemi del male!\""
      },
      {
        "testo": "Noi se femmo coraggio, e lì in sce l'atto",
        "it": "Noi ci facciamo coraggio, e lì all'istante"
      },
      {
        "testo": "Visto e nö visto, se ghe dà recatto.",
        "it": "Visto e non visto, lo facciamo secco."
      },
      {
        "testo": "E superbo Ciöngin de sta bravûa",
        "it": "E, tronfio di questa prodezza, Ciöngin"
      },
      {
        "testo": "Ö ne dixe: miæ cose me sovven,",
        "it": "ci dice: guardate cosa mi viene in mente,"
      },
      {
        "testo": "Doviescimo pe fâla ciû segua",
        "it": "dovremmo, per andare più sul sicuro,"
      },
      {
        "testo": "Piggiâ e armi e ö vestî de sti rûffien;",
        "it": "prendere le armi e il vestito di questi farabutti;"
      },
      {
        "testo": "Ö sâ forse ûn inganno, ûn'impostûa,",
        "it": "sarà forse un inganno, un'impostura,"
      },
      {
        "testo": "Ma mì, cai, me ne fûtto bell'e ben,",
        "it": "ma io, cari, me ne fotto bell'e bene:"
      },
      {
        "testo": "A guæra in sce sta mascima a se basa:",
        "it": "la guerra si basa su questa massima —"
      },
      {
        "testo": "Chi ë bulicugge se ne stagghe a casa",
        "it": "chi è senza palle se ne stia a casa."
      },
      {
        "testo": "E ö se mette a divisa de Zorzin",
        "it": "E si mette la divisa di Zorzin,"
      },
      {
        "testo": "A fêlûa cö ciûmasso, ö çenturon",
        "it": "la feluca col pennacchio, il cinturone,"
      },
      {
        "testo": "E coscì fa ö sciö Bado, ö sciô Nattin",
        "it": "e così fa il signor Bado, il signor Nattin,"
      },
      {
        "testo": "E coscì tûtti senza distinzion,",
        "it": "e così tutti quanti, senza eccezione,"
      },
      {
        "testo": "In manea che nö visti da vixin",
        "it": "in modo che, non riconoscibili da vicino"
      },
      {
        "testo": "E protetti da-o scûo, da confûxion",
        "it": "e protetti dal buio, dalla confusione,"
      },
      {
        "testo": "Ne riûscîo per ûn po' de fâla franca,",
        "it": "ci riuscì per un po' di farla franca,"
      },
      {
        "testo": "Ammazzandone ûn muggio all'arma gianca.",
        "it": "ammazzandone un mucchio all'arma bianca."
      },
      {
        "testo": "Ma scì, contro ö destin gh'é scrîto: Menn-a",
        "it": "Ma sì, contro il destino c'è scritto: attàccati,"
      },
      {
        "testo": "E s'ha bello prefutte e remescià",
        "it": "E puoi ben sbatterti e dimenarti,"
      },
      {
        "testo": "Perché quando ö s'ha in fondo a-o fî da schenn-a",
        "it": "Perché quando uno ce l'ha in fondo alla schiena"
      },
      {
        "testo": "Barba d'ommo nö riesce a destaccâ,",
        "it": "Barba d'uomo non riesce a staccarlo:"
      },
      {
        "testo": "Tutt'assemme ligâ, c'ûnn-a cadenn-a,",
        "it": "Tutta insieme legata con una catena,"
      },
      {
        "testo": "Co-i cavelli pë spalle e despuggiâ,",
        "it": "Coi capelli sulle spalle e spogliata,"
      },
      {
        "testo": "Nöi vedemmo Cassandra in ta marmaggia",
        "it": "Noi vediamo Cassandra in mezzo alla marmaglia"
      },
      {
        "testo": "Tiâ pe forza, insûltâ da stî canaggia.",
        "it": "Trascinata a forza, insultata da queste canaglie."
      },
      {
        "testo": "A sta vista, Ciöngin che ö l'ëa ö sô amante",
        "it": "A questa vista, Ciöngin, che era il suo amante,"
      },
      {
        "testo": "Ö se caccia in tö mûggio inveninôu",
        "it": "si getta nel mucchio, avvelenato,"
      },
      {
        "testo": "Pe salvâla o pe mûi co-a sô galante;",
        "it": "per salvarla o per morire con la sua bella;"
      },
      {
        "testo": "E nöi l'emmo in sce l'atto seguitôu;",
        "it": "e noi l'abbiamo seguito all'istante."
      },
      {
        "testo": "Chi l'é dove piccôu n'emmo ciû tante,",
        "it": "Qui è dove ne abbiamo date di più,"
      },
      {
        "testo": "Chi l'é dove de ciû n'emmo piggiôu,",
        "it": "qui è dove ne abbiamo prese di più,"
      },
      {
        "testo": "Ma se devo fâ ö giusto parallello,",
        "it": "ma se devo fare il giusto parallelo,"
      },
      {
        "testo": "Quelle ch'emmo piggiôu sön ciû dö bello.",
        "it": "quelle che abbiamo preso sono più del bello."
      },
      {
        "testo": "Perché i nostri, vedendone a-o vestî,",
        "it": "Perché i nostri, vedendoci dalle vesti,"
      },
      {
        "testo": "Ne piggiavan pe greci, e lì sciabbræ,",
        "it": "ci prendevano per greci, e lì sciabolate,"
      },
      {
        "testo": "Sasci, travi, de tûttô adosso a nöî,",
        "it": "sassi, travi, di tutto addosso a noi,"
      },
      {
        "testo": "Che nö pueivimo dîghe: ve sbagliæ.",
        "it": "che non potevamo dirgli: vi sbagliate."
      },
      {
        "testo": "I nemixi, riuscindo a descrovî",
        "it": "I nemici, riuscendo a scoprire"
      },
      {
        "testo": "Ch'ëimo troien da greci mascheræ.",
        "it": "che eravamo troiani mascherati da greci…"
      },
      {
        "testo": "Mi ghe lascio pensâ, bella reginn-a",
        "it": "Io ve lo lascio immaginare, bella regina,"
      },
      {
        "testo": "Se n'han fæto de nöi tanta toninn-a.",
        "it": "se n'hanno fatto di noi tanta tonnina."
      },
      {
        "testo": "E chì cazze Ciongin, co-a pansa averta,",
        "it": "E qui cade Ciöngin, con la pancia aperta,"
      },
      {
        "testo": "Lamentando ö sô scagno e a sô famiggia,",
        "it": "rimpiangendo il suo bancone e la sua famiglia;"
      },
      {
        "testo": "Campantigo co-a croxe descoverta,",
        "it": "Campantigo, con la croce scoperta,"
      },
      {
        "testo": "Ö s'arigûela zù, comme ûnn-a sbiggia,",
        "it": "stramazza giù come un birillo."
      },
      {
        "testo": "E tì ascì, prinçipà da gente asperta",
        "it": "E anche tu, principale di gente esperta,"
      },
      {
        "testo": "Ti te andæto a fâ fûtte, ö sciö Caviggia",
        "it": "te ne sei andato a farti fottere, signor Caviglia,"
      },
      {
        "testo": "Ne l'ha protettô ö prinçipato e ö cenzo",
        "it": "né l'ha protetto il principato e il censo"
      },
      {
        "testo": "Ne-a santa Compagnia de S. Vincenzo.",
        "it": "né la santa Compagnia di San Vincenzo."
      },
      {
        "testo": "Mi nö fasso pe dî né pe lôdame,",
        "it": "Io non è per dire né per vantarmi,"
      },
      {
        "testo": "Ma ho tentôu e brêgôu quante ho posciûo",
        "it": "ma ho tentato e brigato quanto ho potuto,"
      },
      {
        "testo": "Senza daghe de ciatto e risparmiâme",
        "it": "senza darci di piatto e senza risparmiarmi,"
      },
      {
        "testo": "Pe restâ lì mi ascì, bell'e fottûo.",
        "it": "fino a restarci anch'io, bell'e fottuto."
      },
      {
        "testo": "Ma ö destin, perché ö voeiva conservame",
        "it": "Ma il destino, perché voleva conservarmi"
      },
      {
        "testo": "Pe ûn giammin ciû angoscioso e ancön ciû dûo,",
        "it": "per uno stento più angoscioso e ancora più duro,"
      },
      {
        "testo": "Ö m'ha fæto sciortî san comme ûn pescio",
        "it": "mi ha fatto uscire sano come un pesce"
      },
      {
        "testo": "Da sta poca zizoeta de remescio.",
        "it": "da questa bazzecola di parapiglia."
      },
      {
        "testo": "De tanti ch'ëimo, solo mì, Nattin,",
        "it": "Di tanti che eravamo, solo io, Nattin,"
      },
      {
        "testo": "(Za buscetto e inciagôu comme S. Rocco)",
        "it": "(Già vecchietto e piagato come San Rocco)"
      },
      {
        "testo": "Ö sûnnôu Bado, ö noto Chitarrin",
        "it": "Il suonatore Bado, e il noto Chitarrin"
      },
      {
        "testo": "Mëzo morto e arissôu comme ûn malocco",
        "it": "Mezzo morto e arricciato come un groviglio"
      },
      {
        "testo": "A forza de strepelli e de buttoin",
        "it": "A forza di botte e di spintoni"
      },
      {
        "testo": "Se riûscimmo a sarvâ tûtti in t'un tocco",
        "it": "Riuscimmo a salvarci tutti insieme,"
      },
      {
        "testo": "E sospinti da-i sbraggi e da-o fracasso",
        "it": "E sospinti dalle urla e dal fracasso"
      },
      {
        "testo": "Andemmo in strambælon, finn-a a-o palasso",
        "it": "Andammo barcollando, fino al palazzo ."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 11",
      "it": "L'assalto alla reggia"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Lì paiva che ghe fosse ö finimondo",
        "it": "Lì pareva che ci fosse il finimondo,"
      },
      {
        "testo": "Tanto ö l'ëa ö ramandan, e botte, ö fô;",
        "it": "tanto era il ramadan, le botte, il fracasso;"
      },
      {
        "testo": "I greci, c'ûn asâto furibondo,",
        "it": "i greci, con un assalto furibondo,"
      },
      {
        "testo": "S'ëan missi a fûtte zû a porta maggiô",
        "it": "s'erano messi a fottere giù la porta principale;"
      },
      {
        "testo": "I Troien, tiâvan zû d'insimma in fondo,",
        "it": "i troiani tiravano giù da cima in fondo"
      },
      {
        "testo": "Tûtta a roba de casa adosso a lô,",
        "it": "tutta la roba di casa addosso a loro:"
      },
      {
        "testo": "Guardarobi, comô, carreghe indôê,",
        "it": "guardaroba, comò, sedie indorate,"
      },
      {
        "testo": "Sofâ, potronne, casserolle, oinæ.",
        "it": "sofà, poltrone, casseruole, orinali."
      },
      {
        "testo": "Chì me ven torna coæ d'andame a dâ",
        "it": "Qui mi torna la voglia di andarmi a dare"
      },
      {
        "testo": "In soccorso da Corte e di assediæ;",
        "it": "In soccorso della reggia e degli assediati;"
      },
      {
        "testo": "Ö busillis ö l'ëa de pûei passâ",
        "it": "Il busillis era di poter passare,"
      },
      {
        "testo": "Perché e porte e i rastelli eân barrichæ;",
        "it": "Perché le porte e i cancelli erano barricati;"
      },
      {
        "testo": "Me sovven d'ûnn-a porta riservâ",
        "it": "Mi viene in mente una porta riservata,"
      },
      {
        "testo": "Fæta in tempi ciû belli e fortunæ",
        "it": "Fatta in tempi più belli e fortunati,"
      },
      {
        "testo": "Da Andromaca prescelta ciû che a grande",
        "it": "Da Andromaca prescelta più di quella grande"
      },
      {
        "testo": "Pe portâ ö sô pivetto a-o pappâ grande.",
        "it": "Per portare il suo bimbo dal nonno."
      },
      {
        "testo": "Me gh'infio co-i compagni, e andemmo scinn-a",
        "it": "Mi ci infilo coi compagni, e andiamo fin"
      },
      {
        "testo": "In sce ö teito de dâto a-i luxernæ:",
        "it": "sul tetto, di fianco ai lucernai:"
      },
      {
        "testo": "Lì gh'aveivan costrûto ûnn-a latrinn-a",
        "it": "lì avevano costruito una latrina"
      },
      {
        "testo": "Da döve d'in sce ö setto accomodæ",
        "it": "da dove, sulla tazza accomotati,"
      },
      {
        "testo": "Se gôdiva da vista da marinn-a",
        "it": "si godeva la vista della marina,"
      },
      {
        "testo": "Da campagna di monti e da cittæ",
        "it": "della campagna, dei monti e della città,"
      },
      {
        "testo": "In moddo che re Priamo cagando",
        "it": "in modo che re Priamo, cagando,"
      },
      {
        "testo": "Ö veddeiva i confin dö sô comando.",
        "it": "vedeva i confini del suo comando."
      },
      {
        "testo": "Se mettemmo co-i færi a travaggiâ",
        "it": "Ci mettemmo a lavorare coi ferri"
      },
      {
        "testo": "Pe puèi futtila zù da quell'artûa",
        "it": "per poterla buttar giù da quell'altezza;"
      },
      {
        "testo": "A scäsemmo d'in fondo e a sön de fâ",
        "it": "la scalziamo dalla base e a forza di darci dentro"
      },
      {
        "testo": "Levemmo e ciavi donde a l'ëa tegnûa,",
        "it": "togliamo i perni dov'era fissata,"
      },
      {
        "testo": "Picca, batti a commensa ûn pô a löcciâ.",
        "it": "picchia e batti, comincia un po' a vacillare;"
      },
      {
        "testo": "Femmo leva, a precipita, a derûa",
        "it": "facciamo leva, precipita, rovina"
      },
      {
        "testo": "E a n'accheûgge ûn miggiâ, tûtti in t'ûn masso",
        "it": "e ne travolge un migliaio, tutti in un blocco"
      },
      {
        "testo": "Sotto ûn monte de merda e cäsinasso",
        "it": "sotto un monte di merda e calcinacci."
      },
      {
        "testo": "In sce a porta maggiö, tûtto luxente",
        "it": "Sul portone principale, tutto rilucente,"
      },
      {
        "testo": "Pin de croxi, de sciarpe e de galloin,",
        "it": "pieno di croci, sciarpe e galloni,"
      },
      {
        "testo": "Pirro ô se dava comme ûn aççidente",
        "it": "Pirro si dimenava come un accidente,"
      },
      {
        "testo": "Alternando co-e botte, i sacranoin.",
        "it": "alternando alle botte i bestemmioni."
      },
      {
        "testo": "Comme quando ûn batoso prepotente",
        "it": "Come quando un teppista prepotente"
      },
      {
        "testo": "Ö se pâ in drîto de mezûâ mascoin",
        "it": "Si crede in diritto di appioppare ceffoni"
      },
      {
        "testo": "Solo percöse ö le vestîo da festa",
        "it": "Solo perché è vestito a festa"
      },
      {
        "testo": "E ö l'ha ö vinetto che ö gh'ascâda a testa.",
        "it": "E ha il vinello che gli scalda la testa."
      },
      {
        "testo": "C'ûn picosso in te man, sto bulicugge",
        "it": "Con un'ascia in mano, questo frocione"
      },
      {
        "testo": "Ö piccava in ta porta a ciû nö posso,",
        "it": "Picchiava sulla porta a più non posso,"
      },
      {
        "testo": "Marmo, fæeri, cantæ, paivan fregugge,",
        "it": "Marmo, ferri, conci parevano briciole,"
      },
      {
        "testo": "Cazzeiva tûtto zû, dosso e bordosso,",
        "it": "Veniva giù tutto, alla rinfusa;"
      },
      {
        "testo": "Finalmente ö portâ : pâ che ö se doggie",
        "it": "Finalmente il portone: pare che si pieghi"
      },
      {
        "testo": "Sotto a forza da leva e dö picosso,",
        "it": "Sotto la forza della leva e dell'ascia,"
      },
      {
        "testo": "Ö fa vedde ö cortile e i colonnati,",
        "it": "Fa vedere il cortile e i colonnati,"
      },
      {
        "testo": "E stanze dö Re attuale e di antenati.",
        "it": "E le stanze del Re attuale e degli antenati."
      },
      {
        "testo": "Lì gh'ëa ûn mûggio de donne e de figgiœû",
        "it": "Lì c'era un mucchio di donne e bambini,"
      },
      {
        "testo": "Mezi morti dao sciâto e dao spavento,",
        "it": "Mezzi morti dal frastuono e dallo spavento,"
      },
      {
        "testo": "Chi in camixa o inghœûggeito in ti lensœû,",
        "it": "Chi in camicia o avvolto nelle lenzuola,"
      },
      {
        "testo": "Chi n'aveiva ädreitûa de vestimento.",
        "it": "Chi non aveva addirittura niente addosso."
      },
      {
        "testo": "Ö l'ëa ûn lûo continûoû de strenze ö chœû",
        "it": "Era un lamento continuo da stringere il cuore,"
      },
      {
        "testo": "Per chi avesse ûn pittin de sentimento,",
        "it": "Per chi avesse un briciolo di sentimento,"
      },
      {
        "testo": "Ûnn-a mostra de chœûsce e de tettin",
        "it": "Una mostra di cosce e di tettine"
      },
      {
        "testo": "Da fâ perde ö çervello a ûn capûssin.",
        "it": "Da far perdere il cervello a un cappuccino."
      },
      {
        "testo": "Pirro ö passa a traverso all'avertûa",
        "it": "Pirro passa attraverso il varco"
      },
      {
        "testo": "E ö se caccia in te donne despûggiæ,",
        "it": "E si getta tra le donne nude,"
      },
      {
        "testo": "Tanto a porta a va in scandole, a derûa",
        "it": "Tanto che la porta va in schegge, crolla,"
      },
      {
        "testo": "E te gh'intra ûnn'ondâ de mandilæ;",
        "it": "E ci entra un'ondata di mariuoli;"
      },
      {
        "testo": "Scia se pœû immaginâ, con quell'arsûa",
        "it": "Si può immaginare, con quell'arsura,"
      },
      {
        "testo": "S'ëan ommi da troväse imbarassæ,",
        "it": "Se erano tipi da farsi scrupoli:"
      },
      {
        "testo": "Figgie, vidûe, maiæ, ghe passan tûtte,",
        "it": "Ragazze, vedove, maritate, ci passano tutte,"
      },
      {
        "testo": "Seggian zovene o vëgie, o belle o brûtte.",
        "it": "Siano giovani o vecchie, belle o brutte."
      },
      {
        "testo": "Ma scicomme nö gh'ëa dö pan pe tûtti,",
        "it": "Ma siccome non c'era pane per tutti,"
      },
      {
        "testo": "Cöre ö resto a frûga in ti appartamenti;",
        "it": "Corre il resto a frugare negli appartamenti;"
      },
      {
        "testo": "Ö l'ëa ûn fiûmme che ö libera i so flûtti,",
        "it": "Era un fiume che scatena i suoi flutti"
      },
      {
        "testo": "E ö l'inghœûggie campagne e casamenti,",
        "it": "E inghiotte campagne e caseggiati."
      },
      {
        "testo": "L'ëa tûtto bön, pe questi farabûtti,",
        "it": "Andava bene tutto, per questi farabutti:"
      },
      {
        "testo": "Öu, mobiglia, fucciare ed ornamenti,",
        "it": "Oro, mobilia, cianfrusaglie e ornamenti,"
      },
      {
        "testo": "In te meno de quanto ö staggo a dî,",
        "it": "In meno di quanto ci metto a dirlo"
      },
      {
        "testo": "Le tûtto andæto a fäse benedî.",
        "it": "E' tutto andato a farsi benedire."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 12",
      "it": "Priamo: le armi, Ecuba, la morte"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Chi l'é tempo che conte in che manëa",
        "it": "Qui è tempo che racconti in che maniera"
      },
      {
        "testo": "Priamo ö le andæto a fâse bûzarâ,",
        "it": "Priamo è andato a farsi rovinare,"
      },
      {
        "testo": "Quando proprio ö l'ha visto che nö gh'ëa",
        "it": "quando proprio vide che non c'era"
      },
      {
        "testo": "Moddo de vinse o pöesise appattà,",
        "it": "modo di vincere né di pareggiare:"
      },
      {
        "testo": "Ö s'é sûbito fissôu in te l'idea",
        "it": "si fissò subito nell'idea"
      },
      {
        "testo": "De mettise ö braghë pe andase a dâ,",
        "it": "di mettersi il brachiere per andarsi a dare,"
      },
      {
        "testo": "Ö se infioû l'uniforme, a sciabbra, a lûmma",
        "it": "si infilò l'uniforme, la sciabola, la lucerna"
      },
      {
        "testo": "Con çinquanta centimetri de ciûmma.",
        "it": "con cinquanta centimetri di piuma."
      },
      {
        "testo": "In to mëzo ai reali appartamenti,",
        "it": "In mezzo agli appartamenti reali"
      },
      {
        "testo": "Gh'ëa a cappella da Corte e da famiggia.",
        "it": "C'era la cappella di Corte e di famiglia."
      },
      {
        "testo": "Chi, co-e figgie, co-e nœûe, coi pochi argenti",
        "it": "Qui, con le figlie, con le nuore, coi pochi argenti"
      },
      {
        "testo": "Che a l'aveiva salvoû da-o parapiggia,",
        "it": "Che aveva salvato dal parapiglia,"
      },
      {
        "testo": "Stava Ecuba annicciâ, battendo i denti,",
        "it": "Stava Ecuba rannicchiata, battendo i denti,"
      },
      {
        "testo": "Aspëttando ogni pô, de piggià a striggia",
        "it": "Aspettando da un momento all'altro di prendere la strigliata,"
      },
      {
        "testo": "E con cênti, preghee, comme fa e donne,",
        "it": "E con lamenti, preghiere, come fanno le donne,"
      },
      {
        "testo": "A tiâva zû da-o çe, santi e madonne.",
        "it": "Tirava giù dal cielo santi e madonne."
      },
      {
        "testo": "Quande Priamo, armoû comme ûn zûenotto,",
        "it": "Quando Priamo, armato come un giovanotto,"
      },
      {
        "testo": "Ö l'é comparso in faccia a sô moggië",
        "it": "Comparve in faccia a sua moglie,"
      },
      {
        "testo": "Sorpreisa, mäveggiâ e l'ha fæto ûn botto",
        "it": "Sorpresa, meravigliata, fece un salto,"
      },
      {
        "testo": "Nö credendo mai ciû che ö fosse lë;",
        "it": "Non credendo mai più che fosse lui;"
      },
      {
        "testo": "Ma figgio ca-o, ti n'æ bevûo ciù ûn gotto,",
        "it": "«Ma figlio caro, ti sei bevuto un gotto di troppo?"
      },
      {
        "testo": "A ghe dixe, ti ö sæ che ti æ ö braghë?",
        "it": "— Gli dice — lo sai che hai il pannolone?"
      },
      {
        "testo": "E te ven ancon cûæ de fa ö gradasso,",
        "it": "E ti viene ancora voglia di fare il gradasso,"
      },
      {
        "testo": "Se ti perdi e cörezze ad ogni passo?",
        "it": "Se perdi le scoregge a ogni passo?»"
      },
      {
        "testo": "Famme questo piaxei, nö stâ a sciörti,",
        "it": "Fammi questo piacere, non stare ad uscire,"
      },
      {
        "testo": "Che se dunque te piggian a patatte,",
        "it": "Ché se dunque ti prendono a pattoni,"
      },
      {
        "testo": "Eh figgio caö, se tì ti æ cûæ de mûî,",
        "it": "Eh figlio caro, se hai voglia di morire,"
      },
      {
        "testo": "Nö gh'é necessitæ d'andâse a batte,",
        "it": "Non c'è bisogno di andarsi a battere,"
      },
      {
        "testo": "Stanni chì, che mûiemo tûtti duî",
        "it": "Stattene qui, che moriamo tutti e due"
      },
      {
        "testo": "Senza fâse piggiâ pe teste matte...",
        "it": "Senza farci prendere per teste matte…"
      },
      {
        "testo": "E a ö persûade coscì, che a te l'assetta,",
        "it": "E lo persuade così, che te lo fa sedere,"
      },
      {
        "testo": "Mäestoso sovrano, in sce a banchetta.",
        "it": "Maestoso sovrano, sulla panchetta."
      },
      {
        "testo": "Ecco intanto Polite, ö caga in nîö,",
        "it": "Ecco intanto Polite, l'ultimo della covata,"
      },
      {
        "testo": "Ûn bello zovenetto pin d'arzillö,",
        "it": "Un bel giovanetto pieno di brio,"
      },
      {
        "testo": "Ö se vedde arrivâ, fûto, scoriö,",
        "it": "Si vede arrivare, in fuga, braccato,"
      },
      {
        "testo": "Da Pirro, che ö ghe vûeiva fâ ö bacillö.",
        "it": "Da Pirro, che gli voleva far la festa."
      },
      {
        "testo": "Questo chì che ö l'aveiva za ferîö",
        "it": "Questo qui, che l'aveva già ferito,"
      },
      {
        "testo": "Co-a fûtta in corpo d'avei fæto pillo,",
        "it": "Con la rabbia in corpo per aver fatto cilecca,"
      },
      {
        "testo": "Ö continûa a piccâ, scinché ö meschin",
        "it": "Continua a colpire, finché il meschino,"
      },
      {
        "testo": "Davanti ai sô parenti, ö tîa ö gambin.",
        "it": "Davanti ai suoi parenti, tira le cuoia."
      },
      {
        "testo": "Achille tô pappâ, scibben che ö fosse",
        "it": "Achille tuo padre, sebbene fosse"
      },
      {
        "testo": "Ûn nemigo e ûn batösö comme tì,",
        "it": "Un nemico e un teppista come te,"
      },
      {
        "testo": "Quande g'ho domandoû d'Ettore e osse",
        "it": "Quando gli ho chiesto le ossa di Ettore"
      },
      {
        "testo": "Ö l'ha reise e ö l'ha avûo pietæ de mì;",
        "it": "Le ha rese e ha avuto pietà di me;"
      },
      {
        "testo": "E ti invece, brûtö, ti fæ de mosse",
        "it": "E tu invece, vigliacco, fai il gradasso"
      },
      {
        "testo": "E de ciû ti me bûrli? acciappa chì,",
        "it": "E per di più mi burli? Prendi qui!"
      },
      {
        "testo": "Ö tia fœûa a sciabbra e ö te g'asbria unn-a botta,",
        "it": "Tira fuori la sciabola e gli molla un colpo,"
      },
      {
        "testo": "Destegando corezze pe desotta.",
        "it": "Mollando scoregge di sotto."
      },
      {
        "testo": "Ma a sciabbra che a pesava ciû che lë",
        "it": "Ma la sciabola, che pesava più di lui,"
      },
      {
        "testo": "A tocca solo Pirro e a cazze in tæra;",
        "it": "Sfiora appena Pirro e cade a terra;"
      },
      {
        "testo": "Stö chì, poi, mâ edûcôu comme ûn muatë,",
        "it": "Costui, poi, maleducato come un mulattiere,"
      },
      {
        "testo": "Ö commensa a risponde c'ùnn-a gnæra,",
        "it": "Comincia a rispondere con uno sberleffo,"
      },
      {
        "testo": "E ö ghe dixe: finiscila braghæ,",
        "it": "E gli dice: «Finiscila, cagabrache,"
      },
      {
        "testo": "Vanni a tiâ de corezze sotto tæra,",
        "it": "Vai a tirar scoregge sottoterra,"
      },
      {
        "testo": "E digghe a mæ pappà che ö te i agotte.",
        "it": "E di' a mio papà che se le sorbisca lui."
      },
      {
        "testo": "Ma frattanto, ti vannite a fâ fotte.",
        "it": "Ma frattanto, tu va a farti fottere.»"
      },
      {
        "testo": "Ö l'abæra pe ö collo e c'ûn streppon",
        "it": "Lo afferra per il collo e con uno strattone"
      },
      {
        "testo": "Ö leva da assettoû d'in sce a banchetta,",
        "it": "Lo tira su di peso dalla panchetta,"
      },
      {
        "testo": "Ö strascinn-a tremante e in strambælon,",
        "it": "Lo trascina tremante e barcollante,"
      },
      {
        "testo": "C'ûnn-a man ö gh'acciappa a perûcchetta",
        "it": "Con una mano gli acchiappa la parrucchetta"
      },
      {
        "testo": "E con l'âtra piccândo cö squadrön,",
        "it": "E con l'altra, picchiando con lo spadone,"
      },
      {
        "testo": "Ö te ö taggia, ö te sgûara, ö te l'affetta;",
        "it": "Te lo taglia, te lo squarcia, te lo affetta;"
      },
      {
        "testo": "E coscì l'é finîo stö gran sovrano,",
        "it": "E così è finito questo gran sovrano,"
      },
      {
        "testo": "Proprio comme ûn strasson, comme ûn babano.",
        "it": "Proprio come uno straccione, come un babbeo."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 13",
      "it": "Elena e l'apparizione di Venere"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Mi vedendo coscì n'ho ciû posciûo,",
        "it": "Io, vedendo questo, non ho più potuto"
      },
      {
        "testo": "Arvî a bocca e parlâ dall'anscietæ;",
        "it": "Aprir bocca e parlare, dall'ansia;"
      },
      {
        "testo": "Ma tûtt'assemme poi, me sovvegnûo",
        "it": "Ma tutt'a un tratto poi mi sovvenni"
      },
      {
        "testo": "Da mæ povia famiggia e de mæ poæ:",
        "it": "Della mia povera famiglia e di mio padre:"
      },
      {
        "testo": "Ö l'ëa ascì, comme ö re, mezo fottûo.",
        "it": "Era anche lui, come il re, mezzo malandato,"
      },
      {
        "testo": "E ö l'aveiva all'incirca a stessa etæ;",
        "it": "E aveva all'incirca la stessa età;"
      },
      {
        "testo": "Ho pensôu ä mæ casa, aô mæ gardetto,",
        "it": "Ho pensato alla mia casa, al mio piccolo,"
      },
      {
        "testo": "A mæ moggë che aveivo lasciâ in letto",
        "it": "Alla mia moglie che avevo lasciato a letto."
      },
      {
        "testo": "Vêuggio andâli a sarvâ, ma primma amîo",
        "it": "Voglio andarli a salvare, ma prima guardo"
      },
      {
        "testo": "Chi di amixi m'aveiva accompagnôu;",
        "it": "Chi degli amici mi aveva accompagnato;"
      },
      {
        "testo": "Pesta! no gh'ëa nisciûn, chi l'ëa ferîo,",
        "it": "Peste! Non c'era nessuno: chi era ferito,"
      },
      {
        "testo": "Chi l'ëa stanco, chi morto e chi stroppiôu",
        "it": "Chi stanco, chi morto e chi storpiato,"
      },
      {
        "testo": "Tûtti per ûn se, pe ûn mæ m'han dæto ô gïo,",
        "it": "Tutti, per un sì o per un ma, mi hanno piantato in asso,"
      },
      {
        "testo": "Insomma, e-o bello solo abbandonôu;",
        "it": "Insomma, ero bello solo, abbandonato;"
      },
      {
        "testo": "Mi pe levâme d'in ti pê a-i cavalli",
        "it": "Io, per levarmi dai piedi dei cavalli,"
      },
      {
        "testo": "Vortime indietro, piggiâ ö liscio e dalli.",
        "it": "Mi volto indietro, me la svigno e via."
      },
      {
        "testo": "Appenn-a me sön giôu pe scappâ via,",
        "it": "Appena mi sono girato per scappar via,"
      },
      {
        "testo": "Che me torno a fermâ! perdingolinn-a",
        "it": "Che mi torno a fermare! Perdiana,"
      },
      {
        "testo": "In sce i schên d'ûn artâ, tûtta abbrensûia",
        "it": "Sui gradini di un altare, tutta intirizzita,"
      },
      {
        "testo": "Giâna, fûta, co-a pelle de gallinn-a,",
        "it": "Gialla, sbiancata, con la pelle d'oca,"
      },
      {
        "testo": "Veddo quella putten che co-a luçia",
        "it": "Vedo quella puttana che con la susanna"
      },
      {
        "testo": "A n'aveiva cacciôu, tûtti in rovinn-a,",
        "it": "Ci aveva cacciati tutti in rovina,"
      },
      {
        "testo": "Elena, intendo, e sciâ capisce ben,",
        "it": "Elena, intendo, e Lei capisce bene"
      },
      {
        "testo": "De chi parlo, se parlo d'unn-a putten.",
        "it": "Di chi parlo, se parlo di una puttana."
      },
      {
        "testo": "Me sön sentîo ûn scciûppon de raggia",
        "it": "Mi sono sentito uno scoppio di rabbia"
      },
      {
        "testo": "Pensando che pe lë, Troia a l'ëa in fiamme;",
        "it": "Pensando che per lei Troia era in fiamme;"
      },
      {
        "testo": "E comme, ho dîto, mî, questa canaggia",
        "it": "E come — ho detto io — questa canaglia"
      },
      {
        "testo": "A torniâ sann-a e salva a-o sô reamme,",
        "it": "Tornerà sana e salva al suo reame,"
      },
      {
        "testo": "Mentre nöi ne tocchiâ dormî in sce-a paggia",
        "it": "Mentre a noi toccherà dormire sulla paglia"
      },
      {
        "testo": "Limoxinando pe nö muî dä famme?",
        "it": "Elemosinando per non morir di fame?"
      },
      {
        "testo": "Lë a sä torna reginn-a e a fä de mösse",
        "it": "Lei sarà di nuovo regina e farà delle musse"
      },
      {
        "testo": "Con sô mariö, comme se ninte fösse?",
        "it": "Con suo marito, come se niente fosse?"
      },
      {
        "testo": "Nö perdiessann-a che n'andiâ cöscì,",
        "it": "No, perdiana, che non andrà così!"
      },
      {
        "testo": "Zà che ö caxo ö me a fâ vegnî in ti pë,",
        "it": "Già che il caso me la mette tra i piedi,"
      },
      {
        "testo": "Me ven coæ de levaghe ö presumî",
        "it": "Mi viene voglia di levarle la boria"
      },
      {
        "testo": "E daghe quattro patte in sce ö panë,",
        "it": "E darle quattro pacche sul paniere,"
      },
      {
        "testo": "E scibben che a dî ö veo, ghe perde mî",
        "it": "E sebbene, a dire il vero, ci perdo io"
      },
      {
        "testo": "A mettime c'ûn siôto comme lë,",
        "it": "A mettermi con un impiastro come lei,"
      },
      {
        "testo": "N'importa ninte, aviô a soddisfaziön",
        "it": "Non importa niente, avrò la soddisfazione"
      },
      {
        "testo": "De vendicame ûn pô de stö saccön.",
        "it": "Di vendicarmi un po' di sto saccone."
      },
      {
        "testo": "Tutt'assemme me sento imbarlûgâ",
        "it": "Tutt'a un tratto mi sento abbagliare"
      },
      {
        "testo": "E veddo tûtto cæo comme de giorno,",
        "it": "E vedo tutto chiaro come di giorno,"
      },
      {
        "testo": "E in tö mëzo da lûxe che a me pâ",
        "it": "E in mezzo alla luce, che mi pare"
      },
      {
        "testo": "Che a ghe fasse ûn'aureola d'intorno,",
        "it": "Le facesse un'aureola intorno,"
      },
      {
        "testo": "Cose veddo? l'immagine adorâ",
        "it": "Cosa vedo? L'immagine adorata"
      },
      {
        "testo": "Da mæ povia mammâ che ö sô soggiorno",
        "it": "Della mia povera mamma, che il suo soggiorno"
      },
      {
        "testo": "A l'aveiva lasciôu d'in mëzo a-i santi",
        "it": "Aveva lasciato in mezzo ai santi,"
      },
      {
        "testo": "E tûtta bella a m'ëa vegnua davanti.",
        "it": "E tutta bella mi era venuta davanti."
      },
      {
        "testo": "A me piggia pe man e dolcemente",
        "it": "Mi prende per mano e dolcemente"
      },
      {
        "testo": "A me parla e a me dixe: ma figgiêu,",
        "it": "Mi parla e mi dice: ma figliolo,"
      },
      {
        "testo": "Dimme ûn pittin, cose te sâta in mente,",
        "it": "Dimmi un po', cosa ti salta in mente,"
      },
      {
        "testo": "Perché ti sbotti e ti te a piggi a-o chêu,",
        "it": "Perché sbotti e te la prendi a cuore"
      },
      {
        "testo": "Pe ûnn-a fucciara tanto inconcludente.",
        "it": "Per una cianfrusaglia tanto inconcludente,"
      },
      {
        "testo": "Mentre poi ti nö pensi a casa têu?",
        "it": "Mentre poi non pensi a casa tua?"
      },
      {
        "testo": "E tô poæ, tô moggië, cö tô bardascia",
        "it": "E tuo padre, tua moglie, col tuo ragazzino"
      },
      {
        "testo": "Ti te læ zà scordæ, pe sta bagascia?",
        "it": "Te li sei già scordati, per questa bagascia?"
      },
      {
        "testo": "E a nö sæ stæta manco bonn-a lë",
        "it": "E non sarebbe stata capace nemmeno lei,"
      },
      {
        "testo": "Né quello scemelan che ö l'ha rapîa,",
        "it": "Né quello scimunito che l'ha rapita,"
      },
      {
        "testo": "A fâ tanto, de mettilo in t'ûn pê",
        "it": "A far tanto, da metterlo in quel posto (un piede)"
      },
      {
        "testo": "A Troia, a Frisia, a Misia e compagnia,",
        "it": "A Troia, alla Frigia, alla Misia e compagnia,"
      },
      {
        "testo": "Perché ti ö sacci, l'e vœntæ dö çe",
        "it": "Perché, che tu lo sappia, è volontà del cielo"
      },
      {
        "testo": "Che da ûn pessetto ö v'ha piggôu de mîa,",
        "it": "Che da un bel pezzetto vi ha presi di mira,"
      },
      {
        "testo": "E per quanto çerchæ de dî e de fâ,",
        "it": "E per quanto cerchiate di dire e di fare,"
      },
      {
        "testo": "Ö ve vêu dâve adosso e desmatâ.",
        "it": "Vi vuole dare addosso e distruggere."
      },
      {
        "testo": "Se poi te pâ che mi conte ünn-a vescia",
        "it": "Se poi ti pare che io ti racconti una frottola,"
      },
      {
        "testo": "Piggia chì che te presto i mæ speggetti,",
        "it": "Prendi qui, che ti presto i miei occhialini,"
      },
      {
        "testo": "Cön sti chì, ti veddiæ cose se mescia",
        "it": "Con questi vedrai cosa si agita"
      },
      {
        "testo": "Lasciû in çë pe cacciave in menissetti,",
        "it": "Lassù in cielo per ridurvi in minuzzoli,"
      },
      {
        "testo": "Dunque lascia cörrî, vâ a casa in sprescia,",
        "it": "Dunque lascia perdere, vai a casa in fretta,"
      },
      {
        "testo": "Nö stä chì a perde ö tempo e a fâ frexetti,",
        "it": "Non startene qui a perder tempo e a gingillarti,"
      },
      {
        "testo": "E dovunque ti andiæ mi te dò aggiutto",
        "it": "E dovunque tu vada io ti do aiuto"
      },
      {
        "testo": "E mi te vegniô apprêuvo dappertûtto",
        "it": "E verrò insieme a te dappertutto."
      },
      {
        "testo": "E a sparisce: me metto ö pincenez",
        "it": "E sparisce: mi metto il pince-nez"
      },
      {
        "testo": "E, perdiesann-a, cose veddo mai!",
        "it": "E, perdiana, cosa mai vedo!"
      },
      {
        "testo": "Paiva proprio che i santi che l’é in çë",
        "it": "Pareva proprio che i santi che sono in cielo"
      },
      {
        "testo": "Avessan cangiôu forma in tanti diai,",
        "it": "Avessero cambiato forma in tanti diavoli,"
      },
      {
        "testo": "Pe futtine ädreitûa, co-e man, cöi pë,",
        "it": "Per fotterci addirittura, con le mani, coi piedi,"
      },
      {
        "testo": "Brûxia, römpi, sconquassa, arranca e dai;",
        "it": "Brucia, rompi, sconquassa, strappa e dai;"
      },
      {
        "testo": "Quando ho visto coscì, mi son scappôu",
        "it": "Quando ho visto così, sono scappato"
      },
      {
        "testo": "Verso casa, avvilìo, mortificôu",
        "it": "Verso casa, avvilito, mortificato."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 14",
      "it": "Anchise e i prodigi"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "A malapenn-a introû, natûralmente,",
        "it": "Appena entrato, naturalmente,"
      },
      {
        "testo": "Son andæto a çercâ de mæ pappâ",
        "it": "Sono andato a cercare mio padre,"
      },
      {
        "testo": "Che ö l’ëa in letto a dormî tranquillamente",
        "it": "Che era a letto a dormire tranquillamente"
      },
      {
        "testo": "Senza manco pensâ a sto calabâ;",
        "it": "Senza manco pensare a sto trambusto;"
      },
      {
        "testo": "Ö ciammo, ö scrollo, un pô, ma inutilmente;",
        "it": "Lo chiamo, lo scrollo un po', ma inutilmente;"
      },
      {
        "testo": "Lë tranquillo ö se torna a giâ de là,",
        "it": "Lui, tranquillo, si rigira dall'altra parte,"
      },
      {
        "testo": "Ghe conto a cosa, ö nö se vœû sciatâ,",
        "it": "Gli racconto la cosa, non si vuole scomporre,"
      },
      {
        "testo": "Vœûggio vestilo, ö nö se vœû mesciâ.",
        "it": "Voglio vestirlo, non si vuole muovere."
      },
      {
        "testo": "Ma figgio cao, te pâ che in ti mæ panni",
        "it": "Ma figlio caro, ti pare che alla mia età"
      },
      {
        "testo": "Aggîe ancon vœûggia de sciûgame e cuggie",
        "it": "Abbia ancora voglia di asciugarmi le palle,"
      },
      {
        "testo": "Mentre me l'ho sciûghæ za pe tant'anni",
        "it": "Mentre me le sono già consumate per tanti anni"
      },
      {
        "testo": "Che me son arrivæ söttö e zenuggie?",
        "it": "Che mi sono arrivate sotto le ginocchia?"
      },
      {
        "testo": "Son carego de crûzî e de malanni",
        "it": "Sono carico di croci e di malanni,"
      },
      {
        "testo": "Che l'é tempo che lasce e che me doggie,",
        "it": "Che è tempo che lasci e che mi pieghi,"
      },
      {
        "testo": "L'é dö bello che mi l'ho in tö bacillö",
        "it": "È un bel pezzo che ce l'ho nel lato B,"
      },
      {
        "testo": "Lascime dunque muî, queto e tranquillö",
        "it": "Lasciami dunque morire, quieto e tranquillo."
      },
      {
        "testo": "E lì dûo comme ûn mû, fermo, intestoû",
        "it": "E lì duro come un mulo, fermo, intestardito,"
      },
      {
        "testo": "Ö nö vûeiva cegase a nisciûn patto,",
        "it": "Non si voleva piegare a nessun patto,"
      },
      {
        "testo": "Mi ö pregavo che m'eo mezo sfiatoû,",
        "it": "Io lo pregavo tanto che m'ero mezzo sfiatato,"
      },
      {
        "testo": "E lë sempre ciû dûo sempre ciû ciatto;",
        "it": "E lui sempre più duro, sempre più irremovibile;"
      },
      {
        "testo": "Strillava ö mæ figgiœû che ö s'ëa adescioû,",
        "it": "Strillava il mio bambino che si era svegliato,"
      },
      {
        "testo": "Cianzeiva mæ moggië, coe serve e ö gatto;",
        "it": "Piangeva mia moglie, con le serve e il gatto;"
      },
      {
        "testo": "Visto poi che l'ëa tûtto inutilmente,",
        "it": "Visto poi che era tutto inutile,"
      },
      {
        "testo": "Ho finîo pe tiâ zù qualche aççidente.",
        "it": "Ho finito per tirar giù qualche accidente."
      },
      {
        "testo": "Ah sci? ti nö vœû intende de raxon,",
        "it": "Ah sì? Non vuoi sentir ragione?"
      },
      {
        "testo": "Me son misso a sbraggiâ, ti vœû mûi chì?",
        "it": "Mi son messo a sbraitare, vuoi morire qui?"
      },
      {
        "testo": "E che a seggie coscì, ma sacranon,",
        "it": "E che sia così, ma sacramento,"
      },
      {
        "testo": "Vœûggio alôa fâ de mösse ûn pô mi ascì!",
        "it": "Voglio allora fare delle musse un po' anch'io!"
      },
      {
        "testo": "Se dovemmo andâ tûtti in perdizion",
        "it": "Se dobbiamo andare tutti in perdizione,"
      },
      {
        "testo": "Andemmo pure e commensiô da mì,",
        "it": "Andiamoci pure, e comincerò da me,"
      },
      {
        "testo": "Zù Recco e Rûa e Canâ de Rapallo,",
        "it": "Giù Recco, Ruta e Canale di Rapallo,"
      },
      {
        "testo": "Muimmo tûtti, perdie! che mi me sciallo.",
        "it": "Moriamo tutti, perdio, ché io ci godo!"
      },
      {
        "testo": "E dixendo coscì, sfroddro ö squaddron,",
        "it": "E dicendo così, sfodero lo spadone,"
      },
      {
        "testo": "Piggio ûn sciœuppö e me ö metto a caregâ,",
        "it": "Prendo un fucile e me lo metto a caricare,"
      },
      {
        "testo": "Me forniscio de balle e munizion,",
        "it": "Mi fornisco di pallottole e munizioni,"
      },
      {
        "testo": "E fasso pe sciortî, pe andame a dâ,",
        "it": "E faccio per uscire, per andarmi a dare,"
      },
      {
        "testo": "Ma poi quande son lì, pe infiâ ö pörtön,",
        "it": "Ma poi quando son lì, per infilare il portone,"
      },
      {
        "testo": "Eccote mæ moggië bell'aquegâ",
        "it": "Eccoti mia moglie tutta prostrata"
      },
      {
        "testo": "Che a m'abbranca a me strenze pe zenuggie",
        "it": "Che mi abbranca, mi stringe per le ginocchia"
      },
      {
        "testo": "E a me cria: maio caö nö fâ de cuggie.",
        "it": "E mi grida: marito caro, non fare il coglione!"
      },
      {
        "testo": "E a dixe che se sciorto, a ven le ascì",
        "it": "E dice che se esco, viene anche lei,"
      },
      {
        "testo": "E a me mostra ö figgiœû che a l'ha in te brasse.",
        "it": "E mi mostra il bambino che ha in braccio."
      },
      {
        "testo": "A cianze, a l'ûrla, a cria, tanto che mì,",
        "it": "Piange, urla, grida, tanto che io"
      },
      {
        "testo": "No so ciû cose digghe e cose fasse.",
        "it": "Non so più cosa dirle e cosa fare."
      },
      {
        "testo": "In to mentre che nöi atri stemmo lì,",
        "it": "Nel mentre che noialtri stiamo lì,"
      },
      {
        "testo": "Mi pe andamene e lë perché nö passe,",
        "it": "Io per andarmene e lei perché non passi,"
      },
      {
        "testo": "Me succede ûnn-a specie de portento",
        "it": "Mi succede una specie di portento"
      },
      {
        "testo": "Che ö ne fa perde a voxe e ö sentimento.",
        "it": "Che ci fa perdere la voce e i sensi."
      },
      {
        "testo": "Ecco lì che in sce a testa a-o mæ Giulin,",
        "it": "Ecco lì che sulla testa del mio Giulino"
      },
      {
        "testo": "Pâ de veddighe ûn fœugo che ö parpelle",
        "it": "Pare di vederci un fuoco che tremola"
      },
      {
        "testo": "Comme quello dö spiritö de vin,",
        "it": "Come quello dello spirito di vino,"
      },
      {
        "testo": "Senza toccâlö né brûxiaghe a pelle",
        "it": "Senza toccarlo né bruciargli la pelle."
      },
      {
        "testo": "Ö portemmo ädreitûa sotto ö brönzin,",
        "it": "Lo portiamo addirittura sotto il rubinetto,"
      },
      {
        "testo": "Ghe cacciemmo de l'ægua in te çervelle,",
        "it": "Gli buttiamo dell'acqua in testa,"
      },
      {
        "testo": "Ö crovimmo de strasse, ghe buffemmo,",
        "it": "Lo copriamo di stracci, gli soffiamo,"
      },
      {
        "testo": "Ma scì balle, ciû femmo, meno femmo.",
        "it": "Ma macché! Più facciamo, meno facciamo."
      },
      {
        "testo": "Quande Anchise ö l'ha visto stö portento",
        "it": "Quando Anchise ha visto questo portento"
      },
      {
        "testo": "(Tra parentesi, Anchise ö l'ëa mæ poæ)",
        "it": "(Tra parentesi, Anchise era mio padre)"
      },
      {
        "testo": "Ö se misso a sbraggiâ tûtto contento:",
        "it": "Si è messo a sbraitare tutto contento:"
      },
      {
        "testo": "Scialla scialla figgiœû nö ve sciatæ,",
        "it": "State allegri, ragazzi, non vi scomponete,"
      },
      {
        "testo": "Ö l'é ûn miaco co-e cugge, in mæ zuamento,",
        "it": "È un miracolo con le palle, parola mia,"
      },
      {
        "testo": "Ö l'é ûn prodigio da divinitæ;",
        "it": "È un prodigio della divinità;"
      },
      {
        "testo": "Se l'é veo quanto diggö, Ente Supremö,",
        "it": "Se è vero quanto dico, Ente Supremo,"
      },
      {
        "testo": "Danne ancon ûnn-a prœûva e ghe veddiemo.",
        "it": "Dacci ancora una prova e ci vedremo"
      },
      {
        "testo": "Ö nö n'aveiva ancon finîo de dî",
        "it": "Non aveva ancora finito di dire"
      },
      {
        "testo": "Queste parolle, che se sente ûn tron",
        "it": "Queste parole, che si sente un tuono"
      },
      {
        "testo": "E ûnn-a stella, che a l'ëa de dâto a noî,",
        "it": "E una stella, che era accanto a noi,"
      },
      {
        "testo": "Piggiâ ö volo diretta a settentrion,",
        "it": "Prende il volo diretta a settentrione,"
      },
      {
        "testo": "C'ûnna striscia de lûxe da nö dî",
        "it": "Con una striscia di luce da non dire"
      },
      {
        "testo": "E ûnn-a spûssa de povie da cannon,",
        "it": "E una puzza di polvere da cannone,"
      },
      {
        "testo": "Che mæ poæ, dao miracolo convinto,",
        "it": "Che mio padre, convinto dal miracolo,"
      },
      {
        "testo": "Ö s'é misso a sbraggià: me daggo vinto.",
        "it": "Si è messo a sbraitare: mi do per vinto."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 15",
      "it": "La fuga e la perdita di Creusa"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Nö gh'ëa tempo da perdise in te balle,",
        "it": "Non c'era tempo da perdere in ciance,"
      },
      {
        "testo": "Se vueivimo ëse pronti a fûtte ö can;",
        "it": "Se volevamo esser pronti a svignarcela;"
      },
      {
        "testo": "Piggio mæ poæ, me ö carego in sce spalle,",
        "it": "Prendo mio padre, me lo carico sulle spalle,"
      },
      {
        "testo": "Diggo a-o Giulietto che ö me dagghe man,",
        "it": "Dico a Giulietto che mi dia la mano,"
      },
      {
        "testo": "E Creûsa inghœûggeitâ in to so scialle,",
        "it": "E Creusa, avvolta nel suo scialle,"
      },
      {
        "testo": "A ne ven de derë poco lontan,",
        "it": "Ci viene dietro poco distante,"
      },
      {
        "testo": "Poi diggo ai servitoi ch'ëan lì a aspetâ",
        "it": "Poi dico ai servitori che erano lì ad aspettare:"
      },
      {
        "testo": "Stæ ben attenti a quello ch'ei da fâ.",
        "it": "State ben attenti a quello che avete da fare."
      },
      {
        "testo": "Piggiæ ö poco de bon che pûei portâ",
        "it": "Prendete il poco di buono che potete portare,"
      },
      {
        "testo": "Sciortî e porte a ûn per ûn pe no dâ all'œggio,",
        "it": "Uscite dalle porte a uno a uno per non dare nell'occhio,"
      },
      {
        "testo": "E pe stradde diverse, andæ a aspetâ",
        "it": "E per strade diverse, andate ad aspettare"
      },
      {
        "testo": "Che vegnimmo noi ascì in sce quello schœûggio",
        "it": "Che veniamo anche noi su quella rupe"
      },
      {
        "testo": "Dove gh'é unn-a capella rovinnâ",
        "it": "Dove c'è una cappella in rovina"
      },
      {
        "testo": "E ûn bell'erböeto che ö me pâ d'ofeûggio,",
        "it": "E un bell'alberello che mi pare d'alloro,"
      },
      {
        "testo": "Aôa in marcia, che chi nö se cûggionn-a",
        "it": "Ora in marcia, ché qui non si scherza,"
      },
      {
        "testo": "E preghæ i santi, che ve a mandan bonn-a.",
        "it": "E pregate i santi che ve la mandino buona."
      },
      {
        "testo": "Se mettemmo in cammin, ciancianinetto.",
        "it": "Ci mettemmo in cammino, pian pianino,"
      },
      {
        "testo": "Pë e stradde ciû sarvæghe e abbandonæ,",
        "it": "Per le strade più fuori mano e deserte,"
      },
      {
        "testo": "Mi che ignoravo cose ö l'ëa ô spaghetto,",
        "it": "Io che ignoravo cosa fosse la fifa,"
      },
      {
        "testo": "Aôa eo pin de spavento e d'anscietæ;",
        "it": "Ora ero pieno di spavento e d'angoscia;"
      },
      {
        "testo": "Finalmente arrivemmo a ûn carogetto;",
        "it": "Finalmente arrivammo a un vicoletto"
      },
      {
        "testo": "Che ö metteiva da-e porte da Çittæ,",
        "it": "Che portava alle porte della città,"
      },
      {
        "testo": "Quando sento di passi pe derë",
        "it": "Quando sento dei passi dietro,"
      },
      {
        "testo": "E ö poæ ö sbraggia figgiœû l'emmo a-o panë.",
        "it": "E il padre sbraita: figliolo, ce li abbiamo al paniere!"
      },
      {
        "testo": "Perdo a bûscioa ädreitûa, cöro, m'infio",
        "it": "Perdo addirittura la bussola, corro, mi infilo"
      },
      {
        "testo": "Dove n'aveivo mai misso de pë,",
        "it": "Dove non avevo mai messo piede,"
      },
      {
        "testo": "Me poso ûn pô, torno a piggià l'asbrîo",
        "it": "Mi fermo un po', torno a prendere lo slancio"
      },
      {
        "testo": "Senza mai dame mente pe derë,",
        "it": "Senza mai badare a ciò che sta dietro,"
      },
      {
        "testo": "E frattanto che cöro e no me gîo",
        "it": "E mentre corro e non mi giro"
      },
      {
        "testo": "Ecco li, che mi perdo mæ moggië,",
        "it": "Ecco lì, che perdo mia moglie,"
      },
      {
        "testo": "Né me n'accorso mai, scinn-a a-o momento,",
        "it": "Né me n'accorgo mai, fino al momento"
      },
      {
        "testo": "Che arrivo ao scîto dell'appuntamento.",
        "it": "Che arrivo al luogo dell'appuntamento."
      },
      {
        "testo": "Sciâ se pœû immaginâ, che crï, che centi",
        "it": "Si può immaginare che grida, che lamenti"
      },
      {
        "testo": "Quande ho visto che lë a n'ëa ciû con noî,",
        "it": "Quando ho visto che lei non era più con noi,"
      },
      {
        "testo": "Se n'ho tioû zû dì tacchi e di aççidenti,",
        "it": "Se ne ho tirati giù di moccoli e di accidenti,"
      },
      {
        "testo": "Se n'ho dîto e sbraggioû de tûtti i coî;",
        "it": "Se ne ho dette e sbraitate di tutti i colori;"
      },
      {
        "testo": "Lascio Giulio e mæ poæ, co-i pochi argenti,",
        "it": "Lascio Giulio e mio padre, coi pochi argenti,"
      },
      {
        "testo": "In custodia di nostri servitôi,",
        "it": "In custodia dei nostri servitori,"
      },
      {
        "testo": "E m'asbrio testa e cû, torna inderë",
        "it": "E mi lancio a rotta di collo, di nuovo indietro,"
      },
      {
        "testo": "Deciso a tûtto, pe trovâla lë,",
        "it": "Deciso a tutto, per trovarla."
      },
      {
        "testo": "Rifassö ö mæ cammin, torno in çittæ",
        "it": "Rifaccio il mio cammino, torno in città"
      },
      {
        "testo": "Amiando dapertûtto e inûtilmente,",
        "it": "Guardando dappertutto e inutilmente,"
      },
      {
        "testo": "Piggio a stradda da dove êimo passæ,",
        "it": "Prendo la strada da dove eravamo passati,"
      },
      {
        "testo": "A ciammo a perdifiato e a no me sente,",
        "it": "La chiamo a perdifiato e non mi sente,"
      },
      {
        "testo": "Poi ritorno corrindo a casa mæ",
        "it": "Poi ritorno correndo a casa mia"
      },
      {
        "testo": "Pe vedde, chi sa mai, se pe aççidente",
        "it": "Per vedere, chissà mai, se per caso"
      },
      {
        "testo": "A se ghe fosse torna andæta a asconde",
        "it": "Ci fosse tornata a nascondersi"
      },
      {
        "testo": "Pe aveime perso senza savei donde.",
        "it": "Per avermi perso senza sapere dove."
      },
      {
        "testo": "Ma scì balle, a mæ casa a l'ëa za pinn'a",
        "it": "Ma macché! La mia casa era già piena"
      },
      {
        "testo": "De Greci che ne favan ö bordello,",
        "it": "Di Greci che ci facevano il bordello,"
      },
      {
        "testo": "Sciamme, zimme, tissoin, fûmme, rovinn-a",
        "it": "Fiamme, faville, tizzoni, fumo, rovina"
      },
      {
        "testo": "L'aveivan za cangiâ in t'un Mongibello;",
        "it": "L'avevano già cambiata in un Mongibello;"
      },
      {
        "testo": "Torno indietro de corsa e vaddo scinn-a",
        "it": "Torno indietro di corsa e vado fino"
      },
      {
        "testo": "A-o Palazzo dö Re, poi da-o Castello.",
        "it": "Al Palazzo del Re, poi al Castello,"
      },
      {
        "testo": "Ai Portici, in te gexe ch'ëan stivæ,",
        "it": "Ai Portici, nelle chiese che erano stipate"
      },
      {
        "testo": "De mobili, de roba e de dinæ.",
        "it": "Di mobili, di roba e di denaro."
      },
      {
        "testo": "E metteivan lì tûtto, in sci artæ,",
        "it": "E mettevano lì tutto, sugli altari,"
      },
      {
        "testo": "In tæra, a futticû, pë sacrestie,",
        "it": "Per terra, alla rinfusa, per le sacrestie,"
      },
      {
        "testo": "Vasi, gioielli, mobili indoræ,",
        "it": "Vasi, gioielli, mobili indorati,"
      },
      {
        "testo": "Argenti, prie preziose e drapperie,",
        "it": "Argenti, pietre preziose e drapperie,"
      },
      {
        "testo": "Ommi, donne, gardetti incâdenæ",
        "it": "Uomini, donne, ragazzini incatenati"
      },
      {
        "testo": "Che mandavan di lûi da scciappâ e prie,",
        "it": "Che mandavano lamenti da spaccare le pietre,"
      },
      {
        "testo": "Ma scì cuggie, nö a veddö pe ûnn-a potta",
        "it": "Ma macché! Non la vedo da nessuna parte"
      },
      {
        "testo": "E me metto a giâ indietro ûn'âtra votta.",
        "it": "E mi rimetto a tornare indietro un'altra volta."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 1 parte 16",
      "it": "L'ombra di Creusa e la partenza"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Senza savei, che pesci ciû piggiâ,",
        "it": "Senza sapere più che pesci pigliare,"
      },
      {
        "testo": "A ciammo pe sô nomme in tûtti i canti,",
        "it": "La chiamo per nome in tutti gli angoli,"
      },
      {
        "testo": "Tûtt'assemme, me a veddo capitâ",
        "it": "Tutt'a un tratto, me la vedo comparire"
      },
      {
        "testo": "Ben ciû grande dö solito davanti",
        "it": "Ben più grande del solito, davanti,"
      },
      {
        "testo": "Me se særa ö respîo, me ven da suâ,",
        "it": "Mi si serra il respiro, mi viene da sudare,"
      },
      {
        "testo": "Ciammo aggiuttö ä madonna e a tûtti i santi,",
        "it": "Chiamo aiuto alla madonna e a tutti i santi,"
      },
      {
        "testo": "Ma lë ciancianinetto a s'avvixinn-a",
        "it": "Ma lei, pian pianino, si avvicina"
      },
      {
        "testo": "E a se mette a dî, co-a sô voxinn-a:",
        "it": "E si mette a dire, con la sua vocina:"
      },
      {
        "testo": "Compagno di mæ giorni fortunæ",
        "it": "Compagno dei miei giorni fortunati,"
      },
      {
        "testo": "Percose ti te sciâti inutilmente?",
        "it": "Perché ti affanni inutilmente?"
      },
      {
        "testo": "Pe nö fâme divedde a tô anscietæ",
        "it": "Per non farmi vedere la tua ansia"
      },
      {
        "testo": "E a noia de viaggiâ fra tanta gente!",
        "it": "E la noia di viaggiare fra tanta gente!"
      },
      {
        "testo": "Iddio, che ö nö fâ e cose pe meitæ,",
        "it": "Iddio, che non fa le cose a metà,"
      },
      {
        "testo": "Ö m'ha fæto creppâ d'ûn aççidente:",
        "it": "Mi ha fatto crepare d'un accidente:"
      },
      {
        "testo": "A-oa a l'é comme a l'é, se devo dî",
        "it": "Ora è come è, e se devo dire,"
      },
      {
        "testo": "Nö me pâ vëo de n'avei ciû da mûî.",
        "it": "Non mi par vero di non dover più morire"
      },
      {
        "testo": "Ö sô ben, che pe ûn pô te rincresciâ",
        "it": "Lo so bene che per un po' ti dispiacerà,"
      },
      {
        "testo": "Pe nö savei döve appussâ ö pennello,",
        "it": "Per non sapere dove pucciare il pennello,"
      },
      {
        "testo": "Ma ûn pô de diëta a nö te fâ dö mâ,",
        "it": "Ma un po' di dieta non ti fa male,"
      },
      {
        "testo": "Tanto ciû che ti në manco ciû noëllo",
        "it": "Tanto più che non sei più novello,"
      },
      {
        "testo": "Ma quando ti sæ lesto de viaggiâ,",
        "it": "Ma quando sarai pronto a viaggiare,"
      },
      {
        "testo": "N'aggite pûia che ti appendiæ ö cappello",
        "it": "Non aver paura che appenderai il cappello"
      },
      {
        "testo": "E in t'ûnn-a botta ti troviæ a luçia,",
        "it": "E in un colpo troverai la susanna,"
      },
      {
        "testo": "A gloria, l'abbondansa e a scignoria.",
        "it": "La gloria, l'abbondanza e la signoria."
      },
      {
        "testo": "Atro nö t'ho da dî bello marîo,",
        "it": "Altro non ho da dirti, caro marito,"
      },
      {
        "testo": "Che ti pensi a-o figgiêu che t'ho lasciôu,",
        "it": "Che tu pensi al figliolo che t'ho lasciato,"
      },
      {
        "testo": "Tîtelo sciû, pin de timö de Dio,",
        "it": "Tiralo su, pieno di timor di Dio,"
      },
      {
        "testo": "Bravo comme sô poæ, ben edûcôu.",
        "it": "Bravo come suo padre, ben educato."
      },
      {
        "testo": "Vœûggime ben, mîa de sta allegro, e addio.",
        "it": "Voglimi bene, bada di star allegro, e addio."
      },
      {
        "testo": "A sparisce e mì resto abbellinou,",
        "it": "Sparisce e io resto sbalordito,"
      },
      {
        "testo": "Çerco de dâghe ancön l'ûrtimo abbrasso,",
        "it": "Cerco di darle ancora l'ultimo abbraccio,"
      },
      {
        "testo": "Ma sbatto l'aia, senza strenze ûn casso.",
        "it": "Ma sbatto l'aria, senza stringere un cazzo."
      },
      {
        "testo": "Fûto, fûto pensando a-i caxi mæ,",
        "it": "Pallido, pallido, pensando ai casi miei,"
      },
      {
        "testo": "Sön törnôu dâ capella rovinâ",
        "it": "Son tornato alla cappella in rovina"
      },
      {
        "testo": "Döve gh'ëa con mæ figgiö e con mæ poæ",
        "it": "Dove c'era, con mio figlio e con mio padre,"
      },
      {
        "testo": "Ûnn-a folla de gente radûnâ",
        "it": "Una folla di gente radunata"
      },
      {
        "testo": "Pronta a dividde e nostre avverscitæ",
        "it": "Pronta a condividere le nostre avversità,"
      },
      {
        "testo": "Seguitandone in tæra comme in mâ:",
        "it": "Seguendoci per terra come per mare:"
      },
      {
        "testo": "Troia a l'ëa ûn fôu... nö gh'ëa da fâ ûn bellin,",
        "it": "Troia era un manicomio... non c'era un cazzo da fare,"
      },
      {
        "testo": "Dunque, ho dîto, mettemöse in cammin.",
        "it": "Dunque, ho detto, mettiamoci in cammino."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 1",
      "it": "Didone confessa l'amore ad Anna"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "E frattanto a reginn-a a s'ëa innamoâ",
        "it": "E frattanto la regina s'era innamorata"
      },
      {
        "testo": "Poco a poco d'Enea comme ûnn-a gatta,",
        "it": "Poco a poco di Enea, come una gatta,"
      },
      {
        "testo": "E pensando a-o sô aspetto, a-o sô parlâ,",
        "it": "E pensando al suo aspetto, al suo parlare,"
      },
      {
        "testo": "A-e sô gesta, a-o sô spirito, ä sô scciatta,",
        "it": "Alle sue gesta, al suo spirito, alla sua schiatta,"
      },
      {
        "testo": "A l'aveiva zà a testa invexendâ",
        "it": "Aveva già la testa in subbuglio"
      },
      {
        "testo": "E a se sentiva zâ buggî a pignatta,",
        "it": "E si sentiva già bollire la pignatta,"
      },
      {
        "testo": "Che a sön de bâgi e de cangiâ de fianco,",
        "it": "Che, a furia di sbadigli e di rigirarsi,"
      },
      {
        "testo": "A passa tûtta a sô nöttûann-a in gianco.",
        "it": "Passa tutta la sua nottata in bianco."
      },
      {
        "testo": "In conseguenza, all'indoman mattinn-a",
        "it": "Di conseguenza, l'indomani mattina,"
      },
      {
        "testo": "Figûæve ûn pô se a nö gh'è parsa vêa",
        "it": "Figuratevi un po' se non le è parso vero"
      },
      {
        "testo": "De vedde ö cæo lûxî sotto a tendinn-a,",
        "it": "Di vedere l'alba rilucere sotto la tendina,"
      },
      {
        "testo": "Pe sâtä zù, senza ciammâ a camêa,",
        "it": "Per saltar giù senza chiamare la cameriera,"
      },
      {
        "testo": "D'ingiarmâse ûn contûsso ä biscöchinn-a",
        "it": "buttarsi addosso un corsetto alla carlona"
      },
      {
        "testo": "E in camixia e descäsa comm-a l'ëa,",
        "it": "E, in camicia e scalza com'era,"
      },
      {
        "testo": "Andâ de filo a fâ adesciâ sô sœû",
        "it": "Andare filata a svegliare sua sorella"
      },
      {
        "testo": "Pe dîghe tûtto e scaregâse ö chœû.",
        "it": "Per dirle tutto e scaricarsi il cuore."
      },
      {
        "testo": "Mi nö sô, figgia cä, cose me sente,",
        "it": "Io non so, cara ragazza, cosa mi sento,"
      },
      {
        "testo": "A ghe dixe, assettandose in sce ö letto,",
        "it": "Le dice, sedendosi sul letto,"
      },
      {
        "testo": "Ma me rodo, me crûzio, me tormento,",
        "it": "Ma mi rodo, mi cruccio, mi tormento,"
      },
      {
        "testo": "Sempre apprœuvo a quest'ommo, e ghe rimetto",
        "it": "Sempre dietro a quest'uomo, e ci rimetto"
      },
      {
        "testo": "Ö fighæto e a salute, in mæ zûamento.",
        "it": "Il fegato e la salute, te lo giuro."
      },
      {
        "testo": "Che bell'ommo però, mi ghe scometto",
        "it": "Che bell'uomo però, io ci scommetto"
      },
      {
        "testo": "Che se ö pôescimo vedde a-o natûrale",
        "it": "Che se lo potessimo vedere al naturale"
      },
      {
        "testo": "Ö l'é un campion da nö trovâ l'uguale.",
        "it": "È un campione da non trovare l'uguale."
      },
      {
        "testo": "Ah davvei, che se mi n'avesse zûou",
        "it": "Ah davvero, che se non avessi giurato"
      },
      {
        "testo": "De stâ sempre cöscì senza maiame,",
        "it": "Di stare sempre così senza maritarmi,"
      },
      {
        "testo": "In memoia de quello disgraziôu,",
        "it": "In memoria di quel disgraziato"
      },
      {
        "testo": "Che avanti ö tempo ö l'ha dovûo lasciame,",
        "it": "Che prima del tempo ha dovuto lasciarmi,"
      },
      {
        "testo": "E se avesse ö çervello invexendôu",
        "it": "E se avessi il cervello così invaghito"
      },
      {
        "testo": "In manea da pensâ torna a ligame,",
        "it": "Da pensare di nuovo a legarmi,"
      },
      {
        "testo": "Cose serve cöntate ûnn-a boxia,",
        "it": "Cosa serve raccontarti una bugia,"
      },
      {
        "testo": "Faivo törna con lë, questa luçia.",
        "it": "rifarei con lui, questa susanna."
      },
      {
        "testo": "Ma me vegne ciûttosto ûn aççidente",
        "it": "Ma mi venga piuttosto un accidente"
      },
      {
        "testo": "Spartilosso, a feriölo e vertadeo,",
        "it": "Che mi spacchi le ossa e mi intabarri, in verità,"
      },
      {
        "testo": "Se sön tanto carogna a daghe a mente",
        "it": "Se sono tanto carogna da dargli la mente,"
      },
      {
        "testo": "Tanto vile a cangiâ da quello ch'eo,",
        "it": "Tanto vile da cambiare da quella che ero,"
      },
      {
        "testo": "E anche solo pe bûrla o mentalmente,",
        "it": "E anche solo per burla o mentalmente,"
      },
      {
        "testo": "De fâ e corne ä memoia de Sicheo,",
        "it": "Di fare le corna alla memoria di Sicheo,"
      },
      {
        "testo": "Che ö l'é ö solo e ö sä scinn-a ä seportûa,",
        "it": "Che è il solo e sarà fino alla sepoltura"
      },
      {
        "testo": "Che ö se posse vantä d'aveime avûa.",
        "it": "A potersi vantare di avermi avuta."
      },
      {
        "testo": "Ma via, famme ö piaxei, cose ti dixi,",
        "it": "Ma via, fammi il piacere, cosa dici,"
      },
      {
        "testo": "Ghe risponde sô sœû, dandoghe sotta,",
        "it": "Le risponde sua sorella, dandoci dentro,"
      },
      {
        "testo": "Ti gh'æ ûn ommo con tanto de barbixi,",
        "it": "Hai un uomo con tanto di barbigli,"
      },
      {
        "testo": "Tì ti ë cada, ti ë bella e ti ë zuenotta",
        "it": "Tu sei calda, sei bella e sei giovanotta"
      },
      {
        "testo": "E ti devi aspetâ i cavelli grixi",
        "it": "E devi aspettare i capelli grigi"
      },
      {
        "testo": "Pe godîte e maiate ûn'atra votta?",
        "it": "Per goderti e maritarti un'altra volta?"
      },
      {
        "testo": "Cose ti ne vœû fâ da tô luçia,",
        "it": "Cosa ne vuoi fare della tua susanna,"
      },
      {
        "testo": "Ti te pensi de mettila in sarmöia?",
        "it": "Pensi di metterla in salamoia?"
      },
      {
        "testo": "Vœuggio fâ che ghe seggie a costûmanza",
        "it": "Voglio concedere che ci sia l'usanza"
      },
      {
        "testo": "D'ûsâ ûn çerto riguardo ai nostri morti,",
        "it": "Di portare un certo riguardo ai nostri morti,"
      },
      {
        "testo": "E questo ti l'æ avûo che te n'avanza",
        "it": "E questo l'hai fatto fin troppo,"
      },
      {
        "testo": "Senza temme de puëi fâghe di torti,",
        "it": "Senza temere di potergli far torto,"
      },
      {
        "testo": "Da quando ti æ lascioû senza speranza",
        "it": "Da quando hai lasciato senza speranza"
      },
      {
        "testo": "Iarba e tûtta a genia di cascamorti,",
        "it": "Iarba e tutta la genia dei cascamorti,"
      },
      {
        "testo": "Ch'ëan vegnûi chi, co-a scûsa de sposate,",
        "it": "Che erano venuti qui con la scusa di sposarti,"
      },
      {
        "testo": "Ma che in föndö nö vûeivan che baxate.",
        "it": "Ma che in fondo non volevano che baciarti."
      },
      {
        "testo": "Alöa demughe là l'ëa troppo presto",
        "it": "Allora, mettiamo pure, là era troppo presto"
      },
      {
        "testo": "E ti n'aveivi nisciûn atro in mente,",
        "it": "E non avevi nessun altro in mente,"
      },
      {
        "testo": "Ma aoa invece, nö ghe nisciun pretesto",
        "it": "Ma ora invece non c'è nessun pretesto"
      },
      {
        "testo": "Pe dûala in sce stö tön continuamente,",
        "it": "Per durarla su questo tono in continuazione,"
      },
      {
        "testo": "Ti te senti innamoa d'ûn ommo onesto,",
        "it": "Ti senti innamorata d'un uomo onesto,"
      },
      {
        "testo": "Nobile e forte comme ûn aççidente",
        "it": "Nobile e forte come un accidente,"
      },
      {
        "testo": "Ti n'æ coæ, lë ö le lì pronto a piggiâte",
        "it": "Ne hai voglia, lui è lì pronto a prenderti,"
      },
      {
        "testo": "E tì, ti te fæ stiâ, tanto pe dâte.",
        "it": "E tu, tu ti fai desiderare tanto, per darti ."
      },
      {
        "testo": "E poi comme ti pensi a tiâte avanti,",
        "it": "E poi come pensi di tirarti avanti,"
      },
      {
        "testo": "Circondâ comme ti ë da de canaggie?",
        "it": "Circondata come sei da delle canaglie?"
      },
      {
        "testo": "Deserti pe derë, secche davanti,",
        "it": "Deserti dietro, secche davanti,"
      },
      {
        "testo": "De naziöin semibarbare e selvaggie",
        "it": "Di nazioni semibarbare e selvagge"
      },
      {
        "testo": "Che te veûan bûzâra da tûtti i canti",
        "it": "Che ti vogliono fregare da tutti i lati,"
      },
      {
        "testo": "Senza ûn ommo de chœû che ö t'incoraggie?",
        "it": "Senza un uomo di cuore che ti incoraggi?"
      },
      {
        "testo": "E to fræ che da Tiro ö fa ö gradasso",
        "it": "E tuo fratello che da Tiro fa il gradasso"
      },
      {
        "testo": "E che ö l'ha zûôu de vüeite mette ao passo?",
        "it": "E che ha giurato di volerti mettere al passo?"
      },
      {
        "testo": "Se fosse tì, mi ringraziæ ö Segnô",
        "it": "Se fossi te, ringrazierei il Signore"
      },
      {
        "testo": "D'aveimeo fæto capitâ in ti pê,",
        "it": "Di avermelo fatto capitare tra i piedi,"
      },
      {
        "testo": "E donne han bello dî, che fan da lô",
        "it": "E le donne hanno un bel dire che fanno da sole,"
      },
      {
        "testo": "Ma ûn pâ de braghe ö ghe tia sciû ö pevë;",
        "it": "Ma un paio di brache tira su il pepe;"
      },
      {
        "testo": "Dunque acciappilo ben, fagghe l'amô,",
        "it": "Dunque acchiappalo bene, fagli l'amore,"
      },
      {
        "testo": "Dagghe dö sevo, e no tiâ o cû inderê",
        "it": "Lusingalo, e non tirare il culo indietro,"
      },
      {
        "testo": "O pe ö tempo o pe ö mâ, no manca scûsa,",
        "it": "O per il tempo o per il mare, non manca la scusa,"
      },
      {
        "testo": "Tegnilo streito e stanni sciû co-a mûsa.",
        "it": "Tienilo stretto e stai su con il morale."
      },
      {
        "testo": "Ve lasciö dî se sti raxionamenti",
        "it": "Vi lascio dire se questi ragionamenti"
      },
      {
        "testo": "In sce a povea Didon, n'han fæto effetto!",
        "it": "Sulla povera Didone han fatto effetto!"
      },
      {
        "testo": "Ö l'ëa comme sciûsciâ in ta braxe ardenti,",
        "it": "Era come soffiare sulla brace ardente,"
      },
      {
        "testo": "In mezo d'un paggiâ mette ûn brichetto,",
        "it": "Mettere un fiammifero in mezzo a un pagliaio,"
      },
      {
        "testo": "Za che a tegniva a söggezion coi denti",
        "it": "Giacché teneva la soggezione con i denti"
      },
      {
        "testo": "E a l'ëa in sce pisse de vegnî ûn ciapetto,",
        "it": "Ed era sul punto di diventare una troia,"
      },
      {
        "testo": "Sentindo che sô sœû a ghe dava sotta,",
        "it": "Sentendo che sua sorella ci dava dentro,"
      },
      {
        "testo": "A l'arve a veia e a lascia scöre a scotta.",
        "it": "Apre la vela e lascia scorrere la scotta."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 2",
      "it": "La passione cresce "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Ma pe quello pittin d'erûbescenza,",
        "it": "Ma per quel pochino di rossore,"
      },
      {
        "testo": "Quello çerto riguardo a fâla ben",
        "it": "Quel certo riguardo a farla bene"
      },
      {
        "testo": "Che ûnn-a donna a l'ha ancön quando a commensa",
        "it": "Che una donna ha ancora quando comincia"
      },
      {
        "testo": "A incamminase per vegnî pötten,",
        "it": "A incamminarsi per diventare puttana,"
      },
      {
        "testo": "Sön andæto a fâ ûn giö de penitensa",
        "it": "Sono andato a fare un giro di penitenza"
      },
      {
        "testo": "Ai Santûai ciû famösi e ciû lonten,",
        "it": "Ai santuari più famosi e lontani,"
      },
      {
        "testo": "Portando voti e fando dî de messe",
        "it": "Portando voti e facendo dire messe"
      },
      {
        "testo": "Pe amiâ se a smangiaxion a ghe passesse.",
        "it": "Per vedere se la smania le passasse."
      },
      {
        "testo": "Ma a l'é bella da rîe, sta pretenscion",
        "it": "Ma è bella da ridere, questa pretesa"
      },
      {
        "testo": "De tiâ a mezo l'Altiscimo e de vuei",
        "it": "Di tirare in ballo l'Altissimo e di volere"
      },
      {
        "testo": "Che ö nö leve d'adosso a smangiaxion",
        "it": "Che ci levi di dosso la smania"
      },
      {
        "testo": "Mentre invece a ne fa tanto piaxei;",
        "it": "Mentre invece ci fa tanto piacere;"
      },
      {
        "testo": "De pregalo de mettine in raxon",
        "it": "Di pregarlo di farci rinsavire"
      },
      {
        "testo": "Quande semmo in tö chœû d'ûn atro paœi",
        "it": "Quando abbiamo il cuore di tutt'altro parere,"
      },
      {
        "testo": "Che s'ö fosse mincion da dâne a mente",
        "it": "Ché se fosse minchione da darci retta"
      },
      {
        "testo": "Ö ne fæiva vegnî mezô aççidente!",
        "it": "Ci farebbe venire mezzo accidente!"
      },
      {
        "testo": "O che massa d'ipocriti e birbanti",
        "it": "Oh che massa di ipocriti e birbanti"
      },
      {
        "testo": "Che semmo tûtti a commençâ da vöi,",
        "it": "Che siamo tutti quanti, a cominciare da voi,"
      },
      {
        "testo": "Cose serve sciûgale ai beati e ai santi",
        "it": "A cosa serve asciugarle ai beati e ai santi"
      },
      {
        "testo": "Perch'aggian compascion di nostri döi,",
        "it": "Affinché abbiano compassione dei nostri dolori,"
      },
      {
        "testo": "Se poi se vœmmo manezzâ coi guanti",
        "it": "Se poi ci vogliamo maneggiare coi guanti "
      },
      {
        "testo": "Se ö mâ se l'emmo fabbricoû da nöi?",
        "it": "Se il male ce lo siamo fabbricato da noi?"
      },
      {
        "testo": "Cose serve fâ voti e tiâ zû ö çë",
        "it": "A che serve fare voti e tirar giù il cielo"
      },
      {
        "testo": "Se ne gûsta piggialo pe derë",
        "it": "Se ci piace prenderlo nel didietro?"
      },
      {
        "testo": "Comme quando ne ven coæ de brûschî",
        "it": "Come quando ci viene voglia di andare di corpo"
      },
      {
        "testo": "E che semmo pe caxo a passegiâ,",
        "it": "E siamo per caso a passeggiare,"
      },
      {
        "testo": "Se mettemmo lì sûbito a corrî,",
        "it": "Ci mettiamo lì subito a correre,"
      },
      {
        "testo": "Pe trovà ûn posto dove poeila fâ,",
        "it": "Per trovare un posto dove poterla fare,"
      },
      {
        "testo": "Ma in tö ciû bello, a no se poêu tegnî",
        "it": "Ma sul più bello, non la si può trattenere"
      },
      {
        "testo": "E besœûgna lasciasela scappâ,",
        "it": "E bisogna lasciarsela scappare,"
      },
      {
        "testo": "Mentre che intanto continûemmo a daghe",
        "it": "Mentre intanto continuiamo a darci"
      },
      {
        "testo": "Sempre de gambe, co-a cacca in te braghe",
        "it": "Sempre di gambe, con la cacca nelle braghe."
      },
      {
        "testo": "Coscì, a povia Didon, cö chœu ferïo",
        "it": "Così, la povera Didone, col cuore ferito"
      },
      {
        "testo": "A nö pûeiva trovâ consolazion.",
        "it": "Non poteva trovare consolazione."
      },
      {
        "testo": "A corriva in ça e in là, senza respïo",
        "it": "Correva di qua e di là, senza respiro"
      },
      {
        "testo": "Pe levase stö crûzio e stö magon,",
        "it": "Per togliersi questo cruccio e questo magone,"
      },
      {
        "testo": "Senza riûscighe e senza daghe ö gïo,",
        "it": "Senza riuscirci e senza venirne a capo,"
      },
      {
        "testo": "Senza poei dominâ sta smangiaxion",
        "it": "Senza poter dominare questo prurito"
      },
      {
        "testo": "E ciû a fava de smanie e a se grattava",
        "it": "E più faceva smanie e si grattava"
      },
      {
        "testo": "E ciû a vœûggia a cresceiva e a tormentava.",
        "it": "E più la voglia cresceva e la tormentava."
      },
      {
        "testo": "Quindi, co-a scûsa de fa vedde a Enea",
        "it": "Quindi, con la scusa di far vedere ad Enea"
      },
      {
        "testo": "E bellezze dö scîto e i monûmenti,",
        "it": "Le bellezze del posto e i monumenti,"
      },
      {
        "testo": "A çercava ûn pretesto, ûnn-a manea",
        "it": "Cercava un pretesto, una maniera"
      },
      {
        "testo": "De mostraghe e sô penn-e e i sô tormenti;",
        "it": "Di mostrargli le sue pene e i suoi tormenti;"
      },
      {
        "testo": "E a ghe voeiva parlâ, ma in sce l'idea",
        "it": "E gli voleva parlare, ma all'idea"
      },
      {
        "testo": "Che ö ghe scìasse, a se ten tütto in ti denti,",
        "it": "Che lui svicolasse, si tiene tutto tra i denti,"
      },
      {
        "testo": "E a nö sà comme dî, ne comme fâ",
        "it": "E non sa come dire, né come fare"
      },
      {
        "testo": "Pe faghe intende che a se vœiva dâ",
        "it": "Per fargli capire che si voleva dare."
      },
      {
        "testo": "E pe avei l'occaxiön de discorrî",
        "it": "E per avere l'occasione di discorrere"
      },
      {
        "testo": "Quande sön lì in sce ö gotto ä zinzannâ",
        "it": "Quando sono lì sul bicchiere a gingillarsi"
      },
      {
        "testo": "Pe-a çentexima votta a se fa dî",
        "it": "Per la centesima volta si fa raccontare"
      },
      {
        "testo": "E traversìe che ö l'ha dovûo passâ,",
        "it": "Le traversie che lui ha dovuto passare,"
      },
      {
        "testo": "A cadûta de Troia e a sta a sentí",
        "it": "La caduta di Troia, e sta a sentire"
      },
      {
        "testo": "Tûtte ste cuggie senza parpellâ",
        "it": "Tutte queste balle senza battere ciglio"
      },
      {
        "testo": "E a nö molla e ö fâ ansciâ comme ûn sciûscetto",
        "it": "E non molla, e lo fa ansimare come un mantice"
      },
      {
        "testo": "Scin ne-o momento de bûttase in letto.",
        "it": "Fino al momento di buttarsi a letto."
      },
      {
        "testo": "E poi quando pe forza a l'é obbligâ",
        "it": "E poi quando per forza è obbligata"
      },
      {
        "testo": "A separase dall'amato oggetto,",
        "it": "A separarsi dall'amato oggetto,"
      },
      {
        "testo": "A se særa in ta stanza e a stà a sospiâ,",
        "it": "Si chiude nella stanza e sta a sospirare,"
      },
      {
        "testo": "A fa de smanie senza andâ in sce ö letto,",
        "it": "Fa delle smanie senza andare a letto,"
      },
      {
        "testo": "E de votte pe pûeise, ûn pô sfogâ",
        "it": "E a volte per potersi un po' sfogare"
      },
      {
        "testo": "A se fa vegnî in scôsö o so Giulietto,",
        "it": "Si fa venire in grembo il suo Giulietto,"
      },
      {
        "testo": "E in mancanza de megio a se ö balûssa",
        "it": "E in mancanza di meglio se lo balocca"
      },
      {
        "testo": "A cavallo a-e zenöggie, a-o baxia, a-o sûssa.",
        "it": "A cavallo sulle ginocchia, lo bacia, lo succhia."
      },
      {
        "testo": "Mentre a stà lì a zemî pe a sô pascion",
        "it": "Mentre lei sta lì a gemere per la sua passione"
      },
      {
        "testo": "Che a pâ desfæta e che ghe molle a trippa;",
        "it": "Che sembra disfatta e che le si ammolli la trippa;"
      },
      {
        "testo": "Lasciæ lì sporta e færi in abbandon",
        "it": "Lasciati lì sporta e attrezzi in abbandono"
      },
      {
        "testo": "I mazzachen se stan a aççende a pippa,",
        "it": "I muratori se ne stanno ad accendersi la pipa,"
      },
      {
        "testo": "I sordatti nö pensan che â razion",
        "it": "I soldati non pensano che alla razione"
      },
      {
        "testo": "E van pe donne o a zûgâ â möra o a lippa,",
        "it": "E vanno a donne o a giocare alla morra o alla lippa,"
      },
      {
        "testo": "Se ghe molla in sce tûtto e se tralascia",
        "it": "Si si molla la presa su tutto e si tralascia"
      },
      {
        "testo": "E va tûtto a derûo, tûtto a bagascia",
        "it": "E va tutto in rovina, tutto a bagascia."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 3",
      "it": "Il patto di Giunone e Venere "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Mentre questo zû in tæra succedeiva",
        "it": "Mentre questo giù in terra succedeva"
      },
      {
        "testo": "Sciû de dato, gh'ëa a solita Giûnon",
        "it": "Su in alto, c'era la solita Giunone"
      },
      {
        "testo": "Intrïgante pe vizio, e che a veddeiva,",
        "it": "Intrigante per vizio, e che vedeva,"
      },
      {
        "testo": "Comme a forza de rodise, Didon",
        "it": "Come a forza di rodersi, Didone"
      },
      {
        "testo": "A ghe dava zà in cuggie e a nön aveiva",
        "it": "Era già rincoglionita e non aveva"
      },
      {
        "testo": "Ciû rispetto, ritegno e söggezion,",
        "it": "Più rispetto, ritegno e soggezione,"
      },
      {
        "testo": "Per cui, vista Ciprigna, a l'ha fermà",
        "it": "Per cui, vista Ciprigna (Venere), l'ha fermata"
      },
      {
        "testo": "E a gh'a dito in sce a faccia inveninâ:",
        "it": "E le ha detto in faccia invelenita:"
      },
      {
        "testo": "Amiæ ûn po che coraggio, amiæ che gloria,",
        "it": "\"Guardate un po' che coraggio, guardate che gloria,"
      },
      {
        "testo": "Mettise in döi, contro ûnn-a povia sciolla,",
        "it": "Mettersi in due, contro una povera sprovveduta,"
      },
      {
        "testo": "Tra tì e to figgio, poei cantà vittoria",
        "it": "Tra te e tuo figlio, poter cantar vittoria"
      },
      {
        "testo": "Vedendola che a cede e che a ghe molla;",
        "it": "Vedendola che cede e che gliela molla;"
      },
      {
        "testo": "Dîme ûn pittin, nö a vûei finî sta storia",
        "it": "Dimmi un po', non la vuoi finire questa storia"
      },
      {
        "testo": "De rompime delungo a casserolla?",
        "it": "Di rompermi in continuazione la casseruola?"
      },
      {
        "testo": "Invece de cæzâ, de puntiggiase,",
        "it": "Invece di bisticciare, di puntigliarsi,"
      },
      {
        "testo": "No sæ megio finila, e accomodase?",
        "it": "Non sarebbe meglio finirla, e accordarsi ?\""
      },
      {
        "testo": "Zà che lö se vœûan ben, perdingolinn-a,",
        "it": "Giacché loro si vogliono bene, perdiana,"
      },
      {
        "testo": "Femmo paxe e maiemoli ûnn-a votta;",
        "it": "Facciamo pace e maritiamoli una buona volta;"
      },
      {
        "testo": "Cose ö l’é stö sciûgase a pantalinn-a,",
        "it": "Cos'è questo scannarci a vicenda,"
      },
      {
        "testo": "A sta l'ûnn-a de dato e l'atra sotta?",
        "it": "A stare l'una addosso e l'altra sotto?"
      },
      {
        "testo": "Che ö to figgio ö se piggie a mæ reginn-a,",
        "it": "Che tuo figlio si prenda la mia regina,"
      },
      {
        "testo": "E nöi finiemo de stâ sempre in rotta,",
        "it": "E noi la finiamo di stare sempre in rotta,"
      },
      {
        "testo": "Ma invece tûtte due sæmo d'accordo",
        "it": "Ma invece tutte e due d'accordo"
      },
      {
        "testo": "A proteze sta gente e tiâla a bordo.",
        "it": "A proteggere questa gente e tirarla a bordo."
      },
      {
        "testo": "Ma Venere, se l'atra a l'ëa ruffiann-a",
        "it": "Ma Venere, se l'altra era ruffiana,"
      },
      {
        "testo": "A ghe pûeiva ancön dâ di pûnti a lë,",
        "it": "Poteva ancora darle dei punti,"
      },
      {
        "testo": "A l'ha ödûoû da stö fâ da bonnelann-a",
        "it": "Ha fiutato, da questo suo fare da bonacciona,"
      },
      {
        "testo": "Che a çercava de mettigheo derê,",
        "it": "Che cercava di metterglielo di dietro,"
      },
      {
        "testo": "Con portà dall'Italia all'Affricann-a",
        "it": "Col portare dall'Italia alla terra africana"
      },
      {
        "testo": "Tæra, l'imperio destinoû dao çê,",
        "it": "L'impero destinato dal cielo,"
      },
      {
        "testo": "A fa mostra de ninte e a ghe risponde",
        "it": "Fa finta di niente e le risponde"
      },
      {
        "testo": "C'ûnn-a çerta premûa che a te a confonde:",
        "it": "Con una certa premura che la confonde"
      },
      {
        "testo": "E l’é a mì, che ti ö dixi? eh figgia cäa,",
        "it": "Ed è a me che lo dici? Eh, cara ragazza,"
      },
      {
        "testo": "Besœgnieiva n'avei ciû de criterio",
        "it": "Bisognerebbe non aver più criterio"
      },
      {
        "testo": "Pe pœi dîte de nö, pe contrariâ",
        "it": "Per poterti dire di no, per contrariare"
      },
      {
        "testo": "A tì, tanto potente, ûn dexiderio,",
        "it": "A te, tanto potente, un desiderio,"
      },
      {
        "testo": "Quande questo ö se poesse realizzâ!",
        "it": "Quando questo si potesse realizzare!"
      },
      {
        "testo": "Ma mi temmo che ö sâ ûn affare serio",
        "it": "Ma io temo che sarà un affare serio,"
      },
      {
        "testo": "E che tanto ö destin, che to marîo",
        "it": "E che tanto il destino quanto tuo marito"
      },
      {
        "testo": "No intendan mangiâ de repentîo",
        "it": "Non intendano pentirsi."
      },
      {
        "testo": "Aôa poi se te riesce a mette in atto",
        "it": "Ora poi, se ti riesce di mettere in atto"
      },
      {
        "testo": "E to viste e se Giove ö te ghe ten,",
        "it": "Le tue mire, e se Giove ti sostiene,"
      },
      {
        "testo": "Prefutti i to piaxei, che me ne batto",
        "it": "Soddisfa i tuoi piaceri, ché me ne batto"
      },
      {
        "testo": "A sanfornia di Tiri e di Troien,",
        "it": "La sanfornia di Tiro e dei Troiani,"
      },
      {
        "testo": "Ma d'in cangio son pronta a fâ contratto",
        "it": "Ma in cambio son pronta a fare il contratto"
      },
      {
        "testo": "Perché a cosa a me cimbra e a me cönven,",
        "it": "Perché la cosa mi garba e mi conviene,"
      },
      {
        "testo": "Se to maio ö gh'allogia e ö beîve â sûcca",
        "it": "Se tuo marito ci sta e se la beve,"
      },
      {
        "testo": "Per mì, son chi comme ö bambin de Lûcca.",
        "it": "Per me, son qui come il bambino di Lucca."
      },
      {
        "testo": "E mì, dixe Giûnon, sô zâ a manea",
        "it": "E io, dice Giunone, so già la maniera"
      },
      {
        "testo": "Dö sciûgaghe ö pevë perché o ghe annoisce,",
        "it": "Di circuirlo perché ci annuisca,"
      },
      {
        "testo": "Aoa sta ûn pô a sentî se quest'idea",
        "it": "Ora sta' un po' a sentire se quest'idea"
      },
      {
        "testo": "A te vâ pe ö tô verso e a te finisce:",
        "it": "Va per il tuo verso e ti convince:"
      },
      {
        "testo": "Ho savûo che a Reginn-a insemme a Enea",
        "it": "Ho saputo che la Regina insieme a Enea,"
      },
      {
        "testo": "Appenn-a che doman se ricciarisce,",
        "it": "Appena domani si rischiara,"
      },
      {
        "testo": "Söttö ö pretesto da partîa de caccia,",
        "it": "Sotto il pretesto della partita di caccia,"
      },
      {
        "testo": "Sciortîan d'in casa pe andâ in ta maccia.",
        "it": "Usciranno di casa per andare nella macchia."
      },
      {
        "testo": "Mia che bell'occaxion! Quande e sô genti",
        "it": "Guarda che bella occasione! Quando le loro genti,"
      },
      {
        "testo": "Cöi cavalli, cöi chen, son tûtte in gîo,",
        "it": "Coi cavalli e coi cani, sono tutte in giro,"
      },
      {
        "testo": "Ghe scadenn-o ädreitûa dai quattrö venti",
        "it": "Gli scateno addirittura dai quattro venti"
      },
      {
        "testo": "Lampi, tröin, sacrilegi, e te gh'asbrîo",
        "it": "Lampi, tuoni, sacrilegi, e ti ci scaglio"
      },
      {
        "testo": "Tanta gragnœûa pe ö cû, tanti aççidenti,",
        "it": "Tanta grandine sul culo, tanti accidenti,"
      },
      {
        "testo": "Che l'inaio, l'inspaximo, î regîo",
        "it": "Che li stordisco, li faccio spasimare, li raggiro,"
      },
      {
        "testo": "E te i fässo scappâ che pân paghæ,",
        "it": "E te li faccio scappare che paiono pagati,"
      },
      {
        "testo": "Fûti, giani, bexinsci, alleitughæ.",
        "it": "Sbiancati, gialli, mezzi morti, appassiti come lattughe."
      },
      {
        "testo": "E in tö mezo a stö impotto, a sta derotta,",
        "it": "E in mezzo a questo pandemonio, a questo fuggifuggi,"
      },
      {
        "testo": "Enea ö resta lì sölö cön Didon",
        "it": "Enea resta lì solo con Didone,"
      },
      {
        "testo": "Che ö se a porta a assustâse in t'ûnn-a grotta",
        "it": "Che se la porta a ripararsi in una grotta"
      },
      {
        "testo": "Pe lasciâ desgranâ stö lavasson,",
        "it": "Per lasciar sgranare quest'acquazzone,"
      },
      {
        "testo": "E perdìe tûtto zû, quand'en lì sotta.",
        "it": "E perdio, vien giù tutto, quando sono lì sotto."
      },
      {
        "testo": "Benché ö seggie ûn paolotto e ûn bellinon,",
        "it": "Benché sia un bigotto e un belinone,"
      },
      {
        "testo": "Mi me lascio taggiâ scinn-a i bricocoli",
        "it": "Io mi lascio tagliare persino le albicocche"
      },
      {
        "testo": "Se ö no s'ascada e ö no ghe dà sciû ai broccoli.",
        "it": "Se non si scalda e non se la tromba."
      },
      {
        "testo": "E Venere che a l'ëa ciû che latinn-a",
        "it": "E Venere, che era più che aperta"
      },
      {
        "testo": "In fæto de morale e d'opinion,",
        "it": "In fatto di morale e d'opinione,"
      },
      {
        "testo": "E che a l'ëse larghea de pantalinn-a",
        "it": "E per cui l'essere generosa di patatina"
      },
      {
        "testo": "A l'ëa stæta de lungo a sô pascion,",
        "it": "Era sempre stata la sua passione,"
      },
      {
        "testo": "A l'ha fæto ûn sorriso, ûnn-a bocchinn-a",
        "it": "Ha fatto un sorriso, una bocchina"
      },
      {
        "testo": "Che a se pueiva piggiâ pe ûn'adexion,",
        "it": "Che si poteva prendere per un'adesione,"
      },
      {
        "testo": "Sentindo che poi poi, tûtto st'impiccio",
        "it": "Sentendo che in fin dei conti tutto questo impiccio"
      },
      {
        "testo": "Ö doveiva fini con fa garìccio.",
        "it": "Doveva finire con farsi una scopata."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 4",
      "it": "La caccia "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Fava giorno e fra tanto e fra l'æxia",
        "it": "Faceva giorno e frattanto, nell'aria fresca,"
      },
      {
        "testo": "Tra ö cæo-scûo dö mattin s'ëa radûnâ",
        "it": "Tra il chiaroscuro del mattino s'era radunata"
      },
      {
        "testo": "Da ûnn-a parte dall'âtra a compagnia",
        "it": "Da una parte e dall'altra la compagnia"
      },
      {
        "testo": "De cacciœû che a l'ëa stæta scritturâ,",
        "it": "Di cacciatori che era stata ingaggiata,"
      },
      {
        "testo": "Pe dâ lûstro e importanza a sta partia",
        "it": "Per dar lustro e importanza a questa partita"
      },
      {
        "testo": "Da Didon per l'amante architettâ,",
        "it": " Da Didone per l'amante architettata,"
      },
      {
        "testo": "Pe amiâ ûn pittinin se caxo desse",
        "it": "Per vedere un pochino se il caso desse"
      },
      {
        "testo": "Che stö babano ö se despuntelesse.",
        "it": "Che questo babbeo si lasciasse andare."
      },
      {
        "testo": "Ghe n'ëa de tûtti i cöi, d'ogni costûmme,",
        "it": "Ce n'erano di tutti i colori, d'ogni costume,"
      },
      {
        "testo": "Con de giacche in fûstagno e de velûo,",
        "it": "Con giacche di fustagno e di velluto,"
      },
      {
        "testo": "Ghette e scarpe co-e sœûe da passâ ûn sciûmme",
        "it": "Ghette e scarpe con le suole da guadare un fiume,"
      },
      {
        "testo": "Ö cappello in sce l'orsa e rebattûo,",
        "it": "Il cappello di traverso e ribattuto,"
      },
      {
        "testo": "Fæto a strassa, a coppetto, a moccalûmme,",
        "it": "Fatto a straccio, a coppetto, a cono,"
      },
      {
        "testo": "Con de faccie da bûllo, ö sguardo dûo,",
        "it": "Con facce da bullo, lo sguardo duro,"
      },
      {
        "testo": "Camixia de flanella e pippa ai denti,",
        "it": "Camicia di flanella e pipa ai denti,"
      },
      {
        "testo": "Mösse in bocca pe paole e sacramenti.",
        "it": "In bocca musse, parolacce e bestemmie."
      },
      {
        "testo": "Ëan armæ comme sbiri e co-a ventrea",
        "it": "Erano armati come sbirri, e con la ventriera"
      },
      {
        "testo": "Insaurâ de ballin, balle e strexia,",
        "it": "Infarcita di pallini, pallottole e migliarini,"
      },
      {
        "testo": "Scciœûppi d'ögni façon, d'ogni manea,",
        "it": "Schioppi d'ogni foggia, d'ogni maniera,"
      },
      {
        "testo": "Armi de precision, de fantaxia,",
        "it": "Armi di precisione, di fantasia,"
      },
      {
        "testo": "Chen cöi fianchi ridûti a rastellea,",
        "it": "Cani coi fianchi ridotti a rastrelliera,"
      },
      {
        "testo": "Che paivan l'esprescion da carestia",
        "it": "Che parevano l'espressione della carestia"
      },
      {
        "testo": "E che avievan sentîo l'orma de fregögge",
        "it": "E che avevano fiutato l'orma delle briciole,"
      },
      {
        "testo": "Insomma chen che ghe fûmava e cögge.",
        "it": "Insomma cani a cui fumavano le palle."
      },
      {
        "testo": "Selloû tûtto de nœûvo e in punto d'öa",
        "it": "Sellato tutto a nuovo e puntuale,"
      },
      {
        "testo": "C'ûnn-a gualdrappa recamâ d'örpello,",
        "it": "Con una gualdrappa ricamata d'orpello,"
      },
      {
        "testo": "Aspëtando l'arrivo da scignöa",
        "it": "Aspettando l'arrivo della signora"
      },
      {
        "testo": "Gh'ëa ûn cavallo da corsa dö Portello",
        "it": "C'era un cavallo da corsa del Portello"
      },
      {
        "testo": "Che ö sappettava e ö remenava a cöa",
        "it": "Che scalpitava e dimenava la coda"
      },
      {
        "testo": "E ö fava schitti comme ö fosse noello,",
        "it": "E faceva scatti come se fosse giovane,"
      },
      {
        "testo": "E ö sparava michette ogni pittin",
        "it": "E  sparava michette ogni momento"
      },
      {
        "testo": "Pe fâ vedde che ö l'ëa de sangue fin.",
        "it": "Per far vedere che era di sangue fino."
      },
      {
        "testo": "Finalmente Didon, tûtta schittetti",
        "it": "Finalmente Didone, tutta vezzi,"
      },
      {
        "testo": "Doppo d'ësise fæta ûn pô aspetâ,",
        "it": "Dopo essersi fatta un po' aspettare,"
      },
      {
        "testo": "A ven zù accompagnâ dai sô moretti",
        "it": "Viene giù accompagnata dai suoi moretti"
      },
      {
        "testo": "(Ûnn-a Corte in sce l'atto improvvisâ)",
        "it": "(Una Corte improvvisata sul momento),"
      },
      {
        "testo": "Ben vestia, senza aggibbi né frexetti,",
        "it": "Ben vestita, senza aggeggi né fronzoli,"
      },
      {
        "testo": "Elegante, senz'ëse esagerâ,",
        "it": "Elegante, senza essere esagerata,"
      },
      {
        "testo": "E c'ûnn-a ruffianata de bön gûsto",
        "it": "E con una civetteria di buon gusto"
      },
      {
        "testo": "Che senza xanni a ghe cimbrava a-o fûsto",
        "it": "Che senza smancerie garbava all'uomo."
      },
      {
        "testo": "Roba lunga all'ammazzone, trovata,",
        "it": "Abito lungo all'amazzone, una trovata,"
      },
      {
        "testo": "Colpo de genio da Rolandi Ricci,",
        "it": "Colpo di genio da Rolandi Ricci,"
      },
      {
        "testo": "Braghe lunghe co-e staffe, ûnn-a sciûgata",
        "it": "Pantaloni lunghi con le staffe, uno schianto"
      },
      {
        "testo": "(Per chi ë ûn pô dilettante de garicci)",
        "it": "(Per chi è un po' appassionato di tresche),"
      },
      {
        "testo": "Ûn bello cilindretto de Demata,",
        "it": "Un bel cilindretto da Demata,"
      },
      {
        "testo": "Misso de gaibo, pe fâ vedde i ricci",
        "it": "Messo con garbo, per far vedere i riccioli,"
      },
      {
        "testo": "Pe tûtt'arma ûn fôettin cö pommo d'ôu",
        "it": "Per tutta arma un frustino col pomo d'oro"
      },
      {
        "testo": "Dö genere avvoxioû che caga ö môu.",
        "it": "Del genere rinomato, che caga il moro."
      },
      {
        "testo": "Ö Giûlin a cavallo a ûn azenetto",
        "it": "Iulo a cavallo su un asinello"
      },
      {
        "testo": "(A bell'â megio, ö commensava a staghe",
        "it": "(Alla bell'e meglio, cominciava a starci,"
      },
      {
        "testo": "Benché in fæto ö perdesse ö mandilletto",
        "it": "Benché di fatto perdesse il fazzolettino"
      },
      {
        "testo": "E ö se fesse anc'ûn pô a cacca in te braghe)",
        "it": "E si facesse anche un po' la cacca nelle brache)"
      },
      {
        "testo": "Ö va avanti trottando, c'ûn picchetto",
        "it": "Va avanti trottando, con un picchetto"
      },
      {
        "testo": "De cavalli troien, farsï de ciaghe,",
        "it": "Di cavalli troiani, infarciti di piaghe,"
      },
      {
        "testo": "Mentre Enea, mûssezzando e in pöntö d'öa",
        "it": "Mentre Enea, pavoneggiante e puntuale,"
      },
      {
        "testo": "Ö cavalca, ö fa a rœûa presso a scignöa",
        "it": "Cavalca, fa la ruota presso la signora."
      },
      {
        "testo": "Comme Rosci ö Nerön, se ve sovven,",
        "it": "Come Rossi nel Nerone, se ricordate"
      },
      {
        "testo": "(Nö sön stôie, perdìe, poi tanto vegie)",
        "it": "(Non sono storie, perdio, poi tanto vecchie),"
      },
      {
        "testo": "Cöi œûggi abborsetæ, baffi senen",
        "it": "Con gli occhi imborsati, i baffi da vecchio,"
      },
      {
        "testo": "E ö capello tioû zû scinn-a in sce œgie,",
        "it": "E il cappello tirato giù fin sulle orecchie,"
      },
      {
        "testo": "Ö l'andava a cavallo ammiando ben",
        "it": "Andava a cavallo guardandosi bene attorno"
      },
      {
        "testo": "(Ö ghe paiva ciantoû c'ûn pâ de negie)",
        "it": "(Sembrava impalato come su due stampelle)"
      },
      {
        "testo": "De nö scomponn-e e nö mostrâ a perrûcca",
        "it": "Per non scomporsi e non mostrare la parrucca"
      },
      {
        "testo": "Che da gran tempo a croviva a sûcca;",
        "it": "Che da gran tempo gli copriva la zucca;"
      },
      {
        "testo": "O comme Sanfiorenzo ûn di ciû belli",
        "it": "O come Sanfiorenzo, uno dei più belli"
      },
      {
        "testo": "Nostri meistri de piano e di ciû gnecchi,",
        "it": "Nostri maestri di piano e dei più fiacchi"
      },
      {
        "testo": "Ö gïava all'Accascœûa fra i arboscelli,",
        "it": "Che girava all'Acquasola fra gli alberelli,"
      },
      {
        "testo": "Baffi â chineise e zingomi fistecchi,",
        "it": "Baffi alla cinese e zigomi sporgenti,"
      },
      {
        "testo": "Inforcando ûn cavallo de Bûsnelli",
        "it": "Inforcando un cavallo di Busnelli"
      },
      {
        "testo": "Co-e sô gambe sottî, comme döi stecchi,",
        "it": "Con le sue gambe sottili, come due stecchi,"
      },
      {
        "testo": "E ö fava cazze tûtte e serve e e Mamme",
        "it": "E faceva cadere tutte le serve e le mamme"
      },
      {
        "testo": "Comme e nöxe camöæ cazzan da-e ramme.",
        "it": "Come le noci bacate cadono dai rami."
      },
      {
        "testo": "Missi tûtti in cammin, van sciû pë maccie",
        "it": "Messisi tutti in cammino, vanno su per le macchie,"
      },
      {
        "testo": "Tramezo ai boschi sorva e rocche e zinn-e,",
        "it": "In mezzo ai boschi, sopra rupi e cime,"
      },
      {
        "testo": "Ciû che de belve seguitando e traccie",
        "it": "Più che di belve, seguendo le tracce"
      },
      {
        "testo": "Dö stûfoû de crastön co-e patatinn-e",
        "it": "Dello stufato di castrato con le patatine,"
      },
      {
        "testo": "Che ö l'é ö scopo e a raxon de tûtte e caccie,",
        "it": "Che è lo scopo e la ragione di tutte le cacce,"
      },
      {
        "testo": "Comme l'é Pasqua pë e leitûghe pinn-e,",
        "it": "Come Pasqua è per le lattughe ripiene,"
      },
      {
        "testo": "E nö gh'é bön caccioû che ö ghe demorde,",
        "it": "E non c'è buon cacciatore che ci rinunci,"
      },
      {
        "testo": "Che ö e passe sottobanca e ö se ne scorde.",
        "it": "Che se la lasci sfuggire e se ne scordi."
      },
      {
        "testo": "Ö Giulin figgio solo, e comme tale",
        "it": "Iulo, figlio unico, e come tale"
      },
      {
        "testo": "Mæducoû, bollicugge impertinente",
        "it": "Maleducato, coglioncello impertinente,"
      },
      {
        "testo": "Ö fava ûn sciato che nö gh'ëa l'eguale",
        "it": "Faceva un chiasso che non aveva l'eguale"
      },
      {
        "testo": "Galoppando in ça e in lâ continuamente,",
        "it": "Galoppando in qua e in là di continuo,"
      },
      {
        "testo": "Tiando botte co-a bocca a ûn ideale",
        "it": "Tirando colpi con la bocca a un'ideale"
      },
      {
        "testo": "Bestia feroce e assimentando a gente",
        "it": "Bestia feroce, e molestando la gente,"
      },
      {
        "testo": "O faxendo scentâ, con ste sô mosse",
        "it": "O facendo scappare, con queste sue musse,"
      },
      {
        "testo": "A vea caccia, accordòu che ghe ne fosse.",
        "it": "La vera selvaggina — ammesso che ce ne fosse."
      },
      {
        "testo": "Tûtt'assemme s'annûvia e se fâ scûo",
        "it": "Tutt'a un tratto si annuvola e si fa scuro"
      },
      {
        "testo": "E se sente tronâ d'in löntananza,",
        "it": "E si sente tuonare in lontananza,"
      },
      {
        "testo": "Poi de stisse ciû larghe ancön che ûn scûo",
        "it": "Poi gocce più larghe ancora d'uno scudo"
      },
      {
        "testo": "Fan zà nasce ûn pittin de titûbanza,",
        "it": "Fanno già nascere un po' di titubanza,"
      },
      {
        "testo": "Quindi, sæte, gragnœa, ægûa a derûo,",
        "it": "Quindi saette, grandine, acqua a dirotto,"
      },
      {
        "testo": "Te manda a fâ fötte l'ordinanza",
        "it": "Manda a farsi fottere l'ordinanza"
      },
      {
        "testo": "E scappan tûtti a rêo, che pân paghæ",
        "it": "E scappano tutti in abbondanza, che paiono pagati,"
      },
      {
        "testo": "Söttö a rocche e cascinn-e, e in ti paggiæ.",
        "it": "Sotto le rocce e le cascine, e nei pagliai."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 5",
      "it": "La grotta"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "In te questö bordello e sta derotta",
        "it": "In questo bordello e in questa dirotta"
      },
      {
        "testo": "Soli Enea con Didon, restan lì a torse;",
        "it": "Soli Enea con Didone, restano lì a inzupparsi;"
      },
      {
        "testo": "Senza ûn erbo, ûn paggiâ da andaghe sotta,",
        "it": "Senza un albero, un pagliaio da andarci sotto,"
      },
      {
        "testo": "Senza pægûi e ädreitûa senza risorse;",
        "it": "Senza ombrelli e addirittura senza risorse;"
      },
      {
        "testo": "Tûtt'assemme se gîan, te lì ûnn-a grotta,",
        "it": "Tutt'a un tratto si girano, ed ecco lì una grotta,"
      },
      {
        "testo": "E dö mæximo asbrîo, senza stä in forse",
        "it": "E col medesimo slancio, senza stare in forse"
      },
      {
        "testo": "Senza pûia d'incontrâ di örsci e di loî",
        "it": "Senza paura di incontrare degli orsi e dei lupi"
      },
      {
        "testo": "Se ghe fûttan de söttö tutti doî.",
        "it": "Ci si ficcano sotto tutti e due."
      },
      {
        "testo": "Aoa chi vegniæ ö bon, vegnieiva ö spesso,",
        "it": "Ora qui verrebbe il bello, verrebbe la sostanza,"
      },
      {
        "testo": "Se ve vuesse contâ cose han fottûo,",
        "it": "Se vi volessi raccontare cosa hanno fottuto,"
      },
      {
        "testo": "Ma l'é megio passaghe pe refesso",
        "it": "Ma è meglio passarci di traverso,"
      },
      {
        "testo": "E ciuttosto peccâ ûn pittin de scûo",
        "it": "E piuttosto peccare un pochino di oscurità"
      },
      {
        "testo": "Che gh'é de côse che ûn bambin de gesso,",
        "it": "Perché ci sono cose che un bambino di gesso,"
      },
      {
        "testo": "Ö paisan ciû tanardo e ciû tambûo",
        "it": "Il contadino più tanardo e più tamburo"
      },
      {
        "testo": "Ö ghe trœuva d'istinto ö senso e ö fï",
        "it": "Ci trova d'istinto il senso e il filo "
      },
      {
        "testo": "Senza mette i puntin proprio in sce l'i.",
        "it": "Senza mettere i puntini proprio sulle i."
      },
      {
        "testo": "De ste notte segrette e appascionæ",
        "it": "Di queste notti segrete e appassionate"
      },
      {
        "testo": "Fæte in sprescia, in desaxio in strangogion",
        "it": "Fatte in fretta, nel disagio, con voracità"
      },
      {
        "testo": "Ma assavûie da atrettanti valûtæ",
        "it": "Ma assaporate e da altrettanti valutate "
      },
      {
        "testo": "Quanto meno gh'ëa a calma e a riflescion,",
        "it": "Quanto meno c'erano calma e riflessione,"
      },
      {
        "testo": "Testimoni discreti e smaliziæ",
        "it": "Testimoni discreti e smaliziati"
      },
      {
        "testo": "Nö sön stæti che l'ægua ö vento e ö tron",
        "it": "Non sono stati che l'acqua, il vento e il tuono"
      },
      {
        "testo": "Che in tö mentre che lö ghe davan dentro",
        "it": "Che nel mentre che loro ci davano dentro"
      },
      {
        "testo": "De fœûa ghe fâvan l'accömpagnamento.",
        "it": "Di fuori facevano loro l'accompagnamento."
      },
      {
        "testo": "Miæ che brûtto destin! de sta luçìa",
        "it": "Guardate che brutto destino! di questa susanna"
      },
      {
        "testo": "Che da reginn-a a l'ha deciso a sorte,",
        "it": "Che della regina ha deciso la sorte,"
      },
      {
        "testo": "Se commensa a desghœggie a litanìa",
        "it": "Si comincia a sbrogliare la litania "
      },
      {
        "testo": "De sô tante disgrazie e da sô morte",
        "it": "Delle sue tante disgrazie e della sua morte"
      },
      {
        "testo": "Sätôu zû ô primmo schæn con allegrìa",
        "it": "Saltato giù il primo scalino con allegria"
      },
      {
        "testo": "A scuggia zû a derûa sempre ciû forte",
        "it": "Scivola giù a precipizio sempre più forte"
      },
      {
        "testo": "Che a ve dà dö cû in ciappa e comme ben",
        "it": "Che ci dà di culo su una lastra eccome bene"
      },
      {
        "testo": "E a s'immerda ädreitûa comme ûnn-a pûtten.",
        "it": "E si smerda addirittura come una puttana."
      },
      {
        "testo": "Invece de salvâ qualche apparenza",
        "it": "Invece di salvare qualche apparenza"
      },
      {
        "testo": "E de demöase nö möstrandö a cea",
        "it": "E di spassarsela non mostrando la faccia"
      },
      {
        "testo": "A l'aumenta d'audaxia e d'impûdenza",
        "it": "Aumenta di audacia e di impudenza"
      },
      {
        "testo": "Finn-a a fäse ciammâ moggê d'Enea,",
        "it": "Fino a farsi chiamare moglie di Enea,"
      },
      {
        "testo": "E a ghe a ciocca ädreitûa senza decenza",
        "it": "E gliela ciocca addirittura senza decenza"
      },
      {
        "testo": "Nö savendo tegnî moddo e manëa",
        "it": "Non sapendo tenere modo e maniera "
      },
      {
        "testo": "Mentre che ö cæto, che ö nö vœû de cuggie",
        "it": "Mentre il pettegolezzo, che non vuole balle"
      },
      {
        "testo": "Ö commensa a adesciase; ö frizze, ö buggie.",
        "it": "Comincia a svegliarsi; frigge, bolle"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 6",
      "it": "La Fama e Iarba "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "De tûtte e malazioin, tûtti i malanni",
        "it": "Di tutte le cattive azioni, di tutti i malanni"
      },
      {
        "testo": "Ch'emmo avûo da-o peccôu de nostra moæ,",
        "it": "Che abbiamo avuto dal peccato di nostra madre,"
      },
      {
        "testo": "Ö ciû che ö n'ha procûou lastime e danni",
        "it": "Quello che ci ha procurato più lamenti e danni"
      },
      {
        "testo": "E che ö cöre con ciû velocitæ,",
        "it": "E che corre con più velocità,"
      },
      {
        "testo": "Voî porriesci campâ çento mill'anni",
        "it": "Voi potreste campare centomila anni"
      },
      {
        "testo": "Acquistâ l'esperienza a tonnellæ,",
        "it": "Acquistare esperienza a tonnellate,"
      },
      {
        "testo": "Ma doviesci pe forza ammette ö fæto",
        "it": "Ma dovreste per forza ammettere il fatto"
      },
      {
        "testo": "Che no gh'é mal'azion pezo che ö cæto",
        "it": "Che non c'è mal'azione peggiore del pettegolezzo"
      },
      {
        "testo": "Quando ö nasce ö l’é quæxi ciû piccin",
        "it": "Quando nasce è quasi più piccolo"
      },
      {
        "testo": "Che ûn microbo de Koche e compagnia,",
        "it": "Di un microbo di Koch e compagnia,"
      },
      {
        "testo": "In sce e primme ö fâ ö morto e ciancianin",
        "it": "Sulle prime fa il morto e pian pianino"
      },
      {
        "testo": "Ö l'aumenta in volûmme e vigoria,",
        "it": "Aumenta di volume e vigoria,"
      },
      {
        "testo": "Poi ö s'agita, ö schitta, ö fa cammin",
        "it": "Poi si agita, scatta, fa il cammino"
      },
      {
        "testo": "E ciû ö cöre, ö s'ingroscia, ö sciûscia, ö cria,",
        "it": "E più corre, si ingrossa, soffia, grida,"
      },
      {
        "testo": "Ö diventa gigante, ö tocca ö çê",
        "it": "Diventa gigante, tocca il cielo"
      },
      {
        "testo": "Dappertûtto ö l'agguanta e ö mette pê;",
        "it": "Dappertutto afferra e mette piede;"
      },
      {
        "testo": "Nö se riesce a sô forma a definî",
        "it": "Non si riesce la sua forma a definire"
      },
      {
        "testo": "Perché ö l’é ûn pô de tûtto. Ö pä ûn oxello",
        "it": "Perché è un po' di tutto. Sembra un uccello"
      },
      {
        "testo": "Da-e so äe che ghe servan pe corrî,",
        "it": "Dalle sue ali che gli servono per correre,"
      },
      {
        "testo": "Mentre in cangio ö l'ha ûn êuggio pe cavello",
        "it": "Mentre in cambio ha un occhio per capello"
      },
      {
        "testo": "E mille oëgie appuntæ pe sta a sentî",
        "it": "E mille orecchie appuntate per stare a sentire"
      },
      {
        "testo": "Cose dixan apprêuvo a questo e quello,",
        "it": "Cosa dicono dietro a questo e a quello,"
      },
      {
        "testo": "Mille bocche lì pronte a riportâ,",
        "it": "Mille bocche lì pronte a riportare,"
      },
      {
        "testo": "Pe dì e cose a traverso e a ezagerâ.",
        "it": "Per dire le cose travisate e a esagerare."
      },
      {
        "testo": "Nêutte e giorno ö va in gîo sensa fermâse,",
        "it": "Notte e giorno va in giro senza fermarsi,"
      },
      {
        "testo": "Ö nö dorme, ö nö quëta, ö no se stanca,",
        "it": "Non dorme, non si quieta, non si stanca,"
      },
      {
        "testo": "In sce ë töri, in sce i teîti ô va a pôsase",
        "it": "Sulle torri, sui tetti va a posarsi"
      },
      {
        "testo": "E se ö vedde ûn pacciûgo ö te l'abbranca",
        "it": "E se vede un pacciugo lo abbranca"
      },
      {
        "testo": "E ö ghe sciûscia in manea da spolmonase",
        "it": "E ci soffia sopra in modo da spolmonarsi"
      },
      {
        "testo": "Che ûn bædin che ö no vaiva ûnn-a palanca",
        "it": "Che una bazzecola che non valeva una palanca"
      },
      {
        "testo": "Ö diventa unn-a mössa ûnn-a cagnara",
        "it": "Diventa una mussa, una cagnara"
      },
      {
        "testo": "Che chi a töcca ö s'immerda e ö se bûzara.",
        "it": "Che chi la tocca si smerda e si rovina."
      },
      {
        "testo": "Puei pensâ che pittâ pè sto marviaggio",
        "it": "Puoi immaginare che scena per questo malvagio"
      },
      {
        "testo": "Quando ö l'ha indovinôu quant'ëa successo,",
        "it": "Quando ha indovinato quant'era successo,"
      },
      {
        "testo": "Senza sta a zinzannä ö se misso in viaggio",
        "it": "Senza star a gingillarsi si è messo in viaggio"
      },
      {
        "testo": "E pe drîto, pe inverso e pe refesso,",
        "it": "E per dritto, per rovescio e per traverso,"
      },
      {
        "testo": "Azzunzendo in ça e in là qualche retaggio,",
        "it": "Aggiungendo qua e là qualche ritaglio,"
      },
      {
        "testo": "Rinforzando dö cô se gh'ëa dö spesso,",
        "it": "Calcando la tinta dove c'era sostanza,"
      },
      {
        "testo": "Ö se misso a cantala in tûtti i toin",
        "it": "Si è messo a cantarla in tutti i toni"
      },
      {
        "testo": "C'ûnn-a cöa de commenti e spiegazioin",
        "it": "Con una coda di commenti e spiegazioni."
      },
      {
        "testo": "Ö dixeiva: che ûn Tizio ûn farabûtto,",
        "it": "Diceva: che un Tizio, un farabutto,"
      },
      {
        "testo": "Ûn Troian senza scarpe, ammiseiôu,",
        "it": "Un Troiano senza scarpe, ridotto in miseria,"
      },
      {
        "testo": "Che pe ûn adæto ö s'accattava tûtto,",
        "it": "Che per un nonnulla te lo compravi tutto,"
      },
      {
        "testo": "L'ëa da poco in Cartagine arrivôu,",
        "it": "Era da poco arrivato in Cartagine,"
      },
      {
        "testo": "E Didon desprexando ö graddo, ö lûtto,",
        "it": "E Didone, disprezzando il suo grado e il lutto,"
      },
      {
        "testo": "A l'aveiva in sce l'atto appilotôu",
        "it": "Lo aveva su due piedi accalappiato,"
      },
      {
        "testo": "Ch'ëan zà döi rösci in t'ûnn-a scorza d'êuvo",
        "it": "Che erano già due tuorli in un guscio d'uovo,"
      },
      {
        "testo": "E che ö batoso ö ghe mangiava apprêuvo;",
        "it": "E che il maranza se ne approfittava;"
      },
      {
        "testo": "Che se fava gariccio a tûtt'andâ",
        "it": "Che si trombava a tutto andare"
      },
      {
        "testo": "Cö pretesto ch'ëan zà maio e moggiê",
        "it": "Col pretesto che erano già marito e moglie"
      },
      {
        "testo": "Che ö l'ëa ûn sciallo continûo, ûn beguddâ",
        "it": "Che era un godimento continuo, un bagordare"
      },
      {
        "testo": "Giorno e nêutte zû a reo, co-e man, co-i pë,",
        "it": "Giorno e notte giù a casaccio, con le mani, coi piedi,"
      },
      {
        "testo": "Che i dovei d'unn-a testa coronnâ,",
        "it": "Che i doveri di una testa coronata,"
      },
      {
        "testo": "Se compivan pe-i letti e i canapë,",
        "it": "Si compivano per i letti e per i canapé,"
      },
      {
        "testo": "Che gh'ëa in corte ûnn-a vea casa dö Leccia",
        "it": "Che c'era in corte una vera \"casa di tolleranza\""
      },
      {
        "testo": "Dove futte chi vœû, beccia chi beccia.",
        "it": "Dove fotte chi vuole, e tromba chi tromba."
      },
      {
        "testo": "Queste cose e tante âtre ciû granîe,",
        "it": "Queste cose e tante altre più pesanti,"
      },
      {
        "testo": "Ö sparzeiva in ça e in lâ questa canaggia",
        "it": "Spargeva di qua e di là questa canaglia"
      },
      {
        "testo": "Che pe forza re Jarba ö l'ha sentîe",
        "it": "Che per forza re Iarba le ha sentite"
      },
      {
        "testo": "Nei commenti da corte e da marmaggia;",
        "it": "Nei commenti della corte e della marmaglia;"
      },
      {
        "testo": "Ve lascio immaginâ che litanîe",
        "it": "Vi lascio immaginare che litanie"
      },
      {
        "testo": "Ö s'é misso a tiâ zû, neigro dä raggia,",
        "it": "Si è messo a tirare giù, nero dalla rabbia,"
      },
      {
        "testo": "Tanto ciû pe-o brûxö d'ëse reietto",
        "it": "Tanto più per il bruciore di essere stato respinto"
      },
      {
        "testo": "Dâ reginn-a Didon, pe stö soggetto.",
        "it": "Dalla regina Didone, per sto soggetto."
      },
      {
        "testo": "Questo re, che pe-o resto l'ëa ûn bastardo",
        "it": "Questo re, che per il resto era un bastardo"
      },
      {
        "testo": "De quello lescaiêu de sommo Giove,",
        "it": "Di quel puttaniere del sommo Giove,"
      },
      {
        "testo": "Ö l'ëa pe stö sô poæ, pin de riguardo",
        "it": "Era per questo suo padre, pieno di riguardo "
      },
      {
        "testo": "Erzendoghe capelle in reggia e altrove",
        "it": "Erigendogli cappelle nella reggia e altrove"
      },
      {
        "testo": "E offrighe di bêu, c'ûn dîo de lardo;",
        "it": "E offrendogli dei buoi, con un dito di lardo;"
      },
      {
        "testo": "Savûa sta cosa ö va in parrocchia, dove",
        "it": "Saputa questa cosa va in parrocchia, dove"
      },
      {
        "testo": "C'ûnna voxe tra a fûtta e tra a preghiera",
        "it": "Con una voce tra la rabbia e la preghiera"
      },
      {
        "testo": "Ö se mette a tiâ zû sta tiritera:",
        "it": "Si mette a tirare giù questa tiritera:"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 7",
      "it": "Giove manda Mercurio "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "A-o bellin dove semmo ? e che manea",
        "it": "\"Cribbio, a che punto siamo arrivati? E che maniera"
      },
      {
        "testo": "A l'é questa, perdîe, de vûei trattâ?",
        "it": "È questa, perdio, di voler trattare?"
      },
      {
        "testo": "No gh'é ciû né olocausti, né preghëa",
        "it": "Non ci sono più né olocausti, né preghiere"
      },
      {
        "testo": "Che ve possan costrenze a raxonnâ?",
        "it": "Che vi possano costringere a ragionare?"
      },
      {
        "testo": "Mi me töccö pe vedde se a l'é vëa,",
        "it": "Io mi tocco per vedere se è vera,"
      },
      {
        "testo": "Ma mi ho pûia che se zêughe a cûggionâ,",
        "it": "Ma io ho paura che si giochi a coglionare,"
      },
      {
        "testo": "Stæ in çe solo a grattave ûn pô e zenuggie?",
        "it": "State in cielo solo a grattarvi un po' le ginocchia?"
      },
      {
        "testo": "E e sæte, i lampi e i troin, sön tûtte cuggie?",
        "it": "E le saette, i lampi e i tuoni, sono tutte balle?\""
      },
      {
        "testo": "Ûn ciappetto vegnûo de chì sâ dove,",
        "it": "Una puttana venuta da chissà dove,"
      },
      {
        "testo": "C'ûnn-a risma çernûa de pellegramme",
        "it": "Con una risma scelta di pellegrini,"
      },
      {
        "testo": "Avanzo de casin, celle ed alcove,",
        "it": "Avanzi di casino, celle ed alcove,"
      },
      {
        "testo": "Che mì, balordo, g'ho levôu za a famme,",
        "it": "A cui io, balordo, ho già tolto la fame,"
      },
      {
        "testo": "A me deve fâ ö torto, ö sommo Giove,",
        "it": "A me deve fare il torto, o sommo Giove,"
      },
      {
        "testo": "De dâme ûn pê in tö cû pe stö salamme?",
        "it": "Di darmi un calcio nel culo per questo salame Enea?"
      },
      {
        "testo": "Devo vedde stö chì che ö me dà a berta",
        "it": "Devo vedere questo qui che mi sbeffeggia"
      },
      {
        "testo": "E taxei, mentre lë ö buffa in coverta?",
        "it": "E tacere, mentre lui se la spassa?"
      },
      {
        "testo": "Ö l'ëa ancon lì in zenöggie a fâ lamenti",
        "it": "Era ancora lì in ginocchio a fare lamenti"
      },
      {
        "testo": "Che zà Giove sorpreiso, ö s'ëa vortôu",
        "it": "Che già Giove, sorpreso, si era voltato"
      },
      {
        "testo": "A-o recioccö da vöxe e di aççîdenti",
        "it": "Al rimbombo della voce e degli accidenti"
      },
      {
        "testo": "Che sô figgiô ö gh'aveiva allivellôu",
        "it": "Che suo figlio gli aveva scagliato"
      },
      {
        "testo": "E piggiando, lì a caxo ûn pâ de lenti",
        "it": "E prendendo, lì a caso, un paio di lenti "
      },
      {
        "testo": "Ö s'ëa misso a amiâ zû, mëzö seccôu,",
        "it": "Si era messo a guardare giù, mezzo seccato,"
      },
      {
        "testo": "E puntando Didon, co-i sô binoccoli",
        "it": "E puntando Didone, con i suoi binocoli"
      },
      {
        "testo": "Ö vedde Enea che ö te ghe dâ sciû a-i broccoli.",
        "it": "Vede Enea che le sta trombando alla grande."
      },
      {
        "testo": "A mössa Peo chi nö se treppa! a-o casso!",
        "it": "Sta mussa Piero, qui non si scherza! e che cazzo!"
      },
      {
        "testo": "Atro che casto e che pietoso Enea:",
        "it": "Altro che casto e pietoso Enea:"
      },
      {
        "testo": "Atro che Italia! se nö metto a-o passo,",
        "it": "Altro che Italia! se non lo metto al passo,"
      },
      {
        "testo": "Le ö ghe a ciocca e ö ghe lascia a rastellëa;",
        "it": "Lui ci sbatte e ci lascia la rastrelliera;"
      },
      {
        "testo": "Ohe là Mercûrio, vegni chì, paggiasso,",
        "it": "Ohilà Mercurio, vieni qui, pagliaccio,"
      },
      {
        "testo": "Se se beccia e se fûtte a sta manëa,",
        "it": "Se si scopa e si fotte in questa maniera,"
      },
      {
        "testo": "Stö bulicugge ö dà di pûnti a mì;",
        "it": "Questo frocione dà dei punti a me!"
      },
      {
        "testo": "Mercûrio, ho dîto che ti vegni chì.",
        "it": "Mercurio, ho detto che tu venga qui!\""
      },
      {
        "testo": "Mia fanni presto, piggia ûn pâ de venti,",
        "it": "Guarda di far presto, prendi un paio di venti,"
      },
      {
        "testo": "Attachiteli a-o cû c'ûnn-a picaggia,",
        "it": "Attaccateli al culo con un nastro,"
      },
      {
        "testo": "Bullite in tæra senza complimenti",
        "it": "Buttati a terra senza complimenti"
      },
      {
        "testo": "E vannime a trovâ stö testa gaggia",
        "it": "E vammi a trovare questa testa vuota"
      },
      {
        "testo": "Che ö se perde in garicci e complimenti",
        "it": "Che si perde in scopate e complimenti"
      },
      {
        "testo": "Nö pensando a-o destin che ö l'hain sce-a taggia,",
        "it": "Non pensando al destino che gli pende sul capo,"
      },
      {
        "testo": "Vannighe a dî che n'ho zâ a mössa pinn-a",
        "it": "Vagli a dire che ne ho già le palle piene"
      },
      {
        "testo": "De veddiôu incarognî in ta pantalinn-a",
        "it": "Di vederlo incarognito nella fica."
      },
      {
        "testo": "Digghe alla fine che nö l'é pe questo",
        "it": "Digli alla fine che non è per questo"
      },
      {
        "testo": "Che Venere a me l'ha raccomandôu,",
        "it": "Che Venere me lo ha raccomandato,"
      },
      {
        "testo": "Ne pe fûttime in manea de daghe a-o resto",
        "it": "Né per fottermi in maniera di dargli  il resto "
      },
      {
        "testo": "Che dûe votte dai greci a l'ha salvôu:",
        "it": "Che due volte dai Greci lo ha salvato:"
      },
      {
        "testo": "Che ö s'imbarche, che ö vadde, ö fasse presto,",
        "it": "Che si imbarchi, che vada, faccia presto,"
      },
      {
        "testo": "Che ö nö stagghe ciû a fâ l'abbelinôu,",
        "it": "Che non stia più a fare l'abbelinato,"
      },
      {
        "testo": "Che ö l'ha ûn regno davanti e se ö nö vêu,",
        "it": "Che ha un regno davanti e se  non lo vuole,"
      },
      {
        "testo": "Ö nö deve privâne ö sô figgiêu!",
        "it": "Non deve privarne il suo figliolo!"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 8",
      "it": "Mercurio scuote Enea "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Ö n'ha ancon terminôu che zâ se mette",
        "it": "Non ha ancora finito che già si mette"
      },
      {
        "testo": "Mercûrio pe esegûi stâ commiscion,",
        "it": "Mercurio per eseguire questa commissione,"
      },
      {
        "testo": "Ö s'attacca a-e caviggie ûn pâ d'alette,",
        "it": "Si attacca alle caviglie un paio di alette,"
      },
      {
        "testo": "Cön de ciûmme de gazza e de piccion,",
        "it": "Con delle piume di gazza e di piccione,"
      },
      {
        "testo": "Ûnn-a çenta d'ôrpello e de ciambrette",
        "it": "Una cintura d'orpello e di lustrini"
      },
      {
        "testo": "E ö storico capello de latton,",
        "it": "E lo storico cappello d'ottone,"
      },
      {
        "testo": "E ö l'agguanta pe bacco, ö Cadûceo,",
        "it": "E agguanta, perbacco, il Caduceo,"
      },
      {
        "testo": "Quella verga, sei ben, cöscì da rëo.",
        "it": "Quella verga, sai bene, così utile al male."
      },
      {
        "testo": "A l'é questa che a serve a-i sô manezzi,",
        "it": "È questa che serve ai suoi maneggi,"
      },
      {
        "testo": "Mal'azioin, ruffianate e tradimenti,",
        "it": "Male azioni, ruffianate e tradimenti,"
      },
      {
        "testo": "Che a combinn-a e ganciatê e ladrunezzi",
        "it": "Che combina imbrogli e ladronerie,"
      },
      {
        "testo": "Che a l'accianta in te l'orto a-i diffidenti,",
        "it": "Che lo mette in tasca perfino i diffidenti,"
      },
      {
        "testo": "Che a dirizze i cöggiöin, che a bûrla e leggi,",
        "it": "Che dirige i coglioni, che si fa beffe delle leggi,"
      },
      {
        "testo": "Che a fa i zêughi de borsa e i fallimenti,",
        "it": "Che fa i giochi di borsa e i fallimenti,"
      },
      {
        "testo": "Che a fa perde e moggiæ, che a vende e figgie,",
        "it": "Che fa perdere le mogli, che vende le figlie,"
      },
      {
        "testo": "Chi ë a rövinn-a de case e de famiggie.",
        "it": "Che è la rovina di case e famiglie."
      },
      {
        "testo": "In sce primma ö se bulla e ö fa ûnn-a ciomba",
        "it": "Sulle prime si butta e va in picchiata"
      },
      {
        "testo": "Zû da-o çë gambe streite e a testa avanti,",
        "it": "Giù dal cielo a gambe strette e a testa avanti,"
      },
      {
        "testo": "E o precipita zû comme ûnn-a bomba",
        "it": "E precipita giù come una bomba"
      },
      {
        "testo": "In sce ö ciû grosso di nevosi Atlanti,",
        "it": "Sul più grosso dei nevosi Atlanti,"
      },
      {
        "testo": "Dove ö vento ö ghe sciûscia e ö ghe rimbomba",
        "it": "Dove il vento ci soffia e ci rimbomba,"
      },
      {
        "testo": "Dove a nebbia cö zeo, regna costanti,",
        "it": "Dove la nebbia col gelo regnano costanti,"
      },
      {
        "testo": "E in sce stö monte che ö l'ëa ûn sô antenato,",
        "it": "E su questo monte, che era in realtà un suo antenato,"
      },
      {
        "testo": "Öse ferma ûn pittin, pe piggiâ fiato.",
        "it": "Si ferma un pochino per riprendere fiato."
      },
      {
        "testo": "Poi ö törna a bollase e costezzando",
        "it": "Poi torna a tuffarsi e costeggiando,"
      },
      {
        "testo": "Tocco e nö tocco in sce africane sponde.",
        "it": "Tocco e non tocco sulle sponde africane."
      },
      {
        "testo": "Proprio cömme ûn ôchin ö va sfrixando",
        "it": "Proprio come un gabbiano va sfiorando,"
      },
      {
        "testo": "E annunziando a burrasca ö pei de onde,",
        "it": "E annunciando la burrasca, a pelo delle onde,"
      },
      {
        "testo": "Becchezzando in ça e in là, de quand'in quando",
        "it": "Becchettando di qua e di là, di quando in quando,"
      },
      {
        "testo": "Con di sâti, di sguetti, e de ôte rionde,",
        "it": "Con dei salti, dei guizzi e delle giravolte,"
      },
      {
        "testo": "A so meta ö l'arriva e çea con çea",
        "it": "Alla sua meta arriva e, faccia a faccia,"
      },
      {
        "testo": "Pe-a primma cosa se ghe affaccia Enea.",
        "it": "Per prima cosa gli si para davanti Enea."
      },
      {
        "testo": "Ö l'ëa intento a di piani e di progetti",
        "it": "Era intento a piani e progetti"
      },
      {
        "testo": "De sontuosi palazzi e monumenti,",
        "it": "Di sontuosi palazzi e monumenti,"
      },
      {
        "testo": "Tûtto lindo arrissôu, tûtto frexetti,",
        "it": "Tutto lindo e arricciato, tutto fronzoli,"
      },
      {
        "testo": "Co-i cavelli oleosi e puzzolenti,",
        "it": "Coi capelli oleosi e puzzolenti,"
      },
      {
        "testo": "C'ûnn-a sciabbra da rîe, pe dâ ai peccetti",
        "it": "Con una sciabola da ridicola, per darle agli uccellini"
      },
      {
        "testo": "Tûtta gemme, arabeschi ed ornamenti,",
        "it": "Tutta gemme, arabeschi ed ornamenti,"
      },
      {
        "testo": "E ûn mantello de porpora elegante",
        "it": "E un mantello di porpora elegante"
      },
      {
        "testo": "Ûn regallo tesciûo da sô galante.",
        "it": "Un regalo tessuto dalla sua amante."
      },
      {
        "testo": "Appenn-a che ö l'ha visto ö te l'accosta",
        "it": "Appena lo ha visto gli si accosta"
      },
      {
        "testo": "E ö ghe sbraggia in te l'oëgia: ah bellinön",
        "it": "E gli sbraita nell'orecchio: ah belinone!"
      },
      {
        "testo": "Vanni là, che ghe vêu da faccia tosta",
        "it": "Ma vai là, che ci vuole della faccia tosta"
      },
      {
        "testo": "A fâ ö leccabrûnie con stö saccon,",
        "it": "A fare il lecca-prugna con questo saccone,"
      },
      {
        "testo": "Ö baccan de lasciû ö me manda a posta",
        "it": "Il capo di lassù mi manda apposta"
      },
      {
        "testo": "A annûnziate de trinca a sô opinion,",
        "it": "Ad annunciarti direttamente la sua opinione,"
      },
      {
        "testo": "Cioè che ti ë ûn bulicciö, ûnn-a bellinn-a",
        "it": "Cioè che sei un buliccio, una belina"
      },
      {
        "testo": "E de tô balle ö n'ha zà a mössa pinn-a.",
        "it": "E delle tue balle ne ha già la mussa piena."
      },
      {
        "testo": "E cose ti te pensi? e con che fin,",
        "it": "\"E cosa pensi ? E a che scopo,"
      },
      {
        "testo": "Ti stæ chi a perde i giorni a zinzannâ?",
        "it": "Stai qui a perdere i giorni a gingillarti?"
      },
      {
        "testo": "Che ti devi dâ a mente a-o tô destin,",
        "it": "Che devi dare la mente al tuo destino,"
      },
      {
        "testo": "Che ti æ ûn regno da vinse e conquistâ,",
        "it": "Che hai un regno da vincere e conquistare!"
      },
      {
        "testo": "Se a to gloria ti a metti in tö bellin",
        "it": "Se la tua gloria te la metti nel belino"
      },
      {
        "testo": "No ghe mette tô figgio, e nû lasciâ",
        "it": "Non metterci tuo figlio, e non lasciarlo"
      },
      {
        "testo": "Pe guagnase ûn impero a mëza costa,",
        "it": "Per guadagnare un impero a mezza costa,"
      },
      {
        "testo": "E ö se ne va, sensa aspetâ a risposta.",
        "it": "E se ne va, senza aspettare la risposta."
      },
      {
        "testo": "Ast'apostrofe Enea, poviou cristian,",
        "it": "A quest'apostrofe Enea, povero cristo,"
      },
      {
        "testo": "Ö sta lì comme Giona, inscemelïo,",
        "it": "Sta lì come Giona, inebetito,"
      },
      {
        "testo": "Co-i êuggi spalanchæ, co-e balle in man,",
        "it": "Con gli occhi spalancati, con le palle in mano,"
      },
      {
        "testo": "Nö savendo piggiâ nisciûn partîo,",
        "it": "Non sapendo prendere nessun partito,"
      },
      {
        "testo": "Se decidise a stâ, se fûtte ö can,",
        "it": "se decidersi di restare, se tagliare la corda,"
      },
      {
        "testo": "Comme fâ con Didon, con che regîo",
        "it": "Come fare con Didone, con quale rigiro"
      },
      {
        "testo": "Raxonnala e decidila co-e bonne",
        "it": "Ragionare e convincerla con le buone"
      },
      {
        "testo": "Affinchè ä so partenza a nö s'opponn-e.",
        "it": "Affinché alla sua partenza non si opponga."
      },
      {
        "testo": "Primma scì, ma poi nö ghe passa in mente",
        "it": "Prima sì, ma poi no, gli passano per la mente"
      },
      {
        "testo": "I progetti ciû nesci e stravaganti,",
        "it": "I progetti più sciocchi e stravaganti,"
      },
      {
        "testo": "Doppo avei zà deciso ö se ne pente",
        "it": "Dopo aver già deciso se ne pente"
      },
      {
        "testo": "E ö fâ ûn miggio inderë, pe ûn passo avanti,",
        "it": "E fa un miglio indietro, per un passo avanti,"
      },
      {
        "testo": "Ciû ö desghêuggia ö s'imbroggia e finalmente",
        "it": "Più  districare e più si imbroglia, e finalmente"
      },
      {
        "testo": "Ö decidde e ö se fâ vegni davanti",
        "it": "Decide e si fa venire davanti"
      },
      {
        "testo": "I ciû esperti campiöin dö sô drapello",
        "it": "I più esperti campioni del suo drappello"
      },
      {
        "testo": "Cioè Gianlucca e Baciccia Montexello.",
        "it": "Cioè Gianluca e Baciccia Monticello."
      },
      {
        "testo": "E ö ghe dixe: l'e l'öa de fâ partenza",
        "it": "E lui gli dice: \"È l'ora di fare partenza "
      },
      {
        "testo": "Ciancianin, senza fâ de ramadan;",
        "it": "Pian pianino, senza fare casino;"
      },
      {
        "testo": "Dî sta cosa a-i compagni in confidenza",
        "it": "Dite questa cosa ai compagni in confidenza"
      },
      {
        "testo": "E seggiæ tûtti pronti a fûtte ö can",
        "it": "E siate tutti pronti a tagliare la corda."
      },
      {
        "testo": "Fasso assegno in sce-a vostra intelligenza",
        "it": "Faccio affidamento sulla vostra intelligenza"
      },
      {
        "testo": "Pe fâ e cose con gaibö e sottoman;",
        "it": "Per fare le cose con garbo e di sottomano;"
      },
      {
        "testo": "Mi parliô co-a reginn-a e ciancianin",
        "it": "Io parlerò con la regina e, pian pianino,"
      },
      {
        "testo": "Ghe ö ciantiô, con riguardo, in tö stöppin.",
        "it": "Glielo pianterò, con riguardo, nello stoppino."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 9",
      "it": "Lo scontro: la sfuriata di Didone "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Dîto e fæto, i compagni in t'ûn momento",
        "it": "Detto, fatto: i compagni in un momento"
      },
      {
        "testo": "Se disponn-an a fâ cose ö g'ha dîto,",
        "it": "Si dispongono a fare le cose che ha detto loro,"
      },
      {
        "testo": "Provvedendo all'imbarco e all'armamento",
        "it": "Provvedendo all'imbarco e all'armamento"
      },
      {
        "testo": "A fâ bœûli, fangotti e a lasciâ ö scîto,",
        "it": "A preparare bauli, fagotti e a lasciare il posto,"
      },
      {
        "testo": "Ma scì balle, Didon ch'ëa ûn sacramento",
        "it": "Ma si, palle,  Didone che era un sacramento"
      },
      {
        "testo": "Da nö pueighelo infiâ coscì pe drito,",
        "it": "Da non poterglielo infilare così per dritto,"
      },
      {
        "testo": "Benché a fesse l'indian, che a fesse a morta,",
        "it": "Benché facesse l'indiana,o che facesse la morta,"
      },
      {
        "testo": "Pe istinto de tûtto a s'ëa zà accorta;",
        "it": "Per istinto di tutto si era già accorta."
      },
      {
        "testo": "E zà ö cætö ö ghe sciûscia e ö te ghe cönta",
        "it": "E già il pettegolezzo le sussurra e le racconta"
      },
      {
        "testo": "Che l'é dæto zà ö sevo ai bastimenti,",
        "it": "Che è già stato dato il sego ai bastimenti,"
      },
      {
        "testo": "E che a squaddra troiann-a a l'ëa zà pronta",
        "it": "E che la squadra troiana era già pronta"
      },
      {
        "testo": "A tiâ sciû l'ancöa pe dà e veie ai venti,",
        "it": "A tirare su l'ancora per dare le vele ai venti,"
      },
      {
        "testo": "E coscì lë a se spaxima, a se monta",
        "it": "E così lei  spasima, si monta "
      },
      {
        "testo": "E te gh'intra in tö chêu mille aççidenti,",
        "it": "E le entrano nel cuore mille accidenti,"
      },
      {
        "testo": "Tanto, che a sciorte imbestialîa dä raggia",
        "it": "Tanto che esce imbestialita dalla rabbia"
      },
      {
        "testo": "Traversando a çittæ, pe andâ in sce-a spiaggia.",
        "it": "Attraversando la città, per andare sulla spiaggia."
      },
      {
        "testo": "Comme quando a ûnn-a donna che a se lascia",
        "it": "Come quando a una donna che si lascia"
      },
      {
        "testo": "Abbrazzâ, manezzâ da questo e quello,",
        "it": "Abbracciare, palpeggiare da questo e da quello,"
      },
      {
        "testo": "Se per caxo ghe dî che a fâ a bagascia",
        "it": "Se per caso le dite che fa la bagascia,"
      },
      {
        "testo": "Ve ghe ven ûn demonio pe cavello,",
        "it": "Le viene un demonio per capello,"
      },
      {
        "testo": "A reagisce, a risponde, a se sganascia,",
        "it": "Reagisce, risponde, si sganascia,"
      },
      {
        "testo": "E co-e ûnge, se a puëse, a faiæ ûn maxello,",
        "it": "E con le unghie, se potesse, farebbe un macello,"
      },
      {
        "testo": "Cöscì lë inveninâ veddendo Enea,",
        "it": "Così lei, invelenita vedendo Enea,"
      },
      {
        "testo": "A l'agguanta e a ghe parla a sta manea:",
        "it": "Lo agguanta e gli parla in questa maniera:"
      },
      {
        "testo": "Siôto, vile, ruffian, testa de casso,",
        "it": "Sporco, vile, ruffiano,testa di cazzo"
      },
      {
        "testo": "Brûtö che ti ë, ti me ne fæ de queste?",
        "it": "Vigliacco che non sei altro, tu mi fai questo?"
      },
      {
        "testo": "Ah ti tii ö sascio e poi ti ascondi ö brasso,",
        "it": "Ah tu tiri il sasso e poi nascondi il braccio,"
      },
      {
        "testo": "Ti gii de bordo e mi restiô in te peste?",
        "it": "Tu giri di bordo e io resterò nelle pesti?"
      },
      {
        "testo": "A tì ti æ l'ûso de brûxâ ö paggiasso,",
        "it": "Tu hai l'abitudine di tradire,"
      },
      {
        "testo": "Anche trattando con de donne oneste?",
        "it": "Anche trattando con delle donne oneste?"
      },
      {
        "testo": "Ma progenie de sbiri e de ruffien,",
        "it": "Ma progenie di sbirri e di ruffiani,"
      },
      {
        "testo": "Ti me tratti ädreitûa, comme ûnn-a putten?",
        "it": "Tu mi tratti addirittura come una puttana?"
      },
      {
        "testo": "E mì cose t'ho fæto e perché mai",
        "it": "E io cosa ti ho fatto e perché mai"
      },
      {
        "testo": "Ti te fûtti de mì e di tô zuamenti?",
        "it": "Te ne fotti di me e dei tuoi giuramenti?"
      },
      {
        "testo": "Ti væ incontro a de lastime e di guai",
        "it": "Vai incontro a lamenti e guai"
      },
      {
        "testo": "A fâte spenaggiâ da-i elementi,",
        "it": "A farti spennare dagli elementi,"
      },
      {
        "testo": "E mi döviô restâ, chì in sce ö tramwai",
        "it": "E io dovrò restare, qui sul tram"
      },
      {
        "testo": "Söla ermitta, a giasciâ bile e aççidenti?",
        "it": "Sola eremita, a biascicare bile e accidenti?"
      },
      {
        "testo": "Pe fâ ûn viaggio a taston, ma brûtto boia",
        "it": "Per fare un viaggio a tastoni, ma brutto boia"
      },
      {
        "testo": "Cosa ti fæsci se existesse Troia?",
        "it": "Cosa faresti se esistesse Troia?"
      },
      {
        "testo": "Ah pe queste mæ lagrime, pe quello",
        "it": "Ah per queste mie lacrime, per quell'"
      },
      {
        "testo": "Assazzo de piaxei che ti mæ dæto,",
        "it": "Assaggio di piaceri che mi hai dato,"
      },
      {
        "testo": "Che ö l'é stæto ûnn-a gossa in t'ûn lavello",
        "it": "Che è stato  una goccia in un lavello"
      },
      {
        "testo": "E ö m'ha missö ciû coæ che soddisfæto,",
        "it": "E mi ha fatto venire più voglia che soddisfatto,"
      },
      {
        "testo": "Se de mì ti æ posciûö fâne ö bordello",
        "it": "Se di me hai potuto farne bordello"
      },
      {
        "testo": "E se qualche piaxei, provâ t'ho fæto,",
        "it": "E se qualche piacere ti ho fatto provare,"
      },
      {
        "testo": "Nö me fâ quest'azion diletto Enea,",
        "it": "Non farmi quest'azione, diletto Enea,"
      },
      {
        "testo": "Che a sæ degna da forca e da galea.",
        "it": "Che sarebbe degna della forca e della galera."
      },
      {
        "testo": "Ti sæ ben, che pe tì me son cacciâ",
        "it": "Tu lo sai bene, che per te mi sono cacciata"
      },
      {
        "testo": "Dietro e spalle ö rispetto e a pudicizia,",
        "it": "Dietro le spalle il rispetto e la pudicizia,"
      },
      {
        "testo": "Sön dai mæ pe ûnn-a putten consciderâ,",
        "it": "Sono considerata dai miei una puttana,"
      },
      {
        "testo": "Son co-i Cappi Africani in nimicizia,",
        "it": "Sono in inimicizia coi Capi Africani,"
      },
      {
        "testo": "Da ûnn-a parte g'ho ö fræ che ö stà aspetâ",
        "it": "Da una parte ho mio fratello che sta aspettando"
      },
      {
        "testo": "Pe roviname ûnn-a ocaxion propizia,",
        "it": "Per rovinarmi un'occasione propizia,"
      },
      {
        "testo": "Jarba dall'âtra, che ö nö vedde l'öa",
        "it": "Iarba dall'altra, che non vede l'ora"
      },
      {
        "testo": "De ciantamelo sotto ö portacöa.",
        "it": "Di piantarmelo sotto il portacoda."
      },
      {
        "testo": "E tì æ chœu de partì? che Dio te mande",
        "it": "E tu hai il coraggio di partire? Che Dio ti mandi"
      },
      {
        "testo": "Ûn anghæso derê fæto a pestello!",
        "it": "Un oggetto di dietro fatto a pestello!"
      },
      {
        "testo": "Se a-o meno a-o meno doppo tante giande",
        "it": "Se almeno almeno, dopo tante scopate,"
      },
      {
        "testo": "Ti m'avexi insaûrâ d'ûn rûbatello,",
        "it": "Mi avessi ingravidata di un monello,"
      },
      {
        "testo": "Che ö me tiesse sciû ö chœu, che poi da grande",
        "it": "Che mi tenesse su il morale, che poi da grande"
      },
      {
        "testo": "Ö me fosse d'aggiûtto e de pontello;",
        "it": "Mi fosse di aiuto e di puntello;"
      },
      {
        "testo": "Ma manco questo, döviô mûi chi ermitta",
        "it": "Ma manco questo, dovrò morire qui eremita"
      },
      {
        "testo": "Missa a-o bando da tûtti e derelitta!",
        "it": "Messa al bando da tutti e derelitta!"
      },
      {
        "testo": "Comme chi ë naûfragôu se ten co-e brasse",
        "it": "Come chi è naufragato si tiene con le braccia"
      },
      {
        "testo": "Streito a ûn schêuggio, a ûnn-a tôa pe nö negâ,",
        "it": "Stretto a uno scoglio, a una tavola per non annegare,"
      },
      {
        "testo": "Cöscì Enea, pe a pûia che a l'obbligasse",
        "it": "Così Enea, per la paura che lei lo obbligasse"
      },
      {
        "testo": "Co-i sô cênti a dovei capitolâ,",
        "it": "Coi suoi pianti  a dover capitolare,"
      },
      {
        "testo": "Ö l'e stæto aspëtâ che a se sfogasse,",
        "it": "È rimasto ad aspettare che si sfogasse,"
      },
      {
        "testo": "Che finisce a gragnœûa pe pûei parlâ,",
        "it": "Che finisse la gragnola per poter parlare,"
      },
      {
        "testo": "Nö pensando che a Giove e a-o sô comando",
        "it": "Non pensando che a Giove e al suo comando"
      },
      {
        "testo": "E tegnindose ö sciôu nö parpellando.",
        "it": "E trattenendo il fiato senza batter ciglio."
      },
      {
        "testo": "All'ûrtimo ö ghe fa: via, te ne prego,",
        "it": "Alla fine lui le fa: via, te ne prego,"
      },
      {
        "testo": "Nö fâ de scene e nö sciatate tanto,",
        "it": "Non fare delle scenate e non scaldarti tanto,"
      },
      {
        "testo": "Ti aviæ mille raxöin, mì nö te ö nego,",
        "it": "Avrai mille ragioni, io non te lo nego,"
      },
      {
        "testo": "Né mì me vêuggio fâ passâ pe ün santo,",
        "it": "Né io mi voglio far passare per un santo,"
      },
      {
        "testo": "Ma alla fin fine, nö sön manco ûn cëgo",
        "it": "Ma alla fin fine, non sono mica un chierico"
      },
      {
        "testo": "Né ûn Giuseppe, o ûn Eunuco, e perdiesanto",
        "it": "Né un Giuseppe, o un eunuco, e perdiesanto"
      },
      {
        "testo": "Se ti mæ vosciûo ben, cose ne posso?",
        "it": "Se tu mi hai voluto bene , cosa ci posso fare io?"
      },
      {
        "testo": "Dimme ûn pittin, doveivo spûate addosso?",
        "it": "Dimmi un pochino: dovevo sputarti addosso?"
      },
      {
        "testo": "Mi pe dö resto, non ho mai pensôu",
        "it": "Io, per il resto, non ho mai pensato"
      },
      {
        "testo": "De vùei tiâ de sasciæ, retiando ö brassö",
        "it": "Di voler tirare sassate, ritirando il braccio,"
      },
      {
        "testo": "Né t'ho mai dîto che t'aviæ sposôu,",
        "it": "Né ti ho mai detto che ti avrei sposato,"
      },
      {
        "testo": "Che de queste luçie mi nö ne fasso;",
        "it": "Perché di queste musse io non ne racconto;"
      },
      {
        "testo": "Cose ho fæto de mâ, t'ho trûffôu,",
        "it": "Cosa ho fatto di male? Ti ho truffata?"
      },
      {
        "testo": "Eh perdie, gh'é da fâ tanto fracasso?",
        "it": "Eh perdiana, c'è da fare tanto fracasso?"
      },
      {
        "testo": "Nö l'ho fæto da solo, e se gh'ëa mì,",
        "it": "Non l'ho fatto da solo, e se c'ero io,"
      },
      {
        "testo": "Vêu dî pe ö meno, che ti gh'ëi tì ascì.",
        "it": "Vuol dire, per lo meno, che c'eri anche tu!"
      },
      {
        "testo": "Poi se fîse padron de dî e de fâ,",
        "it": "Poi se fossi padrone di dire e di fare,"
      },
      {
        "testo": "Se a-o mæ destin ghe comandasse mì,",
        "it": "Se al mio destino comandassi io,"
      },
      {
        "testo": "Ti pêu ëse çerta che nö stæivo a giâ",
        "it": "Puoi essere certa che non starei a girare"
      },
      {
        "testo": "Pe mâ e pe tæra e a rompï a mössa a tì,",
        "it": "Per mare e per terra e a rompere la mussa a te,"
      },
      {
        "testo": "Ma tornieivo a mæ Troia a fabbricâ,",
        "it": "Ma tornerei a fabbricare la mia Troia,"
      },
      {
        "testo": "Comme a l'ëa primma e quande fösse lì,",
        "it": "Come era prima, e quando fossi lì,"
      },
      {
        "testo": "Scì che sæ l'öa de stâ co-e balle a-o sö",
        "it": "Sì che sarebbe l'ora di stare con le balle al sole"
      },
      {
        "testo": "A piggiase dö spazio e a fâ l'amö!",
        "it": "A prendersi dello spazio e a fare l'amore!"
      },
      {
        "testo": "Ma l'Italia a me ciamma e devo andâghe",
        "it": "Ma l'Italia mi chiama e devo andarci"
      },
      {
        "testo": "Anche cö rischio de rompîme ö collo,",
        "it": "Anche col rischio di rompermi il collo,"
      },
      {
        "testo": "Giove ö comanda e cose posso fâghe",
        "it": "Giove lo comanda e cosa posso farci"
      },
      {
        "testo": "Se lasciû in çê nö sön tegnûo pe ûn sciollo?",
        "it": "Se lassù in cielo non sono ritenuto sciocco?"
      },
      {
        "testo": "Ö sà ö Segnö, se ö m'ha sciûgôu zà e braghe",
        "it": "Lo sa il Signore se mi ha già rotto le scatole"
      },
      {
        "testo": "Se dappertûtto dove vaggo, Apollo",
        "it": "Se dappertutto dove vado, Apollo"
      },
      {
        "testo": "In mille moddi ö me l'ha fæto intende,",
        "it": "In mille modi me lo ha fatto intendere,"
      },
      {
        "testo": "Che bezêugna che vagghe e che me rende.",
        "it": "Che bisogna che io vada e che mi arrenda."
      },
      {
        "testo": "Cose sön ste battûe che ti me strisci?",
        "it": "Cosa sono queste battute che mi lanci strisci?"
      },
      {
        "testo": "Cose ö l'é dunque mai questo to sdegno?",
        "it": "Cos'è dunque mai questo tuo sdegno?"
      },
      {
        "testo": "Non intendo perché ti ghe patisci",
        "it": "Non capisco perché tu ci patisca"
      },
      {
        "testo": "Se mì in Italia vaddo a fâme ûn regno,",
        "it": "Se io vado in Italia a farmi un regno,"
      },
      {
        "testo": "Mentre tì ti ë chi in Libia e ti ghe pisci",
        "it": "Mentre tu sei qui in Libia e ci pisci"
      },
      {
        "testo": "Da padronn-a e da re, perbaccolegno!",
        "it": "Da padrona e da re, perbaccolegno!"
      },
      {
        "testo": "E vorrieivo savei, per cose mì",
        "it": "E vorrei sapere, perché io"
      },
      {
        "testo": "Nö posse fâ, cose ti æ fæto tì.",
        "it": "Non possa fare, quello che hai fatto tu."
      },
      {
        "testo": "Gh'é mæ poæ, che ö me sciûga ogni momento",
        "it": "C'è mio padre, che mi asciuga ogni momento"
      },
      {
        "testo": "Se særo ûn œûggio pe dormî ûn pittin,",
        "it": "Se chiudo un occhio per dormire un pochino,"
      },
      {
        "testo": "E ö me dixe che a l'é a fôa dö bestento,",
        "it": "E mi dice che è la favola del bestento,"
      },
      {
        "testo": "Che sæ l'öa d'andâ drîto a-o mæ destin;",
        "it": "Che sarebbe l'ora di andare dritto al mio destino;"
      },
      {
        "testo": "Me sovven de mæ figgio, e ö l'e ûn tormento",
        "it": "Mi ricordo di mio figlio, ed è un tormento"
      },
      {
        "testo": "De pensâ che ö deve ese ûn re latin,",
        "it": "Pensare che deve essere un re latino,"
      },
      {
        "testo": "E che invece ghe levo ö pan da-i denti",
        "it": "E che invece gli tolgo il pane dai denti"
      },
      {
        "testo": "A sön de balle e de divertimenti.",
        "it": "A suon di balle e di divertimenti."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 10",
      "it": "Didone sviene; Anna supplica invano "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Nö l'é manco mez'öa che l'é vegnûo",
        "it": "Non è nemmeno mezz'ora che è venuta"
      },
      {
        "testo": "Ûnn-a staffetta de Giove e ûn sô messaggio",
        "it": "Una staffetta di Giove e un suo messaggero"
      },
      {
        "testo": "A dîme bellinön, becco fottûo,",
        "it": "A dirmi belinone, becco fottuto,"
      },
      {
        "testo": "A ordiname che me mette in viaggio,",
        "it": "A ordinarmi di mettermi in viaggio,"
      },
      {
        "testo": "E l'ho visto e sentîo, questo te ö zûo,",
        "it": "E l'ho visto e sentito, questo te lo giuro,"
      },
      {
        "testo": "Nön invento, n'azzûnzo e nö retaggio,",
        "it": "Non invento, non aggiungo e non ritaglio,"
      },
      {
        "testo": "Dunque lascia cörrî, ciû ti me frösci",
        "it": "Dunque lascia correre, più tu mi stressi"
      },
      {
        "testo": "E ciû mösse ti fæ, ciû ti m'angösci.",
        "it": "E più musse tu fai, più mi fai soffrire."
      },
      {
        "testo": "A l'aveiva aspëtôu che lë ö finisse",
        "it": "Aveva aspettato che lui finisse"
      },
      {
        "testo": "Senza dî ûnn-a parolla e senza ansciâ,",
        "it": "Senza dire una parola e senza ansimare,"
      },
      {
        "testo": "Co-i denti ciôsi e co-e pûpille fisse,",
        "it": "Coi denti stretti  e con le pupille fisse,"
      },
      {
        "testo": "Contegnindo ö ghignon pe nö scciûppâ,",
        "it": "Trattenendo la rabbia per non scoppiare,"
      },
      {
        "testo": "Sempre a töccö e nö töccö e lì in sce pisse",
        "it": "Sempre a tocco e non tocco, sul filo di"
      },
      {
        "testo": "D'andâ tûtta de sörva e straboccâ,",
        "it": "Per andare tutta sopra e straboccare,"
      },
      {
        "testo": "Ma nö pûendone ciû, neigra dä raggia,",
        "it": "Ma non potendone più, nera dalla rabbia,"
      },
      {
        "testo": "Testa e cû a l'incappella e a te ghe sbraggia.",
        "it": "Lo ribalta testa e culo  e gli sbraita contro."
      },
      {
        "testo": "E ti æ ö mûro de dì, ti æ a pretenscion",
        "it": "E tu hai la faccia di dire, hai la pretesa"
      },
      {
        "testo": "De vantâ che l'é Venere tô moæ?",
        "it": "Di vantarti che Venere sia tua madre?"
      },
      {
        "testo": "Ti ë nasciûo da-o Cavalli e da Giaron,",
        "it": "Tu sei nato dal Cavalli e da Cicciolina,"
      },
      {
        "testo": "Ti ë ûn bastardûzzo da Maternitæ,",
        "it": "Tu sei un bastarduccio della Maternità,"
      },
      {
        "testo": "Ti ë sciortîo dall'ûspiâ d'ûnn-a prexion,",
        "it": "Tu sei uscito dall'ospedale di una prigione,"
      },
      {
        "testo": "Allevôu dai putten bollettinæ;",
        "it": "Allevato dalle puttane patentate;"
      },
      {
        "testo": "Ma che scciatta de re, che sangue fin,",
        "it": "Ma quale stirpe di re, quale sangue nobile,"
      },
      {
        "testo": "Ti ë ûn rampollo de celle e de casin!",
        "it": "Tu sei un rampollo di celle e di casini!"
      },
      {
        "testo": "E mì staggo chi a cianze, a renegâ,",
        "it": "E io sto qui a piangere, a rinnegare,"
      },
      {
        "testo": "A ûmiliame a stö paggiasso,",
        "it": "A umiliarmi a questo pagliaccio,"
      },
      {
        "testo": "Che ö l'ha ö sæximo, ö chêu in tö belo cûâ",
        "it": "Che ha il senno, il cuore nel retto,"
      },
      {
        "testo": "Che ö l'é bon pe ö Maxin che ö ghe tie ö lasso",
        "it": "Che è buono per l'accalappiacani che gli tiri il laccio,"
      },
      {
        "testo": "Cose serve fâ vöti e supplicâ",
        "it": "A cosa serve fare voti e supplicare"
      },
      {
        "testo": "Se a-oa Giove e Giûnon, nö van ciû un casso,",
        "it": "Se ora Giove e Giunone non valgono più un cazzo,"
      },
      {
        "testo": "Se nö gh'é ciû giustizia in tæra e in çë",
        "it": "Se non c'è più giustizia in terra e in cielo"
      },
      {
        "testo": "Se sön tûtti ruffien, tûtti cuatë!",
        "it": "Se sono tutti ruffiani, tutti culattoni!"
      },
      {
        "testo": "E a pensâ che stö sîoto ö l'é vegnûo",
        "it": "E a pensare che questo lurido è venuto"
      },
      {
        "testo": "Chi a stracuâ pin de famme e senza ûn citto,",
        "it": "Qui a spiaggiare, morto di fame e senza un centesimo,"
      },
      {
        "testo": "E mì sciolla che sön! l'ho riçevuo",
        "it": "E io sciocca che sono! L'ho ricevuto"
      },
      {
        "testo": "Pe levaghe a miseia e l'appetitto!",
        "it": "Per togliergli la miseria e l'appetito!"
      },
      {
        "testo": "E ancon, stesselà lì, che ho ancon vosciûo",
        "it": "E ancora, fosse finita lì, che ho pure voluto"
      },
      {
        "testo": "In sce ö regno e in sce mî, daghe diritto,",
        "it": "Sul regno e su di me, dargli diritto,"
      },
      {
        "testo": "Pe veddime lasciâ comme ûn saccon",
        "it": "Per vedermi lasciata come un saccone"
      },
      {
        "testo": "Ûn remorco qualunque, in abbandon.",
        "it": "O un rimorchio qualunque, in abbandono."
      },
      {
        "testo": "A sentilo ao-a ghe ö profeta Apollo,",
        "it": "A sentirlo ora c'è il profeta Apollo,"
      },
      {
        "testo": "Ao-a Giove, Mercûrio, ûn aççidente,",
        "it": "Adesso Giove, Mercurio, un accidente,"
      },
      {
        "testo": "Che se mescian da-o çe pe questo sciollo",
        "it": "Che si muovono dal cielo per questo sciocco"
      },
      {
        "testo": "Che son tûtti sciatæ pe questa gente!",
        "it": "Che sono tutti agitati per questa gente!"
      },
      {
        "testo": "E che ti posci scavenate ö collo!",
        "it": "E che tu possa romperti il collo!"
      },
      {
        "testo": "Vanni dunque ûnn-a votta e che nö sente",
        "it": "Vai dunque una volta e che non senta"
      },
      {
        "testo": "Mai parlâ ciû de tì né de to gesta",
        "it": "Mai parlar più di te né delle tue gesta"
      },
      {
        "testo": "In Italia, all'Inferno, a cadepesta!",
        "it": "In Italia, all'Inferno, a ca' del diavolo!"
      },
      {
        "testo": "Ma se quelli lasciû, nö sön schifosi",
        "it": "Ma se quelli lassù non sono degli schifosi"
      },
      {
        "testo": "Senza ûn pô de giûstizia e de pietæ,",
        "it": "Senza un po' di giustizia e di pietà,"
      },
      {
        "testo": "Spero veddite tì, co-i tô batösi",
        "it": "Spero di vedere te, con i tuoi maranza"
      },
      {
        "testo": "In ta merda e in tö pisciö assotteræ,",
        "it": "Nella merda e nel piscio sotterrati,"
      },
      {
        "testo": "Spero veddive moî da pigoggiosi",
        "it": "Spero di vedervi morire da pidocchiosi"
      },
      {
        "testo": "Implorando a mæ grazia a mæ pietæ,",
        "it": "Implorando la mia grazia la mia pietà,"
      },
      {
        "testo": "Mûi de famme, de freido e d'aççidenti",
        "it": "Morire di fame, di freddo e di accidenti"
      },
      {
        "testo": "E senz'œûio, né sâ, né sacramenti.",
        "it": "E senza olio, né sale, né sacramenti."
      },
      {
        "testo": "E a l'aviæ continuôu, ma dä pasciön,",
        "it": "E lei avrebbe continuato, ma dalla passione,"
      },
      {
        "testo": "Da-o travaso da bile a s'impuntella",
        "it": "Per il travaso di bile s'impunta)"
      },
      {
        "testo": "E a se mette a tremâ dä convulscion",
        "it": "E si mette a tremare dalla convulsione"
      },
      {
        "testo": "E a sæ cheita lì, se ûnn-a sô ancella",
        "it": "E sarebbe caduta lì, se una sua ancella"
      },
      {
        "testo": "Faxendola assetâ in sce ö caregon,",
        "it": "Facendola sedere sul cadregone,"
      },
      {
        "testo": "A n'avesse finîo questa ratella,",
        "it": "Non avesse finito questo litigio,"
      },
      {
        "testo": "Mentre Enea ö se ne va scrollando e spalle",
        "it": "Mentre Enea se ne va scrollando le spalle"
      },
      {
        "testo": "E dixendo fra le: son tütte balle.",
        "it": "E dicendo fra sé e sé: sono tutte balle."
      },
      {
        "testo": "E piggiando occaxion da-o svegnimento,",
        "it": "E prendendo occasione dallo svenimento,"
      },
      {
        "testo": "Che ö ghe dava ûn pittin de libertæ",
        "it": "Che gli dava un pochino di libertà,"
      },
      {
        "testo": "Ö va a-o porto e ö fa scì che in t'ûn momento",
        "it": "Va al porto e fa in modo che in un momento"
      },
      {
        "testo": "Tutti i legni son vönti e preparæ",
        "it": "Tutti i legni siano unti e preparati"
      },
      {
        "testo": "Cacciæ in mâ comme sön senz'armamento",
        "it": "Cacciati in mare così come sono, senza armamento,"
      },
      {
        "testo": "Con de remme in sce l'atto improvvisæ",
        "it": "Con dei remi improvvisati sul momento"
      },
      {
        "testo": "Da ûnn-a selva de pin che a l'ëa vixinn-a,",
        "it": "Da una selva di pini che era lì vicina,"
      },
      {
        "testo": "Adattæ in quinta e sprescia e â biscôchinn-a.",
        "it": "Adattati in fretta e furia e alla bell'e meglio."
      },
      {
        "testo": "Aviei zà visto petussâ ûnn-a sotta",
        "it": "Avrete già visto ciucciare una sciolta"
      },
      {
        "testo": "Da ûnn-a raccolta de moscoin merdæ",
        "it": "Da una raccolta di mosconi merdaioli"
      },
      {
        "testo": "Che in sce ö prinçipio ghe van ûn pe votta,",
        "it": "Che in principio ci vanno uno per volta,"
      },
      {
        "testo": "Poi a sciammi ädreitûa centûplichæ,",
        "it": "Poi a sciami addirittura centuplicati,"
      },
      {
        "testo": "Parte restan de dato e parte sotta,",
        "it": "Parte restano di sopra e parte sotto,"
      },
      {
        "testo": "Missi in orgasmo dall'aviditæ,",
        "it": "Messi in orgasmo dall'avidità,"
      },
      {
        "testo": "Che in t'ûn lampo, assorbîa dâ concorrenza,",
        "it": "Che in un lampo, assorbita dalla concorrenza,"
      },
      {
        "testo": "Nö ghe ne resta manco ciû a semenza;",
        "it": "Non ne resta neanche più la semenza;"
      },
      {
        "testo": "E coscì l'ëa ö remescio e l'invexendo",
        "it": "E così era il trambusto e la confusione"
      },
      {
        "testo": "Che da-o porto ä çittæ, da questa e quello",
        "it": "Che dal porto alla città, da questa a quello,"
      },
      {
        "testo": "Favan tûtti i Troien, parte cörrendo",
        "it": "Facevano tutti i Troiani, parte correndo"
      },
      {
        "testo": "A portâse a sô roba in tö batello,",
        "it": "A portarsi la propria roba nel battello,"
      },
      {
        "testo": "Parte andando a-e provviste o racchœûggendo",
        "it": "Parte andando alle provviste o raccogliendo"
      },
      {
        "testo": "I dispersci, i bettoanti in t'ûn drapello,",
        "it": "I dispersi, quelli nelle bettole in un drappello,"
      },
      {
        "testo": "Che in te meza giornâ l'ëa tûtto a posto,",
        "it": "Che in mezza giornata era tutto a posto,"
      },
      {
        "testo": "E pe pûei fotte ö can, tûtto disposto:",
        "it": "E per potersela svignare , tutto disposto:"
      },
      {
        "testo": "Che sospii ch'ëan i tô, povia Didon",
        "it": "Che sospiri che erano i tuoi, povera Didone,"
      },
      {
        "testo": "Che beziggi, che lastime, che centi,",
        "it": "Che tormenti, che lamenti, che pianti,"
      },
      {
        "testo": "Quando stando assettâ da-o tô barcon",
        "it": "Quando stando seduta dalla tua finestra"
      },
      {
        "testo": "Ti veddeivi stö sciato e stì ornamenti!",
        "it": "Vedevi questo schiamazzo e questi ornamenti!"
      },
      {
        "testo": "Bruttö siôto d'amô che ti æ a pascion",
        "it": "Brutto porco d'un Amore, che hai la passione"
      },
      {
        "testo": "De fa fà tante mösse a-e povie genti,",
        "it": "Di far fare tante musse alle povere genti,"
      },
      {
        "testo": "Cose l'é che ti fæ, cose ti futti?",
        "it": "Cos'è che fai, cosa cazzo combini?"
      },
      {
        "testo": "Perché i ommi ciù boin, vegnan cifutti?",
        "it": "Perché gli uomini più buoni, diventan vili?"
      },
      {
        "testo": "E lë vinta, obbligâ dâ tô possanza,",
        "it": "E lei vinta, obbligata dalla tua possanza,"
      },
      {
        "testo": "Fando forza a-o sô chœû contro e tô lezzi,",
        "it": "Facendo forza al suo cuore contro le tue leggi,"
      },
      {
        "testo": "Pe nö perde ädreitûa tûtta a speranza",
        "it": "Per non perdere addirittura tutta la speranza"
      },
      {
        "testo": "A s'attacca a s'agguanta a tûtti i mezzi,",
        "it": "Si attacca e si aggrappa a tutti i mezzi,"
      },
      {
        "testo": "E ciamando so sœû che a l'ëa in ta stanza,",
        "it": "E chiamando sua sorella che era nella stanza,"
      },
      {
        "testo": "Pe mostraghe stö sciato e sti manezzi,",
        "it": "Per mostrarle questo baccano e questi maneggi,"
      },
      {
        "testo": "A ghe dixe cianzendo: Ecco a manea",
        "it": "Le dice piangendo: Ecco la maniera"
      },
      {
        "testo": "Co-a quæ me tratta stö brûtô d'Enea!",
        "it": "Con la quale mi tratta questo vile d'un Enea!"
      },
      {
        "testo": "Ti no veddi che ö scenta e ö piggia ö liscio",
        "it": "Non vedi che sparisce e se la svigna"
      },
      {
        "testo": "Che ghe e veie ai pennoin di bastimenti?",
        "it": "Che ci sono le vele ai pennoni dei bastimenti?"
      },
      {
        "testo": "E n'ho forse raxon se ghe patiscio",
        "it": "E non ho forse ragione se ci patisco,"
      },
      {
        "testo": "Mi che stavo segûa di sô zuamenti,",
        "it": "Io che stavo sicura dei suoi giuramenti,"
      },
      {
        "testo": "Che ö me lasce a marsî sola in tö piscio",
        "it": "Che mi lascia a marcire sola nel piscio"
      },
      {
        "testo": "Proprio comme ûn saccön di ciû scadenti?",
        "it": "Proprio come un saccone dei più scadenti?"
      },
      {
        "testo": "Se a-o meno a-o meno, ö me l'avesse dîto,",
        "it": "Se almeno almeno, me l'avesse detto,"
      },
      {
        "testo": "Me l'avieivo piggiâ ûn pô ciû pe drito!",
        "it": "Me l'avrei presa un po' più per il verso giusto!"
      },
      {
        "testo": "Cöri dunque da lë, vagghe a parlâ",
        "it": "Corri dunque da lui, vagli a parlare"
      },
      {
        "testo": "Perché andandoghe mi, sæ tempo perso,",
        "it": "Perché andandoci io, sarebbe tempo perso,"
      },
      {
        "testo": "Mentre invece da ti ö se lascia fâ,",
        "it": "Mentre invece da te si lascia fare,"
      },
      {
        "testo": "Che ti sæ daghe sciû, proprio a-o sô verso,",
        "it": "Che tu sai come prenderlo, proprio per il suo verso,"
      },
      {
        "testo": "Vunzilo ben, perché ö se ö lascie infiâ,",
        "it": "Ungilo bene, affinché se lo lasci infilare,"
      },
      {
        "testo": "Perché ö gh'intre da lë in te l'œûggio gûærso;",
        "it": "Perché gli entri da sé nell'occhio cieco;"
      },
      {
        "testo": "Cianzi, rangogna, caregando e tinte,",
        "it": "Piangi, brontola, calcando le tinte,"
      },
      {
        "testo": "Digghe che mi, nö g'ho mai fæto ninte.",
        "it": "Digli che io, non gli ho mai fatto niente."
      },
      {
        "testo": "E che nö sön mai stæta a bordo ai Greghi,",
        "it": "E che non sono mai stata a bordo coi Greci,"
      },
      {
        "testo": "Né comme lë, nö g'ho mai fæto ö sezze,",
        "it": "Né, come lui, non ho mai fatto il sedici,"
      },
      {
        "testo": "Che nö vaddo a çerca ö mâ, comme i meghi",
        "it": "Che non vado a cercare il male, come i medici"
      },
      {
        "testo": "Pe prefûtte i Troien, pe daghe lezze,",
        "it": "Per fregare i Troiani, per dettar loro legge,"
      },
      {
        "testo": "Né sô poæ, né sô moæ, né i sô colleghi,",
        "it": "Né suo padre, né sua madre, né i suoi colleghi,"
      },
      {
        "testo": "Né nisciûn di brutöi che lë ö protezze",
        "it": "Né nessuno dei vigliacchi che lui protegge"
      },
      {
        "testo": "Ho ingannôu, trattôu mâ, piggiôu de mûtte,",
        "it": "Ho ingannato, trattato male, riscosso delle multe,"
      },
      {
        "testo": "Perché in cangio ö me sprexe e che ö me fûtte.",
        "it": "Perché in cambio lui mi disprezzi e mi fotta."
      },
      {
        "testo": "Se de mi, dö mæ amö ö se n'imbûzara,",
        "it": "Se di me, del mio amore se ne sbatte,"
      },
      {
        "testo": "Che po ö meno, ö provedde â sô salvezza",
        "it": "Che per lo meno, provveda alla sua salvezza"
      },
      {
        "testo": "Che nö sön miga poi, proprio a bazara",
        "it": "Che non sono mica poi, proprio la befana"
      },
      {
        "testo": "Perché ö scappe cöscì cön speditezza,",
        "it": "Perché lui scappi così con speditezza,"
      },
      {
        "testo": "Che ö zinzann-e ûn momento, ûnn-a fucciara,",
        "it": "Che tentenni un momento, un briciolo,"
      },
      {
        "testo": "Perché ö mâ ö dagghe zû da sô groscezza,",
        "it": "Finché il mare non si calmi dalla sua grossezza,"
      },
      {
        "testo": "Che ö l'aspëte ûn pittin, che ö n'aggie pûia",
        "it": "Che aspetti un pochino, che non abbia paura"
      },
      {
        "testo": "Che ghe parle de nozze e de luçia.",
        "it": "Che gli parli di nozze e di Susanna."
      },
      {
        "testo": "Poi che ö cöre, che ö vadde a-o sö destin,",
        "it": "Poi che corra, che vada al suo destino,"
      },
      {
        "testo": "In Italia, all'inferno, a Calicûtte,",
        "it": "In Italia, all'Inferno, a Calicut,"
      },
      {
        "testo": "Ma che ö me lascie repiggiâ ûn pittin,",
        "it": "Ma che mi lasci riprendere un pochino,"
      },
      {
        "testo": "Che m'assuefe a stö colpo e che m'aggiûtte",
        "it": "Che mi assuefaccia a questo colpo e che mi aiuti"
      },
      {
        "testo": "A scordâme st'azion da repessin,",
        "it": "A scordarmi quest'azione da rigattiere,"
      },
      {
        "testo": "Che benché sola a dà di punti a tûtte!",
        "it": "Che benché da sola dà dei punti a tutte!"
      },
      {
        "testo": "Vanni, ti æ inteiso? se ti ö fæ fermâ",
        "it": "Vai, hai inteso? Se lo fai fermare"
      },
      {
        "testo": "Solo cöa vitta te porriô pagâ.",
        "it": "Solo con la vita ti potrò pagare."
      },
      {
        "testo": "Questo a dîva a sô sœû cö crescentin,",
        "it": "Questo diceva a sua sorella col singhiozzo,"
      },
      {
        "testo": "Con tante âtre raxioin che nö ghe metto,",
        "it": "Con tante altre ragioni che non ci metto,"
      },
      {
        "testo": "Mentre lë a fâ comme i figgiœû piccin,",
        "it": "Mentre lei faceva come i bambini piccoli,"
      },
      {
        "testo": "Quande se mettan a zûgä a-o siassetto",
        "it": "Quando si mettono a giocare al setaccino,"
      },
      {
        "testo": "E a l'andava e a vegniva ogni pittin",
        "it": "E andava e veniva ogni poco"
      },
      {
        "testo": "A sciûgâ e cugge a Enea, ma senza effetto,",
        "it": "Ad asciugare le palle a Enea, ma senza effetto,"
      },
      {
        "testo": "Che in sce stö punto benché ö fise bon",
        "it": "Perché su questo punto, benché lui fosse \"buono\","
      },
      {
        "testo": "Nö se ghe pûeiva fâ sentî a raxon.",
        "it": "Non gli si poteva far sentire ragione."
      },
      {
        "testo": "Comme quando ûnn-a lalla avara e ricca,",
        "it": "Come quando una zia avara e ricca,"
      },
      {
        "testo": "A l'ha i nevi despiæ che a vœûan prefutte,",
        "it": "Ha i nipoti disperati che la vogliono fregare,"
      },
      {
        "testo": "Se ghe mettan in gîo, picca e repicca,",
        "it": "Le si mettono attorno, dai e ridai,"
      },
      {
        "testo": "Perché a l'arve ö sacchetto e a molle e mutte,",
        "it": "Affinché lei apra il sacchetto e sganci le monete,"
      },
      {
        "testo": "Lë a fâ a sorda, a nö cede e a se busticca",
        "it": "Lei fa la sorda, non cede e si sposta"
      },
      {
        "testo": "E ciû brigan, ciû fân, ciû a se ne futte.",
        "it": "E più brigano, più fanno, più lei se ne fotte."
      },
      {
        "testo": "E cöscì l'ëa d'Enea, che ciû ö veddeiva",
        "it": "E così era per Enea, che più vedeva"
      },
      {
        "testo": "Che ghe ö vueivan mezûa, ciû ö se strenzeiva",
        "it": "Che glielo volevano misurare, più lo stringeva."
      },
      {
        "testo": "Visto quindi Didon che a fava sappa",
        "it": "Visto quindi Didone che faceva cilecca"
      },
      {
        "testo": "E che l'ëa comme vûei süssa ûn agûo,",
        "it": "E che era come voler succhiare un chiodo,"
      },
      {
        "testo": "E ö mettise a corrî dietro a chi scappa,",
        "it": "E mettersi a correre dietro a chi scappa,"
      },
      {
        "testo": "L'ëa parlâ a ûn sordo e sigilla cö spûo,",
        "it": "Era parlare a un sordo e sigillare con lo sputo,"
      },
      {
        "testo": "A s'imbosa, a nö sà ciû cose a giappa,",
        "it": "Si adira, non sa più cosa blatera,"
      },
      {
        "testo": "Che a perde a bira e a te va zû a derûo,",
        "it": "Che perde la birra, e ti va giù, precipita,"
      },
      {
        "testo": "E ghe ven, povea diâ, coæ de cacciase",
        "it": "E le viene, povera diavola, voglia di cacciarsi"
      },
      {
        "testo": "Ûn pâ de dîe in tö cû pe poi strangöase!",
        "it": "Un paio di dita nel culo per poi strangolarsi!"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 11",
      "it": "I riti magici e il rogo "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "E cûn l'agiûtto da superstizion",
        "it": "E con l'aiuto della superstizione"
      },
      {
        "testo": "A se sentiva di presentimenti",
        "it": "Sentiva dei presentimenti"
      },
      {
        "testo": "Che a mandavan co-a testa in tö ballon",
        "it": "Che la mandavano con la testa nel pallone"
      },
      {
        "testo": "E ghe favan vegnî mille aççidenti,",
        "it": "E le facevano venire mille accidenti,"
      },
      {
        "testo": "O versando dell'œûio e cûn bûtton",
        "it": "O versando dell'olio e con un colpo"
      },
      {
        "testo": "Imbösando ö salin, cöi sô ingredienti,",
        "it": "Rovesciando  la saliera, con i suoi ingredienti,"
      },
      {
        "testo": "O se dunque incontrando ûn zembo, ûn guærso",
        "it": "O se dunque incontrando un gobbo, un cieco,"
      },
      {
        "testo": "O assettandose a tôa, cö pan inværso.",
        "it": "O sedendosi a tavola, col pane rovesciato."
      },
      {
        "testo": "E comme ancön nö ghe bastasse a pûia,",
        "it": "E come se ancora non le bastasse la paura,"
      },
      {
        "testo": "Pâ che ghe seggie capitôu stö fæto:",
        "it": "Pare che le sia capitato questo fatto:"
      },
      {
        "testo": "Lë a possedeiva ûnn-a fotografia",
        "it": "Lei possedeva una fotografia"
      },
      {
        "testo": "Che dö morto sô maio, a l'ëa ö ritræto,",
        "it": "Che del suo defunto marito, era il ritratto,"
      },
      {
        "testo": "Cappo d'arte de Rösci o de Pavia",
        "it": "Capolavoro di Rossi o di Pavia,"
      },
      {
        "testo": "E che nö sô quante a gh'avesse dæto,",
        "it": "E che non so quanto ci avesse dato,"
      },
      {
        "testo": "Ma che ö l'ëa fæto in grande e a-o natûrale",
        "it": "Ma che era fatto in grande e al naturale"
      },
      {
        "testo": "C'ûnn-a cornixe che nö gh'ëa l'eguale.",
        "it": "Con una cornice che non aveva eguali."
      },
      {
        "testo": "Gh'ëa zà parsö che a nœûtte ö se mescesse",
        "it": "Le era già parso che la notte  si muovesse"
      },
      {
        "testo": "E che ö l’amiessec'ûn pa d'œûggi scûi,",
        "it": "E che la guardasse con un paio di occhi scuri,"
      },
      {
        "testo": "Che ö ciamesse pe nomme e ö ghe dixesse:",
        "it": "Che la chiamasse per nome e le dicesse:"
      },
      {
        "testo": "«Avardite Didon, che ti nö a dûi!»",
        "it": "«Stai attenta Didone, che non duri!»"
      },
      {
        "testo": "E ûnn-a sbrazzoa in sce-ö teito a gh'annunziesse",
        "it": "E una civetta sul tetto le annunciasse"
      },
      {
        "testo": "A sô fin, cöi sô cênti e i sô lûi...",
        "it": "La sua fine, coi suoi pianti e i suoi ululati ..."
      },
      {
        "testo": "A s'assunava d'ëse sola e spersa,",
        "it": "Si sognava di essere sola e sperduta,"
      },
      {
        "testo": "E ö casto Enea che ö sprexiava a guersa.",
        "it": "E il casto Enea che le disprezzava la guercia."
      },
      {
        "testo": "E veddeiva coscì, coscì pensava",
        "it": "E vedeva così, così pensava"
      },
      {
        "testo": "Quello veggetto, che aviei visto a seia,",
        "it": "Quel vecchietto, che avrete visto la sera,"
      },
      {
        "testo": "Che ö piccava bacchæ, che ö s'arraggiava",
        "it": "Che tirava bastonate, che si arrabbiava"
      },
      {
        "testo": "Perché i batösi ghe dixeivan Neia:",
        "it": "Perché i maranza gli dicevano \"Neia\":"
      },
      {
        "testo": "Che ö no pueiva dormî, che ö nö mangiava",
        "it": "Che non poteva dormire, che non mangiava,"
      },
      {
        "testo": "Che ö criava sempre da vegnighe a peia,",
        "it": "Che gridava sempre da farsi venir male,"
      },
      {
        "testo": "Credendo de sentî sempre ûn batöso",
        "it": "Credendo di sentire sempre un maranza"
      },
      {
        "testo": "Che ö ghe sbraggiasse questo nomme odioso.",
        "it": "Che gli sbraitasse questo nome odioso."
      },
      {
        "testo": "Coscì, a povia Didon, missa a quaterno",
        "it": "Così, la povera Didone, messa alle corde"
      },
      {
        "testo": "A commensa a piggiâ e disposizion",
        "it": "Comincia a prendere le disposizioni"
      },
      {
        "testo": "Pe levâse ädreitûa da quest'inferno",
        "it": "Per levarsi addirittura da quest'inferno"
      },
      {
        "testo": "Da questa vitta de tribulazion;",
        "it": "Da questa vita di tribolazioni;"
      },
      {
        "testo": "E sforzandose a rîe, calma all'esterno,",
        "it": "E sforzandosi di ridere, calma all'esterno,"
      },
      {
        "testo": "Ascondendo i sô affanni e e sô pascioin,",
        "it": "Nascondendo i suoi affanni e la sua passione,"
      },
      {
        "testo": "Anna, a dixe a so sœû, da chi in avanti",
        "it": "\"Anna\", dice a sua sorella, \"da qui in avanti"
      },
      {
        "testo": "Vœûggio futtime a reo de tûtti quanti!",
        "it": "Voglio fottermene altamente di tutti quanti!\""
      },
      {
        "testo": "Mi conoscio ûnn-a Singa, ûnn-a donninn-a",
        "it": "Io conosco una Zingara, una donnina"
      },
      {
        "testo": "Proprio dö paise de Fontannabonn-a",
        "it": "Proprio del paese di Fontanabuona"
      },
      {
        "testo": "Che a l’é stæta cantante e ballerinn-a,",
        "it": "Che è stata cantante e ballerina,"
      },
      {
        "testo": "Scin che a pûeiva pagâ da so personn-a",
        "it": "Finché poteva pagare di persona,"
      },
      {
        "testo": "Poi fiorista da stradde e chellerinn-a",
        "it": "Poi fiorista da strada e cameriera"
      },
      {
        "testo": "E da vegia, a s'inzegna e a l'appixonn-a",
        "it": "E da vecchia, si ingegna e affitta"
      },
      {
        "testo": "De stanze a di remorchi e che a sa l'arte",
        "it": "Delle stanze a dei rimorchi e che sa l'arte"
      },
      {
        "testo": "D'annunzia l'avvegnî, faxendo e carte.",
        "it": "Di annunciare l'avvenire, facendo le carte."
      },
      {
        "testo": "Lë a sa fâ di pacciûghi e di manezzi",
        "it": "Lei sa fare dei pacciughi e dei maneggi"
      },
      {
        "testo": "Con di baggi sciacchê, de cöe de bisce,",
        "it": "Con dei rospi schiacciati, con code di bisce,"
      },
      {
        "testo": "E co-e paole segrette e co-i strionezzi",
        "it": "E con le parole segrete e con le stregonerie"
      },
      {
        "testo": "A te i mette a buggî, misce e remisce,",
        "it": "Te li mette a bollire, mescola e rimescola,"
      },
      {
        "testo": "Che a pœû fâ cose a vœû co-i sô strionezzi,",
        "it": "Che può fare quello che vuole con le sue stregonerie,"
      },
      {
        "testo": "Fâ che nasce l'amö, che ö scomparisce,",
        "it": "Fare che nasca l'amore, che scompaia,"
      },
      {
        "testo": "Che se mesce e montagne e vive i morti,",
        "it": "Che si muovano le montagne e vivano i morti,"
      },
      {
        "testo": "Addrizzà a testa a-e donne e gambe a-i storti.",
        "it": "Raddrizzare la testa alle donne e le gambe agli storti."
      },
      {
        "testo": "Mi te zûo, figgia caa, che nö vorrieivo",
        "it": "Io ti giuro, cara ragazza, che non vorrei"
      },
      {
        "testo": "Sottomettime a questi incantamenti,",
        "it": "Sottomettermi a questi incantesimi,"
      },
      {
        "testo": "Ma nö veddo âtra stradda e nö trovieivo",
        "it": "Ma non vedo altra strada e non troverei"
      },
      {
        "testo": "Atra cûra adattâ pe i mæ tormenti,",
        "it": "Altra cura adatta per i miei tormenti,"
      },
      {
        "testo": "Dunque famme ö piaxei, che mi gradieivo",
        "it": "Dunque fammi il piacere, ché io gradirei"
      },
      {
        "testo": "Fâ ö strionezzo in ti reali appartamenti,",
        "it": "Fare la stregoneria nei reali appartamenti,"
      },
      {
        "testo": "Çerca un locale spazioso, averto",
        "it": "Cerca un locale spazioso, aperto,"
      },
      {
        "testo": "Anzi ciû che se pœu, ben a-o scoverto.",
        "it": "Anzi più che si può, ben allo scoperto."
      },
      {
        "testo": "Ammûggiando de legne in abbondanza,",
        "it": "Ammucchiando della legna in abbondanza,"
      },
      {
        "testo": "Comme ti fæsci pe componn-e ûn fôu,",
        "it": "Come faresti per comporre un falò,"
      },
      {
        "testo": "Piggia e armi che ho appeiso in ta mæ stanza",
        "it": "Prendi le armi che ho appeso nella mia stanza"
      },
      {
        "testo": "E che quello brûtö ö m'ha regalôu,",
        "it": "E che quel vile mi ha regalato,"
      },
      {
        "testo": "Tûtta a roba che a l'ëa de sô spettanza",
        "it": "Tutta la roba che era di sua spettanza"
      },
      {
        "testo": "Scinn-a ö letto in to quæ ö m'ha trombôu",
        "it": "Fino al letto nel quale mi ha trombata"
      },
      {
        "testo": "Perché s’é dito e combinoû co-a singa,",
        "it": "Perché si è detto e concordato con la zingara,"
      },
      {
        "testo": "Che no reste de lë manco ûnn-a stringa",
        "it": "Che non resti di lui nemmeno una stringa."
      },
      {
        "testo": "E so sœû, che a n'aviæ mai ciû credûo",
        "it": "E sua sorella, che non avrebbe mai creduto"
      },
      {
        "testo": "Che a l'avesse de idee coscì barbinn-e,",
        "it": "Che avesse delle idee così miserabili,"
      },
      {
        "testo": "Senza fâ osservazioin, lì in sce ö tambûo,",
        "it": "Senza fare osservazioni, lì sulla pedana"
      },
      {
        "testo": "A se mette a ammuggiâ legne e fascinn-e,",
        "it": "Si mette ad ammucchiare legna e fascine,"
      },
      {
        "testo": "Mentre a povia Didon con dö velûo,",
        "it": "Mentre la povera Didone con del velluto,"
      },
      {
        "testo": "Con da sgarza, de frange e de tendinn-e,",
        "it": "Con della garza, delle frange e delle tendine,"
      },
      {
        "testo": "A ghe fâ tûtt'ingïo ciocche e festoin",
        "it": "Fa tutt'in giro decorazioni e festoni"
      },
      {
        "testo": "Comme s'ûsa in te gexe in te funzioin.",
        "it": "Come si usa nelle chiese durante le funzioni."
      },
      {
        "testo": "Savendo a sorte che a ghe vueiva fâ,",
        "it": "Sapendo la sorte che voleva fare loro,"
      },
      {
        "testo": "A fâ mette in sce-a pira e braghe e mûande,",
        "it": "Fa mettere sulla pira i pantaloni e le mutande,"
      },
      {
        "testo": "Ö ritræto d'Enea, cö scuddo e a spâ,",
        "it": "Il ritratto di Enea, con lo scudo e la spada,"
      },
      {
        "testo": "E a-e adorna de ramme e de ghirlande",
        "it": "E le adorna di rami e di ghirlande"
      },
      {
        "testo": "De cipresso, de pigna e de cornâ,",
        "it": "Di cipresso, di pino e di corniolo,"
      },
      {
        "testo": "Che mostravan e pigne e balle e giande,",
        "it": "Che mostravano le pigne, le palle e le ghiande,"
      },
      {
        "testo": "Vöendo forse onorâ, con quest'idea,",
        "it": "Volendo forse onorare, con quest'idea,"
      },
      {
        "testo": "Ûnn-a de doti ciû apprexiæ d'Enea.",
        "it": "Una delle doti più apprezzate di Enea."
      },
      {
        "testo": "Lì gh'ëa a singä presente e abberûffâ,",
        "it": "Lì c'era la zingara presente e arruffata,"
      },
      {
        "testo": "Che a fava di atti e che a mostrava i denti,",
        "it": "Che faceva dei versi e che mostrava i denti,"
      },
      {
        "testo": "Tiando zù di sacranoin da fâ tremâ",
        "it": "Tirando giù dei bestemmioni da far tremare"
      },
      {
        "testo": "Tûtta a casa, da-o teito aî fondamenti,",
        "it": "Tutta la casa, dal tetto alle fondamenta,"
      },
      {
        "testo": "E a bruxiava dell'erba attœscegâ,",
        "it": "E bruciava dell'erba avvelenata,"
      },
      {
        "testo": "Che a ve fâva vegnî mille aççidenti,",
        "it": "Che vi faceva venire mille accidenti,"
      },
      {
        "testo": "Cön di siôti, di inguenti e de pomæ",
        "it": "Con degli impiastri, degli unguenti e delle pomate,"
      },
      {
        "testo": "Cuggie d'aze, galösci e beli cûæ.",
        "it": "Coglioni d'asino, sterco e budella."
      },
      {
        "testo": "E a reginn-a descâsa e quæxi nûa,",
        "it": "E la regina scalza e quasi nuda,"
      },
      {
        "testo": "Nö pensando che a fin che a vûeiva fâ",
        "it": "Non pensando che alla fine che voleva fare"
      },
      {
        "testo": "A ghe versa de dâto ûnn-a mescciûa",
        "it": "Ci versa sopra una mistura"
      },
      {
        "testo": "Fæta de gran, con di mottin de sâ,",
        "it": "Fatta di grano, con dei pugnetti di sale,"
      },
      {
        "testo": "E pregando, se in çe gh'é chi se cûa",
        "it": "E pregando, se in cielo c'è chi si cura"
      },
      {
        "testo": "D'ûnn'amante sedûta e abbandonâ,",
        "it": "Di un'amante sedotta e abbandonata,"
      },
      {
        "testo": "Perché ö l'aggie in memoia e ö tegne conto",
        "it": "Affinché lo tenga a memoria e tenga conto"
      },
      {
        "testo": "Da fin che a deve fâ pe quest'affronto.",
        "it": "Della fine che deve fare per questo affronto."
      },
      {
        "testo": "L'ëa passôu mezanœûtte e tæra e mâ,",
        "it": "Era passata mezzanotte, e terra e mare,"
      },
      {
        "testo": "Ö Creoû, contegnûo cö continente,",
        "it": "Il Creato, contenuto e contenente,"
      },
      {
        "testo": "Tûtte e bestie e i cristien che pe mangiâ",
        "it": "Tutte le bestie e i cristiani che per mangiare"
      },
      {
        "testo": "Se devan fötte vicendevolmente,",
        "it": "Si devono fottere  vicendevolmente,"
      },
      {
        "testo": "Ëan zà andæti in tö cûccio a riposâ,",
        "it": "Erano già andati a riposare nella cuccia,"
      },
      {
        "testo": "E ghe a cioccavan saporitamente,",
        "it": "E ci davano dentro saporitamente,"
      },
      {
        "testo": "Mentre invece Didon, neigra da raggia,",
        "it": "Mentre invece Didone, nera di rabbia,"
      },
      {
        "testo": "A nö posa, a nö quieta, a nö pisaggia.",
        "it": "Non riposa, non sta quieta, non si appisola."
      },
      {
        "testo": "E co-a nœûtte crescendo in lë ö brûxö",
        "it": "E con la notte crescendo in lei il bruciore"
      },
      {
        "testo": "D'ëse stæta tradîa coscì vilmente,",
        "it": "Di essere stata tradita così vilmente,"
      },
      {
        "testo": "A se mette a sbraggiâ: che bell'ônö,",
        "it": "Si mette a sbraitare: che bell'onore,"
      },
      {
        "testo": "Mîa che figûa che ö me fa fâ co-a gente!",
        "it": "Guarda che figura che mi fa fare con la gente!"
      },
      {
        "testo": "Chi ghe sâ, chi troviô tanto brûtö",
        "it": "Chi ci sarà, chi troverò di così sfigato"
      },
      {
        "testo": "De bonn-a bocca de voei dâme a mente,",
        "it": "Di bocca buona da voler prendersi cura di me,"
      },
      {
        "testo": "De sposâme avvilîa comme ö me lascia,",
        "it": "Da sposarmi avvilita come lui mi lascia,"
      },
      {
        "testo": "Che nö me resta che de fâ a bagascia?",
        "it": "Che non mi resta che fare la bagascia?"
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 12",
      "it": "Enea salpa "
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Chi porriô ciû sposâ di mæ galanti,",
        "it": "Chi potrò più sposare dei miei pretendenti,"
      },
      {
        "testo": "Forse ûn arabo, ûn neigro, ûn canellon?",
        "it": "Forse un arabo, un nero, un cazzone?"
      },
      {
        "testo": "Ma se ho fæto zà e corne a tûtti quanti,",
        "it": "Ma se ho già fatto le corna a tutti quanti,"
      },
      {
        "testo": "Me mandian a fâ fûtte e con raxon;",
        "it": "Mi manderanno a farmi fottere e con ragione;"
      },
      {
        "testo": "Doviô andâ coi troien pe-o mondo erranti",
        "it": "Dovrò andare coi troiani per il mondo erranti"
      },
      {
        "testo": "Solo a faghe da serva e da striggion?",
        "it": "Solo per fargli da serva e da sguattera?"
      },
      {
        "testo": "Perché ogni siôto ö me tambûsce ö sezze,",
        "it": "Perché ogni lurido mi dia pacche nel sedere,"
      },
      {
        "testo": "Me spelinsighe e scciappe e ö me purpuezze?",
        "it": "Mi pizzichi le chiappe e mi palpeggi?"
      },
      {
        "testo": "Partiô insemme co-i mæ in sce ûn bastimento",
        "it": "Partirò insieme ai miei su un bastimento"
      },
      {
        "testo": "Quande commensan a piggiâ respìo?",
        "it": "Quando cominciano a prendere respiro?"
      },
      {
        "testo": "Senza scopo, raxon, senza argomento",
        "it": "Senza scopo, ragione, senza argomento"
      },
      {
        "testo": "Doviô törna con mi, portali in gîo?",
        "it": "Dovrò di nuovo portarli in giro con me?"
      },
      {
        "testo": "Nö, ciûttosto se creppe in sce ö momento,",
        "it": "No, piuttosto si crepi sul momento,"
      },
      {
        "testo": "Ûnn-a lamma che a taggie, ûn colpo e addio",
        "it": "Una lama che tagli, un colpo e addio"
      },
      {
        "testo": "Chi ë in te peste ghe stagghe e che ö s'inzegne.",
        "it": "Chi è nelle peste ci stia e si ingegni."
      },
      {
        "testo": "E chi l'ha in tö stöppin che se ghe ö tegne.",
        "it": "E chi l'ha nello stoppino se lo tenga."
      },
      {
        "testo": "L'ëa con tante raxioin, che a-o sô tormento",
        "it": "Era con questi argomenti, che al suo tormento"
      },
      {
        "testo": "Dava sfœûgo a reginn-a abbandonâ",
        "it": "Dava sfogo la regina abbandonata,"
      },
      {
        "testo": "Quand'Enea che ö l'ëa zà in sce ö bastimento,",
        "it": "Quando Enea, che era già sul bastimento,"
      },
      {
        "testo": "E ö s'ëa misso in sce a poppa a pisaggiâ,",
        "it": "E si era messo sulla poppa a sonnecchiare,"
      },
      {
        "testo": "Ö se vedde davanti in t'ûn momento",
        "it": "Si vede davanti in un momento"
      },
      {
        "testo": "Torna quella figûa de mandillâ",
        "it": "Di nuovo quella figura da tagliaborse"
      },
      {
        "testo": "Che ö l'aveiva zà visto ûn'atra votta,",
        "it": "Che aveva già visto un'altra volta,"
      },
      {
        "testo": "Mandôu da Giove pe insegnaghe a rotta.",
        "it": "Mandato da Giove per insegnargli la rotta."
      },
      {
        "testo": "E ö ghe torna a ripete: ah canellon,",
        "it": "E gli ripete di nuovo: ah cazzone,"
      },
      {
        "testo": "Chi dorme, figgio cao, nö piggia pesci,",
        "it": "Chi dorme, figlio caro, non piglia pesci,"
      },
      {
        "testo": "E ö dà ûn câsö â fortûnn-a e all'occaxiön!",
        "it": "E dà un calcio alla fortuna e all'occasione!"
      },
      {
        "testo": "Mentre che ti stæ a torse e ti nö mesci,",
        "it": "Mentre tu stai lì a rigirarti e non ti muovi,"
      },
      {
        "testo": "Forse aspettando de piggiâ ö lacciön,",
        "it": "Forse aspettando di prendere la fregatura,"
      },
      {
        "testo": "Ghe a reginn-a, se tì ti nö savesci,",
        "it": "C'è la regina, se tu non lo sapessi,"
      },
      {
        "testo": "Che a l'aspëta ö momento ö ciû propizio",
        "it": "Che aspetta il momento più propizio"
      },
      {
        "testo": "Pe puei fate in te l'ortö, ûn çerto ûffizio.",
        "it": "Per poterti fare nell'orto, un certo servizio."
      },
      {
        "testo": "E ti stæ chi a lappâ perdingolinn-a!",
        "it": "E tu te ne stai qui a poltrire, perdiana!"
      },
      {
        "testo": "Quande ti æ l'occaxion de piggiâ ö lisciö?",
        "it": "Quando hai l'occasione di svignartela?"
      },
      {
        "testo": "Se a te trœûva ancon chi doman mattinn-a,",
        "it": "Se ti trova ancora qui domani mattina,"
      },
      {
        "testo": "Ti ë ûn ommo morto e ti finiæ in tö pisciö;",
        "it": "Sei un uomo morto e finirai nel pisciatoio;"
      },
      {
        "testo": "Ma se poi ti æ piaxei da tô rovinn-a",
        "it": "Ma se poi ti piace la tua rovina,"
      },
      {
        "testo": "Mi nö so cose dî, te compatisciö,",
        "it": "Io non so cosa dire, ti compatirò,"
      },
      {
        "testo": "Anzi d'incangio, me ne batto e cugge",
        "it": "Anzi, in cambio, me ne sbatto le palle"
      },
      {
        "testo": "E te pisciö in tö cû ciaö bullicugge.",
        "it": "E ti piscerò in culo, ciao rincoglionito."
      },
      {
        "testo": "Coscì dito, ö deslengua e ö casto Enea",
        "it": "Così detto, lui si dilegua e il casto Enea"
      },
      {
        "testo": "Ö se mette in setton, pin de spavento,",
        "it": "Si mette seduto di scatto, pieno di spavento,"
      },
      {
        "testo": "Ö se leva, ö trambuscia, ö fâ in manëa",
        "it": "Si alza, fa trambusto, fa in modo"
      },
      {
        "testo": "Che s'adesce i mainæ dö bastimentö",
        "it": "Che si sveglino i marinai del bastimento,"
      },
      {
        "testo": "E ö se mette a sbraggiâ: tiæ sciû a bandea,",
        "it": "E si mette a sbraitare: tirate su la bandiera,"
      },
      {
        "testo": "Remme in mâ perdiesanto, e veie a-o ventö,",
        "it": "Remi in mare, per Dio santo, e vele al vento,"
      },
      {
        "testo": "Nö l'é tempo de stâ co-e balle in man",
        "it": "Non è tempo di stare con le palle in mano"
      },
      {
        "testo": "Chi besœûgna fâ presto e futte ö can.",
        "it": "Qui bisogna far presto e svignarsela."
      },
      {
        "testo": "E pe fâ come ö dixe, ö dà ûnn-a botta",
        "it": "E per fare come dice, dà un colpo"
      },
      {
        "testo": "In sce ö cavo, co-a sciabbra e ö te l'arrionda.",
        "it": "Sul cavo, con la sciabola, e te lo trancia."
      },
      {
        "testo": "Fan ö stesso i compagni e in t'ûnn-a votta",
        "it": "Fanno lo stesso i compagni e in una volta"
      },
      {
        "testo": "Son tûtti i legni destacchæ dâ sponda,",
        "it": "Sono tutti i legni staccati dalla sponda,"
      },
      {
        "testo": "Se tia sciû e veie, se ghe molla a scotta,",
        "it": "Si tirano su le vele, si molla la scotta,"
      },
      {
        "testo": "Pe piggiâ ö ventixœû che ö te i seconda,",
        "it": "Per prendere il venticello che li asseconda,"
      },
      {
        "testo": "E poi forza de remme, aggiûtta, arranca,",
        "it": "E poi forza di remi, aiuta, arranca,"
      },
      {
        "testo": "Scciûmma l'ægûa coscì, che a ve pâ gianca.",
        "it": "Schiuma l'acqua così, che vi pare bianca."
      },
      {
        "testo": "In t'ûn giano che ö dava in sce ö çetron",
        "it": "In un giallo che dava sull'arancione"
      },
      {
        "testo": "L'ombra opaca da nœûtte a s'ëa cangiâ;",
        "it": "L'ombra opaca della notte si era cambiata;"
      },
      {
        "testo": "E a reginn-a che a s'ëa missa a-o barcon",
        "it": "E la regina, che si era messa alla finestra"
      },
      {
        "testo": "Pe godise l'æxia da mattinnâ,",
        "it": "Per godersi l'arietta della mattinata,"
      },
      {
        "testo": "A s'accorze d'aveilo in tö fogon",
        "it": "Si accorge di averlo nel fogone"
      },
      {
        "testo": "Senza pueiselo ciû despûntellâ,",
        "it": "Senza poterselo più staccare,"
      },
      {
        "testo": "In tö vedde i Troien, za fœûa de tîo,",
        "it": "Nel vedere i Troiani, già fuori tiro,"
      },
      {
        "testo": "Che ghe davan de remme a tûtt'abrîö,",
        "it": "Che ci davano di remi a tutta birra."
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-3-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2-parte-2",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese libro 2 parte 13",
      "it": "La maledizione di Didone"
    },
    "fonte": {
      "generato": "autentico",
      "modello": "claude-sonnet-5",
      "note": "",
      "autore": "Nicolò Bacigalupo (1837–1904)",
      "riferimento": "liber liber",
      "licenza": "no"
    },
    "frasi": [
      {
        "testo": "Aoa ve lascio immaginâ ûn pittin",
        "it": "Ora vi lascio immaginare un pochino"
      },
      {
        "testo": "Comme a resta incarognâ e inscemelîa!",
        "it": "Come resta incarognita e inebetita!"
      },
      {
        "testo": "Poi a vegne ûnn-a fûria da-o venin,",
        "it": "Poi diventa una furia dal veleno,"
      },
      {
        "testo": "A se streppa i cavelli e a te s'abrîa",
        "it": "Si strappa i capelli e inizia a darsi"
      },
      {
        "testo": "De pattasse pe-a faccia e pe-i tettin,",
        "it": "Delle sberle per la faccia e per le tette,"
      },
      {
        "testo": "A se sguara a camixia, a cianze, a crîa:",
        "it": "Si squarcia la camicia, piange, grida:"
      },
      {
        "testo": "Brûtô d'ûn Giove, ti me vorti e spalle?",
        "it": "Vile d'un Giove, mi volti le spalle?"
      },
      {
        "testo": "Se te posso acciappâ, t'arranco e balle.",
        "it": "Se ti posso acchiappare, ti strappo le palle."
      }
    ]
  },
  {
    "id": "sp-a2-padrone-e-mezzadro4",
    "lingua": "sp",
    "livello": "A2",
    "tema": "",
    "titolo": {
      "testo": "Patron e mezadro",
      "it": "Padrone e mezzadro"
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
        "it": "Quest'anno, signor padrone, è un gramo affare!"
      },
      {
        "testo": "E oive i n’han brica, e ’nquanto a l’üa,",
        "it": "Gli olivi non ne hanno niente, e in quanto all'uva,"
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
        "it": "Del granturco non c'è  nemmeno più la polvere,"
      },
      {
        "testo": "E castagne s’i n’han, posti crepae,",
        "it": "e i castagni, se ne hanno, ch'io possa crepare!,"
      },
      {
        "testo": "E ’nca de ciü la m’è ’nca morta a müa,",
        "it": "e per di più mi è anche morta la mula,"
      },
      {
        "testo": "E a vaca la ne posse ’ngravedae.",
        "it": "e la vacca non riuscì a ingravidare ."
      },
      {
        "testo": "Donca siché, ’oi die, Ussignoia",
        "it": "Dunque sicché, voglio dire, Vossignoria,"
      },
      {
        "testo": "’Nta che la se daga ’n po’ passensia",
        "it": "occorre che Lei porti un po' di pazienza,"
      },
      {
        "testo": "Se anguano ne ghe toca n’assidente.",
        "it": "se quest'anno non le tocca un accidente."
      },
      {
        "testo": "Donca a me ’n vago, adio. -Ma dame odensia:",
        "it": "Dunque me ne vado, addio. — Ma dammi udienza:"
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
        "it": "Pian pianino",
        "audio": "cian-cianin-01.webm"
      },
      {
        "testo": "andemo fino aa Ciapa",
        "it": "andiamo fino alla Chiappa",
        "audio": "cian-cianin-02.webm"
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
  },
  {
    "id": "cr-a1-bastian-contrari-4",
    "lingua": "cr",
    "livello": "A1",
    "tema": "poesia",
    "titolo": {
      "testo": "'L Bastian contrari",
      "it": " Il Bastian contrario"
    },
    "fonte": {
      "generato": "autentico",
      "autore": "Auda Fucigna",
      "riferimento": "'L cararin. Artigianelli, 1968",
      "licenza": ""
    },
    "frasi": [
      {
        "testo": "Tor d' chi è sta 'l Bastian:",
        "it": "In questi pressi abita il Bastiano:"
      },
      {
        "testo": "si è un gat i t' diz chi è un can,",
        "it": "se è un gatto ti dice che è un cane,"
      },
      {
        "testo": "si i è bianch il dà p'r ner",
        "it": "se è bianco lo dà per nero,"
      },
      {
        "testo": "si i è un fich p'r lù i è un per.",
        "it": "se è un fico per lui è una pera."
      },
      {
        "testo": "An s' sa propi come far!",
        "it": "Non si sa proprio come fare!"
      },
      {
        "testo": "I sirè da bastonar:",
        "it": "Sarebbe da bastonare:"
      },
      {
        "testo": "diri po' chi n'è un baston,",
        "it": "dirgli poi che non è un bastone,"
      },
      {
        "testo": "ma 'na filza d' macaron!!",
        "it": "ma una filza di maccheroni."
      }
    ]
  }
];

// ── Export per browser + Node ────────────────────────────────────────────

const _exportsStorie = { STORIE_DEFAULT };
Object.assign(globalThis, _exportsStorie);
if (typeof module !== "undefined" && module.exports) module.exports = _exportsStorie;
