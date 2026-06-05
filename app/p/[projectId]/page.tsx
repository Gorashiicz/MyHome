import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { syncBudgetExpenses } from "@/lib/ensure-other-budget-category";
import { resolveProjectRoute } from "@/lib/project-context";
import { formatCzk, formatDate, labelPaymentStatus } from "@/lib/formatting";
import { expenseListTitle, expenseListPreview } from "@/lib/expense-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  await syncBudgetExpenses(projectId);
  const data = await getDashboardData(projectId);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-slate-600">
              Utraceno (zaplaceno)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCzk(data.totalSpent)}</p>
            {data.budgetLimit != null && (
              <p className="text-sm text-slate-500">
                z {formatCzk(data.budgetLimit)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-slate-600">
              {data.budgetLimit != null ? "Zbývá z limitu stavby" : "Rozpočet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data.remaining != null
                ? formatCzk(data.remaining)
                : "Otevřený"}
            </p>
            {data.overrun > 0 && (
              <Badge variant="danger" className="mt-2">
                Překročení {formatCzk(data.overrun)}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600">Neuhrazené položky</p>
            <p className="text-xl font-semibold">{data.unpaidCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600">Otevřené vady</p>
            <p className="text-xl font-semibold">{data.openDefects}</p>
          </CardContent>
        </Card>
      </section>

      {(data.upcomingMilestones.length > 0 || data.activeChecklists > 0) && (
        <section className="grid gap-3 sm:grid-cols-2">
          {data.upcomingMilestones.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  <Link href={`/p/${projectId}/milniky`} className="app-link">
                    Nadcházející milníky →
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {data.upcomingMilestones.map((m) => (
                  <div key={m.id} className="flex justify-between gap-2">
                    <span className="font-medium">{m.title}</span>
                    <span className="shrink-0 text-muted">
                      {m.targetDate && formatDate(m.targetDate)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {data.activeChecklists > 0 && (
            <Card>
              <CardContent className="pt-4">
                <Link
                  href={`/p/${projectId}/checklisty`}
                  className="app-link text-sm font-medium"
                >
                  Aktivní checklisty
                </Link>
                <p className="mt-1 text-2xl font-bold">{data.activeChecklists}</p>
                <p className="text-xs text-muted">probíhajících kontrol</p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {data.upcomingTasks.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Nejbližší termíny</h2>
          <ul className="space-y-2">
            {data.upcomingTasks.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/p/${projectId}/ukoly`}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-emerald-300"
                >
                  <span className="font-medium">{t.title}</span>
                  {t.dueDate && (
                    <span className="ml-2 text-sm text-slate-500">
                      {formatDate(t.dueDate)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Poslední výdaje</h2>
          <Link
            href={`/p/${projectId}/rozpocet/vydaje`}
            className="text-sm text-emerald-700"
          >
            Všechny →
          </Link>
        </div>
        {data.recentExpenses.length === 0 ? (
          <p className="text-sm text-slate-500">Zatím žádné výdaje.</p>
        ) : (
          <ul className="space-y-2">
            {data.recentExpenses.slice(0, 5).map((e) => {
              const preview = expenseListPreview(e, 36);
              return (
                <li key={e.id}>
                  <Link
                    href={`/p/${projectId}/rozpocet/vydaje/${e.id}`}
                    className="flex justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-emerald-300"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium">{expenseListTitle(e)}</p>
                      {preview ? (
                        <p className="truncate text-xs text-slate-600">
                          {preview}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500">
                          {formatDate(e.expenseDate)} ·{" "}
                          {labelPaymentStatus(e.paymentStatus)}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 font-semibold">{formatCzk(e.amount)}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
