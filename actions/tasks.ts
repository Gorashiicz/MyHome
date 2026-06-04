"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { taskSchema } from "@/lib/validators";

export async function createTask(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.task.create({
    data: {
      projectId,
      title: d.title,
      description: d.description,
      status: d.status,
      priority: d.priority,
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      assigneeId: d.assigneeId || null,
      supplierId: d.supplierId || null,
      stage: d.stage,
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/ukoly`);
}

export async function updateTask(
  projectId: string,
  taskId: string,
  formData: FormData
) {
  await requireProjectEditor(projectId);
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.task.update({
    where: { id: taskId, projectId },
    data: {
      title: d.title,
      description: d.description,
      status: d.status,
      priority: d.priority,
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      assigneeId: d.assigneeId || null,
      supplierId: d.supplierId || null,
      stage: d.stage,
    },
  });

  revalidatePath(`/p/${projectId}/ukoly`);
}

export async function deleteTask(projectId: string, taskId: string) {
  await requireProjectEditor(projectId);
  await prisma.task.delete({ where: { id: taskId, projectId } });
  revalidatePath(`/p/${projectId}/ukoly`);
}

export async function listTasks(projectId: string, view?: string) {
  await requireProjectAccess(projectId);
  const now = new Date();
  const where: Prisma.TaskWhereInput = { projectId };

  if (view === "overdue") {
    where.dueDate = { lt: now };
    where.status = { notIn: ["done", "cancelled"] };
  } else if (view === "upcoming") {
    where.dueDate = { gte: now };
    where.status = { notIn: ["done", "cancelled"] };
  } else if (view === "done") {
    where.status = "done";
  }

  return prisma.task.findMany({
    where,
    include: {
      assignee: { select: { name: true, email: true } },
      supplier: true,
    },
    orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
  });
}
