import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/formatting";
import {
  expenseCountsTowardSpent,
  expenseIsUnrealizedReminder,
} from "@/lib/expense-payment";

export async function getDashboardData(projectId: string) {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
  });

  const expenses = await prisma.expense.findMany({
    where: { projectId },
    include: { category: true, supplier: true },
    orderBy: { expenseDate: "desc" },
  });

  const spentExpenses = expenses.filter((e) =>
    expenseCountsTowardSpent(e.paymentStatus, e.category?.name)
  );
  const pendingExpenses = expenses.filter((e) =>
    expenseIsUnrealizedReminder(e.paymentStatus, e.category?.name)
  );

  const totalSpent = spentExpenses.reduce(
    (sum, e) => sum + toNumber(e.amount),
    0
  );
  const pendingAmount = pendingExpenses.reduce(
    (sum, e) => sum + toNumber(e.amount),
    0
  );
  const unpaidCount = pendingExpenses.length;

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

  const categories = await prisma.budgetCategory.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });

  const categoryStats = categories.map((cat) => {
    const categoryExpenses = expenses.filter((e) => e.categoryId === cat.id);
    const spent = categoryExpenses
      .filter((e) => expenseCountsTowardSpent(e.paymentStatus, cat.name))
      .reduce((sum, e) => sum + toNumber(e.amount), 0);
    const pending = categoryExpenses
      .filter((e) => expenseIsUnrealizedReminder(e.paymentStatus, cat.name))
      .reduce((sum, e) => sum + toNumber(e.amount), 0);
    const pendingCount = categoryExpenses.filter((e) =>
      expenseIsUnrealizedReminder(e.paymentStatus, cat.name)
    ).length;
    const planned = toNumber(cat.plannedAmount);
    return {
      id: cat.id,
      name: cat.name,
      note: cat.note,
      planned,
      spent,
      pending,
      pendingCount,
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

  const upcomingMilestones = await prisma.milestone.findMany({
    where: {
      projectId,
      status: { not: "done" },
      targetDate: { not: null },
    },
    orderBy: { targetDate: "asc" },
    take: 4,
  });

  const activeChecklists = await prisma.checklist.count({
    where: { projectId, status: "active" },
  });

  return {
    project,
    totalSpent,
    pendingAmount,
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
    upcomingMilestones,
    activeChecklists,
  };
}
