import Link from "next/link";
import { resolveProjectRoute } from "@/lib/project-context";
import {
  Camera,
  CheckSquare,
  BookOpen,
  Users,
  AlertTriangle,
  Share2,
  Settings,
} from "lucide-react";

const links = [
  { href: "fotky", label: "Fotky", icon: Camera },
  { href: "ukoly", label: "Úkoly", icon: CheckSquare },
  { href: "denik", label: "Stavební deník", icon: BookOpen },
  { href: "dodavatele", label: "Dodavatelé", icon: Users },
  { href: "vady", label: "Vady a reklamace", icon: AlertTriangle },
  { href: "sdileni", label: "Sdílení", icon: Share2 },
  { href: "nastaveni", label: "Nastavení", icon: Settings },
] as const;

export default async function MorePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const base = `/p/${projectId}`;

  return (
    <div>
      <h1 className="text-xl font-bold">Více</h1>
      <ul className="mt-6 space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={`${base}/${href}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-emerald-300"
            >
              <Icon className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
