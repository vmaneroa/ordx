import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Rutas resueltas desde la ubicación del script: funciona ejecutado desde
// la raíz (node client/scripts/generate-icons.mjs) o desde /client
const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = (name) => path.join(PUBLIC_DIR, name);

// Colores sólidos (sin gradiente en texto: máxima compatibilidad entre renderers).
// El layout usa un único <text> con tspans para que el espaciado salga de las
// métricas reales de la fuente — las coordenadas absolutas solapan las letras.
const ORD_COLOR = '#EEEEF5';
const X_COLOR = '#7C3AED';

const svgIcon = (size) => {
  const fontSize = Math.round(size * 0.32);
  const baselineY = Math.round(size * 0.62);
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#08080E"/>
  <text x="50%" y="${baselineY}" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="${fontSize}"><tspan fill="${ORD_COLOR}">ord</tspan><tspan fill="${X_COLOR}">x</tspan></text>
</svg>`);
};

// Icono estándar para iOS (apple-touch-icon)
await sharp(svgIcon(180)).resize(180, 180).png().toFile(out('icon-180.png'));

// Iconos PWA
await sharp(svgIcon(192)).resize(192, 192).png().toFile(out('icon-192.png'));
await sharp(svgIcon(512)).resize(512, 512).png().toFile(out('icon-512.png'));

// Maskable: el contenido vive en la zona segura central (padding ~20%)
const svgMask = Buffer.from(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#08080E"/>
  <text x="50%" y="310" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="130"><tspan fill="${ORD_COLOR}">ord</tspan><tspan fill="${X_COLOR}">x</tspan></text>
</svg>`);
await sharp(svgMask).resize(512, 512).png().toFile(out('icon-maskable.png'));

// Splash screen para iOS (2732x2732 cubre todos los modelos de iPhone/iPad)
const svgSplash = Buffer.from(`<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="rgba(124,58,237,0.12)"/>
      <stop offset="100%" stop-color="rgba(124,58,237,0)"/>
    </radialGradient>
  </defs>
  <rect width="2732" height="2732" fill="#08080E"/>
  <ellipse cx="1366" cy="1200" rx="800" ry="600" fill="url(#glow)"/>
  <text x="50%" y="1430" text-anchor="middle"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="480"><tspan fill="${ORD_COLOR}">ord</tspan><tspan fill="${X_COLOR}">x</tspan></text>
  <text x="1366" y="1580" text-anchor="middle"
    font-family="Arial, sans-serif" font-weight="400"
    font-size="80" fill="rgba(238,238,245,0.35)"
    letter-spacing="4">del caos al orden</text>
</svg>`);
await sharp(svgSplash).resize(2732, 2732).png().toFile(out('splash.png'));

console.log('✅ Iconos y splash generados');
