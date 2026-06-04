"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireProjectOwner } from "@/lib/permissions";
import { inviteSchema } from "@/lib/validators";

export async function inviteMember(projectId: string, formData: FormData) {
  const { user } = await requireProjectOwner(projectId);
  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    if (existingUser.id === user.id) {
      throw new Error("Nemůžete pozvat sami sebe.");
    }
    const already = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: existingUser.id },
      },
    });
    if (already) {
      throw new Error("Uživatel je již členem projektu.");
    }
    await prisma.projectMember.create({
      data: {
        projectId,
        userId: existingUser.id,
        role: parsed.data.role,
        invitedBy: user.id,
      },
    });
    revalidatePath(`/p/${projectId}/sdileni`);
    return;
  }

  const pending = await prisma.invitation.findFirst({
    where: { projectId, email, status: "pending" },
  });
  if (pending) {
    await prisma.invitation.update({
      where: { id: pending.id },
      data: {
        role: parsed.data.role,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  } else {
    await prisma.invitation.create({
      data: {
        projectId,
        email,
        role: parsed.data.role,
        invitedBy: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  revalidatePath(`/p/${projectId}/sdileni`);
}

export async function removeMember(projectId: string, memberId: string) {
  await requireProjectOwner(projectId);
  const member = await prisma.projectMember.findUnique({
    where: { id: memberId },
  });
  if (!member || member.role === "owner") {
    throw new Error("Člena nelze odebrat.");
  }
  await prisma.projectMember.delete({ where: { id: memberId } });
  revalidatePath(`/p/${projectId}/sdileni`);
}