/**
 * Generuje bannery 3:1 z obrázků ve složce pictures/.
 * Spuštění: npm run decor:build
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BANNER_WIDTH = 1500;
const BANNER_HEIGHT = 500;

/** Široké bannery ve formátu 3:1 (vložte do pictures/). */
const BANNERS = [
  "pictures/ChatGPT Image 5. 6. 2026 12_02_26 (1).png",
  "pictures/ChatGPT Image 5. 6. 2026 12_02_26 (2).png",
  "pictures/ChatGPT Image 5. 6. 2026 12_02_26 (3).png",
  "pictures/ChatGPT Image 5. 6. 2026 12_02_27 (4).png",
  "pictures/ChatGPT Image 5. 6. 2026 12_02_28 (5).png",
];

/** Sekce → index banneru (0–4). */
const SECTION_BANNER_INDEX = {
  home: 0,
  projects: 0,
  dashboard: 1,
  auth: 1,
  budget: 2,
  add: 2,
  documents: 3,
  tools: 3,
  tasks: 4,
  milestones: 4,
};

const THEMES = ["stavba", "default"];

async function writeBanner(src, output) {
  const input = path.join(ROOT, src);
  const outPath = path.join(ROOT, output);
  const meta = await sharp(input).metadata();
  await sharp(input)
    .resize(BANNER_WIDTH, BANNER_HEIGHT, {
      fit: "cover",
      position: "center",
    })
    .webp({ quality: 82 })
    .toFile(outPath);
  const outMeta = await sharp(outPath).metadata();
  console.log(
    `OK ${output} ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`
  );
}

async function main() {
  for (const theme of THEMES) {
    await mkdir(path.join(ROOT, "public/decor", theme), { recursive: true });
  }

  for (const theme of THEMES) {
    for (const [section, bannerIndex] of Object.entries(SECTION_BANNER_INDEX)) {
      const src = BANNERS[bannerIndex];
      const out = `public/decor/${theme}/${section}.webp`;
      await writeBanner(src, out);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
