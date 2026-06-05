import { listDocuments } from "@/actions/documents";
import { createDocument, deleteDocument } from "@/actions/documents";
import { DocumentList } from "@/components/documents/document-list";
import { resolveProjectRoute } from "@/lib/project-context";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/document-types";
import { SaveButton } from "@/components/ui/save-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const documents = await listDocuments(projectId);

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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dokumenty</h1>

      <Card>
        {access?.canEdit && (
          <>
            <CardHeader>
              <CardTitle className="text-base">Nahrát dokument</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={createDocument.bind(null, projectId)}
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
          </>
        )}

        <CardContent className={access?.canEdit ? "border-t border-border pt-6" : "pt-6"}>
          <DocumentList
            documents={documentItems}
            projectId={projectId}
            canEdit={!!access?.canEdit}
            deleteAction={deleteDocument}
          />
        </CardContent>
      </Card>
    </div>
  );
}
