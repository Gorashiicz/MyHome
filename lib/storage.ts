import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants";
import {
  getStorageBucketName,
  getSupabaseAdmin,
  isCloudStorageEnabled,
  requirePersistentStorage,
} from "@/lib/supabase-admin";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const EXTENSION_MIME: Record<string, (typeof ALLOWED_FILE_TYPES)[number]> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Prohlížeč často pošle prázdný typ nebo application/octet-stream u PDF. */
export function resolveUploadMimeType(file: File): string {
  const fromBrowser = file.type?.trim();
  if (
    fromBrowser &&
    ALLOWED_FILE_TYPES.includes(
      fromBrowser as (typeof ALLOWED_FILE_TYPES)[number]
    )
  ) {
    return fromBrowser;
  }

  const fromExtension = EXTENSION_MIME[path.extname(file.name).toLowerCase()];
  if (fromExtension) return fromExtension;

  return fromBrowser ?? "";
}

export function attachmentTypeFromMime(mimeType: string) {
  return mimeType === "application/pdf" ? ("invoice" as const) : ("receipt" as const);
}

export function formatUploadError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (/body exceeded|413|too large|max.*body/i.test(msg)) {
      return "Soubor je příliš velký (max 15 MB).";
    }
    return msg;
  }
  return "Nahrání se nezdařilo.";
}

export function validateUpload(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Soubor je příliš velký (max 15 MB).");
  }
  const mimeType = resolveUploadMimeType(file);
  if (
    !ALLOWED_FILE_TYPES.includes(
      mimeType as (typeof ALLOWED_FILE_TYPES)[number]
    )
  ) {
    throw new Error("Nepodporovaný typ souboru (povolené: PDF, JPG, PNG, WebP).");
  }
}

export async function saveUploadedFile(
  projectId: string,
  file: File,
  subfolder = "files"
): Promise<{
  storagePath: string;
  mimeType: string;
  fileSize: number;
  originalName: string;
}> {
  validateUpload(file);
  requirePersistentStorage();
  const mimeType = resolveUploadMimeType(file);
  const ext = path.extname(file.name) || "";
  const storedName = `${randomUUID()}${ext}`;
  const storagePath = path
    .join(projectId, subfolder, storedName)
    .replace(/\\/g, "/");
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isCloudStorageEnabled()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(getStorageBucketName())
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });
    if (error) {
      throw new Error(`Nepodařilo se nahrát soubor: ${error.message}`);
    }
  } else {
    const dir = path.join(UPLOAD_ROOT, projectId, subfolder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, storedName), buffer);
  }

  return {
    storagePath,
    mimeType,
    fileSize: file.size,
    originalName: file.name,
  };
}

export function getAbsoluteStoragePath(storagePath: string) {
  return path.join(UPLOAD_ROOT, storagePath.replace(/\//g, path.sep));
}

export async function readStoredFile(storagePath: string) {
  if (isCloudStorageEnabled()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(getStorageBucketName())
      .download(storagePath);
    if (error || !data) {
      throw new Error(error?.message ?? "Soubor v úložišti nenalezen.");
    }
    return Buffer.from(await data.arrayBuffer());
  }

  return readFile(getAbsoluteStoragePath(storagePath));
}

export async function createStoredFileSignedUrl(
  storagePath: string,
  expiresInSeconds = 3600
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(getStorageBucketName())
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Nepodařilo se vytvořit odkaz ke stažení.");
  }
  return data.signedUrl;
}
