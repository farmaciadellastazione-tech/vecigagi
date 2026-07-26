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
    "id": "ge-a1-eneide-4",
    "lingua": "ge",
    "livello": "A1",
    "tema": "",
    "titolo": {
      "testo": "Eneide: ricordi di un reduce troiano in dialetto genovese",
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
        "it": "Tutti han cercato dove posare il bacino (il sedere),"
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
        "it": "Ma se parlo, lo faccio per vossia (per voi)"
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
        "it": "Scusi l'espressione, ma qui ci sta,"
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
        "it": "Benché senta il magone serrarmi la gola"
      },
      {
        "testo": "E me vegne ö sappin comme ai figgiœû,",
        "it": "E mi venga il broncio come ai bambini,"
      },
      {
        "testo": "Se sciâ vœû che ghe conte, câ scignôa",
        "it": "Se lei vuole che glielo racconti, cara signora"
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
        "it": "Dal non potercelo più mettere di dietro,"
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
        "it": "Come tutti i farabutti e i borseggiatori"
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
        "it": "Con travi e tavole ben sistemate,"
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
        "it": "Han preso sporta e ferri e se la filarono,"
      },
      {
        "testo": "Ma lasciando i ciû bûlli e i ciû batôsi",
        "it": "ma lasciando i più bulli e i più battaglieri"
      },
      {
        "testo": "Dentro da pansa dö cavallo ascösi.",
        "it": "nascosti dentro la pancia del cavallo."
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
        "it": "C'era Diomede, qui quel ladro"
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
        "it": "Dei Greci e quel furfante d'Ulisse?\""
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
        "it": "Il cavallo per il colpo, scricchiola, scrolla,"
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
      },
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
        "it": "Con quella masnada di furfanti,"
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
        "it": "E da questo greco lei li conoscerà tutti,"
      },
      {
        "testo": "Cose son sti ruffien, sti farabûtti",
        "it": "Che razza di ruffiani, di farabutti."
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
