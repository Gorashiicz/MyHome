"use server";

import { revalidatePath } from "next/cache";
import { Prisma, type DocumentType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { documentSchema } from "@/lib/validators";
import { saveUploadedFile } from "@/lib/storage";

function parseTags(tags?: string) {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function createDocument(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = documentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;
  let storagePath: string | null = null;
  let mimeType: string | null = null;
  let fileSize: number | null = null;

  const file = formData.get("file") as File | null;
  if (file && file.size > 0) {
    const saved = await saveUploadedFile(projectId, file, "documents");
    storagePath = saved.storagePath;
    mimeType = saved.mimeType;
    fileSize = saved.fileSize;
  }

  await prisma.document.create({
    data: {
      projectId,
      title: d.title,
      docType: d.docType as DocumentType,
      version: d.version,
      docDate: d.docDate ? new Date(d.docDate) : null,
      note: d.note,
      stage: d.stage,
      supplierId: d.supplierId || null,
      tags: parseTags(d.tags),
      storagePath,
      mimeType,
      fileSize,
      createdById: user.id,
    },
  });

  revalidatePath(`/p/${projectId}/dokumenty`);
}

export async function deleteDocument(projectId: string, id: string) {
  await requireProjectEditor(projectId);
  await prisma.document.delete({ where: { id, projectId } });
  revalidatePath(`/p/${projectId}/dokumenty`);
}

export async function listDocuments(
  projectId: string,
  filters?: { docType?: string; stage?: string; q?: string }
) {
  await requireProjectAccess(projectId);
  const where: Prisma.DocumentWhereInput = { projectId };
  if (filters?.docType) where.docType = filters.docType as DocumentType;
  if (filters?.stage) where.stage = filters.stage;
  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { note: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  return prisma.document.findMany({
    where,
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });
}
