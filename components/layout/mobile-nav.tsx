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

export function MobileNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/p/${projectId}`;
  const items = getProjectNavItems(base);

  return (
    <nav
      className="app-mobile-nav fixed bottom-0 left-0 right-0 z-50 pb-safe md:hidden"
      aria-label="Hlavní navigace"
    >
      <ul className="mx-auto flex max-w-lg items-stretch gap-1.5 px-2 py-2.5">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href, base);
          const Icon = item.icon;
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-2 text-center text-[11px] font-bold leading-tight transition-all active:scale-95",
                  navItemClasses(active)
                )}
              >
                <Icon
                  className={cn("h-5 w-5 shrink-0", navIconClasses(active))}
                  strokeWidth={2.5}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
