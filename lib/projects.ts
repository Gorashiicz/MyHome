import { BudgetMode, ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { DEFAULT_BUDGET_CATEGORIES, DEFAULT_CONSTRUCTION_STAGES } from "@/lib/constants";

export async function createProjectWithDefaults(params: {
  ownerId: string;
  name: string;
  description?: string;
  addressText?: string;
  constructionType?: string;
  budgetMode: BudgetMode;
  budgetLimit?: number | null;
  startDate?: Date | null;
  expectedFinish?: Date | null;
  status?: ProjectStatus;
}) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: params.name,
        description: params.description,
        addressText: params.addressText,
        constructionType: params.constructionType,
        budgetMode: params.budgetMode,
        budgetLimit: params.budgetLimit ?? null,
        startDate: params.startDate,
        expectedFinish: params.expectedFinish,
        status: params.status ?? ProjectStatus.planning,
        stages: [...DEFAULT_CONSTRUCTION_STAGES],
        ownerId: params.ownerId,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: params.ownerId,
        role: "owner",
      },
    });

    await tx.budgetCategory.createMany({
      data: DEFAULT_BUDGET_CATEGORIES.map((name, index) => ({
        projectId: project.id,
        name,
        sortOrder: index,
        plannedAmount: 0,
      })),
    });

    return project;
  });
}
