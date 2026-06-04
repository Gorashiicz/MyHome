import Link from "next/link";
import { prisma } from "@/lib/db";
import { resolveProjectRoute } from "@/lib/project-context";
import { requireProjectOwner } from "@/lib/permissions";
import { updateProject, archiveProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);

  try {
    await requireProjectOwner(projectId);
  } catch {
    return (
      <p className="text-slate-600">Nastavení projektu může měnit pouze vlastník.</p>
    );
  }

  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
  });

  return (
    <div className="space-y-6">
      <Link href={`/p/${projectId}/vice`} className="text-sm text-emerald-700">
        ← Zpět
      </Link>
      <h1 className="text-xl font-bold">Nastavení stavby</h1>

      <Card>
        <CardContent className="pt-4">
          <form action={updateProject.bind(null, projectId)} className="space-y-4">
            <div>
              <Label htmlFor="name">Název</Label>
              <Input
                id="name"
                name="name"
                defaultValue={project.name}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Popis</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project.description ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budgetMode">Režim rozpočtu</Label>
              <Select
                id="budgetMode"
                name="budgetMode"
                defaultValue={project.budgetMode}
                className="mt-1"
              >
                <option value="limited">S limitem</option>
                <option value="open">Otevřený</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="budgetLimit">Limit (Kč)</Label>
              <Input
                id="budgetLimit"
                name="budgetLimit"
                type="number"
                defaultValue={project.budgetLimit?.toString() ?? ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">Stav</Label>
              <Select id="status" name="status" defaultValue={project.status} className="mt-1">
                <option value="planning">Plánování</option>
                <option value="active">Aktivní</option>
                <option value="paused">Pozastaveno</option>
                <option value="finished">Dokončeno</option>
              </Select>
            </div>
            <SaveButton label="Uložit změny" />
          </form>
        </CardContent>
      </Card>

      <form action={archiveProject.bind(null, projectId)}>
        <Button type="submit" variant="destructive">
          Archivovat projekt
        </Button>
      </form>
    </div>
  );
}
