import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { syncBudgetExpenses } from "@/lib/ensure-other-budget-category";
import { summarizeBudget } from "@/lib/budget-stats";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { BUDGET_REFERENCE_INTRO } from "@/lib/budget-labels";
import { Button } from "@/components/ui/button";
import { BudgetCategoryTable } from "@/components/budget/budget-overview";
import { BudgetSummaryBar } from "@/components/budget/budget-summary-bar";
import { SectionPage } from "@/components/layout/section-banner";

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  await syncBudgetExpenses(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const data = await getDashboardData(projectId);

  const summary = summarizeBudget(data.categoryStats, {
    budgetLimit: data.budgetLimit,
    totalSpent: data.totalSpent,
    remaining: data.remaining,
    overrun: data.overrun,
  });

  return (
    <SectionPage
      section="budget"
      title="Rozpočet"
      headerExtra={
        <>
          <Button asChild variant="outline" size="sm">
            <a href={`/api/export/rozpocet?projectId=${projectId}`}>
              Export CSV
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href={`/p/${projectId}/rozpocet/vydaje`}>Výdaje</Link>
          </Button>
        </>
      }
    >
      <p className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-slate-700">
        {BUDGET_REFERENCE_INTRO}
      </p>

      <BudgetSummaryBar summary={summary} />

      {access?.canEdit && (
        <p className="text-xs text-slate-500">
          Nepoužívané položky odeberte tlačítkem × (lze jen u položek bez výdajů).
          Vlastní položky přidejte dole v tabulce.
        </p>
      )}

      <BudgetCategoryTable
        projectId={projectId}
        categories={data.categoryStats}
        canEdit={!!access?.canEdit}
      />
    </SectionPage>
  );
}
