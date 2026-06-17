/** Tailwind config per la build statica di index.html (sostituisce il Play CDN).
 *  Replica esattamente la config inline che era in <head> (colori + borderRadius).
 *  Rigenera con:  npm run build:css   (dopo aver cambiato classi nel JSX di index.html)
 */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e' },
        secondary:{ 50:'#fdfaea',100:'#fbe8b5',200:'#f8d680',300:'#f5c34c',400:'#f2b118',500:'#d99e0a',600:'#a87a08',700:'#795806',800:'#4a3604',900:'#1b1401' },
        neutral:  { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' },
      },
      borderRadius: { '4xl':'2rem' },
    },
  },
};
