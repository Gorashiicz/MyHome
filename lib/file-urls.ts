export type StoredFileKind = "attachment" | "document" | "photo";

export function fileDownloadUrl(kind: StoredFileKind, id: string) {
  const params = new URLSearchParams({ kind, id });
  return `/api/stazeni?${params.toString()}`;
}
