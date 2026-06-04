import { formatCzk, formatPercent } from "@/lib/formatting";
import { getCategoryBudgetSummary } from "@/lib/budget-stats";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { cn } from "@/lib/utils";

export function CategoryBudgetSummary({
  planned,
  spent,
}: {
  planned: number;
  spent: number;
}) {
  const s = getCategoryBudgetSummary(planned, spent);
  const barWidth =
    s.percentUsed != null ? Math.min(100, s.percentUsed) : spent > 0 ? 100 : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCell
          label={BUDGET_LABELS.planned}
          value={formatCzk(s.planned)}
          sub="Plánovaná částka pro tuto položku"
        />
        <SummaryCell
          label={BUDGET_LABELS.spent}
          value={formatCzk(s.spent)}
          sub="Součet zaplacených výdajů"
        />
        <SummaryCell
          label={s.resultLabel}
          value={s.resultValue}
          sub={s.tone === "over" ? "O kolik přesahujete rozpočet" : undefined}
          highlight={
            s.tone === "saved"
              ? "good"
              : s.tone === "over"
                ? "bad"
                : s.tone === "even"
                  ? "neutral"
                  : undefined
          }
        />
      </div>

      {s.percentUsed != null && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>{BUDGET_LABELS.percentUsed}</span>
            <span
              className={cn(
                "font-medium tabular-nums",
                s.percentUsed > 100 ? "text-red-600" : "text-slate-700"
              )}
            >
              {s.percentUsed > 100
                ? `${s.percentUsed} % rozpočtu`
                : formatPercent(s.percentUsed)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                "h-full transition-all",
                s.percentUsed > 100 ? "bg-red-500" : "bg-emerald-500"
              )}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      )}

      <p
        className={cn(
          "mt-3 text-sm",
          s.tone === "over"
            ? "text-red-700"
            : s.tone === "saved"
              ? "text-emerald-800"
              : "text-slate-600"
        )}
      >
        {s.hint}
      </p>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "good" | "bad" | "neutral";
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-lg font-bold tabular-nums",
          highlight === "good" && "text-emerald-700",
          highlight === "bad" && "text-red-600",
          highlight === "neutral" && "text-slate-700"
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
