import Link from "next/link";
import { toggleCategoryClosed, deleteCategory } from "@/actions/categories";
import { formatCzk } from "@/lib/formatting";
import { categoryDifferenceLabel } from "@/lib/budget-stats";
import { truncateText } from "@/lib/expense-display";
import { CategoryDeleteButton } from "@/components/budget/category-delete-button";
import { AddCategoryForm } from "@/components/budget/add-category-form";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  note: string | null;
  planned: number;
  spent: number;
  expenseCount: number;
  difference: number;
  percentUsed: number;
  closedAt: Date | null;
};

export { BudgetSummaryBar } from "@/components/budget/budget-summary-bar";

export function BudgetCategoryTable({
  projectId,
  categories,
  canEdit,
}: {
  projectId: string;
  categories: Row[];
  canEdit: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        className={cn(
          "hidden gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:grid",
          canEdit
            ? "grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_5.5rem_4.5rem_2.5rem_2rem]"
            : "grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_5.5rem_4.5rem_2.5rem]"
        )}
      >
        <span>Položka</span>
        <span className="text-right">{BUDGET_LABELS.planned}</span>
        <span className="text-right">{BUDGET_LABELS.spent}</span>
        <span className="text-right">Zbývá / přečerpáno</span>
        <span className="text-center">Stav</span>
        <span className="text-center">✓</span>
        {canEdit && <span className="text-center">×</span>}
      </div>
      <ul className="divide-y divide-slate-100">
        {categories.map((cat) => (
          <BudgetCategoryRow
            key={cat.id}
            projectId={projectId}
            cat={cat}
            canEdit={canEdit}
          />
        ))}
      </ul>
      {canEdit && <AddCategoryForm projectId={projectId} />}
    </div>
  );
}

function BudgetCategoryRow({
  projectId,
  cat,
  canEdit,
}: {
  projectId: string;
  cat: Row;
  canEdit: boolean;
}) {
  const diff = categoryDifferenceLabel(cat.difference);
  const isClosed = !!cat.closedAt;
  const canDelete = cat.expenseCount === 0;
  const barWidth = Math.min(100, cat.percentUsed);

  return (
    <li
      className={cn(
        "grid grid-cols-1 gap-1 px-3 py-2.5 sm:items-center sm:gap-2",
        canEdit
          ? "sm:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_5.5rem_4.5rem_2.5rem_2rem]"
          : "sm:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_5.5rem_4.5rem_2.5rem]",
        isClosed && "bg-emerald-50/60"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${projectId}/rozpocet/kategorie/${cat.id}`}
            className={cn(
              "truncate text-sm font-medium hover:underline",
              isClosed ? "text-slate-600" : "text-emerald-900"
            )}
          >
            {cat.name}
          </Link>
          {isClosed && (
            <Badge variant="success" className="shrink-0">
              Vyřešeno
            </Badge>
          )}
        </div>
        {cat.note && !isClosed && (
          <p className="truncate text-xs text-slate-500">
            {truncateText(cat.note, 40)}
          </p>
        )}
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100 sm:max-w-[12rem]">
          <div
            className={cn(
              "h-full",
              cat.percentUsed > 100 ? "bg-red-500" : "bg-emerald-500"
            )}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 sm:hidden">
          <div className="grid flex-1 grid-cols-3 gap-2 text-xs">
            <MobileCell label={BUDGET_LABELS.planned} value={formatCzk(cat.planned)} />
            <MobileCell label={BUDGET_LABELS.spent} value={formatCzk(cat.spent)} />
            <MobileCell label="Rozdíl" value={diff.text} tone={diff.tone} />
          </div>
          {canEdit && (
            <div className="flex shrink-0 gap-1">
              <form action={toggleCategoryClosed.bind(null, projectId, cat.id)}>
                <button
                  type="submit"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border text-sm",
                    isClosed
                      ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                      : "border-slate-200 text-slate-400"
                  )}
                >
                  ✓
                </button>
              </form>
              {canDelete && (
                <CategoryDeleteButton
                  categoryName={cat.name}
                  deleteAction={deleteCategory.bind(null, projectId, cat.id)}
                  className="h-8 w-8"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <span className="hidden text-right text-sm tabular-nums sm:block">
        {formatCzk(cat.planned)}
      </span>
      <span className="hidden text-right text-sm tabular-nums sm:block">
        {formatCzk(cat.spent)}
      </span>
      <span
        className={cn(
          "hidden text-right text-sm font-medium tabular-nums sm:block",
          diff.tone === "saved" && "text-emerald-700",
          diff.tone === "over" && "text-red-600",
          diff.tone === "even" && "text-slate-500"
        )}
      >
        {diff.text}
      </span>
      <span className="hidden text-center sm:block">
        {cat.spent === 0 ? (
          <Badge variant="default">Nezačato</Badge>
        ) : cat.percentUsed > 100 ? (
          <Badge variant="danger">Přečerpáno</Badge>
        ) : isClosed ? (
          <Badge variant="success">Hotovo</Badge>
        ) : (
          <Badge variant="warning">Probíhá</Badge>
        )}
      </span>
      <div className="hidden justify-center sm:flex">
        {canEdit ? (
          <form action={toggleCategoryClosed.bind(null, projectId, cat.id)}>
            <button
              type="submit"
              title={isClosed ? "Označit jako otevřenou" : "Označit jako vyřešenou"}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md border text-sm transition",
                isClosed
                  ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-400 hover:border-emerald-300 hover:text-emerald-700"
              )}
            >
              ✓
            </button>
          </form>
        ) : (
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center text-sm",
              isClosed ? "text-emerald-600" : "text-slate-300"
            )}
          >
            {isClosed ? "✓" : "·"}
          </span>
        )}
      </div>
      {canEdit && (
        <div className="hidden justify-center sm:flex">
          {canDelete ? (
            <CategoryDeleteButton
              categoryName={cat.name}
              deleteAction={deleteCategory.bind(null, projectId, cat.id)}
            />
          ) : (
            <span
              className="flex h-7 w-7 items-center justify-center text-xs text-slate-300"
              title="Položku s výdaji nelze smazat"
            >
              ·
            </span>
          )}
        </div>
      )}
    </li>
  );
}

function MobileCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "saved" | "over" | "even" | "empty";
}) {
  return (
    <div>
      <p className="text-[10px] uppercase text-slate-400">{label}</p>
      <p
        className={cn(
          "font-medium tabular-nums",
          tone === "saved" && "text-emerald-700",
          tone === "over" && "text-red-600"
        )}
      >
        {value}
      </p>
    </div>
  );
}
