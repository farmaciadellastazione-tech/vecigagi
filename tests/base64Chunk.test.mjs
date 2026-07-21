// Test di arrayBufferToBase64() — encoding binario chunked usato dall'upload
// audio in-browser (edit.html + edit-storie.html) per la PUT /contents di
// GitHub. Chunked (batch da 8192 byte) invece del loop diretto
// String.fromCharCode usato per il testo, per evitare problemi di stack su
// file audio più grandi di una stringa testuale tipica.
//   eseguire con:  node --test
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';

function estraiFunzione(src, nomeFunzione) {
  const start = src.indexOf('function ' + nomeFunzione + '(');
  assert.notStrictEqual(start, -1, `funzione ${nomeFunzione} non trovata`);
  const end = src.indexOf('\n}', start);
  assert.notStrictEqual(end, -1, `chiusura di ${nomeFunzione} non trovata`);
  return src.slice(start, end + 2);
}

function caricaArrayBufferToBase64(src) {
  const ctx = { btoa: b => Buffer.from(b, 'binary').toString('base64') };
  vm.createContext(ctx);
  vm.runInContext(estraiFunzione(src, 'arrayBufferToBase64') + '\nthis.arrayBufferToBase64 = arrayBufferToBase64;', ctx);
  return ctx.arrayBufferToBase64;
}

const EDIT = fs.readFileSync(ROOT + '/edit.html', 'utf8');
const STORIE = fs.readFileSync(ROOT + '/edit-storie.html', 'utf8');

function bufferCasuale(n) {
  const buf = new ArrayBuffer(n);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < n; i++) bytes[i] = (i * 37 + 11) % 256; // deterministico, copre tutto il range di byte
  return buf;
}

for (const [nomeFile, src] of [['edit.html', EDIT], ['edit-storie.html', STORIE]]) {
  const arrayBufferToBase64 = caricaArrayBufferToBase64(src);

  test(`${nomeFile}: arrayBufferToBase64 su buffer piccolo coincide con Buffer.toString('base64') di Node`, () => {
    const buf = bufferCasuale(100);
    const atteso = Buffer.from(buf).toString('base64');
    assert.strictEqual(arrayBufferToBase64(buf), atteso);
  });

  test(`${nomeFile}: arrayBufferToBase64 su buffer > una singola chunk (8192 byte) resta corretto`, () => {
    const buf = bufferCasuale(20000); // > 8192, forza più iterazioni di chunking
    const atteso = Buffer.from(buf).toString('base64');
    assert.strictEqual(arrayBufferToBase64(buf), atteso);
  });

  test(`${nomeFile}: arrayBufferToBase64 su buffer vuoto → stringa vuota`, () => {
    assert.strictEqual(arrayBufferToBase64(new ArrayBuffer(0)), '');
  });

  test(`${nomeFile}: chunkSize esplicito più piccolo produce comunque lo stesso risultato`, () => {
    const buf = bufferCasuale(5000);
    const atteso = Buffer.from(buf).toString('base64');
    assert.strictEqual(arrayBufferToBase64(buf, 64), atteso);
  });
}
