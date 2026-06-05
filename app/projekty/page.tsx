import Link from "next/link";
import { requireUser, getUserProjects } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSettingsCard } from "@/components/theme/theme-settings-card";
import { SectionPage } from "@/components/layout/section-banner";
import { labelProjectStatus, labelBudgetMode } from "@/lib/formatting";
import { signOut } from "@/lib/auth";

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await getUserProjects(user.id);

  return (
    <main className="app-standalone-shell mx-auto min-h-screen max-w-2xl px-4 py-6 md:py-8">
      <SectionPage
        section="projects"
        title="Moje stavby"
        description={user.email ?? undefined}
        bodyClassName="space-y-6"
        headerExtra={
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Odhlásit
            </Button>
          </form>
        }
      >
        <Button asChild className="w-full">
          <Link href="/projekty/nova">+ Nová stavba</Link>
        </Button>

        <ThemeSettingsCard />

        <ul className="space-y-3">
          {projects.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted">
                Zatím nemáte žádnou stavbu. Vytvořte první projekt.
              </CardContent>
            </Card>
          )}
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/p/${p.id}`}>
                <Card className="transition hover:border-primary/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2 text-sm text-muted">
                    <span>{labelProjectStatus(p.status)}</span>
                    <span>·</span>
                    <span>{labelBudgetMode(p.budgetMode)}</span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </SectionPage>
    </main>
  );
}
