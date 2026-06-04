export const OTHER_BUDGET_CATEGORY_NAME = "Ostatní";

export function isOtherBudgetCategory(name: string): boolean {
  return name.trim().toLowerCase() === OTHER_BUDGET_CATEGORY_NAME.toLowerCase();
}

/** Ostatní vždy na konci seznamu pro zadávání výdajů. */
export function sortExpenseBudgetOptions<T extends { name: string }>(
  options: T[]
): T[] {
  const regular = options.filter((o) => !isOtherBudgetCategory(o.name));
  const other = options.filter((o) => isOtherBudgetCategory(o.name));
  return [...regular, ...other];
}
