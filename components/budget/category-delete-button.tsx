"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

export function CategoryDeleteButton({
  categoryName,
  deleteAction,
  className,
}: {
  categoryName: string;
  deleteAction: () => Promise<void>;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title={`Odebrat „${categoryName}“ z rozpočtu`}
      aria-label={`Odebrat položku ${categoryName}`}
      onClick={() => {
        if (
          !confirm(
            `Odebrat položku „${categoryName}“ z rozpočtu?\n\nPoložky s evidovanými výdaji nelze smazat.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          await deleteAction();
        });
      }}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border border-red-200 bg-white text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50",
        className
      )}
    >
      ×
    </button>
  );
}
