"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { categorySchema } from "@/lib/validators";
import { isOtherBudgetCategory } from "@/lib/budget-other-category";

export async function updateCategory(
  projectId: string,
  categoryId: string,
  formData: FormData
) {
  await requireProjectEditor(projectId);
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  await prisma.budgetCategory.update({
    where: { id: categoryId, projectId },
    data: {
      name: parsed.data.name,
      plannedAmount: parsed.data.plannedAmount,
      note: parsed.data.note || null,
    },
  });

  revalidatePath(`/p/${projectId}/rozpocet`);
  revalidatePath(`/p/${projectId}/rozpocet/kategorie/${categoryId}`);
}

export async function toggleCategoryClosed(
  projectId: string,
  categoryId: string
) {
  await requireProjectEditor(projectId);

  const category = await prisma.budgetCategory.findFirstOrThrow({
    where: { id: categoryId, projectId },
    select: { closedAt: true },
  });

  await prisma.budgetCategory.update({
    where: { id: categoryId, projectId },
    data: { closedAt: category.closedAt ? null : new Date() },
  });

  revalidatePath(`/p/${projectId}/rozpocet`);
  revalidatePath(`/p/${projectId}/rozpocet/kategorie/${categoryId}`);
}

export async function createCategory(projectId: string, formData: FormData) {
  await requireProjectEditor(projectId);
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  const maxOrder = await prisma.budgetCategory.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });

  await prisma.budgetCategory.create({
    data: {
      projectId,
      name: parsed.data.name,
      plannedAmount: parsed.data.plannedAmount,
      note: parsed.data.note || null,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath(`/p/${projectId}/rozpocet`);
}

export async function deleteCategory(projectId: string, categoryId: string) {
  await requireProjectEditor(projectId);
  const category = await prisma.budgetCategory.findFirstOrThrow({
    where: { id: categoryId, projectId },
    select: { name: true },
  });
  if (isOtherBudgetCategory(category.name)) {
    throw new Error("Položku Ostatní nelze smazat.");
  }
  const expenseCount = await prisma.expense.count({
    where: { categoryId, projectId },
  });
  if (expenseCount > 0) {
    throw new Error("Kategorie obsahuje výdaje a nelze ji smazat.");
  }
  await prisma.budgetCategory.delete({
    where: { id: categoryId, projectId },
  });
  revalidatePath(`/p/${projectId}/rozpocet`);
  redirect(`/p/${projectId}/rozpocet`);
}

export async function getCategoryDetail(projectId: string, categoryId: string) {
  await requireProjectAccess(projectId);

  const category = await prisma.budgetCategory.findFirstOrThrow({
    where: { id: categoryId, projectId },
  });

  const expenses = await prisma.expense.findMany({
    where: { projectId, categoryId },
    include: {
      supplier: true,
      supplierLinks: {
        include: { supplier: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: [{ expenseDate: "desc" }, { amount: "desc" }],
  });

  return { category, expenses };
}
