import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const SOURCE = path.resolve("c:/Users/rober/Downloads/Rozpočet položkový (1).xlsx");
const OUT_JSON = path.resolve("scripts/parsed-budget.json");
const OUT_TS = path.resolve("lib/sample-budget-xlsx.ts");

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

function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

const CATEGORY_NAMES_NORM = CATEGORY_NAMES.map(norm);

/** Kam patří detailní výdaje ze spodní sekce Excelu (ne pod poslední kategorií). */
const LINE_ITEM_BUDGET_CATEGORY = {
  "okapní háky": "klempířské konstrukce",
  ktk: "konstrukce střechy",
  "železářství charouzek": "konstrukce střechy",
};

function resolveLineItemCategory(col1, currentCategory, estimate, budget, actual) {
  const mapped = LINE_ITEM_BUDGET_CATEGORY[norm(col1)];
  if (mapped) return capitalize(mapped);

  const isDetachedDetail = actual > 0 && estimate === 0 && budget === 0;
  if (isDetachedDetail) {
    return currentCategory && norm(currentCategory) !== "komín"
      ? currentCategory
      : "Ostatní";
  }

  return currentCategory || "Ostatní";
}

function parseWorkbook(filePath) {
  const wb = XLSX.readFile(filePath);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets["List1"], {
    header: 1,
    defval: "",
  });

  let currentCategory = "";
  const categories = [];
  const lineItems = [];

  for (const row of rows) {
    const col1 = String(row[1] ?? "").trim();
    const estimate = num(row[2]);
    const budget = num(row[3]);
    const actual = num(row[4]);
    const note = String(row[5] ?? "").replace(/\r\n/g, " ").trim();

    if (!col1 || col1 === "Konstrukce") continue;

    if (CATEGORY_NAMES_NORM.includes(norm(col1))) {
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
        category: resolveLineItemCategory(
          col1,
          currentCategory,
          estimate,
          budget,
          actual
        ),
        name: col1,
        amount: actual,
        note,
      });
    }
  }

  const totalEstimate = categories.reduce((s, c) => s + c.estimate, 0);
  const totalActualCategories = categories.reduce((s, c) => s + c.actual, 0);
  const totalActualItems = lineItems.reduce((s, l) => s + l.amount, 0);

  return {
    sourceFile: "Rozpočet položkový (1).xlsx",
    categories,
    lineItems,
    totalEstimate,
    totalActualCategories,
    totalActualItems,
    projectBudgetLimit: categories[0]?.budget || totalEstimate,
  };
}

const data = parseWorkbook(SOURCE);
fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2), "utf8");

const ts = `/**
 * Vzorový rozpočet importovaný z: ${data.sourceFile}
 * Vygenerováno: scripts/generate-sample-budget.mjs
 */
export const SAMPLE_BUDGET_XLSX = ${JSON.stringify(data, null, 2)} as const;

export type SampleBudgetCategory = (typeof SAMPLE_BUDGET_XLSX.categories)[number];
export type SampleBudgetLineItem = (typeof SAMPLE_BUDGET_XLSX.lineItems)[number];
`;

fs.writeFileSync(OUT_TS, ts, "utf8");

console.log("Categories:", data.categories.length);
console.log("Line items:", data.lineItems.length);
console.log("Total estimate:", data.totalEstimate);
console.log("Written:", OUT_JSON, OUT_TS);
