import { redirect } from "next/navigation";

export default async function AddDocumentPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/p/${projectId}/dokumenty`);
}
