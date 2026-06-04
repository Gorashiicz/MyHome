"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  isOtherBudgetCategory,
  OTHER_BUDGET_CATEGORY_NAME,
} from "@/lib/budget-other-category";
import { formatCzk } from "@/lib/formatting";

export type BudgetCategoryOption = {
  id: string;
  name: string;
  note: string | null;
  planned: number;
  spent: number;
  remaining: number;
};

function optionLabel(opt: BudgetCategoryOption) {
  if (isOtherBudgetCategory(opt.name)) {
    return `${OTHER_BUDGET_CATEGORY_NAME} — skut. ${formatCzk(opt.spent)}`;
  }
  let label = `${opt.name} — ref. ${formatCzk(opt.planned)}, skut. ${formatCzk(opt.spent)}`;
  if (opt.remaining > 0) {
    label += `, zbývá ${formatCzk(opt.remaining)}`;
  }
  return label;
}

export function BudgetCategoryPicker({
  options,
  selectedId,
  onSelect,
}: {
  options: BudgetCategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="budgetItem">Položka rozpočtu *</Label>
      <Select
        id="budgetItem"
        required
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-1"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {optionLabel(opt)}
          </option>
        ))}
      </Select>
      <p className="mt-1 text-xs text-slate-500">
        Každý výdaj patří do jedné položky rozpočtu. Nevíte kam? Zvolte{" "}
        {OTHER_BUDGET_CATEGORY_NAME}.
      </p>
    </div>
  );
}
