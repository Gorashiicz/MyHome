import {
  createDiaryEntry,
  deleteDiaryEntry,
  updateDiaryMetadata,
} from "@/actions/diary";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate } from "@/lib/formatting";
import {
  diaryMetadataToFormDefaults,
  parseDiaryMetadata,
} from "@/lib/diary-metadata";
import { DIARY_DISCLAIMER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const META_FIELDS: { name: keyof ReturnType<typeof diaryMetadataToFormDefaults>; label: string; rows?: number }[] = [
  { name: "permitName", label: "Název stavby dle povolení" },
  { name: "permitNumber", label: "Číslo jednací / stavebního povolení" },
  { name: "permitDate", label: "Datum vydání povolení" },
  { name: "siteAddress", label: "Místo stavby" },
  { name: "builderName", label: "Stavebník (investor)" },
  { name: "builderAddress", label: "Adresa stavebníka" },
  { name: "contractorName", label: "Zhotovitel" },
  { name: "contractorAddress", label: "Adresa zhotovitele" },
  { name: "designerName", label: "Projektant" },
  { name: "designerAddress", label: "Adresa projektanta" },
  { name: "subcontractors", label: "Poddodavatelé", rows: 2 },
  { name: "siteManagement", label: "Stavbyvedoucí / odborné vedení", rows: 2 },
  { name: "technicalSupervision", label: "Technický a autorský dozor", rows: 2 },
  { name: "authorizedRecorders", label: "Osoby oprávněné k záznamům", rows: 2 },
  { name: "projectDocumentation", label: "Projektová dokumentace", rows: 2 },
  { name: "buildingDocuments", label: "Dokumenty ke stavbě (povolení, smlouvy…)", rows: 2 },
  { name: "personChanges", label: "Změny odpovědných osob", rows: 2 },
];

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const isOwner = access?.role === "owner";

  const [project, entries] = await Promise.all([
    prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: { owner: { select: { name: true, email: true } } },
    }),
    prisma.diaryEntry.findMany({
      where: { projectId },
      orderBy: { entryDate: "desc" },
      include: { createdBy: { select: { name: true } } },
    }),
  ]);

  const meta = parseDiaryMetadata(project.diaryMetadata, {
    ...project,
    owner: project.owner,
  });
  const metaDefaults = diaryMetadataToFormDefaults(meta);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Stavební deník</h1>
        <Button asChild variant="outline" size="sm">
          <a href={`/api/export/denik?projectId=${projectId}`}>
            Stáhnout PDF (výpis)
          </a>
        </Button>
      </div>

      <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
        {DIARY_DISCLAIMER}
      </p>

      {isOwner && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Identifikační údaje pro export (příloha č. 12)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={updateDiaryMetadata.bind(null, projectId)}
              className="grid gap-3 sm:grid-cols-2"
            >
              {META_FIELDS.map((f) => (
                <div
                  key={f.name}
                  className={f.rows ? "sm:col-span-2" : undefined}
                >
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.rows ? (
                    <Textarea
                      id={f.name}
                      name={f.name}
                      rows={f.rows}
                      defaultValue={metaDefaults[f.name]}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      id={f.name}
                      name={f.name}
                      defaultValue={metaDefaults[f.name]}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <SaveButton
                  size="default"
                  label="Uložit údaje pro export"
                  className="w-full sm:w-auto"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {access?.canEdit && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Nový denní záznam</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={createDiaryEntry.bind(null, projectId)}
              className="grid gap-3 sm:grid-cols-2"
            >
              <div>
                <Label htmlFor="entryDate">Datum *</Label>
                <Input
                  id="entryDate"
                  name="entryDate"
                  type="date"
                  required
                  defaultValue={today}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="title">Nadpis záznamu *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Denní záznam"
                  defaultValue="Denní záznam"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weather">Počasí / teplota</Label>
                <Input
                  id="weather"
                  name="weather"
                  placeholder="Slunečno, +12 °C"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="siteCondition">Stav staveniště</Label>
                <Input
                  id="siteCondition"
                  name="siteCondition"
                  placeholder="Sucho, přístupné…"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="peoplePresent">Osoby na staveništi</Label>
                <Input id="peoplePresent" name="peoplePresent" className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="workPerformed">Prováděné práce</Label>
                <Textarea id="workPerformed" name="workPerformed" rows={3} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="materialsDelivered">Dodávky materiálu / zabudování</Label>
                <Textarea id="materialsDelivered" name="materialsDelivered" rows={2} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="machinesEquipment">Mechanizace</Label>
                <Textarea id="machinesEquipment" name="machinesEquipment" rows={2} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="dustMeasures">Opatření proti prašnosti</Label>
                <Input id="dustMeasures" name="dustMeasures" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="accessibilityMeasures">Přístupnost staveniště</Label>
                <Input id="accessibilityMeasures" name="accessibilityMeasures" className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="problems">Problémy / mimořádné události</Label>
                <Textarea id="problems" name="problems" rows={2} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="decisions">Rozhodnutí / dohody</Label>
                <Textarea id="decisions" name="decisions" rows={2} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Další poznámky</Label>
                <Textarea id="notes" name="notes" rows={2} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <SaveButton
                  label="Uložit záznam"
                  className="w-full sm:w-auto"
                />
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="mb-2 font-semibold">Záznamy ({entries.length})</h2>
        <ul className="space-y-2">
          {entries.length === 0 && (
            <p className="text-sm text-slate-500">
              Zatím žádné záznamy. Po prvním zápisu můžete vygenerovat PDF výpis.
            </p>
          )}
          {entries.map((e) => (
            <li key={e.id} className="rounded-lg border bg-white px-3 py-3 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold">
                  {formatDate(e.entryDate)} — {e.title}
                </p>
                {e.createdBy.name && (
                  <span className="text-xs text-slate-500">{e.createdBy.name}</span>
                )}
              </div>
              {e.weather && (
                <p className="mt-1 text-slate-600">Počasí: {e.weather}</p>
              )}
              {e.workPerformed && (
                <p className="mt-1 whitespace-pre-wrap text-slate-700 line-clamp-3">
                  {e.workPerformed}
                </p>
              )}
              {access?.canEdit && (
                <form
                  action={deleteDiaryEntry.bind(null, projectId, e.id)}
                  className="mt-2"
                >
                  <Button type="submit" variant="ghost" size="sm">
                    Smazat
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
