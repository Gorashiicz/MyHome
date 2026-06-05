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

export function validateUpload(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Soubor je příliš velký (max 15 MB).");
  }
  if (
    !ALLOWED_FILE_TYPES.includes(
      file.type as (typeof ALLOWED_FILE_TYPES)[number]
    )
  ) {
    throw new Error("Nepodporovaný typ souboru.");
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
        contentType: file.type || "application/octet-stream",
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
    mimeType: file.type,
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
