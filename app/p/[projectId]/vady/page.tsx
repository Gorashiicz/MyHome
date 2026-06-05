import { createDefect, deleteDefect } from "@/actions/defects";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate, labelDefectStatus, labelTaskPriority } from "@/lib/formatting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionPage } from "@/components/layout/section-banner";

export default async function DefectsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const defects = await prisma.defect.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { supplier: true },
  });
  const suppliers = await prisma.supplier.findMany({ where: { projectId } });

  return (
    <SectionPage
      section="tasks"
      title="Vady a reklamace"
      description="Evidence vadných prací a průběh reklamací u dodavatelů"
      bodyClassName="space-y-6"
    >
      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nová vada</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDefect.bind(null, projectId)} className="space-y-3">
              <div>
                <Label htmlFor="title">Název *</Label>
                <Input id="title" name="title" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">Popis</Label>
                <Textarea id="description" name="description" rows={2} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="priority">Priorita</Label>
                <Select id="priority" name="priority" defaultValue="medium" className="mt-1">
                  <option value="low">Nízká</option>
                  <option value="medium">Střední</option>
                  <option value="high">Vysoká</option>
                  <option value="critical">Kritická</option>
                </Select>
              </div>
              <input type="hidden" name="status" value="open" />
              <Button type="submit" className="w-full">
                Přidat vadu
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <ul className="space-y-2">
        {defects.map((d) => (
          <li key={d.id} className="rounded-lg border bg-white p-3">
            <div className="flex justify-between">
              <span className="font-medium">{d.title}</span>
              <Badge variant={d.status === "open" ? "warning" : "default"}>
                {labelDefectStatus(d.status)}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {labelTaskPriority(d.priority)}
              {d.dueDate && ` · termín ${formatDate(d.dueDate)}`}
              {d.supplier && ` · ${d.supplier.name}`}
            </p>
            {access?.canEdit && (
              <form action={deleteDefect.bind(null, projectId, d.id)} className="mt-2">
                <Button type="submit" variant="ghost" size="sm">
                  Smazat
                </Button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </SectionPage>
  );
}
