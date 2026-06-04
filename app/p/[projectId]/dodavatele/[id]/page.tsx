import Link from "next/link";
import { getSupplierDetail, updateSupplier, deleteSupplier } from "@/actions/suppliers";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatCzk, formatDate } from "@/lib/formatting";
import { expenseListTitle, expenseListPreview } from "@/lib/expense-display";
import { SupplierForm } from "@/components/forms/supplier-form";
import { supplierNeedsDetails } from "@/lib/supplier-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const s = await getSupplierDetail(projectId, id);

  const initial = {
    name: s.name,
    profession: s.profession,
    companyName: s.companyName,
    ico: s.ico,
    phone: s.phone,
    email: s.email,
    website: s.website,
    address: s.address,
    notes: s.notes,
    rating: s.rating,
  };

  const minimal = supplierNeedsDetails(initial);

  return (
    <div className="space-y-4">
      <Link
        href={`/p/${projectId}/dodavatele`}
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Dodavatelé
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold">{s.name}</h1>
        {minimal && (
          <Badge variant="warning">Doplňte údaje</Badge>
        )}
      </div>

      {minimal && (
        <p className="rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-sm text-amber-900">
          Tento kontakt vznikl z výdaje — zatím obsahuje jen jméno. Níže můžete
          doplnit telefon, IČO, profesi a další údaje.
        </p>
      )}

      {!access?.canEdit && (
        <Card>
          <CardContent className="space-y-2 pt-4 text-sm">
            {s.profession && (
              <p>
                <span className="text-slate-500">Profese:</span> {s.profession}
              </p>
            )}
            {s.phone && (
              <p>
                <span className="text-slate-500">Telefon:</span> {s.phone}
              </p>
            )}
            {s.email && (
              <p>
                <span className="text-slate-500">E-mail:</span> {s.email}
              </p>
            )}
            {s.notes && (
              <p className="whitespace-pre-wrap text-slate-600">{s.notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upravit dodavatele</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierForm
              action={updateSupplier.bind(null, projectId, id)}
              initial={initial}
              submitLabel="Uložit změny"
            />
            <form
              action={deleteSupplier.bind(null, projectId, id)}
              className="mt-4 border-t pt-4"
            >
              <Button type="submit" variant="ghost" size="sm" className="text-red-600">
                Smazat dodavatele
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {s.expenses.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Výdaje</h2>
          <ul className="space-y-2 text-sm">
            {s.expenses.map((e) => {
              const preview = expenseListPreview(e, 32);
              return (
                <li key={e.id}>
                  <Link
                    href={`/p/${projectId}/rozpocet/vydaje/${e.id}`}
                    className="block rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-emerald-300"
                  >
                    <span className="font-medium text-emerald-800">
                      {expenseListTitle(e)}
                      {preview && ` · ${preview}`}
                    </span>
                    <span className="mt-0.5 block text-slate-600">
                      {formatCzk(e.amount)} · {formatDate(e.expenseDate)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
