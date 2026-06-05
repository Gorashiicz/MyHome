"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteAttachmentButton({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      size="sm"
      variant="destructive"
      className={className}
      onClick={(e) => {
        if (!confirm(`Smazat přílohu „${fileName}"?`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
