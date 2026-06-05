export const THEME_COOKIE = "app-theme";

export type ThemeId = "default" | "stavba";

export const DEFAULT_THEME: ThemeId = "default";

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
  preview: { bg: string; primary: string; surface: string };
};

export const THEMES: ThemeDefinition[] = [
  {
    id: "default",
    label: "Klasický",
    description: "Chladnější zelená — přehledný základní vzhled.",
    preview: { bg: "#f8fafc", primary: "#059669", surface: "#ffffff" },
  },
  {
    id: "stavba",
    label: "Stavba",
    description: "Teplé tóny a měkčí vzhled — jako poznámkový blok na stavbě.",
    preview: { bg: "#f5efe6", primary: "#c4652a", surface: "#fffdf9" },
  },
];

export function isValidTheme(value: string | undefined | null): value is ThemeId {
  return value === "default" || value === "stavba";
}
