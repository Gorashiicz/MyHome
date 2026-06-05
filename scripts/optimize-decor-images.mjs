/**
 * Generuje webové bannery z obrázků ve složce pictures/.
 * Spuštění: node scripts/optimize-decor-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_W = 1200;
const OUT_H = 280;

/** @type {{ src: string; out: string; position?: sharp.Position }[]} */
const FILES = [
  // Stavba — tematické sekce
  { src: "pictures/projekt.png", out: "public/decor/stavba/home.webp", position: "right" },
  { src: "pictures/projekt2.png", out: "public/decor/stavba/projects.webp", position: "right" },
  { src: "pictures/finance.png", out: "public/decor/stavba/dashboard.webp", position: "right" },
  { src: "pictures/finance2.png", out: "public/decor/stavba/auth.webp", position: "right" },
  { src: "pictures/rozpocet.png", out: "public/decor/stavba/budget.webp", position: "right" },
  { src: "pictures/rozpocet2.png", out: "public/decor/stavba/add.webp", position: "right" },
  { src: "pictures/dokumenty.png", out: "public/decor/stavba/documents.webp", position: "right" },
  { src: "pictures/dokumenty2.png", out: "public/decor/stavba/tools.webp", position: "right" },
  { src: "pictures/zakazky.png", out: "public/decor/stavba/tasks.webp", position: "right" },
  { src: "pictures/zakazky2.png", out: "public/decor/stavba/milestones.webp", position: "right" },
  // Klasický — obecné ilustrace
  { src: "pictures/default1.png", out: "public/decor/default/home.webp", position: "right" },
  { src: "pictures/default2.png", out: "public/decor/default/auth.webp", position: "right" },
  { src: "pictures/default3.png", out: "public/decor/default/projects.webp", position: "right" },
  { src: "pictures/default4.png", out: "public/decor/default/dashboard.webp", position: "right" },
  { src: "pictures/default1.png", out: "public/decor/default/budget.webp", position: "right" },
  { src: "pictures/default2.png", out: "public/decor/default/documents.webp", position: "right" },
  { src: "pictures/default3.png", out: "public/decor/default/tasks.webp", position: "right" },
  { src: "pictures/default4.png", out: "public/decor/default/tools.webp", position: "right" },
  { src: "pictures/default3.png", out: "public/decor/default/add.webp", position: "right" },
  { src: "pictures/default4.png", out: "public/decor/default/milestones.webp", position: "right" },
];

async function main() {
  await mkdir(path.join(ROOT, "public/decor/stavba"), { recursive: true });
  await mkdir(path.join(ROOT, "public/decor/default"), { recursive: true });

  for (const { src, out, position = "right" } of FILES) {
    const input = path.join(ROOT, src);
    const output = path.join(ROOT, out);
    await sharp(input)
      .resize(OUT_W, OUT_H, { fit: "cover", position })
      .webp({ quality: 82 })
      .toFile(output);
    const stat = await sharp(output).metadata();
    console.log(`OK ${out} (${stat.width}x${stat.height})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
