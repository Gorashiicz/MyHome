import { PaymentStatus } from "@prisma/client";

/** Historicky „zaplacené“ stavy — UI štítky. Do nákladů se počítá vše kromě zrušených. */
export const PAID_STATUSES: PaymentStatus[] = [
  PaymentStatus.paid,
  PaymentStatus.partially_paid,
];

/**
 * Plánováno / objednáno — připomínka, že platba ještě není hotová.
 * Od rozpočtu / nákladů se ale odečítají hned při zadání (kromě zrušených).
 */
export const PENDING_STATUSES: PaymentStatus[] = [
  PaymentStatus.planned,
  PaymentStatus.ordered,
];

export function isPaidExpenseStatus(status: PaymentStatus): boolean {
  return PAID_STATUSES.includes(status);
}

export function isPendingExpenseStatus(status: PaymentStatus): boolean {
  return PENDING_STATUSES.includes(status);
}

/**
 * Zda výdaj snižuje skutečné náklady a zbývající rozpočet.
 * Počítá se hned při zadání — bez nutnosti označit „Zaplaceno“.
 * Zrušené výdaje se nepočítají.
 */
export function expenseCountsTowardSpent(
  status: PaymentStatus,
  _categoryName?: string | null
): boolean {
  void _categoryName;
  return status !== PaymentStatus.cancelled;
}

/**
 * Připomínka „rozepsáno / ještě nezaplaceno“ — výdaj už je v nákladech,
 * ale stav platby ještě není zaplaceno.
 */
export function expenseIsUnrealizedReminder(
  status: PaymentStatus,
  _categoryName?: string | null
): boolean {
  void _categoryName;
  return isPendingExpenseStatus(status);
}

/** Stav platby při uložení — nemění se podle kategorie. */
export function paymentStatusForCategory(
  status: PaymentStatus,
  _categoryName?: string | null
): PaymentStatus {
  void _categoryName;
  return status;
}
