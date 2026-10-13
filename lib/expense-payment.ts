import { PaymentStatus } from "@prisma/client";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";

/** Historicky „zaplacené“ stavy — UI štítky. Do nákladů se počítá vše kromě zrušených. */
export const PAID_STATUSES: PaymentStatus[] = [
  PaymentStatus.paid,
  PaymentStatus.partially_paid,
];

/**
 * Plánováno / objednáno — připomínka u běžných položek.
 * Od nákladů se odečítají hned. U „Ostatní“ se stav nepoužívá (vždy zaplaceno).
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
 * Počítá se hned při zadání. Zrušené se nepočítají.
 * „Ostatní“ vždy (kromě zrušených) — bez zaškrtávání.
 */
export function expenseCountsTowardSpent(
  status: PaymentStatus,
  _categoryName?: string | null
): boolean {
  void _categoryName;
  // Ostatní i běžné položky: vše kromě zrušených se hned počítá do nákladů.
  return status !== PaymentStatus.cancelled;
}

/**
 * Připomínka nezaplacených — u „Ostatní“ nikdy (stav platby se neeviduje).
 */
export function expenseIsUnrealizedReminder(
  status: PaymentStatus,
  categoryName?: string | null
): boolean {
  if (categoryName && isOtherBudgetCategory(categoryName)) return false;
  return isPendingExpenseStatus(status);
}

/** U „Ostatní“ vždy Zaplaceno — výdaj se rovnou odečte, bez výběru stavu. */
export function paymentStatusForCategory(
  status: PaymentStatus,
  categoryName?: string | null
): PaymentStatus {
  if (categoryName && isOtherBudgetCategory(categoryName)) {
    return status === PaymentStatus.cancelled
      ? PaymentStatus.cancelled
      : PaymentStatus.paid;
  }
  return status;
}
