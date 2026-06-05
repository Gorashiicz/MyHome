import Link from "next/link";
import { loginWithCredentials } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

const errorMessages: Record<string, string> = {
  invalid: "Neplatný e-mail nebo heslo.",
  server: "Chyba serveru — zkuste to znovu nebo kontaktujte správce.",
  auth: "Chyba přihlášení — zkontrolujte nastavení aplikace.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] ?? "Nepodařilo se přihlásit." : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Přihlášení — {APP_NAME}</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {errorMessage}
            </p>
          )}
          <form action={loginWithCredentials} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Přihlásit se
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            Nemáte účet?{" "}
            <Link href="/registrace" className="app-link font-medium">
              Registrace
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            Demo: demo@stavba.cz / demo1234
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
