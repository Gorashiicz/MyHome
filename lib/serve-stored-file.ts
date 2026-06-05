import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { StoredFileKind } from "@/lib/file-urls";
import { prisma } from "@/lib/db";
import { getProjectAccess } from "@/lib/permissions";
import { isCloudStorageEnabled } from "@/lib/supabase-admin";
import {
  createStoredFileSignedUrl,
  readStoredFile,
} from "@/lib/storage";

type FileRecord = {
  projectId: string;
  storagePath: string;
  mimeType: string;
  originalName?: string;
};

async function loadFileRecord(
  kind: StoredFileKind,
  id: string
): Promise<FileRecord | null> {
  if (kind === "attachment") {
    return prisma.attachment.findUnique({
      where: { id },
      select: {
        projectId: true,
        storagePath: true,
        mimeType: true,
        originalName: true,
      },
    });
  }

  if (kind === "document") {
    const row = await prisma.document.findUnique({
      where: { id },
      select: {
        projectId: true,
        storagePath: true,
        mimeType: true,
        title: true,
      },
    });
    if (!row?.storagePath || !row.mimeType) return null;
    return {
      projectId: row.projectId,
      storagePath: row.storagePath,
      mimeType: row.mimeType,
      originalName: row.title ?? undefined,
    };
  }

  const row = await prisma.photo.findUnique({
    where: { id },
    select: {
      projectId: true,
      storagePath: true,
      mimeType: true,
      title: true,
    },
  });
  if (!row) return null;
  return {
    projectId: row.projectId,
    storagePath: row.storagePath,
    mimeType: row.mimeType,
    originalName: row.title ?? undefined,
  };
}

async function serveStoredFile(record: FileRecord) {
  if (isCloudStorageEnabled()) {
    const signedUrl = await createStoredFileSignedUrl(record.storagePath);
    return NextResponse.redirect(signedUrl);
  }

  const buffer = await readStoredFile(record.storagePath);
  const headers: Record<string, string> = {
    "Content-Type": record.mimeType,
    "Cache-Control": "private, max-age=3600",
  };
  if (record.originalName) {
    headers["Content-Disposition"] =
      `inline; filename="${encodeURIComponent(record.originalName)}"`;
  }
  return new NextResponse(buffer, { headers });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") as StoredFileKind | null;
  const id = searchParams.get("id");

  if (!kind || !id || !["attachment", "document", "photo"].includes(kind)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const record = await loadFileRecord(kind, id);
  if (!record) {
    return new NextResponse("Not found", { status: 404 });
  }

  const access = await getProjectAccess(record.projectId, session.user.id);
  if (!access) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    return await serveStoredFile(record);
  } catch {
    return new NextResponse(
      "Soubor v úložišti nenalezen. Možná byl nahrán bez cloud úložiště — nahrajte znovu.",
      { status: 404 }
    );
  }
}

/** Starší URL /api/soubory/project/.../file.pdf */
export async function serveFileByStoragePath(
  storagePath: string,
  userId: string
) {
  const projectId = storagePath.split("/")[0];
  if (!projectId) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId);
  if (!access) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const attachment = await prisma.attachment.findFirst({
    where: { projectId, storagePath },
    select: {
      projectId: true,
      storagePath: true,
      mimeType: true,
      originalName: true,
    },
  });
  if (attachment) {
    try {
      return await serveStoredFile(attachment);
    } catch {
      return storageMissingResponse();
    }
  }

  const document = await prisma.document.findFirst({
    where: { projectId, storagePath },
    select: {
      projectId: true,
      storagePath: true,
      mimeType: true,
      title: true,
    },
  });
  if (document?.storagePath && document.mimeType) {
    try {
      return await serveStoredFile({
        projectId: document.projectId,
        storagePath: document.storagePath,
        mimeType: document.mimeType,
        originalName: document.title,
      });
    } catch {
      return storageMissingResponse();
    }
  }

  const photo = await prisma.photo.findFirst({
    where: { projectId, storagePath },
    select: {
      projectId: true,
      storagePath: true,
      mimeType: true,
      title: true,
    },
  });
  if (photo) {
    try {
      return await serveStoredFile({
        projectId: photo.projectId,
        storagePath: photo.storagePath,
        mimeType: photo.mimeType,
        originalName: photo.title ?? undefined,
      });
    } catch {
      return storageMissingResponse();
    }
  }

  return new NextResponse("Not found", { status: 404 });
}

function storageMissingResponse() {
  return new NextResponse(
    "Soubor v úložišti nenalezen. Možná byl nahrán bez cloud úložiště — nahrajte znovu.",
    { status: 404 }
  );
}
