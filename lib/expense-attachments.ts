import type { AttachmentType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireProjectAccess } from "@/lib/permissions";

export async function getExpenseAttachments(
  projectId: string,
  expenseId: string
) {
  return prisma.attachment.findMany({
    where: {
      projectId,
      entityType: "expense",
      entityId: expenseId,
    },
    orderBy: { uploadedAt: "desc" },
    include: {
      uploadedBy: { select: { name: true, email: true } },
    },
  });
}

/** Všechny faktury a účtenky nahrané u výdajů v projektu. */
export async function listProjectExpenseAttachments(projectId: string) {
  await requireProjectAccess(projectId);

  const attachments = await prisma.attachment.findMany({
    where: { projectId, entityType: "expense" },
    orderBy: { uploadedAt: "desc" },
    include: {
      uploadedBy: { select: { name: true, email: true } },
    },
  });

  if (attachments.length === 0) return [];

  const expenses = await prisma.expense.findMany({
    where: {
      projectId,
      id: { in: [...new Set(attachments.map((a) => a.entityId))] },
    },
    select: { id: true, title: true, expenseDate: true, amount: true },
  });
  const expenseById = Object.fromEntries(expenses.map((e) => [e.id, e]));

  return attachments.map((a) => ({
    ...a,
    expense: expenseById[a.entityId] ?? null,
  }));
}

export type ExpenseAttachmentItem = Awaited<
  ReturnType<typeof getExpenseAttachments>
>[number];

export type ProjectExpenseAttachmentItem = Awaited<
  ReturnType<typeof listProjectExpenseAttachments>
>[number];

export function labelAttachmentType(type: AttachmentType) {
  switch (type) {
    case "invoice":
      return "Faktura";
    case "receipt":
      return "Účtenka";
    default:
      return "Příloha";
  }
}
