#!/usr/bin/env node
// Converte in mp3 i file audio registrati in browser (MediaRecorder) che
// arrivano come .webm/opus o .ogg — formati che Safari (iPhone/iPad/Mac) non
// sa riprodurre affatto. parla() (index.html) prova comunque a riprodurli,
// fallisce in silenzio e ripiega sul TTS: vedi commit "Converti audio
// registrati da webm/opus a mp3 per compatibilita Safari".
//
// Uso (da lanciare ogni volta che aggiungi una registrazione sotto audio/,
// tipicamente dopo il flusso "🎤 Proponi pronuncia" → email → salvataggio
// manuale del file):
//
//   node tools/convert_audio_to_mp3.mjs            # dry-run: elenca soltanto
//   node tools/convert_audio_to_mp3.mjs --apply     # converte e riscrive i riferimenti
//
// Per ogni audio/**/*.webm o *.ogg trovato:
//   1) genera lo stesso file in .mp3 (ffmpeg, stesso bitrate percettivo)
//   2) sostituisce il nome file (vecchia estensione → .mp3) in index.html e
//      storie.js, ovunque compaia tra virgolette
//   3) cancella il file sorgente
// Un file .m4a (AAC) non viene toccato: già riproducibile ovunque.
//
// Richiede ffmpeg nel PATH. Non lancia mai un errore silenzioso: se ffmpeg
// non è installato o una conversione fallisce, si ferma e lo dice.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const APPLY = process.argv.includes('--apply');
const AUDIO_DIR = 'audio';
const REF_FILES = ['index.html', 'storie.js'];
const DA_CONVERTIRE = new Set(['.webm', '.ogg']);

function trovaFileAudio(dir) {
  const risultati = [];
  for (const nome of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, nome.name);
    if (nome.isDirectory()) risultati.push(...trovaFileAudio(p));
    else if (DA_CONVERTIRE.has(path.extname(nome.name).toLowerCase())) risultati.push(p);
  }
  return risultati;
}

if (!fs.existsSync(AUDIO_DIR)) {
  console.error(`Cartella "${AUDIO_DIR}" non trovata (lancia dalla root del repo).`);
  process.exit(1);
}

const daConvertire = trovaFileAudio(AUDIO_DIR);
if (daConvertire.length === 0) {
  console.log('Nessun .webm/.ogg trovato sotto audio/ — niente da convertire.');
  process.exit(0);
}

try {
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
} catch {
  console.error('ffmpeg non trovato nel PATH. Installalo (es. winget install Gyan.FFmpeg) e riprova.');
  process.exit(1);
}

console.log(`Trovati ${daConvertire.length} file da convertire:\n`);

const refContents = new Map(REF_FILES.filter(f => fs.existsSync(f)).map(f => [f, fs.readFileSync(f, 'utf8')]));

let convertiti = 0, riferimentiAggiornati = 0;
for (const src of daConvertire) {
  const dest = src.slice(0, -path.extname(src).length) + '.mp3';
  const nomeVecchio = path.basename(src);
  const nomeNuovo = path.basename(dest);
  console.log(`  ${src} → ${dest}`);

  let refTrovati = 0;
  for (const [file, content] of refContents) {
    if (content.includes(`"${nomeVecchio}"`)) {
      refTrovati += content.split(`"${nomeVecchio}"`).length - 1;
      refContents.set(file, content.split(`"${nomeVecchio}"`).join(`"${nomeNuovo}"`));
    }
  }
  if (refTrovati === 0) {
    console.log(`    ⚠ nessun riferimento a "${nomeVecchio}" in ${REF_FILES.join(' o ')} — file orfano?`);
  } else {
    console.log(`    ${refTrovati} riferimento/i da aggiornare`);
    riferimentiAggiornati += refTrovati;
  }

  if (APPLY) {
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', src, '-c:a', 'libmp3lame', '-q:a', '3', dest]);
    fs.unlinkSync(src);
    convertiti++;
  }
}

if (APPLY) {
  for (const [file, content] of refContents) fs.writeFileSync(file, content);
  console.log(`\n✅ Convertiti ${convertiti} file, aggiornati ${riferimentiAggiornati} riferimenti in ${[...refContents.keys()].join(', ')}.`);
  console.log('Ricorda: git add i nuovi .mp3, i .webm/.ogg cancellati e i file modificati, poi commit.');
} else {
  console.log('\nDry-run. Riesegui con --apply per convertire davvero e riscrivere i riferimenti.');
}
