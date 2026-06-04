import { inviteMember, removeMember } from "@/actions/sharing";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { requireProjectOwner } from "@/lib/permissions";
import { labelRole } from "@/lib/formatting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SharingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);

  try {
    await requireProjectOwner(projectId);
  } catch {
    return (
      <p className="text-slate-600">
        Správu členů může provádět pouze vlastník projektu.
      </p>
    );
  }

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
  });
  const invites = await prisma.invitation.findMany({
    where: { projectId, status: "pending" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Sdílení</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pozvat člena</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={inviteMember.bind(null, projectId)} className="space-y-3">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select id="role" name="role" defaultValue="editor" className="mt-1">
                <option value="editor">Editor — může upravovat data</option>
                <option value="viewer">Pouze čtení</option>
              </Select>
            </div>
            <Button type="submit">Pozvat</Button>
          </form>
        </CardContent>
      </Card>

      <section>
        <h2 className="font-semibold">Členové</h2>
        <ul className="mt-2 space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
            >
              <div>
                <p className="font-medium">{m.user.name ?? m.user.email}</p>
                <p className="text-xs text-slate-500">{labelRole(m.role)}</p>
              </div>
              {m.role !== "owner" && (
                <form action={removeMember.bind(null, projectId, m.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Odebrat
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>

      {invites.length > 0 && (
        <section>
          <h2 className="font-semibold">Čekající pozvánky</h2>
          <ul className="mt-2 text-sm text-slate-600">
            {invites.map((i) => (
              <li key={i.id}>
                {i.email} — {labelRole(i.role)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
