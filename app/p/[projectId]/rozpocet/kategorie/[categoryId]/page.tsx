import Link from "next/link";
import { getCategoryDetail, updateCategory, toggleCategoryClosed, deleteCategory } from "@/actions/categories";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import {
  formatCzk,
  formatDate,
  toNumber,
} from "@/lib/formatting";
import { BUDGET_LABELS } from "@/lib/budget-labels";
import { expenseListTitle, expenseListPreview, expenseListMeta } from "@/lib/expense-display";
import { CategoryBudgetSummary } from "@/components/budget/category-budget-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { Badge } from "@/components/ui/badge";
import { CategoryDeleteButton } from "@/components/budget/category-delete-button";
import { PaymentStatus } from "@prisma/client";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; categoryId: string }>;
}) {
  const { projectId, categoryId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const { category, expenses } = await getCategoryDetail(projectId, categoryId);

  const paidStatuses: PaymentStatus[] = [
    PaymentStatus.paid,
    PaymentStatus.partially_paid,
  ];
  const planned = toNumber(category.plannedAmount);
  const spent = expenses
    .filter((e) => paidStatuses.includes(e.paymentStatus))
    .reduce((sum, e) => sum + toNumber(e.amount), 0);
  const isClosed = !!category.closedAt;
  const canDelete = expenses.length === 0;

  return (
    <div className="space-y-4">
      <Link
        href={`/p/${projectId}/rozpocet`}
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Rozpočet
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              {category.name}
              {isClosed && <Badge variant="success">Vyřešeno</Badge>}
            </CardTitle>
          </div>
          {access?.canEdit && (
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href={`/p/${projectId}/pridat/vydaj?categoryId=${categoryId}`}>
                  + Výdaj
                </Link>
              </Button>
              <form action={toggleCategoryClosed.bind(null, projectId, categoryId)}>
                <Button type="submit" size="sm" variant={isClosed ? "outline" : "secondary"}>
                  {isClosed ? "Znovu otevřít" : "Označit vyřešeno"}
                </Button>
              </form>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <CategoryBudgetSummary planned={planned} spent={spent} />

          {category.note && (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">
                Poznámka k položce rozpočtu
              </p>
              <p className="whitespace-pre-wrap">{category.note}</p>
            </div>
          )}

          {access?.canEdit && (
            <form
              action={updateCategory.bind(null, projectId, categoryId)}
              className="space-y-2 border-t pt-3"
            >
              <input type="hidden" name="name" value={category.name} />
              <label className="block text-xs text-slate-500">
                {BUDGET_LABELS.referenceAmount}
                <input
                  name="plannedAmount"
                  type="number"
                  defaultValue={planned}
                  className="mt-1 h-9 w-full rounded border px-2"
                  min={0}
                />
              </label>
              <label className="block text-xs text-slate-500">
                Poznámka
                <textarea
                  name="note"
                  defaultValue={category.note ?? ""}
                  rows={3}
                  className="mt-1 w-full rounded border px-2 py-1"
                  placeholder="Za co je položka, co obsahuje…"
                />
              </label>
              <SaveButton className="mt-1" />
              {canDelete && (
                <div className="border-t pt-3">
                  <p className="mb-2 text-xs text-slate-500">
                    Položka nemá žádné výdaje — lze ji odebrat z rozpočtu.
                  </p>
                  <CategoryDeleteButton
                    categoryName={category.name}
                    deleteAction={deleteCategory.bind(null, projectId, categoryId)}
                    className="h-9 w-9"
                  />
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-2 font-semibold">Výdaje v položce rozpočtu</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-slate-500">Zatím žádné výdaje.</p>
        ) : (
          <ul className="space-y-2">
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
                      <span className="font-medium">{expenseListTitle(e)}</span>
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
                    </p>
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
