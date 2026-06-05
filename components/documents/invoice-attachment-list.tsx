"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  Receipt,
  Trash2,
} from "lucide-react";
import { deleteExpenseAttachment } from "@/actions/attachments";
import { labelAttachmentType } from "@/lib/expense-attachments";
import { formatCzk, formatDate } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { AttachmentType } from "@prisma/client";

export type InvoiceAttachmentListItem = {
  id: string;
  originalName: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  type: AttachmentType;
  uploadedAt: string;
  uploadedByName: string | null;
  expense: {
    id: string;
    title: string;
    expenseDate: string;
    amount: number;
  } | null;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export function InvoiceAttachmentList({
  items,
  projectId,
  canEdit,
}: {
  items: InvoiceAttachmentListItem[];
  projectId: string;
  canEdit: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 px-4 py-8 text-center">
        <Receipt className="mx-auto mb-2 h-8 w-8 text-muted" />
        <p className="text-sm text-muted">
          Zatím žádné faktury ani účtenky z výdajů.
        </p>
        <p className="mt-1 text-xs text-muted">
          Nahrajte je u konkrétní položky v rozpočtu → Výdaje.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => {
        const expanded = expandedId === item.id;
        const fileUrl = `/api/soubory/${item.storagePath}`;

        return (
          <li
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : item.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-muted/60"
              aria-expanded={expanded}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                <Receipt className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {item.originalName}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {labelAttachmentType(item.type)}
                  {item.expense && ` · ${item.expense.title}`}
                  {` · ${formatDate(item.uploadedAt)}`}
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
                    <dd>{labelAttachmentType(item.type)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Velikost</dt>
                    <dd>{formatFileSize(item.fileSize)}</dd>
                  </div>
                  {item.uploadedByName && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Nahrál</dt>
                      <dd className="text-right">{item.uploadedByName}</dd>
                    </div>
                  )}
                </dl>

                {item.expense && (
                  <div className="mt-3 rounded-lg bg-surface p-3">
                    <p className="mb-1 text-xs font-medium uppercase text-muted">
                      Výdaj
                    </p>
                    <Link
                      href={`/p/${projectId}/rozpocet/vydaje/${item.expense.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {item.expense.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(item.expense.expenseDate)} ·{" "}
                      {formatCzk(item.expense.amount)}
                    </p>
                  </div>
                )}

                {isImageMime(item.mimeType) && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl}
                      alt={item.originalName}
                      className="max-h-48 w-full object-contain bg-white"
                    />
                  </a>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <a href={fileUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      Otevřít soubor
                    </a>
                  </Button>
                </div>

                {canEdit && (
                  <form
                    action={deleteExpenseAttachment.bind(null, projectId, item.id)}
                    className="mt-3 border-t border-border pt-3"
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          `Opravdu smazat „${item.originalName}"? Soubor zmizí i u výdaje.`
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
  );
}
