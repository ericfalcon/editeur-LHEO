#!/usr/bin/env node
/**
 * Génère à l'avance l'index des textes du site (optionnel).
 * Avec cet index, le chatbot répond instantanément dès la première question,
 * sans que chaque visiteur ait à relire le site.
 *
 *   npm install
 *   node build-index.mjs https://passionanimation.fr index.json
 *
 * Options : --max-pages=200 --max-pdfs=50 --no-pdf --exclude=motif1,motif2 --source=html
 */
import { writeFile } from 'node:fs/promises';
import { DOMParser } from 'linkedom';
import './chatbot.js';

const core = globalThis.PAChatbotCore;
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => {
  const [k, v] = a.slice(2).split('=');
  return [k, v ?? true];
}));
const [site, out = 'index.json'] = args.filter(a => !a.startsWith('--'));
if (!site) {
  console.error('Usage : node build-index.mjs https://votre-site.fr [index.json]');
  process.exit(1);
}
const origin = new URL(site).origin;
const UA = 'Mozilla/5.0 (compatible; chatbot-index-builder)';

async function fetchText(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    return { ok: r.ok, text: await r.text() };
  } catch {
    return null;
  }
}

let pdfjs = null;
async function extractPdf(url) {
  pdfjs ??= await import('pdfjs-dist/legacy/build/pdf.mjs');
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await r.arrayBuffer()), useSystemFonts: true }).promise;
  const pages = [];
  for (let n = 1; n <= Math.min(doc.numPages, 300); n++) {
    const tc = await (await doc.getPage(n)).getTextContent();
    pages.push({ n, text: tc.items.map(it => it.str + (it.hasEOL ? '\n' : ' ')).join('') });
  }
  return pages;
}

const parser = new DOMParser();
const idx = await core.buildIndex({
  origin,
  fetchText,
  parseHTML: html => parser.parseFromString(html, 'text/html'),
  source: opt.source || 'auto',
  exclude: opt.exclude ? String(opt.exclude).split(',') : [],
  maxPages: +(opt['max-pages'] || 200),
  maxPdfs: +(opt['max-pdfs'] || 50),
  extractPdf: opt['no-pdf'] ? null : extractPdf,
  onProgress: msg => process.stderr.write('\r' + msg.padEnd(60)),
});
await writeFile(out, JSON.stringify(idx));
console.error(`\n✔ ${idx.pages} pages, ${idx.pdfs} PDF, ${idx.chunks.length} passages → ${out}`);
