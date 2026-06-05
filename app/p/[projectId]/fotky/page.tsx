import { createPhoto, deletePhoto } from "@/actions/photos";
import { resolveProjectRoute } from "@/lib/project-context";
import { prisma } from "@/lib/db";
import { getProjectAccess, requireUser } from "@/lib/permissions";
import { formatDate } from "@/lib/formatting";
import { PHOTO_TAG_SUGGESTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionPage } from "@/components/layout/section-banner";
import { fileDownloadUrl } from "@/lib/file-urls";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const user = await requireUser();
  const access = await getProjectAccess(projectId, user.id);
  const photos = await prisma.photo.findMany({
    where: { projectId },
    orderBy: { photoDate: "desc" },
  });

  return (
    <SectionPage
      section="projects"
      title="Fotky"
      description="Fotodokumentace stavby — důkazy před zakrytím, průběh prací"
      bodyClassName="space-y-6"
    >
      {access?.canEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nahrát fotku</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={createPhoto.bind(null, projectId)}
              className="space-y-3"
              encType="multipart/form-data"
            >
              <div>
                <Label htmlFor="file">Fotografie *</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="title">Název</Label>
                <Input id="title" name="title" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="stage">Etapa</Label>
                <Input id="stage" name="stage" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tags">Štítky (čárkou)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder={PHOTO_TAG_SUGGESTIONS.join(", ")}
                  className="mt-1"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="evidence" value="true" />
                Důkazní fotografie
              </label>
              <Button type="submit" className="w-full">
                Nahrát
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg border bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileDownloadUrl("photo", p.id)}
              alt={p.title ?? "Fotka"}
              className="aspect-square w-full object-cover"
            />
            <div className="p-2 text-xs">
              <p className="font-medium truncate">{p.title ?? "Bez názvu"}</p>
              <p className="text-slate-500">{formatDate(p.photoDate)}</p>
              {access?.canEdit && (
                <form action={deletePhoto.bind(null, projectId, p.id)} className="mt-1">
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Smazat
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionPage>
  );
}
