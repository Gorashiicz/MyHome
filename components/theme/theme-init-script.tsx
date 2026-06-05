import { THEME_COOKIE, DEFAULT_THEME } from "@/lib/themes";

/** Synchronizuje vzhled z cookie/localStorage před vykreslením (bez bliknutí). */
export function ThemeInitScript() {
  const code = `
(function(){
  try {
    var key=${JSON.stringify(THEME_COOKIE)};
    var fallback=${JSON.stringify(DEFAULT_THEME)};
    var fromStorage=localStorage.getItem(key);
    var fromCookie=(document.cookie.match(new RegExp('(?:^|; )'+key+'=([^;]*)'))||[])[1];
    var theme=fromStorage||fromCookie||fallback;
    document.documentElement.dataset.theme=theme;
    localStorage.setItem(key,theme);
  } catch(e) {}
})();
`.trim();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
