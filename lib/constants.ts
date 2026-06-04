export const APP_NAME = "Stavba Pod Kontrolou";

export const ACTIVE_PROJECT_COOKIE = "active_project_id";

export const DEFAULT_BUDGET_CATEGORIES = [
  "Pozemek",
  "Projekt",
  "Povolení a administrativa",
  "Přípojky",
  "Zemní práce",
  "Základy",
  "Hrubá stavba",
  "Střecha",
  "Okna a dveře",
  "Elektroinstalace",
  "Voda a kanalizace",
  "Topení",
  "Omítky",
  "Podlahy",
  "Koupelny",
  "Kuchyň",
  "Interiéry",
  "Fasáda",
  "Terénní úpravy",
  "Zahrada",
  "Rezerva",
  "Ostatní",
] as const;

export const DEFAULT_CONSTRUCTION_STAGES = [
  "Pozemek",
  "Projekt",
  "Povolení",
  "Přípojky",
  "Zemní práce",
  "Základy",
  "Hrubá stavba",
  "Střecha",
  "Okna a dveře",
  "Elektroinstalace",
  "Voda a kanalizace",
  "Topení",
  "Omítky",
  "Podlahy",
  "Koupelny",
  "Interiéry",
  "Fasáda",
  "Terénní úpravy",
  "Zahrada",
  "Dokončení",
] as const;

export const PHOTO_TAG_SUGGESTIONS = [
  "skryté rozvody",
  "důkaz",
  "před opravou",
  "po opravě",
  "převzetí",
  "reklamace",
] as const;

export const DIARY_DISCLAIMER =
  "Export vytváří strukturovaný výpis dle vyhlášky č. 131/2024 Sb., příloha č. 12 (stavební deník). " +
  "Před kontrolou stavebním úřadem doplňte identifikační údaje, ověřte obsah záznamů a dodejte podpisy / razítka oprávněných osob. " +
  "Aplikace nenahrazuje právní poradenství.";

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
