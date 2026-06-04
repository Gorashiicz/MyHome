import { prisma } from "@/lib/db";

export async function resolveSupplierId(
  projectId: string,
  supplierId?: string,
  supplierName?: string
): Promise<string | null> {
  if (supplierId) return supplierId;
  const name = supplierName?.trim();
  if (!name) return null;

  const existing = await prisma.supplier.findFirst({
    where: { projectId, name: { equals: name, mode: "insensitive" } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.supplier.create({
    data: { projectId, name },
    select: { id: true },
  });
  return created.id;
}

export function parseSupplierNamesFromFormData(formData: FormData): string[] {
  const fromList = formData
    .getAll("supplierNames")
    .map((v) => String(v).trim())
    .filter(Boolean);

  if (fromList.length > 0) {
    return [...new Set(fromList)];
  }

  const legacy = String(formData.get("supplierName") ?? "").trim();
  return legacy ? [legacy] : [];
}

export async function syncExpenseSuppliers(
  projectId: string,
  expenseId: string,
  names: string[]
) {
  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  const supplierIds: string[] = [];

  for (const name of uniqueNames) {
    const id = await resolveSupplierId(projectId, undefined, name);
    if (id) supplierIds.push(id);
  }

  await prisma.expenseSupplier.deleteMany({ where: { expenseId } });

  if (supplierIds.length > 0) {
    await prisma.expenseSupplier.createMany({
      data: supplierIds.map((supplierId, sortOrder) => ({
        expenseId,
        supplierId,
        sortOrder,
      })),
    });
  }

  await prisma.expense.update({
    where: { id: expenseId },
    data: { supplierId: supplierIds[0] ?? null },
  });

  return supplierIds;
}

/** Po migraci doplní vazby u starých výdajů, které mají jen supplierId. */
export async function backfillExpenseSupplierLinks(projectId: string) {
  const orphans = await prisma.expense.findMany({
    where: {
      projectId,
      supplierId: { not: null },
      supplierLinks: { none: {} },
    },
    select: { id: true, supplierId: true },
  });

  for (const e of orphans) {
    if (!e.supplierId) continue;
    await prisma.expenseSupplier.create({
      data: { expenseId: e.id, supplierId: e.supplierId, sortOrder: 0 },
    });
  }
}

export type ExpenseSupplierRef = { id: string; name: string };

export function expenseSuppliersFromRecord(expense: {
  supplier?: { id: string; name: string } | null;
  supplierLinks?: { supplier: { id: string; name: string } }[];
}): ExpenseSupplierRef[] {
  if (expense.supplierLinks?.length) {
    return expense.supplierLinks.map((l) => l.supplier);
  }
  if (expense.supplier) {
    return [expense.supplier];
  }
  return [];
}

export function formatExpenseSuppliers(
  suppliers: ExpenseSupplierRef[],
  separator = ", "
): string {
  return suppliers.map((s) => s.name).join(separator);
}
