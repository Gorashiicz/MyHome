import Link from "next/link";
import { listDocuments } from "@/actions/documents";
import { createDocument, deleteDocument } from "@/actions/documents";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate } from "@/lib/formatting";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docTypes = [
  ["project", "Projektová dokumentace"],
  ["permit", "Povolení"],
  ["contract", "Smlouva"],
  ["invoice", "Faktura"],
  ["revision", "Revize"],
  ["warranty", "Záruka"],
  ["other", "Ostatní"],
] as const;

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const documents = await listDocuments(projectId);
  const suppliers = await prisma.supplier.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dokumenty</h1>

      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nahrát dokument</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDocument.bind(null, projectId)} className="space-y-3">
              <div>
                <Label htmlFor="title">Název *</Label>
                <Input id="title" name="title" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="docType">Typ</Label>
                <Select id="docType" name="docType" defaultValue="other" className="mt-1">
                  {docTypes.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Soubor</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*,application/pdf"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stage">Etapa</Label>
                <Input id="stage" name="stage" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="note">Poznámka</Label>
                <Textarea id="note" name="note" rows={2} className="mt-1" />
              </div>
              <SaveButton className="w-full" />
            </form>
          </CardContent>
        </Card>
      )}

      <ul className="space-y-2">
        {documents.length === 0 && (
          <p className="text-slate-500">Zatím žádné dokumenty.</p>
        )}
        {documents.map((d) => (
          <li key={d.id} className="rounded-lg border bg-white p-3">
            <p className="font-medium">{d.title}</p>
            <p className="text-xs text-slate-500">
              {d.docType}
              {d.docDate && ` · ${formatDate(d.docDate)}`}
            </p>
            {d.storagePath && (
              <a
                href={`/api/soubory/${d.storagePath}`}
                className="mt-2 inline-block text-sm text-emerald-700"
                target="_blank"
                rel="noreferrer"
              >
                Otevřít soubor
              </a>
            )}
            {access?.canEdit && (
              <form
                action={deleteDocument.bind(null, projectId, d.id)}
                className="mt-2"
              >
                <Button type="submit" variant="destructive" size="sm">
                  Smazat
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
