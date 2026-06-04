import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { applySampleBudgetFromXlsx } from "../lib/seed-sample-budget";
import { DEFAULT_CONSTRUCTION_STAGES } from "../lib/constants";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@stavba.cz" },
    update: {},
    create: {
      email: "demo@stavba.cz",
      name: "Demo Stavebník",
      passwordHash,
      locale: "cs-CZ",
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "demo-project-001" },
    update: {},
    create: {
      id: "demo-project-001",
      name: "RD — položkový rozpočet (vzor)",
      description: "Ukázkový projekt s rozpočtem z Excelu",
      addressText: "Stavba RD svépomocí",
      constructionType: "Rodinný dům",
      budgetMode: "limited",
      budgetLimit: 6500000,
      currency: "CZK",
      status: ProjectStatus.active,
      stages: [...DEFAULT_CONSTRUCTION_STAGES],
      ownerId: user.id,
      startDate: new Date("2025-03-01"),
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_userId: { projectId: project.id, userId: user.id },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: user.id,
      role: "owner",
    },
  });

  const sampleStats = await applySampleBudgetFromXlsx(
    prisma,
    project.id,
    user.id
  );

  await prisma.task.upsert({
    where: { id: "demo-task-001" },
    update: {
      title: "Dokončit zdění svislých konstrukcí",
      dueDate: new Date("2025-09-30"),
    },
    create: {
      id: "demo-task-001",
      projectId: project.id,
      title: "Dokončit zdění svislých konstrukcí",
      dueDate: new Date("2025-09-30"),
      status: "in_progress",
      priority: "high",
      stage: "Svislé konstrukce",
      createdById: user.id,
    },
  });

  await prisma.diaryEntry.upsert({
    where: { id: "demo-diary-001" },
    update: {},
    create: {
      id: "demo-diary-001",
      projectId: project.id,
      entryDate: new Date("2025-06-09"),
      weather: "Slunečno, 24 °C",
      title: "Zdění obvodových zdí",
      workPerformed:
        "Pokračovalo zdění obvodových zdí, materiál dle položkového rozpočtu — svislé konstrukce.",
      peoplePresent: "Stavebník, pomocník",
      createdById: user.id,
    },
  });

  console.log("Seed dokončen:");
  console.log("  E-mail: demo@stavba.cz");
  console.log("  Heslo:  demo1234");
  console.log("  Projekt ID:", project.id);
  console.log(
    `  Rozpočet: ${sampleStats.categories} kategorií, ${sampleStats.expenses} vzorových výdajů, plán ${sampleStats.totalPlanned.toLocaleString("cs-CZ")} Kč`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
