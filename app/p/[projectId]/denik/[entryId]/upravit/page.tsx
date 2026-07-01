import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiaryEntry, updateDiaryEntry } from "@/actions/diary";
import {
  DiaryEntryForm,
  diaryEntryToFormValues,
} from "@/components/forms/diary-entry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatting";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { resolveProjectRoute } from "@/lib/project-context";

export default async function EditDiaryEntryPage({
  params,
}: {
  params: Promise<{ projectId: string; entryId: string }>;
}) {
  const { projectId, entryId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);

  if (!access?.canEdit) {
    notFound();
  }

  const entry = await getDiaryEntry(projectId, entryId);

  return (
    <div>
      <Link
        href={`/p/${projectId}/denik`}
        className="text-sm text-emerald-700 hover:underline"
      >
        ← Zpět na deník
      </Link>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            Upravit záznam — {formatDate(entry.entryDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DiaryEntryForm
            formAction={updateDiaryEntry.bind(null, projectId, entryId)}
            defaultValues={diaryEntryToFormValues(entry)}
            submitLabel="Uložit změny"
          />
        </CardContent>
      </Card>
    </div>
  );
}
