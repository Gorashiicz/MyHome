import type { ReactNode } from "react";
import Link from "next/link";
import { formatCzk } from "@/lib/formatting";
import type { BudgetOverview } from "@/lib/budget-stats";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { cn } from "@/lib/utils";

function diffTone(diff: number) {
  if (diff > 0) return "text-emerald-700";
  if (diff < 0) return "text-red-600";
  return "text-slate-700";
}

function diffLabel(diff: number) {
  if (diff > 0) return `pod plánem o ${formatCzk(diff)}`;
  if (diff < 0) return `nad plánem o ${formatCzk(Math.abs(diff))}`;
  return "plán = skutečnost";
}

export function BudgetSummaryBar({
  summary,
  projectId,
}: {
  summary: BudgetOverview;
  projectId?: string;
}) {
  const {
    totalPlanned,
    totalSpent,
    budgetLimit,
    remainingFromLimitPlanned,
    remainingFromLimitSpent,
    activePlanned,
    activeSpent,
    activeDiff,
    activeCount,
    closedPlanned,
    closedSpent,
    closedDiff,
    closedCount,
    openCount,
    pendingAmount,
    pendingCount,
  } = summary;

  const hasLimit = budgetLimit != null;
  const limit = budgetLimit ?? 0;
  const pendingHref = projectId
    ? `/p/${projectId}/rozpocet/vydaje?paymentStatus=pending`
    : null;

  return (
    <div className="space-y-4">
      <SummarySection title={BUDGET_LABELS.sectionWholeProject}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hasLimit && (
            <Stat
              label={BUDGET_LABELS.projectLimit}
              value={formatCzk(limit)}
              sub="Celkový strop stavby"
            />
          )}
          <Stat
            label={BUDGET_LABELS.plannedTotal}
            value={formatCzk(totalPlanned)}
            sub="Plán — výdaje ho nemění"
          />
          <Stat
            label={BUDGET_LABELS.spentTotal}
            value={formatCzk(totalSpent)}
            sub="Jen zaplacené výdaje"
          />
          {hasLimit && remainingFromLimitSpent != null && (
            <Stat
              label={
                remainingFromLimitSpent < 0
                  ? BUDGET_LABELS.overLimitSpent
                  : BUDGET_LABELS.remainingFromLimitSpent
              }
              value={formatCzk(Math.abs(remainingFromLimitSpent))}
              sub={`${formatCzk(limit)} − ${formatCzk(totalSpent)}`}
              className={
                remainingFromLimitSpent < 0 ? "text-red-600" : "text-emerald-700"
              }
            />
          )}
        </div>
      </SummarySection>

      {pendingCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-amber-950">
                {BUDGET_LABELS.pendingSection}
              </h2>
              <p className="mt-0.5 text-xs text-amber-800/80">
                {BUDGET_LABELS.pendingHint}
              </p>
            </div>
            {pendingHref && (
              <Link
                href={pendingHref}
                className="shrink-0 text-sm font-medium text-amber-900 underline-offset-2 hover:underline"
              >
                Zobrazit seznam →
              </Link>
            )}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Stat
              label={BUDGET_LABELS.pendingAmount}
              value={formatCzk(pendingAmount)}
              sub={`${pendingCount} ${
                pendingCount === 1
                  ? "výdaj"
                  : pendingCount < 5
                    ? "výdaje"
                    : "výdajů"
              } (plánováno / objednáno)`}
              className="text-amber-900"
            />
            <div className="text-sm text-amber-900/90">
              <p className="font-medium">Neodečítá se od rozpočtu</p>
              <p className="mt-1 text-xs text-amber-800/80">
                Až výdaj označíte jako zaplacený, přesune se do skutečných
                nákladů a sníží zbývající částku.
              </p>
            </div>
          </div>
        </div>
      )}

      <SummarySection
        title={BUDGET_LABELS.sectionActiveItems}
        hint={`${activeCount} položek s evidovanými výdaji — plán vs skutečnost u rozjeté práce`}
      >
        {activeCount === 0 ? (
          <p className="text-sm text-slate-500">
            Zatím žádná položka nemá výdaje. Po přidání výdajů zde uvidíte
            srovnání plánovaného rozpočtu těchto položek se skutečností.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={BUDGET_LABELS.activePlanned}
              value={formatCzk(activePlanned)}
              sub="Kolik měly stát dle rozpočtu"
            />
            <Stat
              label={BUDGET_LABELS.activeSpent}
              value={formatCzk(activeSpent)}
              sub="Kolik skutečně stály"
            />
            <Stat
              label={BUDGET_LABELS.activeDiff}
              value={formatCzk(Math.abs(activeDiff))}
              sub={diffLabel(activeDiff)}
              className={diffTone(activeDiff)}
            />
          </div>
        )}
      </SummarySection>

      {closedCount > 0 && (
        <SummarySection
          title={BUDGET_LABELS.sectionClosedItems}
          hint={`${closedCount} položek označených jako vyřešeno`}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              label={BUDGET_LABELS.closedPlanned}
              value={formatCzk(closedPlanned)}
            />
            <Stat
              label={BUDGET_LABELS.closedSpent}
              value={formatCzk(closedSpent)}
            />
            <Stat
              label={BUDGET_LABELS.closedDiff}
              value={formatCzk(Math.abs(closedDiff))}
              sub={diffLabel(closedDiff)}
              className={diffTone(closedDiff)}
            />
          </div>
        </SummarySection>
      )}

      {hasLimit && remainingFromLimitPlanned != null && (
        <SummarySection title={BUDGET_LABELS.sectionLimit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Stat
              label={
                remainingFromLimitPlanned < 0
                  ? BUDGET_LABELS.overLimitPlanned
                  : "Nealokováno v položkách"
              }
              value={formatCzk(Math.abs(remainingFromLimitPlanned))}
              sub={`${formatCzk(limit)} − ${formatCzk(totalPlanned)} (limit − rozpočet položek)`}
              className={
                remainingFromLimitPlanned < 0 ? "text-red-600" : "text-slate-700"
              }
            />
            <Stat
              label={
                remainingFromLimitSpent != null && remainingFromLimitSpent < 0
                  ? BUDGET_LABELS.overLimitSpent
                  : BUDGET_LABELS.remainingFromLimitSpent
              }
              value={formatCzk(Math.abs(remainingFromLimitSpent ?? 0))}
              sub={`${formatCzk(limit)} − ${formatCzk(totalSpent)} (limit − náklady)`}
              className={
                remainingFromLimitSpent != null && remainingFromLimitSpent < 0
                  ? "text-red-600"
                  : "text-emerald-700"
              }
            />
          </div>
        </SummarySection>
      )}

      <p className="text-xs text-slate-500">
        Vyřešeno {closedCount} z {closedCount + openCount} položek
        {closedCount === 0 &&
          activeCount > 0 &&
          " — u dokončené práce klikněte ✓ u položky pro samostatné srovnání hotových"}
      </p>
    </div>
  );
}

function SummarySection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={cn("mt-0.5 text-lg font-bold tabular-nums", className)}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
