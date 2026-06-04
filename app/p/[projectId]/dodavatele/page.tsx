import Link from "next/link";
import { createSupplier, deleteSupplier } from "@/actions/suppliers";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { SupplierForm } from "@/components/forms/supplier-form";
import { supplierNeedsDetails } from "@/lib/supplier-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SuppliersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const suppliers = await prisma.supplier.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { expenses: true, tasks: true, defects: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dodavatelé</h1>
        <p className="mt-1 text-sm text-slate-600">
          Kontakty z výdajů se zde objeví automaticky. Klikněte na jméno a
          doplňte telefon, IČO nebo poznámku.
        </p>
      </div>

      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nový kontakt</CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierForm
              action={createSupplier.bind(null, projectId)}
              submitLabel="Přidat dodavatele"
            />
          </CardContent>
        </Card>
      )}

      <ul className="space-y-2">
        {suppliers.length === 0 && (
          <p className="text-sm text-slate-500">
            Zatím žádní dodavatelé. Přidejte je zde, nebo napište jméno ve výdaji.
          </p>
        )}
        {suppliers.map((s) => {
          const minimal = supplierNeedsDetails({
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
          });

          return (
            <li key={s.id} className="rounded-lg border bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/p/${projectId}/dodavatele/${s.id}`}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  {s.name}
                </Link>
                {minimal && (
                  <Badge variant="warning" className="text-[10px]">
                    doplnit údaje
                  </Badge>
                )}
              </div>
              {s.profession && (
                <p className="text-sm text-slate-600">{s.profession}</p>
              )}
              {s.phone && (
                <p className="text-sm text-slate-500">{s.phone}</p>
              )}
              <p className="text-xs text-slate-500">
                {s._count.expenses} výdajů · {s._count.tasks} úkolů ·{" "}
                {s._count.defects} vad
              </p>
              {access?.canEdit && (
                <div className="mt-2 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/p/${projectId}/dodavatele/${s.id}`}>
                      Upravit
                    </Link>
                  </Button>
                  <form action={deleteSupplier.bind(null, projectId, s.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Smazat
                    </Button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
