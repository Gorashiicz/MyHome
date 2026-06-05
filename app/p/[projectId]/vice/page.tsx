import Link from "next/link";
import { resolveProjectRoute } from "@/lib/project-context";
import { ThemeSettingsCard } from "@/components/theme/theme-settings-card";
import { SectionBanner } from "@/components/layout/section-banner";
import {
  Camera,
  CheckSquare,
  BookOpen,
  Users,
  AlertTriangle,
  Share2,
  Settings,
  ClipboardList,
  Flag,
} from "lucide-react";

const links = [
  { href: "milniky", label: "Milníky a kalendář", icon: Flag },
  { href: "checklisty", label: "Checklisty", icon: ClipboardList },
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
    <div className="space-y-6">
      <SectionBanner
        section="tools"
        title="Více"
        description="Fotky, deník, dodavatelé, checklisty a další nástroje"
      />

      <ThemeSettingsCard />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Nástroje
        </h2>
        <ul className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={`${base}/${href}`}
              className="app-list-link flex items-center gap-3 p-4"
            >
              <Icon className="app-list-link-icon h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          </li>
        ))}
        </ul>
      </section>
    </div>
  );
}
