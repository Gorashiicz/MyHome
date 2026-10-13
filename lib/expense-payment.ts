import { PaymentStatus } from "@prisma/client";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";

/** Zaplacené — započítávají se do skutečných nákladů a snižují zbývající rozpočet. */
export const PAID_STATUSES: PaymentStatus[] = [
  PaymentStatus.paid,
  PaymentStatus.partially_paid,
];

/**
 * Rozepsané / připravené, ale ještě nerealizované (běžné položky rozpočtu).
 * Neodečítají se od rozpočtu — mají zůstat viditelné, ať na ně uživatel nezapomene.
 * U položky „Ostatní“ se toto nepoužívá — tam se náklady odečítají hned.
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
 * Zda výdaj snižuje skutečné náklady / zbývající rozpočet.
 * „Ostatní“ = okamžitý náklad (kromě zrušených), i když je ještě plánováno/objednáno.
 */
export function expenseCountsTowardSpent(
  status: PaymentStatus,
  categoryName?: string | null
): boolean {
  if (status === PaymentStatus.cancelled) return false;
  if (categoryName && isOtherBudgetCategory(categoryName)) return true;
  return isPaidExpenseStatus(status);
}

/**
 * Zda výdaj patří do připomínky „rozepsáno, nerealizováno“.
 * U „Ostatní“ nikdy — ty se vždy počítají do nákladů.
 */
export function expenseIsUnrealizedReminder(
  status: PaymentStatus,
  categoryName?: string | null
): boolean {
  if (categoryName && isOtherBudgetCategory(categoryName)) return false;
  return isPendingExpenseStatus(status);
}

/** Při uložení výdaje do „Ostatní“ vždy započítat jako realizovaný náklad. */
export function paymentStatusForCategory(
  status: PaymentStatus,
  categoryName?: string | null
): PaymentStatus {
  if (
    categoryName &&
    isOtherBudgetCategory(categoryName) &&
    isPendingExpenseStatus(status)
  ) {
    return PaymentStatus.paid;
  }
  return status;
}
