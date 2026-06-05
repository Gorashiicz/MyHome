/**
 * Generuje bannery 3:1 z obrázků ve složce pictures/.
 * Soubory pojmenujte podle sekce: Plan, rozpocet, dokumenty, pridat, vice.
 * Spuštění: npm run decor:build
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BANNER_WIDTH = 1500;
const BANNER_HEIGHT = 500;

const SOURCES = {
  plan: "pictures/Plan.png",
  rozpocet: "pictures/rozpocet.png",
  dokumenty: "pictures/dokumenty.png",
  pridat: "pictures/pridat.png",
  vice: "pictures/vice.png",
};

/** Sekce aplikace → zdrojový banner v pictures/. */
const SECTION_SOURCES = {
  home: "plan",
  auth: "plan",
  projects: "plan",
  dashboard: "plan",
  budget: "rozpocet",
  documents: "dokumenty",
  add: "pridat",
  tasks: "vice",
  tools: "vice",
  milestones: "vice",
};

const THEMES = ["stavba", "default"];

async function writeBanner(srcKey, output) {
  const input = path.join(ROOT, SOURCES[srcKey]);
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
    `OK ${output} ← ${SOURCES[srcKey]} (${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height})`
  );
}

async function main() {
  for (const theme of THEMES) {
    await mkdir(path.join(ROOT, "public/decor", theme), { recursive: true });
  }

  for (const theme of THEMES) {
    for (const [section, srcKey] of Object.entries(SECTION_SOURCES)) {
      const out = `public/decor/${theme}/${section}.webp`;
      await writeBanner(srcKey, out);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
