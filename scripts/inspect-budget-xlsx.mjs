import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const file = path.resolve(
  "c:/Users/rober/Downloads/Rozpočet položkový (1).xlsx"
);
const wb = XLSX.readFile(file);

console.log("Sheets:", wb.SheetNames);

for (const name of wb.SheetNames) {
  const sheet = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  console.log("\n===", name, "rows:", rows.length, "===");
  rows.slice(0, 35).forEach((row, i) => {
    console.log(String(i + 1).padStart(3), JSON.stringify(row));
  });
}
