import { PaymentStatus } from "@prisma/client";
import type { BudgetCategoryOption } from "@/components/forms/budget-category-picker";
import { sortExpenseBudgetOptions } from "@/lib/budget-other-category";

const paidStatuses: PaymentStatus[] = [
  PaymentStatus.paid,
  PaymentStatus.partially_paid,
];

type CategoryStat = {
  id: string;
  name: string;
  note: string | null;
  planned: number;
  spent: number;
};

export function buildExpenseBudgetOptions(
  categoryStats: CategoryStat[],
  editing?: {
    categoryId: string | null;
    amount: number;
    paymentStatus: PaymentStatus;
  }
): BudgetCategoryOption[] {
  return sortExpenseBudgetOptions(
    categoryStats.map((c) => {
      let spent = c.spent;
      if (
        editing?.categoryId === c.id &&
        paidStatuses.includes(editing.paymentStatus)
      ) {
        spent = Math.max(0, spent - editing.amount);
      }
      return {
        id: c.id,
        name: c.name,
        note: c.note,
        planned: c.planned,
        spent,
        remaining: Math.max(0, c.planned - spent),
      };
    })
  );
}
