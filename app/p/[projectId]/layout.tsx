import { resolveProjectRoute } from "@/lib/project-context";
import { ProjectHeader } from "@/components/layout/project-header";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getProjectAccess } from "@/lib/permissions";
import { requireUser } from "@/lib/permissions";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <ProjectHeader projectId={projectId} projectName={project.name} />
      <DesktopNav projectId={projectId} />
      {access && !access.canEdit && (
        <div className="mx-auto max-w-5xl px-4">
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Máte přístup pouze pro čtení.
          </p>
        </div>
      )}
      <div className="mx-auto max-w-5xl px-4 py-4">{children}</div>
      <MobileNav projectId={projectId} />
    </div>
  );
}
