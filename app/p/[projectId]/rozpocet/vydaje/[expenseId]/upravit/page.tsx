import Link from "next/link";
import { notFound } from "next/navigation";
import { getExpenseDetail, deleteExpense } from "@/actions/expenses";
import { getDashboardData } from "@/lib/dashboard";
import { buildExpenseBudgetOptions } from "@/lib/expense-budget-options";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";
import { ensureOtherBudgetCategory } from "@/lib/ensure-other-budget-category";
import { expenseListTitle } from "@/lib/expense-display";
import { expenseSuppliersFromRecord } from "@/lib/expense-suppliers";
import { toNumber } from "@/lib/formatting";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { ExpenseForm } from "@/components/forms/expense-form";
import { getExpenseAttachments } from "@/lib/expense-attachments";
import { ExpenseDeleteButton } from "@/components/expense/expense-delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ projectId: string; expenseId: string }>;
}) {
  const { projectId, expenseId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);

  if (!access?.canEdit) {
    notFound();
  }

  await ensureOtherBudgetCategory(projectId);

  const [expense, suppliers, dashboard, attachments] = await Promise.all([
    getExpenseDetail(projectId, expenseId),
    prisma.supplier.findMany({
      where: { projectId },
      orderBy: { name: "asc" },
    }),
    getDashboardData(projectId),
    getExpenseAttachments(projectId, expenseId),
  ]);

  const amount = toNumber(expense.amount);
  const budgetOptions = buildExpenseBudgetOptions(dashboard.categoryStats, {
    categoryId: expense.categoryId,
    amount,
    paymentStatus: expense.paymentStatus,
  });

  const categoryId =
    expense.categoryId &&
    budgetOptions.some((o) => o.id === expense.categoryId)
      ? expense.categoryId
      : budgetOptions.find((o) => isOtherBudgetCategory(o.name))?.id ??
        budgetOptions[0]?.id ??
        "";

  const displayTitle = expenseListTitle(expense);
  const supplierNames = expenseSuppliersFromRecord(expense).map((s) => s.name);

  return (
    <div className="space-y-4">
      <Link
        href={`/p/${projectId}/rozpocet/vydaje/${expenseId}`}
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Detail výdaje
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <CardTitle>Upravit výdaj</CardTitle>
          <ExpenseDeleteButton
            expenseTitle={displayTitle}
            deleteAction={deleteExpense.bind(null, projectId, expenseId)}
          />
        </CardHeader>
        <CardContent>
          <ExpenseForm
            projectId={projectId}
            expenseId={expenseId}
            suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
            budgetOptions={budgetOptions}
            initialValues={{
              title: expense.title,
              amount,
              expenseDate: expense.expenseDate.toISOString().slice(0, 10),
              paymentStatus: expense.paymentStatus,
              categoryId,
              supplierNames: supplierNames.length > 0 ? supplierNames : [""],
              note: expense.note ?? "",
            }}
            attachments={attachments}
          />
        </CardContent>
      </Card>
    </div>
  );
}
