import type { DocumentType } from "@prisma/client";

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "project", label: "Projektová dokumentace" },
  { value: "permit", label: "Povolení" },
  { value: "contract", label: "Smlouva" },
  { value: "invoice", label: "Faktura" },
  { value: "revision", label: "Revize" },
  { value: "warranty", label: "Záruka" },
  { value: "other", label: "Ostatní" },
];

const labels = Object.fromEntries(
  DOCUMENT_TYPE_OPTIONS.map(({ value, label }) => [value, label])
) as Record<DocumentType, string>;

export function labelDocumentType(type: DocumentType) {
  return labels[type] ?? type;
}
