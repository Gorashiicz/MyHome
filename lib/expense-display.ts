import {
  expenseSuppliersFromRecord,
  formatExpenseSuppliers,
} from "@/lib/expense-suppliers";

type ExpenseLike = {
  title: string;
  note?: string | null;
  supplier?: { id: string; name: string } | null;
  supplierLinks?: { supplier: { id: string; name: string } }[];
  category?: { name: string } | null;
};

export function truncateText(text: string, maxLen = 48): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen).trimEnd()}…`;
}

/** Popis výdaje (druhotný název) v seznamu. */
export function expenseListTitle(expense: ExpenseLike): string {
  const base = expense.title.split(" — ")[0]?.trim() || expense.title;
  const suppliers = expenseSuppliersFromRecord(expense);
  if (base.toLowerCase() === "ktk" && suppliers[0]?.name) {
    return "KTK";
  }
  return base;
}

/** Náhled poznámky v seznamu (zkrácený). */
export function expenseListPreview(
  expense: ExpenseLike,
  maxLen = 48
): string | null {
  const note = expense.note?.trim();
  if (!note) return null;
  return truncateText(note, maxLen);
}

/** Plný popisek na detailu — popis + poznámka. */
export function expenseDetailTitle(expense: ExpenseLike): string {
  const note = expense.note?.trim();
  const base = expenseListTitle(expense);
  if (!note || base.toLowerCase() === note.toLowerCase()) return base;
  return `${base} — ${note}`;
}

/** Meta řádek: dodavatelé (kategorie se zobrazuje zvlášť). */
export function expenseListMeta(expense: ExpenseLike): string | null {
  const suppliers = expenseSuppliersFromRecord(expense);
  if (suppliers.length === 0) return null;

  const names = formatExpenseSuppliers(suppliers);
  if (names === expenseListTitle(expense)) return null;
  return names;
}

/** Formát pro seznam mimo detail kategorie: „Střecha · Krytina“. */
export function expenseListHeading(expense: ExpenseLike): string {
  const desc = expenseListTitle(expense);
  if (expense.category?.name && expense.category.name !== desc) {
    return `${expense.category.name} · ${desc}`;
  }
  return desc;
}
