// Generate the photography-led OG share card: the hero photograph + a legibility
// gradient + an editorial type overlay, composited into a 1200x630 JPEG. Social
// platforms don't render SVG share images, so we ship a committed raster. Re-run
// after changing the hero photo or the overlay copy:
//   node scripts/generate-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const WIDTH = 1200;
const HEIGHT = 630;
const heroPath = fileURLToPath(new URL("../src/assets/hero.jpg", import.meta.url));
const outPath = fileURLToPath(new URL("../public/og-image.jpg", import.meta.url));

// Transparent overlay: top + bottom shades for text contrast, the 'Norven'
// serif wordmark (top-left), the tagline headline (bottom-left), and the
// est./studio lines balancing the corners — mirroring the site's PhotoHero.
const overlay = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#111110" stop-opacity="0" />
        <stop offset="48%" stop-color="#111110" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#111110" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient id="shadeTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#111110" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#111110" stop-opacity="0" />
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)" />
    <rect width="${WIDTH}" height="180" fill="url(#shadeTop)" />
    <text x="80" y="100" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" fill="#F4F1EA">Norven</text>
    <text x="1120" y="94" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="16" letter-spacing="3" fill="#F4F1EA" fill-opacity="0.78">EST. MMIX</text>
    <text x="74" y="478" font-family="'Cormorant Garamond', Georgia, serif" font-size="100" fill="#F4F1EA">Architecture</text>
    <text x="74" y="568" font-family="'Cormorant Garamond', Georgia, serif" font-size="100" fill="#F4F1EA">of consequence.</text>
    <text x="1120" y="568" text-anchor="end" font-family="ui-monospace, 'JetBrains Mono', monospace" font-size="16" letter-spacing="2" fill="#F4F1EA" fill-opacity="0.72">OSLO · LISBON · KYOTO</text>
  </svg>`,
);

const hero = await sharp(heroPath)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .toBuffer();

await sharp(hero)
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(outPath);

console.warn(`Wrote ${outPath}`);
