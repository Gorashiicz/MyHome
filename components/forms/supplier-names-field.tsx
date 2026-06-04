"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SupplierNamesField({
  suppliers,
  values,
  onChange,
}: {
  suppliers: { id: string; name: string }[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const rows = values.length > 0 ? values : [""];

  function updateRow(index: number, value: string) {
    const next = [...rows];
    next[index] = value;
    onChange(next);
  }

  function addRow() {
    onChange([...rows, ""]);
  }

  function removeRow(index: number) {
    if (rows.length <= 1) {
      onChange([""]);
      return;
    }
    onChange(rows.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <Label>Dodavatelé</Label>
      <p className="text-xs text-slate-500">
        U jednoho výdaje můžete uvést více dodavatelů — každý na samostatný řádek.
      </p>
      <ul className="space-y-2">
        {rows.map((value, index) => (
          <li key={index} className="flex gap-2">
            <Input
              name="supplierNames"
              list="supplier-suggestions"
              value={value}
              onChange={(e) => updateRow(index, e.target.value)}
              placeholder="Název firmy nebo jméno"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeRow(index)}
              className="shrink-0 px-2"
              aria-label="Odebrat dodavatele"
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
      <datalist id="supplier-suggestions">
        {suppliers.map((s) => (
          <option key={s.id} value={s.name} />
        ))}
      </datalist>
      <Button type="button" variant="secondary" size="sm" onClick={addRow}>
        + Další dodavatel
      </Button>
    </div>
  );
}
