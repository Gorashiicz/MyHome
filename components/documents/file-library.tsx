import {
  DocumentList,
  type DocumentListItem,
} from "@/components/documents/document-list";
import {
  InvoiceAttachmentList,
  type InvoiceAttachmentListItem,
} from "@/components/documents/invoice-attachment-list";

export function FileLibrary({
  documents,
  invoices,
  projectId,
  canEdit,
  deleteDocumentAction,
}: {
  documents: DocumentListItem[];
  invoices: InvoiceAttachmentListItem[];
  projectId: string;
  canEdit: boolean;
  deleteDocumentAction: (projectId: string, id: string) => Promise<void>;
}) {
  const totalCount = documents.length + invoices.length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        Knihovna souborů ({totalCount}{" "}
        {totalCount === 1
          ? "soubor"
          : totalCount >= 2 && totalCount <= 4
            ? "soubory"
            : "souborů"}
        )
      </p>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Dokumenty</h2>
        <p className="text-xs text-muted">
          Smlouvy, povolení, revize a další dokumentace nahraná zde nebo v
          sekci Přidat.
        </p>
        <DocumentList
          documents={documents}
          projectId={projectId}
          canEdit={canEdit}
          deleteAction={deleteDocumentAction}
          hideHeader
        />
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-base font-semibold">Faktury a účtenky</h2>
        <p className="text-xs text-muted">
          Soubory nahrané u výdajů v rozpočtu — zobrazí se zde automaticky.
        </p>
        <InvoiceAttachmentList
          items={invoices}
          projectId={projectId}
          canEdit={canEdit}
        />
      </section>
    </div>
  );
}
