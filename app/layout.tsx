import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
import { DEFAULT_THEME, isValidTheme, THEME_COOKIE } from "@/lib/themes";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Mobilní stavební zápisník a rozpočtový kontrolní panel pro stavbu svépomocí.",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const theme = isValidTheme(themeCookie) ? themeCookie : DEFAULT_THEME;

  return (
    <html lang="cs" data-theme={theme} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
