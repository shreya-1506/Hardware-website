/**
 * Generates the blueprint-style SVG artwork used for demo products, category
 * tiles and fallbacks. Everything is local so the catalog never shows a broken
 * image, and the line-art matches the site's engineering-drawing language.
 *
 *   node scripts/gen-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "catalog");
fs.mkdirSync(OUT, { recursive: true });

const NAVY = "#0D1F37";
const NAVY_SOFT = "#2B4C7E";
const ORANGE = "#F97008";
const STEEL = "#77869A";

/** Shared defs: blueprint grid, steel gradient, hatch pattern. */
function defs(id) {
  return `
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.55" stop-color="#F4F7FA"/>
      <stop offset="1" stop-color="#E6ECF3"/>
    </linearGradient>
    <pattern id="grid-${id}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="${NAVY}" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
    <pattern id="grid-fine-${id}" width="8" height="8" patternUnits="userSpaceOnUse">
      <path d="M8 0H0V8" fill="none" stroke="${NAVY}" stroke-opacity="0.04" stroke-width="0.6"/>
    </pattern>
    <pattern id="hatch-${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="${NAVY_SOFT}" stroke-opacity="0.35" stroke-width="1.4"/>
    </pattern>
    <linearGradient id="metal-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E9EEF4"/>
      <stop offset="0.4" stop-color="#C6D0DC"/>
      <stop offset="0.5" stop-color="#EFF3F7"/>
      <stop offset="0.62" stop-color="#B9C5D3"/>
      <stop offset="1" stop-color="#D9E1E9"/>
    </linearGradient>
  </defs>`;
}

/** Corner registration marks + bottom dimension line, like a drawing sheet. */
function frame(label) {
  const ticks = [
    [24, 24, 24, 54],
    [24, 24, 54, 24],
    [776, 24, 776, 54],
    [776, 24, 746, 24],
    [24, 576, 24, 546],
    [24, 576, 54, 576],
    [776, 576, 776, 546],
    [776, 576, 746, 576],
  ]
    .map(
      ([x1, y1, x2, y2]) =>
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${NAVY}" stroke-opacity="0.35" stroke-width="2"/>`,
    )
    .join("");

  return `
  <g>
    ${ticks}
    <g stroke="${STEEL}" stroke-width="1.1" stroke-opacity="0.75">
      <line x1="250" y1="546" x2="550" y2="546"/>
      <line x1="250" y1="539" x2="250" y2="553"/>
      <line x1="550" y1="539" x2="550" y2="553"/>
    </g>
    <text x="400" y="534" text-anchor="middle" font-family="'Segoe UI',Inter,sans-serif"
      font-size="15" letter-spacing="3.4" fill="${STEEL}">${label.toUpperCase()}</text>
  </g>`;
}

