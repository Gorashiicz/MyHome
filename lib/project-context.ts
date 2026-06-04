import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_PROJECT_COOKIE } from "@/lib/constants";
import { getUserProjects } from "@/lib/permissions";
import { requireUser } from "@/lib/permissions";

export async function getActiveProjectId() {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value ?? null;
}

/** Pouze ve Server Action nebo Route Handler — ne během renderu stránky. */
export async function setActiveProjectId(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function resolveProjectRoute(projectId: string) {
  const user = await requireUser();
  const projects = await getUserProjects(user.id);
  const allowed = projects.some((p) => p.id === projectId);
  if (!allowed) redirect("/projekty");
  return projects.find((p) => p.id === projectId)!;
}
