// COPIA di riferimento dello script Google Apps Script dei contributi.
// Il codice vero gira su script.google.com (progetto collegato a
// SCRIPT_DIALETTI in index.html); questa copia serve a ripristinarlo se si
// rompe. Storia: fino al 2026-10-15 il progetto conteneva un copia-incolla da
// chat ("cat << 'EOF'", codice doppio) e solo doPost, mentre l'app invia con
// GET: i contributi si perdevano. Riscritto e ridistribuito il 2026-10-15.
//
// Per ripristinarlo: incolla tutto il file in "Codice", salva, poi
// Esegui il deployment → Gestisci deployment → matita → Nuova versione →
// Esegui il deployment (l'indirizzo resta lo stesso). Per il riepilogo email:
// esegui una volta riepilogoGiornaliero (autorizza) e aggiungi l'attivatore
// "Basato sul tempo → Timer giornaliero".

// LinguaeQuiz — raccolta contributi dialettali e correzioni IA.
// L'app invia con GET (parametri nell'indirizzo): li accetta sia GET che POST.
// Scrive nella scheda "Contributi" del foglio "SALVA IL TUO DIALETTO (Risposte)".
const ID_FOGLIO = "1-_5PUYulyzd8wfSecM9K5NRAvQQcfj6HwBrVWAvSJAM";
const SCHEDA = "Contributi";
const CAMPI = ["parola", "dialetto", "traduzione", "nickname", "localita", "note"];
const INTESTAZIONI = ["Data", "Parola Italiana", "Dialetto", "Traduzione", "Nickname", "Località", "Note"];

function salva(dati) {
  const file = SpreadsheetApp.openById(ID_FOGLIO);
  const foglio = file.getSheetByName(SCHEDA) || file.insertSheet(SCHEDA);
  if (foglio.getLastRow() === 0) foglio.appendRow(INTESTAZIONI);
  // Le colonne Località e Note mancano nella scheda esistente: le aggiunge
  if (foglio.getRange(1, 6).getValue() === "") foglio.getRange(1, 6, 1, 2).setValues([["Località", "Note"]]);
  const riga = CAMPI.map(c => String(dati[c] || "").slice(0, 500));
  if (!riga[0] && !riga[2]) return { status: "error", msg: "dati vuoti" };
  foglio.appendRow([new Date()].concat(riga));
  return { status: "ok" };
}

function risposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (!p.parola && !p.traduzione) return risposta({ status: "ok", msg: "LinguaeQuiz pronto" });
    return risposta(salva(p));
  } catch (err) {
    return risposta({ status: "error", msg: String(err) });
  }
}

function doPost(e) {
  try {
    return risposta(salva(JSON.parse(e.postData.contents)));
  } catch (err) {
    return risposta({ status: "error", msg: String(err) });
  }
}

// ── Riepilogo giornaliero via email ──────────────────────────────────────
// Ogni giorno conta le righe nuove della scheda "Contributi" (dall'ultimo
// riepilogo) e, se ce ne sono, manda un'email con l'elenco.
const DESTINATARIO = "linguaequiz@gmail.com";
const MAX_RIGHE_EMAIL = 50;

function riepilogoGiornaliero() {
  const file = SpreadsheetApp.openById(ID_FOGLIO);
  const foglio = file.getSheetByName(SCHEDA);
  const props = PropertiesService.getScriptProperties();
  const ultima = foglio.getLastRow();
  const giaVista = Number(props.getProperty("ultimaRigaVista") || 0);
  // Prima esecuzione: segna il punto di partenza, senza mandare le righe vecchie
  if (!giaVista) {
    props.setProperty("ultimaRigaVista", String(ultima));
    return;
  }
  if (ultima <= giaVista) return; // niente di nuovo, niente email
  const righe = foglio.getRange(giaVista + 1, 1, ultima - giaVista, 7).getValues();
  const correzioni = righe.filter(r => String(r[6]).indexOf("Correzione IA") === 0);
  const contributi = righe.length - correzioni.length;
  const elenco = righe.slice(0, MAX_RIGHE_EMAIL).map(r => {
    const tipo = String(r[6]).indexOf("Correzione IA") === 0 ? "✏️ correzione IA" : "📝 contributo";
    return `${tipo} · ${r[2]} · ${r[1] || "—"} → ${r[3]}${r[6] ? "  (" + r[6] + ")" : ""}`;
  }).join("\n");
  const altre = righe.length > MAX_RIGHE_EMAIL ? `\n… e altre ${righe.length - MAX_RIGHE_EMAIL}` : "";
  MailApp.sendEmail(
    DESTINATARIO,
    `LinguaeQuiz: ${contributi} contributi e ${correzioni.length} correzioni IA`,
    `${elenco}${altre}\n\nFoglio: ${file.getUrl()}`
  );
  props.setProperty("ultimaRigaVista", String(ultima));
}
