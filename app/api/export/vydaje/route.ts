import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProjectAccess } from "@/lib/permissions";
import { formatDate, toNumber } from "@/lib/formatting";
import { labelPaymentStatus } from "@/lib/formatting";
import { formatExpenseSuppliers, expenseSuppliersFromRecord } from "@/lib/expense-suppliers";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return new NextResponse("Missing projectId", { status: 400 });
  }

  const access = await getProjectAccess(projectId, session.user.id);
  if (!access) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const expenses = await prisma.expense.findMany({
    where: { projectId },
    include: {
      category: true,
      supplier: true,
      supplierLinks: {
        include: { supplier: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { expenseDate: "desc" },
  });

  const header = [
    "Název",
    "Částka",
    "Měna",
    "Datum",
    "Stav platby",
    "Kategorie",
    "Dodavatel",
    "Etapa",
    "Poznámka",
  ];

  const rows = expenses.map((e) =>
    [
      e.title,
      toNumber(e.amount),
      e.currency,
      formatDate(e.expenseDate),
      labelPaymentStatus(e.paymentStatus),
      e.category?.name ?? "",
      formatExpenseSuppliers(expenseSuppliersFromRecord(e)),
      e.stage ?? "",
      (e.note ?? "").replace(/"/g, '""'),
    ]
      .map((v) => `"${v}"`)
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vydaje-${projectId}.csv"`,
    },
  });
}
