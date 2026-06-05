import type { ThemeId } from "@/lib/themes";

/** Klíče sekcí pro dekorativní banner na stránce. */
export type SectionBackgroundKey =
  | "home"
  | "auth"
  | "projects"
  | "dashboard"
  | "budget"
  | "documents"
  | "tasks"
  | "tools"
  | "add"
  | "milestones";

const SECTION_FILES: Record<ThemeId, Record<SectionBackgroundKey, string>> = {
  default: {
    home: "home.webp",
    auth: "auth.webp",
    projects: "projects.webp",
    dashboard: "dashboard.webp",
    budget: "budget.webp",
    documents: "documents.webp",
    tasks: "tasks.webp",
    tools: "tools.webp",
    add: "add.webp",
    milestones: "milestones.webp",
  },
  stavba: {
    home: "home.webp",
    auth: "auth.webp",
    projects: "projects.webp",
    dashboard: "dashboard.webp",
    budget: "budget.webp",
    documents: "documents.webp",
    tasks: "tasks.webp",
    tools: "tools.webp",
    add: "add.webp",
    milestones: "milestones.webp",
  },
};

export function getSectionBackgroundPath(
  theme: ThemeId,
  section: SectionBackgroundKey
) {
  return `/decor/${theme}/${SECTION_FILES[theme][section]}`;
}

/** CSS třída — pozadí se vybírá podle atributu data-section na .app-page-backdrop. */
export function sectionBannerClass(_section: SectionBackgroundKey) {
  return "";
}
