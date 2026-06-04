"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ExpenseDeleteButton({
  expenseTitle,
  deleteAction,
}: {
  expenseTitle: string;
  deleteAction: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      className="border-red-200 text-red-600 hover:bg-red-50"
      onClick={() => {
        if (
          !confirm(
            `Smazat výdaj „${expenseTitle}“?\n\nTuto akci nelze vrátit.`
          )
        ) {
          return;
        }
        startTransition(async () => {
          await deleteAction();
        });
      }}
    >
      {pending ? "Mažu…" : "Smazat výdaj"}
    </Button>
  );
}
