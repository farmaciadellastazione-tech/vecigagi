import { describe, it, expect } from 'vitest';
import {
  DIALETTI_TTS_ITA, DIALETTI_NUMERI, NUMERI_DIALETTO, FRASI_FINE_SP,
  soloVisibile, formaDisplay, formaTTS,
  normalizza, normalizzaDialetto, espandiContrazioni, normalizzaEn,
  convertiNumeriDialetto, wordKey, frasaFineSP,
} from '../vocab.js';

describe('DIALETTI_TTS_ITA / DIALETTI_NUMERI', () => {
  it('contiene esattamente mn/sp/ge/cr (dialetti senza TTS propria)', () => {
    expect(DIALETTI_TTS_ITA).toEqual(['mn', 'sp', 'ge', 'cr']);
  });

  it('DIALETTI_NUMERI è sottoinsieme di DIALETTI_TTS_ITA', () => {
    for (const cod of DIALETTI_NUMERI) {
      expect(DIALETTI_TTS_ITA).toContain(cod);
    }
  });

  it('mn esiste nei dialetti TTS ma NON in DIALETTI_NUMERI (non ha tabella numeri)', () => {
    expect(DIALETTI_TTS_ITA).toContain('mn');
    expect(DIALETTI_NUMERI).not.toContain('mn');
  });
});

describe('NUMERI_DIALETTO', () => {
  it('copre tutti i dialetti elencati in DIALETTI_NUMERI', () => {
    for (const cod of DIALETTI_NUMERI) {
      expect(NUMERI_DIALETTO[cod]).toBeDefined();
    }
  });

  it('ogni mappa dialetto copre 1-10', () => {
    for (const cod of DIALETTI_NUMERI) {
      const map = NUMERI_DIALETTO[cod];
      for (let i = 1; i <= 10; i++) {
        expect(map[String(i)], `${cod}/${i}`).toBeTruthy();
      }
    }
  });

  it('valori sp specifici (per regressione)', () => {
    expect(NUMERI_DIALETTO.sp['2']).toBe('dó');
    expect(NUMERI_DIALETTO.sp['10']).toBe('diése');
  });

  it('valori ge specifici', () => {
    expect(NUMERI_DIALETTO.ge['2']).toBe('dôe');
    expect(NUMERI_DIALETTO.ge['10']).toBe('diéxi');
  });

  it('valori cr specifici', () => {
    expect(NUMERI_DIALETTO.cr['2']).toBe('du');
    expect(NUMERI_DIALETTO.cr['10']).toBe('déxe');
  });
});

describe('soloVisibile — strip alternative dopo |', () => {
  it('senza | ritorna stringa intera', () => {
    expect(soloVisibile('cammino')).toBe('cammino');
  });

  it('con | tronca alla prima parte', () => {
    expect(soloVisibile('cammino|tragitto|distanza')).toBe('cammino');
  });

  it('trim degli spazi nella parte visibile', () => {
    expect(soloVisibile('cammino  |tragitto')).toBe('cammino');
  });

  it('input non-stringa passa attraverso', () => {
    expect(soloVisibile(null)).toBe(null);
    expect(soloVisibile(undefined)).toBe(undefined);
    expect(soloVisibile('')).toBe('');
  });
});

describe('formaTTS — cosa legge la TTS', () => {
  it('senza / legge tutta la stringa', () => {
    expect(formaTTS('madre')).toBe('madre');
    expect(formaTTS('mamma')).toBe('mamma');
  });

  it('con / legge SOLO la prima parte (es. dialetto: pronuncia)', () => {
    // sp:"camalàaee/camalae" -> TTS dice "camalàaee" (pronuncia fonetica)
    expect(formaTTS('camalàaee/camalae')).toBe('camalàaee');
    // En con sinonimi: TTS legge il primo, niente "slash"
    expect(formaTTS('mamma/madre')).toBe('mamma');
  });

  it("trucco d'z preservato per [z] sonoro nei dialetti liguri", () => {
    // sp:"d'zena/Zena" -> TTS dice "d'zena" (≈ [z]), grafia mostrata "Zena"
    expect(formaTTS("d'zena/Zena")).toBe("d'zena");
  });

  it('alternative nascoste (|) rimosse PRIMA del split', () => {
    expect(formaTTS('mamma|madre')).toBe('mamma');
    expect(formaTTS('mamma|madre/grafia')).toBe('mamma');
  });

  it('virgole e punto e virgola NON splittano (vanno lette per intero)', () => {
    // sp:"no, a chino ciü en là" deve essere letta tutta
    expect(formaTTS('no, a chino ciü en là')).toBe('no, a chino ciü en là');
    expect(formaTTS('un; due; tre')).toBe('un; due; tre');
  });

  it('input non-stringa passa attraverso', () => {
    expect(formaTTS(null)).toBe(null);
    expect(formaTTS('')).toBe('');
  });

  it('stringa con solo "/" ritorna stringa originale (no parts)', () => {
    expect(formaTTS('/')).toBe('/');
  });
});

