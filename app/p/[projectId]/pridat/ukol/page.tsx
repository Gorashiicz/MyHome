import { redirect } from "next/navigation";

export default async function AddTaskPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/p/${projectId}/ukoly`);
}
