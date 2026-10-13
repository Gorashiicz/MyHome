import Link from "next/link";
import { prisma } from "@/lib/db";
import { resolveProjectRoute } from "@/lib/project-context";
import { getExpenses } from "@/actions/expenses";
import { formatCzk, formatDate, labelPaymentStatus, toNumber } from "@/lib/formatting";
import { expenseListHeading, expenseListPreview, expenseListMeta } from "@/lib/expense-display";
import { expenseIsUnrealizedReminder } from "@/lib/expense-payment";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@prisma/client";
import { SectionPage } from "@/components/layout/section-banner";
import { cn } from "@/lib/utils";

export default async function ExpensesListPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;
  await resolveProjectRoute(projectId);

  const expenses = await getExpenses(projectId, {
    q: sp.q,
    categoryId: sp.categoryId,
    paymentStatus: sp.paymentStatus,
    supplierId: sp.supplierId,
    from: sp.from,
    to: sp.to,
  });

  const total = expenses.reduce((s, e) => s + toNumber(e.amount), 0);
  const pendingInView = expenses.filter((e) =>
    expenseIsUnrealizedReminder(e.paymentStatus, e.category?.name)
  );
  const pendingTotal = pendingInView.reduce(
    (s, e) => s + toNumber(e.amount),
    0
  );
  const showingPendingOnly = sp.paymentStatus === "pending";

  const [categories, suppliers] = await Promise.all([
    prisma.budgetCategory.findMany({
      where: { projectId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.supplier.findMany({ where: { projectId } }),
  ]);

  return (
    <SectionPage
      section="budget"
      title="Výdaje"
      bodyClassName="space-y-4"
      headerExtra={
        <Button asChild size="sm">
          <Link href={`/p/${projectId}/pridat/vydaj`}>+ Výdaj</Link>
        </Button>
      }
    >
      <form method="get" className="grid gap-2 rounded-lg border bg-white p-3 sm:grid-cols-2">
        <Input name="q" placeholder="Hledat…" defaultValue={sp.q} />
        <Select name="categoryId" defaultValue={sp.categoryId ?? ""}>
          <option value="">Všechny kategorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select name="paymentStatus" defaultValue={sp.paymentStatus ?? ""}>
          <option value="">Všechny stavy</option>
          <option value="pending">Zadáno — ještě nezaplaceno</option>
          {Object.values(PaymentStatus).map((s) => (
            <option key={s} value={s}>
              {labelPaymentStatus(s)}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary" size="sm">
          Filtrovat
        </Button>
      </form>

      {(showingPendingOnly || pendingInView.length > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {showingPendingOnly ? (
            <>
              <p className="font-medium">{BUDGET_LABELS.pendingSection}</p>
              <p className="mt-1 text-amber-900/90">
                {BUDGET_LABELS.pendingHint}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                V tomto výpisu je {pendingInView.length}{" "}
                {pendingInView.length === 1
                  ? "nerealizovaný výdaj"
                  : pendingInView.length < 5
                    ? "nerealizované výdaje"
                    : "nerealizovaných výdajů"}{" "}
                za {formatCzk(pendingTotal)}.
              </p>
              <p className="mt-1 text-amber-900/90">
                Už jsou v nákladech; označení Zaplaceno jen potvrdí platbu.{" "}
                <Link
                  href={`/p/${projectId}/rozpocet/vydaje?paymentStatus=pending`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  Zobrazit jen ty →
                </Link>
              </p>
            </>
          )}
        </div>
      )}

      <p className="text-sm font-medium">
        Součet filtru: {formatCzk(total)} ({expenses.length} položek)
      </p>

      <Button asChild variant="outline" size="sm">
        <a href={`/api/export/vydaje?projectId=${projectId}`}>Export CSV</a>
      </Button>

      <ul className="space-y-2">
        {expenses.length === 0 && (
          <p className="text-slate-500">Žádné výdaje neodpovídají filtru.</p>
        )}
        {expenses.map((e) => {
          const preview = expenseListPreview(e);
          const meta = expenseListMeta(e);
          const isPending = expenseIsUnrealizedReminder(
            e.paymentStatus,
            e.category?.name
          );
          return (
            <li key={e.id}>
              <Link
                href={`/p/${projectId}/rozpocet/vydaje/${e.id}`}
                className={cn(
                  "block rounded-lg border bg-white px-3 py-3 transition",
                  isPending
                    ? "border-amber-200 hover:border-amber-400"
                    : "border-slate-200 hover:border-emerald-300"
                )}
              >
                <div className="flex justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <span className="truncate">{expenseListHeading(e)}</span>
                    {isPending && (
                      <Badge variant="warning" className="shrink-0">
                        {BUDGET_LABELS.pendingBadge}
                      </Badge>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatCzk(e.amount)}
                  </span>
                </div>
                {preview && (
                  <p className="mt-0.5 text-sm text-slate-600">{preview}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(e.expenseDate)}
                  {meta && ` · ${meta}`}
                  {` · ${labelPaymentStatus(e.paymentStatus)}`}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionPage>
  );
}
