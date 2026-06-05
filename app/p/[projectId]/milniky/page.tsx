import {
  listMilestones,
  createMilestone,
  seedDefaultMilestones,
  deleteMilestone,
  getMilestoneOverview,
  getCalendarEvents,
  updateMilestoneStatusFromForm,
} from "@/actions/milestones";
import { MilestoneCalendar } from "@/components/milestones/milestone-calendar";
import { MilestoneDetailPanel } from "@/components/milestones/milestone-detail-panel";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate, labelMilestoneStatus } from "@/lib/formatting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveButton } from "@/components/ui/save-button";
import { Trash2 } from "lucide-react";
import type { MilestoneStatus } from "@prisma/client";

const STATUS_OPTIONS: MilestoneStatus[] = ["planned", "in_progress", "done"];

function serializeOverview(
  overview: Awaited<ReturnType<typeof getMilestoneOverview>>
) {
  return {
    milestone: {
      id: overview.milestone.id,
      title: overview.milestone.title,
      description: overview.milestone.description,
      status: overview.milestone.status,
      targetDate: overview.milestone.targetDate?.toISOString() ?? null,
      stage: overview.milestone.stage,
      category: overview.milestone.category
        ? {
            id: overview.milestone.category.id,
            name: overview.milestone.category.name,
          }
        : null,
    },
    spentFormatted: overview.spentFormatted,
    plannedFormatted: overview.plannedFormatted,
    expenses: overview.expenses.map((e) => ({
      id: e.id,
      title: e.title,
      amount: e.amount,
      expenseDate: e.expenseDate.toISOString(),
    })),
    photos: overview.photos.map((p) => ({
      id: p.id,
      title: p.title,
      storagePath: p.storagePath,
    })),
    tasks: overview.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate?.toISOString() ?? null,
    })),
  };
}

export default async function MilestonesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);

  const now = new Date();
  const [milestones, categories, calendar] = await Promise.all([
    listMilestones(projectId),
    prisma.budgetCategory.findMany({
      where: { projectId },
      orderBy: { sortOrder: "asc" },
    }),
    getCalendarEvents(projectId, now.getFullYear(), now.getMonth() + 1),
  ]);

  const overviews = await Promise.all(
    milestones.map((m) => getMilestoneOverview(projectId, m.id))
  );
  const serializedOverviews = overviews.map(serializeOverview);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Milníky a kalendář</h1>
        <p className="mt-1 text-sm text-muted">
          Časová osa stavby propojená s výdaji, fotkami a úkoly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kalendář</CardTitle>
          </CardHeader>
          <CardContent>
            <MilestoneCalendar
              milestones={calendar.milestones.map((m) => ({
                id: m.id,
                title: m.title,
                targetDate: m.targetDate!.toISOString(),
                status: m.status,
              }))}
              tasks={calendar.tasks.map((t) => ({
                id: t.id,
                title: t.title,
                dueDate: t.dueDate!.toISOString(),
              }))}
            />
          </CardContent>
        </Card>

        {access?.canEdit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nový milník</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.length === 0 && (
                <form action={seedDefaultMilestones.bind(null, projectId)}>
                  <Button type="submit" variant="secondary" className="w-full">
                    Přidat výchozí milníky stavby
                  </Button>
                </form>
              )}
              <form
                action={createMilestone.bind(null, projectId)}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="title">Název *</Label>
                  <Input id="title" name="title" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="targetDate">Cílový termín</Label>
                  <Input
                    id="targetDate"
                    name="targetDate"
                    type="date"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="stage">Etapa</Label>
                  <Input
                    id="stage"
                    name="stage"
                    placeholder="např. Rozvody"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryId">Položka rozpočtu</Label>
                  <Select id="categoryId" name="categoryId" className="mt-1">
                    <option value="">— bez vazby —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Poznámka</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <SaveButton className="w-full" label="Přidat milník" />
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Milníky stavby</h2>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted">
            Zatím žádné milníky. Přidejte výchozí sadu nebo vlastní milník.
          </p>
        ) : (
          milestones.map((m, index) => (
            <div key={m.id} className="space-y-2">
              {access?.canEdit && (
                <div className="flex flex-wrap items-center gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <form
                      key={status}
                      action={updateMilestoneStatusFromForm.bind(
                        null,
                        projectId,
                        m.id
                      )}
                    >
                      <input type="hidden" name="status" value={status} />
                      <Button
                        type="submit"
                        size="sm"
                        variant={m.status === status ? "default" : "outline"}
                      >
                        {labelMilestoneStatus(status)}
                      </Button>
                    </form>
                  ))}
                  <form
                    action={deleteMilestone.bind(null, projectId, m.id)}
                    className="ml-auto"
                  >
                    <Button type="submit" size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
              <MilestoneDetailPanel
                projectId={projectId}
                detail={serializedOverviews[index]}
              />
              {m.targetDate && (
                <p className="text-xs text-muted pl-1">
                  Termín: {formatDate(m.targetDate)}
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
