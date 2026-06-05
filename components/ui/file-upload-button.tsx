"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type FileUploadButtonProps = {
  name: string;
  accept?: string;
  label: string;
  disabled?: boolean;
  className?: string;
  /** Po výběru souboru — typicky odeslání formuláře. */
  onFileSelected?: () => void;
};

/** Tlačítko, které otevře výběr souboru; po výběru zavolá onFileSelected. */
export function FileUploadButton({
  name,
  accept,
  label,
  disabled,
  className,
  onFileSelected,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSelected?.();
          }
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={cn(
          buttonVariants({ variant: "submit", size: "default" }),
          "w-full min-w-[6.5rem] font-semibold"
        )}
      >
        <Upload className="h-4 w-4" />
        {label}
      </button>
    </div>
  );
}
