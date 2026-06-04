import Link from "next/link";
import { listTasks } from "@/actions/tasks";
import { createTask, deleteTask } from "@/actions/tasks";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate, labelTaskStatus, labelTaskPriority } from "@/lib/formatting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { projectId } = await params;
  const { view } = await searchParams;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const tasks = await listTasks(projectId, view);
  const suppliers = await prisma.supplier.findMany({ where: { projectId } });
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Úkoly a termíny</h1>
      <div className="flex flex-wrap gap-2 text-sm">
        <Link href={`/p/${projectId}/ukoly`}>Vše</Link>
        <Link href={`/p/${projectId}/ukoly?view=upcoming`}>Nadcházející</Link>
        <Link href={`/p/${projectId}/ukoly?view=overdue`}>Po termínu</Link>
        <Link href={`/p/${projectId}/ukoly?view=done`}>Hotové</Link>
      </div>

      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nový úkol</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTask.bind(null, projectId)} className="space-y-3">
              <div>
                <Label htmlFor="title">Název *</Label>
                <Input id="title" name="title" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="dueDate">Termín</Label>
                <Input id="dueDate" name="dueDate" type="date" className="mt-1" />
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
              <input type="hidden" name="status" value="todo" />
              <Button type="submit" className="w-full">
                Přidat úkol
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="rounded-lg border bg-white p-3">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{t.title}</span>
              <Badge>{labelTaskPriority(t.priority)}</Badge>
            </div>
            <p className="text-xs text-slate-500">
              {labelTaskStatus(t.status)}
              {t.dueDate && ` · ${formatDate(t.dueDate)}`}
            </p>
            {access?.canEdit && (
              <form action={deleteTask.bind(null, projectId, t.id)} className="mt-2">
                <Button type="submit" variant="ghost" size="sm">
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
