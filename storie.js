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
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 1 parte 1",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
      },
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
      },
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
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 1 parte 2",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
      },
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
      }
    ]
  },
  {
    "id": "ge-a1-eneide-1-parte-3",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 1 parte 3",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 2 parte 1",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese "
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
      },
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
        "it": "\"Ah vili, lunatici, ciechi in confusione,"
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
        "it": "Mettercelo da noi, ben ribattuto.\""
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
      }
    ]
  },
  {
    "id": "ge-a1-eneide-2-parte-2-parte",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 2 parte 2",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
      },
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
      },
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
      },
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
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 2 parte 3",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
        "it": "Con un'ascia in mano, questo coglione"
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
      },
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
      },
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
      }
    ]
  },
  {
    "id": "ge-a1-eneide-3-parte-1",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese atto 3 parte 1",
      "it": "Eneide: ricordi di un reduce troiano in dialetto genovese"
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
