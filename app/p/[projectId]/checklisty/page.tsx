import {
  listChecklists,
  createChecklistFromTemplate,
  createCustomChecklist,
  deleteChecklist,
} from "@/actions/checklists";
import { ChecklistItems } from "@/components/checklists/checklist-items";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { CHECKLIST_TEMPLATES } from "@/lib/checklist-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Trash2 } from "lucide-react";

export default async function ChecklistsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const checklists = await listChecklists(projectId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Checklisty</h1>
        <p className="mt-1 text-sm text-muted">
          Kontrolní seznamy před kritickými kroky — betonáž, zaklopení rozvodů,
          platba dodavateli.
        </p>
      </div>

      {access?.canEdit && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Šablony</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CHECKLIST_TEMPLATES.map((template) => (
                <div
                  key={template.key}
                  className="rounded-xl border border-border p-4"
                >
                  <p className="font-medium">{template.title}</p>
                  <p className="mt-1 text-sm text-muted">{template.description}</p>
                  <form
                    action={createChecklistFromTemplate.bind(
                      null,
                      projectId,
                      template.key
                    )}
                    className="mt-3 flex flex-wrap items-end gap-2"
                  >
                    <div className="min-w-[8rem] flex-1">
                      <Label htmlFor={`loc-${template.key}`} className="text-xs">
                        Místo (volitelné)
                      </Label>
                      <Input
                        id={`loc-${template.key}`}
                        name="location"
                        placeholder="např. koupelna, garáž"
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Vytvořit checklist
                    </Button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vlastní checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={createCustomChecklist.bind(null, projectId)}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="title">Název</Label>
                  <Input id="title" name="title" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="items">Položky (jedna na řádek)</Label>
                  <Textarea
                    id="items"
                    name="items"
                    rows={4}
                    required
                    placeholder="Fotodokumentace&#10;Kontrola kvality&#10;Souhlas dozoru"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Vytvořit
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <section className="space-y-4">
        <h2 className="font-semibold">Aktivní checklisty</h2>
        {checklists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted" />
            <p className="text-sm text-muted">
              Zatím žádný checklist. Vytvořte ho ze šablony výše.
            </p>
          </div>
        ) : (
          checklists.map((cl) => (
            <Card key={cl.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{cl.title}</CardTitle>
                  <p className="text-xs text-muted">
                    {cl.location && `${cl.location} · `}
                    {cl.status === "completed" ? "Dokončeno" : "Probíhá"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {cl.status === "completed" && (
                    <Badge variant="success">Hotovo</Badge>
                  )}
                  {access?.canEdit && (
                    <form action={deleteChecklist.bind(null, projectId, cl.id)}>
                      <Button type="submit" size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ChecklistItems
                  projectId={projectId}
                  checklistId={cl.id}
                  items={cl.items.map((i) => ({
                    id: i.id,
                    title: i.title,
                    isDone: i.isDone,
                  }))}
                  canEdit={!!access?.canEdit}
                />
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
