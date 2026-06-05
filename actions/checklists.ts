"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { getChecklistTemplate } from "@/lib/checklist-templates";

export async function listChecklists(projectId: string) {
  await requireProjectAccess(projectId);
  return prisma.checklist.findMany({
    where: { projectId },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getChecklist(projectId: string, checklistId: string) {
  await requireProjectAccess(projectId);
  return prisma.checklist.findFirstOrThrow({
    where: { id: checklistId, projectId },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      createdBy: { select: { name: true } },
    },
  });
}

export async function createChecklistFromTemplate(
  projectId: string,
  templateKey: string,
  formData: FormData
) {
  const { user } = await requireProjectEditor(projectId);
  const template = getChecklistTemplate(templateKey);
  if (!template) throw new Error("Neznámá šablona");

  const location = String(formData.get("location") ?? "").trim() || null;
  const stage = String(formData.get("stage") ?? "").trim() || null;

  await prisma.checklist.create({
    data: {
      projectId,
      title: template.title,
      templateKey,
      stage,
      location,
      createdById: user.id,
      items: {
        create: template.items.map((title, index) => ({
          title,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath(`/p/${projectId}/checklisty`);
}

export async function createCustomChecklist(
  projectId: string,
  formData: FormData
) {
  const { user } = await requireProjectEditor(projectId);
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Zadejte název checklistu");

  const rawItems = String(formData.get("items") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (rawItems.length === 0) {
    throw new Error("Přidejte alespoň jednu položku");
  }

  await prisma.checklist.create({
    data: {
      projectId,
      title,
      location: String(formData.get("location") ?? "").trim() || null,
      stage: String(formData.get("stage") ?? "").trim() || null,
      createdById: user.id,
      items: {
        create: rawItems.map((itemTitle, index) => ({
          title: itemTitle,
          sortOrder: index,
        })),
      },
    },
  });

  revalidatePath(`/p/${projectId}/checklisty`);
}

export async function toggleChecklistItem(
  projectId: string,
  itemId: string,
  isDone: boolean
) {
  await requireProjectEditor(projectId);

  const item = await prisma.checklistItem.findFirst({
    where: { id: itemId, checklist: { projectId } },
    include: { checklist: { include: { items: true } } },
  });
  if (!item) throw new Error("Položka nenalezena");

  await prisma.checklistItem.update({
    where: { id: itemId },
    data: {
      isDone,
      doneAt: isDone ? new Date() : null,
    },
  });

  const allItems = item.checklist.items.map((i) =>
    i.id === itemId ? { ...i, isDone } : i
  );
  const allDone = allItems.every((i) => i.isDone);

  if (allDone && item.checklist.status !== "completed") {
    await prisma.checklist.update({
      where: { id: item.checklistId },
      data: { status: "completed", completedAt: new Date() },
    });
  } else if (!allDone && item.checklist.status === "completed") {
    await prisma.checklist.update({
      where: { id: item.checklistId },
      data: { status: "active", completedAt: null },
    });
  }

  revalidatePath(`/p/${projectId}/checklisty`);
}

export async function deleteChecklist(projectId: string, checklistId: string) {
  await requireProjectEditor(projectId);
  await prisma.checklist.delete({ where: { id: checklistId, projectId } });
  revalidatePath(`/p/${projectId}/checklisty`);
}
