import { redirect } from "next/navigation";

export default async function AddInvoicePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/p/${projectId}/pridat/vydaj`);
}