describe('formaDisplay — cosa mostra la UI', () => {
  it('lingue non dialettali: mostra tutto (sinonimi inclusi)', () => {
    expect(formaDisplay('mamma/madre', 'it')).toBe('mamma/madre');
    expect(formaDisplay('branzin/branzino', 'cr')).toBe('branzino'); // cr È dialetto -> grafia
    expect(formaDisplay('big/large', 'en')).toBe('big/large');
  });

  it('dialetti: mostra solo la grafia tradizionale (ultima dopo /)', () => {
    expect(formaDisplay('camalàaee/camalae', 'sp')).toBe('camalae');
    expect(formaDisplay("d'zena/Zena", 'sp')).toBe('Zena');
    expect(formaDisplay('mn-fonetica/mn-grafia', 'mn')).toBe('mn-grafia');
  });

  it('dialetto senza / ritorna stringa intera', () => {
    expect(formaDisplay('belin', 'sp')).toBe('belin');
  });

  it('alternative nascoste (|) sempre rimosse, anche per dialetti', () => {
    expect(formaDisplay('camalàaee/camalae|alt', 'sp')).toBe('camalae');
    expect(formaDisplay('mamma|madre', 'it')).toBe('mamma');
  });

  it('input non-stringa passa attraverso', () => {
    expect(formaDisplay(null, 'sp')).toBe(null);
    expect(formaDisplay('', 'sp')).toBe('');
  });
});

describe('normalizza — risposta utente per match', () => {
  it('lowercase + trim + accenti rimossi', () => {
    expect(normalizza('Caffè  ')).toBe('caffe');
    expect(normalizza('Età')).toBe('eta');
    expect(normalizza('Però')).toBe('pero');
    expect(normalizza('Più')).toBe('piu');
  });

  it('rimuove punteggiatura non-lettera', () => {
    expect(normalizza("L'amico")).toBe('lamico');
    expect(normalizza('"ciao!"')).toBe('ciao');
  });

  it('trattini e underscore diventano spazi (poi collassati)', () => {
    expect(normalizza('ben-fatto')).toBe('ben fatto');
    expect(normalizza('ben_fatto')).toBe('ben fatto');
  });

  it('spazi multipli collassati', () => {
    expect(normalizza('  ciao    mondo  ')).toBe('ciao mondo');
  });
});

describe('normalizzaDialetto — strip prefissi fonetici', () => {
  it('rimuove gh, sc, sgn, gn iniziali', () => {
    expect(normalizzaDialetto("gh'aggio")).toBe('aggio');
    expect(normalizzaDialetto("sc'eta")).toBe('eta');
    expect(normalizzaDialetto('sgnore')).toBe('ore');
    expect(normalizzaDialetto('gnocco')).toBe('occo');
  });

  it('parole senza prefisso fonetico restano (oltre alla normalizzazione standard)', () => {
    expect(normalizzaDialetto('belin')).toBe('belin');
    expect(normalizzaDialetto('mamma')).toBe('mamma');
  });

  it('prefisso applicato solo in posizione iniziale', () => {
    // "leggh" contiene "gh" ma non in inizio -> non strippato
    expect(normalizzaDialetto('leggh')).toBe('leggh');
  });
});

describe('espandiContrazioni — contrazioni inglesi', () => {
  it('forme negative comuni', () => {
    expect(espandiContrazioni("I don't know")).toBe('I do not know');
    // can't -> "cannot" -> "can not" (catena .replace, vedi source)
    expect(espandiContrazioni("can't")).toBe('can not');
    expect(espandiContrazioni("won't")).toBe('will not');
    expect(espandiContrazioni("isn't")).toBe('is not');
  });

  it('soggetti + verbi modali / essere (replacement string sempre lowercase)', () => {
    // Tutti i replacement nella catena sono in minuscolo, quindi "I'm" → "i am".
    // Non è un problema perché espandiContrazioni viene chiamata DENTRO normalizzaEn,
    // che a sua volta applica normalizza() (lowercase). La perdita di case è ininfluente.
    expect(espandiContrazioni("I'm")).toBe('i am');
    expect(espandiContrazioni("you're")).toBe('you are');
    expect(espandiContrazioni("they've")).toBe('they have');
    expect(espandiContrazioni("we'd")).toBe('we would');
  });

  it('case insensitive', () => {
    expect(espandiContrazioni("DON'T")).toBe('do not');
    expect(espandiContrazioni("I'VE")).toBe('i have');
  });

  it('parole senza contrazioni invariate', () => {
    expect(espandiContrazioni('hello world')).toBe('hello world');
  });
});

