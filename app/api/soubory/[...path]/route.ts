import { auth } from "@/lib/auth";
import { serveFileByStoragePath } from "@/lib/serve-stored-file";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { path } = await params;
  const storagePath = path.join("/");

  return serveFileByStoragePath(storagePath, session.user.id);
}
