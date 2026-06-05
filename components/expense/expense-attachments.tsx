"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  addExpenseAttachment,
  deleteExpenseAttachment,
} from "@/actions/attachments";
import type { ExpenseAttachmentItem } from "@/lib/expense-attachments";
import { fileDownloadUrl } from "@/lib/file-urls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveButton } from "@/components/ui/save-button";
import { DeleteAttachmentButton } from "@/components/expense/delete-attachment-button";
import { ExternalLink, FileText } from "lucide-react";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

type UploadState = { error?: string; success?: boolean };

async function uploadAttachment(
  projectId: string,
  expenseId: string,
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    await addExpenseAttachment(projectId, expenseId, formData);
    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Nahrání se nezdařilo.",
    };
  }
}

export function ExpenseAttachments({
  projectId,
  expenseId,
  attachments,
  canEdit,
}: {
  projectId: string;
  expenseId: string;
  attachments: ExpenseAttachmentItem[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [uploadState, uploadAction, uploadPending] = useActionState(
    uploadAttachment.bind(null, projectId, expenseId),
    {}
  );

  useEffect(() => {
    if (uploadState.success) {
      router.refresh();
    }
  }, [uploadState.success, router]);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Faktury a účtenky</h3>

      {uploadState.success && (
        <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
          Soubor byl úspěšně nahrán a uložen.
        </p>
      )}
      {uploadState.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {uploadState.error}
        </p>
      )}

      {attachments.length === 0 ? (
        <p className="text-sm text-muted">Zatím žádné přílohy.</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((a) => {
            const url = fileDownloadUrl("attachment", a.id);
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3"
              >
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.originalName}</p>
                  <p className="text-xs text-muted">
                    {formatFileSize(a.fileSize)}
                    {a.uploadedBy.name && ` · ${a.uploadedBy.name}`}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={url} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    Otevřít
                  </a>
                </Button>
                {canEdit && (
                  <form action={deleteExpenseAttachment.bind(null, projectId, a.id)}>
                    <DeleteAttachmentButton fileName={a.originalName} />
                  </form>
                )}
                {isImageMime(a.mimeType) && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full overflow-hidden rounded-md border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={a.originalName}
                      className="max-h-40 w-full object-contain bg-white"
                    />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {canEdit && (
        <form
          action={uploadAction}
          encType="multipart/form-data"
          className="space-y-2 rounded-lg border border-dashed border-border bg-surface-muted/40 p-3"
        >
          <Label htmlFor={`attachment-${expenseId}`}>Přidat fakturu / účtenku</Label>
          <Input
            id={`attachment-${expenseId}`}
            name="attachment"
            type="file"
            accept="image/*,application/pdf"
            required
          />
          <p className="text-xs text-muted">
            Vyberte soubor a potvrďte tlačítkem níže — samo se neuloží.
          </p>
          <SaveButton
            label={uploadPending ? "Nahrávám…" : "Nahrát a uložit soubor"}
            className="w-full"
            disabled={uploadPending}
          />
        </form>
      )}
    </section>
  );
}
