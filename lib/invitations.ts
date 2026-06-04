import { prisma } from "@/lib/db";

export async function acceptPendingInvites(userId: string, email: string) {
  const invites = await prisma.invitation.findMany({
    where: {
      email: email.toLowerCase(),
      status: "pending",
      expiresAt: { gt: new Date() },
    },
  });

  for (const inv of invites) {
    await prisma.projectMember.upsert({
      where: {
        projectId_userId: { projectId: inv.projectId, userId },
      },
      create: {
        projectId: inv.projectId,
        userId,
        role: inv.role,
        invitedBy: inv.invitedBy,
      },
      update: { role: inv.role },
    });
    await prisma.invitation.update({
      where: { id: inv.id },
      data: { status: "accepted" },
    });
  }
}
