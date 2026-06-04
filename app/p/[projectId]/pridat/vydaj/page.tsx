import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDashboardData } from "@/lib/dashboard";
import { buildExpenseBudgetOptions } from "@/lib/expense-budget-options";
import { ensureOtherBudgetCategory, syncBudgetExpenses } from "@/lib/ensure-other-budget-category";
import { resolveProjectRoute } from "@/lib/project-context";
import { ExpenseForm } from "@/components/forms/expense-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AddExpensePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;
  await resolveProjectRoute(projectId);

  await syncBudgetExpenses(projectId);

  const [suppliers, dashboard] = await Promise.all([
    prisma.supplier.findMany({ where: { projectId }, orderBy: { name: "asc" } }),
    getDashboardData(projectId),
  ]);

  const budgetOptions = buildExpenseBudgetOptions(dashboard.categoryStats);

  return (
    <div>
      <Link
        href={`/p/${projectId}/pridat`}
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Zpět
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Nový výdaj</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            projectId={projectId}
            suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
            budgetOptions={budgetOptions}
            initialCategoryId={sp.categoryId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