function svg(id, label, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${label}">
  ${defs(id)}
  <rect width="800" height="600" fill="url(#bg-${id})"/>
  <rect width="800" height="600" fill="url(#grid-fine-${id})"/>
  <rect width="800" height="600" fill="url(#grid-${id})"/>
  <g stroke-linecap="round" stroke-linejoin="round">
    ${body}
  </g>
  ${frame(label)}
</svg>
`;
}

/* Each entry draws the subject centred roughly in 120..680 x 90..480. */
const ART = {
  "industrial-hardware": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="7">
      <rect x="170" y="200" width="200" height="170" rx="8" fill="url(#metal-${id})"/>
      <path d="M170 200h200M170 258h200M170 316h200"/>
      <circle cx="270" cy="229" r="12" fill="${ORANGE}" stroke="none"/>
      <circle cx="270" cy="287" r="12" fill="none" stroke="${NAVY_SOFT}" stroke-width="6"/>
      <circle cx="270" cy="345" r="12" fill="none" stroke="${NAVY_SOFT}" stroke-width="6"/>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="7">
      <path d="M430 214h190a14 14 0 0 1 14 14v128a14 14 0 0 1-14 14H430a14 14 0 0 1-14-14V228a14 14 0 0 1 14-14z" fill="url(#hatch-${id})"/>
      <path d="M462 214v156M526 214v156M590 214v156"/>
    </g>
    <path d="M150 420h500" stroke="${ORANGE}" stroke-width="9" fill="none"/>`,

  "machine-tools": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M210 430V150h70v280" fill="url(#metal-${id})"/>
      <path d="M280 178h250v58H280z" fill="url(#metal-${id})"/>
      <path d="M470 236v70" />
      <path d="M446 306h48l-24 66z" fill="${ORANGE}" stroke="${ORANGE}"/>
      <path d="M170 430h460v42H170z" fill="url(#hatch-${id})"/>
      <circle cx="245" cy="196" r="20"/>
      <path d="M245 176v-26M245 216v26M225 196h-26M265 196h26" stroke-width="6"/>
    </g>
    <g fill="none" stroke="${NAVY_SOFT}" stroke-width="4" stroke-dasharray="10 8">
      <path d="M470 392h0M470 380v20"/>
      <path d="M330 372h280"/>
    </g>`,

  "safety-materials": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M400 130c72 0 132 52 140 122H260c8-70 68-122 140-122z" fill="${ORANGE}" stroke="${NAVY}"/>
      <path d="M236 252h328a16 16 0 0 1 16 16v14a16 16 0 0 1-16 16H236a16 16 0 0 1-16-16v-14a16 16 0 0 1 16-16z" fill="url(#metal-${id})"/>
      <path d="M400 130v122M340 146c-16 34-24 70-24 106M460 146c16 34 24 70 24 106"/>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="7">
      <path d="M300 348h200l-30 118H330z" fill="url(#hatch-${id})"/>
      <path d="M400 372v70M370 400h60" stroke="${ORANGE}" stroke-width="9"/>
    </g>`,

  "material-handling": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M200 150h60v250h300" />
      <path d="M540 372l34 28-34 28" stroke="${ORANGE}" stroke-width="9"/>
      <rect x="290" y="220" width="150" height="130" rx="6" fill="url(#hatch-${id})"/>
      <path d="M290 262h150"/>
      <circle cx="250" cy="440" r="34" fill="url(#metal-${id})"/>
      <circle cx="560" cy="440" r="34" fill="url(#metal-${id})"/>
      <circle cx="250" cy="440" r="11" fill="${NAVY}"/>
      <circle cx="560" cy="440" r="11" fill="${NAVY}"/>
      <path d="M170 150h90" stroke="${ORANGE}" stroke-width="10"/>
    </g>`,

  adhesives: (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M352 140h96v52l30 40v230a18 18 0 0 1-18 18H340a18 18 0 0 1-18-18V232l30-40z" fill="url(#metal-${id})"/>
      <path d="M322 300h156" />
      <rect x="342" y="316" width="116" height="96" rx="6" fill="${ORANGE}" stroke="none"/>
      <path d="M368 116h64v24h-64z" fill="url(#hatch-${id})"/>
    </g>
    <g fill="none" stroke="${NAVY_SOFT}" stroke-width="5" stroke-dasharray="12 9">
      <path d="M520 200c60 22 82 74 60 132"/>
      <path d="M280 200c-60 22-82 74-60 132"/>
    </g>
    <circle cx="596" cy="368" r="16" fill="${ORANGE}"/>`,

  "industrial-consumables": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <circle cx="330" cy="290" r="130" fill="url(#metal-${id})"/>
      <circle cx="330" cy="290" r="42" fill="#F4F7FA"/>
      <circle cx="330" cy="290" r="96" stroke-dasharray="16 12" stroke="${NAVY_SOFT}" stroke-width="6"/>
      <path d="M520 200h140v180H520z" fill="url(#hatch-${id})"/>
      <path d="M520 248h140M520 296h140M520 344h140"/>
    </g>
    <path d="M180 452h440" stroke="${ORANGE}" stroke-width="9" fill="none"/>`,

  fasteners: (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M214 168l58-34 58 34v66l-58 34-58-34z" fill="url(#metal-${id})"/>
      <circle cx="272" cy="201" r="26" fill="#EEF2F7"/>
      <path d="M254 268h36v206h-36z" fill="url(#metal-${id})"/>
      <path d="M254 300h36M254 332h36M254 364h36M254 396h36M254 428h36" stroke-width="5" stroke="${NAVY_SOFT}"/>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M452 214l60-36 60 36v72l-60 36-60-36z" fill="url(#hatch-${id})"/>
      <circle cx="512" cy="250" r="30" fill="#F4F7FA" stroke="${ORANGE}" stroke-width="9"/>
      <path d="M452 380l60-36 60 36v72l-60 36-60-36z" fill="url(#metal-${id})"/>
      <circle cx="512" cy="416" r="30" fill="#F4F7FA"/>
    </g>`,

  "power-tools": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M210 210h230a26 26 0 0 1 26 26v34h96v-28l58 20v92l-58 20v-28h-96v34a26 26 0 0 1-26 26H210z" fill="url(#metal-${id})"/>
      <path d="M258 336l-34 132h96l24-132z" fill="url(#hatch-${id})"/>
      <path d="M188 262h22v66h-22z" fill="${ORANGE}" stroke="${ORANGE}"/>
      <path d="M466 270v96"/>
      <circle cx="300" cy="272" r="22" stroke="${NAVY_SOFT}" stroke-width="6"/>
    </g>
    <g stroke="${ORANGE}" stroke-width="6" fill="none">
      <path d="M640 250l40-22M640 316h44M640 382l40 22"/>
    </g>`,

  "hand-tools": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M196 176a52 52 0 0 1 74 0l-26 26 26 26a52 52 0 0 1-74 0z" fill="url(#metal-${id})"/>
      <path d="M262 228l210 210" stroke-width="24" stroke="${NAVY}" opacity="0.12"/>
      <path d="M262 228l190 190" stroke-width="18"/>
      <path d="M452 418l52 52-26 26-52-52z" fill="${ORANGE}" stroke="${NAVY}"/>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M540 156l52 52-30 30 42 42-52 52-42-42-30 30-52-52z" fill="url(#hatch-${id})" opacity="0.9"/>
    </g>`,

  "cutting-tools": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <circle cx="330" cy="286" r="140" fill="url(#metal-${id})"/>
      <circle cx="330" cy="286" r="36" fill="#F4F7FA"/>
      <g stroke="${NAVY}" stroke-width="7">
        ${Array.from({ length: 16 })
          .map((_, i) => {
            const a = (i * Math.PI * 2) / 16;
            const x1 = 330 + Math.cos(a) * 140;
            const y1 = 286 + Math.sin(a) * 140;
            const x2 = 330 + Math.cos(a + 0.14) * 164;
            const y2 = 286 + Math.sin(a + 0.14) * 164;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
          })
          .join("")}
      </g>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M566 140h56v210l-28 74-28-74z" fill="url(#hatch-${id})"/>
      <path d="M566 200h56M566 260h56M566 320h56" stroke="${ORANGE}" stroke-width="6"/>
    </g>`,

  "measuring-tools": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M150 250h500v70H150z" fill="url(#metal-${id})"/>
      <g stroke="${NAVY}" stroke-width="5">
        ${Array.from({ length: 21 })
          .map((_, i) => {
            const x = 170 + i * 24;
            const h = i % 5 === 0 ? 34 : 18;
            return `<line x1="${x}" y1="250" x2="${x}" y2="${250 + h}"/>`;
          })
          .join("")}
      </g>
      <path d="M356 216h84v138h-84z" fill="${ORANGE}" stroke="${NAVY}" opacity="0.92"/>
      <path d="M398 216v-72M398 354v72" stroke="${NAVY_SOFT}" stroke-width="6" stroke-dasharray="12 8"/>
    </g>
    <g fill="none" stroke="${NAVY}" stroke-width="7">
      <circle cx="400" cy="470" r="0.5"/>
      <path d="M240 470h320M240 462v16M560 462v16" stroke="${STEEL}" stroke-width="4"/>
    </g>`,

  lubricants: (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <path d="M300 190h180a20 20 0 0 1 20 20v244a20 20 0 0 1-20 20H300a20 20 0 0 1-20-20V210a20 20 0 0 1 20-20z" fill="url(#metal-${id})"/>
      <path d="M280 288h220"/>
      <rect x="304" y="306" width="172" height="120" rx="6" fill="url(#hatch-${id})"/>
      <path d="M352 146h76v44h-76z" fill="${ORANGE}" stroke="${NAVY}"/>
    </g>
    <g fill="none" stroke="${NAVY_SOFT}" stroke-width="7">
      <path d="M566 250c34 30 34 78 0 108"/>
      <path d="M604 226c52 46 52 156 0 202"/>
    </g>
    <path d="M188 380c22-40 22-40 0-80" stroke="${ORANGE}" stroke-width="8" fill="none"/>`,

  "other-industrial-products": (id) => `
    <g fill="none" stroke="${NAVY}" stroke-width="8">
      <circle cx="400" cy="290" r="120" fill="url(#metal-${id})"/>
      <circle cx="400" cy="290" r="52" fill="#F4F7FA"/>
      <g stroke="${NAVY}" stroke-width="8">
        ${Array.from({ length: 8 })
          .map((_, i) => {
            const a = (i * Math.PI * 2) / 8;
            const x1 = 400 + Math.cos(a) * 120;
            const y1 = 290 + Math.sin(a) * 120;
            const x2 = 400 + Math.cos(a) * 154;
            const y2 = 290 + Math.sin(a) * 154;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
          })
          .join("")}
      </g>
      <circle cx="400" cy="290" r="88" stroke="${ORANGE}" stroke-width="6" stroke-dasharray="14 10"/>
    </g>`,
};

/* Generic fallback shown when a record has no image at all. */
const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="Product image coming soon">
  ${defs("ph")}
  <rect width="800" height="600" fill="url(#bg-ph)"/>
  <rect width="800" height="600" fill="url(#grid-ph)"/>
  <g fill="none" stroke="${STEEL}" stroke-width="6" stroke-linecap="round">
    <rect x="270" y="200" width="260" height="200" rx="10"/>
    <path d="M270 340l70-64 58 52 46-40 86 76"/>
    <circle cx="470" cy="252" r="22"/>
  </g>
  <text x="400" y="452" text-anchor="middle" font-family="'Segoe UI',Inter,sans-serif"
    font-size="22" letter-spacing="2" fill="${STEEL}">IMAGE COMING SOON</text>
  ${frame("Industrial Prime System")}
</svg>
`;

const LABELS = {
  "industrial-hardware": "Industrial Hardware",
  "machine-tools": "Machine Tools",
  "safety-materials": "Safety Materials",
  "material-handling": "Material Handling",
  adhesives: "Adhesives & Sealants",
  "industrial-consumables": "Industrial Consumables",
  fasteners: "Fasteners",
  "power-tools": "Power Tools",
  "hand-tools": "Hand Tools",
  "cutting-tools": "Cutting Tools",
  "measuring-tools": "Measuring Tools",
  lubricants: "Lubricants",
  "other-industrial-products": "Industrial Products",
};

let written = 0;
for (const [slug, draw] of Object.entries(ART)) {
  const id = slug.replace(/[^a-z]/g, "");
  fs.writeFileSync(
    path.join(OUT, `${slug}.svg`),
    svg(id, LABELS[slug] ?? slug, draw(id)),
    "utf8",
  );
  written += 1;
}

const imagesDir = path.join(process.cwd(), "public", "images");
fs.writeFileSync(
  path.join(imagesDir, "placeholder-product.svg"),
  PLACEHOLDER,
  "utf8",
);

console.log(`Generated ${written} catalog illustrations + 1 placeholder in public/images.`);
