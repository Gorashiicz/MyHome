import { formatCzk } from "@/lib/formatting";
import { BUDGET_LABELS } from "@/lib/budget-labels";

export type CategoryBudgetStat = {
  planned: number;
  spent: number;
  difference: number;
  closedAt: Date | null;
  expenseCount?: number;
};

export type BudgetOverview = {
  totalPlanned: number;
  totalSpent: number;
  categorizedSpent: number;
  uncategorizedSpent: number;
  itemsVsSpent: number;
  remainingFromLimitPlanned: number | null;
  remainingFromLimitSpent: number | null;
  /** Položky s alespoň jedním výdajem — plán vs skutečnost u rozjeté práce */
  activePlanned: number;
  activeSpent: number;
  activeDiff: number;
  activeCount: number;
  /** Označené ✓ jako vyřešeno */
  closedPlanned: number;
  closedSpent: number;
  closedDiff: number;
  totalSaved: number;
  totalOverrun: number;
  closedCount: number;
  openCount: number;
  budgetLimit: number | null;
  remaining: number | null;
  projectOverrun: number;
};

export function summarizeBudget(
  categories: CategoryBudgetStat[],
  project: { budgetLimit: number | null; totalSpent: number; remaining: number | null; overrun: number }
): BudgetOverview {
  let totalPlanned = 0;
  let categorizedSpent = 0;
  let totalSaved = 0;
  let totalOverrun = 0;
  let closedCount = 0;
  let activePlanned = 0;
  let activeSpent = 0;
  let activeCount = 0;
  let closedPlanned = 0;
  let closedSpent = 0;

  for (const cat of categories) {
    totalPlanned += cat.planned;
    categorizedSpent += cat.spent;
    if (cat.difference > 0) totalSaved += cat.difference;
    if (cat.difference < 0) totalOverrun += Math.abs(cat.difference);

    const hasActivity = cat.spent > 0 || (cat.expenseCount ?? 0) > 0;
    if (hasActivity) {
      activePlanned += cat.planned;
      activeSpent += cat.spent;
      activeCount += 1;
    }

    if (cat.closedAt) {
      closedCount += 1;
      closedPlanned += cat.planned;
      closedSpent += cat.spent;
    }
  }

  return {
    totalPlanned,
    totalSpent: project.totalSpent,
    categorizedSpent,
    uncategorizedSpent: Math.max(0, project.totalSpent - categorizedSpent),
    itemsVsSpent: totalPlanned - project.totalSpent,
    remainingFromLimitPlanned:
      project.budgetLimit != null
        ? project.budgetLimit - totalPlanned
        : null,
    remainingFromLimitSpent:
      project.budgetLimit != null
        ? project.budgetLimit - project.totalSpent
        : null,
    activePlanned,
    activeSpent,
    activeDiff: activePlanned - activeSpent,
    activeCount,
    closedPlanned,
    closedSpent,
    closedDiff: closedPlanned - closedSpent,
    totalSaved,
    totalOverrun,
    closedCount,
    openCount: categories.length - closedCount,
    budgetLimit: project.budgetLimit,
    remaining: project.remaining,
    projectOverrun: project.overrun,
  };
}

export function categoryDifferenceLabel(difference: number): {
  text: string;
  tone: "saved" | "over" | "even" | "empty";
} {
  if (difference > 0) {
    return { text: `zbývá ${formatCzk(difference)}`, tone: "saved" };
  }
  if (difference < 0) {
    return {
      text: `přes ${formatCzk(Math.abs(difference))}`,
      tone: "over",
    };
  }
  return { text: "v rozpočtu", tone: "even" };
}

export type CategoryBudgetSummary = {
  planned: number;
  spent: number;
  difference: number;
  percentUsed: number | null;
  tone: "saved" | "over" | "even" | "empty" | "no-budget";
  resultLabel: string;
  resultValue: string;
  hint: string;
};

export function getCategoryBudgetSummary(
  planned: number,
  spent: number
): CategoryBudgetSummary {
  const difference = planned - spent;
  const percentUsed =
    planned > 0 ? Math.min(999, Math.round((spent / planned) * 100)) : null;

  if (planned <= 0 && spent <= 0) {
    return {
      planned,
      spent,
      difference,
      percentUsed: null,
      tone: "empty",
      resultLabel: "Stav",
      resultValue: "Zatím bez nákladů",
      hint: "Nastavte odhad rozpočtu nebo přidejte první výdaj.",
    };
  }

  if (planned <= 0 && spent > 0) {
    return {
      planned,
      spent,
      difference,
      percentUsed: null,
      tone: "no-budget",
      resultLabel: BUDGET_LABELS.spent,
      resultValue: formatCzk(spent),
      hint: "Položka nemá nastavený rozpočet — evidují se jen skutečné náklady.",
    };
  }

  if (difference > 0) {
    return {
      planned,
      spent,
      difference,
      percentUsed,
      tone: "saved",
      resultLabel: BUDGET_LABELS.remaining,
      resultValue: formatCzk(difference),
      hint: `Při dodržení rozpočtu vám u této položky zbývá ${formatCzk(difference)}.`,
    };
  }

  if (difference < 0) {
    const over = Math.abs(difference);
    return {
      planned,
      spent,
      difference,
      percentUsed,
      tone: "over",
      resultLabel: BUDGET_LABELS.overBudget,
      resultValue: formatCzk(over),
      hint: `Skutečné náklady (${formatCzk(spent)}) přesahují rozpočet (${formatCzk(planned)}) o ${formatCzk(over)}.`,
    };
  }

  return {
    planned,
    spent,
    difference,
    percentUsed,
    tone: "even",
    resultLabel: "Stav",
    resultValue: "V rozpočtu",
    hint: "Náklady přesně odpovídají plánovanému rozpočtu.",
  };
}
