"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectEditor, requireProjectAccess } from "@/lib/permissions";
import { supplierSchema } from "@/lib/validators";
import type { z } from "zod";

export async function createSupplier(projectId: string, formData: FormData) {
  await requireProjectEditor(projectId);
  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.supplier.create({
    data: supplierDataFromParsed(projectId, d),
  });

  revalidatePath(`/p/${projectId}/dodavatele`);
}

export async function updateSupplier(
  projectId: string,
  supplierId: string,
  formData: FormData
) {
  await requireProjectEditor(projectId);
  const parsed = supplierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const d = parsed.data;

  await prisma.supplier.update({
    where: { id: supplierId, projectId },
    data: {
      name: d.name,
      profession: d.profession || null,
      companyName: d.companyName || null,
      ico: d.ico || null,
      phone: d.phone || null,
      email: d.email || null,
      website: d.website || null,
      address: d.address || null,
      notes: d.notes || null,
      rating: d.rating ?? null,
    },
  });

  revalidatePath(`/p/${projectId}/dodavatele`);
  revalidatePath(`/p/${projectId}/dodavatele/${supplierId}`);
}

function supplierDataFromParsed(
  projectId: string,
  d: z.infer<typeof supplierSchema>
) {
  return {
    projectId,
    name: d.name,
    profession: d.profession || null,
    companyName: d.companyName || null,
    ico: d.ico || null,
    phone: d.phone || null,
    email: d.email || null,
    website: d.website || null,
    address: d.address || null,
    notes: d.notes || null,
    rating: d.rating ?? null,
  };
}

export async function deleteSupplier(projectId: string, id: string) {
  await requireProjectEditor(projectId);
  await prisma.supplier.delete({ where: { id, projectId } });
  revalidatePath(`/p/${projectId}/dodavatele`);
}

export async function getSupplierDetail(projectId: string, id: string) {
  await requireProjectAccess(projectId);

  const supplier = await prisma.supplier.findFirstOrThrow({
    where: { id, projectId },
    include: {
      expenses: { take: 20, orderBy: { expenseDate: "desc" } },
      expenseLinks: {
        take: 20,
        orderBy: { expense: { expenseDate: "desc" } },
        include: { expense: true },
      },
      tasks: { take: 10 },
      documents: { take: 10 },
      defects: { take: 10 },
    },
  });

  const byId = new Map<string, (typeof supplier.expenses)[number]>();
  for (const e of supplier.expenses) byId.set(e.id, e);
  for (const link of supplier.expenseLinks) {
    if (!byId.has(link.expense.id)) byId.set(link.expense.id, link.expense);
  }

  const expenses = [...byId.values()]
    .sort((a, b) => b.expenseDate.getTime() - a.expenseDate.getTime())
    .slice(0, 20);

  return { ...supplier, expenses };
}
