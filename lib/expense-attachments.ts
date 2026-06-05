import { prisma } from "@/lib/db";

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

export type ExpenseAttachmentItem = Awaited<
  ReturnType<typeof getExpenseAttachments>
>[number];
