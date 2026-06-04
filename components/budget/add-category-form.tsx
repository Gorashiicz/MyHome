import { createCategory } from "@/actions/categories";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveButton } from "@/components/ui/save-button";
import { Textarea } from "@/components/ui/textarea";

export function AddCategoryForm({ projectId }: { projectId: string }) {
  return (
    <form
      action={createCategory.bind(null, projectId)}
      className="border-t border-slate-100 bg-slate-50/80 p-3"
    >
      <p className="mb-2 text-sm font-medium text-slate-800">
        Přidat vlastní položku
      </p>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end">
        <div>
          <Label htmlFor="newCategoryName" className="text-xs">
            Název položky
          </Label>
          <Input
            id="newCategoryName"
            name="name"
            required
            placeholder="Např. Bazén, Garáž…"
            className="mt-1 h-9"
          />
        </div>
        <div>
          <Label htmlFor="newCategoryPlan" className="text-xs">
            {BUDGET_LABELS.referenceAmount} (Kč)
          </Label>
          <Input
            id="newCategoryPlan"
            name="plannedAmount"
            type="number"
            min={0}
            step={1000}
            defaultValue={0}
            className="mt-1 h-9"
          />
        </div>
        <SaveButton label="Přidat" className="h-9 w-full sm:w-auto" />
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
          Poznámka (volitelné)
        </summary>
        <Textarea
          name="note"
          rows={2}
          className="mt-1"
          placeholder="Za co je položka určena…"
        />
      </details>
    </form>
  );
}
