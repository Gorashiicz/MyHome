import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const file = path.resolve("c:/Users/rober/Downloads/Rozpočet položkový (1).xlsx");
const rows = XLSX.utils.sheet_to_json(XLSX.readFile(file).Sheets["List1"], { header: 1, defval: "" });
let n = 0;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const c1 = String(row[1]??"").trim();
  const c4 = row[4];
  if (c1 && (c4 !== "" && c4 !== 0)) {
    console.log(i+1, c1, c4);
    n++;
  }
}
console.log("total rows with col1+actual:", n);
