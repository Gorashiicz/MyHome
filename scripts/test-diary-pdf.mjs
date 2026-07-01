/** Lokální test PDF obálky: node scripts/test-diary-pdf.mjs [projectId] */
import { config } from "dotenv";
import { writeFileSync } from "fs";

config();

const projectId = process.argv[2] ?? "cmpzbwuae0002uedgt8mp9c2g";

const { loadStavebniDenikExportData, buildStavebniDenikPdf } = await import(
  "../lib/stavebni-denik-pdf.ts"
);

const { project, entries } = await loadStavebniDenikExportData(projectId);
const pdf = await buildStavebniDenikPdf({
  project,
  entries,
  generatedAt: new Date(),
  generatedBy: "test",
});

writeFileSync("test-diary-export.pdf", pdf);
console.log(`OK: test-diary-export.pdf (${pdf.length} bytes)`);
