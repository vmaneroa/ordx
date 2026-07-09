import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as fontkit from 'fontkit';

// Rutas resueltas desde la ubicación del script
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(SCRIPT_DIR, '..', 'public');
const out = (name) => path.join(PUBLIC_DIR, name);

// Instrument Serif (normal + italic) incrustada en el repo — sin descargas de
// red en el build. sharp/librsvg ignora las fuentes @font-face embebidas, así
// que convertimos los glifos a trazos <path> con fontkit: "ord" en Regular y
// "x" en Italic, igual que el logo de la app.
const serifNormal = fontkit.create(readFileSync(path.join(SCRIPT_DIR, 'instrument-serif-normal.woff2')));
const serifItalic = fontkit.create(readFileSync(path.join(SCRIPT_DIR, 'instrument-serif-italic.woff2')));

const ORD_FILL = '#EEEEF5';
const X_FILL = 'url(#g)';

const SEGMENTS = [
  { font: serifNormal, text: 'ord', fill: ORD_FILL },
  { font: serifItalic, text: 'x', fill: X_FILL },
];

// Construye los glifos posicionados (pen en píxeles para soportar dos fuentes)
function buildItems(fontSize) {
  const items = [];
  let penX = 0;
  for (const seg of SEGMENTS) {
    const scale = fontSize / seg.font.unitsPerEm;
    const run = seg.font.layout(seg.text);
    run.glyphs.forEach((glyph, i) => {
      const pos = run.positions[i];
      items.push({ path: glyph.path, scale, xpx: penX + (pos.xOffset || 0) * scale, fill: seg.fill });
      penX += pos.xAdvance * scale;
    });
  }
  return items;
}

function inkBox(items) {
  let L = Infinity;
  let R = -Infinity;
  let T = Infinity;
  let B = -Infinity;
  for (const it of items) {
    const bb = it.path.bbox;
    L = Math.min(L, it.xpx + bb.minX * it.scale);
    R = Math.max(R, it.xpx + bb.maxX * it.scale);
    T = Math.min(T, -bb.maxY * it.scale);
    B = Math.max(B, -bb.minY * it.scale);
  }
  return { L, R, T, B };
}

// Devuelve los <path> de "ordx" ajustados a `targetFrac` del ancho y centrados
function wordPaths(size, targetFrac, dy = 0) {
  let fontSize = size * 0.5;
  let ink = inkBox(buildItems(fontSize));
  fontSize *= (targetFrac * size) / (ink.R - ink.L); // ajuste a ancho objetivo
  const items = buildItems(fontSize);
  ink = inkBox(items);
  const offX = (size - (ink.R - ink.L)) / 2 - ink.L;
  const offY = (size - (ink.B - ink.T)) / 2 - ink.T + dy;
  return items
    .map((it) => {
      const tx = (offX + it.xpx).toFixed(2);
      const ty = offY.toFixed(2);
      const s = it.scale.toFixed(6);
      return `<path transform="translate(${tx}, ${ty}) scale(${s}, ${-s})" fill="${it.fill}" d="${it.path.toSVG()}"/>`;
    })
    .join('\n    ');
}

// Gradiente violeta→cian en diagonal (135deg), igual que el logo del header
const GRADIENT = `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>`;

// Icono estándar (fondo redondeado)
const svgIcon = (size) => Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>${GRADIENT}</defs>
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#08080E"/>
    ${wordPaths(size, 0.66)}
  </svg>`);

await sharp(svgIcon(180)).resize(180, 180).png().toFile(out('icon-180.png'));
await sharp(svgIcon(192)).resize(192, 192).png().toFile(out('icon-192.png'));
await sharp(svgIcon(512)).resize(512, 512).png().toFile(out('icon-512.png'));

// Maskable: contenido en la zona segura central, fondo a sangre
const svgMask = (size) => Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>${GRADIENT}</defs>
    <rect width="${size}" height="${size}" fill="#08080E"/>
    ${wordPaths(size, 0.4)}
  </svg>`);

await sharp(svgMask(512)).resize(512, 512).png().toFile(out('icon-maskable.png'));

// Splash 2732x2732: logo (trazos) elevado + tagline debajo
const SPLASH = 2732;
const svgSplash = Buffer.from(`<svg width="${SPLASH}" height="${SPLASH}" viewBox="0 0 ${SPLASH} ${SPLASH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${GRADIENT}
      <radialGradient id="glow" cx="50%" cy="44%" r="42%">
        <stop offset="0%" stop-color="rgba(124,58,237,0.14)"/>
        <stop offset="100%" stop-color="rgba(124,58,237,0)"/>
      </radialGradient>
    </defs>
    <rect width="${SPLASH}" height="${SPLASH}" fill="#08080E"/>
    <ellipse cx="${SPLASH / 2}" cy="1200" rx="820" ry="620" fill="url(#glow)"/>
    ${wordPaths(SPLASH, 0.46, -130)}
    <text x="${SPLASH / 2}" y="1740" text-anchor="middle" font-family="Arial, sans-serif" font-weight="400" font-size="80" fill="rgba(238,238,245,0.32)" letter-spacing="6">del caos al orden</text>
  </svg>`);

await sharp(svgSplash).resize(SPLASH, SPLASH).png().toFile(out('splash.png'));

console.log('✅ Iconos generados con Instrument Serif (ord normal + x italic)');
