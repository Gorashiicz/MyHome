"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor } from "@/lib/permissions";
import { saveUploadedFile } from "@/lib/storage";

export async function addExpenseAttachment(
  projectId: string,
  expenseId: string,
  formData: FormData
) {
  const { user } = await requireProjectEditor(projectId);

  const expense = await prisma.expense.findFirst({
    where: { id: expenseId, projectId },
    select: { id: true },
  });
  if (!expense) throw new Error("Výdaj nenalezen");

  const file = formData.get("attachment") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Vyberte soubor");
  }

  const saved = await saveUploadedFile(projectId, file, "invoices");
  await prisma.attachment.create({
    data: {
      projectId,
      originalName: saved.originalName,
      storagePath: saved.storagePath,
      mimeType: saved.mimeType,
      fileSize: saved.fileSize,
      type: file.type === "application/pdf" ? "invoice" : "receipt",
      entityType: "expense",
      entityId: expenseId,
      uploadedById: user.id,
    },
  });

  revalidateExpensePaths(projectId, expenseId);
}

export async function deleteExpenseAttachment(
  projectId: string,
  attachmentId: string
) {
  await requireProjectEditor(projectId);

  const attachment = await prisma.attachment.findFirst({
    where: {
      id: attachmentId,
      projectId,
      entityType: "expense",
    },
  });
  if (!attachment) throw new Error("Příloha nenalezena");

  await prisma.attachment.delete({ where: { id: attachmentId } });

  revalidateExpensePaths(projectId, attachment.entityId);
}

function revalidateExpensePaths(projectId: string, expenseId: string) {
  revalidatePath(`/p/${projectId}/rozpocet/vydaje/${expenseId}`);
  revalidatePath(`/p/${projectId}/rozpocet/vydaje/${expenseId}/upravit`);
  revalidatePath(`/p/${projectId}/rozpocet/vydaje`);
}
