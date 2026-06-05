"use server";

import { revalidatePath } from "next/cache";
import { PaymentStatus, type MilestoneStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { toNumber, formatCzk } from "@/lib/formatting";
import { DEFAULT_MILESTONES } from "@/lib/milestone-defaults";

export async function listMilestones(projectId: string) {
  await requireProjectAccess(projectId);
  return prisma.milestone.findMany({
    where: { projectId },
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { targetDate: "asc" }],
  });
}

export async function createMilestone(projectId: string, formData: FormData) {
  await requireProjectEditor(projectId);

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Zadejte název milníku");

  const targetDateRaw = String(formData.get("targetDate") ?? "").trim();
  const stage = String(formData.get("stage") ?? "").trim() || null;
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  const count = await prisma.milestone.count({ where: { projectId } });

  await prisma.milestone.create({
    data: {
      projectId,
      title,
      description,
      stage,
      categoryId,
      targetDate: targetDateRaw ? new Date(targetDateRaw) : null,
      sortOrder: count,
    },
  });

  revalidatePath(`/p/${projectId}/milniky`);
  revalidatePath(`/p/${projectId}`);
}

export async function seedDefaultMilestones(projectId: string) {
  await requireProjectEditor(projectId);

  const existing = await prisma.milestone.count({ where: { projectId } });
  if (existing > 0) {
    throw new Error("Milníky už existují");
  }

  await prisma.milestone.createMany({
    data: DEFAULT_MILESTONES.map((m) => ({
      projectId,
      title: m.title,
      stage: m.stage,
      sortOrder: m.sortOrder,
    })),
  });

  revalidatePath(`/p/${projectId}/milniky`);
  revalidatePath(`/p/${projectId}`);
}

export async function updateMilestoneStatus(
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus
) {
  await requireProjectEditor(projectId);

  await prisma.milestone.update({
    where: { id: milestoneId, projectId },
    data: {
      status,
      completedAt: status === "done" ? new Date() : null,
    },
  });

  revalidatePath(`/p/${projectId}/milniky`);
  revalidatePath(`/p/${projectId}`);
}

export async function updateMilestoneStatusFromForm(
  projectId: string,
  milestoneId: string,
  formData: FormData
) {
  const status = String(formData.get("status")) as MilestoneStatus;
  if (!["planned", "in_progress", "done"].includes(status)) {
    throw new Error("Neplatný stav");
  }
  await updateMilestoneStatus(projectId, milestoneId, status);
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  await requireProjectEditor(projectId);
  await prisma.milestone.delete({ where: { id: milestoneId, projectId } });
  revalidatePath(`/p/${projectId}/milniky`);
  revalidatePath(`/p/${projectId}`);
}

export async function getMilestoneOverview(projectId: string, milestoneId: string) {
  await requireProjectAccess(projectId);

  const milestone = await prisma.milestone.findFirstOrThrow({
    where: { id: milestoneId, projectId },
    include: { category: true },
  });

  const paidStatuses: PaymentStatus[] = [
    PaymentStatus.paid,
    PaymentStatus.partially_paid,
  ];

  const expenseWhere = {
    projectId,
    ...(milestone.categoryId
      ? { categoryId: milestone.categoryId }
      : milestone.stage
        ? { stage: milestone.stage }
        : {}),
  };

  const [expenses, photos, tasks] = await Promise.all([
    prisma.expense.findMany({
      where: expenseWhere,
      include: { category: true },
      orderBy: { expenseDate: "desc" },
      take: 10,
    }),
    prisma.photo.findMany({
      where: {
        projectId,
        ...(milestone.stage ? { stage: milestone.stage } : {}),
      },
      orderBy: { photoDate: "desc" },
      take: 6,
    }),
    prisma.task.findMany({
      where: {
        projectId,
        status: { notIn: ["done", "cancelled"] },
        ...(milestone.stage ? { stage: milestone.stage } : {}),
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
  ]);

  const spent = expenses
    .filter((e) => paidStatuses.includes(e.paymentStatus))
    .reduce((sum, e) => sum + toNumber(e.amount), 0);

  const planned = milestone.category
    ? toNumber(milestone.category.plannedAmount)
    : null;

  return {
    milestone,
    spent,
    spentFormatted: formatCzk(spent),
    planned,
    plannedFormatted: planned != null ? formatCzk(planned) : null,
    expenses,
    photos,
    tasks,
  };
}

export async function getCalendarEvents(
  projectId: string,
  year: number,
  month: number
) {
  await requireProjectAccess(projectId);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const [milestones, tasks] = await Promise.all([
    prisma.milestone.findMany({
      where: {
        projectId,
        targetDate: { gte: start, lte: end },
      },
      orderBy: { targetDate: "asc" },
    }),
    prisma.task.findMany({
      where: {
        projectId,
        dueDate: { gte: start, lte: end },
        status: { notIn: ["done", "cancelled"] },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return { milestones, tasks };
}
