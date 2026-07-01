import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProjectAccess } from "@/lib/permissions";
import {
  buildStavebniDenikPdf,
  loadStavebniDenikExportData,
} from "@/lib/stavebni-denik-pdf";

function safeFilename(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

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

  try {
    const { project, entries } = await loadStavebniDenikExportData(projectId);
    const pdf = await buildStavebniDenikPdf({
      project,
      entries,
      generatedAt: new Date(),
      generatedBy: session.user.name ?? session.user.email ?? "Uživatel",
    });

    const filename = `stavebni-denik-${safeFilename(project.name)}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neznámá chyba";
    console.error("Diary PDF export failed:", error);
    return new NextResponse(`Export selhal: ${message}`, { status: 500 });
  }
}
