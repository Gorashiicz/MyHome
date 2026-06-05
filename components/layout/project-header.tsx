import Link from "next/link";
import { getUserProjects } from "@/lib/permissions";
import { requireUser } from "@/lib/permissions";
import { ProjectSwitcher } from "@/components/layout/project-switcher";
import { APP_NAME } from "@/lib/constants";

export async function ProjectHeader({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const user = await requireUser();
  const projects = await getUserProjects(user.id);

  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">{APP_NAME}</p>
          <h1 className="truncate text-lg font-semibold">{projectName}</h1>
        </div>
        <ProjectSwitcher
          currentId={projectId}
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        />
        <Link href="/projekty" className="app-link shrink-0 text-sm">
          Stavby
        </Link>
      </div>
    </header>
  );
}
