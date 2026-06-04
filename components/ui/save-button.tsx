import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SaveButtonProps = Omit<ButtonProps, "type" | "variant"> & {
  label?: string;
};

/** Výrazné primární tlačítko pro uložení formuláře. */
export function SaveButton({
  label = "Uložit",
  className,
  size = "default",
  ...props
}: SaveButtonProps) {
  return (
    <Button
      type="submit"
      variant="submit"
      size={size}
      className={cn("min-w-[6.5rem] font-semibold", className)}
      {...props}
    >
      {label}
    </Button>
  );
}
