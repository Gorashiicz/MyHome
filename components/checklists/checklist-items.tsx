"use client";

import { useTransition } from "react";
import { toggleChecklistItem } from "@/actions/checklists";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Item = {
  id: string;
  title: string;
  isDone: boolean;
};

export function ChecklistItems({
  projectId,
  checklistId,
  items,
  canEdit,
}: {
  projectId: string;
  checklistId: string;
  items: Item[];
  canEdit: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleToggle(itemId: string, next: boolean) {
    if (!canEdit) return;
    startTransition(async () => {
      await toggleChecklistItem(projectId, itemId, next);
    });
  }

  const doneCount = items.filter((i) => i.isDone).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {doneCount} / {items.length} hotovo
        </span>
        <div className="h-1.5 flex-1 max-w-[8rem] overflow-hidden rounded-full bg-surface-muted ml-3">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: items.length
                ? `${(doneCount / items.length) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2.5 transition",
                item.isDone && "bg-primary-soft/50 border-primary/20",
                !canEdit && "cursor-default",
                pending && "opacity-70"
              )}
            >
              <input
                type="checkbox"
                checked={item.isDone}
                disabled={!canEdit || pending}
                onChange={(e) => handleToggle(item.id, e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--app-primary)]"
              />
              <span
                className={cn(
                  "text-sm leading-snug",
                  item.isDone && "text-muted line-through"
                )}
              >
                {item.title}
              </span>
              {item.isDone && (
                <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
