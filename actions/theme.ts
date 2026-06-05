"use server";

import { cookies } from "next/headers";
import { DEFAULT_THEME, isValidTheme, THEME_COOKIE } from "@/lib/themes";

export async function setTheme(themeId: string) {
  if (!isValidTheme(themeId)) {
    throw new Error("Neplatný vzhled");
  }

  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, themeId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return { ok: true as const, theme: themeId };
}

export async function getThemeFromCookies() {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return isValidTheme(value) ? value : DEFAULT_THEME;
}
