import type { ReactNode } from "react";
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

export function BudgetSummaryBar({ summary }: { summary: BudgetOverview }) {
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
  } = summary;

  const hasLimit = budgetLimit != null;
  const limit = budgetLimit ?? 0;

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
            sub="Součet rozpočtů všech položek"
          />
          <Stat
            label={BUDGET_LABELS.spentTotal}
            value={formatCzk(totalSpent)}
            sub="Všechny zaplacené výdaje"
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
