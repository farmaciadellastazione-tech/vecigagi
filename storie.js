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
        "it": "Tutti han cercato dove posare il bacino,"
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
        "it": "E invece di raccontare di avvenimenti"
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
        "it": "Questa gentaglia di Greci avvelenati"
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
        "it": "Come tutti i farabutti e i borsaioli"
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
        "it": "ma lasciando i più bulli e i più battaglieri"
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
        "it": "questi incivili finalmente se ne vanno!"
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
        "it": "Chi da un lato e chi dall'altro a frugare;"
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
        "it": "Chi sì, chi no, si erano talmente avvelenati,"
      },
      {
        "testo": "Da dâse dö brütô, dö belinon",
        "it": "Da darsi del bruto, del belinone,"
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
        "it": "E con tutta la sua forza gliela molla"
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
        "it": "Tutt'a un tratto un gruppo di paesani"
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
        "it": "E loro da furbi , per sapere chi fosse,"
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
        "it": "Ammazzatemi ragazzi, ve lo scongiuro,"
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
        "it": "Aveva il singhiozzo, il broncio,"
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
        "it": "Cosa faceva, chi era, da dove venisse."
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
        "it": "Che io sono un belinöne raddoppiato cento volte ,"
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
        "it": "Per volontà del papà, l'ho accompagnato;"
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
        "it": "Che non sapevo più nemmeno io cosa dicessi!"
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
        "it": "Questo vile, questo bruto, di farmi la pelle;"
      },
      {
        "testo": "Nö ghe diô, cose ö l'agge immanegoû",
        "it": "Non vi dirò che cosa abbia immaginato"
      },
      {
        "testo": "De regii, perché desse in ciampanelle",
        "it": "Di raggiri, perché andassi in ciampanelle (impazzire)"
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
        "it": " l'oracolo di Delfi cosa disse;"
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
