import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getProjectAccess } from "@/lib/permissions";
import { readStoredFile } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { path } = await params;
  const storagePath = path.join("/");
  const projectId = path[0];

  const access = await getProjectAccess(projectId, session.user.id);
  if (!access) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const attachment = await prisma.attachment.findFirst({
    where: { projectId, storagePath },
  });
  const document = await prisma.document.findFirst({
    where: { projectId, storagePath },
  });
  const photo = await prisma.photo.findFirst({
    where: { projectId, storagePath },
  });

  if (!attachment && !document && !photo) {
    return new NextResponse("Not found", { status: 404 });
  }

  const mimeType =
    attachment?.mimeType ?? document?.mimeType ?? photo?.mimeType ?? "application/octet-stream";

  try {
    const buffer = await readStoredFile(storagePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
