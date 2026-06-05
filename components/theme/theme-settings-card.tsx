import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemePicker } from "@/components/theme/theme-picker";
import { getThemeFromCookies } from "@/actions/theme";

export async function ThemeSettingsCard() {
  const initialTheme = await getThemeFromCookies();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vzhled aplikace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted">
          Zvolte styl zobrazení. Nastavení se uloží do tohoto prohlížeče.
        </p>
        <ThemePicker initialTheme={initialTheme} />
      </CardContent>
    </Card>
  );
}
