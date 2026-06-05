import Link from "next/link";
import {
  Wallet,
  FileText,
  Camera,
  CheckSquare,
  BookOpen,
  AlertTriangle,
  FileUp,
} from "lucide-react";
import { resolveProjectRoute } from "@/lib/project-context";
import { SectionBanner } from "@/components/layout/section-banner";

const actions = [
  { href: "vydaj", label: "Přidat výdaj", icon: Wallet },
  { href: "faktura", label: "Přidat fakturu", icon: FileUp },
  { href: "fotka", label: "Přidat fotku", icon: Camera },
  { href: "ukol", label: "Přidat úkol", icon: CheckSquare },
  { href: "dokument", label: "Přidat dokument", icon: FileText },
  { href: "denik", label: "Záznam do deníku", icon: BookOpen },
  { href: "vada", label: "Přidat vadu", icon: AlertTriangle },
] as const;

export default async function QuickAddPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  await resolveProjectRoute(projectId);
  const base = `/p/${projectId}/pridat`;

  return (
    <div>
      <SectionBanner
        section="add"
        title="Přidat"
        description="Rychlý zápis na stavbě — výdaj, fotka, úkol nebo dokument"
      />
      <ul className="mt-2 grid gap-3 sm:grid-cols-2">
        {actions.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={`${base}/${href}`}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-emerald-400 hover:bg-emerald-50/50"
            >
              <Icon className="h-6 w-6 text-emerald-600" />
              <span className="font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
