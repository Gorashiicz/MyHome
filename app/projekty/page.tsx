import Link from "next/link";
import { requireUser, getUserProjects } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSettingsCard } from "@/components/theme/theme-settings-card";
import { SectionBanner } from "@/components/layout/section-banner";
import { labelProjectStatus, labelBudgetMode } from "@/lib/formatting";
import { signOut } from "@/lib/auth";

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await getUserProjects(user.id);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6 md:py-8">
      <SectionBanner
        section="projects"
        title="Moje stavby"
        description={user.email ?? undefined}
        className="app-section-banner--inset"
      >
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-2"
        >
          <Button type="submit" variant="outline" size="sm">
            Odhlásit
          </Button>
        </form>
      </SectionBanner>

      <Button asChild className="mt-2 w-full">
        <Link href="/projekty/nova">+ Nová stavba</Link>
      </Button>

      <div className="mt-8">
        <ThemeSettingsCard />
      </div>

      <ul className="mt-8 space-y-3">
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
    </main>
  );
}
