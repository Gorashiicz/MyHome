import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { getProjectAccess } from "@/lib/permissions";

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

  const data = await getDashboardData(projectId);
  const header = ["Kategorie", "Reference", "Skutečnost", "Odchylka", "Čerpání %"];
  const rows = data.categoryStats.map((c) =>
    [c.name, c.planned, c.spent, c.difference, c.percentUsed]
      .map((v) => `"${v}"`)
      .join(",")
  );

  const summary = [
    "",
    `"Reference celkem","${data.categoryStats.reduce((s, c) => s + c.planned, 0)}"`,
    `"Skutečnost celkem","${data.totalSpent}"`,
    `"Limit stavby","${data.budgetLimit ?? ""}"`,
    `"Zbývá z limitu","${data.remaining ?? ""}"`,
  ];

  const csv = ["\uFEFF" + header.join(","), ...rows, ...summary].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rozpocet-${projectId}.csv"`,
    },
  });
}
