"use client";

import { useEffect, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { setTheme } from "@/actions/theme";
import { cn } from "@/lib/utils";
import {
  DEFAULT_THEME,
  THEMES,
  THEME_COOKIE,
  type ThemeId,
} from "@/lib/themes";

function readCurrentTheme(): ThemeId {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === "default" || fromDom === "stavba") return fromDom;
  return DEFAULT_THEME;
}

export function ThemePicker({ initialTheme }: { initialTheme?: ThemeId }) {
  const [current, setCurrent] = useState<ThemeId>(initialTheme ?? DEFAULT_THEME);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setCurrent(readCurrentTheme());
  }, []);

  function applyTheme(theme: ThemeId) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_COOKIE, theme);
    setCurrent(theme);
    startTransition(async () => {
      await setTheme(theme);
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {THEMES.map((theme) => {
        const selected = current === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            disabled={pending}
            onClick={() => applyTheme(theme.id)}
            className={cn(
              "relative rounded-xl border-2 p-4 text-left transition-all",
              selected
                ? "border-primary bg-primary-soft shadow-md ring-2 ring-primary/25"
                : "border-border bg-surface hover:border-primary/40 hover:shadow-sm"
            )}
          >
            {selected && (
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
            )}
            <div className="mb-3 flex gap-2">
              <span
                className="h-10 w-10 rounded-lg border border-black/5 shadow-inner"
                style={{ background: theme.preview.bg }}
                aria-hidden
              />
              <span
                className="h-10 w-10 rounded-lg border border-black/5 shadow-inner"
                style={{ background: theme.preview.primary }}
                aria-hidden
              />
              <span
                className="h-10 flex-1 rounded-lg border border-black/5 shadow-inner"
                style={{ background: theme.preview.surface }}
                aria-hidden
              />
            </div>
            <p className="font-semibold text-foreground">{theme.label}</p>
            <p className="mt-1 text-sm text-muted">{theme.description}</p>
          </button>
        );
      })}
    </div>
  );
}
