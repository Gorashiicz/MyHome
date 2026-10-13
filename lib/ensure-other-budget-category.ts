import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { OTHER_BUDGET_CATEGORY_NAME } from "@/lib/budget-other-category";
import { PENDING_STATUSES } from "@/lib/expense-payment";

export async function ensureOtherBudgetCategory(projectId: string) {
  const existing = await prisma.budgetCategory.findFirst({
    where: { projectId, name: OTHER_BUDGET_CATEGORY_NAME },
  });
  if (existing) return existing;

  const maxOrder = await prisma.budgetCategory.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });

  return prisma.budgetCategory.create({
    data: {
      projectId,
      name: OTHER_BUDGET_CATEGORY_NAME,
      plannedAmount: 0,
      note: "Výdaje mimo ostatní rozpočtové položky",
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
}

/** Výdaje bez platné položky rozpočtu přiřadí do „Ostatní“. */
export async function syncBudgetExpenses(projectId: string) {
  const other = await ensureOtherBudgetCategory(projectId);
  const validIds = (
    await prisma.budgetCategory.findMany({
      where: { projectId },
      select: { id: true },
    })
  ).map((c) => c.id);

  await prisma.expense.updateMany({
    where: {
      projectId,
      OR: [
        { categoryId: null },
        ...(validIds.length > 0
          ? [{ categoryId: { notIn: validIds } }]
          : [{ categoryId: { not: null } }]),
      ],
    },
    data: { categoryId: other.id },
  });

  // Ostatní = okamžitý náklad — plánované/objednané hned započítat jako zaplacené.
  await prisma.expense.updateMany({
    where: {
      projectId,
      categoryId: other.id,
      paymentStatus: { in: PENDING_STATUSES },
    },
    data: { paymentStatus: PaymentStatus.paid },
  });

  return other;
}
