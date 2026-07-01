import { existsSync } from "fs";
import path from "path";

const DIARY_COVER_FILENAME = "stavebni-denik-cover.png";

/** Obálka PDF stavebního deníku (celostránkový obrázek). */
export function getDiaryCoverImagePath() {
  const candidates = [
    path.join(process.cwd(), "assets", "diary", DIARY_COVER_FILENAME),
  ];
  for (const filePath of candidates) {
    if (existsSync(filePath)) return filePath;
  }
  return null;
}

/** Cesty k TTF pro pdfkit — na Vercelu musí být soubory v assets/fonts (ne jen v node_modules). */
export function getPdfFontPaths() {
  const dirs = [
    path.join(process.cwd(), "assets", "fonts"),
    path.join(process.cwd(), "node_modules", "dejavu-fonts-ttf", "ttf"),
  ];

  for (const dir of dirs) {
    const regular = path.join(dir, "DejaVuSans.ttf");
    const bold = path.join(dir, "DejaVuSans-Bold.ttf");
    if (existsSync(regular) && existsSync(bold)) {
      return { regular, bold };
    }
  }

  throw new Error(
    "Chybí fonty pro PDF export (DejaVuSans.ttf). Kontaktujte správce aplikace."
  );
}
