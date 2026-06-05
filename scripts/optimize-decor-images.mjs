/**
 * Generuje webové pozadí z obrázků ve složce pictures/.
 * Zachová celou kompozici (stůl vlevo + stavba vpravo), bez agresivního ořezu.
 * Spuštění: npm run decor:build
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MAX_WIDTH = 1400;

/** @type {{ src: string; out: string }[]} */
const FILES = [
  { src: "pictures/projekt.png", out: "public/decor/stavba/home.webp" },
  { src: "pictures/projekt2.png", out: "public/decor/stavba/projects.webp" },
  { src: "pictures/finance.png", out: "public/decor/stavba/dashboard.webp" },
  { src: "pictures/finance2.png", out: "public/decor/stavba/auth.webp" },
  { src: "pictures/rozpocet.png", out: "public/decor/stavba/budget.webp" },
  { src: "pictures/rozpocet2.png", out: "public/decor/stavba/add.webp" },
  { src: "pictures/dokumenty.png", out: "public/decor/stavba/documents.webp" },
  { src: "pictures/dokumenty2.png", out: "public/decor/stavba/tools.webp" },
  { src: "pictures/zakazky.png", out: "public/decor/stavba/tasks.webp" },
  { src: "pictures/zakazky2.png", out: "public/decor/stavba/milestones.webp" },
  { src: "pictures/default1.png", out: "public/decor/default/home.webp" },
  { src: "pictures/default2.png", out: "public/decor/default/auth.webp" },
  { src: "pictures/default3.png", out: "public/decor/default/projects.webp" },
  { src: "pictures/default4.png", out: "public/decor/default/dashboard.webp" },
  { src: "pictures/default1.png", out: "public/decor/default/budget.webp" },
  { src: "pictures/default2.png", out: "public/decor/default/documents.webp" },
  { src: "pictures/default3.png", out: "public/decor/default/tasks.webp" },
  { src: "pictures/default4.png", out: "public/decor/default/tools.webp" },
  { src: "pictures/default3.png", out: "public/decor/default/add.webp" },
  { src: "pictures/default4.png", out: "public/decor/default/milestones.webp" },
];

async function main() {
  await mkdir(path.join(ROOT, "public/decor/stavba"), { recursive: true });
  await mkdir(path.join(ROOT, "public/decor/default"), { recursive: true });

  for (const { src, out } of FILES) {
    const input = path.join(ROOT, src);
    const output = path.join(ROOT, out);
    const meta = await sharp(input).metadata();
    await sharp(input)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: 80 })
      .toFile(output);
    const outMeta = await sharp(output).metadata();
    console.log(
      `OK ${out} ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
