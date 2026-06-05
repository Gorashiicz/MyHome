import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionPage } from "@/components/layout/section-banner";

export default function RegisterPage() {
  return (
    <main className="app-auth-shell min-h-screen pt-4 md:pt-8">
      <SectionPage
        section="auth"
        title="Registrace"
        description="Vytvořte si účet a začněte sledovat svou stavbu."
      >
        <Card>
          <CardHeader>
            <CardTitle>Nový účet</CardTitle>
          </CardHeader>
          <CardContent>
          <form
            action={async (formData) => {
              "use server";
              const result = await registerUser(formData);
              if (result.error) {
                redirect(`/registrace?error=${encodeURIComponent(result.error)}`);
              }
              const email = String(formData.get("email")).toLowerCase();
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
              });
              const { prisma } = await import("@/lib/db");
              const { acceptPendingInvites: accept } = await import(
                "@/lib/invitations"
              );
              const user = await prisma.user.findUnique({ where: { email } });
              if (user) await accept(user.id, email);
              redirect("/projekty");
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Jméno</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
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
                minLength={6}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Vytvořit účet
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Již máte účet?{" "}
            <Link href="/prihlaseni" className="text-emerald-700 hover:underline">
              Přihlásit se
            </Link>
          </p>
          </CardContent>
        </Card>
      </SectionPage>
    </main>
  );
}
