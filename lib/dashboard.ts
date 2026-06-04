import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/formatting";

export async function getDashboardData(projectId: string) {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
  });

  const expenses = await prisma.expense.findMany({
    where: { projectId },
    include: { category: true, supplier: true },
    orderBy: { expenseDate: "desc" },
  });

  const paidStatuses: PaymentStatus[] = [
    PaymentStatus.paid,
    PaymentStatus.partially_paid,
  ];

  const totalSpent = expenses
    .filter((e) => paidStatuses.includes(e.paymentStatus))
    .reduce((sum, e) => sum + toNumber(e.amount), 0);

  const budgetLimit =
    project.budgetMode === "limited" && project.budgetLimit
      ? toNumber(project.budgetLimit)
      : null;

  const remaining =
    budgetLimit != null ? Math.max(0, budgetLimit - totalSpent) : null;

  const overrun =
    budgetLimit != null && totalSpent > budgetLimit
      ? totalSpent - budgetLimit
      : 0;

  const unpaidCount = expenses.filter(
    (e) =>
      e.paymentStatus === PaymentStatus.planned ||
      e.paymentStatus === PaymentStatus.ordered
  ).length;

  const categories = await prisma.budgetCategory.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });

  const categoryStats = categories.map((cat) => {
    const categoryExpenses = expenses.filter((e) => e.categoryId === cat.id);
    const spent = categoryExpenses
      .filter((e) => paidStatuses.includes(e.paymentStatus))
      .reduce((sum, e) => sum + toNumber(e.amount), 0);
    const planned = toNumber(cat.plannedAmount);
    return {
      id: cat.id,
      name: cat.name,
      note: cat.note,
      planned,
      spent,
      expenseCount: categoryExpenses.length,
      difference: planned - spent,
      percentUsed: planned > 0 ? Math.round((spent / planned) * 100) : 0,
      closedAt: cat.closedAt,
    };
  });

  const upcomingTasks = await prisma.task.findMany({
    where: {
      projectId,
      status: { notIn: ["done", "cancelled"] },
      dueDate: { not: null },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
    include: { assignee: { select: { name: true } } },
  });

  const openDefects = await prisma.defect.count({
    where: {
      projectId,
      status: { in: ["open", "in_progress", "waiting_for_supplier"] },
    },
  });

  const recentDocuments = await prisma.document.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentDiary = await prisma.diaryEntry.findMany({
    where: { projectId },
    orderBy: { entryDate: "desc" },
    take: 3,
  });

  return {
    project,
    totalSpent,
    budgetLimit,
    remaining,
    overrun,
    unpaidCount,
    categoryStats,
    recentExpenses: expenses.slice(0, 8),
    upcomingTasks,
    openDefects,
    recentDocuments,
    recentDiary,
  };
}
