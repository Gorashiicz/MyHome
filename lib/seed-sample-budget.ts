import { PaymentStatus, PrismaClient } from "@prisma/client";
import { SAMPLE_BUDGET_XLSX } from "./sample-budget-xlsx";

export async function applySampleBudgetFromXlsx(
  prisma: PrismaClient,
  projectId: string,
  userId: string
) {
  const sample = SAMPLE_BUDGET_XLSX;

  await prisma.expense.deleteMany({ where: { projectId } });
  await prisma.budgetCategory.deleteMany({ where: { projectId } });

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: "RD — položkový rozpočet (vzor)",
      description: `Vzorový rozpočet importovaný ze souboru „${sample.sourceFile}". Obsahuje ${sample.categories.length} konstrukčních položek dle položkového rozpočtu.`,
      budgetMode: "limited",
      budgetLimit: sample.projectBudgetLimit,
      constructionType: "Rodinný dům",
    },
  });

  const createdCategories = await Promise.all(
    sample.categories.map((c, i) =>
      prisma.budgetCategory.create({
        data: {
          projectId,
          name: c.name,
          plannedAmount: c.estimate,
          note: c.note || null,
          sortOrder: i,
        },
      })
    )
  );

  const catByName = (name: string) =>
    createdCategories.find((c) => c.name === name);

  const supplierIds = new Map<string, string>();
  async function supplierIdFor(name: string) {
    const key = name.trim();
    if (supplierIds.has(key)) return supplierIds.get(key)!;
    const s = await prisma.supplier.create({
      data: {
        projectId,
        name: key,
        profession: "Materiál / dodávka",
      },
    });
    supplierIds.set(key, s.id);
    return s.id;
  }

  let day = 0;
  const nextDate = () => {
    const d = new Date("2025-03-15");
    d.setDate(d.getDate() + day++);
    return d;
  };

  for (const c of sample.categories) {
    if (c.actual <= 0) continue;
    await prisma.expense.create({
      data: {
        projectId,
        title: c.name,
        amount: c.actual,
        expenseDate: nextDate(),
        paymentStatus:
          c.name === "Okna" ? PaymentStatus.partially_paid : PaymentStatus.paid,
        categoryId: catByName(c.name)?.id,
        note: c.note || undefined,
        stage: c.name,
        createdById: userId,
      },
    });
  }

  for (const item of sample.lineItems) {
    const categoryName = item.category;
    const supplierName =
      item.name === "KTK" ? "KTK (stavebniny)" : item.name;

    await prisma.expense.create({
      data: {
        projectId,
        title: item.name,
        amount: item.amount,
        expenseDate: nextDate(),
        paymentStatus: PaymentStatus.paid,
        categoryId: catByName(categoryName)?.id,
        supplierId: await supplierIdFor(supplierName),
        note: item.note || undefined,
        stage: categoryName,
        createdById: userId,
      },
    });
  }

  return {
    categories: sample.categories.length,
    expenses:
      sample.categories.filter((c) => c.actual > 0).length +
      sample.lineItems.length,
    totalPlanned: sample.totalEstimate,
  };
}
