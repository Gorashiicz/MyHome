"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  getProjectNavItems,
  isNavItemActive,
  navItemClasses,
  navIconClasses,
} from "@/components/layout/project-nav-shared";

export function DesktopNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/p/${projectId}`;
  const items = getProjectNavItems(base);

  return (
    <nav
      className="hidden border-b-2 border-emerald-200 bg-emerald-50/80 md:block"
      aria-label="Hlavní navigace"
    >
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-3">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href, base);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all active:scale-[0.98]",
                navItemClasses(active)
              )}
            >
              <Icon
                className={cn("h-5 w-5 shrink-0", navIconClasses(active))}
                strokeWidth={2.5}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
