"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectOwner, requireProjectAccess } from "@/lib/permissions";
import { diarySchema, diaryMetadataSchema } from "@/lib/validators";

function diaryEntryData(d: ReturnType<typeof diarySchema.parse>) {
  return {
    entryDate: new Date(d.entryDate),
    weather: d.weather || null,
    siteCondition: d.siteCondition || null,
    title: d.title,
    workPerformed: d.workPerformed || null,
    peoplePresent: d.peoplePresent || null,
    machinesEquipment: d.machinesEquipment || null,
    materialsDelivered: d.materialsDelivered || null,
    dustMeasures: d.dustMeasures || null,
    accessibilityMeasures: d.accessibilityMeasures || null,
    problems: d.problems || null,
    decisions: d.decisions || null,
    notes: d.notes || null,
  };
}

export async function createDiaryEntry(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = diarySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.diaryEntry.create({
    data: {
      projectId,
      ...diaryEntryData(d),
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/denik`);
  redirect(`/p/${projectId}/denik`);
}

export async function getDiaryEntry(projectId: string, entryId: string) {
  await requireProjectAccess(projectId);
  return prisma.diaryEntry.findFirstOrThrow({
    where: { id: entryId, projectId },
    include: { createdBy: { select: { name: true } } },
  });
}

export async function updateDiaryEntry(
  projectId: string,
  entryId: string,
  formData: FormData
) {
  await requireProjectEditor(projectId);
  const parsed = diarySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  await prisma.diaryEntry.update({
    where: { id: entryId, projectId },
    data: diaryEntryData(parsed.data),
  });

  revalidatePath(`/p/${projectId}/denik`);
  redirect(`/p/${projectId}/denik`);
}

export async function updateDiaryMetadata(projectId: string, formData: FormData) {
  await requireProjectOwner(projectId);
  const parsed = diaryMetadataSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { diaryMetadata: parsed.data },
  });

  revalidatePath(`/p/${projectId}/denik`);
}

export async function deleteDiaryEntry(projectId: string, id: string) {
  await requireProjectEditor(projectId);
  await prisma.diaryEntry.delete({ where: { id, projectId } });
  revalidatePath(`/p/${projectId}/denik`);
}
