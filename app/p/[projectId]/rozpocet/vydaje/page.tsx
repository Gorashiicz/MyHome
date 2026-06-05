import Link from "next/link";
import { prisma } from "@/lib/db";
import { resolveProjectRoute } from "@/lib/project-context";
import { getExpenses } from "@/actions/expenses";
import { formatCzk, formatDate, labelPaymentStatus, toNumber } from "@/lib/formatting";
import { expenseListHeading, expenseListPreview, expenseListMeta } from "@/lib/expense-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PaymentStatus } from "@prisma/client";
import { SectionBanner } from "@/components/layout/section-banner";

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

  const [categories, suppliers] = await Promise.all([
    prisma.budgetCategory.findMany({
      where: { projectId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.supplier.findMany({ where: { projectId } }),
  ]);

  return (
    <div className="space-y-4">
      <SectionBanner section="budget" title="Výdaje">
        <Button asChild size="sm" className="mt-2">
          <Link href={`/p/${projectId}/pridat/vydaj`}>+ Výdaj</Link>
        </Button>
      </SectionBanner>

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
          return (
            <li key={e.id}>
              <Link
                href={`/p/${projectId}/rozpocet/vydaje/${e.id}`}
                className="block rounded-lg border border-slate-200 bg-white px-3 py-3 transition hover:border-emerald-300"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{expenseListHeading(e)}</span>
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
    </div>
  );
}
