"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, FileText, Trash2 } from "lucide-react";
import type { DocumentType } from "@prisma/client";
import { labelDocumentType } from "@/lib/document-types";
import { formatDate } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type DocumentListItem = {
  id: string;
  title: string;
  docType: DocumentType;
  docDate: string | null;
  note: string | null;
  stage: string | null;
  storagePath: string | null;
  mimeType: string | null;
  fileSize: number | null;
  supplierName: string | null;
  createdAt: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(mime: string | null) {
  return mime?.startsWith("image/") ?? false;
}

export function DocumentList({
  documents,
  projectId,
  canEdit,
  deleteAction,
}: {
  documents: DocumentListItem[];
  projectId: string;
  canEdit: boolean;
  deleteAction: (projectId: string, id: string) => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-4 py-8 text-center">
        <FileText className="mx-auto mb-2 h-8 w-8 text-muted" />
        <p className="text-sm text-muted">Zatím žádné nahrané dokumenty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted">
        Nahrané dokumenty ({documents.length})
      </p>
      <ul className="space-y-2">
        {documents.map((doc) => {
          const expanded = expandedId === doc.id;
          const fileUrl = doc.storagePath
            ? `/api/soubory/${doc.storagePath}`
            : null;

          return (
            <li
              key={doc.id}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expanded ? null : doc.id)
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-muted/60"
                aria-expanded={expanded}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{doc.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {labelDocumentType(doc.docType)}
                    {doc.docDate && ` · ${formatDate(doc.docDate)}`}
                    {!doc.docDate && doc.createdAt && ` · ${formatDate(doc.createdAt)}`}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </button>

              {expanded && (
                <div className="border-t border-border bg-surface-muted/30 px-4 py-3 text-sm">
                  <dl className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Typ</dt>
                      <dd>{labelDocumentType(doc.docType)}</dd>
                    </div>
                    {doc.stage && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted">Etapa</dt>
                        <dd className="text-right">{doc.stage}</dd>
                      </div>
                    )}
                    {doc.supplierName && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted">Dodavatel</dt>
                        <dd className="text-right">{doc.supplierName}</dd>
                      </div>
                    )}
                    {doc.docDate && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted">Datum dokumentu</dt>
                        <dd>{formatDate(doc.docDate)}</dd>
                      </div>
                    )}
                    {doc.fileSize != null && doc.fileSize > 0 && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted">Velikost</dt>
                        <dd>{formatFileSize(doc.fileSize)}</dd>
                      </div>
                    )}
                  </dl>

                  {doc.note && (
                    <div className="mt-3 rounded-lg bg-surface p-3">
                      <p className="mb-1 text-xs font-medium uppercase text-muted">
                        Poznámka
                      </p>
                      <p className="whitespace-pre-wrap">{doc.note}</p>
                    </div>
                  )}

                  {fileUrl && isImageMime(doc.mimeType) && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 block overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileUrl}
                        alt={doc.title}
                        className="max-h-48 w-full object-contain bg-white"
                      />
                    </a>
                  )}

                  {fileUrl ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-1.5 h-4 w-4" />
                          Otevřít soubor
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-muted">
                      K tomuto záznamu není přiložený soubor.
                    </p>
                  )}

                  {canEdit && (
                    <form
                      action={deleteAction.bind(null, projectId, doc.id)}
                      className="mt-3 border-t border-border pt-3"
                      onSubmit={(e) => {
                        if (
                          !confirm(
                            `Opravdu smazat dokument „${doc.title}"?`
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Button type="submit" variant="destructive" size="sm">
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        Smazat
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
