import Link from "next/link";
import { getExpenseDetail } from "@/actions/expenses";
import { getExpenseAttachments } from "@/lib/expense-attachments";
import { ExpenseAttachments } from "@/components/expense/expense-attachments";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import {
  formatCzk,
  formatDate,
  labelPaymentStatus,
} from "@/lib/formatting";
import { expenseDetailTitle } from "@/lib/expense-display";
import { expenseSuppliersFromRecord } from "@/lib/expense-suppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; expenseId: string }>;
}) {
  const { projectId, expenseId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const [e, attachments] = await Promise.all([
    getExpenseDetail(projectId, expenseId),
    getExpenseAttachments(projectId, expenseId),
  ]);
  const expenseSuppliers = expenseSuppliersFromRecord(e);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/p/${projectId}/rozpocet/vydaje`}
          className="text-sm text-emerald-700 hover:underline"
        >
          ← Výdaje
        </Link>
        {access?.canEdit && (
          <Button asChild size="sm">
            <Link href={`/p/${projectId}/rozpocet/vydaje/${expenseId}/upravit`}>
              Upravit
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{expenseDetailTitle(e)}</CardTitle>
          {e.category && (
            <p className="text-sm text-slate-500">
              Položka rozpočtu: {e.category.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Částka</span>
            <span className="text-lg font-bold">{formatCzk(e.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datum</span>
            <span>{formatDate(e.expenseDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Stav platby</span>
            <span>{labelPaymentStatus(e.paymentStatus)}</span>
          </div>
          {e.category && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-slate-500">Položka rozpočtu</span>
              <Link
                href={`/p/${projectId}/rozpocet/kategorie/${e.category.id}`}
                className="text-right text-emerald-700 hover:underline"
              >
                {e.category.name}
              </Link>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-slate-500">Popis výdaje</span>
            <span className="text-right font-medium">{e.title}</span>
          </div>
          {expenseSuppliers.length > 0 && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-slate-500">
                {expenseSuppliers.length > 1 ? "Dodavatelé" : "Dodavatel"}
              </span>
              <div className="text-right">
                {expenseSuppliers.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && ", "}
                    <Link
                      href={`/p/${projectId}/dodavatele/${s.id}`}
                      className="text-emerald-700 hover:underline"
                    >
                      {s.name}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          )}
          {e.stage && (
            <div className="flex justify-between">
              <span className="text-slate-500">Etapa</span>
              <span>{e.stage}</span>
            </div>
          )}
          {e.note && (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">
                Poznámka
              </p>
              <p className="whitespace-pre-wrap">{e.note}</p>
            </div>
          )}
          {e.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {e.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <ExpenseAttachments
            projectId={projectId}
            expenseId={expenseId}
            attachments={attachments}
            canEdit={!!access?.canEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
