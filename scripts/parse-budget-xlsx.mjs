import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const file = path.resolve("c:/Users/rober/Downloads/Rozpočet položkový (1).xlsx");
const wb = XLSX.readFile(file);
const rows = XLSX.utils.sheet_to_json(wb.Sheets["List1"], { header: 1, defval: "" });

const CATEGORY_NAMES = [
  "základy a zemní práce",
  "svislé konstrukce",
  "vodorovné konstrukce, stropy",
  "konstrukce střechy",
  "krytina střech",
  "klempířské konstrukce",
  "úpravy vnitřních povrchů",
  "úpravy vnějších povrchů",
  "vnitřní obklady",
  "dveře a vrata",
  "okna",
  "povrch podlah",
  "vytápění",
  "elektroinstalace",
  "bleskosvod",
  "vnitřní vodovod",
  "vnitřní kanalizace",
  "ohřev teplé vody",
  "kuchyně",
  "vnitřní hygienická zařízení vč. WC",
  "komín",
];

function num(v) {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim()) {
    const n = Number(v.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

let currentCategory = "";
const categories = [];
const lineItems = [];

for (const row of rows) {
  const col1 = String(row[1] ?? "").trim();
  const estimate = num(row[2]);
  const budget = num(row[3]);
  const actual = num(row[4]);
  const note = String(row[5] ?? "").trim();

  if (!col1 || col1 === "Konstrukce") continue;

  const isCategory =
    CATEGORY_NAMES.includes(col1.toLowerCase()) ||
    (estimate > 0 && col1.length > 10) ||
    (budget > 0 && col1.length > 10);

  if (isCategory && CATEGORY_NAMES.includes(col1.toLowerCase())) {
    currentCategory = capitalize(col1);
    categories.push({
      name: currentCategory,
      estimate,
      budget,
      actual,
      note,
    });
    continue;
  }

  if (actual > 0) {
    lineItems.push({
      category: currentCategory || "Ostatní",
      name: col1,
      amount: actual,
      note,
    });
  }
}

console.log(JSON.stringify({ categories, lineItems }, null, 2));
