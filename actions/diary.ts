"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectOwner } from "@/lib/permissions";
import { diarySchema, diaryMetadataSchema } from "@/lib/validators";

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
      entryDate: new Date(d.entryDate),
      weather: d.weather,
      siteCondition: d.siteCondition,
      title: d.title,
      workPerformed: d.workPerformed,
      peoplePresent: d.peoplePresent,
      machinesEquipment: d.machinesEquipment,
      materialsDelivered: d.materialsDelivered,
      dustMeasures: d.dustMeasures,
      accessibilityMeasures: d.accessibilityMeasures,
      problems: d.problems,
      decisions: d.decisions,
      notes: d.notes,
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/denik`);
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
