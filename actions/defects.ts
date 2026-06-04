"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor } from "@/lib/permissions";
import { defectSchema } from "@/lib/validators";

export async function createDefect(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = defectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.defect.create({
    data: {
      projectId,
      title: d.title,
      description: d.description,
      status: d.status,
      priority: d.priority,
      supplierId: d.supplierId || null,
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      dateFound: d.dateFound ? new Date(d.dateFound) : new Date(),
      dateFixed: d.dateFixed ? new Date(d.dateFixed) : null,
      location: d.location,
      stage: d.stage,
      notes: d.notes,
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/vady`);
}

export async function deleteDefect(projectId: string, id: string) {
  await requireProjectEditor(projectId);
  await prisma.defect.delete({ where: { id, projectId } });
  revalidatePath(`/p/${projectId}/vady`);
}
