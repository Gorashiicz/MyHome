"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { expenseSchema } from "@/lib/validators";
import {
  backfillExpenseSupplierLinks,
  parseSupplierNamesFromFormData,
  syncExpenseSuppliers,
} from "@/lib/expense-suppliers";
import {
  attachmentTypeFromMime,
  formatUploadError,
  saveUploadedFile,
} from "@/lib/storage";
import { paymentStatusForCategory } from "@/lib/expense-payment";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";

function parseTags(tags?: string) {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function parseExpenseFormData(formData: FormData) {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === "string")
  );
  return expenseSchema.safeParse(raw);
}

export type ExpenseFormState = { error?: string };

export async function createExpenseAction(
  projectId: string,
  _prev: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  try {
    await createExpense(projectId, formData);
    return {};
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: formatUploadError(error) };
  }
}

const expenseInclude = {
  category: true,
  supplier: true,
  supplierLinks: {
    include: { supplier: true },
    orderBy: { sortOrder: "asc" as const },
  },
  createdBy: { select: { name: true } },
};

export async function createExpense(projectId: string, formData: FormData) {
  const { user } = await requireProjectEditor(projectId);
  const parsed = parseExpenseFormData(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Neplatná data");
  }
  const d = parsed.data;
  const supplierNames = parseSupplierNamesFromFormData(formData);

  const category = d.categoryId
    ? await prisma.budgetCategory.findFirst({
        where: { id: d.categoryId, projectId },
        select: { name: true },
      })
    : null;
  const paymentStatus = paymentStatusForCategory(
    d.paymentStatus,
    category?.name
  );

  const expense = await prisma.expense.create({
    data: {
      projectId,
      title: d.title,
      amount: d.amount,
      currency: d.currency,
      expenseDate: new Date(d.expenseDate),
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      paymentStatus,
      categoryId: d.categoryId || null,
      stage: d.stage || null,
      supplierId: null,
      note: d.note || null,
      tags: parseTags(d.tags),
      createdById: user.id,
    },
  });

  try {
    await syncExpenseSuppliers(projectId, expense.id, supplierNames);

    const file = formData.get("attachment") as File | null;
    if (file && file.size > 0) {
      const saved = await saveUploadedFile(projectId, file, "invoices");
      await prisma.attachment.create({
        data: {
          projectId,
          originalName: saved.originalName,
          storagePath: saved.storagePath,
          mimeType: saved.mimeType,
          fileSize: saved.fileSize,
          type: attachmentTypeFromMime(saved.mimeType),
          entityType: "expense",
          entityId: expense.id,
          uploadedById: user.id,
        },
      });
    }
  } catch (error) {
    await prisma.expense.delete({ where: { id: expense.id } });
    throw error;
  }

  revalidatePath(`/p/${projectId}`);
  revalidatePath(`/p/${projectId}/dodavatele`);
  revalidatePath(`/p/${projectId}/dokumenty`);
  redirect(`/p/${projectId}/rozpocet/vydaje`);
}

export async function getExpenseDetail(projectId: string, expenseId: string) {
  await requireProjectAccess(projectId);
  await backfillExpenseSupplierLinks(projectId);

  return prisma.expense.findFirstOrThrow({
    where: { id: expenseId, projectId },
    include: expenseInclude,
  });
}

export async function updateExpense(
  projectId: string,
  expenseId: string,
  formData: FormData
) {
  await requireProjectEditor(projectId);
  const parsed = parseExpenseFormData(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Neplatná data");
  }
  const d = parsed.data;
  const supplierNames = parseSupplierNamesFromFormData(formData);

  const category = d.categoryId
    ? await prisma.budgetCategory.findFirst({
        where: { id: d.categoryId, projectId },
        select: { name: true },
      })
    : null;
  const paymentStatus = paymentStatusForCategory(
    d.paymentStatus,
    category?.name
  );

  await prisma.expense.update({
    where: { id: expenseId, projectId },
    data: {
      title: d.title,
      amount: d.amount,
      currency: d.currency,
      expenseDate: new Date(d.expenseDate),
      dueDate: d.dueDate ? new Date(d.dueDate) : null,
      paymentStatus,
      categoryId: d.categoryId || null,
      stage: d.stage || null,
      note: d.note || null,
      tags: parseTags(d.tags),
    },
  });

  await syncExpenseSuppliers(projectId, expenseId, supplierNames);

  revalidatePath(`/p/${projectId}`);
  revalidatePath(`/p/${projectId}/dodavatele`);
  revalidatePath(`/p/${projectId}/rozpocet/vydaje/${expenseId}`);
  redirect(`/p/${projectId}/rozpocet/vydaje/${expenseId}`);
}

export async function deleteExpense(projectId: string, expenseId: string) {
  await requireProjectEditor(projectId);
  await prisma.expense.delete({ where: { id: expenseId, projectId } });
  revalidatePath(`/p/${projectId}`);
  redirect(`/p/${projectId}/rozpocet/vydaje`);
}

export async function getExpenses(
  projectId: string,
  filters?: {
    q?: string;
    categoryId?: string;
    paymentStatus?: string;
    supplierId?: string;
    from?: string;
    to?: string;
  }
) {
  await requireProjectAccess(projectId);
  await backfillExpenseSupplierLinks(projectId);

  const where: Prisma.ExpenseWhereInput = { projectId };

  if (filters?.q) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { title: { contains: filters.q, mode: "insensitive" } },
          { note: { contains: filters.q, mode: "insensitive" } },
        ],
      },
    ];
  }
  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.paymentStatus === "pending") {
    // Nerealizované jen u běžných položek — Ostatní se vždy počítá do nákladů.
    const otherCategories = await prisma.budgetCategory.findMany({
      where: { projectId },
      select: { id: true, name: true },
    });
    const otherIds = otherCategories
      .filter((c) => isOtherBudgetCategory(c.name))
      .map((c) => c.id);
    where.paymentStatus = { in: ["planned", "ordered"] };
    if (otherIds.length > 0) {
      where.AND = [
        ...(Array.isArray(where.AND)
          ? where.AND
          : where.AND
            ? [where.AND]
            : []),
        {
          OR: [{ categoryId: null }, { categoryId: { notIn: otherIds } }],
        },
      ];
    }
  } else if (filters?.paymentStatus) {
    where.paymentStatus = filters.paymentStatus as never;
  }
  if (filters?.supplierId) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { supplierId: filters.supplierId },
          { supplierLinks: { some: { supplierId: filters.supplierId } } },
        ],
      },
    ];
  }
  if (filters?.from || filters?.to) {
    where.expenseDate = {};
    if (filters.from) where.expenseDate.gte = new Date(filters.from);
    if (filters.to) where.expenseDate.lte = new Date(filters.to);
  }

  return prisma.expense.findMany({
    where,
    include: {
      category: true,
      supplier: true,
      supplierLinks: {
        include: { supplier: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ expenseDate: "desc" }, { amount: "desc" }],
  });
}
