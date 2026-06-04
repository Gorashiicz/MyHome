import { ProjectRole } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type ProjectAccess = {
  userId: string;
  projectId: string;
  role: ProjectRole;
  canEdit: boolean;
  isOwner: boolean;
};

export async function getProjectAccess(
  projectId: string,
  userId: string
): Promise<ProjectAccess | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project) return null;

  if (project.ownerId === userId) {
    return {
      userId,
      projectId,
      role: ProjectRole.owner,
      canEdit: true,
      isOwner: true,
    };
  }

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) return null;

  return {
    userId,
    projectId,
    role: member.role,
    canEdit: member.role === ProjectRole.editor,
    isOwner: false,
  };
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireProjectAccess(projectId: string) {
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  if (!access) throw new Error("FORBIDDEN");
  return { user, access };
}

export async function requireProjectEditor(projectId: string) {
  const { user, access } = await requireProjectAccess(projectId);
  if (!access.canEdit) throw new Error("FORBIDDEN");
  return { user, access };
}

export async function requireProjectOwner(projectId: string) {
  const { user, access } = await requireProjectAccess(projectId);
  if (!access.isOwner) throw new Error("FORBIDDEN");
  return { user, access };
}

export async function getUserProjects(userId: string) {
  const owned = await prisma.project.findMany({
    where: { ownerId: userId, archivedAt: null },
    orderBy: { updatedAt: "desc" },
  });
  const memberOf = await prisma.projectMember.findMany({
    where: { userId },
    include: { project: true },
  });
  const memberProjects = memberOf
    .map((m) => m.project)
    .filter((p) => p.archivedAt == null && p.ownerId !== userId);

  const byId = new Map<string, (typeof owned)[0]>();
  for (const p of [...owned, ...memberProjects]) byId.set(p.id, p);
  return Array.from(byId.values()).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}
