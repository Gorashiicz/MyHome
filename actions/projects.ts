"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createProjectWithDefaults } from "@/lib/projects";
import { requireUser, requireProjectOwner } from "@/lib/permissions";
import { projectSchema } from "@/lib/validators";
import { setActiveProjectId } from "@/lib/project-context";

export async function createProject(formData: FormData) {
  const user = await requireUser();
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Neplatná data");
  }

  const data = parsed.data;
  const project = await createProjectWithDefaults({
    ownerId: user.id,
    name: data.name,
    description: data.description,
    addressText: data.addressText,
    constructionType: data.constructionType,
    budgetMode: data.budgetMode,
    budgetLimit:
      data.budgetMode === "limited" ? (data.budgetLimit ?? null) : null,
    startDate: data.startDate ? new Date(data.startDate) : null,
    expectedFinish: data.expectedFinish ? new Date(data.expectedFinish) : null,
    status: data.status,
  });

  await setActiveProjectId(project.id);
  redirect(`/p/${project.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  await requireProjectOwner(projectId);
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Neplatná data");
  }
  const data = parsed.data;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name,
      description: data.description,
      addressText: data.addressText,
      constructionType: data.constructionType,
      budgetMode: data.budgetMode,
      budgetLimit:
        data.budgetMode === "limited" ? (data.budgetLimit ?? null) : null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      expectedFinish: data.expectedFinish ? new Date(data.expectedFinish) : null,
      status: data.status,
    },
  });

  revalidatePath(`/p/${projectId}`);
}

export async function archiveProject(projectId: string) {
  await requireProjectOwner(projectId);
  await prisma.project.update({
    where: { id: projectId },
    data: { archivedAt: new Date(), status: "archived" },
  });
  redirect("/projekty");
}
