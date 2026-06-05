import { listDocuments } from "@/actions/documents";
import { createDocument, deleteDocument } from "@/actions/documents";
import { FileLibrary } from "@/components/documents/file-library";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/document-types";
import { listProjectExpenseAttachments } from "@/lib/expense-attachments";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionPage } from "@/components/layout/section-banner";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const [documents, invoiceAttachments] = await Promise.all([
    listDocuments(projectId),
    listProjectExpenseAttachments(projectId),
  ]);

  const documentItems = documents.map((d) => ({
    id: d.id,
    title: d.title,
    docType: d.docType,
    docDate: d.docDate?.toISOString() ?? null,
    note: d.note,
    stage: d.stage,
    storagePath: d.storagePath,
    mimeType: d.mimeType,
    fileSize: d.fileSize,
    supplierName: d.supplier?.name ?? null,
    createdAt: d.createdAt.toISOString(),
  }));

  const invoiceItems = invoiceAttachments.map((a) => ({
    id: a.id,
    originalName: a.originalName,
    storagePath: a.storagePath,
    mimeType: a.mimeType,
    fileSize: a.fileSize,
    type: a.type,
    uploadedAt: a.uploadedAt.toISOString(),
    uploadedByName: a.uploadedBy.name ?? a.uploadedBy.email,
    expense: a.expense
      ? {
          id: a.expense.id,
          title: a.expense.title,
          expenseDate: a.expense.expenseDate.toISOString(),
          amount: Number(a.expense.amount.toString()),
        }
      : null,
  }));

  return (
    <SectionPage
      section="documents"
      title="Dokumenty"
      description="Veškeré soubory stavby — dokumentace i faktury z výdajů"
      bodyClassName="space-y-6"
    >
      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nahrát dokument</CardTitle>
          </CardHeader>
          <CardContent>
              <form
                action={createDocument.bind(null, projectId)}
                encType="multipart/form-data"
                className="space-y-3"
              >
              <div>
                <Label htmlFor="title">Název *</Label>
                <Input id="title" name="title" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="docType">Typ</Label>
                <Select
                  id="docType"
                  name="docType"
                  defaultValue="other"
                  className="mt-1"
                >
                  {DOCUMENT_TYPE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Soubor</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*,application/pdf"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stage">Etapa</Label>
                <Input id="stage" name="stage" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="note">Poznámka</Label>
                <Textarea id="note" name="note" rows={2} className="mt-1" />
              </div>
              <SaveButton className="w-full" />
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knihovna souborů</CardTitle>
        </CardHeader>
        <CardContent>
          <FileLibrary
            documents={documentItems}
            invoices={invoiceItems}
            projectId={projectId}
            canEdit={!!access?.canEdit}
            deleteDocumentAction={deleteDocument}
          />
        </CardContent>
      </Card>
    </SectionPage>
  );
}
