"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor } from "@/lib/permissions";
import { photoSchema } from "@/lib/validators";
import { saveUploadedFile } from "@/lib/storage";

function parseTags(tags?: string) {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function createPhoto(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = photoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("Vyberte fotografii.");
  }

  const saved = await saveUploadedFile(projectId, file, "photos");

  await prisma.photo.create({
    data: {
      projectId,
      title: d.title || file.name,
      description: d.description,
      photoDate: d.photoDate ? new Date(d.photoDate) : new Date(),
      stage: d.stage,
      room: d.room,
      tags: parseTags(d.tags),
      important: d.important ?? false,
      evidence: d.evidence ?? false,
      storagePath: saved.storagePath,
      mimeType: saved.mimeType,
      fileSize: saved.fileSize,
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/fotky`);
}

export async function deletePhoto(projectId: string, id: string) {
  await requireProjectEditor(projectId);
  await prisma.photo.delete({ where: { id, projectId } });
  revalidatePath(`/p/${projectId}/fotky`);
}