describe('normalizzaEn — match verbi inglesi', () => {
  it('rimuove "to " iniziale', () => {
    expect(normalizzaEn('to eat')).toBe('eat');
    expect(normalizzaEn('to be')).toBe('be');
  });

  it('senza "to " invariato (dopo normalizza)', () => {
    expect(normalizzaEn('eat')).toBe('eat');
  });

  it('espande contrazioni prima di normalizzare', () => {
    expect(normalizzaEn("I'm happy")).toBe('i am happy');
    expect(normalizzaEn("don't worry")).toBe('do not worry');
  });

  it('"to" interno NON rimosso (solo all\'inizio)', () => {
    expect(normalizzaEn('go to work')).toBe('go to work');
  });
});

describe('convertiNumeriDialetto', () => {
  it('cifre 1-10 mappate in spezzino', () => {
    expect(convertiNumeriDialetto('2', 'sp')).toBe('dó');
    expect(convertiNumeriDialetto('5', 'sp')).toBe('sénco');
  });

  it('cifre 1-10 mappate in genovese', () => {
    expect(convertiNumeriDialetto('2', 'ge')).toBe('dôe');
    expect(convertiNumeriDialetto('7', 'ge')).toBe('sètte');
  });

  it('cifre 1-10 mappate in carrarino', () => {
    expect(convertiNumeriDialetto('2', 'cr')).toBe('du');
    expect(convertiNumeriDialetto('10', 'cr')).toBe('déxe');
  });

  it('codici non dialettali ritornano testo invariato', () => {
    expect(convertiNumeriDialetto('2', 'it')).toBe('2');
    expect(convertiNumeriDialetto('2', 'en')).toBe('2');
    expect(convertiNumeriDialetto('hello', 'fr')).toBe('hello');
  });

  it('codice dialetto ma testo non-numerico ritorna invariato', () => {
    expect(convertiNumeriDialetto('ciao', 'sp')).toBe('ciao');
    expect(convertiNumeriDialetto('11', 'sp')).toBe('11'); // 11 non in mappa
  });

  it('trim del testo prima del lookup', () => {
    expect(convertiNumeriDialetto('  2  ', 'sp')).toBe('dó');
  });
});

describe('wordKey — chiave SM-2 stabile', () => {
  it('preferisce campo .it', () => {
    expect(wordKey({ it: 'casa', en: 'house' })).toBe('casa');
  });

  it('cade su .en se .it manca', () => {
    expect(wordKey({ en: 'house', fr: 'maison' })).toBe('house');
  });

  it('cade su primo valore stringa non vuoto se né it né en', () => {
    expect(wordKey({ fr: 'maison', de: 'haus' })).toBe('maison');
  });

  it('soloVisibile applicato: alternative dopo | non entrano nella chiave', () => {
    expect(wordKey({ it: 'cammino|tragitto', en: 'path' })).toBe('cammino');
  });

  it('valori non-stringa skippati', () => {
    expect(wordKey({ livello: 3, tema: { x: 1 }, it: 'casa' })).toBe('casa');
  });
});

describe('frasaFineSP — frase scherzosa per percentuale', () => {
  it('punteggio alto (≥80) → frase positiva', () => {
    const r = frasaFineSP(95);
    expect(r).toBeDefined();
    expect(r.vis).toBe("belina deh, e chi t'ei?");
  });

  it('punteggio medio (50-79) → frase media', () => {
    const r = frasaFineSP(65);
    expect(r).toBeDefined();
    expect(r.vis).toBe('mia che te mio  ocio');
  });

  it('punteggio basso (≤49) → una delle 3 frasi basse', () => {
    const expected = new Set(['ma costefé??', 'te me pai n\'ase', 't\'ei un pagiasso']);
    const r = frasaFineSP(20);
    expect(r).toBeDefined();
    expect(expected.has(r.vis)).toBe(true);
  });

  it('confini fasce: 80 → alta, 79 → media, 50 → media, 49 → bassa', () => {
    expect(frasaFineSP(80).min).toBe(80);
    expect(frasaFineSP(79).vis).toBe('mia che te mio  ocio');
    expect(frasaFineSP(50).vis).toBe('mia che te mio  ocio');
    // 49 cade in bassa
    const r = frasaFineSP(49);
    expect(r.max).toBe(49);
  });

  it('ogni voce ha campo tts e vis', () => {
    for (const f of FRASI_FINE_SP) {
      expect(f.tts, 'tts').toBeTruthy();
      expect(f.vis, 'vis').toBeTruthy();
    }
  });
});

describe('FRASI_FINE_SP — integrità dati', () => {
  it('copertura completa 0-100: ogni percentuale ha almeno una frase', () => {
    for (let p = 0; p <= 100; p++) {
      const r = frasaFineSP(p);
      expect(r, `percentuale ${p} senza frase`).not.toBeNull();
    }
  });
});
